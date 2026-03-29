"""Detect missing indexes on discovered FK columns."""
import logging

logger = logging.getLogger(__name__)


def find_missing_indexes(
    relationships: list[dict],
    indexed_columns: dict[str, set[str]] | None = None,
) -> list[dict]:
    """Find FK columns that likely need an index but don't have one.

    Args:
        relationships: discovered relationships
        indexed_columns: {table_name: {indexed_column_names}} - if None, skip check
    """
    if indexed_columns is None:
        return []

    hints = []
    for rel in relationships:
        from_tbl = rel["from_table"]
        from_col = rel["from_column"]

        if from_tbl in indexed_columns:
            if from_col not in indexed_columns[from_tbl]:
                hints.append({
                    "table": from_tbl,
                    "column": from_col,
                    "references": rel["to_table"],
                    "severity": "high" if rel.get("confidence", 0) > 0.9 else "medium",
                    "suggestion": f"CREATE INDEX IX_{from_tbl}_{from_col} ON {from_tbl}({from_col})",
                })

    logger.info("Found %d missing index hints", len(hints))
    return hints
