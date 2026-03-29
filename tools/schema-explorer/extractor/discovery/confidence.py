"""Confidence scoring and relationship deduplication."""
import logging
from collections import defaultdict

logger = logging.getLogger(__name__)

# Source weights for confidence boosting
SOURCE_WEIGHTS = {
    "explicit_fk": 1.0,
    "name_match_exact": 0.85,
    "name_match_plural": 0.80,
    "alias_pattern": 0.90,
    "common_fk": 0.92,
    "cross_schema": 0.88,
    "data_overlap": 0.95,
    "view_parse": 0.88,
}


def deduplicate_and_score(all_relationships: list[dict]) -> list[dict]:
    """Merge relationships from multiple sources, boost confidence for multi-source matches.

    If the same (from_table, from_column, to_table) pair is found by multiple
    techniques, boost the confidence score.
    """
    grouped: dict[tuple, list[dict]] = defaultdict(list)

    for rel in all_relationships:
        key = (rel["from_table"], rel["from_column"], rel["to_table"])
        grouped[key].append(rel)

    deduped = []
    for key, rels in grouped.items():
        # Take the highest confidence
        best = max(rels, key=lambda r: r.get("confidence", 0))

        # Boost if multiple sources agree
        sources = list({r["source"].split(":")[0] for r in rels})
        if len(sources) > 1:
            # Multi-source agreement: boost confidence
            best["confidence"] = min(1.0, best["confidence"] + 0.05 * (len(sources) - 1))
            best["source"] = "+".join(sorted(sources))
            best["multi_source"] = True
        else:
            best["multi_source"] = False

        deduped.append(best)

    logger.info(
        "Deduplication: %d raw → %d unique relationships (%.0f%% multi-source)",
        len(all_relationships),
        len(deduped),
        100 * sum(1 for r in deduped if r.get("multi_source")) / max(len(deduped), 1),
    )
    return sorted(deduped, key=lambda r: (-r["confidence"], r["from_table"]))
