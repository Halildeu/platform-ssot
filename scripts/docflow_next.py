#!/usr/bin/env python3
"""
Basit docflow step engine (plan/run/autopilot).

Kullanım:
  # Plan (legacy)
  python3 scripts/docflow_next.py STORY-0007

  # Plan (explicit)
  python3 scripts/docflow_next.py plan STORY-0007

  # Run (seçili seviye)
  python3 scripts/docflow_next.py run STORY-0007 --level L1

  # Autopilot (PROJECT-FLOW önceliği + M olgunluk + delta)
  python3 scripts/docflow_next.py autopilot --max-run 5

Amaç:
- Verilen bir STORY ID için script setlerini adım adım listelemek (`plan`).
- Seçili seviye için script setini koşturmak (`run`).
- PROJECT-FLOW tablosuna göre aday seçip seviye artışı (delta) varsa koşturmak (`autopilot`).

Not:
- `plan` yalnızca step listesi üretir.
- `run` ve `autopilot` script setlerini sırayla çalıştırır (veya `--dry-run` ile sadece yazdırır).
"""

from __future__ import annotations

import argparse
import json
import math
import os
import re
import subprocess
import sys
import time
from collections import defaultdict
from dataclasses import dataclass, asdict, field
from datetime import datetime, timezone, timedelta
from pathlib import Path
from typing import Any, Dict, List, Optional
from zoneinfo import ZoneInfo


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_PROJECT_FLOW_MD = ROOT / "docs/03-delivery/PROJECT-FLOW.md"
DEFAULT_PROJECT_FLOW_TSV = ROOT / "docs/03-delivery/PROJECT-FLOW.tsv"
DEFAULT_TIMINGS_JSONL = ROOT / "web/test-results/ops/timings.jsonl"
DEFAULT_PERF_SUMMARY_MD = ROOT / "web/test-results/ops/perf-summary.md"
DEFAULT_OPS_LOGS_DIR = ROOT / "web/test-results/ops/logs"

LEVEL_RANK = {"L0": 0, "L1": 1, "L2": 2, "L3": 3}
MATURITY_TO_LEVEL = {"M1": "L1", "M2": "L2", "M3": "L3"}
VALID_MODES = {"local", "ci", "nightly", "ops", "release"}
VALID_EVIDENCE_MODES = {"strict", "relaxed"}
VALID_PROFILES = {"none", "time"}
VALID_IMPACTS = {"all", "auto", "web", "backend"}
VALID_CAPTURE_LOGS = {"never", "on-fail", "always"}


@dataclass
class Step:
    step: int
    action: str
    description: str
    scripts: List[str]


@dataclass
class StoryRow:
    story_id: str
    priority: int
    status: str
    m_story: str
    m_ac: str
    m_tp: str
    l_last: str
    l_next: str
    raw_line: str
    warnings: List[str] = field(default_factory=list)


@dataclass
class CommandResult:
    command: List[str]
    exit_code: int
    duration_ms: int
    outcome: str
    first_output_line: str = ""
    note: str = ""
    output_tail: str = ""
    log_path: str = ""
    max_rss_kb: Optional[int] = None
    cpu_user_s: Optional[float] = None
    cpu_sys_s: Optional[float] = None


def now_local() -> datetime:
    """
    Timestamp SSOT: sistem saatinden, Europe/Istanbul timezone ile.
    """
    try:
        tz = ZoneInfo("Europe/Istanbul")
    except Exception:
        # tzdata olmayan ortamlarda TR sabit offset (+03:00) ile fallback.
        tz = timezone(timedelta(hours=3))
    return datetime.now(tz)


def format_ts(dt: datetime) -> str:
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone(timedelta(hours=3)))
    return dt.isoformat(timespec="seconds")


def stamp_for_filename(value: str) -> str:
    return value.replace(":", "-").replace("+", "-").replace("T", "_")


def find_story(story_id: str) -> Path:
    matches = sorted(ROOT.glob(f"docs/03-delivery/STORIES/{story_id}-*.md"))
    if not matches:
        raise SystemExit(f"STORY dosyası bulunamadı: {story_id}")
    return matches[0]


def find_acceptance_file(ac_id: str) -> Optional[Path]:
    matches = sorted(ROOT.glob(f"docs/03-delivery/ACCEPTANCE/{ac_id}-*.md"))
    return matches[0] if matches else None


def find_testplan_file(tp_id: str) -> Optional[Path]:
    matches = sorted(ROOT.glob(f"docs/03-delivery/TEST-PLANS/{tp_id}-*.md"))
    return matches[0] if matches else None


def parse_story_downstream_ids(story_path: Path) -> tuple[List[str], List[str]]:
    """
    STORY meta bloğundaki Downstream satırını okuyup AC/TP ID'lerini döner.
    Örn:
      Downstream: AC-0007, TP-0006
    """
    ac_ids: List[str] = []
    tp_ids: List[str] = []

    for line in story_path.read_text(encoding="utf-8").splitlines()[:30]:
        if line.strip().startswith("Downstream:"):
            value = line.split(":", 1)[1]
            tokens = re.split(r"[,\s]+", value)
            for tok in tokens:
                tok = tok.strip()
                if tok.startswith("AC-"):
                    ac_ids.append(tok)
                elif tok.startswith("TP-"):
                    tp_ids.append(tok)
            break

    return ac_ids, tp_ids


def build_steps(story_id: str) -> List[Step]:
    """
    AGENT-CODEX.docs 7.2 / 7.3'e göre varsayılan adım listesi.
    """
    steps: List[Step] = []

    steps.append(
        Step(
            step=1,
            action="doc_qa",
            description="Doc QA: şablon, ID ve dil kontrolleri (opsiyonel evidence: --evidence-mode strict veya nightly/relaxed).",
            scripts=[
                "scripts/check_doc_templates.py",
                "scripts/check_doc_ids.py",
                "scripts/check_doc_locations.py",
                "scripts/check_doc_language_tr.py",
            ],
        )
    )
    steps.append(
        Step(
            step=2,
            action="delivery_chain",
            description="Delivery zinciri: PROJECT-FLOW ↔ STORY/AC/TP tutarlılık kontrolü.",
            scripts=[f"scripts/check_story_links.py {story_id}"],
        )
    )
    steps.append(
        Step(
            step=3,
            action="doc_chain",
            description="End-to-end doc chain: PB→PRD→ADR→STORY→AC/TP→RUNBOOK bağlantı kontrolü.",
            scripts=[f"scripts/check_doc_chain.py {story_id}"],
        )
    )

    return steps


def resolve_project_flow_paths(project_flow: Optional[Path] = None) -> tuple[Path, Path]:
    """
    SSOT: PROJECT-FLOW.tsv
    - Varsayılan: docs/03-delivery/PROJECT-FLOW.tsv + render edilen PROJECT-FLOW.md
    - Geriye uyumluluk: TSV yoksa MD parse edilir.
    """
    if project_flow is None:
        return DEFAULT_PROJECT_FLOW_TSV, DEFAULT_PROJECT_FLOW_MD

    if project_flow.suffix.lower() == ".tsv":
        tsv_path = project_flow
        md_path = DEFAULT_PROJECT_FLOW_MD if project_flow == DEFAULT_PROJECT_FLOW_TSV else project_flow.with_suffix(".md")
        return tsv_path, md_path

    md_path = project_flow
    tsv_path = DEFAULT_PROJECT_FLOW_TSV if project_flow == DEFAULT_PROJECT_FLOW_MD else project_flow.with_suffix(".tsv")
    return tsv_path, md_path


def parse_project_flow_story_table_md(project_flow_md_path: Path) -> List[StoryRow]:
    """
    PROJECT-FLOW.md içindeki "## 2. STORY DURUM TABLOSU" altındaki ```text tablosunu parse eder.
    Not: TSV (SSOT) yoksa fallback olarak kullanılır.
    """
    if not project_flow_md_path.exists():
        raise SystemExit(f"PROJECT-FLOW bulunamadı: {project_flow_md_path}")

    in_story_table_section = False
    in_block = False
    rows: List[StoryRow] = []

    story_id_re = re.compile(r"^STORY-\d{4}\b")
    maturity_triplet_re = re.compile(r"\b(M[123])\s+(M[123])\s+(M[123])\s+(L[0-3])\s+((?:L[0-3])|—)\s*$")
    maturity_single_re = re.compile(r"\b(M[123])\s*$")
    status_re = re.compile(r"(?:(?P<emoji>[🟦🔄⏳🟩❌])\s*)?(?P<label>Done|Pending|Design|Blocked|In\s+Progress)\b")

    for line in project_flow_md_path.read_text(encoding="utf-8").splitlines():
        stripped = line.strip()

        if stripped.startswith("## 2. STORY DURUM TABLOSU"):
            in_story_table_section = True
            continue
        if not in_story_table_section:
            continue

        if stripped.startswith("```text"):
            in_block = True
            continue
        if in_block and stripped.startswith("```"):
            break
        if not in_block:
            continue

        if not stripped or not stripped.startswith("STORY-"):
            continue
        if "Story ID" in stripped:
            continue

        warnings: List[str] = []

        m_story_id = story_id_re.search(stripped)
        if not m_story_id:
            continue
        story_id = m_story_id.group(0)

        priority = 0
        m_priority = re.search(r"\b(\d+)\b", stripped[m_story_id.end() :])
        if m_priority:
            priority = int(m_priority.group(1))

        status = "UNKNOWN"
        matches = list(status_re.finditer(stripped))
        if matches:
            last = matches[-1]
            emoji = (last.group("emoji") or "").strip()
            label = (last.group("label") or "").strip()
            label = "In Progress" if label.replace("  ", " ").startswith("In") else label
            status = f"{emoji} {label}".strip()

        m_story = "M1"
        m_ac = "M1"
        m_tp = "M1"
        l_last = "L0"
        l_next = "—"

        m_triplet = maturity_triplet_re.search(stripped)
        if m_triplet:
            m_story, m_ac, m_tp, l_last, l_next = m_triplet.groups()
        else:
            m_single = maturity_single_re.search(stripped)
            if m_single:
                m_value = m_single.group(1)
                m_story = m_value
                m_ac = m_value
                m_tp = m_value
            else:
                warnings.append("M missing/invalid")

        rows.append(
            StoryRow(
                story_id=story_id,
                priority=priority,
                status=status,
                m_story=m_story,
                m_ac=m_ac,
                m_tp=m_tp,
                l_last=l_last,
                l_next=l_next,
                raw_line=line.rstrip("\n"),
                warnings=warnings,
            )
        )

    return rows


