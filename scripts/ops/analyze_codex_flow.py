#!/usr/bin/env python3
import argparse
import json
import re
from collections import Counter
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from pathlib import Path

CHAT_DIR = Path(".autopilot-tmp/codex-chatlog")
OUT_DIR_DEFAULT = Path(".autopilot-tmp/flow-mining")


@dataclass(frozen=True)
class Session:
    source_file: str
    ts_utc: str | None
    branch: str | None
    sha: str | None
    response: str


def utc_today_yyyymmdd() -> str:
    return datetime.now(timezone.utc).strftime("%Y%m%d")


def parse_day_files(days: int) -> list[Path]:
    if not CHAT_DIR.exists():
        return []
    today = datetime.now(timezone.utc).date()
    files: list[Path] = []
    for d in range(days):
        day = (today - timedelta(days=d)).strftime("%Y%m%d")
        f = CHAT_DIR / f"{day}.md"
        if f.exists():
            files.append(f)
    return sorted(files)


RE_SESSION = re.compile(
    r"(?ms)^---\s*\n(?P<header>.*?)\n---\s*\n\s*BEGIN_CODEX_RESPONSE\s*\n(?P<body>.*?)\nEND_CODEX_RESPONSE\s*$"
)
RE_TS = re.compile(r"(?m)^ts_utc:\s*(?P<ts>[0-9T:\-Z]+)\s*$")
RE_BRANCH = re.compile(r"(?m)^branch:\s*(?P<branch>\S+)\s*$")
RE_SHA = re.compile(r"(?m)^sha:\s*(?P<sha>[0-9a-f]{7,40})\s*$", re.I)

RE_UI_MIRROR_HDR = re.compile(r"(?m)^\*\*WORK LOG\s*[–-]\s*UI Mirror\*\*\s*$", re.I)
RE_EVIDENCE_HDR = re.compile(r"(?m)^\*\*EVIDENCE POINTERS\*\*\s*$", re.I)

RE_BOLD_HDR = re.compile(r"(?m)^\*\*[^*]+\*\*\s*$")


def parse_sessions(content: str, source_file: str) -> list[Session]:
    sessions: list[Session] = []
    for m in re.finditer(RE_SESSION, content):
        header = m.group("header")
        body = m.group("body")
        ts = (RE_TS.search(header).group("ts") if RE_TS.search(header) else None)
        br = (RE_BRANCH.search(header).group("branch") if RE_BRANCH.search(header) else None)
        sha = (RE_SHA.search(header).group("sha") if RE_SHA.search(header) else None)
        sessions.append(
            Session(
                source_file=source_file,
                ts_utc=ts,
                branch=br,
                sha=sha,
                response=body,
            )
        )
    return sessions


def extract_block_lines(response: str, header_re: re.Pattern[str]) -> list[str]:
    m = header_re.search(response)
    if not m:
        return []
    start = m.end()
    tail = response[start:]

    lines = tail.splitlines()
    collected: list[str] = []
    started = False
    for ln in lines:
        if RE_BOLD_HDR.match(ln):
            break
        s = ln.rstrip("\n")
        if not s.strip() and not started:
            continue
        started = True
        if s.strip().startswith("-"):
            collected.append(s.strip())
        elif s.strip():
            # tolerate occasional non-bullet lines
            collected.append(s.strip())
    return collected


def classify_ui_mirror_line(line: str) -> str:
    l = line.strip()
    if l.startswith("- "):
        l = l[2:].strip()
    low = l.lower()
    if low.startswith("ran "):
        if " run_doc_qa_execution_log_local.py " in low or "run_doc_qa_execution_log_local.py" in low:
            return "RAN_DOC_QA_LOCAL"
        if "render-flow" in low and "docflow_next.py" in low:
            return "RAN_RENDER_FLOW"
        if " git commit" in low:
            return "RAN_GIT_COMMIT"
        if " git push" in low:
            return "RAN_GIT_PUSH"
        return "RAN_OTHER"
    if low.startswith("edited "):
        return "EDITED"
    if low.startswith("reviewed "):
        return "REVIEWED"
    if low.startswith("considering "):
        return "CONSIDERING"
    if low.startswith("explored "):
        return "EXPLORED"
    return "OTHER"


def extract_edited_target(line: str) -> str | None:
    l = line.strip()
    if l.startswith("- "):
        l = l[2:].strip()
    m = re.search(r"(?i)^edited\s+`([^`]+)`", l)
    if m:
        return m.group(1).strip()
    m = re.search(r"(?i)^edited\s+([^`(]+)", l)
    if m:
        return m.group(1).strip()
    return None


