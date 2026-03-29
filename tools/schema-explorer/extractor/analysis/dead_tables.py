"""Detect dead/orphan tables with zero relationships and zero references."""
import logging

logger = logging.getLogger(__name__)


def find_dead_tables(
    tables: list[dict],
    relationships: list[dict],
    row_counts: dict[str, int] | None = None,
) -> list[dict]:
    """Identify tables that are likely unused or orphaned.

    Criteria:
    - No outgoing FK relationships
    - No incoming references from other tables
    - Optionally: zero rows
    """
    # Build sets of tables involved in relationships
    tables_with_fk = {r["from_table"] for r in relationships}
    tables_referenced = {r["to_table"] for r in relationships}
    connected_tables = tables_with_fk | tables_referenced

    dead = []
    for table in tables:
        name = table["name"] if isinstance(table, dict) else table.name
        if name in connected_tables:
            continue

        info = {
            "table": name,
            "reason": "no_relationships",
            "row_count": None,
        }

        if row_counts and name in row_counts:
            info["row_count"] = row_counts[name]
            if row_counts[name] == 0:
                info["reason"] = "no_relationships+empty"

        dead.append(info)

    logger.info("Found %d dead/orphan tables out of %d total", len(dead), len(tables))
    return sorted(dead, key=lambda d: d["table"])
