#!/usr/bin/env python3
"""SchemaLens - Extract database schema, discover relationships, generate snapshot.

Usage:
    python extract.py --type mssql --host 10.9.193.201 --port 1433 \
        --db workcube_mikrolink --schema workcube_mikrolink \
        --user AlUser_App --password 'xxx' \
        --output schema_snapshot.json

    python extract.py --type postgres --host localhost --port 5432 \
        --db users --schema public \
        --user postgres --password postgres \
        --output schema_snapshot.json
"""
import argparse
import json
import logging
import sys
from datetime import datetime, timezone
from dataclasses import asdict

from connectors.base import ConnectionConfig
from connectors.mssql import MssqlConnector
from connectors.postgres import PostgresConnector
from discovery.name_match import discover_by_name_match
from discovery.alias_patterns import discover_by_alias
from discovery.common_fks import discover_by_common_fks
from discovery.view_parser import discover_from_sql_definitions
from discovery.confidence import deduplicate_and_score
from clustering.domain_detect import detect_domains
from analysis.dead_tables import find_dead_tables

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger("schemalens")


def create_connector(args):
    """Create the appropriate database connector."""
    config = ConnectionConfig(
        host=args.host,
        port=args.port,
        database=args.db,
        username=args.user,
        password=args.password,
        schema=args.schema,
    )

    if args.type == "mssql":
        return MssqlConnector(config, use_docker=not args.no_docker)
    elif args.type == "postgres":
        return PostgresConnector(config)
    else:
        raise ValueError(f"Unsupported database type: {args.type}")


def extract(args) -> dict:
    """Run the full extraction pipeline."""
    connector = create_connector(args)

    # 1. Test connection
    logger.info("Testing connection to %s:%d/%s...", args.host, args.port, args.db)
    if not connector.test_connection():
        logger.error("Connection failed!")
        sys.exit(1)
    logger.info("Connection OK")

    # 2. Extract tables and columns
    tables = connector.extract_tables()
    if not tables:
        logger.error("No tables found!")
        sys.exit(1)

    # 3. Extract explicit FKs
    explicit_fks = connector.extract_foreign_keys()

    # 4. Run discovery techniques
    logger.info("=== Running relationship discovery ===")
    all_relationships = []

    # Explicit FKs (highest confidence)
    for fk in explicit_fks:
        all_relationships.append({
            **fk,
            "confidence": 1.0,
            "source": "explicit_fk",
        })

    # Technique 1-2: Name matching
    all_relationships.extend(discover_by_name_match(tables))

    # Technique 3: Alias patterns
    all_relationships.extend(discover_by_alias(tables))

    # Technique 4: Common FK patterns
    all_relationships.extend(discover_by_common_fks(tables))

    # Technique 7: View/SP parsing (if available)
    if not args.skip_sp_parse:
        try:
            view_defs = connector.extract_view_definitions()
            sp_defs = connector.extract_stored_procedures()
            all_defs = {**view_defs, **sp_defs}
            table_names = {t.name for t in tables}
            if all_defs:
                all_relationships.extend(
                    discover_from_sql_definitions(all_defs, table_names)
                )
        except Exception as e:
            logger.warning("SP/View parsing failed: %s", e)

    # 5. Deduplicate and score
    relationships = deduplicate_and_score(all_relationships)

    # 6. Get row counts (optional)
    row_counts = {}
    if not args.skip_row_counts:
        try:
            row_counts = connector.get_row_counts()
        except Exception as e:
            logger.warning("Row count extraction failed: %s", e)

    # 7. Domain clustering
    logger.info("=== Running domain clustering ===")
    domains = detect_domains(tables, relationships)

    # 8. Dead table detection
    dead_tables = find_dead_tables(
        [{"name": t.name} for t in tables],
        relationships,
        row_counts or None,
    )

    # 9. Build snapshot
    snapshot = build_snapshot(
        tables=tables,
        relationships=relationships,
        domains=domains,
        dead_tables=dead_tables,
        row_counts=row_counts,
        args=args,
    )

    return snapshot


def build_snapshot(tables, relationships, domains, dead_tables, row_counts, args) -> dict:
    """Build the standardized schema_snapshot.json output."""
    tables_dict = {}
    for t in tables:
        tables_dict[t.name] = {
            "schema": t.schema,
            "columns": [
                {
                    "name": c.name,
                    "type": c.data_type,
                    "max_length": c.max_length,
                    "nullable": c.is_nullable,
                    "identity": c.is_identity,
                    "pk": c.is_pk,
                    "ordinal": c.ordinal,
                }
                for c in t.columns
            ],
            "row_count": row_counts.get(t.name),
            "column_count": len(t.columns),
        }

    total_cols = sum(len(t.columns) for t in tables)

    return {
        "version": "1.0",
        "generator": "schemalens",
        "metadata": {
            "db_type": args.type,
            "host": args.host,
            "database": args.db,
            "schema": args.schema,
            "extracted_at": datetime.now(timezone.utc).isoformat(),
            "table_count": len(tables),
            "column_count": total_cols,
            "relationship_count": len(relationships),
            "domain_count": len(domains),
        },
        "tables": tables_dict,
        "relationships": relationships,
        "domains": domains,
        "analysis": {
            "dead_tables": dead_tables,
            "hub_tables": _compute_hub_tables(relationships),
        },
    }


def _compute_hub_tables(relationships: list[dict]) -> list[dict]:
    """Find the most referenced tables (hub tables)."""
    from collections import Counter
    ref_counts = Counter()
    for rel in relationships:
        ref_counts[rel["to_table"]] += 1

    return [
        {"table": tbl, "incoming_refs": count}
        for tbl, count in ref_counts.most_common(30)
    ]


def main():
    parser = argparse.ArgumentParser(
        description="SchemaLens - Extract and discover database schema relationships",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument("--type", choices=["mssql", "postgres"], required=True, help="Database type")
    parser.add_argument("--host", required=True, help="Database host")
    parser.add_argument("--port", type=int, default=1433, help="Database port")
    parser.add_argument("--db", required=True, help="Database name")
    parser.add_argument("--schema", help="Schema name (default: dbo for MSSQL, public for PG)")
    parser.add_argument("--user", required=True, help="Database username")
    parser.add_argument("--password", required=True, help="Database password")
    parser.add_argument("--output", "-o", default="schema_snapshot.json", help="Output JSON file")
    parser.add_argument("--no-docker", action="store_true", help="Use local sqlcmd instead of Docker")
    parser.add_argument("--skip-sp-parse", action="store_true", help="Skip stored procedure/view parsing")
    parser.add_argument("--skip-row-counts", action="store_true", help="Skip row count extraction")
    parser.add_argument("--pretty", action="store_true", help="Pretty-print JSON output")

    args = parser.parse_args()

    # Run extraction
    snapshot = extract(args)

    # Write output
    indent = 2 if args.pretty else None
    with open(args.output, "w", encoding="utf-8") as f:
        json.dump(snapshot, f, ensure_ascii=False, indent=indent)

    logger.info(
        "=== Done! ===\n"
        "  Tables: %d\n"
        "  Columns: %d\n"
        "  Relationships: %d\n"
        "  Domains: %d\n"
        "  Dead tables: %d\n"
        "  Output: %s",
        snapshot["metadata"]["table_count"],
        snapshot["metadata"]["column_count"],
        snapshot["metadata"]["relationship_count"],
        snapshot["metadata"]["domain_count"],
        len(snapshot["analysis"]["dead_tables"]),
        args.output,
    )


if __name__ == "__main__":
    main()
