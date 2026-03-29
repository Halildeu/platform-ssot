"""SQL Server connector using subprocess + sqlcmd for zero-dependency extraction."""
import json
import logging
import subprocess
import shlex
from typing import Optional

from .base import BaseConnector, ColumnInfo, ConnectionConfig, TableInfo

logger = logging.getLogger(__name__)

# SQL Server metadata queries
QUERY_TABLES_COLUMNS = """
SELECT
    t.name AS table_name,
    c.name AS column_name,
    ty.name AS data_type,
    c.max_length,
    c.is_nullable,
    c.is_identity,
    CASE WHEN pk.column_id IS NOT NULL THEN 1 ELSE 0 END AS is_pk,
    c.column_id AS ordinal
FROM sys.tables t
JOIN sys.schemas s ON t.schema_id = s.schema_id
JOIN sys.columns c ON c.object_id = t.object_id
JOIN sys.types ty ON c.user_type_id = ty.user_type_id
LEFT JOIN (
    SELECT ic.object_id, ic.column_id
    FROM sys.index_columns ic
    JOIN sys.indexes i ON i.object_id = ic.object_id AND i.index_id = ic.index_id
    WHERE i.is_primary_key = 1
) pk ON pk.object_id = t.object_id AND pk.column_id = c.column_id
WHERE s.name = '{schema}'
ORDER BY t.name, c.column_id;
"""

QUERY_FOREIGN_KEYS = """
SELECT
    fk.name AS fk_name,
    tp.name AS parent_table,
    cp.name AS parent_column,
    tr.name AS referenced_table,
    cr.name AS referenced_column
FROM sys.foreign_keys fk
JOIN sys.foreign_key_columns fkc ON fk.object_id = fkc.constraint_object_id
JOIN sys.tables tp ON fkc.parent_object_id = tp.object_id
JOIN sys.columns cp ON fkc.parent_object_id = cp.object_id AND fkc.parent_column_id = cp.column_id
JOIN sys.tables tr ON fkc.referenced_object_id = tr.object_id
JOIN sys.columns cr ON fkc.referenced_object_id = cr.object_id AND fkc.referenced_column_id = cr.column_id
JOIN sys.schemas s ON tp.schema_id = s.schema_id
WHERE s.name = '{schema}'
ORDER BY tp.name;
"""

QUERY_VIEW_DEFINITIONS = """
SELECT o.name AS view_name, m.definition
FROM sys.sql_modules m
JOIN sys.objects o ON m.object_id = o.object_id
JOIN sys.schemas s ON o.schema_id = s.schema_id
WHERE o.type = 'V' AND s.name = '{schema}'
ORDER BY o.name;
"""

QUERY_SP_DEFINITIONS = """
SELECT o.name AS sp_name, m.definition
FROM sys.sql_modules m
JOIN sys.objects o ON m.object_id = o.object_id
JOIN sys.schemas s ON o.schema_id = s.schema_id
WHERE o.type IN ('P', 'FN', 'IF', 'TF') AND s.name = '{schema}'
ORDER BY o.name;
"""

QUERY_ROW_COUNTS = """
SELECT t.name AS table_name,
       SUM(p.rows) AS row_count
FROM sys.tables t
JOIN sys.schemas s ON t.schema_id = s.schema_id
JOIN sys.partitions p ON t.object_id = p.object_id AND p.index_id IN (0, 1)
WHERE s.name = '{schema}'
GROUP BY t.name
ORDER BY t.name;
"""

QUERY_ID_TO_TABLE = """
;WITH id_cols AS (
    SELECT DISTINCT c.name AS col_name,
           REPLACE(c.name, '_ID', '') AS base_name
    FROM sys.columns c
    JOIN sys.tables t ON c.object_id = t.object_id
    JOIN sys.schemas s ON t.schema_id = s.schema_id
    WHERE s.name = '{schema}'
      AND c.name LIKE '%[_]ID'
      AND c.name <> 'ID'
),
schema_tables AS (
    SELECT t.name AS table_name
    FROM sys.tables t
    JOIN sys.schemas s ON t.schema_id = s.schema_id
    WHERE s.name = '{schema}'
)
SELECT ic.col_name, st.table_name AS target_table
FROM id_cols ic
JOIN schema_tables st ON st.table_name = ic.base_name
    OR st.table_name = ic.base_name + 'S'
ORDER BY ic.col_name;
"""

