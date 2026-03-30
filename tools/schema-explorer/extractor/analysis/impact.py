"""Impact analysis — trace what tables are affected when a column/table changes."""
import logging
from collections import defaultdict

logger = logging.getLogger(__name__)


def analyze_impact(
    target_table: str,
    relationships: list[dict],
    max_hops: int = 3,
) -> dict:
    """Compute impact analysis: what tables are affected if target_table changes.

    Uses BFS to traverse the relationship graph outward from the target table.

    Args:
        target_table: The table being modified
        relationships: All discovered relationships
        max_hops: Maximum depth to traverse (default: 3)

    Returns:
        {
            "table": target_table,
            "hops": max_hops,
            "affected": [
                {"table": "X", "hop": 1, "via_column": "FK_COL", "relationship": "direct"},
                {"table": "Y", "hop": 2, "via_column": "FK_COL", "relationship": "indirect"},
            ],
            "impact_score": 0.85,  # 0-1, based on number of affected tables
        }
    """
    # Build adjacency lists (both directions)
    outgoing = defaultdict(list)  # table → tables that reference it
    incoming = defaultdict(list)  # table → tables it references

    for rel in relationships:
        outgoing[rel["to_table"]].append({
            "table": rel["from_table"],
            "column": rel["from_column"],
            "confidence": rel.get("confidence", 0.5),
        })
        incoming[rel["from_table"]].append({
            "table": rel["to_table"],
            "column": rel["from_column"],
            "confidence": rel.get("confidence", 0.5),
        })

    # BFS from target table
    visited = {target_table}
    affected = []
    frontier = [(target_table, 0)]

    while frontier:
        current_table, current_hop = frontier.pop(0)
        if current_hop >= max_hops:
            continue

        # Tables that reference current_table (downstream impact)
        for ref in outgoing.get(current_table, []):
            if ref["table"] not in visited:
                visited.add(ref["table"])
                affected.append({
                    "table": ref["table"],
                    "hop": current_hop + 1,
                    "via_column": ref["column"],
                    "direction": "downstream",
                    "confidence": ref["confidence"],
                })
                frontier.append((ref["table"], current_hop + 1))

        # Tables that current_table references (upstream impact)
        for ref in incoming.get(current_table, []):
            if ref["table"] not in visited:
                visited.add(ref["table"])
                affected.append({
                    "table": ref["table"],
                    "hop": current_hop + 1,
                    "via_column": ref["column"],
                    "direction": "upstream",
                    "confidence": ref["confidence"],
                })
                frontier.append((ref["table"], current_hop + 1))

    # Compute impact score (0-1)
    all_tables = {r["from_table"] for r in relationships} | {r["to_table"] for r in relationships}
    impact_score = len(affected) / max(len(all_tables), 1)

    # Sort by hop, then confidence
    affected.sort(key=lambda a: (a["hop"], -a["confidence"]))

    logger.info(
        "Impact analysis for '%s': %d affected tables across %d hops (score: %.2f)",
        target_table, len(affected), max_hops, impact_score,
    )

    return {
        "table": target_table,
        "hops": max_hops,
        "affected_count": len(affected),
        "affected": affected,
        "impact_score": round(impact_score, 3),
        "by_hop": {
            hop: [a for a in affected if a["hop"] == hop]
            for hop in range(1, max_hops + 1)
        },
    }


def find_critical_paths(
    relationships: list[dict],
    top_n: int = 10,
) -> list[dict]:
    """Find tables whose modification would have the highest impact.

    Returns the top N tables sorted by impact score.
    """
    all_tables = {r["from_table"] for r in relationships} | {r["to_table"] for r in relationships}

    results = []
    for table in all_tables:
        impact = analyze_impact(table, relationships, max_hops=2)
        results.append({
            "table": table,
            "affected_count": impact["affected_count"],
            "impact_score": impact["impact_score"],
        })

    results.sort(key=lambda r: -r["impact_score"])
    return results[:top_n]
