#!/usr/bin/env python3
"""
Doküman olgunluk (M1/M2/M3) rubric checker (v0.1, non-blocking).

Amaç:
- Delivery (STORY/AC/TP) + Runbook dokümanları için "proxy" olgunluk sinyali üretmek.
- PROJECT-FLOW.tsv içindeki (Declared) M_* ile dosyadan çıkan (Detected) M değerlerini
  karşılaştırmayı görünür kılmak.

Notlar:
- Bu script semantik puanlama yapmaz; basit ve deterministik proxy kriterler kullanır.
- v0.1: CI'yı kırmaz (exit code her zaman 0). Yalnızca rapor üretir.

Kullanım:
  python3 scripts/check_doc_maturity_rubric.py
  python3 scripts/check_doc_maturity_rubric.py --flow-path docs/03-delivery/PROJECT-FLOW.tsv
  python3 scripts/check_doc_maturity_rubric.py --json-out artifacts/doc-maturity/report.json
"""

from __future__ import annotations

import argparse
import json
import re
import signal
import sys
from dataclasses import asdict, dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, Iterable, List, Optional, Tuple


ROOT = Path(__file__).resolve().parents[1]

CHECKBOX_RE = re.compile(r"^\s*-\s*\[(?: |x|X)\]\s+")
ID_RE = re.compile(r"^ID:\s*([A-Za-z0-9_-]+)\b")

DOC_ID_NUM_RE = {
    "STORY": re.compile(r"\bSTORY-(\d{4})\b"),
    "ACCEPTANCE": re.compile(r"\bAC-(\d{4})\b"),
    "TEST-PLAN": re.compile(r"\bTP-(\d{4})\b"),
}

PLACEHOLDER_RE = re.compile(r"(<[^>]+>|\bTBD\b|\bTODO\b|\bFIXME\b|\.\.\.)", re.IGNORECASE)

NEGATIVE_HINT_RE = re.compile(r"\b(negatif|hatalı|invalid|edge(-| )case)\b", re.IGNORECASE)
RISK_HINT_RE = re.compile(r"\b(risk|varsayım|assumption)\b", re.IGNORECASE)


def now_utc_iso() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def read_lines(path: Path) -> List[str]:
    return path.read_text(encoding="utf-8").splitlines()


def extract_id(lines: List[str]) -> Optional[str]:
    for line in lines[:20]:
        m = ID_RE.match(line.strip())
        if m:
            return m.group(1).strip()
    return None


def normalize_heading(line: str) -> Optional[str]:
    text = line.strip()
    if not text or set(text) == {"-"}:
        return None
    if text.startswith("##"):
        text = text.lstrip("#").strip()
    if re.match(r"^\d+\.\s+\S+", text):
        return text
    return None


def split_sections(lines: List[str]) -> Dict[str, List[str]]:
    sections: Dict[str, List[str]] = {}
    current: Optional[str] = None
    for line in lines:
        heading = normalize_heading(line)
        if heading:
            current = heading
            sections.setdefault(current, [])
            continue
        if current is not None:
            sections[current].append(line.rstrip("\n"))
    return sections


def find_section(sections: Dict[str, List[str]], pattern: re.Pattern[str]) -> Optional[Tuple[str, List[str]]]:
    for heading, content in sections.items():
        if pattern.search(heading):
            return heading, content
    return None


def count_checkboxes(lines: Iterable[str]) -> int:
    return sum(1 for line in lines if CHECKBOX_RE.match(line))


def is_meaningful_line(line: str) -> bool:
    text = line.strip()
    if not text:
        return False
    if re.fullmatch(r"[-–—_]+", text):
        return False
    # Checklist marker tek başına değilse içerik sayılır.
    if CHECKBOX_RE.match(text):
        rest = CHECKBOX_RE.sub("", text).strip()
        if not rest or PLACEHOLDER_RE.search(rest):
            return False
        return True
    # Liste marker'larını kırp.
    text = re.sub(r"^\s*[-*]\s+", "", text).strip()
    if not text:
        return False
    if PLACEHOLDER_RE.search(text):
        return False
    # En az bir harf/rakam içermeli.
    return bool(re.search(r"[A-Za-z0-9ÇĞİÖŞÜçğıöşü]", text))


