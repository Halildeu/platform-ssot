#!/usr/bin/env python3
from __future__ import annotations

import glob
import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path


MAP = Path("docs-ssot/00-handbook/DOC-TEMPLATE-MAP-SSOT.json")
POL = Path("docs-ssot/03-delivery/SPECS/template-strictness-policy.v1.json")
OUT = Path(".autopilot-tmp/flow-mining/template-strictness-report.md")

# Supports:
# - "1. AMAÇ"
# - "## 1. AMAÇ"
RE_NUMBERED_HEADING = re.compile(r"(?m)^\s*(?:#+\s*)?(?P<num>\d+)\.\s+(?P<title>.+?)\s*$")

ADR_REQUIRED_SECTIONS = ["CONTEXT", "DECISION", "CONSEQUENCES"]


def die(msg: str) -> int:
    print(f"[check_doc_template_strictness] FAIL: {msg}")
    return 1


def load_json(p: Path) -> dict:
    return json.loads(p.read_text(encoding="utf-8"))


def glob_files(pattern: str) -> list[str]:
    return sorted([p.replace("\\", "/") for p in glob.glob(pattern, recursive=True)])


def normalize(s: str) -> str:
    return re.sub(r"\s+", " ", s.strip()).casefold()


def extract_numbered_headings(path: str) -> list[str]:
    txt = Path(path).read_text(encoding="utf-8", errors="ignore")
    return [normalize(f"{m.group('num').strip()}. {m.group('title').strip()}") for m in RE_NUMBERED_HEADING.finditer(txt)]


def has_adr_shape(path: str) -> bool:
    txt = Path(path).read_text(encoding="utf-8", errors="ignore").casefold()

    meta_ok = (
        ("id:" in txt)
        and ("status:" in txt)
        and (("owner:" in txt) or ("sahip:" in txt))
        and (("date:" in txt) or ("tarih:" in txt))
    )
    sec_ok = all(normalize(x) in txt for x in ADR_REQUIRED_SECTIONS) and (
        "links" in txt or "linkler" in txt or "li̇nkler" in txt
    )
    return meta_ok and sec_ok


def subset_in_order(doc_headings: list[str], required: list[str]) -> tuple[bool, str | None]:
    cursor = 0
    for expected in required:
        try:
            cursor = doc_headings.index(expected, cursor) + 1
        except ValueError:
            return False, expected
    return True, None


def main() -> int:
    if not MAP.exists():
        return die("missing DOC-TEMPLATE-MAP-SSOT.json")
    if not POL.exists():
        return die("missing template-strictness-policy.v1.json")

    template_map = load_json(MAP).get("map", {})
    pol = load_json(POL)
    enabled = bool(pol.get("enabled", False))
    default_mode = str(pol.get("default_mode", "report"))
    modes = pol.get("modes", {})

    violations: list[str] = []
    checked_files = 0

    for doc_type, cfg in template_map.items():
        mode = str(modes.get(doc_type, default_mode))

        doc_glob = cfg.get("doc_glob")
        if not doc_glob:
            continue

        files = glob_files(str(doc_glob))
        if not files:
            continue

        if mode == "disabled":
            continue

        required_raw = cfg.get("required_headings", [])
        required = [normalize(x) for x in required_raw] if required_raw else []

        for f in files:
            checked_files += 1

            # TRACE is TSV; not covered by heading strictness here.
            if doc_type == "TRACE":
                continue

            if doc_type == "ADR" and mode == "shape_only":
                if not has_adr_shape(f):
                    violations.append(f"{doc_type} shape fail: {f}")
                continue

            if not required:
                continue

            doc_heads = extract_numbered_headings(f)

            if mode == "subset":
                ok, missing = subset_in_order(doc_heads, required)
                if not ok and missing:
                    violations.append(f"{doc_type} missing heading: {missing} in {f}")
                continue

            if mode in ("strict", "report"):
                ok, missing = subset_in_order(doc_heads, required)
                if not ok and missing:
                    violations.append(f"{doc_type} missing heading: {missing} in {f}")
                if doc_heads[: len(required)] != required:
                    violations.append(f"{doc_type} heading prefix/order mismatch in {f}")
                continue

            violations.append(f"{doc_type} unknown mode: {mode} (file={f})")

    OUT.parent.mkdir(parents=True, exist_ok=True)
    ts = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%MZ")
    lines: list[str] = []
    lines.append("# Template Strictness Report")
    lines.append("")
    lines.append(f"- ts_utc: {ts}")
    lines.append(f"- enabled: {enabled}")
    lines.append(f"- checked_files: {checked_files}")
    lines.append(f"- violations: {len(violations)}")
    lines.append("")
    for v in violations[:300]:
        lines.append(f"- {v}")
    if len(violations) > 300:
        lines.append(f"- ... ({len(violations) - 300} more)")
    OUT.write_text("\n".join(lines) + "\n", encoding="utf-8")

    print(f"[check_doc_template_strictness] report={OUT} violations={len(violations)} enabled={enabled}")

    if not enabled:
        return 0
    return 1 if violations else 0


if __name__ == "__main__":
    raise SystemExit(main())