def parse_project_flow_story_table_tsv(project_flow_tsv_path: Path) -> List[StoryRow]:
    """
    PROJECT-FLOW.tsv (SSOT) satırlarını parse eder.
    Beklenen kolonlar:
    - Story ID, Öncelik, Durum
    - M_STORY, M_AC, M_TP, L_LAST, L_NEXT
    """
    if not project_flow_tsv_path.exists():
        raise SystemExit(f"PROJECT-FLOW TSV bulunamadı: {project_flow_tsv_path}")

    lines = project_flow_tsv_path.read_text(encoding="utf-8").splitlines()
    if not lines:
        return []

    header = [h.strip() for h in lines[0].split("\t")]
    idx: Dict[str, int] = {name: i for i, name in enumerate(header) if name}

    required = {"Story ID", "Öncelik", "Durum", "M_STORY", "M_AC", "M_TP", "L_LAST", "L_NEXT"}
    missing = sorted(required - set(idx.keys()))
    if missing:
        raise SystemExit(f"PROJECT-FLOW TSV kolonları eksik: {', '.join(missing)}")

    rows: List[StoryRow] = []
    for line in lines[1:]:
        if not line.strip():
            continue
        parts = line.split("\t")
        if len(parts) < len(header):
            parts += [""] * (len(header) - len(parts))

        story_id = parts[idx["Story ID"]].strip()
        if not story_id.startswith("STORY-"):
            continue

        warnings: List[str] = []

        priority = 0
        try:
            priority = int(parts[idx["Öncelik"]].strip() or 0)
        except ValueError:
            warnings.append("Priority missing/invalid")

        status = parts[idx["Durum"]].strip() or "UNKNOWN"

        def read_maturity(col: str) -> str:
            value = (parts[idx[col]] or "").strip().upper()
            if value in MATURITY_TO_LEVEL:
                return value
            warnings.append("M missing/invalid")
            return "M1"

        def read_level(col: str, default: str) -> str:
            value = (parts[idx[col]] or "").strip().upper()
            if value in LEVEL_RANK or value == "—":
                return value
            return default

        m_story = read_maturity("M_STORY")
        m_ac = read_maturity("M_AC")
        m_tp = read_maturity("M_TP")
        l_last = read_level("L_LAST", "L0") or "L0"
        l_next = read_level("L_NEXT", "—") or "—"

        rows.append(
            StoryRow(
                story_id=story_id,
                priority=priority,
                status=status,
                m_story=m_story,
                m_ac=m_ac,
                m_tp=m_tp,
                l_last=l_last,
                l_next=l_next,
                raw_line=line,
                warnings=warnings,
            )
        )

    return rows


def load_project_flow_story_table(project_flow: Optional[Path] = None) -> tuple[List[StoryRow], str, Path, Path]:
    """
    Dönüş: (rows, source, tsv_path, md_path)
    source: TSV | MD
    """
    tsv_path, md_path = resolve_project_flow_paths(project_flow)
    if tsv_path.exists():
        return parse_project_flow_story_table_tsv(tsv_path), "TSV", tsv_path, md_path
    return parse_project_flow_story_table_md(md_path), "MD", tsv_path, md_path


def read_project_flow_tsv_table(tsv_path: Path) -> tuple[List[str], List[List[str]]]:
    if not tsv_path.exists():
        raise SystemExit(f"PROJECT-FLOW TSV bulunamadı: {tsv_path}")
    lines = tsv_path.read_text(encoding="utf-8").splitlines()
    if not lines:
        raise SystemExit(f"PROJECT-FLOW TSV boş: {tsv_path}")
    header = [c.strip() for c in lines[0].split("\t")]
    body: List[List[str]] = []
    for line in lines[1:]:
        if not line.strip():
            continue
        row = line.split("\t")
        if len(row) < len(header):
            row += [""] * (len(header) - len(row))
        body.append(row)
    return header, body


def write_project_flow_tsv_table(tsv_path: Path, header: List[str], body: List[List[str]]) -> None:
    out_lines: List[str] = []
    out_lines.append("\t".join(header))
    for row in body:
        if len(row) < len(header):
            row += [""] * (len(header) - len(row))
        out_lines.append("\t".join(row[: len(header)]))
    tsv_path.write_text("\n".join(out_lines) + "\n", encoding="utf-8")


def build_story_table_text_block(header: List[str], rows: List[List[str]]) -> str:
    """
    TSV -> PROJECT-FLOW.md render çıktısı (yalnızca ```text blok içeriği).
    - Kolonlar 2 boşluk ile ayrılır.
    - Width'ler deterministik: header + tüm satırlardan hesaplanır.
    """
    widths = [len(h) for h in header]
    for row in rows:
        for i, value in enumerate(row[: len(header)]):
            widths[i] = max(widths[i], len(value))

    def fmt(values: List[str]) -> str:
        cols = []
        for i, value in enumerate(values[: len(header)]):
            cols.append(value.ljust(widths[i]))
        return "  ".join(cols).rstrip()

    lines: List[str] = []
    lines.append(fmt(header))
    lines.append(fmt(["-" * w for w in widths]))
    for row in rows:
        lines.append(fmt(row))
    return "\n".join(lines) + "\n"


def find_story_table_block_range(md_lines: List[str]) -> tuple[int, int]:
    """
    PROJECT-FLOW.md içinde "## 2. STORY DURUM TABLOSU" altındaki ```text bloğunu bulur.
    Dönüş: (start_block_idx, end_block_idx)  # end_block_idx, kapanış ``` satırının index'i
    """
    section_idx: Optional[int] = None
    start_block: Optional[int] = None
    end_block: Optional[int] = None
    for idx, line in enumerate(md_lines):
        s = line.strip()
        if s.startswith("## 2. STORY DURUM TABLOSU"):
            section_idx = idx
        if section_idx is not None and start_block is None and s.startswith("```text"):
            start_block = idx
            continue
        if start_block is not None and idx > start_block and s.startswith("```"):
            end_block = idx
            break
    if start_block is None or end_block is None:
        raise SystemExit("PROJECT-FLOW.md içinde STORY tablo kod bloğu bulunamadı.")
    return start_block, end_block


def render_project_flow_md_from_tsv(*, tsv_path: Path, md_path: Path, check: bool) -> None:
    header, rows = read_project_flow_tsv_table(tsv_path)
    block = build_story_table_text_block(header, rows)

    if not md_path.exists():
        raise SystemExit(f"PROJECT-FLOW.md bulunamadı: {md_path}")
    md_lines = md_path.read_text(encoding="utf-8").splitlines(True)
    start_block, end_block = find_story_table_block_range(md_lines)
    existing = "".join(md_lines[start_block + 1 : end_block])

    if existing == block:
        return
    if check:
        raise SystemExit(
            "PROJECT-FLOW drift: MD tablo bloğu TSV ile eşleşmiyor. Çözüm: python3 scripts/docflow_next.py render-flow"
        )

    block_lines = block.splitlines(True)
    md_path.write_text("".join(md_lines[: start_block + 1] + block_lines + md_lines[end_block:]), encoding="utf-8")


def update_project_flow_tsv_levels(tsv_path: Path, updates: Dict[str, tuple[str, str]]) -> None:
    """
    SSOT: PROJECT-FLOW.tsv içinde L_LAST / L_NEXT kolonlarını günceller.
    """
    if not updates:
        return

    header, rows = read_project_flow_tsv_table(tsv_path)
    idx: Dict[str, int] = {name: i for i, name in enumerate(header)}
    required = {"Story ID", "L_LAST", "L_NEXT"}
    missing = sorted(required - set(idx.keys()))
    if missing:
        raise SystemExit(f"PROJECT-FLOW TSV kolonları eksik: {', '.join(missing)}")

    updated: set[str] = set()
    for row in rows:
        story_id = (row[idx["Story ID"]] or "").strip()
        if story_id in updates:
            new_last, new_next = updates[story_id]
            row[idx["L_LAST"]] = new_last
            row[idx["L_NEXT"]] = new_next
            updated.add(story_id)

    missing_ids = sorted(set(updates.keys()) - updated)
    if missing_ids:
        raise SystemExit(f"PROJECT-FLOW TSV içinde güncellenemeyen STORY satırları: {', '.join(missing_ids)}")

    write_project_flow_tsv_table(tsv_path, header, rows)


def maturity_to_level(maturity: str) -> str:
    return MATURITY_TO_LEVEL.get(maturity, "L1")


MATURITY_RANK = {"M1": 1, "M2": 2, "M3": 3}


def maturity_rank(maturity: str) -> int:
    return MATURITY_RANK.get((maturity or "").strip().upper(), 1)


def min_maturity(m_story: str, m_ac: str, m_tp: str) -> str:
    values = [(m_story or "").strip().upper(), (m_ac or "").strip().upper(), (m_tp or "").strip().upper()]
    values = [v for v in values if v in MATURITY_RANK]
    if not values:
        return "M1"
    return min(values, key=maturity_rank)


def next_level_after(level: str) -> str:
    lvl = (level or "").strip().upper()
    return {"L0": "L1", "L1": "L2", "L2": "L3", "L3": ""}.get(lvl, "L1")


def level_rank(level: str) -> int:
    return LEVEL_RANK.get(level, 0)


