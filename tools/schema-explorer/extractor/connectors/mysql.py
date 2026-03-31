"""MySQL connector using mysql-connector-python or PyMySQL."""
import logging
from typing import Optional

from .base import BaseConnector, ColumnInfo, ConnectionConfig, TableInfo

logger = logging.getLogger(__name__)

try:
    import mysql.connector
    HAS_MYSQL = True
except ImportError:
    try:
        import pymysql
        pymysql.install_as_MySQLdb()
        import MySQLdb as mysql_connector_fallback
        HAS_MYSQL = True
    except ImportError:
        HAS_MYSQL = False


class MysqlConnector(BaseConnector):
    """MySQL/MariaDB connector."""

    def __init__(self, config: ConnectionConfig):
        super().__init__(config)
        if not HAS_MYSQL:
            raise ImportError("mysql-connector-python or pymysql required: pip install mysql-connector-python")
        self.schema = config.schema or config.database
        self._conn = None

    def _get_conn(self):
        if self._conn is None:
            import mysql.connector
            self._conn = mysql.connector.connect(
                host=self.config.host,
                port=self.config.port,
                database=self.config.database,
                user=self.config.username,
                password=self.config.password,
                autocommit=True,
            )
        return self._conn

    def _query(self, sql: str, params: tuple = ()) -> list[tuple]:
        conn = self._get_conn()
        cursor = conn.cursor()
        cursor.execute(sql, params)
        rows = cursor.fetchall()
        cursor.close()
        return rows

    def test_connection(self) -> bool:
        try:
            result = self._query("SELECT 1")
            return len(result) > 0
        except Exception as e:
            logger.error("Connection test failed: %s", e)
            return False

    def extract_tables(self) -> list[TableInfo]:
        logger.info("Extracting tables from MySQL schema '%s'...", self.schema)
        rows = self._query("""
            SELECT t.TABLE_NAME, c.COLUMN_NAME, c.DATA_TYPE,
                   COALESCE(c.CHARACTER_MAXIMUM_LENGTH, c.NUMERIC_PRECISION, 0) AS max_length,
                   IF(c.IS_NULLABLE = 'YES', 1, 0) AS is_nullable,
                   IF(c.EXTRA LIKE '%%auto_increment%%', 1, 0) AS is_identity,
                   IF(c.COLUMN_KEY = 'PRI', 1, 0) AS is_pk,
                   c.ORDINAL_POSITION
            FROM information_schema.TABLES t
            JOIN information_schema.COLUMNS c ON t.TABLE_NAME = c.TABLE_NAME AND t.TABLE_SCHEMA = c.TABLE_SCHEMA
            WHERE t.TABLE_SCHEMA = %s AND t.TABLE_TYPE = 'BASE TABLE'
            ORDER BY t.TABLE_NAME, c.ORDINAL_POSITION
        """, (self.schema,))

        tables_dict: dict[str, TableInfo] = {}
        for row in rows:
            tbl_name = row[0]
            if tbl_name not in tables_dict:
                tables_dict[tbl_name] = TableInfo(name=tbl_name, schema=self.schema)
            tables_dict[tbl_name].columns.append(ColumnInfo(
                name=row[1], data_type=row[2], max_length=row[3] or 0,
                is_nullable=bool(row[4]), is_identity=bool(row[5]), is_pk=bool(row[6]),
                ordinal=row[7],
            ))

        logger.info("Extracted %d tables", len(tables_dict))
        return list(tables_dict.values())

    def extract_primary_keys(self) -> dict[str, list[str]]:
        rows = self._query("""
            SELECT TABLE_NAME, COLUMN_NAME
            FROM information_schema.KEY_COLUMN_USAGE
            WHERE TABLE_SCHEMA = %s AND CONSTRAINT_NAME = 'PRIMARY'
            ORDER BY TABLE_NAME
        """, (self.schema,))
        pks: dict[str, list[str]] = {}
        for tbl, col in rows:
            pks.setdefault(tbl, []).append(col)
        return pks

    def extract_foreign_keys(self) -> list[dict]:
        rows = self._query("""
            SELECT CONSTRAINT_NAME, TABLE_NAME, COLUMN_NAME,
                   REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME
            FROM information_schema.KEY_COLUMN_USAGE
            WHERE TABLE_SCHEMA = %s AND REFERENCED_TABLE_NAME IS NOT NULL
        """, (self.schema,))
        return [
            {"fk_name": r[0], "from_table": r[1], "from_column": r[2],
             "to_table": r[3], "to_column": r[4]}
            for r in rows
        ]

    def extract_views(self) -> list[str]:
        rows = self._query(
            "SELECT TABLE_NAME FROM information_schema.VIEWS WHERE TABLE_SCHEMA = %s",
            (self.schema,),
        )
        return [r[0] for r in rows]

    def extract_view_definitions(self) -> dict[str, str]:
        rows = self._query(
            "SELECT TABLE_NAME, VIEW_DEFINITION FROM information_schema.VIEWS WHERE TABLE_SCHEMA = %s",
            (self.schema,),
        )
        return {r[0]: r[1] or "" for r in rows}

    def extract_stored_procedures(self) -> dict[str, str]:
        rows = self._query("""
            SELECT ROUTINE_NAME, ROUTINE_DEFINITION
            FROM information_schema.ROUTINES
            WHERE ROUTINE_SCHEMA = %s
        """, (self.schema,))
        return {r[0]: r[1] or "" for r in rows}

    def get_row_counts(self, tables: list[str] = None) -> dict[str, int]:
        rows = self._query("""
            SELECT TABLE_NAME, TABLE_ROWS
            FROM information_schema.TABLES
            WHERE TABLE_SCHEMA = %s AND TABLE_TYPE = 'BASE TABLE'
        """, (self.schema,))
        return {r[0]: r[1] or 0 for r in rows}
