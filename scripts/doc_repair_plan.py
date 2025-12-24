#!/usr/bin/env python3
"""
Doc-Repair "plan only" generator (v0.1).

Amaç:
- docflow_next autopilot --dry-run summary.md çıktısını parse etmek.
- blockedReason → reason_code (SSOT reason map) normalize etmek.
- Sadece plan + rapor üretmek (uygulama/patch yok).

Çıktılar:
- artifacts/doc-repair/plan.json
- artifacts/doc-repair/report.md

Kullanım:
  python3 scripts/doc_repair_plan.py --summary web/test-results/ops/summary.md
  python3 scripts/doc_repair_plan.py --summary <PATH> --reason-map <PATH> --out-dir <DIR>
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Dict, List, Optional


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_REASON_MAP = ROOT / "docs" / "03-delivery" / "SPECS" / "doc-repair-reason-map.v0.1.json"


@dataclass(frozen=True)
class SummaryItem:
    story_id: str
    blocked_reason: Optional[str]


def load_reason_map(path: Path) -> Dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def normalize(blocked_reason: Optional[str], reason_map: Dict[str, Any]) -> str:
    if not blocked_reason:
        return "UNKNOWN"

    haystack = blocked_reason.casefold()
    for item in reason_map.get("blockedReason_patterns", []):
        pattern = str(item.get("pattern") or "")
        reason_code = str(item.get("reason_code") or "UNKNOWN")
        if pattern and pattern.casefold() in haystack:
            return reason_code

    return "UNKNOWN"


def parse_autopilot_summary(text: str) -> List[SummaryItem]:
    """
    docflow_next autopilot summary.md formatı:
    - "## Blocked Reasons" başlığı altında:
      - STORY-0001: <reason>
    """
    in_blocked = False
    started_list = False
    items: List[SummaryItem] = []

    blocked_line = re.compile(r"^-\s*(STORY-\d{4})\s*:\s*(.*)\s*$")
    for raw in text.splitlines():
        line = raw.rstrip("\n")

        if line.strip() == "## Blocked Reasons":
            in_blocked = True
            continue

        if in_blocked and line.startswith("## "):
            in_blocked = False
            continue

        if not in_blocked:
            continue

        if started_list and not line.strip():
            break

        m = blocked_line.match(line.strip())
        if not m:
            continue
        started_list = True
        story_id = m.group(1)
        reason = m.group(2).strip() or None
        items.append(SummaryItem(story_id=story_id, blocked_reason=reason))

    return items


def suggest_actions(reason_code: str, story_id: str, blocked_reason: Optional[str]) -> List[Dict[str, str]]:
    blocked_reason_display = blocked_reason or ""

    if reason_code == "STORY_LINKS_SECTION_MISSING":
        return [
            {
                "op": "patch",
                "target": f"docs/03-delivery/STORIES/{story_id}-*.md",
                "summary": "STORY dosyasına template’e uygun LİNKLER bölümü ekle.",
            }
        ]

    if reason_code in {"AC_MISSING", "AC_FILE_MISSING"}:
        return [
            {
                "op": "create/patch",
                "target": "ACCEPTANCE + STORY Downstream",
                "summary": "AC ID belirle, STORY Downstream’a ekle, ACCEPTANCE.template.md’den AC dosyası oluştur.",
            }
        ]

    if reason_code in {"TP_MISSING", "TP_FILE_MISSING"}:
        return [
            {
                "op": "create/patch",
                "target": "TEST-PLAN + STORY Downstream",
                "summary": "L2+ ise TP ID belirle, STORY Downstream’a ekle, TEST-PLAN.template.md’den TP dosyası oluştur.",
            }
        ]

    if reason_code == "API_DOC_MISSING":
        return [
            {
                "op": "patch",
                "target": "STORY LİNKLER",
                "summary": "STORY LİNKLER’e ilgili .api.md referansı ekle (L2+ API story).",
            }
        ]

    if reason_code == "EVIDENCE_MISSING_STRICT":
        return [
            {
                "op": "patch",
                "target": "ACCEPTANCE Evidence",
                "summary": "Repo içi kanıt referansı ekle; gerekiyorsa placeholder kanıt kaydı oluştur.",
            }
        ]

    if reason_code in {"SPEC_IN_PROGRESS", "ADR_IN_PROGRESS"}:
        return [
            {
                "op": "stub/patch",
                "target": "SPEC/ADR ref",
                "summary": "Referans edilen SPEC/ADR yoksa minimal stub + link üret (v0.1).",
            }
        ]

    if reason_code == "VERSION_GATE_BLOCKED":
        return [
            {
                "op": "stop",
                "target": "env/lockfile",
                "summary": "Sürüm/lockfile engeli; otomatik doküman patch’i yapma (needs-human).",
            }
        ]

    if reason_code == "STORY_PATH_INVALID":
        return [
            {
                "op": "patch",
                "target": "path",
                "summary": "Story dosya yolunu check_doc_locations’a göre düzelt (move/rename).",
            }
        ]

    return [
        {
            "op": "manual",
            "target": "unknown",
            "summary": f"UNKNOWN reason; blockedReason={blocked_reason_display}",
        }
    ]


def write_outputs(items: List[SummaryItem], reason_map: Dict[str, Any], out_dir: Path) -> None:
    out_dir.mkdir(parents=True, exist_ok=True)

    plan_items: List[Dict[str, Any]] = []
    for it in items:
        reason_code = normalize(it.blocked_reason, reason_map)
        plan_items.append(
            {
                "story_id": it.story_id,
                "reason_code": reason_code,
                "blockedReason": it.blocked_reason,
                "actions": suggest_actions(reason_code, it.story_id, it.blocked_reason),
            }
        )

    plan_path = out_dir / "plan.json"
    report_path = out_dir / "report.md"

    plan_path.write_text(
        json.dumps({"version": "0.1", "items": plan_items}, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )

    report_lines: List[str] = ["# Doc Repair Plan Report (v0.1)", ""]
    if not plan_items:
        report_lines.extend(
            [
                "- Uyarı: summary.md içinde parse edilebilir Blocked Reasons bulunamadı.",
                "",
            ]
        )

    for p in plan_items:
        report_lines.append(f"## {p['story_id']}")
        report_lines.append(f"- reason_code: `{p['reason_code']}`")
        if p.get("blockedReason"):
            report_lines.append(f"- blockedReason: {p['blockedReason']}")
        report_lines.append("- actions:")
        for a in p.get("actions") or []:
            report_lines.append(f"  - {a['op']}: {a['summary']} (target: {a['target']})")
        report_lines.append("")

    report_path.write_text("\n".join(report_lines).rstrip() + "\n", encoding="utf-8")

    def display(path: Path) -> str:
        try:
            return str(path.resolve().relative_to(ROOT))
        except Exception:
            return str(path)

    print(f"[doc_repair_plan] Wrote: {display(plan_path)} and {display(report_path)}")


def main(argv: List[str]) -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--summary", required=True, help="docflow_next autopilot summary.md path")
    ap.add_argument("--reason-map", default=str(DEFAULT_REASON_MAP))
    ap.add_argument("--out-dir", default="artifacts/doc-repair")
    args = ap.parse_args(argv[1:])

    reason_map_path = Path(args.reason_map)
    summary_path = Path(args.summary)

    reason_map = load_reason_map(reason_map_path)
    summary_text = summary_path.read_text(encoding="utf-8")
    items = parse_autopilot_summary(summary_text)

    out_dir = Path(args.out_dir)
    if not out_dir.is_absolute():
        out_dir = ROOT / out_dir

    write_outputs(items, reason_map, out_dir=out_dir)
    return 0


if __name__ == "__main__":
    raise SystemExit(main(argv=sys.argv))
