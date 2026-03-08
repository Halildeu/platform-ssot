#!/usr/bin/env python3
"""
Doc-Repair reason-map (SSOT) schema-lite doğrulayıcı.

Kontroller:
- JSON parse edilebilir mi?
- version var mı?
- reason_codes listesi var ve boş değil mi? (unique olmalı)
- blockedReason_patterns listesi var mı?
  - pattern string olmalı ve unique olmalı
  - reason_code, reason_codes içinde olmalı

Kullanım:
  python3 scripts/check_doc_repair_reason_map.py
"""

from __future__ import annotations

import json
import sys
from pathlib import Path
from typing import Any, Dict, List, Set


ROOT = Path(__file__).resolve().parents[1]
DEFAULT = (
    ROOT
    / "docs-ssot"
    / "03-delivery"
    / "SPECS"
    / "doc-repair-reason-map.v0.1.json"
)


def fail(msg: str) -> int:
    print(f"[check_doc_repair_reason_map] FAIL: {msg}")
    return 1


def main() -> int:
    if not DEFAULT.exists():
        return fail(f"missing file: {DEFAULT.relative_to(ROOT)}")

    try:
        data: Dict[str, Any] = json.loads(DEFAULT.read_text(encoding="utf-8"))
    except json.JSONDecodeError as e:
        return fail(f"invalid json: {e}")

    if data.get("version") is None:
        return fail("missing: version")

    reason_codes = data.get("reason_codes")
    if not isinstance(reason_codes, list) or not reason_codes:
        return fail("missing/empty: reason_codes")

    # reason_code'lar unique olmalı
    rc: List[str] = [str(x) for x in reason_codes]
    if len(rc) != len(set(rc)):
        return fail("reason_codes contains duplicates")

    patterns = data.get("blockedReason_patterns")
    if not isinstance(patterns, list):
        return fail("missing: blockedReason_patterns")

    rc_set: Set[str] = set(rc)
    seen_patterns: Set[str] = set()

    for idx, it in enumerate(patterns):
        if not isinstance(it, dict):
            return fail(f"blockedReason_patterns item invalid at index {idx}")

        pat = it.get("pattern")
        code = it.get("reason_code")

        if not pat or not isinstance(pat, str):
            return fail(f"pattern missing/invalid at index {idx}")
        if pat in seen_patterns:
            return fail(f"duplicate pattern: {pat}")
        seen_patterns.add(pat)

        if code not in rc_set:
            return fail(f"reason_code not in reason_codes: {code} (pattern={pat})")

    print(f"[check_doc_repair_reason_map] PASS: {DEFAULT.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
