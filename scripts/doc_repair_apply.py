#!/usr/bin/env python3
"""
Doc-Repair Apply (v0.2) — safe doc patch applier.

Amaç:
- `artifacts/doc-repair/plan.json` içindeki reason_code’lara göre deterministik doküman patch’leri üretmek.
- Varsayılan: dry-run (dosya sistemi değişmez). `--apply` ile `docs/**` altında apply.

v0.2 Supported reason codes:
- STORY_LINKS_SECTION_MISSING
- AC_MISSING / AC_FILE_MISSING
- TP_MISSING / TP_FILE_MISSING

Çıktılar:
- artifacts/doc-repair/patch.diff
- artifacts/doc-repair/apply-report.md
"""

from __future__ import annotations

import argparse
import difflib
import json
import re
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Dict, Iterable, List, Optional, Tuple


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_PLAN_PATH = ROOT / "artifacts" / "doc-repair" / "plan.json"
DEFAULT_OUT_DIR = ROOT / "artifacts" / "doc-repair"

ACCEPTANCE_TEMPLATE = ROOT / "docs" / "99-templates" / "ACCEPTANCE.template.md"
TEST_PLAN_TEMPLATE = ROOT / "docs" / "99-templates" / "TEST-PLAN.template.md"
PROJECT_FLOW_TSV = ROOT / "docs" / "03-delivery" / "PROJECT-FLOW.tsv"

STORIES_DIR = ROOT / "docs" / "03-delivery" / "STORIES"
ACCEPTANCE_DIR = ROOT / "docs" / "03-delivery" / "ACCEPTANCE"
TEST_PLANS_DIR = ROOT / "docs" / "03-delivery" / "TEST-PLANS"


RE_STORY_ID = re.compile(r"\bSTORY-(\d{4})\b")
RE_AC_ID = re.compile(r"\bAC-(\d{4})\b")
RE_TP_ID = re.compile(r"\bTP-(\d{4})\b")


SUPPORTED_REASON_CODES = {
    "STORY_LINKS_SECTION_MISSING",
    "AC_MISSING",
    "AC_FILE_MISSING",
    "TP_MISSING",
    "TP_FILE_MISSING",
}


@dataclass(frozen=True)
class FileChange:
    path: Path
    old_text: Optional[str]  # None => new file
    new_text: str