QUERY_SHARED_COLUMNS = """
SELECT c.name AS col_name, COUNT(DISTINCT t.name) AS tbl_count,
       STRING_AGG(t.name, ',') WITHIN GROUP (ORDER BY t.name) AS tables
FROM sys.columns c
JOIN sys.tables t ON c.object_id = t.object_id
JOIN sys.schemas s ON t.schema_id = s.schema_id
WHERE s.name = '{schema}'
  AND c.name LIKE '%[_]ID'
GROUP BY c.name
HAVING COUNT(DISTINCT t.name) >= 3
ORDER BY tbl_count DESC;
"""


class MssqlConnector(BaseConnector):
    """SQL Server connector via sqlcmd Docker container."""

    def __init__(self, config: ConnectionConfig, use_docker: bool = True):
        super().__init__(config)
        self.use_docker = use_docker
        self.schema = config.schema or "dbo"
        self._skipped_tables: list[str] = []

    def _run_query(self, query: str, timeout: int = 300) -> str:
        """Execute SQL query via sqlcmd and return raw output."""
        formatted = query.format(schema=self.schema)

        if self.use_docker:
            cmd = [
                "docker", "run", "--rm", "--network", "host",
                "mcr.microsoft.com/mssql-tools:latest",
                "/opt/mssql-tools/bin/sqlcmd",
                "-S", f"{self.config.host},{self.config.port}",
                "-U", self.config.username,
                "-P", self.config.password,
                "-d", self.config.database,
                "-N", "-C", "-s|", "-W", "-h-1",
                "-Q", formatted,
            ]
        else:
            cmd = [
                "sqlcmd",
                "-S", f"{self.config.host},{self.config.port}",
                "-U", self.config.username,
                "-P", self.config.password,
                "-d", self.config.database,
                "-N", "-C", "-s|", "-W", "-h-1",
                "-Q", formatted,
            ]

        try:
            result = subprocess.run(
                cmd, capture_output=True, text=True, timeout=timeout
            )
            output = result.stdout
            # Filter warnings
            lines = [
                l for l in output.split("\n")
                if l.strip()
                and not l.startswith("WARNING")
                and "rows affected" not in l
                and not l.startswith("---")
            ]
            return "\n".join(lines)
        except subprocess.TimeoutExpired:
            logger.error("Query timed out after %ds", timeout)
            return ""
        except Exception as e:
            logger.error("Query failed: %s", e)
            return ""

    def _run_query_from_file(self, query: str, timeout: int = 300) -> str:
        """Execute query via temp file for complex queries with special chars."""
        import tempfile
        import os

        formatted = query.format(schema=self.schema)
        with tempfile.NamedTemporaryFile(
            mode="w", suffix=".sql", delete=False, encoding="utf-8"
        ) as f:
            f.write(formatted)
            tmp_path = f.name

        try:
            if self.use_docker:
                cmd = [
                    "docker", "run", "--rm", "--network", "host",
                    "-v", f"{tmp_path}:/query.sql",
                    "mcr.microsoft.com/mssql-tools:latest",
                    "/opt/mssql-tools/bin/sqlcmd",
                    "-S", f"{self.config.host},{self.config.port}",
                    "-U", self.config.username,
                    "-P", self.config.password,
                    "-d", self.config.database,
                    "-N", "-C", "-s|", "-W", "-h-1",
                    "-i", "/query.sql",
                ]
            else:
                cmd = [
                    "sqlcmd",
                    "-S", f"{self.config.host},{self.config.port}",
                    "-U", self.config.username,
                    "-P", self.config.password,
                    "-d", self.config.database,
                    "-N", "-C", "-s|", "-W", "-h-1",
                    "-i", tmp_path,
                ]

            result = subprocess.run(
                cmd, capture_output=True, text=True, timeout=timeout
            )
            output = result.stdout
            lines = [
                l for l in output.split("\n")
                if l.strip()
                and not l.startswith("WARNING")
                and "rows affected" not in l
                and not l.startswith("---")
            ]
            return "\n".join(lines)
        finally:
            os.unlink(tmp_path)

    def test_connection(self) -> bool:
        result = self._run_query("SELECT 1 AS ok", timeout=15)
        return "1" in result

    def extract_tables(self) -> list[TableInfo]:
        logger.info("Extracting tables and columns from schema '%s'...", self.schema)
        raw = self._run_query_from_file(QUERY_TABLES_COLUMNS, timeout=600)
        if not raw:
            return []

        tables_dict: dict[str, TableInfo] = {}
        for line in raw.split("\n"):
            parts = line.split("|")
            if len(parts) < 8:
                continue
            tbl_name = parts[0].strip()
            if not tbl_name:
                continue

            if tbl_name not in tables_dict:
                tables_dict[tbl_name] = TableInfo(
                    name=tbl_name, schema=self.schema
                )

            col = ColumnInfo(
                name=parts[1].strip(),
                data_type=parts[2].strip(),
                max_length=int(parts[3].strip()) if parts[3].strip().isdigit() else 0,
                is_nullable=parts[4].strip() == "1",
                is_identity=parts[5].strip() == "1",
                is_pk=parts[6].strip() == "1",
                ordinal=int(parts[7].strip()) if parts[7].strip().isdigit() else 0,
            )
            tables_dict[tbl_name].columns.append(col)

        logger.info(
            "Extracted %d tables, %d columns",
            len(tables_dict),
            sum(len(t.columns) for t in tables_dict.values()),
        )
        return list(tables_dict.values())

    def extract_primary_keys(self) -> dict[str, list[str]]:
        # Already extracted in extract_tables via is_pk flag
        return {}

    def extract_foreign_keys(self) -> list[dict]:
        logger.info("Extracting explicit FK constraints...")
        raw = self._run_query_from_file(QUERY_FOREIGN_KEYS, timeout=120)
        fks = []
        for line in raw.split("\n"):
            parts = line.split("|")
            if len(parts) < 5:
                continue
            fks.append({
                "fk_name": parts[0].strip(),
                "from_table": parts[1].strip(),
                "from_column": parts[2].strip(),
                "to_table": parts[3].strip(),
                "to_column": parts[4].strip(),
            })
        logger.info("Found %d explicit FK constraints", len(fks))
        return fks

    def extract_views(self) -> list[str]:
        raw = self._run_query(
            "SELECT name FROM sys.views v JOIN sys.schemas s ON v.schema_id = s.schema_id WHERE s.name = '{schema}' ORDER BY name"
        )
        return [l.strip() for l in raw.split("\n") if l.strip()]

    def extract_view_definitions(self) -> dict[str, str]:
        logger.info("Extracting view definitions...")
        raw = self._run_query_from_file(QUERY_VIEW_DEFINITIONS, timeout=300)
        views = {}
        for line in raw.split("\n"):
            parts = line.split("|", 1)
            if len(parts) == 2 and parts[0].strip():
                views[parts[0].strip()] = parts[1].strip()
        logger.info("Extracted %d view definitions", len(views))
        return views

    def extract_stored_procedures(self) -> dict[str, str]:
        logger.info("Extracting stored procedure definitions...")
        raw = self._run_query_from_file(QUERY_SP_DEFINITIONS, timeout=300)
        sps = {}
        for line in raw.split("\n"):
            parts = line.split("|", 1)
            if len(parts) == 2 and parts[0].strip():
                sps[parts[0].strip()] = parts[1].strip()
        logger.info("Extracted %d SP/function definitions", len(sps))
        return sps

    def get_row_counts(self, tables: list[str] = None) -> dict[str, int]:
        logger.info("Extracting row counts...")
        raw = self._run_query_from_file(QUERY_ROW_COUNTS, timeout=120)
        counts = {}
        for line in raw.split("\n"):
            parts = line.split("|")
            if len(parts) >= 2 and parts[1].strip().isdigit():
                counts[parts[0].strip()] = int(parts[1].strip())
        return counts

    def extract_id_to_table_matches(self) -> list[tuple[str, str]]:
        """Return [(column_name, target_table)] for _ID → table name matches."""
        logger.info("Running _ID → table name matching...")
        raw = self._run_query_from_file(QUERY_ID_TO_TABLE, timeout=120)
        matches = []
        for line in raw.split("\n"):
            parts = line.split("|")
            if len(parts) >= 2 and parts[0].strip() and parts[1].strip():
                matches.append((parts[0].strip(), parts[1].strip()))
        logger.info("Found %d _ID → table matches", len(matches))
        return matches

    def extract_shared_columns(self) -> list[dict]:
        """Return columns that appear in 3+ tables."""
        logger.info("Finding shared columns...")
        raw = self._run_query_from_file(QUERY_SHARED_COLUMNS, timeout=120)
        results = []
        for line in raw.split("\n"):
            parts = line.split("|")
            if len(parts) >= 3 and parts[1].strip().isdigit():
                results.append({
                    "column": parts[0].strip(),
                    "table_count": int(parts[1].strip()),
                    "tables": parts[2].strip().split(","),
                })
        return results
