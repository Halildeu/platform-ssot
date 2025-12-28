#!/usr/bin/env python3
from __future__ import annotations

import glob
import os
import re
import sys
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path


STORY_GLOB = "docs/03-delivery/STORIES/STORY-*.md"
TP_GLOB = "docs/03-delivery/TEST-PLANS/TP-{id}-*.md"
TP_TEMPLATE = Path("docs/99-templates/TEST-PLAN.template.md")
OUT_REPORT = Path(".autopilot-tmp/flow-mining/tp-risk-policy-report.md")

# Supports:
# - "1. AMAÇ"
# - "## 1. AMAÇ"
RE_NUMBERED_HEADING = re.compile(r"(?m)^\s*(?:#+\s*)?(?P<num>\d+)\.\s+(?P<title>.+?)\s*$")
RE_STORY_ID = re.compile(r"(?mi)^\s*ID:\s*(?P<id>STORY-(?P<num>\d{4}))\b")
RE_STORY_FILE_NUM = re.compile(r"(?P<num>\d{4})")
RE_RISK = re.compile(r"(?mi)^\s*Risk[_ -]?Level:\s*(?P<level>low|medium|high)\s*$")


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


def extract_story_num(path: Path, text: str) -> str | None:
    """
    Prefer file stem prefix: STORY-1234-...
    Fallback to `ID: STORY-1234`.
    """
    stem = path.stem  # STORY-1234-foo
    if stem.startswith("STORY-"):
        parts = stem.split("-", 2)
        if len(parts) >= 2 and parts[1].isdigit() and len(parts[1]) == 4:
            return parts[1]

    m = RE_STORY_ID.search(text)
    if m:
        return m.group("num")

    return None


def extract_risk_level(text: str) -> str | None:
    m = RE_RISK.search(text)
    return (m.group("level").strip().lower() if m else None)


def resolve_tp_file(tp_id: str) -> Path | None:
    hits = sorted(glob.glob(TP_GLOB.format(id=tp_id), recursive=True))
    return Path(hits[0]) if hits else None


@dataclass(frozen=True)
class Violation:
    story_path: str
    story_id: str
    tp_id: str
    tp_path: str | None
    missing_headings: list[str]


def write_report(ts_utc: str, violations: list[Violation]) -> None:
    OUT_REPORT.parent.mkdir(parents=True, exist_ok=True)
    lines: list[str] = []
    lines.append("# TP Risk Policy Report (non-blocking)")
    lines.append("")
    lines.append(f"- ts_utc: {ts_utc}")
    lines.append(f"- story_glob: {STORY_GLOB}")
    lines.append(f"- violations: {len(violations)}")
    lines.append("")

    if violations:
        for v in violations[:200]:
            lines.append(f"- FAIL: {v.story_id} ({v.story_path}) -> TP-{v.tp_id} ({v.tp_path or 'MISSING'})")
            if v.missing_headings:
                lines.append(f"  - missing_headings: {v.missing_headings}")
        if len(violations) > 200:
            lines.append(f"- ... ({len(violations) - 200} more)")
    else:
        lines.append("- OK")

    OUT_REPORT.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> int:
    ts_utc = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%MZ")

    if not TP_TEMPLATE.exists():
        print("[check_tp_risk_policy] SKIP: TP template missing")
        write_report(ts_utc=ts_utc, violations=[])
        return 0

    template_headings_raw = extract_numbered_headings(read_text(TP_TEMPLATE))
    template_headings = [normalize_heading(h) for h in template_headings_raw]
    if len(template_headings_raw) < 8:
        print("[check_tp_risk_policy] SKIP: TP template headings < 8")
        write_report(ts_utc=ts_utc, violations=[])
        return 0

    stories = [Path(p) for p in sorted(glob.glob(STORY_GLOB, recursive=True))]
    violations: list[Violation] = []

    for sp in stories:
        st = read_text(sp)
        risk = extract_risk_level(st)
        if risk != "high":
            continue

        story_num = extract_story_num(sp, st)
        if not story_num:
            continue

        tp_id = story_num
        tp_path = resolve_tp_file(tp_id)
        if not tp_path or not tp_path.exists():
            violations.append(
                Violation(
                    story_path=str(sp).replace("\\", "/"),
                    story_id=f"STORY-{story_num}",
                    tp_id=tp_id,
                    tp_path=None,
                    missing_headings=template_headings_raw,
                )
            )
            continue

        tp_txt = read_text(tp_path)
        doc_headings_raw = extract_numbered_headings(tp_txt)
        doc_headings = [normalize_heading(h) for h in doc_headings_raw]

        cursor = 0
        missing_norm: list[str] = []
        for expected in template_headings:
            try:
                cursor = doc_headings.index(expected, cursor) + 1
            except ValueError:
                missing_norm.append(expected)

        if missing_norm:
            # Present missing headings using the original template headings (human readable)
            missing_raw = [h for h in template_headings_raw if normalize_heading(h) in set(missing_norm)]
            violations.append(
                Violation(
                    story_path=str(sp).replace("\\", "/"),
                    story_id=f"STORY-{story_num}",
                    tp_id=tp_id,
                    tp_path=str(tp_path).replace("\\", "/"),
                    missing_headings=missing_raw,
                )
            )

    write_report(ts_utc=ts_utc, violations=violations)
    print(f"[check_tp_risk_policy] report={OUT_REPORT} violations={len(violations)}")

    # Non-blocking by default.
    if os.environ.get("TP_RISK_POLICY_BLOCKING", "").strip() == "1" and violations:
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

