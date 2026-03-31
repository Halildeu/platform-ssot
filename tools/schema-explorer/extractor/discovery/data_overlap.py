"""Technique 5: Data overlap validation using Jaccard containment score.

Validates candidate FK relationships by comparing actual data values.
If column A's distinct values are a subset of column B's distinct values,
the FK relationship is confirmed with high confidence.
"""
import logging
from typing import Callable

logger = logging.getLogger(__name__)


def validate_by_data_overlap(
    candidate_relationships: list[dict],
    query_fn: Callable[[str], list],
    schema: str,
    sample_size: int = 1000,
    min_containment: float = 0.90,
) -> list[dict]:
    """Validate candidate relationships by checking data value overlap.

    Args:
        candidate_relationships: List of candidate FK relationships to validate
        query_fn: Function that executes SQL and returns results.
                  Signature: query_fn(sql: str) -> list[tuple]
        schema: Schema name for qualified table references
        sample_size: Number of distinct values to sample per column
        min_containment: Minimum containment score to confirm relationship (0-1)

    Returns:
        Validated relationships with updated confidence scores.
    """
    validated = []

    for rel in candidate_relationships:
        from_table = rel["from_table"]
        from_col = rel["from_column"]
        to_table = rel["to_table"]
        to_col = rel["to_column"]

        try:
            containment = _compute_containment(
                query_fn, schema,
                from_table, from_col,
                to_table, to_col,
                sample_size,
            )

            if containment is None:
                # Query failed, keep original confidence
                validated.append(rel)
                continue

            if containment >= min_containment:
                validated.append({
                    **rel,
                    "confidence": min(1.0, rel.get("confidence", 0.5) + 0.10),
                    "source": rel.get("source", "") + "+data_overlap",
                    "containment_score": containment,
                })
                logger.debug(
                    "  %s.%s → %s.%s: containment=%.2f ✓",
                    from_table, from_col, to_table, to_col, containment,
                )
            else:
                # Low containment — reduce confidence
                validated.append({
                    **rel,
                    "confidence": max(0.1, rel.get("confidence", 0.5) - 0.15),
                    "containment_score": containment,
                })
                logger.debug(
                    "  %s.%s → %s.%s: containment=%.2f ✗ (below threshold)",
                    from_table, from_col, to_table, to_col, containment,
                )

        except Exception as e:
            logger.warning(
                "Data overlap check failed for %s.%s → %s.%s: %s",
                from_table, from_col, to_table, to_col, e,
            )
            validated.append(rel)

    confirmed = sum(1 for r in validated if r.get("containment_score", 0) >= min_containment)
    logger.info(
        "Data overlap: validated %d/%d relationships (%.0f%% confirmed)",
        confirmed, len(candidate_relationships),
        100 * confirmed / max(len(candidate_relationships), 1),
    )
    return validated


def _compute_containment(
    query_fn, schema: str,
    from_table: str, from_col: str,
    to_table: str, to_col: str,
    sample_size: int,
) -> float | None:
    """Compute containment score: |A ∩ B| / |A|.

    Returns None if query fails.
    """
    sql = f"""
    SELECT
        (SELECT COUNT(*) FROM (
            SELECT DISTINCT TOP {sample_size} [{from_col}]
            FROM [{schema}].[{from_table}]
            WHERE [{from_col}] IS NOT NULL
        ) a) AS total_a,
        (SELECT COUNT(*) FROM (
            SELECT DISTINCT TOP {sample_size} [{from_col}]
            FROM [{schema}].[{from_table}]
            WHERE [{from_col}] IS NOT NULL
            AND [{from_col}] IN (
                SELECT DISTINCT [{to_col}]
                FROM [{schema}].[{to_table}]
                WHERE [{to_col}] IS NOT NULL
            )
        ) b) AS overlap
    """

    try:
        result = query_fn(sql)
        if result and len(result) > 0:
            total_a = result[0][0] if isinstance(result[0], (list, tuple)) else 0
            overlap = result[0][1] if isinstance(result[0], (list, tuple)) else 0
            if total_a == 0:
                return None
            return overlap / total_a
    except Exception:
        return None

    return None
