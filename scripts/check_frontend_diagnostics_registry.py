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
        "ui-library": ("playwright:ui_library_page|ui_library_navigation_walk|ui_library_foundation_wave_1_walk|ui_library_navigation_wave_2_walk|ui_library_forms_wave_3_walk|ui_library_data_display_wave_4_walk", "gateway_smoke", "base_url_fetch_check"),
        "shell-public": ("playwright:shell_login|runtime_theme_matrix|ui_library_page|ui_library_navigation_walk|ui_library_navigation_wave_2_walk|ui_library_forms_wave_3_walk|ui_library_data_display_wave_4_walk|shell_public_route_walk", "gateway_smoke", "base_url_fetch_check"),
        "theme-admin": ("playwright:theme_registry_page|theme_admin_navigation_walk", "gateway_smoke", "base_url_fetch_check"),
        "auth-business-routes": (
            "playwright:access_roles_page|access_roles_navigation_walk|audit_events_page|audit_events_navigation_walk|reporting_users_page|reporting_users_navigation_walk",
            "gateway_smoke",
            "base_url_fetch_check",
        ),
        "business-journeys": (
            "playwright:access_roles_navigation_walk|audit_events_navigation_walk|reporting_users_navigation_walk",
            "gateway_smoke",
            "base_url_fetch_check",
        ),
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
    if "name: ui_library_navigation_walk" not in scenarios_text:
        problems.append("missing-scenario:ui_library_navigation_walk")
    if "name: ui_library_foundation_wave_1_walk" not in scenarios_text:
        problems.append("missing-scenario:ui_library_foundation_wave_1_walk")
    if "name: ui_library_navigation_wave_2_walk" not in scenarios_text:
        problems.append("missing-scenario:ui_library_navigation_wave_2_walk")
    if "name: ui_library_forms_wave_3_walk" not in scenarios_text:
        problems.append("missing-scenario:ui_library_forms_wave_3_walk")
    if "name: ui_library_data_display_wave_4_walk" not in scenarios_text:
        problems.append("missing-scenario:ui_library_data_display_wave_4_walk")
    if "name: shell_public_route_walk" not in scenarios_text:
        problems.append("missing-scenario:shell_public_route_walk")
    if "name: theme_admin_navigation_walk" not in scenarios_text:
        problems.append("missing-scenario:theme_admin_navigation_walk")
    if "name: access_roles_navigation_walk" not in scenarios_text:
        problems.append("missing-scenario:access_roles_navigation_walk")
    if "name: audit_events_navigation_walk" not in scenarios_text:
        problems.append("missing-scenario:audit_events_navigation_walk")
    if "name: reporting_users_navigation_walk" not in scenarios_text:
        problems.append("missing-scenario:reporting_users_navigation_walk")
    if "goto: /ui-library" not in scenarios_text:
        problems.append("missing-route-step:/ui-library")
    if "goto: /admin/themes" not in scenarios_text:
        problems.append("missing-route-step:/admin/themes")
    if "goto: /access/roles" not in scenarios_text:
        problems.append("missing-route-step:/access/roles")
    if "goto: /audit/events" not in scenarios_text:
        problems.append("missing-route-step:/audit/events")
    if "goto: /admin/reports/users" not in scenarios_text:
        problems.append("missing-route-step:/admin/reports/users")
    if "[data-testid=\"design-lab-detail-tabs\"]" not in scenarios_text:
        problems.append("missing-selector:design-lab-detail-tabs")
    if "[data-testid=\"design-lab-search\"]" not in scenarios_text:
        problems.append("missing-selector:design-lab-search")
    if "[data-testid=\"design-lab-track-new_packages\"]" not in scenarios_text:
        problems.append("missing-selector:design-lab-track-new_packages")
    if "[data-testid=\"theme-admin-preview-theme-pw-ocean\"]" not in scenarios_text:
        problems.append("missing-selector:theme-admin-preview-theme-pw-ocean")
    if "[data-testid=\"theme-admin-preview-section\"]" not in scenarios_text:
        problems.append("missing-selector:theme-admin-preview-section")
    if "[data-testid=\"access-filter-search\"]" not in scenarios_text:
        problems.append("missing-selector:access-filter-search")
    if "[data-testid=\"audit-filter-user-email\"]" not in scenarios_text:
        problems.append("missing-selector:audit-filter-user-email")
    if "[data-testid=\"report-filter-search\"]" not in scenarios_text:
        problems.append("missing-selector:report-filter-search")

    doctor_text = DOCTOR.read_text(encoding="utf-8")
    if "ui_library_page" not in doctor_text:
        problems.append("doctor-missing-scenario-reference")
    if "ui_library_navigation_walk" not in doctor_text:
        problems.append("doctor-missing-click-walk-reference")
    if "ui_library_foundation_wave_1_walk" not in doctor_text:
        problems.append("doctor-missing-foundation-wave-reference")
    if "ui_library_navigation_wave_2_walk" not in doctor_text:
        problems.append("doctor-missing-wave-2-navigation-reference")
    if "ui_library_forms_wave_3_walk" not in doctor_text:
        problems.append("doctor-missing-wave-3-forms-reference")
    if "ui_library_data_display_wave_4_walk" not in doctor_text:
        problems.append("doctor-missing-wave-4-data-display-reference")
    if "theme_admin_navigation_walk" not in doctor_text:
        problems.append("doctor-missing-theme-admin-click-walk-reference")
    if "access_roles_navigation_walk" not in doctor_text:
        problems.append("doctor-missing-access-click-walk-reference")
    if "audit_events_navigation_walk" not in doctor_text:
        problems.append("doctor-missing-audit-click-walk-reference")
    if "reporting_users_navigation_walk" not in doctor_text:
        problems.append("doctor-missing-reporting-click-walk-reference")
    if "playwright_business_journeys" not in doctor_text:
        problems.append("doctor-missing-business-journeys-step")
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
