"""Automatic domain detection using Louvain community detection on relationship graph."""
import logging
from collections import Counter, defaultdict

logger = logging.getLogger(__name__)

try:
    import networkx as nx
    from networkx.algorithms.community import louvain_communities
    HAS_NETWORKX = True
except ImportError:
    HAS_NETWORKX = False


def detect_domains(
    tables: list[dict],
    relationships: list[dict],
    min_domain_size: int = 3,
) -> dict[str, list[str]]:
    """Detect domain clusters from relationship graph using Louvain algorithm.

    Falls back to prefix-based grouping if networkx is not available.

    Returns: {domain_label: [table_names]}
    """
    table_names = {t["name"] if isinstance(t, dict) else t.name for t in tables}

    if HAS_NETWORKX and len(relationships) > 0:
        return _louvain_clustering(table_names, relationships, min_domain_size)
    else:
        logger.info("networkx not available or no relationships, using prefix-based grouping")
        return _prefix_clustering(table_names, min_domain_size)


def _louvain_clustering(
    table_names: set[str],
    relationships: list[dict],
    min_domain_size: int,
) -> dict[str, list[str]]:
    """Use Louvain community detection on the relationship graph."""
    G = nx.Graph()
    G.add_nodes_from(table_names)

    for rel in relationships:
        ft = rel["from_table"]
        tt = rel["to_table"]
        if ft in table_names and tt in table_names:
            weight = rel.get("confidence", 0.5)
            if G.has_edge(ft, tt):
                G[ft][tt]["weight"] += weight
            else:
                G.add_edge(ft, tt, weight=weight)

    # Run Louvain
    communities = louvain_communities(G, resolution=1.0, seed=42)
    logger.info("Louvain detected %d communities", len(communities))

    # Label each community
    domains = {}
    other_tables = []

    for i, community in enumerate(sorted(communities, key=len, reverse=True)):
        tables_in_community = sorted(community)

        if len(tables_in_community) < min_domain_size:
            other_tables.extend(tables_in_community)
            continue

        label = _label_community(tables_in_community)
        domains[label] = tables_in_community

    if other_tables:
        domains["OTHER"] = sorted(other_tables)

    # Add isolated nodes (no relationships)
    all_assigned = set()
    for tbls in domains.values():
        all_assigned.update(tbls)
    isolated = table_names - all_assigned
    if isolated:
        domains.setdefault("ISOLATED", []).extend(sorted(isolated))

    logger.info(
        "Domain clustering: %d domains, %d tables assigned, %d isolated",
        len(domains), len(all_assigned), len(isolated),
    )
    return domains


def _prefix_clustering(
    table_names: set[str],
    min_domain_size: int,
) -> dict[str, list[str]]:
    """Simple fallback: group by table name prefix."""
    KNOWN_PREFIXES = [
        "SETUP", "EMPLOYEES", "EMPLOYEE", "COMPANY", "CONSUMER", "ASSET",
        "TRAINING", "PRO", "BUDGET", "EVENT", "SURVEY", "CONTENT", "WRK",
        "GDPR", "REFINERY", "POS", "SUBSCRIPTION", "CAMPAIGN", "CATALOG",
        "ORDER", "OFFER", "PRICE", "PRODUCT", "MAIL", "SERVICE",
        "PROTEIN", "PROGRESS", "CONTRACT", "INVOICE", "CHEQUE",
        "ORGANIZATION", "CREDIT", "PAYROLL", "STOCK", "BANK",
    ]

    domains: dict[str, list[str]] = defaultdict(list)
    for tbl in sorted(table_names):
        assigned = False
        for prefix in KNOWN_PREFIXES:
            if tbl.startswith(prefix + "_") or tbl == prefix:
                domains[prefix].append(tbl)
                assigned = True
                break
        if not assigned:
            domains["OTHER"].append(tbl)

    # Merge small domains into OTHER
    final = {}
    for label, tbls in domains.items():
        if len(tbls) >= min_domain_size:
            final[label] = tbls
        else:
            final.setdefault("OTHER", []).extend(tbls)

    return final


def _label_community(tables: list[str]) -> str:
    """Generate a meaningful label for a community based on common prefixes."""
    # Count first-word prefixes
    prefixes = Counter()
    for tbl in tables:
        parts = tbl.split("_")
        if parts:
            prefixes[parts[0]] += 1

    if not prefixes:
        return "UNKNOWN"

    # Use the most common prefix
    top_prefix, top_count = prefixes.most_common(1)[0]
    coverage = top_count / len(tables)

    if coverage >= 0.4:
        return top_prefix
    elif len(prefixes) <= 3:
        return "+".join(p for p, _ in prefixes.most_common(3))
    else:
        return top_prefix
