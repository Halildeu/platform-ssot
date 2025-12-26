#!/usr/bin/env python3
import json
import sys
from pathlib import Path

P = "docs/03-delivery/SPECS/trace-quality-policy.v1.json"


def die(msg: str) -> int:
    print(f"[check_trace_quality_policy] FAIL: {msg}")
    return 1


def main() -> int:
    p = Path(P)
    if not p.exists():
        return die(f"missing file: {P}")

    d = json.loads(p.read_text(encoding="utf-8"))
    if "version" not in d:
        return die("missing: version")
    if "enabled" not in d or not isinstance(d["enabled"], bool):
        return die("enabled must be bool")

    rules = d.get("rules")
    if not isinstance(rules, dict):
        return die("rules must be object")

    if "require_mapping_quality_column" not in rules:
        return die("missing rules.require_mapping_quality_column")
    if "min_refined_ratio" not in rules:
        return die("missing rules.min_refined_ratio")
    if not isinstance(rules["min_refined_ratio"], (int, float)):
        return die("min_refined_ratio must be number")

    print(f"[check_trace_quality_policy] PASS: {P}")
    return 0


if __name__ == "__main__":
    sys.exit(main())

