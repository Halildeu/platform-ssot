#!/usr/bin/env python3
from __future__ import annotations

from ui_library_checks import ensure_exists, fail, load_text, ok, read_web_scripts


SCRIPT = "check_frontend_diagnostics_registry"


def main() -> int:
    required = [
        "web/scripts/ops/frontend-doctor.mjs",
        "web/scripts/ops/run-ui-library-wave-gate.mjs",
        "web/tests/playwright/pw_scenarios.yml",
    ]
    missing = ensure_exists(*required)
    if missing:
        return fail(SCRIPT, [f"missing-file:{path}" for path in missing])

    doctor = load_text(required[0])
    scenarios = load_text(required[2])
    scripts = read_web_scripts()
    problems: list[str] = []

    if "/ui-library" in doctor:
        problems.append("legacy-ui-library-route-in-frontend-doctor")
    if "- goto: /ui-library" in scenarios:
        problems.append("legacy-ui-library-route-in-playwright-scenarios")

    for script_name in ("doctor:frontend", "gate:ui-library-wave"):
        if script_name not in scripts:
            problems.append(f"missing-web-script:{script_name}")

    if problems:
        return fail(SCRIPT, problems)
    return ok(SCRIPT, "route=/admin/design-lab")


if __name__ == "__main__":
    raise SystemExit(main())
