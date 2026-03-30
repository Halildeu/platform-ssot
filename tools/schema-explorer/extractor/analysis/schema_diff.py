"""Schema diff — compare two snapshots and report changes."""
import json
import logging
from datetime import datetime, timezone

logger = logging.getLogger(__name__)


def diff_snapshots(old_path: str, new_path: str) -> dict:
    """Compare two schema_snapshot.json files and return a diff report.

    Args:
        old_path: Path to the older snapshot
        new_path: Path to the newer snapshot

    Returns:
        Diff report with added/removed/modified tables and columns.
    """
    with open(old_path, "r") as f:
        old = json.load(f)
    with open(new_path, "r") as f:
        new = json.load(f)

    old_tables = set(old.get("tables", {}).keys())
    new_tables = set(new.get("tables", {}).keys())

    added_tables = sorted(new_tables - old_tables)
    removed_tables = sorted(old_tables - new_tables)
    common_tables = old_tables & new_tables

    # Column-level changes
    modified_tables = []
    for tbl in sorted(common_tables):
        old_cols = {c["name"]: c for c in old["tables"][tbl].get("columns", [])}
        new_cols = {c["name"]: c for c in new["tables"][tbl].get("columns", [])}

        added_cols = sorted(set(new_cols) - set(old_cols))
        removed_cols = sorted(set(old_cols) - set(new_cols))

        # Type changes
        type_changes = []
        for col_name in sorted(set(old_cols) & set(new_cols)):
            old_type = old_cols[col_name].get("type", "")
            new_type = new_cols[col_name].get("type", "")
            if old_type != new_type:
                type_changes.append({
                    "column": col_name,
                    "old_type": old_type,
                    "new_type": new_type,
                })

        if added_cols or removed_cols or type_changes:
            modified_tables.append({
                "table": tbl,
                "added_columns": added_cols,
                "removed_columns": removed_cols,
                "type_changes": type_changes,
            })

    # Relationship changes
    old_rels = {(r["from_table"], r["from_column"], r["to_table"]) for r in old.get("relationships", [])}
    new_rels = {(r["from_table"], r["from_column"], r["to_table"]) for r in new.get("relationships", [])}

    added_rels = [{"from": r[0], "column": r[1], "to": r[2]} for r in sorted(new_rels - old_rels)]
    removed_rels = [{"from": r[0], "column": r[1], "to": r[2]} for r in sorted(old_rels - new_rels)]

    report = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "old_snapshot": old.get("metadata", {}).get("extracted_at", "unknown"),
        "new_snapshot": new.get("metadata", {}).get("extracted_at", "unknown"),
        "summary": {
            "tables_added": len(added_tables),
            "tables_removed": len(removed_tables),
            "tables_modified": len(modified_tables),
            "relationships_added": len(added_rels),
            "relationships_removed": len(removed_rels),
        },
        "added_tables": added_tables,
        "removed_tables": removed_tables,
        "modified_tables": modified_tables,
        "added_relationships": added_rels,
        "removed_relationships": removed_rels,
    }

    logger.info(
        "Schema diff: +%d/-%d tables, %d modified, +%d/-%d relationships",
        len(added_tables), len(removed_tables), len(modified_tables),
        len(added_rels), len(removed_rels),
    )

    return report


if __name__ == "__main__":
    import sys
    if len(sys.argv) != 3:
        print("Usage: python schema_diff.py <old_snapshot.json> <new_snapshot.json>")
        sys.exit(1)

    result = diff_snapshots(sys.argv[1], sys.argv[2])
    print(json.dumps(result, indent=2, ensure_ascii=False))
