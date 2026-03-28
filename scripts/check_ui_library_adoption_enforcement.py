#!/usr/bin/env python3
from __future__ import annotations

from ui_library_checks import ensure_exists, ensure_list, fail, load_json, ok


SCRIPT = "check_ui_library_adoption_enforcement"


def main() -> int:
    required = [
        "docs/02-architecture/context/ui-library-adoption-enforcement.contract.v1.json",
        "policies/policy_ui_design_system.v1.json",
    ]
    missing = ensure_exists(*required)
    if missing:
        return fail(SCRIPT, [f"missing-file:{path}" for path in missing])

    adoption = load_json(required[0])
    policy = load_json(required[1])
    problems: list[str] = []

    if adoption.get("package_name") != policy.get("single_ui_library", {}).get("package_name"):
        problems.append("package-name-drift")
    if adoption.get("policy") != "recipe_before_page_level_custom_ui":
        problems.append("invalid-adoption-policy")
    if len(ensure_list(adoption.get("evidence"))) == 0:
        problems.append("missing-adoption-evidence")

    if problems:
        return fail(SCRIPT, problems)
    return ok(SCRIPT, f"evidence={len(ensure_list(adoption.get('evidence')))}")


if __name__ == "__main__":
    raise SystemExit(main())
