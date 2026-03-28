#!/usr/bin/env python3
import json
import sys
from pathlib import Path

POLICY_PATH = Path("docs-ssot/03-delivery/SPECS/guides-policy.v1.json")


def die(msg: str) -> int:
    print(f"[check_guides_policy] FAIL: {msg}")
    return 1


def main() -> int:
    if not POLICY_PATH.exists():
        return die(f"missing: {POLICY_PATH}")

    data = json.loads(POLICY_PATH.read_text(encoding="utf-8"))
    if "version" not in data:
        return die("missing: version")
    if "enabled" not in data or not isinstance(data["enabled"], bool):
        return die("enabled must be bool")

    scope = data.get("scope")
    if not isinstance(scope, dict):
        return die("scope must be object")
    if not scope.get("guides_root"):
        return die("missing: scope.guides_root")

    rules = data.get("rules")
    if not isinstance(rules, dict):
        return die("rules must be object")
    if not rules.get("require_prefix"):
        return die("missing: rules.require_prefix")
    if not rules.get("require_template"):
        return die("missing: rules.require_template")

    print(f"[check_guides_policy] PASS: {POLICY_PATH}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
