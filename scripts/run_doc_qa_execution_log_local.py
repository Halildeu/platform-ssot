#!/usr/bin/env python3
import argparse
import json
import os
import re
import subprocess
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

DEFAULT_OUT_DIR = Path(".autopilot-tmp/execution-log")

REDACTIONS = [
    (
        re.compile(r"\b(GH_TOKEN|GITHUB_TOKEN|VAULT_TOKEN)\b\s*[:=]\s*\S+", re.IGNORECASE),
        r"\1=<REDACTED>",
    ),
    (re.compile(r"(https?://\S+)\?[^ \n]+"), r"\1?<REDACTED_QUERY>"),
    (
        re.compile(r"\b(PW_TEST_TOKEN|PW_AUTH_MODE)\b\s*[:=]\s*\S+", re.IGNORECASE),
        r"\1=<REDACTED>",
    ),
]

# doc-qa ile paralel tutulmalı (repo içindeki mevcut set)
CHECKS = [
    ["python3", "scripts/docflow_next.py", "render-flow", "--check"],
    ["python3", "scripts/check_doc_templates.py"],
    ["python3", "scripts/check_doc_ids.py"],
    ["python3", "scripts/check_unique_delivery_ids.py"],
    ["python3", "scripts/check_doc_locations.py"],
    ["python3", "scripts/check_acceptance_evidence.py"],
    ["python3", "scripts/check_story_links.py"],
    ["python3", "scripts/check_spec_refs.py"],
    ["python3", "scripts/check_doc_routing_strict.py"],
    ["python3", "scripts/check_bm_bench_pack_integrity.py"],
    ["python3", "scripts/check_runbook_required_sections.py"],
    ["python3", "scripts/check_doc_template_map_policy.py"],
    ["python3", "scripts/check_doc_heading_contract.py"],
    ["python3", "scripts/check_guides_policy.py"],
    ["python3", "scripts/check_guides_prefix.py"],
    ["python3", "scripts/check_nonprefix_naming_policy.py"],
    ["python3", "scripts/check_doc_folder_file_naming.py"],
    ["python3", "scripts/check_doc_cross_mix_report.py"],
    ["python3", "scripts/check_doc_content_boundary_policy.py"],
    ["python3", "scripts/check_doc_content_boundaries.py"],
    ["python3", "scripts/check_doc_repair_reason_map.py"],
    ["python3", "scripts/check_doc_repair_autopr_policy.py"],
    ["python3", "scripts/check_doc_chain.py"],
    ["python3", "scripts/check_governance_migration.py"],
    ["python3", "scripts/check_trace_quality_policy.py"],
    ["python3", "scripts/check_trace_quality.py"],
    ["python3", "scripts/check_prd_complexity.py"],
    ["python3", "scripts/check_local_orchestrator_guardrails.py"],
    ["python3", "scripts/check_robots_policy.py"],
    ["python3", "scripts/check_robots_drift.py"],
    ["python3", "scripts/check_robots_tbd_coverage.py"],
    # non-blocking (report-only): auth/secret registry coverage
    ["python3", "scripts/check_auth_registry.py"],
    # non-blocking (report-only): workflow model SSOT sanity
    ["python3", "scripts/check_workflow_model_ssot.py"],
    # non-blocking (local-only): chat transcript format compliance
    ["python3", "scripts/ops/lint_codex_chat_format.py"],
]


def sanitize(s: str) -> str:
    out = s
    for pat, repl in REDACTIONS:
        out = pat.sub(repl, out)
    return out


def run_cmd(cmd: list[str], cwd: str | None = None) -> tuple[int, str, float]:
    start = time.time()
    p = subprocess.run(cmd, cwd=cwd, capture_output=True, text=True)
    dur = time.time() - start
    out = (p.stdout or "") + (p.stderr or "")
    return p.returncode, out, dur


def sh(cmd: list[str]) -> str:
    try:
        return subprocess.check_output(cmd, text=True).strip()
    except Exception:
        return ""


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--out-dir", default=str(DEFAULT_OUT_DIR))
    ap.add_argument("--keep-raw", action="store_true", help="Keep raw logs even if empty (default: keep)")
    args = ap.parse_args()

    out_dir = Path(args.out_dir)
    raw_dir = out_dir / "raw"
    out_dir.mkdir(parents=True, exist_ok=True)
    raw_dir.mkdir(parents=True, exist_ok=True)

    ts = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%MZ")
    branch = sh(["git", "branch", "--show-current"])
    sha = sh(["git", "rev-parse", "--short", "HEAD"])

    results: list[dict] = []
    any_fail = False

    for i, cmd in enumerate(CHECKS, start=1):
        name = "_".join([re.sub(r"[^a-zA-Z0-9._-]+", "_", x) for x in cmd])[:140]
        log_path = raw_dir / f"{i:02d}__{name}.txt"

        rc, out, dur = run_cmd(cmd)
        out = sanitize(out)

        header = (
            f"=== RUN {i}/{len(CHECKS)} ===\n"
            f"cmd: {' '.join(cmd)}\n"
            f"exit_code: {rc}\n"
            f"duration_s: {dur:.2f}\n\n"
        )
        log_path.write_text(header + out, encoding="utf-8")

        results.append(
            {
                "i": i,
                "cmd": cmd,
                "exit_code": rc,
                "duration_s": round(dur, 2),
                "log_path": str(log_path),
            }
        )
        if rc != 0:
            any_fail = True

    (out_dir / "checks.json").write_text(
        json.dumps(
            {"ts_utc": ts, "branch": branch, "sha": sha, "checks": results},
            ensure_ascii=False,
            indent=2,
        ),
        encoding="utf-8",
    )

    passed = sum(1 for r in results if r["exit_code"] == 0)
    failed = len(results) - passed

    md: list[str] = []
    md.append("# Local Execution Log (doc-qa)")
    md.append("")
    md.append(f"- ts_utc: {ts}")
    md.append(f"- branch: {branch or 'TBD'}")
    md.append(f"- sha: {sha or 'TBD'}")
    md.append(f"- checks_total: {len(results)} | pass: {passed} | fail: {failed}")
    md.append(f"- out_dir: {out_dir}")
    md.append("")
    md.append("## Checks")
    md.append("| # | exit | dur(s) | command | log |")
    md.append("|---:|---:|---:|---|---|")
    for r in results:
        cmd_str = " ".join(r["cmd"])
        md.append(f"| {r['i']} | {r['exit_code']} | {r['duration_s']:.2f} | `{cmd_str}` | `{r['log_path']}` |")

    md.append("")
    md.append("## How to read")
    md.append("- raw/* dosyaları her check'in stdout/stderr çıktısını içerir.")
    md.append("- FAIL varsa ilk bakılacak: exit_code != 0 olan check'in log dosyası.")
    md.append("")
    (out_dir / "execution-log.md").write_text("\n".join(md) + "\n", encoding="utf-8")

    print(f"[local-exec-log] wrote: {out_dir/'execution-log.md'}")
    print(f"[local-exec-log] raw logs: {raw_dir}")
    print(f"[local-exec-log] json: {out_dir/'checks.json'}")

    return 1 if any_fail else 0


if __name__ == "__main__":
    raise SystemExit(main())
