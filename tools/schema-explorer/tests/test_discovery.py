"""Tests for FK discovery techniques."""
from extractor.connectors.base import ColumnInfo, TableInfo
from extractor.discovery.name_match import discover_by_name_match
from extractor.discovery.alias_patterns import discover_by_alias
from extractor.discovery.common_fks import discover_by_common_fks
from extractor.discovery.confidence import deduplicate_and_score


def make_table(name, columns):
    return TableInfo(
        name=name, schema="test",
        columns=[ColumnInfo(name=c, data_type="int", max_length=4,
                            is_nullable=False, is_identity=False, is_pk=(c == name + "_ID"))
                 for c in columns]
    )


class TestNameMatch:
    def test_exact_match(self):
        tables = [
            make_table("COMPANY", ["COMPANY_ID", "NAME"]),
            make_table("ORDERS", ["ORDER_ID", "COMPANY_ID"]),
        ]
        rels = discover_by_name_match(tables)
        assert len(rels) >= 1
        assert any(r["from_table"] == "ORDERS" and r["to_table"] == "COMPANY" for r in rels)

    def test_plural_match(self):
        tables = [
            make_table("PRODUCTS", ["PRODUCT_ID", "NAME"]),
            make_table("ORDER_ROW", ["ROW_ID", "PRODUCT_ID"]),
        ]
        rels = discover_by_name_match(tables)
        assert any(r["to_table"] == "PRODUCTS" for r in rels)

    def test_no_self_reference(self):
        tables = [make_table("COMPANY", ["COMPANY_ID", "NAME"])]
        rels = discover_by_name_match(tables)
        assert not any(r["from_table"] == r["to_table"] for r in rels)

    def test_empty_tables(self):
        rels = discover_by_name_match([])
        assert rels == []


class TestAlias:
    def test_emp_id(self):
        tables = [
            make_table("EMPLOYEES", ["EMPLOYEE_ID", "NAME"]),
            make_table("WORKSTATIONS", ["WS_ID", "EMP_ID"]),
        ]
        rels = discover_by_alias(tables)
        assert any(r["from_column"] == "EMP_ID" and r["to_table"] == "EMPLOYEES" for r in rels)

    def test_acc_company_id(self):
        tables = [
            make_table("COMPANY", ["COMPANY_ID"]),
            make_table("ACCOUNT_CARD", ["CARD_ID", "ACC_COMPANY_ID"]),
        ]
        rels = discover_by_alias(tables)
        assert any(r["from_column"] == "ACC_COMPANY_ID" and r["to_table"] == "COMPANY" for r in rels)


class TestCommonFks:
    def test_company_id(self):
        tables = [
            make_table("COMPANY", ["COMPANY_ID"]),
            make_table("INVOICE", ["INVOICE_ID", "COMPANY_ID"]),
        ]
        rels = discover_by_common_fks(tables)
        assert any(r["from_table"] == "INVOICE" and r["to_table"] == "COMPANY" for r in rels)


class TestDedup:
    def test_merges_sources(self):
        rels = [
            {"from_table": "A", "from_column": "B_ID", "to_table": "B", "confidence": 0.85, "source": "name_match"},
            {"from_table": "A", "from_column": "B_ID", "to_table": "B", "confidence": 0.92, "source": "common_fk"},
        ]
        deduped = deduplicate_and_score(rels)
        assert len(deduped) == 1
        assert deduped[0]["confidence"] > 0.92  # boosted

    def test_keeps_different_targets(self):
        rels = [
            {"from_table": "A", "from_column": "B_ID", "to_table": "B", "confidence": 0.85, "source": "name_match"},
            {"from_table": "A", "from_column": "C_ID", "to_table": "C", "confidence": 0.85, "source": "name_match"},
        ]
        deduped = deduplicate_and_score(rels)
        assert len(deduped) == 2
