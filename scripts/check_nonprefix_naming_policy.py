#!/usr/bin/env python3
import json
import sys
from pathlib import Path

POLICY_PATH = Path("docs/03-delivery/SPECS/nonprefix-naming-policy.v1.json")


def die(msg: str) -> int:
    print(f"[check_nonprefix_naming_policy] FAIL: {msg}")
    return 1


def main() -> int:
    if not POLICY_PATH.exists():
        return die(f"missing: {POLICY_PATH}")

    data = json.loads(POLICY_PATH.read_text(encoding="utf-8"))
    if "version" not in data:
        return die("missing: version")
    if "enabled" not in data or not isinstance(data["enabled"], bool):
        return die("enabled must be bool")

    print(f"[check_nonprefix_naming_policy] PASS: {POLICY_PATH}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
