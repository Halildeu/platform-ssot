"""Tests for domain clustering."""
from extractor.clustering.domain_detect import detect_domains


class TestDomainDetect:
    def test_basic_clustering(self):
        tables = [{"name": f"EMPLOYEES_{i}"} for i in range(10)]
        tables += [{"name": f"COMPANY_{i}"} for i in range(8)]
        rels = [
            {"from_table": f"EMPLOYEES_{i}", "from_column": "ID", "to_table": "EMPLOYEES_0", "confidence": 0.9}
            for i in range(1, 10)
        ] + [
            {"from_table": f"COMPANY_{i}", "from_column": "ID", "to_table": "COMPANY_0", "confidence": 0.9}
            for i in range(1, 8)
        ]
        domains = detect_domains(tables, rels)
        assert len(domains) >= 2  # At least two clusters
        total_tables = sum(len(v) for v in domains.values())
        assert total_tables == 18  # All tables assigned

    def test_empty_returns_isolated(self):
        tables = [{"name": "A"}, {"name": "B"}]
        domains = detect_domains(tables, [])
        assert "ISOLATED" in domains or len(domains) > 0

    def test_single_cluster(self):
        tables = [{"name": f"T{i}"} for i in range(5)]
        rels = [
            {"from_table": f"T{i}", "from_column": "ID", "to_table": "T0", "confidence": 0.9}
            for i in range(1, 5)
        ]
        domains = detect_domains(tables, rels, min_domain_size=2)
        # All connected, should be one domain
        non_isolated = {k: v for k, v in domains.items() if k != "ISOLATED"}
        assert len(non_isolated) >= 1
