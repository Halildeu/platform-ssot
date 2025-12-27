#!/usr/bin/env python3
"""
Non-blocking SSOT sanity checker for workflow model (report-only).

- Always exits 0.
- Best-effort checks (if file exists):
  - PR-TRACKER.tsv header contains key fields (PR lifecycle SSOT).
  - Deploy chain helper scripts exist (deploy lifecycle SSOT).

Writes a local-only report:
- .autopilot-tmp/flow-mining/workflow-model-ssot-report.md
"""

from __future__ import annotations

from datetime import datetime, timezone
from pathlib import Path


REQUIRED_PR_TRACKER_FIELDS = [
    "PR",
    "DRAFT",
    "MERGEABLE_STATE",
    "MERGE_POLICY",
    "READY_LABEL",
    "FAIL_WORKFLOWS",
    "NEXT_ACTION",
]


def main() -> int:
    ts = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%MZ")

    ok: list[str] = []
    notes: list[str] = []

    # PR Lifecycle SSOT (local-only / gitignored)
    pr_tracker = Path(".autopilot-tmp/pr-tracker/PR-TRACKER.tsv")
    if pr_tracker.exists():
        try:
            header = pr_tracker.read_text(encoding="utf-8", errors="ignore").splitlines()[0]
        except Exception as exc:
            notes.append(f"PR-TRACKER header read failed: {exc} (file={pr_tracker})")
        else:
            missing = [f for f in REQUIRED_PR_TRACKER_FIELDS if f not in header]
            if missing:
                notes.append(f"PR-TRACKER header missing fields: {missing} (file={pr_tracker})")
            else:
                ok.append(f"PR-TRACKER header OK (file={pr_tracker})")
    else:
        notes.append("PR-TRACKER.tsv not found locally (ok).")

    # Deploy Lifecycle helpers (repo scripts; should exist)
    required_scripts = [
        Path("scripts/ops/ci_pull_deploy_chain_logs.sh"),
        Path("scripts/ops/gh_pull_run_logs.sh"),
        Path("scripts/ops/local_merge_deploy_orchestrator.sh"),
    ]
    for sp in required_scripts:
        if sp.exists():
            ok.append(f"Found script: {sp}")
        else:
            notes.append(f"Missing script: {sp}")

    out_dir = Path(".autopilot-tmp/flow-mining")
    out_dir.mkdir(parents=True, exist_ok=True)
    rep = out_dir / "workflow-model-ssot-report.md"

    lines: list[str] = []
    lines.append("# Workflow Model SSOT Report (local-only, non-blocking)")
    lines.append("")
    lines.append(f"- ts_utc: {ts}")
    lines.append("")
    if ok:
        lines.append("## OK")
        for x in ok:
            lines.append(f"- {x}")
        lines.append("")
    if notes:
        lines.append("## Notes")
        for x in notes:
            lines.append(f"- {x}")
        lines.append("")

    rep.write_text("\n".join(lines), encoding="utf-8")
    print(f"[check_workflow_model_ssot] report={rep}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
