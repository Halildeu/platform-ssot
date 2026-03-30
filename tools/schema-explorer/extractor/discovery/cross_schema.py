"""Technique 4: Cross-schema PK→FK matching.

Finds relationships between tables in different schemas — e.g., a company-specific
schema referencing master tables in the shared schema.
"""
import logging
from ..connectors.base import TableInfo

logger = logging.getLogger(__name__)


def discover_cross_schema(
    child_tables: list[TableInfo],
    master_tables: list[TableInfo],
) -> list[dict]:
    """Find FK relationships from child schema tables to master schema PKs.

    Args:
        child_tables: Tables in the company/yearly schema
        master_tables: Tables in the shared master schema
    """
    # Build master PK index: {pk_column_name: table_name}
    master_pk_index: dict[str, str] = {}
    for table in master_tables:
        for col in table.columns:
            if col.is_pk:
                master_pk_index[col.name] = table.name

    # Also index by table_name + "_ID" pattern
    master_name_index: dict[str, str] = {}
    for table in master_tables:
        # COMPANY -> COMPANY_ID
        master_name_index[table.name + "_ID"] = table.name
        # EMPLOYEES -> EMPLOYEE_ID
        if table.name.endswith("S"):
            master_name_index[table.name[:-1] + "_ID"] = table.name

    relationships = []
    child_table_names = {t.name for t in child_tables}

    for table in child_tables:
        for col in table.columns:
            if not col.name.endswith("_ID"):
                continue

            # Check if this column matches a master PK
            target = master_pk_index.get(col.name) or master_name_index.get(col.name)
            if target and target not in child_table_names:
                relationships.append({
                    "from_table": table.name,
                    "from_column": col.name,
                    "to_table": target,
                    "to_column": col.name,
                    "confidence": 0.88,
                    "source": "cross_schema",
                })

    logger.info(
        "Cross-schema: discovered %d relationships (%d child → %d master tables)",
        len(relationships), len(child_tables), len(master_tables),
    )
    return relationships