def parse_evidence_gate(evidence_lines: list[str]) -> str:
    joined = "\n".join(evidence_lines)
    if re.search(r"(?i)\bgate:\s*pass\b", joined):
        return "PASS"
    if re.search(r"(?i)\bgate:\s*fail\b", joined):
        return "FAIL"
    return "UNKNOWN"


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--days", type=int, default=7, help="How many UTC day files to scan")
    ap.add_argument("--out-dir", default=str(OUT_DIR_DEFAULT))
    args = ap.parse_args()

    out_dir = Path(args.out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    files = parse_day_files(args.days)
    if not files:
        print("[analyze_codex_flow] No chatlog daily files found in .autopilot-tmp/codex-chatlog/")
        return 0

    ui_step_counts = Counter()
    ran_line_counts = Counter()
    edited_target_counts = Counter()
    gate_counts = Counter()
    sessions_total = 0

    for f in files:
        content = f.read_text(encoding="utf-8", errors="ignore")
        sessions = parse_sessions(content, source_file=str(f))
        for s in sessions:
            sessions_total += 1

            ui_lines = extract_block_lines(s.response, RE_UI_MIRROR_HDR)
            for ln in ui_lines:
                kind = classify_ui_mirror_line(ln)
                ui_step_counts[kind] += 1
                if kind.startswith("RAN_"):
                    ran_line_counts[ln] += 1
                if kind == "EDITED":
                    tgt = extract_edited_target(ln)
                    if tgt:
                        edited_target_counts[tgt] += 1

            ev_lines = extract_block_lines(s.response, RE_EVIDENCE_HDR)
            gate = parse_evidence_gate(ev_lines)
            gate_counts[gate] += 1

    canonical = [
        "1) WORK LOG – UI Mirror (Ran/Edited/Reviewed) yaz",
        "2) Local gate: python3 scripts/run_doc_qa_execution_log_local.py --out-dir .autopilot-tmp/execution-log",
        "3) RESULT: ne çıktı? (1–5 madde, geçmiş zaman)",
        "4) EVIDENCE POINTERS: gate + execution_log + chatlog (+ branch/sha/commit/pr)",
        "5) Uygulanan Değişiklikler: dosya:line — ... (emir kipi yok)",
        "6) NEXT: none veya 1–5 gerçek iş",
        "7) Publish: git commit + git push (+ gerekiyorsa PR)",
    ]

    md: list[str] = []
    md.append("# Codex Flow Mining Report (Local)")
    md.append("")
    md.append(f"- scanned_days: {args.days}")
    md.append(f"- files: {len(files)}")
    md.append(f"- sessions: {sessions_total}")
    md.append("")
    md.append("## UI Mirror step distribution")
    total_steps = sum(ui_step_counts.values()) or 1
    for k, v in ui_step_counts.most_common():
        md.append(f"- {k}: {v} ({v/total_steps:.1%})")
    md.append("")
    md.append("## Gate outcomes (from EVIDENCE POINTERS)")
    for k, v in gate_counts.most_common():
        md.append(f"- {k}: {v}")
    md.append("")
    md.append("## Top edited targets (from UI Mirror)")
    for target, cnt in edited_target_counts.most_common(15):
        md.append(f"- {target}: {cnt}")
    md.append("")
    md.append("## Most repeated Ran lines (top 15)")
    for cmd, cnt in ran_line_counts.most_common(15):
        md.append(f"- ({cnt}x) {cmd}")
    md.append("")
    md.append("## Canonical flow v0.1 (suggested)")
    for s in canonical:
        md.append(f"- {s}")
    md.append("")
    md.append("## Notes")
    md.append(f"- Input: `{CHAT_DIR}/YYYYMMDD.md` (gitignored).")
    md.append(f"- Output: `{out_dir}/flow-report.md`, `{out_dir}/flow-stats.json` (gitignored).")
    md.append("- Bu rapor yalnız local chatlog’dan türetilir.")
    md.append("")

    (out_dir / "flow-report.md").write_text("\n".join(md) + "\n", encoding="utf-8")
    (out_dir / "flow-stats.json").write_text(
        json.dumps(
            {
                "version": "0.1",
                "days": args.days,
                "files": [str(x) for x in files],
                "sessions": sessions_total,
                "ui_step_counts": dict(ui_step_counts),
                "gate_counts": dict(gate_counts),
                "edited_targets_top": edited_target_counts.most_common(50),
                "ran_lines_top": ran_line_counts.most_common(50),
            },
            ensure_ascii=False,
            indent=2,
        )
        + "\n",
        encoding="utf-8",
    )

    print(f"[analyze_codex_flow] wrote {out_dir/'flow-report.md'} and {out_dir/'flow-stats.json'}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