def section_has_content(lines: Iterable[str]) -> bool:
    return any(is_meaningful_line(line) for line in lines)


def maturity_rank(value: str) -> int:
    return {"Unknown": 0, "M1": 1, "M2": 2, "M3": 3}.get(value, 0)


@dataclass(frozen=True)
class FlowMaturity:
    m_story: str
    m_ac: str
    m_tp: str


def parse_project_flow(flow_path: Path) -> Dict[str, FlowMaturity]:
    """
    story_id -> (M_STORY, M_AC, M_TP)
    """
    if not flow_path.exists():
        return {}

    lines = flow_path.read_text(encoding="utf-8").splitlines()
    if not lines:
        return {}

    header = [h.strip() for h in lines[0].split("\t")]
    idx = {name: i for i, name in enumerate(header) if name}
    required = {"Story ID", "M_STORY", "M_AC", "M_TP"}
    if not required.issubset(set(idx)):
        return {}

    out: Dict[str, FlowMaturity] = {}
    for line in lines[1:]:
        if not line.strip():
            continue
        parts = line.split("\t")
        if len(parts) < len(header):
            parts += [""] * (len(header) - len(parts))
        story_id = (parts[idx["Story ID"]] or "").strip()
        if not story_id.startswith("STORY-"):
            continue
        out[story_id] = FlowMaturity(
            m_story=(parts[idx["M_STORY"]] or "").strip() or "Unknown",
            m_ac=(parts[idx["M_AC"]] or "").strip() or "Unknown",
            m_tp=(parts[idx["M_TP"]] or "").strip() or "Unknown",
        )
    return out


@dataclass
class DocResult:
    doc_type: str
    doc_id: str
    num: Optional[str]
    path: str
    detected: str
    declared: Optional[str]
    match: str
    reasons: List[str]


