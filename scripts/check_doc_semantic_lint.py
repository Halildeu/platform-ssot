#!/usr/bin/env python3
"""
Local-only (non-blocking) semantic lint.

Amaç:
- LLM olmadan, rule-based “semantik bulgu + skor” üretmek.
- CI gate değildir (exit code her zaman 0).
- Çıktı: JSON + TSV.

SSOT:
- Lexicon: docs/00-handbook/DOC-SEMANTIC-LINT-LEXICON.md (JSON blok).

Örnek:
  python3 scripts/check_doc_semantic_lint.py
  python3 scripts/check_doc_semantic_lint.py --paths docs/03-delivery/STORIES/STORY-0001-foo.md
  python3 scripts/check_doc_semantic_lint.py --json-out .autopilot-tmp/doc-lint/semantic.json --tsv-out .autopilot-tmp/doc-lint/semantic.tsv
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, Iterable, List, Optional, Tuple


ROOT = Path(__file__).resolve().parents[1]

DEFAULT_LEXICON_PATH = ROOT / "docs" / "00-handbook" / "DOC-SEMANTIC-LINT-LEXICON.md"
DEFAULT_JSON_OUT = ROOT / ".autopilot-tmp" / "doc-lint" / "semantic-report.json"
DEFAULT_TSV_OUT = ROOT / ".autopilot-tmp" / "doc-lint" / "semantic-report.tsv"

DOC_ROOTS = [
    ROOT / "docs" / "03-delivery" / "STORIES",
    ROOT / "docs" / "03-delivery" / "ACCEPTANCE",
    ROOT / "docs" / "03-delivery" / "TEST-PLANS",
    ROOT / "docs" / "04-operations" / "RUNBOOKS",
]


SEVERITY_ORDER = ["BLOCKER", "HIGH", "MED", "LOW", "DEFER"]
DEFAULT_PENALTIES = {"BLOCKER": 50, "HIGH": 20, "MED": 10, "LOW": 3, "DEFER": 0}


@dataclass(frozen=True)
class Finding:
    kind: str
    severity: str
    message: str
    points: int
    samples: List[str]


@dataclass
class FileReport:
    path: str
    doc_type: str
    doc_id: str | None
    score: int
    severity_counts: Dict[str, int]
    findings: List[Finding]


def _now_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def _read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def _extract_first_json_fence(markdown: str) -> Dict[str, Any] | None:
    m = re.search(r"```json\\s*(\\{.*?\\})\\s*```", markdown, flags=re.DOTALL | re.IGNORECASE)
    if not m:
        return None
    try:
        return json.loads(m.group(1))
    except json.JSONDecodeError:
        return None


def load_lexicon(path: Path) -> Dict[str, Any]:
    """
    Lexicon SSOT'u markdown içindeki ilk ```json ... ``` bloğundan okur.
    Okunamazsa, minimal fallback döner (non-blocking).
    """
    fallback = {
        "version": "0.0",
        "ambiguity_words": ["gerekirse", "mümkünse", "uygun şekilde", "yaklaşık", "kısa sürede", "benzeri"],
        "non_testable_verbs": ["iyileştir", "optimize et", "artır", "geliştir", "güçlendir"],
        "measurement_tokens": ["ms", "s", "%", "p95", "p99", "<=", ">=", "=", "5xx", "4xx"],
        "measurement_regexes": [r"\\b\\d+\\s*ms\\b", r"\\b\\d+(?:\\.\\d+)?\\s*%\\b", r"[<>]=\\s*\\d+"],
        "severity_penalties": DEFAULT_PENALTIES,
    }
    try:
        md = _read_text(path)
        data = _extract_first_json_fence(md)
        if not data:
            return fallback
        if "severity_penalties" not in data:
            data["severity_penalties"] = DEFAULT_PENALTIES
        return data
    except Exception:
        return fallback


def iter_markdown_files(paths: List[Path]) -> List[Path]:
    out: List[Path] = []
    for p in paths:
        if p.is_dir():
            out.extend(sorted(x for x in p.rglob("*.md") if x.is_file()))
        elif p.is_file():
            out.append(p)
    return out


def is_under_any(path: Path, roots: List[Path]) -> bool:
    for r in roots:
        try:
            path.resolve().relative_to(r.resolve())
            return True
        except ValueError:
            continue
    return False


def extract_id(lines: List[str], max_lines: int = 30) -> str | None:
    for line in lines[:max_lines]:
        if line.startswith("ID:"):
            value = line.split(":", 1)[1].strip()
            return value.split()[0] if value else None
    return None


def detect_doc_type(path: Path, doc_id: str | None) -> str:
    if doc_id:
        if doc_id.startswith("STORY-"):
            return "STORY"
        if doc_id.startswith("AC-"):
            return "ACCEPTANCE"
        if doc_id.startswith("TP-"):
            return "TEST-PLAN"
        if doc_id.startswith("RB-"):
            return "RUNBOOK"

    try:
        p = "/" + path.resolve().relative_to(ROOT).as_posix()
    except Exception:
        p = path.as_posix()
    if "/docs/03-delivery/STORIES/" in p:
        return "STORY"
    if "/docs/03-delivery/ACCEPTANCE/" in p:
        return "ACCEPTANCE"
    if "/docs/03-delivery/TEST-PLANS/" in p:
        return "TEST-PLAN"
    if "/docs/04-operations/RUNBOOKS/" in p:
        return "RUNBOOK"
    return "UNKNOWN"


def _compile_phrases(phrases: Iterable[str]) -> List[Tuple[str, re.Pattern[str]]]:
    compiled: List[Tuple[str, re.Pattern[str]]] = []
    for raw in phrases:
        phrase = (raw or "").strip()
        if not phrase:
            continue
        phrase_cf = phrase.casefold()
        compiled.append((phrase, re.compile(rf"\\b{re.escape(phrase_cf)}\\b")))
    return compiled


def _count_phrase_hits(lines: List[str], compiled: List[Tuple[str, re.Pattern[str]]], max_samples: int = 3) -> Tuple[Dict[str, int], Dict[str, List[str]]]:
    counts: Dict[str, int] = {}
    samples: Dict[str, List[str]] = {}
    for idx, line in enumerate(lines, start=1):
        line_cf = line.casefold()
        for label, pat in compiled:
            hits = pat.findall(line_cf)
            if not hits:
                continue
            counts[label] = counts.get(label, 0) + len(hits)
            if len(samples.get(label, [])) < max_samples:
                samples.setdefault(label, []).append(f"L{idx}: {line.strip()}")
    return counts, samples


def _is_heading_line(text: str) -> bool:
    s = text.strip()
    if not s:
        return False
    if s.startswith("#"):
        return True
    if s.startswith("-------------------------------------------------------------------------------"):
        return True
    return re.match(r"^\\d+[\\.|\\)]\\s+\\S+", s) is not None


def _find_evidence_sections(lines: List[str]) -> List[Tuple[int, int, str]]:
    sections: List[Tuple[int, int, str]] = []
    for i, line in enumerate(lines):
        s = line.strip()
        if not _is_heading_line(s):
            continue
        s_cf = s.casefold()
        if "evidence" not in s_cf and "kanıt" not in s_cf and "kanit" not in s_cf:
            continue
        start = i + 1
        end = len(lines)
        for j in range(start, len(lines)):
            if _is_heading_line(lines[j]):
                end = j
                break
        sections.append((start, end, s))
    return sections


def _section_is_placeholder(lines: List[str]) -> bool:
    placeholders = {"tbd", "todo", "placeholder", "n/a", "yok", "boş", "bos"}
    meaningful = 0
    for line in lines:
        s = line.strip()
        if not s:
            continue
        if s.startswith("- ") or s.startswith("* "):
            # checklist maddesi sayabilir; placeholder olup olmadığını ayrıca kontrol edelim.
            s2 = s[2:].strip()
        else:
            s2 = s
        s2_cf = s2.casefold()
        if s2_cf in placeholders:
            continue
        if any(p in s2_cf for p in placeholders) and len(s2_cf) <= 20:
            continue
        # kısa tek kelime placeholder yerine, en az birkaç karakter içeren satırları anlamlı sayalım
        if len(s2_cf) >= 5:
            meaningful += 1
    return meaningful == 0


def _is_measurable(text: str, tokens_cf: List[str], regexes: List[re.Pattern[str]]) -> bool:
    t = text.casefold()
    if any(ch.isdigit() for ch in t):
        return True
    if any(tok in t for tok in tokens_cf):
        return True
    return any(rx.search(t) for rx in regexes)


def lint_file(path: Path, lexicon: Dict[str, Any]) -> FileReport:
    raw = _read_text(path)
    lines = raw.splitlines()

    doc_id = extract_id(lines)
    doc_type = detect_doc_type(path, doc_id)

    penalties: Dict[str, int] = lexicon.get("severity_penalties") or DEFAULT_PENALTIES
    ambiguity = lexicon.get("ambiguity_words") or []
    non_testable = lexicon.get("non_testable_verbs") or []
    measurement_tokens = [str(x).casefold() for x in (lexicon.get("measurement_tokens") or [])]
    measurement_regexes = [re.compile(str(x), flags=re.IGNORECASE) for x in (lexicon.get("measurement_regexes") or [])]

    findings: List[Finding] = []
    severity_counts = {k: 0 for k in SEVERITY_ORDER}

    ambiguity_compiled = _compile_phrases(ambiguity)
    non_testable_compiled = _compile_phrases(non_testable)

    # A) Ambiguity words (aggregate)
    amb_counts, amb_samples = _count_phrase_hits(lines, ambiguity_compiled)
    if amb_counts:
        distinct = len(amb_counts)
        sev = "MED" if doc_type in {"ACCEPTANCE", "TEST-PLAN"} else "LOW"
        base = penalties.get(sev, 0)
        points = base * min(3, distinct)
        samples: List[str] = []
        for w, _ in sorted(amb_counts.items(), key=lambda kv: kv[1], reverse=True)[:3]:
            samples.extend(amb_samples.get(w, [])[:1])
        msg = f"Belirsiz ifadeler bulundu (distinct={distinct}, total={sum(amb_counts.values())})."
        findings.append(Finding(kind="Ambiguity", severity=sev, message=msg, points=points, samples=samples))

    # B) Non-testable verbs (aggregate)
    nt_counts, nt_samples = _count_phrase_hits(lines, non_testable_compiled)
    if nt_counts:
        distinct = len(nt_counts)
        sev = "MED" if doc_type in {"STORY", "ACCEPTANCE", "TEST-PLAN"} else "LOW"
        base = penalties.get(sev, 0)
        points = base * min(2, distinct)
        samples: List[str] = []
        for w, _ in sorted(nt_counts.items(), key=lambda kv: kv[1], reverse=True)[:3]:
            samples.extend(nt_samples.get(w, [])[:1])
        msg = f"Test-edilemez fiil/ifade sinyali bulundu (distinct={distinct}, total={sum(nt_counts.values())})."
        findings.append(Finding(kind="NonTestableVerb", severity=sev, message=msg, points=points, samples=samples))

    # C) Acceptance: Then ambiguity / non-testable & not measurable -> HIGH
    if doc_type == "ACCEPTANCE":
        has_gwt = any("given:" in l.casefold() for l in lines) and any("when:" in l.casefold() for l in lines) and any(
            "then:" in l.casefold() for l in lines
        )
        if has_gwt:
            then_re = re.compile(r"\\bthen:\\s*(.+)", flags=re.IGNORECASE)
            for idx, line in enumerate(lines, start=1):
                m = then_re.search(line)
                if not m:
                    continue
                then_text = m.group(1).strip()
                then_cf = then_text.casefold()

                amb_in_then = [w for w, pat in ambiguity_compiled if pat.search(then_cf)]
                if amb_in_then:
                    sev = "HIGH"
                    points = penalties.get(sev, 0)
                    msg = f"Then satırı belirsiz ifade içeriyor: {', '.join(sorted(set(amb_in_then)))}."
                    findings.append(
                        Finding(kind="AC-Then-Ambiguity", severity=sev, message=msg, points=points, samples=[f"L{idx}: {line.strip()}"])
                    )

                nt_in_then = [w for w, pat in non_testable_compiled if pat.search(then_cf)]
                if nt_in_then and not _is_measurable(then_text, measurement_tokens, measurement_regexes):
                    sev = "HIGH"
                    points = penalties.get(sev, 0)
                    msg = f"Then satırı ölçümsüz/test-edilemez fiil içeriyor: {', '.join(sorted(set(nt_in_then)))}."
                    findings.append(
                        Finding(kind="AC-Then-NonTestable", severity=sev, message=msg, points=points, samples=[f"L{idx}: {line.strip()}"])
                    )

    # D) Test plan: command signal present?
    if doc_type == "TEST-PLAN":
        cmd_rx = re.compile(r"\\b(python3|npm|pnpm|bash|curl)\\b", flags=re.IGNORECASE)
        if not cmd_rx.search(raw):
            sev = "MED"
            points = penalties.get(sev, 0)
            msg = "Test plan içinde komut sinyali bulunamadı (python3/npm/pnpm/bash/curl)."
            findings.append(Finding(kind="TP-CommandSignal", severity=sev, message=msg, points=points, samples=[]))

    # E) Runbook: rollback/verify/monitoring proxy (DEFER)
    if doc_type == "RUNBOOK":
        raw_cf = raw.casefold()
        has_monitoring = "gözlemleme / log / metrikler" in raw_cf or "monitoring" in raw_cf
        if not has_monitoring:
            sev = "MED"
            points = penalties.get(sev, 0)
            findings.append(
                Finding(
                    kind="RB-MonitoringSection",
                    severity=sev,
                    message="Runbook içinde monitoring/gözlemleme bölümü sinyali bulunamadı.",
                    points=points,
                    samples=[],
                )
            )

        rollback_keywords = ["rollback", "geri alma", "geri al", "restore", "revert", "son stabil", "previous"]
        if not any(k in raw_cf for k in rollback_keywords):
            sev = "DEFER"
            points = penalties.get(sev, 0)
            findings.append(
                Finding(
                    kind="RB-RollbackProxy",
                    severity=sev,
                    message="Runbook içinde rollback/geri alma sinyali bulunamadı (defer).",
                    points=points,
                    samples=[],
                )
            )

    # F) Evidence section placeholder?
    for start, end, heading in _find_evidence_sections(lines):
        section_lines = lines[start:end]
        if _section_is_placeholder(section_lines):
            sev = "MED"
            points = penalties.get(sev, 0)
            sample = heading.strip()
            findings.append(
                Finding(
                    kind="Evidence-Empty",
                    severity=sev,
                    message="Evidence/Kanıt bölümü var ancak içerik boş/placeholder görünüyor.",
                    points=points,
                    samples=[sample],
                )
            )

    # Severity counts and score
    total_points = 0
    for f in findings:
        if f.severity not in severity_counts:
            severity_counts[f.severity] = 0
        severity_counts[f.severity] += 1
        total_points += max(0, int(f.points))

    score = max(0, 100 - total_points)
    try:
        rel_path = str(path.resolve().relative_to(ROOT))
    except Exception:
        rel_path = str(path)

    return FileReport(
        path=rel_path,
        doc_type=doc_type,
        doc_id=doc_id,
        score=score,
        severity_counts=severity_counts,
        findings=findings,
    )


def write_json(path: Path, payload: Dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def write_tsv(path: Path, reports: List[FileReport]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    header = ["PATH", "DOC_TYPE", "ID", "SCORE", "HIGH", "MED", "LOW", "DEFER", "NOTE"]
    lines: List[str] = ["\t".join(header)]
    for r in sorted(reports, key=lambda x: (x.score, x.path)):
        note = "; ".join(f"{f.kind}:{f.severity}" for f in r.findings[:3])
        lines.append(
            "\t".join(
                [
                    r.path,
                    r.doc_type,
                    r.doc_id or "",
                    str(r.score),
                    str(r.severity_counts.get("HIGH", 0)),
                    str(r.severity_counts.get("MED", 0)),
                    str(r.severity_counts.get("LOW", 0)),
                    str(r.severity_counts.get("DEFER", 0)),
                    note,
                ]
            )
        )
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main(argv: List[str]) -> int:
    parser = argparse.ArgumentParser(description="Local-only semantic lint (non-blocking).")
    parser.add_argument(
        "--lexicon-path",
        default=str(DEFAULT_LEXICON_PATH),
        help="Lexicon SSOT markdown path (contains a JSON fenced block).",
    )
    parser.add_argument(
        "--paths",
        nargs="*",
        default=[],
        help="Files/directories to scan (default: delivery docs + runbooks).",
    )
    parser.add_argument("--json-out", default=str(DEFAULT_JSON_OUT), help="JSON output path.")
    parser.add_argument("--tsv-out", default=str(DEFAULT_TSV_OUT), help="TSV output path.")
    args = parser.parse_args(argv[1:])

    lexicon_path = Path(args.lexicon_path)
    lexicon = load_lexicon(lexicon_path)

    scan_paths = [Path(p) for p in args.paths] if args.paths else DOC_ROOTS
    files = iter_markdown_files(scan_paths)
    files = [p for p in files if p.is_file() and is_under_any(p, DOC_ROOTS)]

    reports: List[FileReport] = []
    errors: List[str] = []
    for p in files:
        try:
            reports.append(lint_file(p, lexicon))
        except Exception as e:
            errors.append(f"{p}: {type(e).__name__}: {e}")

    payload: Dict[str, Any] = {
        "version": "0.1",
        "generated_at": _now_iso(),
        "lexicon_path": str(lexicon_path) if lexicon_path.is_absolute() else str(lexicon_path),
        "lexicon_version": lexicon.get("version"),
        "summary": {
            "files": len(reports),
            "avg_score": round(sum(r.score for r in reports) / len(reports), 2) if reports else 0,
            "severity_counts": {
                k: sum(r.severity_counts.get(k, 0) for r in reports) for k in SEVERITY_ORDER
            },
        },
        "files": [
            {
                "path": r.path,
                "doc_type": r.doc_type,
                "id": r.doc_id,
                "score": r.score,
                "severity_counts": r.severity_counts,
                "findings": [
                    {
                        "kind": f.kind,
                        "severity": f.severity,
                        "message": f.message,
                        "points": f.points,
                        "samples": f.samples,
                    }
                    for f in r.findings
                ],
            }
            for r in sorted(reports, key=lambda x: (x.score, x.path))
        ],
    }
    if errors:
        payload["errors"] = errors

    try:
        write_json(Path(args.json_out), payload)
    except Exception as e:
        print(f"[semantic-lint] WARN: cannot write JSON report: {e}", file=sys.stderr)

    try:
        write_tsv(Path(args.tsv_out), reports)
    except Exception as e:
        print(f"[semantic-lint] WARN: cannot write TSV report: {e}", file=sys.stderr)

    # Non-blocking: always 0
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
