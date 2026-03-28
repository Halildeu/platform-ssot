#!/usr/bin/env python3
from __future__ import annotations

from ui_library_checks import ensure_exists, ensure_list, fail, load_json, ok, read_web_scripts


SCRIPT = "check_ui_library_system_extensions"


def main() -> int:
    required = [
        "docs/02-architecture/context/ui-library-system.context.v1.json",
        "docs/02-architecture/blueprints/ui-library-system-blueprint.v1.json",
        "web/design-tokens/generated/theme-contract.json",
        "web/packages/ui-kit/src/runtime/theme-contract.ts",
        "web/scripts/ops/frontend-doctor.mjs",
        "web/scripts/ops/run-ui-library-wave-gate.mjs",
    ]
    missing = ensure_exists(*required)
    if missing:
        return fail(SCRIPT, [f"missing-file:{path}" for path in missing])

    context = load_json("docs/02-architecture/context/ui-library-system.context.v1.json")
    scripts = read_web_scripts()
    problems: list[str] = []

    for contract_path in ensure_list(context.get("active_wave_contracts")):
        if not isinstance(contract_path, str) or ensure_exists(contract_path):
            problems.append(f"missing-active-wave:{contract_path}")

    for script_name in ("doctor:frontend", "gate:ui-library-wave"):
        if script_name not in scripts:
            problems.append(f"missing-web-script:{script_name}")

    if problems:
        return fail(SCRIPT, problems)
    return ok(SCRIPT, f"active_waves={len(ensure_list(context.get('active_wave_contracts')))}")


if __name__ == "__main__":
    raise SystemExit(main())