def detect_story(doc_id: str, sections: Dict[str, List[str]], full_text: str) -> Tuple[str, List[str]]:
    missing_m1: List[str] = []
    required = [
        re.compile(r"^1\.\s*AMAÇ\b", re.IGNORECASE),
        re.compile(r"^2\.\s*TANIM\b", re.IGNORECASE),
        re.compile(r"^3\.\s*KAPSAM\b", re.IGNORECASE),
        re.compile(r"^4\.\s*ACCEPTANCE\b", re.IGNORECASE),
        re.compile(r"^5\.\s*BAĞIMLILIKLAR\b", re.IGNORECASE),
        re.compile(r"^6\.\s*ÖZET\b", re.IGNORECASE),
    ]
    for pat in required:
        if not find_section(sections, pat):
            missing_m1.append(f"M1: missing_section:{pat.pattern}")
    if not doc_id.startswith("STORY-"):
        missing_m1.append("M1: missing_or_invalid_id")

    sec_accept = find_section(sections, re.compile(r"^4\.\s*ACCEPTANCE\b", re.IGNORECASE))
    sec_aim = find_section(sections, re.compile(r"^1\.\s*AMAÇ\b", re.IGNORECASE))
    sec_def = find_section(sections, re.compile(r"^2\.\s*TANIM\b", re.IGNORECASE))
    for name, sec in [("1.AMAÇ", sec_aim), ("2.TANIM", sec_def), ("4.ACCEPTANCE", sec_accept)]:
        if not sec or not section_has_content(sec[1]):
            missing_m1.append(f"M1: empty_section:{name}")
    m1_ok = not missing_m1

    missing_m2: List[str] = []
    if m1_ok:
        sec_scope = find_section(sections, re.compile(r"^3\.\s*KAPSAM\b", re.IGNORECASE))
        if not sec_scope or not section_has_content(sec_scope[1]):
            missing_m2.append("M2: empty_section:3.KAPSAM")

        if sec_accept:
            acc_checks = count_checkboxes(sec_accept[1])
        else:
            acc_checks = 0
        if acc_checks < 2:
            missing_m2.append(f"M2: acceptance_checklist_lt_2 (found={acc_checks})")

        sec_dep = find_section(sections, re.compile(r"^5\.\s*BAĞIMLILIKLAR\b", re.IGNORECASE))
        dep_text = "\n".join(sec_dep[1]) if sec_dep else ""
        if not re.search(r"(?:\bSTORY-|\bPRD-|\bPB-|\bSPEC-|\bADR-|\bRB-|docs/)", dep_text):
            missing_m2.append("M2: missing_dependency_reference")
    m2_ok = m1_ok and not missing_m2

    missing_m3: List[str] = []
    if m2_ok:
        sec_links = find_section(sections, re.compile(r"^7\.\s*LİNKLER\b", re.IGNORECASE))
        links_text = "\n".join(sec_links[1]) if sec_links else ""
        if not re.search(r"\bAC-\d{4}\b", links_text) or not re.search(r"\bTP-\d{4}\b", links_text):
            missing_m3.append("M3: links_missing_ac_or_tp")
        if not re.search(r"\bRB-[A-Za-z0-9_-]+\b|docs/04-operations/RUNBOOKS/", links_text):
            missing_m3.append("M3: links_missing_runbook_ref")
        if not RISK_HINT_RE.search(full_text):
            missing_m3.append("M3: missing_risk_or_assumption_hint")
    m3_ok = m2_ok and not missing_m3

    detected = "M3" if m3_ok else "M2" if m2_ok else "M1" if m1_ok else "Unknown"
    reasons = [] if detected == "M3" else missing_m3 if detected == "M2" else missing_m2 if detected == "M1" else missing_m1
    return detected, reasons


def detect_acceptance(doc_id: str, sections: Dict[str, List[str]], full_text: str) -> Tuple[str, List[str]]:
    missing_m1: List[str] = []
    required = [
        re.compile(r"^1\.\s*AMAÇ\b", re.IGNORECASE),
        re.compile(r"^2\.\s*KAPSAM\b", re.IGNORECASE),
        re.compile(r"^3\.\s*GIVEN\b", re.IGNORECASE),
        re.compile(r"^5\.\s*ÖZET\b", re.IGNORECASE),
    ]
    for pat in required:
        if not find_section(sections, pat):
            missing_m1.append(f"M1: missing_section:{pat.pattern}")
    if not doc_id.startswith("AC-"):
        missing_m1.append("M1: missing_or_invalid_id")

    sec_scen = find_section(sections, re.compile(r"^3\.\s*GIVEN\b", re.IGNORECASE))
    scen_checks = count_checkboxes(sec_scen[1]) if sec_scen else 0
    if scen_checks < 1:
        missing_m1.append(f"M1: scenarios_checklist_lt_1 (found={scen_checks})")
    m1_ok = not missing_m1

    missing_m2: List[str] = []
    if m1_ok:
        if scen_checks < 2:
            missing_m2.append(f"M2: scenarios_checklist_lt_2 (found={scen_checks})")
        if "Kanıt/Evidence" not in full_text:
            missing_m2.append("M2: missing_evidence_hint")
    m2_ok = m1_ok and not missing_m2

    missing_m3: List[str] = []
    if m2_ok:
        if not NEGATIVE_HINT_RE.search(full_text):
            missing_m3.append("M3: missing_negative_or_edgecase_hint")
        if not re.search(r"\bRB-[A-Za-z0-9_-]+\b|docs/04-operations/RUNBOOKS/", full_text):
            missing_m3.append("M3: missing_runbook_ref")
    m3_ok = m2_ok and not missing_m3

    detected = "M3" if m3_ok else "M2" if m2_ok else "M1" if m1_ok else "Unknown"
    reasons = [] if detected == "M3" else missing_m3 if detected == "M2" else missing_m2 if detected == "M1" else missing_m1
    return detected, reasons


