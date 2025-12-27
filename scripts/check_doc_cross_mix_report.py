#!/usr/bin/env python3
"""
Non-blocking "content mixing" report based on template heading contracts.

Idea:
- Extract numbered headings from each template (DOC-TEMPLATE-MAP-SSOT.json).
- Compute headings that are unique per template (excluding shared headings like "1. AMAÇ").
- Scan docs per type, and flag when a doc contains unique headings from another doc type.

Always exits 0 (report-only).
"""

from __future__ import annotations

import glob
import json
import os
import re
import sys
from collections import Counter, defaultdict
from dataclasses import dataclass
from pathlib import Path


POLICY_PATH = Path("docs/00-handbook/DOC-TEMPLATE-MAP-SSOT.json")
DEFAULT_OUT = Path(".autopilot-tmp/flow-mining/doc-cross-mix-report.md")

RE_NUMBERED_HEADING = re.compile(r"^\s*(?:#+\s*)?(?P<num>\d+)\.\s+(?P<title>.+?)\s*$", re.M)


def normalize_heading(raw: str) -> str:
    s = re.sub(r"\s+", " ", raw.strip())
    return s.casefold()


def extract_numbered_headings(text: str) -> list[str]:
    out: list[str] = []
    for m in re.finditer(RE_NUMBERED_HEADING, text):
        num = m.group("num").strip()
        title = m.group("title").strip()
        out.append(f"{num}. {title}")
    return out


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8", errors="ignore")


@dataclass(frozen=True)
class MapEntry:
    doc_type: str
    template_path: Path
    doc_glob: str


def load_entries() -> list[MapEntry]:
    data = json.loads(POLICY_PATH.read_text(encoding="utf-8"))
    templates_dir = Path(data["templates_dir"])
    entries: list[MapEntry] = []
    for doc_type, cfg in data["map"].items():
        tmpl = templates_dir / str(cfg["template"])
        entries.append(
            MapEntry(
                doc_type=str(doc_type),
                template_path=tmpl,
                doc_glob=str(cfg["doc_glob"]),
            )
        )
    return entries


def main() -> int:
    if not POLICY_PATH.exists():
        print(f"[check_doc_cross_mix_report] SKIP: policy missing: {POLICY_PATH}")
        return 0

    try:
        entries = load_entries()
    except Exception as exc:
        print(f"[check_doc_cross_mix_report] SKIP: policy load error: {exc}")
        return 0

    # Build template heading sets
    template_headings: dict[str, set[str]] = {}
    missing_templates: list[str] = []
    for e in entries:
        if not e.template_path.exists():
            missing_templates.append(f"{e.doc_type}: {e.template_path}")
            continue
        hs = [normalize_heading(h) for h in extract_numbered_headings(read_text(e.template_path))]
        if hs:
            template_headings[e.doc_type] = set(hs)

    # Compute per-heading frequency across templates (for uniqueness)
    freq = Counter()
    for hs in template_headings.values():
        freq.update(hs)

    unique_by_type: dict[str, set[str]] = {}
    for doc_type, hs in template_headings.items():
        unique_by_type[doc_type] = {h for h in hs if freq[h] == 1}

    # Scan docs for cross-mix (unique headings from other types)
    hits: list[tuple[str, str, str, list[str]]] = []  # (doc_type, doc_path, foreign_type, headings)
    pair_counts: Counter[tuple[str, str]] = Counter()
    docs_scanned: Counter[str] = Counter()

    for e in entries:
        docs = [Path(p) for p in glob.glob(e.doc_glob, recursive=True)]
        docs_scanned[e.doc_type] += len(docs)
        if not docs:
            continue

        for dp in docs:
            doc_h = {normalize_heading(h) for h in extract_numbered_headings(read_text(dp))}
            if not doc_h:
                continue
            for other_type, other_unique in unique_by_type.items():
                if other_type == e.doc_type:
                    continue
                inter = sorted(doc_h.intersection(other_unique))
                if not inter:
                    continue
                hits.append((e.doc_type, str(dp), other_type, inter[:8]))
                pair_counts[(e.doc_type, other_type)] += 1

    lines: list[str] = []
    lines.append("## Doc Cross-Mix Report (non-blocking)")
    lines.append("")
    lines.append(f"- policy: {POLICY_PATH}")
    lines.append(f"- templates_loaded: {len(template_headings)}")
    lines.append(f"- unique_heading_pool: {sum(len(v) for v in unique_by_type.values())}")
    lines.append("")
    lines.append("### Docs scanned")
    for k, v in sorted(docs_scanned.items(), key=lambda kv: (-kv[1], kv[0])):
        lines.append(f"- {k}: {v}")
    lines.append("")

    if missing_templates:
        lines.append("### Missing templates (info)")
        for x in missing_templates[:50]:
            lines.append(f"- {x}")
        if len(missing_templates) > 50:
            lines.append(f"- ... ({len(missing_templates) - 50} more)")
        lines.append("")

    lines.append("### Cross-mix pairs (top 15)")
    if pair_counts:
        for (src, dst), cnt in pair_counts.most_common(15):
            lines.append(f"- {src} -> {dst}: {cnt}")
    else:
        lines.append("- (no signals)")
    lines.append("")

    lines.append("### Example hits (first 30)")
    if hits:
        for src, path, foreign, hs in hits[:30]:
            lines.append(f"- {src}: {path} (looks like {foreign}) headings={hs}")
        if len(hits) > 30:
            lines.append(f"- ... ({len(hits) - 30} more)")
    else:
        lines.append("- (no hits)")
    lines.append("")

    out = "\n".join(lines) + "\n"

    out_path = DEFAULT_OUT
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(out, encoding="utf-8")
    print(out)
    print(f"[check_doc_cross_mix_report] wrote: {out_path}")

    summary = os.environ.get("GITHUB_STEP_SUMMARY")
    if summary:
        Path(summary).write_text(out, encoding="utf-8")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())