@dataclass(frozen=True)
class ApplyResult:
    story_id: str
    reason_code: str
    status: str  # OK | NOOP | SKIP | ERROR
    detail: str


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def write_text(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    if not text.endswith("\n"):
        text += "\n"
    path.write_text(text, encoding="utf-8")


def relative(path: Path) -> str:
    try:
        return str(path.resolve().relative_to(ROOT))
    except Exception:
        return str(path)


def load_project_flow_acceptance_map() -> Dict[str, str]:
    """
    STORY-XXXX -> AC-XXXX mapping (PROJECT-FLOW.tsv Acceptance kolonundan).
    """
    mapping: Dict[str, str] = {}
    if not PROJECT_FLOW_TSV.exists():
        return mapping

    lines = read_text(PROJECT_FLOW_TSV).splitlines()
    if not lines:
        return mapping

    header = [h.strip() for h in lines[0].split("\t")]
    idx = {name: i for i, name in enumerate(header) if name}
    if "Story ID" not in idx or "Acceptance" not in idx:
        return mapping

    for line in lines[1:]:
        if not line.strip():
            continue
        parts = line.split("\t")
        if len(parts) < len(header):
            parts += [""] * (len(header) - len(parts))

        story_id = (parts[idx["Story ID"]] or "").strip()
        if not story_id.startswith("STORY-"):
            continue
        acceptance_cell = (parts[idx["Acceptance"]] or "").strip()
        m = RE_AC_ID.search(acceptance_cell)
        if m:
            mapping[story_id] = m.group(0)
    return mapping


def find_story_file(story_id: str) -> Optional[Path]:
    matches = sorted(STORIES_DIR.glob(f"{story_id}-*.md"))
    return matches[0] if matches else None


def extract_story_slug(story_path: Path, story_id: str) -> str:
    name = story_path.name
    if name.startswith(story_id + "-") and name.endswith(".md"):
        return name[len(story_id) + 1 : -3]
    return story_path.stem


def extract_story_title(story_text: str) -> str:
    first = (story_text.splitlines()[:1] or [""])[0].strip()
    if first.startswith("#"):
        title = first.lstrip("#").strip()
        if "–" in title:
            return title.split("–", 1)[1].strip()
        return title
    return "Story"


def extract_owner_from_story(story_text: str) -> str:
    for line in story_text.splitlines()[:20]:
        if line.startswith("Owner:"):
            return line.split(":", 1)[1].strip()
    return "TBD"


def ensure_downstream_token(story_text: str, token: str) -> str:
    """
    STORY meta bloğundaki Downstream satırına token ekler.
    Downstream yoksa meta bloğa insert eder.
    """
    lines = story_text.splitlines()

    def insert_after(idx: int, new_line: str) -> str:
        lines.insert(idx + 1, new_line)
        return "\n".join(lines) + ("\n" if story_text.endswith("\n") else "")

    downstream_idx = None
    for i, l in enumerate(lines[:25]):
        if l.startswith("Downstream:"):
            downstream_idx = i
            break

    if downstream_idx is not None:
        existing = lines[downstream_idx]
        if token in existing:
            return story_text
        lines[downstream_idx] = existing.rstrip() + f", {token}"
        return "\n".join(lines) + ("\n" if story_text.endswith("\n") else "")

    # Downstream yoksa: Upstream/Owner/Status/ID satırlarından sonra ekleyelim.
    for key in ("Upstream:", "Owner:", "Status:", "Epic:", "ID:"):
        for i, l in enumerate(lines[:25]):
            if l.startswith(key):
                return insert_after(i, f"Downstream: {token}")

    # Fallback: H1 sonrası ekle
    for i, l in enumerate(lines[:10]):
        if l.startswith("# "):
            return insert_after(i, f"Downstream: {token}")
    return story_text


def parse_links_section_bounds(lines: List[str]) -> Tuple[Optional[int], Optional[int]]:
    """
    LİNKLER bölümünün start/end line index'lerini bulur (end exclusive).
    Bulamazsa (None, None).
    """
    def is_heading(text: str) -> bool:
        s = text.strip()
        if s.startswith("## "):
            return True
        if s and not s.startswith("#") and not s.startswith("- ") and s[0].isdigit() and "." in s[:4]:
            return True
        return False

    start = None
    for idx, line in enumerate(lines):
        text = line.strip()
        if (text.startswith("##") and "LİNKLER" in text) or (is_heading(text) and "LİNKLER" in text):
            start = idx
            break
    if start is None:
        return None, None

    end = len(lines)
    for idx in range(start + 1, len(lines)):
        if is_heading(lines[idx]):
            end = idx
            break
    return start, end


def ensure_story_links_section(story_text: str) -> str:
    lines = story_text.splitlines()
    start, _ = parse_links_section_bounds(lines)
    if start is not None:
        return story_text

    # En basit: dosya sonuna ekle.
    suffix = "\n" if story_text.endswith("\n") else ""
    return (
        story_text.rstrip("\n")
        + "\n\n## 7. LİNKLER (İSTEĞE BAĞLI)\n"
        + "\n"
        + suffix
    )


def ensure_links_entries(story_text: str, additions: List[str]) -> str:
    if not additions:
        return story_text

    story_text = ensure_story_links_section(story_text)
    lines = story_text.splitlines()
    start, end = parse_links_section_bounds(lines)
    if start is None or end is None:
        return story_text

    section_lines = lines[start:end]
    section_text = "\n".join(section_lines)

    to_add: List[str] = []
    for add in additions:
        add_id = None
        m_ac = RE_AC_ID.search(add)
        m_tp = RE_TP_ID.search(add)
        if m_ac:
            add_id = m_ac.group(0)
        elif m_tp:
            add_id = m_tp.group(0)
        if add_id and add_id in section_text:
            continue
        if add in section_lines:
            continue
        to_add.append(add)

    if not to_add:
        return story_text

    insert_at = end
    if insert_at > 0 and lines[insert_at - 1].strip() != "":
        to_add = [""] + to_add

    new_lines = lines[:insert_at] + to_add + lines[insert_at:]
    return "\n".join(new_lines) + ("\n" if story_text.endswith("\n") else "")


def build_acceptance_doc(*, ac_id: str, story_stem: str, story_title: str, owner: str) -> str:
    tpl = read_text(ACCEPTANCE_TEMPLATE)
    lines = tpl.splitlines()
    if lines and lines[0].startswith("#"):
        lines[0] = f"# {ac_id} – {story_title} Acceptance"
    tpl = "\n".join(lines) + ("\n" if tpl.endswith("\n") else "")

    tpl = tpl.replace("ID: AC-XXXX", f"ID: {ac_id}")
    tpl = tpl.replace("Story: STORY-XXXX-<slug>", f"Story: {story_stem}")
    tpl = tpl.replace("Status: Planned | In Progress | Done", "Status: Planned")
    tpl = tpl.replace("Owner: <isim>", f"Owner: {owner}")
    return tpl


def build_test_plan_doc(*, tp_id: str, story_stem: str, story_title: str, owner: str) -> str:
    tpl = read_text(TEST_PLAN_TEMPLATE)
    lines = tpl.splitlines()
    if lines and lines[0].startswith("#"):
        lines[0] = f"# {tp_id} – {story_title} Test Plan"
    tpl = "\n".join(lines) + ("\n" if tpl.endswith("\n") else "")

    tpl = tpl.replace("ID: TP-XXXX", f"ID: {tp_id}")
    tpl = tpl.replace("Story: STORY-XXXX-<slug>", f"Story: {story_stem}")
    tpl = tpl.replace("Status: Planned | In-Progress | Done", "Status: Planned")
    tpl = tpl.replace("Owner: <isim>", f"Owner: {owner}")
    return tpl


def unified_diff(changes: Iterable[FileChange]) -> str:
    chunks: List[str] = []
    for c in sorted(changes, key=lambda x: str(x.path)):
        old = (c.old_text or "").splitlines(keepends=True)
        new = (c.new_text or "").splitlines(keepends=True)
        fromfile = f"a/{relative(c.path)}" if c.old_text is not None else "a/dev/null"
        tofile = f"b/{relative(c.path)}"
        diff = difflib.unified_diff(old, new, fromfile=fromfile, tofile=tofile)
        chunks.extend(diff)
    return "".join(chunks)


def main(argv: List[str]) -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--plan", default=str(DEFAULT_PLAN_PATH))
    ap.add_argument("--out-dir", default=str(DEFAULT_OUT_DIR))
    ap.add_argument("--apply", action="store_true", help="Modify docs/** (default: dry-run)")
    args = ap.parse_args(argv[1:])

    plan_path = Path(args.plan)
    if not plan_path.is_absolute():
        plan_path = ROOT / plan_path
    out_dir = Path(args.out_dir)
    if not out_dir.is_absolute():
        out_dir = ROOT / out_dir
    out_dir.mkdir(parents=True, exist_ok=True)

    if not plan_path.exists():
        print(f"[doc_repair_apply] ERROR: plan not found: {relative(plan_path)}")
        return 2

    plan = json.loads(read_text(plan_path))
    items = plan.get("items") or []
    if not isinstance(items, list):
        print("[doc_repair_apply] ERROR: invalid plan.json (items must be a list)")
        return 2

    acceptance_map = load_project_flow_acceptance_map()
    file_changes: Dict[Path, FileChange] = {}
    results: List[ApplyResult] = []

    def record_change(path: Path, new_text: str) -> None:
        if not path.is_absolute():
            path = ROOT / path
        if not str(path.resolve()).startswith(str((ROOT / "docs").resolve())):
            raise SystemExit(f"Refusing to write outside docs/**: {path}")
        old_text = read_text(path) if path.exists() else None
        file_changes[path] = FileChange(path=path, old_text=old_text, new_text=new_text)

    for it in items:
        if not isinstance(it, dict):
            continue
        story_id = str(it.get("story_id") or "").strip()
        reason_code = str(it.get("reason_code") or "UNKNOWN").strip()

        if not story_id or not story_id.startswith("STORY-"):
            continue

        if reason_code not in SUPPORTED_REASON_CODES:
            results.append(ApplyResult(story_id=story_id, reason_code=reason_code, status="SKIP", detail="Not supported in v0.2"))
            continue

        story_path = find_story_file(story_id)
        if not story_path:
            results.append(ApplyResult(story_id=story_id, reason_code=reason_code, status="ERROR", detail="STORY file not found"))
            continue

        story_text = read_text(story_path)
        story_slug = extract_story_slug(story_path, story_id)
        story_title = extract_story_title(story_text)
        owner = extract_owner_from_story(story_text)

        story_num_m = RE_STORY_ID.search(story_id)
        story_num = story_num_m.group(1) if story_num_m else ""
        ac_id = acceptance_map.get(story_id) or (f"AC-{story_num}" if story_num else "")
        tp_id = f"TP-{story_num}" if story_num else ""

        planned_story_text = story_text
        planned_doc_changes: List[str] = []

        if reason_code == "STORY_LINKS_SECTION_MISSING":
            planned_story_text = ensure_story_links_section(planned_story_text)

            additions: List[str] = []
            if ac_id:
                additions.append(f"- Acceptance: docs/03-delivery/ACCEPTANCE/{ac_id}-{story_slug}.md")
            if tp_id:
                additions.append(f"- Test Plan: docs/03-delivery/TEST-PLANS/{tp_id}-{story_slug}.md")
            planned_story_text = ensure_links_entries(planned_story_text, additions)

        if reason_code in {"AC_MISSING", "AC_FILE_MISSING"}:
            if not ac_id:
                results.append(ApplyResult(story_id=story_id, reason_code=reason_code, status="ERROR", detail="Cannot derive AC id"))
                continue

            planned_story_text = ensure_downstream_token(planned_story_text, ac_id)
            planned_story_text = ensure_links_entries(
                planned_story_text,
                [f"- Acceptance: docs/03-delivery/ACCEPTANCE/{ac_id}-{story_slug}.md"],
            )

            ac_path = ACCEPTANCE_DIR / f"{ac_id}-{story_slug}.md"
            if not ac_path.exists():
                ac_text = build_acceptance_doc(
                    ac_id=ac_id,
                    story_stem=story_path.stem,
                    story_title=story_title,
                    owner=owner,
                )
                record_change(ac_path, ac_text)
                planned_doc_changes.append(f"create {relative(ac_path)}")

        if reason_code in {"TP_MISSING", "TP_FILE_MISSING"}:
            if not tp_id:
                results.append(ApplyResult(story_id=story_id, reason_code=reason_code, status="ERROR", detail="Cannot derive TP id"))
                continue

            planned_story_text = ensure_downstream_token(planned_story_text, tp_id)
            planned_story_text = ensure_links_entries(
                planned_story_text,
                [f"- Test Plan: docs/03-delivery/TEST-PLANS/{tp_id}-{story_slug}.md"],
            )

            tp_path = TEST_PLANS_DIR / f"{tp_id}-{story_slug}.md"
            if not tp_path.exists():
                tp_text = build_test_plan_doc(
                    tp_id=tp_id,
                    story_stem=story_path.stem,
                    story_title=story_title,
                    owner=owner,
                )
                record_change(tp_path, tp_text)
                planned_doc_changes.append(f"create {relative(tp_path)}")

        # Story değişmişse kaydet
        if planned_story_text != story_text:
            record_change(story_path, planned_story_text)
            planned_doc_changes.append(f"patch {relative(story_path)}")

        if planned_doc_changes:
            results.append(
                ApplyResult(
                    story_id=story_id,
                    reason_code=reason_code,
                    status="OK",
                    detail=", ".join(planned_doc_changes),
                )
            )
        else:
            results.append(ApplyResult(story_id=story_id, reason_code=reason_code, status="NOOP", detail="No changes"))

    diff_text = unified_diff(file_changes.values())
    (out_dir / "patch.diff").write_text(diff_text, encoding="utf-8")

    report_lines = ["# Doc Repair Apply Report (v0.2)", ""]
    report_lines.append(f"- mode: {'APPLY' if args.apply else 'DRY_RUN'}")
    report_lines.append(f"- plan: `{relative(plan_path)}`")
    report_lines.append("")
    for r in results:
        report_lines.append(f"- {r.story_id} | `{r.reason_code}` | {r.status} | {r.detail}")
    report_lines.append("")
    (out_dir / "apply-report.md").write_text("\n".join(report_lines), encoding="utf-8")

    if args.apply:
        for c in file_changes.values():
            write_text(c.path, c.new_text)

    print(f"[doc_repair_apply] wrote {relative(out_dir / 'patch.diff')} and {relative(out_dir / 'apply-report.md')}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
