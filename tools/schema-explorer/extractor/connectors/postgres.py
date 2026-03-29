"""PostgreSQL connector using psycopg2."""
import logging
from typing import Optional

from .base import BaseConnector, ColumnInfo, ConnectionConfig, TableInfo

logger = logging.getLogger(__name__)

try:
    import psycopg2
    import psycopg2.extras
    HAS_PSYCOPG2 = True
except ImportError:
    HAS_PSYCOPG2 = False


class PostgresConnector(BaseConnector):
    """PostgreSQL connector via psycopg2."""

    def __init__(self, config: ConnectionConfig):
        super().__init__(config)
        if not HAS_PSYCOPG2:
            raise ImportError("psycopg2 required: pip install psycopg2-binary")
        self.schema = config.schema or "public"
        self._conn = None

    def _get_conn(self):
        if self._conn is None or self._conn.closed:
            self._conn = psycopg2.connect(
                host=self.config.host,
                port=self.config.port,
                dbname=self.config.database,
                user=self.config.username,
                password=self.config.password,
            )
            self._conn.set_session(readonly=True, autocommit=True)
        return self._conn

    def _query(self, sql: str, params: tuple = ()) -> list[tuple]:
        conn = self._get_conn()
        with conn.cursor() as cur:
            cur.execute(sql, params)
            return cur.fetchall()

    def test_connection(self) -> bool:
        try:
            result = self._query("SELECT 1")
            return len(result) > 0
        except Exception as e:
            logger.error("Connection test failed: %s", e)
            return False

    def extract_tables(self) -> list[TableInfo]:
        logger.info("Extracting tables from schema '%s'...", self.schema)
        rows = self._query("""
            SELECT t.table_name, c.column_name, c.data_type,
                   COALESCE(c.character_maximum_length, c.numeric_precision, 0) AS max_length,
                   CASE WHEN c.is_nullable = 'YES' THEN true ELSE false END AS is_nullable,
                   CASE WHEN c.column_default LIKE 'nextval%%' THEN true ELSE false END AS is_identity,
                   CASE WHEN tc.constraint_type = 'PRIMARY KEY' THEN true ELSE false END AS is_pk,
                   c.ordinal_position
            FROM information_schema.tables t
            JOIN information_schema.columns c ON t.table_name = c.table_name AND t.table_schema = c.table_schema
            LEFT JOIN information_schema.key_column_usage kcu
                ON kcu.table_schema = c.table_schema AND kcu.table_name = c.table_name AND kcu.column_name = c.column_name
            LEFT JOIN information_schema.table_constraints tc
                ON tc.constraint_name = kcu.constraint_name AND tc.table_schema = kcu.table_schema AND tc.constraint_type = 'PRIMARY KEY'
            WHERE t.table_schema = %s AND t.table_type = 'BASE TABLE'
            ORDER BY t.table_name, c.ordinal_position
        """, (self.schema,))

        tables_dict: dict[str, TableInfo] = {}
        for row in rows:
            tbl_name = row[0]
            if tbl_name not in tables_dict:
                tables_dict[tbl_name] = TableInfo(name=tbl_name, schema=self.schema)
            tables_dict[tbl_name].columns.append(ColumnInfo(
                name=row[1], data_type=row[2], max_length=row[3] or 0,
                is_nullable=row[4], is_identity=row[5], is_pk=row[6],
                ordinal=row[7],
            ))

        logger.info("Extracted %d tables", len(tables_dict))
        return list(tables_dict.values())

    def extract_primary_keys(self) -> dict[str, list[str]]:
        rows = self._query("""
            SELECT kcu.table_name, kcu.column_name
            FROM information_schema.table_constraints tc
            JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
            WHERE tc.table_schema = %s AND tc.constraint_type = 'PRIMARY KEY'
            ORDER BY kcu.table_name
        """, (self.schema,))
        pks: dict[str, list[str]] = {}
        for tbl, col in rows:
            pks.setdefault(tbl, []).append(col)
        return pks

    def extract_foreign_keys(self) -> list[dict]:
        rows = self._query("""
            SELECT tc.constraint_name, kcu.table_name, kcu.column_name,
                   ccu.table_name AS referenced_table, ccu.column_name AS referenced_column
            FROM information_schema.table_constraints tc
            JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
            JOIN information_schema.constraint_column_usage ccu ON tc.constraint_name = ccu.constraint_name
            WHERE tc.table_schema = %s AND tc.constraint_type = 'FOREIGN KEY'
        """, (self.schema,))
        return [
            {"fk_name": r[0], "from_table": r[1], "from_column": r[2],
             "to_table": r[3], "to_column": r[4]}
            for r in rows
        ]

    def extract_views(self) -> list[str]:
        rows = self._query(
            "SELECT table_name FROM information_schema.views WHERE table_schema = %s",
            (self.schema,),
        )
        return [r[0] for r in rows]

    def extract_view_definitions(self) -> dict[str, str]:
        rows = self._query(
            "SELECT table_name, view_definition FROM information_schema.views WHERE table_schema = %s",
            (self.schema,),
        )
        return {r[0]: r[1] or "" for r in rows}

    def extract_stored_procedures(self) -> dict[str, str]:
        rows = self._query("""
            SELECT routine_name, routine_definition
            FROM information_schema.routines
            WHERE routine_schema = %s AND routine_type = 'FUNCTION'
        """, (self.schema,))
        return {r[0]: r[1] or "" for r in rows}

    def get_row_counts(self, tables: list[str] = None) -> dict[str, int]:
        rows = self._query("""
            SELECT relname, n_live_tup
            FROM pg_stat_user_tables
            WHERE schemaname = %s
        """, (self.schema,))
        return {r[0]: r[1] for r in rows}
