#!/usr/bin/env python3
import json
import re
import sys
from pathlib import Path

POL = Path("docs/04-operations/LOCAL-ORCHESTRATOR-POLICY.v1.json")
ORCH = Path("scripts/ops/local_merge_deploy_orchestrator.sh")
RB = Path("docs/04-operations/RUNBOOKS/RB-local-merge-deploy-orchestrator.md")
INS = Path("docs/04-operations/RUNBOOKS/RB-insansiz-flow.md")
PR_MERGE = Path(".github/workflows/pr-merge.yml")
ROLL = Path(".github/workflows/rollback.yml")


def die(msg: str) -> int:
    print(f"[check_local_orchestrator_guardrails] FAIL: {msg}")
    return 1


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8", errors="ignore")


def main() -> int:
    if not POL.exists():
        return die(f"missing policy json: {POL}")
    if not ORCH.exists():
        return die(f"missing orchestrator script: {ORCH}")
    if not ROLL.exists():
        return die(f"missing workflow: {ROLL}")

    pol = json.loads(POL.read_text(encoding="utf-8"))
    allow_direct_default = bool(pol.get("allow_direct_merge_default", False))
    merge_bot_dispatch_default = bool(pol.get("merge_bot_dispatch_enabled_default", False))
    merge_dispatch_confirm = bool(pol.get("merge_dispatch_requires_confirm", False))
    rollback_confirm = bool(pol.get("rollback_manual_requires_confirm", False))

    orch = read_text(ORCH)
    roll = read_text(ROLL)

    # 1) Direct merge break-glass must be explicit when default is disabled.
    if not allow_direct_default:
        if "ALLOW_DIRECT_MERGE" not in orch or "--allow-direct-merge" not in orch:
            return die("orchestrator missing break-glass flag/env for direct merge")

        if re.search(r"ALLOW_DIRECT_MERGE=.*:-0", orch) is None:
            return die("ALLOW_DIRECT_MERGE default is not 0 (expected break-glass disabled by default)")

        if re.search(r"merge=direct requested.*ALLOW_DIRECT_MERGE", orch, re.IGNORECASE) is None:
            return die("orchestrator missing hard guardrail for --merge direct (expected die message)")

        # Ensure auto fallback does not silently switch to direct merge without the guard.
        direct_assign_lines = [i for i, l in enumerate(orch.splitlines(), start=1) if 'MERGE_MODE="direct"' in l]
        if direct_assign_lines:
            # At least one assignment should be adjacent to an ALLOW_DIRECT_MERGE check.
            ok = False
            lines = orch.splitlines()
            for ln in direct_assign_lines:
                start = max(0, ln - 6)
                end = min(len(lines), ln + 2)
                window = "\n".join(lines[start:end])
                if "ALLOW_DIRECT_MERGE" in window:
                    ok = True
                    break
            if not ok:
                return die('MERGE_MODE="direct" assignment not guarded by ALLOW_DIRECT_MERGE')

    # 1.1) Merge bot dispatch fallback should exist when enabled by default.
    if merge_bot_dispatch_default:
        if "MERGE_BOT_DISPATCH" not in orch:
            return die("orchestrator missing MERGE_BOT_DISPATCH flag/env")
        if 'PR_MERGE_WORKFLOW_FILE="pr-merge.yml"' not in orch:
            return die('orchestrator missing PR_MERGE_WORKFLOW_FILE="pr-merge.yml"')
        if (
            "actions/workflows/${PR_MERGE_WORKFLOW_FILE}/dispatches" not in orch
            and "actions/workflows/pr-merge.yml/dispatches" not in orch
        ):
            return die("orchestrator missing pr-merge workflow dispatch call")

    # 1.2) pr-merge workflow should require explicit confirm for workflow_dispatch.
    if merge_dispatch_confirm:
        if not PR_MERGE.exists():
            return die(f"missing workflow: {PR_MERGE}")
        pr_merge = read_text(PR_MERGE)
        if "workflow_dispatch:" not in pr_merge:
            return die("pr-merge.yml missing workflow_dispatch trigger")
        if re.search(r"^[ \t]+confirm:[ \t]*$", pr_merge, re.M) is None:
            return die("pr-merge.yml missing workflow_dispatch input: confirm")
        if re.search(r"^[ \t]+pr_number:[ \t]*$", pr_merge, re.M) is None:
            return die("pr-merge.yml missing workflow_dispatch input: pr_number")
        if "confirm must be MERGE" not in pr_merge and re.search(r"inputs\\.confirm.*MERGE", pr_merge) is None:
            return die("pr-merge.yml missing confirm=MERGE gate")

    # 2) Rollback guardrails (policy-aware)
    if rollback_confirm:
        if "workflow_dispatch:" not in roll:
            return die("rollback.yml missing workflow_dispatch")
        if re.search(r"confirm:\s*$", roll, re.IGNORECASE | re.M) is None:
            return die("rollback.yml missing workflow_dispatch input: confirm")
        if re.search(r"inputs\.confirm\s*==\s*'ROLLBACK'", roll) is None:
            return die("rollback.yml missing confirm=ROLLBACK gate in job if")

    # workflow_run should not trigger on skipped/cancelled; require failure or timed_out.
    if re.search(r"conclusion\s*!=\s*'success'", roll):
        return die("rollback workflow_run uses conclusion != 'success' (too broad)")
    if re.search(r"workflow_run", roll) and (
        re.search(r"conclusion\s*==\s*'failure'", roll) is None
        or re.search(r"conclusion\s*==\s*'timed_out'", roll) is None
    ):
        return die("rollback workflow_run not restricted to failure + timed_out")

    # 3) Runbook references (keep docs aligned with break-glass semantics)
    for doc in (RB, INS):
        if not doc.exists():
            continue
        txt = read_text(doc)
        if "--allow-direct-merge" not in txt and "ALLOW_DIRECT_MERGE" not in txt:
            return die(f"missing break-glass documentation in runbook: {doc}")

    print("[check_local_orchestrator_guardrails] PASS")
    return 0


if __name__ == "__main__":
    sys.exit(main())
