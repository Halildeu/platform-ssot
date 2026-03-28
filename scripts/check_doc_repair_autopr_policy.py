#!/usr/bin/env python3
"""
Doc-Repair Auto-PR policy (SSOT) schema-lite doğrulayıcı.

Kontroller:
- JSON parse edilebilir mi?
- version var mı?
- enabled bool mu?
- thresholds objesi var mı ve zorunlu alanları içeriyor mu?
- allowed_reason_codes non-empty list mi?

Kullanım:
  python3 scripts/check_doc_repair_autopr_policy.py
"""

from __future__ import annotations

import json
import sys
from pathlib import Path
from typing import Any, Dict, List


ROOT = Path(__file__).resolve().parents[1]
POLICY = (
    ROOT
    / "docs-ssot"
    / "03-delivery"
    / "SPECS"
    / "doc-repair-autopr-policy.v0.6.json"
)


def fail(msg: str) -> int:
    print(f"[check_doc_repair_autopr_policy] FAIL: {msg}")
    return 1


def main() -> int:
    if not POLICY.exists():
        return fail(f"missing file: {POLICY.relative_to(ROOT)}")

    try:
        data: Dict[str, Any] = json.loads(POLICY.read_text(encoding="utf-8"))
    except json.JSONDecodeError as e:
        return fail(f"invalid json: {e}")

    if data.get("version") is None:
        return fail("missing: version")

    enabled = data.get("enabled")
    if not isinstance(enabled, bool):
        return fail("enabled must be bool")

    thresholds = data.get("thresholds")
    if not isinstance(thresholds, dict):
        return fail("thresholds must be object")

    required = ["max_unknown_reason_ratio", "max_changed_files", "max_diff_lines"]
    for k in required:
        if k not in thresholds:
            return fail(f"missing thresholds.{k}")

    ratio = thresholds.get("max_unknown_reason_ratio")
    if not isinstance(ratio, (int, float)):
        return fail("thresholds.max_unknown_reason_ratio must be number")

    max_changed_files = thresholds.get("max_changed_files")
    if not isinstance(max_changed_files, int):
        return fail("thresholds.max_changed_files must be int")

    max_diff_lines = thresholds.get("max_diff_lines")
    if not isinstance(max_diff_lines, int):
        return fail("thresholds.max_diff_lines must be int")

    allowed = data.get("allowed_reason_codes")
    if not isinstance(allowed, list) or not allowed:
        return fail("allowed_reason_codes must be non-empty list")

    allowed_str: List[str] = []
    for idx, it in enumerate(allowed):
        if not isinstance(it, str) or not it.strip():
            return fail(f"allowed_reason_codes invalid at index {idx}")
        allowed_str.append(it.strip())

    if len(allowed_str) != len(set(allowed_str)):
        return fail("allowed_reason_codes contains duplicates")

    print(f"[check_doc_repair_autopr_policy] PASS: {POLICY.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