def coerce_level(value: Any) -> str:
    if not value:
        return ""
    text = str(value).strip().upper()
    return text if text in LEVEL_RANK else ""


def ensure_parent_dir(path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)


def append_jsonl(path: Path, rows: List[Dict[str, Any]]) -> None:
    """
    Append-only JSONL writer. Tek open ile batch yazmak için kullanılır.
    """
    if not rows:
        return
    ensure_parent_dir(path)
    with path.open("a", encoding="utf-8") as fh:
        for row in rows:
            fh.write(json.dumps(row, ensure_ascii=False) + "\n")


def normalize_command_key(command: str) -> str:
    """
    Aynı script farklı STORY/AC/TP ID'leriyle çalıştığında tek anahtar altında toplanması için normalize eder.
    """
    text = command
    text = re.sub(r"\bSTORY-\d{4}\b", "STORY-XXXX", text)
    text = re.sub(r"\bAC-\d{4}\b", "AC-XXXX", text)
    text = re.sub(r"\bTP-\d{4}\b", "TP-XXXX", text)
    return text


def percentile_ms(values: List[int], p: float) -> int:
    if not values:
        return 0
    vals = sorted(values)
    idx = max(0, min(len(vals) - 1, math.ceil(p * len(vals)) - 1))
    return int(vals[idx])


def parse_flow_adr_spec(raw_line: str) -> tuple[str, str]:
    """
    PROJECT-FLOW satırından ADR ve SPEC hücrelerini best-effort çıkarır.

    Not:
    - Tablo satırlarında SPEC sütunu çok uzadığında, SPEC→Acceptance arası tek boşluğa düşebiliyor.
      Bu yüzden acceptance (AC-XXXX) token'ı SPEC hücresine yapışmışsa temizlenir.
    """
    text = raw_line.strip()
    if "\t" in text:
        parts = text.split("\t")
    else:
        parts = re.split(r"\s{2,}", text)
    adr = parts[4].strip() if len(parts) > 4 else ""
    spec = parts[5].strip() if len(parts) > 5 else ""

    if spec and re.search(r"\bAC-\d{4}\b", spec):
        matches = list(re.finditer(r"(?:✓|🔧)?\s*\(?AC-\d{4}\)?", spec))
        if matches:
            last = matches[-1]
            spec = spec[: last.start()].strip()

    return adr, spec


def classify_readiness(kind: str, raw_value: str) -> str:
    value = (raw_value or "").strip()
    if not value or value == "—":
        return "NOT_REQUIRED"
    if "🔧" in value:
        if kind == "SPEC":
            return "BLOCKED(SPEC_IN_PROGRESS)"
        if kind == "ADR":
            return "BLOCKED(ADR_IN_PROGRESS)"
        return "BLOCKED(IN_PROGRESS)"
    return "OK"


def is_api_story(story_path: Path) -> bool:
    """
    API story tespiti:
    - STORY başlığında 'API' geçmesi veya
    - Epic satırında 'API' geçmesi.
    """
    head = story_path.read_text(encoding="utf-8", errors="ignore").splitlines()[:40]
    title = head[0] if head else ""
    if re.search(r"\bAPI\b", title, flags=re.IGNORECASE):
        return True
    for line in head:
        if line.strip().startswith("Epic:"):
            epic = line.split(":", 1)[1].strip()
            if re.search(r"\bAPI\b", epic, flags=re.IGNORECASE):
                return True
            break
    return False


def extract_api_doc_paths_from_story(story_path: Path) -> List[Path]:
    """
    STORY içindeki LİNKLER bölümünden .api.md referanslarını çıkarır.
    - Tam path: docs/03-delivery/api/*.api.md
    - Sadece dosya adı: *.api.md (docs/03-delivery/api altı varsayılır)
    """
    lines = story_path.read_text(encoding="utf-8", errors="ignore").splitlines()
    in_links = False
    found: List[str] = []

    for line in lines:
        stripped = line.strip()
        if stripped.startswith("##") and "LİNKLER" in stripped.upper():
            in_links = True
            continue
        if in_links and stripped.startswith("##") and "LİNKLER" not in stripped.upper():
            break
        if not in_links:
            continue

        for m in re.findall(r"docs/03-delivery/api/[^\s)`]+\.api\.md", line):
            found.append(m)
        for m in re.findall(r"\b([A-Za-z0-9_.-]+\.api\.md)\b", line):
            found.append(f"docs/03-delivery/api/{m}")

    uniq: List[Path] = []
    seen: set[str] = set()
    for raw in found:
        p = Path(raw)
        key = p.as_posix()
        if key in seen:
            continue
        seen.add(key)
        uniq.append(p)

    return uniq

def parse_iso_dt(value: str) -> Optional[datetime]:
    try:
        dt = datetime.fromisoformat(value)
    except Exception:
        return None
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt


def is_git_available() -> bool:
    try:
        proc = subprocess.run(
            ["git", "rev-parse", "--is-inside-work-tree"],
            cwd=str(ROOT),
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
        )
    except FileNotFoundError:
        return False
    return proc.returncode == 0


def git_diff_name_only(args: List[str]) -> Optional[List[str]]:
    try:
        proc = subprocess.run(
            ["git", "diff", "--name-only", *args],
            cwd=str(ROOT),
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
        )
    except FileNotFoundError:
        return None
    if proc.returncode != 0:
        return None
    return [line.strip() for line in (proc.stdout or "").splitlines() if line.strip()]


def detect_changed_paths(*, mode: str) -> tuple[Optional[List[str]], str]:
    if not is_git_available():
        return None, "git repo yok veya git erişilemedi"

    # CI PR: base/head SHA üzerinden diff dene (checkout depth nedeniyle başarısız olabilir; o durumda fallback).
    if mode == "ci":
        event_path = (os.environ.get("GITHUB_EVENT_PATH") or "").strip()
        if event_path:
            try:
                event = json.loads(Path(event_path).read_text(encoding="utf-8"))
                pr = event.get("pull_request") if isinstance(event, dict) else None
                base_sha = pr.get("base", {}).get("sha") if isinstance(pr, dict) else None
                head_sha = pr.get("head", {}).get("sha") if isinstance(pr, dict) else None
                if base_sha and head_sha:
                    paths = git_diff_name_only([f"{base_sha}...{head_sha}"])
                    if paths is not None:
                        return paths, "ci:pull_request base...head"
            except Exception:
                pass

    # Local fallback: working tree / last commit. (En deterministik değil; diff yoksa None dönüp all'a fallback ederiz.)
    for args in (["HEAD~1...HEAD"], ["--cached"], []):
        paths = git_diff_name_only(args)
        if paths is not None:
            source = "local:HEAD~1...HEAD" if args == ["HEAD~1...HEAD"] else ("local:cached" if args == ["--cached"] else "local:working-tree")
            return paths, source

    return None, "diff alınamadı"


def classify_impact_from_paths(paths: List[str]) -> str:
    has_web = any(p.startswith("web/") for p in paths)
    has_backend = any(p.startswith("backend/") for p in paths)
    if has_web and has_backend:
        return "all"
    if has_web:
        return "web"
    if has_backend:
        return "backend"
    return "all"


def resolve_impact(impact_arg: Optional[str], *, mode: str) -> tuple[str, Optional[str]]:
    requested = (impact_arg or "").strip().lower()
    if not requested:
        requested = "auto" if mode == "ci" else "all"
    if requested != "auto":
        return requested, None

    paths, source = detect_changed_paths(mode=mode)
    if not paths:
        return "all", f"impact=auto ama diff okunamadı ({source}); impact=all"

    impact = classify_impact_from_paths(paths)
    has_web = any(p.startswith("web/") for p in paths)
    has_backend = any(p.startswith("backend/") for p in paths)
    return impact, f"impact=auto ({source}) total={len(paths)} web={has_web} backend={has_backend} => {impact}"


def is_heavy_command(cmd: List[str]) -> bool:
    if cmd == ["python3", "scripts/run_tests_all.py"]:
        return True
    if len(cmd) >= 5 and cmd[:4] == ["npm", "-C", "web", "run"] and cmd[4] == "pw:nightly":
        return True
    if any(token.endswith("mvnw") for token in cmd) and "test" in cmd:
        return True
    return False


def time_wrapper_prefix() -> List[str]:
    """
    Profiling için time wrapper seçimi:
    - Linux: /usr/bin/time -v (max_rss, cpu)
    - macOS: /usr/bin/time -p (user/sys)
    """
    time_bin = Path("/usr/bin/time")
    if not time_bin.exists():
        return []

    if sys.platform.startswith("linux"):
        return [str(time_bin), "-v"]
    if sys.platform == "darwin":
        return [str(time_bin), "-p"]
    return [str(time_bin)]


def parse_time_metrics(output: str) -> Dict[str, Any]:
    """
    /usr/bin/time çıktısından (varsa) metrikleri çıkarır.
    """
    metrics: Dict[str, Any] = {}

    # Linux: -v
    m_rss = re.search(r"Maximum resident set size \(kbytes\):\s*(\d+)", output)
    if m_rss:
        metrics["max_rss_kb"] = int(m_rss.group(1))

    m_user = re.search(r"User time \(seconds\):\s*([0-9.]+)", output)
    if m_user:
        metrics["cpu_user_s"] = float(m_user.group(1))
    m_sys = re.search(r"System time \(seconds\):\s*([0-9.]+)", output)
    if m_sys:
        metrics["cpu_sys_s"] = float(m_sys.group(1))

    # macOS: -p
    m_user_p = re.search(r"(?m)^user\\s+([0-9.]+)\\s*$", output)
    if m_user_p:
        metrics["cpu_user_s"] = float(m_user_p.group(1))
    m_sys_p = re.search(r"(?m)^sys\\s+([0-9.]+)\\s*$", output)
    if m_sys_p:
        metrics["cpu_sys_s"] = float(m_sys_p.group(1))

    return metrics