def detect_test_plan(doc_id: str, sections: Dict[str, List[str]], full_text: str) -> Tuple[str, List[str]]:
    missing_m1: List[str] = []
    required = [
        re.compile(r"^1\.\s*AMAÇ\b", re.IGNORECASE),
        re.compile(r"^3\.\s*STRATEJİ\b", re.IGNORECASE),
        re.compile(r"^4\.\s*TEST SENARYOLARI\b", re.IGNORECASE),
        re.compile(r"^5\.\s*ÇEVRE\b", re.IGNORECASE),
    ]
    for pat in required:
        if not find_section(sections, pat):
            missing_m1.append(f"M1: missing_section:{pat.pattern}")
    if not doc_id.startswith("TP-"):
        missing_m1.append("M1: missing_or_invalid_id")

    sec_cases = find_section(sections, re.compile(r"^4\.\s*TEST SENARYOLARI\b", re.IGNORECASE))
    case_checks = count_checkboxes(sec_cases[1]) if sec_cases else 0
    if case_checks < 2:
        missing_m1.append(f"M1: testcases_checklist_lt_2 (found={case_checks})")
    m1_ok = not missing_m1

    missing_m2: List[str] = []
    if m1_ok:
        if case_checks < 3:
            missing_m2.append(f"M2: testcases_checklist_lt_3 (found={case_checks})")
        if not NEGATIVE_HINT_RE.search(full_text):
            missing_m2.append("M2: missing_negative_test_hint")
        sec_env = find_section(sections, re.compile(r"^5\.\s*ÇEVRE\b", re.IGNORECASE))
        if not sec_env or not section_has_content(sec_env[1]):
            missing_m2.append("M2: empty_section:5.ÇEVRE")
    m2_ok = m1_ok and not missing_m2

    missing_m3: List[str] = []
    if m2_ok:
        if not re.search(r"\b(post-deploy|smoke|playwright|health(check)?|curl)\b", full_text, re.IGNORECASE):
            missing_m3.append("M3: missing_post_deploy_validation_hint")
        if not re.search(r"\b(rollback|geri alma|roll back)\b", full_text, re.IGNORECASE):
            missing_m3.append("M3: missing_rollback_hint")
    m3_ok = m2_ok and not missing_m3

    detected = "M3" if m3_ok else "M2" if m2_ok else "M1" if m1_ok else "Unknown"
    reasons = [] if detected == "M3" else missing_m3 if detected == "M2" else missing_m2 if detected == "M1" else missing_m1
    return detected, reasons


