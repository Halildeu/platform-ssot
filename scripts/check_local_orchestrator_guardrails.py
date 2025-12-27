#!/usr/bin/env python3
import json
import re
import sys
from pathlib import Path


POLICY_PATH = Path("docs/04-operations/LOCAL-ORCHESTRATOR-POLICY.v1.json")
ORCHESTRATOR_PATH = Path("scripts/ops/local_merge_deploy_orchestrator.sh")
PR_MERGE_WORKFLOW_PATH = Path(".github/workflows/pr-merge.yml")


def die(msg: str) -> int:
    print(f"[check_local_orchestrator_guardrails] FAIL: {msg}")
    return 1


def load_json(p: Path) -> dict:
    return json.loads(p.read_text(encoding="utf-8"))


def main() -> int:
    if not POLICY_PATH.exists():
        return die(f"missing policy: {POLICY_PATH}")
    if not ORCHESTRATOR_PATH.exists():
        return die(f"missing orchestrator: {ORCHESTRATOR_PATH}")
    if not PR_MERGE_WORKFLOW_PATH.exists():
        return die(f"missing workflow: {PR_MERGE_WORKFLOW_PATH}")

    pol = load_json(POLICY_PATH)
    if "version" not in pol:
        return die("policy missing: version")
    if not isinstance(pol.get("allow_direct_merge_default"), bool):
        return die("policy invalid: allow_direct_merge_default must be bool")
    if not isinstance(pol.get("merge_bot_dispatch_enabled_default"), bool):
        return die("policy invalid: merge_bot_dispatch_enabled_default must be bool")
    if not isinstance(pol.get("merge_dispatch_requires_confirm"), bool):
        return die("policy invalid: merge_dispatch_requires_confirm must be bool")

    confirm_value = pol.get("merge_dispatch_confirm_value")
    if not isinstance(confirm_value, str) or not confirm_value.strip():
        return die("policy invalid: merge_dispatch_confirm_value must be non-empty string")

    required_inputs = pol.get("merge_dispatch_required_inputs")
    if not isinstance(required_inputs, list) or not required_inputs:
        return die("policy invalid: merge_dispatch_required_inputs must be non-empty list")

    orch = ORCHESTRATOR_PATH.read_text(encoding="utf-8", errors="ignore")
    wf = PR_MERGE_WORKFLOW_PATH.read_text(encoding="utf-8", errors="ignore")

    # 1) Direct merge must be break-glass only (guarded).
    if pol.get("allow_direct_merge_default") is False:
        if "ALLOW_DIRECT_MERGE" not in orch:
            return die("orchestrator missing ALLOW_DIRECT_MERGE guard")
        if re.search(r'ALLOW_DIRECT_MERGE="\$\{ALLOW_DIRECT_MERGE:-0\}"', orch) is None:
            return die("orchestrator ALLOW_DIRECT_MERGE default must be 0 (break-glass)")
        if "--allow-direct-merge" not in orch:
            return die("orchestrator missing --allow-direct-merge flag")
        if re.search(r"merge=direct.*ALLOW_DIRECT_MERGE!=1", orch) is None:
            return die("orchestrator must block merge=direct unless ALLOW_DIRECT_MERGE==1")

    # 2) pr-merge workflow must support workflow_dispatch with confirm+pr_number.
    if "workflow_dispatch" not in wf:
        return die("pr-merge.yml missing workflow_dispatch trigger")

    for key in required_inputs:
        if not isinstance(key, str) or not key.strip():
            continue
        if re.search(rf"^\s+{re.escape(key)}:\s*$", wf, flags=re.M) is None:
            return die(f"pr-merge.yml missing workflow_dispatch input: {key}")

    if pol.get("merge_dispatch_requires_confirm") is True:
        # Must have a check that enforces confirm value (MERGE).
        if confirm_value not in wf:
            return die(f"pr-merge.yml missing confirm value gate: {confirm_value}")
        if re.search(r"inputs\.confirm", wf) is None:
            return die("pr-merge.yml missing inputs.confirm usage (confirm gate expected)")

    # 3) Orchestrator must be able to dispatch pr-merge workflow with confirm=MERGE.
    if pol.get("merge_bot_dispatch_enabled_default") is True:
        if "MERGE_BOT_DISPATCH" not in orch:
            return die("orchestrator missing MERGE_BOT_DISPATCH flag/env")
        if "dispatch_merge_bot" not in orch:
            return die("orchestrator missing dispatch_merge_bot() implementation")
        if "actions/workflows" not in orch or "dispatches" not in orch:
            return die("orchestrator missing workflow dispatch call (actions/workflows/.../dispatches)")
        if re.search(r"inputs\[pr_number\]", orch) is None:
            return die("orchestrator dispatch missing inputs[pr_number]")
        if re.search(r"inputs\[confirm\]", orch) is None:
            return die("orchestrator dispatch missing inputs[confirm]")
        if re.search(rf'MERGE_BOT_DISPATCH_CONFIRM="{re.escape(confirm_value)}"', orch) is None:
            return die(f"orchestrator must set MERGE_BOT_DISPATCH_CONFIRM={confirm_value}")

    print("[check_local_orchestrator_guardrails] PASS")
    return 0


if __name__ == "__main__":
    sys.exit(main())
