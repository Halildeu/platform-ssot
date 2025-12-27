#!/usr/bin/env python3
"""
Non-blocking PRD complexity suggestion.

- Always exits 0 (report-only).
- Heuristic based on keywords (roles, SLA, audit/evidence, PII, integration).
"""

from __future__ import annotations

import os
import sys
from pathlib import Path


PRD_DIR = Path("docs/01-product/PRD")


def append_github_step_summary(markdown: str) -> None:
    summary = os.environ.get("GITHUB_STEP_SUMMARY")
    if not summary:
        return
    Path(summary).parent.mkdir(parents=True, exist_ok=True)
    with Path(summary).open("a", encoding="utf-8") as f:
        f.write(markdown)


def score(text: str) -> int:
    t = text.lower()
    pts = 0
    keys = [
        ("role", ["yetki", "role", "permission", "authz", "access"]),
        ("sla", ["sla", "escalation", "eskalasyon", "breach", "calendar", "iş günü", "tatil"]),
        ("audit", ["audit", "denetim", "view log", "log", "immutability", "delil", "evidence"]),
        ("pii", ["pii", "kvkk", "personal data", "özel nitelikli", "redaction", "mask"]),
        ("integration", ["integration", "entegrasyon", "webhook", "hook", "queue", "event"]),
        ("multi_flow", ["akış", "workflow", "state", "durum makinesi", "case", "task"]),
    ]
    for _, kws in keys:
        if any(k in t for k in kws):
            pts += 1
    return pts


def classify(pts: int) -> str:
    if pts <= 1:
        return "S"
    if pts <= 3:
        return "M"
    return "L"


def expected_stories(c: str) -> int:
    return {"S": 1, "M": 2, "L": 3}[c]


def main() -> int:
    if not PRD_DIR.exists():
        print("[check_prd_complexity] PRD dir not found; exit 0")
        return 0

    prds = sorted(PRD_DIR.glob("PRD-*.md"))
    if not prds:
        print("[check_prd_complexity] No PRD files found; exit 0")
        return 0

    out_lines: list[str] = []
    out_lines.append("## PRD Complexity Suggestion (non-blocking)")
    for p in prds[-10:]:
        txt = p.read_text(encoding="utf-8", errors="ignore")
        pts = score(txt)
        c = classify(pts)
        out_lines.append(
            f"- {p.name}: suggested Complexity={c} (expected stories >= {expected_stories(c)})"
        )

    markdown = "\n".join(out_lines) + "\n"
    print(markdown)
    append_github_step_summary(markdown)
    return 0


if __name__ == "__main__":
    sys.exit(main())

