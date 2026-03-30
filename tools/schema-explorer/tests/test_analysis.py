"""Tests for analysis modules."""
from extractor.analysis.dead_tables import find_dead_tables
from extractor.analysis.impact import analyze_impact, find_critical_paths
from extractor.analysis.schema_diff import diff_snapshots
import json
import tempfile


class TestDeadTables:
    def test_finds_orphans(self):
        tables = [{"name": "A"}, {"name": "B"}, {"name": "ORPHAN"}]
        rels = [{"from_table": "A", "from_column": "B_ID", "to_table": "B"}]
        dead = find_dead_tables(tables, rels)
        assert len(dead) == 1
        assert dead[0]["table"] == "ORPHAN"

    def test_all_connected(self):
        tables = [{"name": "A"}, {"name": "B"}]
        rels = [{"from_table": "A", "from_column": "B_ID", "to_table": "B"}]
        dead = find_dead_tables(tables, rels)
        assert len(dead) == 0

    def test_row_count_enrichment(self):
        tables = [{"name": "ORPHAN"}]
        dead = find_dead_tables(tables, [], row_counts={"ORPHAN": 0})
        assert dead[0]["row_count"] == 0
        assert "empty" in dead[0]["reason"]


class TestImpact:
    def test_direct_impact(self):
        rels = [
            {"from_table": "ORDER_ROW", "from_column": "ORDER_ID", "to_table": "ORDERS", "confidence": 0.9},
            {"from_table": "ORDERS", "from_column": "COMPANY_ID", "to_table": "COMPANY", "confidence": 0.9},
        ]
        result = analyze_impact("COMPANY", rels, max_hops=1)
        assert result["affected_count"] >= 1
        assert any(a["table"] == "ORDERS" for a in result["affected"])

    def test_two_hop_impact(self):
        rels = [
            {"from_table": "A", "from_column": "B_ID", "to_table": "B", "confidence": 0.9},
            {"from_table": "B", "from_column": "C_ID", "to_table": "C", "confidence": 0.9},
        ]
        result = analyze_impact("C", rels, max_hops=2)
        assert result["affected_count"] >= 2

    def test_critical_paths(self):
        rels = [
            {"from_table": "A", "from_column": "HUB_ID", "to_table": "HUB", "confidence": 0.9},
            {"from_table": "B", "from_column": "HUB_ID", "to_table": "HUB", "confidence": 0.9},
            {"from_table": "C", "from_column": "HUB_ID", "to_table": "HUB", "confidence": 0.9},
        ]
        paths = find_critical_paths(rels, top_n=5)
        # HUB should be among the most impactful (3 incoming refs)
        hub_entry = next((p for p in paths if p["table"] == "HUB"), None)
        assert hub_entry is not None
        assert hub_entry["affected_count"] >= 3


class TestSchemaDiff:
    def test_detects_added_table(self):
        old = {"tables": {"A": {"columns": [{"name": "ID", "type": "int"}]}}, "relationships": []}
        new = {"tables": {
            "A": {"columns": [{"name": "ID", "type": "int"}]},
            "B": {"columns": [{"name": "ID", "type": "int"}]},
        }, "relationships": []}

        with tempfile.NamedTemporaryFile(mode='w', suffix='.json', delete=False) as f1:
            json.dump(old, f1)
            old_path = f1.name
        with tempfile.NamedTemporaryFile(mode='w', suffix='.json', delete=False) as f2:
            json.dump(new, f2)
            new_path = f2.name

        diff = diff_snapshots(old_path, new_path)
        assert "B" in diff["added_tables"]
        assert diff["summary"]["tables_added"] == 1

    def test_detects_removed_table(self):
        old = {"tables": {"A": {"columns": []}, "B": {"columns": []}}, "relationships": []}
        new = {"tables": {"A": {"columns": []}}, "relationships": []}

        with tempfile.NamedTemporaryFile(mode='w', suffix='.json', delete=False) as f1:
            json.dump(old, f1)
            old_path = f1.name
        with tempfile.NamedTemporaryFile(mode='w', suffix='.json', delete=False) as f2:
            json.dump(new, f2)
            new_path = f2.name

        diff = diff_snapshots(old_path, new_path)
        assert "B" in diff["removed_tables"]