def detect_runbook(doc_id: str, sections: Dict[str, List[str]], full_text: str) -> Tuple[str, List[str]]:
    missing_m1: List[str] = []
    required = [
        re.compile(r"^1\.\s*AMAÇ\b", re.IGNORECASE),
        re.compile(r"^3\.\s*BAŞLATMA\b", re.IGNORECASE),
        re.compile(r"^4\.\s*GÖZLEMLEME\b", re.IGNORECASE),
        re.compile(r"^5\.\s*ARIZA\b", re.IGNORECASE),
        re.compile(r"^7\.\s*LİNKLER\b", re.IGNORECASE),
    ]
    for pat in required:
        if not find_section(sections, pat):
            missing_m1.append(f"M1: missing_section:{pat.pattern}")
    if not doc_id.startswith("RB-"):
        missing_m1.append("M1: missing_or_invalid_id")

    sec_start = find_section(sections, re.compile(r"^3\.\s*BAŞLATMA\b", re.IGNORECASE))
    if not sec_start or not section_has_content(sec_start[1]):
        missing_m1.append("M1: empty_section:3.BAŞLATMA")
    m1_ok = not missing_m1

    missing_m2: List[str] = []
    if m1_ok:
        sec_obs = find_section(sections, re.compile(r"^4\.\s*GÖZLEMLEME\b", re.IGNORECASE))
        if not sec_obs or not section_has_content(sec_obs[1]):
            missing_m2.append("M2: empty_section:4.GÖZLEMLEME")
        sec_fault = find_section(sections, re.compile(r"^5\.\s*ARIZA\b", re.IGNORECASE))
        fault_checks = count_checkboxes(sec_fault[1]) if sec_fault else 0
        if fault_checks < 1:
            missing_m2.append(f"M2: fault_scenarios_lt_1 (found={fault_checks})")
        sec_links = find_section(sections, re.compile(r"^7\.\s*LİNKLER\b", re.IGNORECASE))
        links_text = "\n".join(sec_links[1]) if sec_links else ""
        if "docs/" not in links_text:
            missing_m2.append("M2: links_missing_docs_paths")
    m2_ok = m1_ok and not missing_m2

    missing_m3: List[str] = []
    if m2_ok:
        sec_fault = find_section(sections, re.compile(r"^5\.\s*ARIZA\b", re.IGNORECASE))
        fault_checks = count_checkboxes(sec_fault[1]) if sec_fault else 0
        if fault_checks < 2:
            missing_m3.append(f"M3: fault_scenarios_lt_2 (found={fault_checks})")
        sec_links = find_section(sections, re.compile(r"^7\.\s*LİNKLER\b", re.IGNORECASE))
        links_text = "\n".join(sec_links[1]) if sec_links else ""
        if not re.search(r"TECH-DESIGN|STORY:|ACCEPTANCE:|SLO/SLA:", links_text):
            missing_m3.append("M3: links_missing_core_refs")
    m3_ok = m2_ok and not missing_m3

    detected = "M3" if m3_ok else "M2" if m2_ok else "M1" if m1_ok else "Unknown"
    reasons = [] if detected == "M3" else missing_m3 if detected == "M2" else missing_m2 if detected == "M1" else missing_m1
    return detected, reasons


def detect_doc(path: Path, flow: Dict[str, FlowMaturity]) -> DocResult:
    lines = read_lines(path)
    doc_id = extract_id(lines) or ""
    full_text = "\n".join(lines)
    sections = split_sections(lines)

    if path.match("docs/03-delivery/STORIES/STORY-*.md"):
        doc_type = "STORY"
        detected, reasons = detect_story(doc_id, sections, full_text)
        num = (DOC_ID_NUM_RE["STORY"].search(doc_id) or DOC_ID_NUM_RE["STORY"].search(path.name) or None)
        num_str = num.group(1) if num else None
        declared = flow.get(f"STORY-{num_str}", FlowMaturity("Unknown", "Unknown", "Unknown")).m_story if num_str else None
    elif path.match("docs/03-delivery/ACCEPTANCE/AC-*.md"):
        doc_type = "ACCEPTANCE"
        detected, reasons = detect_acceptance(doc_id, sections, full_text)
        num = DOC_ID_NUM_RE["ACCEPTANCE"].search(doc_id) or DOC_ID_NUM_RE["ACCEPTANCE"].search(path.name)
        num_str = num.group(1) if num else None
        declared = flow.get(f"STORY-{num_str}", FlowMaturity("Unknown", "Unknown", "Unknown")).m_ac if num_str else None
    elif path.match("docs/03-delivery/TEST-PLANS/TP-*.md"):
        doc_type = "TEST-PLAN"
        detected, reasons = detect_test_plan(doc_id, sections, full_text)
        num = DOC_ID_NUM_RE["TEST-PLAN"].search(doc_id) or DOC_ID_NUM_RE["TEST-PLAN"].search(path.name)
        num_str = num.group(1) if num else None
        declared = flow.get(f"STORY-{num_str}", FlowMaturity("Unknown", "Unknown", "Unknown")).m_tp if num_str else None
    else:
        doc_type = "RUNBOOK"
        detected, reasons = detect_runbook(doc_id, sections, full_text)
        num_str = None
        declared = None

    match = "n/a"
    if declared and declared != "Unknown":
        if maturity_rank(detected) == maturity_rank(declared):
            match = "match"
        elif maturity_rank(detected) < maturity_rank(declared):
            match = "declared>detected"
        else:
            match = "detected>declared"

    return DocResult(
        doc_type=doc_type,
        doc_id=doc_id or path.stem,
        num=num_str,
        path=str(path.relative_to(ROOT)),
        detected=detected,
        declared=declared,
        match=match,
        reasons=reasons,
    )


