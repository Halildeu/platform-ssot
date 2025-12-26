#!/usr/bin/env python3
"""
Local-only linter for Codex chat transcript format (gitignored).

Targets:
- `.autopilot-tmp/codex-chatlog/YYYYMMDD.md` (UTC), fallback: `latest.md`
- Enforces: required sections + EVIDENCE POINTERS as a ```text``` code block
- Enforces: required evidence keys and `.autopilot-tmp/` full paths (no abbreviations)

Non-blocking: always exits 0 (for now).
"""

import argparse
import re
import sys
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path

CHAT_DIR = Path(".autopilot-tmp/codex-chatlog")
DEFAULT_OUT = Path(".autopilot-tmp/flow-mining/chat-format-report.md")

RE_SESSION = re.compile(
    r"(?ms)^---\s*\n(?P<header>.*?)\n---\s*\n\s*BEGIN_CODEX_RESPONSE\s*\n(?P<body>.*?)\nEND_CODEX_RESPONSE\s*$"
)
RE_TS = re.compile(r"(?m)^ts_utc:\s*(?P<ts>[0-9T:\-Z]+)\s*$")
RE_BRANCH = re.compile(r"(?m)^branch:\s*(?P<branch>\S+)\s*$")
RE_SHA = re.compile(r"(?m)^sha:\s*(?P<sha>[0-9a-f]{7,40})\s*$", re.I)

RE_BOLD_HDR = re.compile(r"(?m)^\*\*[^*]+\*\*\s*$")
RE_EVIDENCE_HDR = re.compile(r"(?m)^\*\*EVIDENCE POINTERS\*\*\s*$")
RE_CODEBLOCK_TEXT = re.compile(r"(?ms)^```text\s*\n(?P<body>.*?)\n```$")

RE_KV = re.compile(r"(?m)^(?P<key>[a-z_]+):\s*(?P<value>.+?)\s*$")


@dataclass(frozen=True)
class Session:
    index: int
    source_file: str
    ts_utc: str | None
    branch: str | None
    sha: str | None
    body: str


def utc_today_yyyymmdd() -> str:
    return datetime.now(timezone.utc).strftime("%Y%m%d")


def default_chatlog_file() -> Path:
    return CHAT_DIR / f"{utc_today_yyyymmdd()}.md"


def parse_sessions(content: str, source_file: str) -> list[Session]:
    sessions: list[Session] = []
    for i, m in enumerate(re.finditer(RE_SESSION, content), start=1):
        header = m.group("header")
        body = m.group("body")
        ts = (RE_TS.search(header).group("ts") if RE_TS.search(header) else None)
        br = (RE_BRANCH.search(header).group("branch") if RE_BRANCH.search(header) else None)
        sha = (RE_SHA.search(header).group("sha") if RE_SHA.search(header) else None)
        sessions.append(
            Session(
                index=i,
                source_file=source_file,
                ts_utc=ts,
                branch=br,
                sha=sha,
                body=body,
            )
        )
    return sessions


def extract_section_body(body: str, header_re: re.Pattern[str]) -> str | None:
    m = header_re.search(body)
    if not m:
        return None
    start = m.end()
    tail = body[start:]
    lines = tail.splitlines()

    collected: list[str] = []
    started = False
    for ln in lines:
        if RE_BOLD_HDR.match(ln):
            break
        if not started and not ln.strip():
            continue
        started = True
        collected.append(ln.rstrip("\n"))
    return "\n".join(collected).strip()


