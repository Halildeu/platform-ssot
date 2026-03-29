"""Base connector interface for database metadata extraction."""
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from typing import Optional


@dataclass
class ColumnInfo:
    name: str
    data_type: str
    max_length: int
    is_nullable: bool
    is_identity: bool
    is_pk: bool
    ordinal: int = 0


@dataclass
class TableInfo:
    name: str
    schema: str
    columns: list[ColumnInfo] = field(default_factory=list)
    row_count: Optional[int] = None
    table_type: str = "TABLE"  # TABLE or VIEW


@dataclass
class ConnectionConfig:
    host: str
    port: int
    database: str
    username: str
    password: str
    schema: Optional[str] = None
    extra_props: dict = field(default_factory=dict)


class BaseConnector(ABC):
    """Abstract base class for database connectors."""

    def __init__(self, config: ConnectionConfig):
        self.config = config

    @abstractmethod
    def test_connection(self) -> bool:
        """Test if the database is reachable."""

    @abstractmethod
    def extract_tables(self) -> list[TableInfo]:
        """Extract all tables with their columns."""

    @abstractmethod
    def extract_primary_keys(self) -> dict[str, list[str]]:
        """Return {table_name: [pk_column_names]}."""

    @abstractmethod
    def extract_foreign_keys(self) -> list[dict]:
        """Return explicit FK constraints if any."""

    @abstractmethod
    def extract_views(self) -> list[str]:
        """Return list of view names."""

    @abstractmethod
    def extract_view_definitions(self) -> dict[str, str]:
        """Return {view_name: sql_definition}."""

    @abstractmethod
    def extract_stored_procedures(self) -> dict[str, str]:
        """Return {sp_name: sql_definition}."""

    @abstractmethod
    def get_row_counts(self, tables: list[str]) -> dict[str, int]:
        """Return {table_name: row_count}."""
