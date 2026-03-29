"""Technique 7: Parse stored procedures and views for JOIN patterns."""
import logging
import re

logger = logging.getLogger(__name__)

# Regex to match JOIN clauses: TABLE_A.COL = TABLE_B.COL
JOIN_PATTERN = re.compile(
    r"(?:JOIN|FROM)\s+"
    r"(?:\[?[\w.]+\]?\.)?(?:\[?(\w+)\]?)\s+"
    r"(?:AS\s+)?(\w+)?\s+"
    r".*?ON\s+"
    r"(?:\[?)?(\w+)(?:\]?)\.(?:\[?)?(\w+)(?:\]?)"
    r"\s*=\s*"
    r"(?:\[?)?(\w+)(?:\]?)\.(?:\[?)?(\w+)(?:\]?)",
    re.IGNORECASE | re.DOTALL,
)

# Simpler pattern for direct TABLE.COL = TABLE.COL
SIMPLE_JOIN = re.compile(
    r"(\w+)\.(\w+)\s*=\s*(\w+)\.(\w+)",
    re.IGNORECASE,
)


def discover_from_sql_definitions(
    definitions: dict[str, str],
    table_names: set[str],
) -> list[dict]:
    """Parse SQL definitions (views, SPs) to find JOIN relationships.

    Args:
        definitions: {name: sql_text}
        table_names: set of known table names for validation
    """
    relationships = []
    seen = set()

    for name, sql in definitions.items():
        if not sql:
            continue

        # Find all TABLE.COL = TABLE.COL patterns
        for match in SIMPLE_JOIN.finditer(sql):
            alias_or_table1 = match.group(1).upper()
            col1 = match.group(2).upper()
            alias_or_table2 = match.group(3).upper()
            col2 = match.group(4).upper()

            # Try to resolve aliases to table names
            tbl1 = _resolve_alias(alias_or_table1, sql, table_names)
            tbl2 = _resolve_alias(alias_or_table2, sql, table_names)

            if not tbl1 or not tbl2 or tbl1 == tbl2:
                continue

            key = (tbl1, col1, tbl2, col2)
            reverse_key = (tbl2, col2, tbl1, col1)
            if key in seen or reverse_key in seen:
                continue
            seen.add(key)

            relationships.append({
                "from_table": tbl1,
                "from_column": col1,
                "to_table": tbl2,
                "to_column": col2,
                "confidence": 0.88,
                "source": f"view_parse:{name}",
            })

    logger.info(
        "View/SP parsing: discovered %d relationships from %d definitions",
        len(relationships),
        len(definitions),
    )
    return relationships


def _resolve_alias(alias: str, sql: str, table_names: set[str]) -> str | None:
    """Try to resolve a SQL alias to an actual table name."""
    # Direct match
    if alias in table_names:
        return alias

    # Look for "TABLE_NAME AS ALIAS" or "TABLE_NAME ALIAS" in the SQL
    upper_sql = sql.upper()
    for tbl in table_names:
        # Pattern: TABLE_NAME AS ALIAS or TABLE_NAME ALIAS
        if re.search(
            rf"\b{re.escape(tbl)}\b\s+(?:AS\s+)?{re.escape(alias)}\b",
            upper_sql,
        ):
            return tbl

    return None