def lint_session(s: Session) -> list[str]:
    issues: list[str] = []

    required_sections = [
        "WORK LOG – UI Mirror",
        "RESULT",
        "EVIDENCE POINTERS",
        "Uygulanan Değişiklikler",
        "NEXT",
    ]
    for sec in required_sections:
        if sec not in s.body:
            issues.append(f"missing_section: {sec}")

    evidence_section = extract_section_body(s.body, RE_EVIDENCE_HDR)
    if evidence_section is None:
        issues.append("missing_evidence_header")
        return issues

    # Evidence must be exactly one ```text ... ``` block, no extra text.
    if not evidence_section:
        issues.append("evidence_empty")
        return issues

    if not RE_CODEBLOCK_TEXT.match(evidence_section.strip()):
        issues.append("evidence_not_exact_text_codeblock")
        return issues

    ev_body = RE_CODEBLOCK_TEXT.match(evidence_section.strip()).group("body").strip()
    kv = dict((m.group("key"), m.group("value")) for m in re.finditer(RE_KV, ev_body))

    # Required keys
    for key in ["gate", "execution_log", "chatlog"]:
        if key not in kv:
            issues.append(f"evidence_missing_key: {key}")

    # Required semantics
    gate = (kv.get("gate") or "").strip().upper()
    if gate and gate not in {"PASS", "FAIL"}:
        issues.append("evidence_gate_invalid")

    execution_log = (kv.get("execution_log") or "").strip()
    if execution_log and execution_log != ".autopilot-tmp/execution-log/execution-log.md":
        issues.append("execution_log_not_literal_full_path")

    chatlog = (kv.get("chatlog") or "").strip()
    if chatlog and not re.fullmatch(r"\.autopilot-tmp/codex-chatlog/(latest|\d{8})\.md", chatlog):
        issues.append("chatlog_not_literal_full_path")

    # Optional flow mining outputs (if present)
    flow_report = (kv.get("flow_report") or "").strip()
    if flow_report and flow_report != ".autopilot-tmp/flow-mining/flow-report.md":
        issues.append("flow_report_not_literal_full_path")

    flow_stats = (kv.get("flow_stats") or "").strip()
    if flow_stats and flow_stats != ".autopilot-tmp/flow-mining/flow-stats.json":
        issues.append("flow_stats_not_literal_full_path")

    # Abbreviation ban: any path-like key must start with `.autopilot-tmp/`
    for key in ["execution_log", "chatlog", "flow_report", "flow_stats"]:
        val = (kv.get(key) or "").strip()
        if val and not val.startswith(".autopilot-tmp/"):
            issues.append(f"evidence_abbrev_or_non_autopilot_path: {key}")

    return issues


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument(
        "--file",
        default="",
        help="Chatlog file to lint (default: today's YYYYMMDD.md, fallback latest.md)",
    )
    ap.add_argument("--out", default=str(DEFAULT_OUT))
    args = ap.parse_args()

    f = Path(args.file) if args.file else default_chatlog_file()
    if not f.exists():
        f = CHAT_DIR / "latest.md"
    if not f.exists():
        print("[lint_codex_chat_format] no chatlog file found")
        return 0

    content = f.read_text(encoding="utf-8", errors="ignore")
    sessions = parse_sessions(content, source_file=str(f))

    lines: list[str] = []
    lines.append("# Codex Chat Format Lint (local-only)")
    lines.append("")
    lines.append(f"- file: `{f}`")
    lines.append(f"- sessions: {len(sessions)}")
    lines.append("")

    fail_sessions = 0
    for s in sessions:
        issues = lint_session(s)
        if issues:
            fail_sessions += 1
        meta = []
        if s.ts_utc:
            meta.append(f"ts_utc={s.ts_utc}")
        if s.branch:
            meta.append(f"branch={s.branch}")
        if s.sha:
            meta.append(f"sha={s.sha}")
        meta_s = (" (" + ", ".join(meta) + ")") if meta else ""
        lines.append(f"## Session {s.index}{meta_s}")
        if issues:
            for it in issues:
                lines.append(f"- FAIL: {it}")
        else:
            lines.append("- PASS")
        lines.append("")

    outp = Path(args.out)
    outp.parent.mkdir(parents=True, exist_ok=True)
    outp.write_text("\n".join(lines) + "\n", encoding="utf-8")

    print(f"[lint_codex_chat_format] wrote {outp} (fail_sessions={fail_sessions})")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

