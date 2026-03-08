#!/usr/bin/env python3
from __future__ import annotations

import json
import os
import re
import sys
from collections import Counter
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path


POLICY_PATH = Path("docs-ssot/03-delivery/SPECS/content-boundary-policy.v1.json")
SSOT_PATH = Path("docs-ssot/00-handbook/DOC-CONTENT-BOUNDARY-SSOT.json")
MAP_PATH = Path("docs-ssot/00-handbook/DOC-TEMPLATE-MAP-SSOT.json")

DEFAULT_OUT = Path(".autopilot-tmp/flow-mining/content-boundary-report.md")

RE_H2 = re.compile(r"(?m)^##\s+(?P<title>.+?)\s*$")
# Supports both:
# - "1. AMAÇ"
# - "## 1. AMAÇ"
RE_NUMBERED = re.compile(r"(?m)^\s*(?:#+\s*)?(?P<num>\d+)\.\s+(?P<title>.+?)\s*$")


def normalize_heading(raw: str) -> str:
    s = re.sub(r"\s+", " ", raw.strip())
    return s.casefold()


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8", errors="ignore")


def load_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


@dataclass(frozen=True)
class Violation:
    doc_type: str
    file: str
    hit_h2: list[str]
    hit_num: list[str]
    hit_terms: list[str]


def main() -> int:
    missing = [str(p) for p in [POLICY_PATH, SSOT_PATH, MAP_PATH] if not p.exists()]
    if missing:
        print(f"[check_doc_content_boundaries] FAIL: missing files: {missing}")
        return 1

    policy = load_json(POLICY_PATH)
    enabled = bool(policy.get("enabled", False))

    ssot = load_json(SSOT_PATH)
    rules = ssot.get("rules", {})
    if not isinstance(rules, dict) or not rules:
        print("[check_doc_content_boundaries] FAIL: SSOT missing/empty: rules")
        return 1

    mapping = load_json(MAP_PATH).get("map", {})
    if not isinstance(mapping, dict) or not mapping:
        print("[check_doc_content_boundaries] FAIL: map missing/empty: DOC-TEMPLATE-MAP-SSOT.json:map")
        return 1

    violations: list[Violation] = []
    scanned_by_type: Counter[str] = Counter()
    viol_by_type: Counter[str] = Counter()

    for doc_type, rule in sorted(rules.items()):
        cfg = mapping.get(doc_type)
        if not cfg or not isinstance(cfg, dict) or not cfg.get("doc_glob"):
            print(f"[check_doc_content_boundaries] FAIL: mapping missing doc_glob for doc_type={doc_type}")
            return 1

        doc_glob = str(cfg["doc_glob"])
        paths = sorted([Path(p) for p in Path(".").glob(doc_glob)]) if ("**" not in doc_glob) else sorted(
            [Path(p) for p in Path(".").glob(doc_glob)]
        )
        # Use glob.glob for recursive patterns reliably
        if "**" in doc_glob or "*" in doc_glob:
            import glob as glob_mod

            paths = sorted([Path(p) for p in glob_mod.glob(doc_glob, recursive=True)])

        if not paths:
            continue

        forb_h2 = set(normalize_heading(x) for x in rule.get("forbidden_h2", []) if isinstance(x, str))
        forb_num = set(normalize_heading(x) for x in rule.get("forbidden_num", []) if isinstance(x, str))
        forb_terms = [x for x in rule.get("forbidden_terms", []) if isinstance(x, str)]

        for p in paths:
            if not p.exists() or not p.is_file():
                continue

            scanned_by_type[doc_type] += 1
            txt = read_text(p)

            h2_titles = {normalize_heading(m.group("title")) for m in re.finditer(RE_H2, txt)}
            num_titles = {normalize_heading(m.group("title")) for m in re.finditer(RE_NUMBERED, txt)}

            hit_h2 = sorted([x for x in forb_h2 if x in h2_titles])
            hit_num = sorted([x for x in forb_num if x in num_titles])
            low = txt.casefold()
            hit_terms = sorted([t for t in forb_terms if t.casefold() in low])

            if hit_h2 or hit_num or hit_terms:
                file_str = str(p).replace("\\", "/")
                violations.append(
                    Violation(
                        doc_type=doc_type,
                        file=file_str,
                        hit_h2=hit_h2,
                        hit_num=hit_num,
                        hit_terms=hit_terms,
                    )
                )
                viol_by_type[doc_type] += 1

    out_lines: list[str] = []
    out_lines.append("# Doc Content Boundary Report (local-only)")
    out_lines.append("")
    out_lines.append(f"- ts_utc: {datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%MZ')}")
    out_lines.append(f"- enabled: {enabled}")
    out_lines.append(f"- scanned_docs: {sum(scanned_by_type.values())}")
    out_lines.append(f"- violations: {len(violations)}")
    out_lines.append("")

    out_lines.append("## Scanned by doc_type")
    for k, v in sorted(scanned_by_type.items(), key=lambda kv: (-kv[1], kv[0])):
        out_lines.append(f"- {k}: {v}")
    out_lines.append("")

    out_lines.append("## Violations by doc_type")
    if viol_by_type:
        for k, v in sorted(viol_by_type.items(), key=lambda kv: (-kv[1], kv[0])):
            out_lines.append(f"- {k}: {v}")
    else:
        out_lines.append("- (none)")
    out_lines.append("")

    out_lines.append("## Details (first 200)")
    if violations:
        for v in violations[:200]:
            out_lines.append(f"### {v.doc_type} — `{v.file}`")
            if v.hit_h2:
                out_lines.append(f"- forbidden_h2: {v.hit_h2}")
            if v.hit_num:
                out_lines.append(f"- forbidden_num: {v.hit_num}")
            if v.hit_terms:
                out_lines.append(f"- forbidden_terms: {v.hit_terms}")
            out_lines.append("")
        if len(violations) > 200:
            out_lines.append(f"- ... ({len(violations) - 200} more)")
    else:
        out_lines.append("- (none)")

    out = "\n".join(out_lines) + "\n"

    DEFAULT_OUT.parent.mkdir(parents=True, exist_ok=True)
    DEFAULT_OUT.write_text(out, encoding="utf-8")

    print(out)
    print(f"[check_doc_content_boundaries] wrote: {DEFAULT_OUT}")

    summary = os.environ.get("GITHUB_STEP_SUMMARY")
    if summary:
        Path(summary).write_text(out, encoding="utf-8")

    if violations and enabled:
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
