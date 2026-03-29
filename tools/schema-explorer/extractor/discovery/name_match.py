"""Technique 1-2: Match _ID columns to table names (exact and plural)."""
import logging
from ..connectors.base import TableInfo

logger = logging.getLogger(__name__)


def discover_by_name_match(tables: list[TableInfo]) -> list[dict]:
    """Find relationships where COLUMN_ID matches a table name.

    Technique 1: PRODUCT_ID → PRODUCT (exact)
    Technique 2: PRODUCT_ID → PRODUCTS (plural)
    """
    table_names = {t.name for t in tables}
    relationships = []

    for table in tables:
        for col in table.columns:
            if not col.name.endswith("_ID") or col.name == "ID":
                continue

            base = col.name[:-3]  # Remove _ID

            # Technique 1: exact match
            if base in table_names and base != table.name:
                relationships.append({
                    "from_table": table.name,
                    "from_column": col.name,
                    "to_table": base,
                    "to_column": col.name,
                    "confidence": 0.85,
                    "source": "name_match_exact",
                })
                continue

            # Technique 2: plural match (add S)
            plural = base + "S"
            if plural in table_names and plural != table.name:
                relationships.append({
                    "from_table": table.name,
                    "from_column": col.name,
                    "to_table": plural,
                    "to_column": col.name,
                    "confidence": 0.80,
                    "source": "name_match_plural",
                })

    logger.info("Name match: discovered %d relationships", len(relationships))
    return relationships
