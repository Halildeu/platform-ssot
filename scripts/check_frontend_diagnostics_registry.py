#!/usr/bin/env python3
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(".")
REGISTRY = ROOT / "docs/02-architecture/context/frontend-diagnostics.registry.v1.json"
SCENARIOS = ROOT / "web/tests/playwright/pw_scenarios.yml"
DOCTOR = ROOT / "web/scripts/ops/frontend-doctor.mjs"
RUNBOOK = ROOT / "docs/04-operations/RUNBOOKS/RB-frontend-doctor.md"


def main() -> int:
    missing: list[str] = []
    for required in (REGISTRY, SCENARIOS, DOCTOR, RUNBOOK):
        if not required.exists():
            missing.append(str(required))

    if missing:
        print("[check_frontend_diagnostics_registry] FAIL")
        for item in missing:
            print(f"- missing:{item}")
        return 1

    data = json.loads(REGISTRY.read_text(encoding="utf-8"))
    required_keys = [
        "version",
        "registry_id",
        "canonical_entrypoints",
        "diagnostic_layers",
        "route_coverage",
        "doctor_presets",
        "hard_rules",
    ]
    problems: list[str] = []
    for key in required_keys:
        if key not in data:
            problems.append(f"missing-key:{key}")

    for rel in data.get("canonical_entrypoints", []):
        if not (ROOT / rel).exists():
            problems.append(f"missing-entrypoint:{rel}")

    route_coverage = data.get("route_coverage", [])
    ui_library_route = next((item for item in route_coverage if item.get("route_id") == "ui_library"), None)
    if not ui_library_route:
        problems.append("missing-route:ui_library")
    elif ui_library_route.get("scenario_name") != "ui_library_page":
        problems.append("route-scenario-mismatch:ui_library")

    doctor_presets = data.get("doctor_presets", [])
    preset_map = {item.get("preset_id"): item for item in doctor_presets if isinstance(item, dict)}

    expected_presets = {
        "ui-library": ("playwright:ui_library_page", "gateway_smoke", "base_url_fetch_check"),
        "shell-public": ("playwright:shell_login|runtime_theme_matrix|ui_library_page", "gateway_smoke", "base_url_fetch_check"),
        "theme-admin": ("playwright:theme_registry_page", "gateway_smoke", "base_url_fetch_check"),
    }
    for preset_id, expected_steps in expected_presets.items():
        preset = preset_map.get(preset_id)
        if not preset:
            problems.append(f"missing-preset:{preset_id}")
            continue
        steps = preset.get("steps", [])
        for expected in expected_steps:
            if expected not in steps:
                problems.append(f"missing-preset-step:{preset_id}:{expected}")

    scenarios_text = SCENARIOS.read_text(encoding="utf-8")
    if "name: ui_library_page" not in scenarios_text:
        problems.append("missing-scenario:ui_library_page")
    if "goto: /ui-library" not in scenarios_text:
        problems.append("missing-route-step:/ui-library")
    if "[data-testid=\"design-lab-detail-tabs\"]" not in scenarios_text:
        problems.append("missing-selector:design-lab-detail-tabs")

    doctor_text = DOCTOR.read_text(encoding="utf-8")
    if "ui_library_page" not in doctor_text:
        problems.append("doctor-missing-scenario-reference")
    if "frontend-doctor.summary.v1.json" not in doctor_text:
        problems.append("doctor-missing-summary-json")

    if problems:
        print("[check_frontend_diagnostics_registry] FAIL")
        for item in problems:
            print(f"- {item}")
        return 1

    print("[check_frontend_diagnostics_registry] OK route=ui_library scenario=ui_library_page")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
