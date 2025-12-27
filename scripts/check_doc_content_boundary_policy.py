#!/usr/bin/env python3
import json
import sys
from pathlib import Path

P = Path("docs/03-delivery/SPECS/content-boundary-policy.v1.json")


def die(msg: str) -> int:
    print(f"[check_doc_content_boundary_policy] FAIL: {msg}")
    return 1


def main() -> int:
    if not P.exists():
        return die(f"missing file: {P}")
    d = json.loads(P.read_text(encoding="utf-8"))
    if "version" not in d:
        return die("missing: version")
    enabled = d.get("enabled")
    if not isinstance(enabled, bool):
        return die("enabled must be bool")
    print(f"[check_doc_content_boundary_policy] PASS: {P}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