def read_state(state_path: Path) -> Dict[str, Any]:
    if not state_path.exists():
        return {}
    try:
        raw = json.loads(state_path.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return {}

    if not isinstance(raw, dict):
        return {}

    normalized: Dict[str, Any] = {}
    for story_id, rec in raw.items():
        if not isinstance(rec, dict):
            continue

        # Yeni şema: lastSuccessLevel
        if "lastSuccessLevel" in rec:
            normalized[story_id] = {
                "lastSuccessLevel": coerce_level(rec.get("lastSuccessLevel")),
                "lastRunAt": str(rec.get("lastRunAt") or ""),
                "lastResult": str(rec.get("lastResult") or ""),
            }
            continue

        # Legacy şema: lastRunLevel (sadece başarılı koşumları lastSuccessLevel'a taşıyoruz)
        legacy_level = coerce_level(rec.get("lastRunLevel"))
        legacy_result = str(rec.get("lastResult") or "").strip().upper()
        last_success_level = legacy_level if legacy_result in {"OK", "PASS"} else ""
        normalized[story_id] = {
            "lastSuccessLevel": last_success_level,
            "lastRunAt": str(rec.get("lastRunAt") or ""),
            "lastResult": str(rec.get("lastResult") or ""),
        }

    return normalized


def write_state(state_path: Path, state: Dict[str, Any]) -> None:
    ensure_parent_dir(state_path)
    state_path.write_text(json.dumps(state, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def append_ledger(ledger_path: Path, event: Dict[str, Any]) -> None:
    ensure_parent_dir(ledger_path)
    with ledger_path.open("a", encoding="utf-8") as fh:
        fh.write(json.dumps(event, ensure_ascii=False) + "\n")


def write_summary(
    summary_path: Path,
    *,
    runner: str,
    flow_source: str,
    mode: str,
    evidence_mode: str,
    impact: str,
    capture_logs: str,
    ops_checks_enabled: bool,
    started_at_local: str,
    started_at_utc: str,
    candidates: List[Dict[str, Any]],
    command_results: List[CommandResult],
    extra_notes: Optional[List[str]] = None,
) -> None:
    ensure_parent_dir(summary_path)

    lines: List[str] = []
    lines.append("# Autopilot Summary")
    lines.append("")
    lines.append(f"- Zaman (TR): {started_at_local}")
    lines.append(f"- Zaman (UTC): {started_at_utc}")
    lines.append(f"- Runner: {runner}")
    lines.append(f"- SOURCE: {flow_source}")
    lines.append(f"- Mode: {mode}")
    lines.append(f"- evidence-mode: {evidence_mode}")
    lines.append(f"- impact: {impact}")
    lines.append(f"- capture-logs: {capture_logs}")
    lines.append(f"- ops-checks: {'enabled' if ops_checks_enabled else 'disabled'}")
    lines.append("")

    version_gate_results = [
        r for r in command_results if len(r.command) >= 2 and r.command[0] == "python3" and r.command[1].endswith("scripts/check_version_gates.py")
    ]
    if version_gate_results:
        lines.append("## Version Gate")
        lines.append("")
        for r in version_gate_results:
            cmd_str = " ".join(r.command)
            hint = f" — {r.first_output_line}" if r.first_output_line else ""
            note = f" ({r.note})" if r.note else ""
            lines.append(f"- {r.outcome} (exit={r.exit_code}) `{cmd_str}`{note}{hint}")
        lines.append("")

    if candidates:
        lines.append("## Adaylar")
        lines.append("")
        lines.append(
            "| STORY | Öncelik | Durum | Olgunluk (STORY/AC/TP) | L_LAST | L_NEXT | SPEC_STATUS | ADR_STATUS | API_DOC_STATUS | OPS_DOC_STATUS | lastSuccessLevel | nextLevel | Decision | Result |"
        )
        lines.append("|---|---:|---|---|---|---|---|---|---|---|---|---|---|---|")
        for c in candidates:
            m_story = c.get("mStory", "")
            m_ac = c.get("mAc", "")
            m_tp = c.get("mTp", "")
            maturity_triplet = c.get("maturityTriplet", "") or (f"{m_story}/{m_ac}/{m_tp}" if (m_story or m_ac or m_tp) else "")

            warnings = c.get("warnings") or []
            has_m_default = any("M" in str(w) and "missing/invalid" in str(w) for w in warnings)
            maturity_display = f"{maturity_triplet} (default)" if has_m_default else maturity_triplet

            flow_l_last = c.get("flowLLast", "")
            flow_l_next = c.get("flowLNext", "")
            lines.append(
                f"| {c.get('story')} | {c.get('priority', 0)} | {c.get('status', '')} | {maturity_display} | {flow_l_last} | {flow_l_next} | {c.get('specStatus', '')} | {c.get('adrStatus', '')} | {c.get('apiDocStatus', '')} | {c.get('opsDocStatus', '')} | {c.get('lastSuccessLevel', '')} | {c.get('nextLevel', '')} | {c.get('decision', '')} | {c.get('result', '')} |"
            )
        lines.append("")

    lines.append("## Komutlar")
    lines.append("")
    lines.append("| Komut | Outcome | Exit | Süre (ms) | Not |")
    lines.append("|---|---|---:|---:|---|")
    for r in command_results:
        cmd_str = " ".join(r.command)
        note = r.note.replace("\n", " ").strip()
        lines.append(f"| `{cmd_str}` | {r.outcome} | {r.exit_code} | {r.duration_ms} | {note} |")
    lines.append("")

    slowest = sorted([r for r in command_results if r.duration_ms > 0], key=lambda r: r.duration_ms, reverse=True)[:3]
    if slowest:
        lines.append("## Performans (Top 3)")
        lines.append("")
        top = slowest[0]
        lines.append(f"- Top offender: `{(' '.join(top.command))}` ~ {top.duration_ms/1000:.1f}s ({top.duration_ms}ms)")
        for r in slowest[1:]:
            lines.append(f"- `{(' '.join(r.command))}` ~ {r.duration_ms/1000:.1f}s ({r.duration_ms}ms)")
        lines.append("")

    critical = [r for r in command_results if r.outcome in {"FAIL", "BLOCKED"}]
    if critical:
        lines.append("## Critical Only")
        lines.append("")
        for r in critical:
            cmd_str = " ".join(r.command)
            hint = f" — {r.first_output_line}" if r.first_output_line else ""
            note = f" ({r.note})" if r.note else ""
            lines.append(f"- `{cmd_str}` ({r.outcome}, exit={r.exit_code}){hint}{note}")
        lines.append("")

    blocked = [c for c in candidates if c.get("result") == "BLOCKED"]
    if blocked:
        lines.append("## Blocked Reasons")
        lines.append("")
        for c in blocked:
            story = c.get("story")
            reason = c.get("blockedReason") or ""
            lines.append(f"- {story}: {reason}")
        lines.append("")

    if extra_notes:
        lines.append("## Notlar")
        lines.append("")
        for n in extra_notes:
            lines.append(f"- {n}")
        lines.append("")

    warnings_section: List[str] = []
    for c in candidates:
        for w in c.get("warnings") or []:
            warnings_section.append(f"{c.get('story')}: {w}")
    warnings_cmd = [r for r in command_results if r.outcome == "WARN"]
    if warnings_cmd or warnings_section:
        lines.append("## Uyarılar")
        lines.append("")
        for w in sorted(set(warnings_section)):
            lines.append(f"- {w}")
        for r in warnings_cmd:
            cmd_str = " ".join(r.command)
            note = f" ({r.note})" if r.note else ""
            lines.append(f"- `{cmd_str}` WARN{note}")
        lines.append("")

    rendered = "\n".join(lines) + "\n"
    summary_path.write_text(rendered, encoding="utf-8")

    if summary_path.name == "summary.md":
        stamped_path = summary_path.with_name(f"summary-{stamp_for_filename(started_at_local)}.md")
        stamped_path.write_text(rendered, encoding="utf-8")


def build_level_commands(story_id: str, level: str, *, mode: str, evidence_mode: str, impact: str) -> List[List[str]]:
    if mode not in VALID_MODES:
        raise SystemExit(f"Geçersiz --mode: {mode!r}")
    if evidence_mode not in VALID_EVIDENCE_MODES:
        raise SystemExit(f"Geçersiz --evidence-mode: {evidence_mode!r}")

    ops_checks_enabled = mode in {"nightly", "ops", "release"}
    version_gate_mode = "local" if mode == "local" else "ci"
    version_gate_cmd = ["python3", "scripts/check_version_gates.py", "--mode", version_gate_mode]

    def include_evidence_check() -> bool:
        if evidence_mode == "strict":
            return level == "L1"
        # relaxed
        return (mode == "nightly" and level == "L1") or (mode != "nightly" and level == "L2")

    if level == "L1":
        commands: List[List[str]] = [
            ["python3", "scripts/check_doc_templates.py"],
            ["python3", "scripts/check_doc_ids.py"],
            ["python3", "scripts/check_doc_locations.py"],
            ["python3", "scripts/check_doc_language_tr.py"],
        ]
        if include_evidence_check():
            commands.append(["python3", "scripts/check_acceptance_evidence.py"])
        commands.extend(
            [
                ["python3", "scripts/check_story_links.py", story_id],
                ["python3", "scripts/check_doc_chain.py", story_id],
            ]
        )
        return commands

    if level == "L2":
        impact_normalized = (impact or "").strip().lower() or "all"
        if impact_normalized not in {"all", "web", "backend"}:
            impact_normalized = "all"

        commands: List[List[str]] = [version_gate_cmd]
        if include_evidence_check():
            commands.append(["python3", "scripts/check_acceptance_evidence.py"])

        # API readiness (gürültü olmasın): sadece API story'lerde, sadece ilgili .api.md dosyaları üzerinde.
        try:
            story_path = find_story(story_id)
            if is_api_story(story_path):
                api_paths = extract_api_doc_paths_from_story(story_path)
                for api_path in api_paths:
                    commands.insert(1, ["python3", "scripts/check_api_docs.py", api_path.as_posix()])
        except SystemExit:
            pass

        if impact_normalized in {"all", "backend"}:
            commands.append(["python3", "scripts/check_backend_service_layout.py"])
        if impact_normalized in {"all", "web"}:
            commands.append(["python3", "scripts/check_web_mfe_layout.py"])

        if impact_normalized == "web":
            commands.extend(
                [
                    ["bash", "scripts/run_lint_web.sh"],
                    ["bash", "scripts/run_tests_web.sh"],
                ]
            )
        elif impact_normalized == "backend":
            commands.extend(
                [
                    ["bash", "scripts/run_lint_backend.sh"],
                    ["bash", "scripts/run_tests_backend.sh"],
                ]
            )
        else:
            commands.extend(
                [
                    ["python3", "scripts/run_lint_all.py"],
                    ["python3", "scripts/run_tests_all.py"],
                ]
            )
        return commands

    if level == "L3":
        commands = [
            version_gate_cmd,
            ["npm", "-C", "web", "run", "pw:nightly" if mode == "nightly" else "pw:ci"],
        ]
        if ops_checks_enabled:
            commands.extend(
                [
                    ["python3", "scripts/check_runbooks_links.py"],
                    ["python3", "scripts/check_release_docs.py"],
                ]
            )
        return commands

    raise SystemExit(f"Geçersiz --level: {level!r}")


def run_command(cmd: List[str], *, dry_run: bool, profile: str) -> CommandResult:
    if dry_run:
        return CommandResult(command=cmd, exit_code=0, duration_ms=0, outcome="PASS", first_output_line="", note="dry-run")

    def is_noise_evidence_token(token: str) -> bool:
        token = token.strip()
        if not token:
            return False
        if token.startswith(("http://", "https://", "www.")):
            return True
        if "localhost" in token:
            return True
        # URL path (örn. /api/v1/...)
        if token.startswith("/"):
            return True
        return False

    def classify_nonzero(*, cmd_: List[str], exit_code: int, output_: str) -> tuple[str, str]:
        script = cmd_[1] if len(cmd_) >= 2 and cmd_[0] == "python3" else ""

        if script.endswith("scripts/check_doc_chain.py") and "LİNKLER bölümü içeren STORY bulunamadı" in output_:
            return "BLOCKED", "STORY içinde LİNKLER bölümü yok"

        if script.endswith("scripts/check_version_gates.py"):
            if exit_code == 2:
                return "BLOCKED", "Version Gate: ortam/lockfile engeli"
            return "FAIL", "Version Gate: uyumsuzluk"

        if script.endswith("scripts/check_acceptance_evidence.py"):
            missing = re.findall(r"Kanıt referansı bulunamadı:\s+`([^`]+)`", output_)
            if not missing:
                return "FAIL", "check_acceptance_evidence beklenmeyen hata"
            noise = [t for t in missing if is_noise_evidence_token(t)]
            real = [t for t in missing if t not in noise]
            if real:
                example = real[0]
                return "BLOCKED", f"Repo içi kanıt referansı bulunamadı (örn. `{example}`)"
            example = noise[0] if noise else ""
            return "WARN", f"Repo dışı URL/API kanıt referansı (noise) (örn. `{example}`)"

        return "FAIL", ""

    started = time.monotonic()
    actual_cmd = cmd
    if profile == "time" and is_heavy_command(cmd):
        prefix = time_wrapper_prefix()
        if prefix:
            actual_cmd = prefix + cmd

    proc = subprocess.run(
        actual_cmd,
        cwd=str(ROOT),
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
    )
    duration_ms = int((time.monotonic() - started) * 1000)

    output = (proc.stdout or "").strip("\n")
    if output:
        print(output)

    metrics = parse_time_metrics(output) if (profile == "time" and actual_cmd != cmd) else {}
    tail = "\n".join(output.splitlines()[-80:]).strip()

    first_line = ""
    for ln in output.splitlines():
        if ln.strip():
            first_line = ln.strip()
            break

    if proc.returncode == 0:
        script = cmd[1] if len(cmd) >= 2 and cmd[0] == "python3" else ""
        if script.endswith("scripts/check_version_gates.py") and "outcome=WARN" in first_line:
            return CommandResult(
                command=cmd,
                exit_code=0,
                duration_ms=duration_ms,
                outcome="WARN",
                first_output_line=first_line,
                note="Version Gate uyarısı",
                output_tail=tail,
                max_rss_kb=metrics.get("max_rss_kb"),
                cpu_user_s=metrics.get("cpu_user_s"),
                cpu_sys_s=metrics.get("cpu_sys_s"),
            )
        return CommandResult(
            command=cmd,
            exit_code=0,
            duration_ms=duration_ms,
            outcome="PASS",
            first_output_line=first_line,
            output_tail=tail,
            max_rss_kb=metrics.get("max_rss_kb"),
            cpu_user_s=metrics.get("cpu_user_s"),
            cpu_sys_s=metrics.get("cpu_sys_s"),
        )

    outcome, note = classify_nonzero(cmd_=cmd, exit_code=proc.returncode, output_=output)
    return CommandResult(
        command=cmd,
        exit_code=proc.returncode,
        duration_ms=duration_ms,
        outcome=outcome,
        first_output_line=first_line,
        note=note,
        output_tail=tail,
        max_rss_kb=metrics.get("max_rss_kb"),
        cpu_user_s=metrics.get("cpu_user_s"),
        cpu_sys_s=metrics.get("cpu_sys_s"),
    )


def safe_filename(value: str, *, max_len: int = 120) -> str:
    text = re.sub(r"[^A-Za-z0-9._-]+", "_", value).strip("._-")
    if not text:
        return "log"
    return text[:max_len]


def should_capture_log(capture_logs: str, outcome: str) -> bool:
    mode = (capture_logs or "").strip().lower()
    if mode == "never":
        return False
    if mode == "always":
        return True
    # on-fail
    return outcome in {"FAIL", "BLOCKED"}


def write_log_file(log_path: Path, content: str) -> None:
    try:
        ensure_parent_dir(log_path)
        log_path.write_text(content + ("\n" if content and not content.endswith("\n") else ""), encoding="utf-8")
    except Exception:
        # Best-effort: log capture asla FAIL sebebi olmasın.
        pass


def find_surefire_report_dirs(limit: int = 30) -> List[Path]:
    dirs: List[Path] = []
    try:
        for p in ROOT.glob("backend/**/target/surefire-reports"):
            if p.is_dir():
                dirs.append(p)
                if len(dirs) >= limit:
                    break
    except Exception:
        return []
    return dirs


def run_story_with_policy(
    story_id: str,
    *,
    level: str,
    mode: str,
    evidence_mode: str,
    impact: str,
    profile: str,
    capture_logs: str,
    logs_dir: Optional[Path],
    log_notes: List[str],
    dry_run: bool,
    continue_on_fail: bool,
    timing_events: List[Dict[str, Any]],
    runner: str,
) -> List[CommandResult]:
    _ = find_story(story_id)  # varlık kontrolü
    commands = build_level_commands(story_id, level, mode=mode, evidence_mode=evidence_mode, impact=impact)

    results: List[CommandResult] = []
    has_logged_dir = False
    has_surefire_pointer = False
    has_pw_pointer = False
    for cmd in commands:
        print(f"[docflow_next] Çalıştırılıyor: {' '.join(cmd)}")
        result = run_command(cmd, dry_run=dry_run, profile=profile)
        results.append(result)

        if not dry_run and logs_dir and should_capture_log(capture_logs, result.outcome):
            try:
                if not has_logged_dir:
                    log_notes.append(f"Logs: {logs_dir.as_posix()}")
                    has_logged_dir = True

                cmd_key = normalize_command_key(" ".join(cmd))
                filename = safe_filename(f"{runner}-{story_id}-{level}-{cmd_key}")
                log_path = logs_dir / f"{filename}.log"
                write_log_file(log_path, result.output_tail or result.first_output_line or "")
                result.log_path = log_path.as_posix()

                # Backend test failure: surefire-reports pointer
                is_backend_test_cmd = (
                    any("run_tests_backend.sh" in tok for tok in cmd)
                    or (len(cmd) >= 2 and cmd[0] == "python3" and cmd[1].endswith("scripts/run_tests_all.py"))
                    or (any(tok.endswith("mvnw") for tok in cmd) and "test" in cmd)
                )
                if not has_surefire_pointer and is_backend_test_cmd:
                    surefire_dirs = find_surefire_report_dirs()
                    if surefire_dirs:
                        pointer = logs_dir / "backend-surefire-reports.txt"
                        write_log_file(pointer, "\n".join(p.as_posix() for p in surefire_dirs))
                        log_notes.append(f"Surefire reports: {pointer.as_posix()}")
                        has_surefire_pointer = True

                # Playwright failure: pw reports pointer
                if (
                    not has_pw_pointer
                    and len(cmd) >= 5
                    and cmd[:4] == ["npm", "-C", "web", "run"]
                    and cmd[4].startswith("pw:")
                ):
                    pw_dir = ROOT / "web/test-results/pw"
                    if pw_dir.exists():
                        pointer = logs_dir / "playwright-reports.txt"
                        write_log_file(pointer, pw_dir.as_posix())
                        log_notes.append(f"Playwright reports: {pw_dir.as_posix()}")
                        has_pw_pointer = True
            except Exception:
                pass

        if not dry_run:
            ts_dt = now_local()
            ts_tr = format_ts(ts_dt)
            ts_utc = format_ts(ts_dt.astimezone(timezone.utc))
            event: Dict[str, Any] = {
                "ts_tr": ts_tr,
                "ts_utc": ts_utc,
                "runner": runner,
                "mode": mode,
                "evidence_mode": evidence_mode,
                "story": story_id,
                "level": level,
                "command": " ".join(cmd),
                "duration_ms": result.duration_ms,
                "exit_code": result.exit_code,
                "outcome": result.outcome,
            }
            if result.max_rss_kb is not None:
                event["max_rss_kb"] = result.max_rss_kb
            if result.cpu_user_s is not None:
                event["cpu_user_s"] = result.cpu_user_s
            if result.cpu_sys_s is not None:
                event["cpu_sys_s"] = result.cpu_sys_s
            timing_events.append(event)

        if result.outcome in {"FAIL", "BLOCKED"} and not continue_on_fail:
            break
    return results


def aggregate_story_outcome(results: List[CommandResult]) -> str:
    if any(r.outcome == "FAIL" for r in results):
        return "FAIL"
    if any(r.outcome == "BLOCKED" for r in results):
        return "BLOCKED"
    return "PASS"


def cmd_plan(story_id: str) -> int:
    _ = find_story(story_id)  # sadece varlık kontrolü
    steps = build_steps(story_id)

    print(f"Docflow adımları için STORY: {story_id}\n")
    for s in steps:
        data: Dict[str, Any] = asdict(s)
        print(f"- Step {data['step']}: {data['action']}")
        print(f"  Açıklama: {data['description']}")
        print("  Komutlar:")
        for cmd in data["scripts"]:
            print(f"    • {cmd}")
        print()
    return 0


def cmd_run(args: argparse.Namespace) -> int:
    story_id = args.story_id
    level = args.level
    mode = args.mode
    evidence_mode = args.evidence_mode
    impact, impact_note = resolve_impact(getattr(args, "impact", None), mode=mode)
    capture_logs = getattr(args, "capture_logs", "on-fail")
    profile = args.profile
    dry_run = args.dry_run
    continue_on_fail = args.continue_on_fail
    summary_path = Path(args.summary_path)
    ops_checks_enabled = mode in {"nightly", "ops", "release"}
    timing_events: List[Dict[str, Any]] = []

    started_dt_local = now_local()
    started_at_local = format_ts(started_dt_local)
    started_at_utc = format_ts(started_dt_local.astimezone(timezone.utc))

    log_notes: List[str] = []
    logs_dir: Optional[Path] = None
    if not dry_run and capture_logs != "never":
        logs_dir = DEFAULT_OPS_LOGS_DIR / stamp_for_filename(started_at_local)
    results = run_story_with_policy(
        story_id,
        level=level,
        mode=mode,
        evidence_mode=evidence_mode,
        impact=impact,
        profile=profile,
        capture_logs=capture_logs,
        logs_dir=logs_dir,
        log_notes=log_notes,
        dry_run=dry_run,
        continue_on_fail=continue_on_fail,
        timing_events=timing_events,
        runner="run",
    )
    overall_outcome = aggregate_story_outcome(results)
    overall_ok = overall_outcome == "PASS"

    spec_status = "NOT_REQUIRED"
    adr_status = "NOT_REQUIRED"
    api_doc_status = "NOT_REQUIRED"
    ops_doc_status = "NOT_REQUIRED"
    m_story = "M1"
    m_ac = "M1"
    m_tp = "M1"
    flow_l_last = "L0"
    flow_l_next = "—"
    flow_source = "MD"
    flow_tsv_path = DEFAULT_PROJECT_FLOW_TSV
    flow_md_path = DEFAULT_PROJECT_FLOW_MD
    flow_row: Optional[StoryRow] = None
    priority = 0
    warnings: List[str] = []
    status = ""

    try:
        story_path = find_story(story_id)
        rows, flow_source, flow_tsv_path, flow_md_path = load_project_flow_story_table()
        flow_row = next((r for r in rows if r.story_id == story_id), None)
        if flow_row:
            priority = flow_row.priority
            m_story = flow_row.m_story
            m_ac = flow_row.m_ac
            m_tp = flow_row.m_tp
            flow_l_last = flow_row.l_last
            flow_l_next = flow_row.l_next
            warnings = flow_row.warnings
            status = flow_row.status
            adr_raw, spec_raw = parse_flow_adr_spec(flow_row.raw_line)
            spec_status = classify_readiness("SPEC", spec_raw)
            adr_status = classify_readiness("ADR", adr_raw)

        if level_rank(level) >= level_rank("L2") and is_api_story(story_path):
            api_paths = extract_api_doc_paths_from_story(story_path)
            if not api_paths:
                api_doc_status = "BLOCKED(API_DOC_MISSING)"
            else:
                missing = [p for p in api_paths if not (ROOT / p).exists()]
                api_doc_status = "BLOCKED(API_DOC_MISSING)" if missing else "OK"

        if mode in {"nightly", "ops", "release"} and level == "L3":
            ops_doc_status = "OK"
    except Exception:
        pass

    # RUN+PASS durumunda: L_LAST/L_NEXT sadece TSV SSOT'a yazılır, ardından MD render edilir.
    if not dry_run and overall_outcome == "PASS" and flow_row and flow_tsv_path.exists():
        max_allowed_m = min_maturity(flow_row.m_story, flow_row.m_ac, flow_row.m_tp)
        max_allowed_level = maturity_to_level(max_allowed_m)
        if level_rank(level) <= level_rank(max_allowed_level):
            new_flow_l_last = level
            candidate_next = next_level_after(level)
            if candidate_next and level_rank(candidate_next) <= level_rank(max_allowed_level) and level_rank(level) < level_rank(max_allowed_level):
                new_flow_l_next = candidate_next
            else:
                new_flow_l_next = "—"
            try:
                update_project_flow_tsv_levels(flow_tsv_path, {story_id: (new_flow_l_last, new_flow_l_next)})
                render_project_flow_md_from_tsv(tsv_path=flow_tsv_path, md_path=flow_md_path, check=False)
                flow_l_last = new_flow_l_last
                flow_l_next = new_flow_l_next
            except Exception:
                # Flow update başarısızsa run sonucunu bozmayalım; sadece summary notuna düşeriz.
                pass

    candidates = [
        {
            "story": story_id,
            "priority": priority,
            "status": status,
            "mStory": m_story,
            "mAc": m_ac,
            "mTp": m_tp,
            "flowLLast": flow_l_last,
            "flowLNext": flow_l_next,
            "maturityTriplet": f"{m_story}/{m_ac}/{m_tp}",
            "warnings": warnings,
            "specStatus": spec_status,
            "adrStatus": adr_status,
            "apiDocStatus": api_doc_status,
            "opsDocStatus": ops_doc_status,
            "lastSuccessLevel": "",
            "nextLevel": level,
            "decision": "RUN",
            "result": overall_outcome,
        }
    ]
    extra_notes = ["Dry-run: komutlar çalıştırılmadı."] if dry_run else None
    if impact_note:
        extra_notes = (extra_notes or []) + [impact_note]
    if log_notes:
        extra_notes = (extra_notes or []) + log_notes
    write_summary(
        summary_path,
        runner="run",
        flow_source=flow_source,
        mode=mode,
        evidence_mode=evidence_mode,
        impact=impact,
        capture_logs=capture_logs,
        ops_checks_enabled=ops_checks_enabled,
        started_at_local=started_at_local,
        started_at_utc=started_at_utc,
        candidates=candidates,
        command_results=results,
        extra_notes=extra_notes,
    )

    if not dry_run:
        append_jsonl(DEFAULT_TIMINGS_JSONL, timing_events)
    return 0 if overall_ok else 1


def cmd_autopilot(args: argparse.Namespace) -> int:
    project_flow_arg = Path(args.project_flow)
    state_path = Path(args.state_path)
    ledger_path = Path(args.ledger_path) if args.ledger_path else None

    mode = args.mode
    evidence_mode = args.evidence_mode
    impact, impact_note = resolve_impact(getattr(args, "impact", None), mode=mode)
    capture_logs = getattr(args, "capture_logs", "on-fail")
    ops_checks_enabled = mode in {"nightly", "ops", "release"}

    if args.max_run is None:
        max_run = {"ci": 1, "local": 2, "nightly": 5, "ops": 2, "release": 1}.get(mode, 2)
    else:
        max_run = int(args.max_run)
    dry_run = args.dry_run
    force_all = args.force_all
    force_story = args.force_story
    summary_path = Path(args.summary_path)
    continue_on_fail = args.continue_on_fail
    profile = args.profile

    started_dt_local = now_local()
    started_at_local = format_ts(started_dt_local)
    started_at_utc = format_ts(started_dt_local.astimezone(timezone.utc))

    log_notes: List[str] = []
    logs_dir: Optional[Path] = None
    if not dry_run and capture_logs != "never":
        logs_dir = DEFAULT_OPS_LOGS_DIR / stamp_for_filename(started_at_local)
    rows, flow_source, flow_tsv_path, flow_md_path = load_project_flow_story_table(project_flow_arg)

    def is_done(status: str) -> bool:
        return status.strip().startswith("🟩") or "Done" in status

    candidates_sorted = sorted(
        [r for r in rows if not is_done(r.status)],
        key=lambda r: r.priority,
        reverse=True,
    )[:max_run]

    state = read_state(state_path)
    command_results: List[CommandResult] = []
    timing_events: List[Dict[str, Any]] = []
    summary_candidates: List[Dict[str, Any]] = []
    flow_level_updates: Dict[str, tuple[str, str]] = {}

    any_fail = False
    any_blocked = False
    ran_any = False

    if mode == "ci":
        print("[docflow_next] Not: mode=ci seçildi. State/ledger dosyaları CI runner'da ephemeral olabilir.")

    for row in candidates_sorted:
        max_allowed_m = min_maturity(row.m_story, row.m_ac, row.m_tp)
        max_allowed_level = maturity_to_level(max_allowed_m)
        last = state.get(row.story_id, {})
        last_success_level = coerce_level(last.get("lastSuccessLevel")) or "L0"
        last_success_level_for_summary = last_success_level
        next_level_candidate = next_level_after(last_success_level)
        next_level = (
            next_level_candidate
            if next_level_candidate and level_rank(next_level_candidate) <= level_rank(max_allowed_level)
            else ""
        )

        forced = force_all or (force_story == row.story_id)
        run_level = ""
        if forced:
            # Force yalnız delta'yı bypass eder; maxAllowedLevel sınırını aşmaz.
            run_level = next_level or max_allowed_level
        else:
            run_level = next_level
        should_run = bool(run_level)
        decision = "SKIP"
        result_label = "PASS"
        blocked_reason = ""
        next_level_display = run_level if should_run else ""

        adr_raw, spec_raw = parse_flow_adr_spec(row.raw_line)
        spec_status = classify_readiness("SPEC", spec_raw)
        adr_status = classify_readiness("ADR", adr_raw)
        api_doc_status = "NOT_REQUIRED"
        ops_doc_status = "OK" if ops_checks_enabled else "NOT_REQUIRED"

        story_path_for_readiness: Optional[Path] = None
        story_path_error = ""
        try:
            story_path_for_readiness = find_story(row.story_id)
        except SystemExit as exc:
            story_path_error = str(exc)

        if story_path_for_readiness and is_api_story(story_path_for_readiness) and level_rank(max_allowed_level) >= level_rank("L2"):
            api_paths = extract_api_doc_paths_from_story(story_path_for_readiness)
            if not api_paths:
                api_doc_status = "BLOCKED(API_DOC_MISSING)"
            else:
                missing_api = [p for p in api_paths if not (ROOT / p).exists()]
                api_doc_status = "BLOCKED(API_DOC_MISSING)" if missing_api else "OK"

        if should_run and run_level:
            blocked_reasons: List[str] = []

            story_path = story_path_for_readiness
            if story_path_error:
                blocked_reasons.append(story_path_error)

            flow_ac_ids = sorted(set(re.findall(r"AC-\d{4}", row.raw_line)))
            downstream_ac_ids: List[str] = []
            downstream_tp_ids: List[str] = []
            if story_path:
                downstream_ac_ids, downstream_tp_ids = parse_story_downstream_ids(story_path)

            required_ac_ids = flow_ac_ids or downstream_ac_ids
            if not required_ac_ids:
                blocked_reasons.append("AC bulunamadı (Flow/Downstream)")
            else:
                missing_ac = [ac for ac in required_ac_ids if not find_acceptance_file(ac)]
                if missing_ac:
                    blocked_reasons.append(f"AC dosyası yok: {', '.join(missing_ac)}")

            # TP zorunluluğu (M2+): maxAllowedM >= M2 ise Downstream TP-XXXX beklenir.
            if level_rank(max_allowed_level) >= level_rank("L2"):
                if not downstream_tp_ids:
                    blocked_reasons.append("TP bulunamadı (Downstream)")
                else:
                    missing_tp = [tp for tp in downstream_tp_ids if not find_testplan_file(tp)]
                    if missing_tp:
                        blocked_reasons.append(f"TP dosyası yok: {', '.join(missing_tp)}")

            if level_rank(max_allowed_level) >= level_rank("L2"):
                if spec_status.startswith("BLOCKED("):
                    blocked_reasons.append("SPEC_IN_PROGRESS")
                if adr_status.startswith("BLOCKED("):
                    blocked_reasons.append("ADR_IN_PROGRESS")
                if api_doc_status.startswith("BLOCKED("):
                    blocked_reasons.append("API_DOC_MISSING")

            if blocked_reasons:
                decision = "STOP"
                result_label = "BLOCKED"
                blocked_reason = "; ".join(blocked_reasons)
                any_blocked = True

                if not dry_run:
                    state[row.story_id] = {
                        "lastSuccessLevel": last_success_level,
                        "lastRunAt": started_at_local,
                        "lastResult": result_label,
                    }
                    if ledger_path:
                        append_ledger(
                            ledger_path,
                            {
                                "at": started_at_local,
                                "story": row.story_id,
                                "level": "NONE",
                                "result": result_label,
                                "reason": blocked_reason,
                            },
                        )
            else:
                ran_any = True
                decision = "RUN"

                results = run_story_with_policy(
                    row.story_id,
                    level=run_level,
                    mode=mode,
                    evidence_mode=evidence_mode,
                    impact=impact,
                    profile=profile,
                    capture_logs=capture_logs,
                    logs_dir=logs_dir,
                    log_notes=log_notes,
                    dry_run=dry_run,
                    continue_on_fail=continue_on_fail,
                    timing_events=timing_events,
                    runner="autopilot",
                )
                command_results.extend(results)
                outcome = aggregate_story_outcome(results)
                result_label = "PASS" if dry_run else outcome

                first_cmd = results[0].command if results else []
                is_version_gate_only_stop = (
                    len(first_cmd) >= 2
                    and first_cmd[0] == "python3"
                    and first_cmd[1].endswith("scripts/check_version_gates.py")
                    and outcome in {"FAIL", "BLOCKED"}
                )
                if is_version_gate_only_stop:
                    decision = "STOP"
                    gate_note = results[0].note or results[0].first_output_line
                    if gate_note:
                        blocked_reason = gate_note

                if not dry_run:
                    if result_label == "BLOCKED":
                        first_block = next((r for r in results if r.outcome == "BLOCKED"), None)
                        if first_block:
                            blocked_reason = first_block.note or first_block.first_output_line
                    state[row.story_id] = {
                        "lastSuccessLevel": run_level if outcome == "PASS" else last_success_level,
                        "lastRunAt": started_at_local,
                        "lastResult": outcome,
                    }
                    if ledger_path:
                        append_ledger(
                            ledger_path, {"at": started_at_local, "story": row.story_id, "level": run_level, "result": outcome}
                        )
                    if outcome == "PASS":
                        last_success_level_for_summary = run_level
                        new_flow_l_last = run_level
                        candidate_next = next_level_after(run_level)
                        if candidate_next and level_rank(candidate_next) <= level_rank(max_allowed_level) and level_rank(run_level) < level_rank(max_allowed_level):
                            new_flow_l_next = candidate_next
                        else:
                            new_flow_l_next = "—"
                        row.l_last = new_flow_l_last
                        row.l_next = new_flow_l_next
                        flow_level_updates[row.story_id] = (new_flow_l_last, new_flow_l_next)

                if outcome == "FAIL":
                    any_fail = True
                elif outcome == "BLOCKED":
                    any_blocked = True

        summary_candidates.append(
            {
                "story": row.story_id,
                "priority": row.priority,
                "status": row.status,
                "mStory": row.m_story,
                "mAc": row.m_ac,
                "mTp": row.m_tp,
                "flowLLast": row.l_last,
                "flowLNext": row.l_next,
                "maturityTriplet": f"{row.m_story}/{row.m_ac}/{row.m_tp}",
                "warnings": row.warnings,
                "specStatus": spec_status,
                "adrStatus": adr_status,
                "apiDocStatus": api_doc_status,
                "opsDocStatus": ops_doc_status,
                "lastSuccessLevel": last_success_level_for_summary,
                "nextLevel": next_level_display,
                "decision": decision,
                "result": result_label,
                "blockedReason": blocked_reason,
            }
        )

        if any_fail and not continue_on_fail:
            break

    extra_notes: List[str] = []
    if not ran_any:
        if any_blocked:
            extra_notes.append("RUN yapılmadı; en az bir aday STOP/BLOCKED durumunda.")
        else:
            extra_notes.append("Çalıştırılacak nextLevel bulunmadı; adayların tamamı SKIP edildi.")
    if dry_run:
        extra_notes.append("Dry-run: komutlar çalıştırılmadı, state/ledger yazılmadı.")
    if impact_note:
        extra_notes.append(impact_note)
    if log_notes:
        extra_notes.extend(log_notes)

    if not dry_run and flow_level_updates:
        try:
            if not flow_tsv_path.exists():
                raise SystemExit("PROJECT-FLOW TSV SSOT bulunamadı; L_LAST/L_NEXT güncellenemedi.")
            update_project_flow_tsv_levels(flow_tsv_path, flow_level_updates)
            render_project_flow_md_from_tsv(tsv_path=flow_tsv_path, md_path=flow_md_path, check=False)
        except Exception as exc:
            any_fail = True
            extra_notes.append(f"PROJECT-FLOW güncellenemedi (L_LAST/L_NEXT): {exc}")

    write_summary(
        summary_path,
        runner="autopilot",
        flow_source=flow_source,
        mode=mode,
        evidence_mode=evidence_mode,
        impact=impact,
        capture_logs=capture_logs,
        ops_checks_enabled=ops_checks_enabled,
        started_at_local=started_at_local,
        started_at_utc=started_at_utc,
        candidates=summary_candidates,
        command_results=command_results,
        extra_notes=extra_notes,
    )

    if not dry_run:
        write_state(state_path, state)
        append_jsonl(DEFAULT_TIMINGS_JSONL, timing_events)

    return 1 if (any_fail or any_blocked) else 0


def cmd_stats(args: argparse.Namespace) -> int:
    days = int(args.days)
    limit = int(args.limit)

    path = DEFAULT_TIMINGS_JSONL
    out_path = DEFAULT_PERF_SUMMARY_MD
    ensure_parent_dir(out_path)

    if not path.exists():
        out_path.write_text("# Performance/Load Summary\n\nNo data yet.\n", encoding="utf-8")
        print(f"[docflow_next] perf-summary yazıldı: {out_path}")
        return 0

    cutoff = datetime.now(timezone.utc) - timedelta(days=days)

    rows: List[Dict[str, Any]] = []
    for line in path.read_text(encoding="utf-8", errors="ignore").splitlines():
        line = line.strip()
        if not line:
            continue
        try:
            obj = json.loads(line)
        except json.JSONDecodeError:
            continue
        if not isinstance(obj, dict):
            continue
        ts_utc = str(obj.get("ts_utc") or "")
        dt = parse_iso_dt(ts_utc)
        if not dt:
            continue
        if dt < cutoff:
            continue
        rows.append(obj)

    if not rows:
        out_path.write_text("# Performance/Load Summary\n\nNo data yet.\n", encoding="utf-8")
        print(f"[docflow_next] perf-summary yazıldı: {out_path}")
        return 0

    durations_by_cmd: Dict[str, List[int]] = defaultdict(list)
    fail_by_cmd: Dict[str, Dict[str, Any]] = defaultdict(lambda: {"count": 0, "last_seen": ""})
    totals_by_level: Dict[str, int] = defaultdict(int)
    totals_by_mode_level: Dict[tuple[str, str], int] = defaultdict(int)

    for r in rows:
        cmd = str(r.get("command") or "").strip()
        cmd_key = normalize_command_key(cmd)
        duration_ms = int(r.get("duration_ms") or 0)
        outcome = str(r.get("outcome") or "").strip().upper()
        level = str(r.get("level") or "").strip().upper()
        mode = str(r.get("mode") or "").strip()
        ts_utc = str(r.get("ts_utc") or "")

        durations_by_cmd[cmd_key].append(duration_ms)

        if level in {"L1", "L2", "L3"}:
            totals_by_level[level] += duration_ms
            if mode:
                totals_by_mode_level[(mode, level)] += duration_ms

        if outcome in {"FAIL", "BLOCKED"}:
            fail_by_cmd[cmd_key]["count"] += 1
            if ts_utc and ts_utc > fail_by_cmd[cmd_key]["last_seen"]:
                fail_by_cmd[cmd_key]["last_seen"] = ts_utc

    slow_rows: List[Dict[str, Any]] = []
    for cmd_key, values in durations_by_cmd.items():
        if not values:
            continue
        avg_ms = int(sum(values) / len(values))
        p95_ms = percentile_ms(values, 0.95)
        slow_rows.append({"command": cmd_key, "count": len(values), "avg_ms": avg_ms, "p95_ms": p95_ms})
    slow_rows.sort(key=lambda x: (x["p95_ms"], x["avg_ms"]), reverse=True)
    slow_rows = slow_rows[:limit]

    failing_rows: List[Dict[str, Any]] = []
    for cmd_key, meta in fail_by_cmd.items():
        failing_rows.append({"command": cmd_key, "count": int(meta["count"]), "last_seen": str(meta["last_seen"] or "")})
    failing_rows.sort(key=lambda x: (x["count"], x["last_seen"]), reverse=True)
    failing_rows = failing_rows[:limit]

    total_ms = sum(totals_by_level.values()) or 1

    lines: List[str] = []
    lines.append("# Performance/Load Summary")
    lines.append("")
    lines.append(f"- Window: last {days} days")
    lines.append(f"- Records: {len(rows)}")
    try:
        source_display = path.relative_to(ROOT).as_posix()
    except Exception:
        source_display = str(path)
    lines.append(f"- Source: `{source_display}`")
    lines.append("")

    lines.append("## Top Slow Commands")
    lines.append("")
    lines.append("| Komut | Count | Avg (s) | P95 (s) |")
    lines.append("|---|---:|---:|---:|")
    for s in slow_rows:
        lines.append(
            f"| `{s['command']}` | {s['count']} | {s['avg_ms']/1000:.2f} | {s['p95_ms']/1000:.2f} |"
        )
    lines.append("")

    lines.append("## Top Failing Commands")
    lines.append("")
    lines.append("| Komut | Fail/Blocked Count | Last Seen (UTC) |")
    lines.append("|---|---:|---|")
    for f in failing_rows:
        lines.append(f"| `{f['command']}` | {f['count']} | {f['last_seen'] or '-'} |")
    lines.append("")

    lines.append("## Level Süre Dağılımı")
    lines.append("")
    lines.append("| Level | Total (s) | Share |")
    lines.append("|---|---:|---:|")
    for level in ["L1", "L2", "L3"]:
        ms = totals_by_level.get(level, 0)
        lines.append(f"| {level} | {ms/1000:.1f} | {ms/total_ms:.0%} |")
    lines.append("")

    if totals_by_mode_level:
        lines.append("## Mode x Level Süre (Toplam)")
        lines.append("")
        lines.append("| Mode | Level | Total (s) |")
        lines.append("|---|---|---:|")
        for (mode, level), ms in sorted(totals_by_mode_level.items(), key=lambda x: x[1], reverse=True)[: 3 * limit]:
            lines.append(f"| {mode} | {level} | {ms/1000:.1f} |")
        lines.append("")

    lines.append("## Önerilen Aksiyonlar")
    lines.append("")
    lines.append("- Local kullanımda `--max-run` düşük tut (örn. 1–2), L2’yi sadece ihtiyaç olan story’lerde çalıştır.")
    lines.append("- `run_tests_all` pahalıysa: scope daralt (modül bazlı) veya cache (npm/maven) ile CI sürelerini düşür.")
    lines.append("- Flaky/Yetki/Ortam kaynaklı FAIL/BLOCKED için: allowlist/quarantine yaklaşımı ve “soft mode” raporlama ile başla.")
    lines.append("- L3 (Playwright) sadece nightly/ops/release modlarında; gündüz L1/L2’de kal.")
    lines.append("")

    out_path.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"[docflow_next] perf-summary yazıldı: {out_path}")
    return 0


def cmd_render_flow(args: argparse.Namespace) -> int:
    tsv_path = Path(args.tsv_path)
    md_path = Path(args.md_path)
    check = bool(args.check)

    render_project_flow_md_from_tsv(tsv_path=tsv_path, md_path=md_path, check=check)

    if check:
        print("[docflow_next] PROJECT-FLOW render-check OK.")
    else:
        print(f"[docflow_next] PROJECT-FLOW render edildi: {md_path}")
    return 0


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(prog="docflow_next.py")
    sub = parser.add_subparsers(dest="cmd")

    plan = sub.add_parser("plan", help="STORY için docflow adımlarını listeler.")
    plan.add_argument("story_id")

    run = sub.add_parser("run", help="STORY için seçili seviye script setini çalıştırır.")
    run.add_argument("story_id")
    run.add_argument("--level", choices=["L1", "L2", "L3"], required=True)
    run.add_argument("--mode", choices=sorted(VALID_MODES), default="local")
    run.add_argument("--evidence-mode", choices=sorted(VALID_EVIDENCE_MODES), default="relaxed")
    run.add_argument(
        "--impact",
        choices=sorted(VALID_IMPACTS),
        default=None,
        help="L2 scope seçimi. local default=all, ci default=auto (diff alınamazsa all).",
    )
    run.add_argument(
        "--capture-logs",
        choices=sorted(VALID_CAPTURE_LOGS),
        default="on-fail",
        help="Best-effort log capture. Default: on-fail (asla FAIL sebebi olmaz).",
    )
    run.add_argument("--profile", choices=sorted(VALID_PROFILES), default="none")
    run.add_argument("--dry-run", action="store_true")
    run.add_argument("--continue-on-fail", action="store_true")
    run.add_argument("--summary-path", default="web/test-results/ops/summary.md")

    ap = sub.add_parser("autopilot", help="PROJECT-FLOW önceliğine göre seçici koşum yapar.")
    ap.add_argument("--max-run", type=int, default=None)
    ap.add_argument("--force", dest="force_story")
    ap.add_argument("--force-all", action="store_true")
    ap.add_argument("--project-flow", default=str(DEFAULT_PROJECT_FLOW_TSV))
    ap.add_argument("--state-path", default="web/test-results/ops/autopilot_state.json")
    ap.add_argument("--ledger-path", default="web/test-results/ops/autopilot_ledger.jsonl")
    ap.add_argument("--mode", choices=sorted(VALID_MODES), default="local")
    ap.add_argument("--evidence-mode", choices=sorted(VALID_EVIDENCE_MODES), default="relaxed")
    ap.add_argument(
        "--impact",
        choices=sorted(VALID_IMPACTS),
        default=None,
        help="L2 scope seçimi. local default=all, ci default=auto (diff alınamazsa all).",
    )
    ap.add_argument(
        "--capture-logs",
        choices=sorted(VALID_CAPTURE_LOGS),
        default="on-fail",
        help="Best-effort log capture. Default: on-fail (asla FAIL sebebi olmaz).",
    )
    ap.add_argument("--profile", choices=sorted(VALID_PROFILES), default="none")
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--continue-on-fail", action="store_true")
    ap.add_argument("--summary-path", default="web/test-results/ops/summary.md")

    stats = sub.add_parser("stats", help="timings.jsonl üstünden performans özeti üretir.")
    stats.add_argument("--days", type=int, default=7)
    stats.add_argument("--limit", type=int, default=10)

    render_flow = sub.add_parser("render-flow", help="PROJECT-FLOW.tsv -> PROJECT-FLOW.md render eder.")
    render_flow.add_argument("--tsv-path", default=str(DEFAULT_PROJECT_FLOW_TSV))
    render_flow.add_argument("--md-path", default=str(DEFAULT_PROJECT_FLOW_MD))
    render_flow.add_argument("--check", action="store_true")

    return parser


def main(argv: List[str]) -> int:
    # Legacy kullanım: python3 scripts/docflow_next.py STORY-XXXX
    if len(argv) == 2 and argv[1].startswith("STORY-"):
        return cmd_plan(argv[1])

    parser = build_parser()
    args = parser.parse_args(argv[1:])

    if args.cmd == "plan":
        return cmd_plan(args.story_id)
    if args.cmd == "run":
        return cmd_run(args)
    if args.cmd == "autopilot":
        return cmd_autopilot(args)
    if args.cmd == "stats":
        return cmd_stats(args)
    if args.cmd == "render-flow":
        return cmd_render_flow(args)

    parser.print_help()
    return 1


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