def iter_docs() -> List[Path]:
    globs = [
        "docs/03-delivery/STORIES/STORY-*.md",
        "docs/03-delivery/ACCEPTANCE/AC-*.md",
        "docs/03-delivery/TEST-PLANS/TP-*.md",
        "docs/04-operations/RUNBOOKS/RB-*.md",
    ]
    out: List[Path] = []
    for g in globs:
        out.extend(sorted(ROOT.glob(g)))
    return out


def render_table(rows: List[DocResult]) -> None:
    print("DOC_TYPE\tID\tDECLARED\tDETECTED\tMATCH\tREASONS\tPATH")
    for r in rows:
        reasons = ";".join(r.reasons)
        if len(reasons) > 300:
            reasons = reasons[:297] + "..."
        print(
            "\t".join(
                [
                    r.doc_type,
                    r.doc_id,
                    r.declared or "",
                    r.detected,
                    r.match,
                    reasons,
                    r.path,
                ]
            )
        )


def main(argv: List[str]) -> int:
    parser = argparse.ArgumentParser(prog="check_doc_maturity_rubric.py")
    parser.add_argument(
        "--flow-path",
        help="PROJECT-FLOW.tsv path (Declared M_* comparison).",
        default=None,
    )
    parser.add_argument(
        "--json-out",
        help="Optional JSON report output path (default: none).",
        default=None,
    )
    args = parser.parse_args(argv[1:])

    flow: Dict[str, FlowMaturity] = {}
    if args.flow_path:
        flow = parse_project_flow(Path(args.flow_path))

    docs = iter_docs()
    rows = [detect_doc(p, flow=flow) for p in docs]

    render_table(rows)

    summary = {
        "generated_at_utc": now_utc_iso(),
        "total": len(rows),
        "by_detected": {
            "Unknown": sum(1 for r in rows if r.detected == "Unknown"),
            "M1": sum(1 for r in rows if r.detected == "M1"),
            "M2": sum(1 for r in rows if r.detected == "M2"),
            "M3": sum(1 for r in rows if r.detected == "M3"),
        },
        "by_match": {
            "match": sum(1 for r in rows if r.match == "match"),
            "declared>detected": sum(1 for r in rows if r.match == "declared>detected"),
            "detected>declared": sum(1 for r in rows if r.match == "detected>declared"),
            "n/a": sum(1 for r in rows if r.match == "n/a"),
        },
    }

    print("")
    print("[doc-maturity] summary:")
    print(json.dumps(summary, ensure_ascii=False))

    if args.json_out:
        out_path = Path(args.json_out)
        out_path.parent.mkdir(parents=True, exist_ok=True)
        payload = {"summary": summary, "rows": [asdict(r) for r in rows]}
        out_path.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
        print(f"[doc-maturity] json written: {out_path}")

    return 0


if __name__ == "__main__":
    # `| head` gibi pipe kullanımında BrokenPipeError gürültüsünü engelle.
    try:
        signal.signal(signal.SIGPIPE, signal.SIG_DFL)
    except Exception:
        pass
    try:
        raise SystemExit(main(sys.argv))
    except Exception as exc:
        print(f"[doc-maturity] ERROR: {exc}", file=sys.stderr)
        raise SystemExit(0)
