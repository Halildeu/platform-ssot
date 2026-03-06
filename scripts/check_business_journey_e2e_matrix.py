#!/usr/bin/env python3
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path('.')
MATRIX = ROOT / 'docs/02-architecture/context/business-journey-e2e-matrix.v1.json'
MD = ROOT / 'docs/02-architecture/context/business-journey-e2e-matrix.v1.md'
FRONTEND_REGISTRY = ROOT / 'docs/02-architecture/context/frontend-diagnostics.registry.v1.json'
SCENARIOS = ROOT / 'web/tests/playwright/pw_scenarios.yml'
DOCTOR = ROOT / 'web/scripts/ops/frontend-doctor.mjs'


def main() -> int:
    problems: list[str] = []
    for path in (MATRIX, MD, FRONTEND_REGISTRY, SCENARIOS, DOCTOR):
        if not path.exists():
            problems.append(f'missing:{path}')
    if problems:
        print('[check_business_journey_e2e_matrix] FAIL')
        for item in problems:
            print(f'- {item}')
        return 1

    data = json.loads(MATRIX.read_text(encoding='utf-8'))
    for key in ('version', 'matrix_id', 'journeys', 'doctor_contract', 'hard_rules'):
        if key not in data:
            problems.append(f'missing-key:{key}')

    journeys = data.get('journeys', [])
    expected = {
        'access_role_review': 'access_roles_navigation_walk',
        'audit_event_investigation': 'audit_events_navigation_walk',
        'reporting_user_filtering': 'reporting_users_navigation_walk',
    }
    journey_map = {item.get('journey_id'): item for item in journeys if isinstance(item, dict)}
    for journey_id, scenario_name in expected.items():
        item = journey_map.get(journey_id)
        if not item:
            problems.append(f'missing-journey:{journey_id}')
            continue
        if item.get('scenario_name') != scenario_name:
            problems.append(f'journey-scenario-mismatch:{journey_id}:{item.get("scenario_name")}')
        if not item.get('acceptance'):
            problems.append(f'missing-acceptance:{journey_id}')
        if not item.get('evidence'):
            problems.append(f'missing-evidence:{journey_id}')

    registry = json.loads(FRONTEND_REGISTRY.read_text(encoding='utf-8'))
    preset_map = {item.get('preset_id'): item for item in registry.get('doctor_presets', []) if isinstance(item, dict)}
    business_preset = preset_map.get('business-journeys')
    if not business_preset:
        problems.append('missing-preset:business-journeys')
    else:
        steps = business_preset.get('steps', [])
        for required_step in (
            'playwright:access_roles_navigation_walk|audit_events_navigation_walk|reporting_users_navigation_walk',
            'gateway_smoke',
            'base_url_fetch_check',
        ):
            if required_step not in steps:
                problems.append(f'missing-preset-step:business-journeys:{required_step}')

    scenarios_text = SCENARIOS.read_text(encoding='utf-8')
    doctor_text = DOCTOR.read_text(encoding='utf-8')
    for scenario_name in expected.values():
        if f'name: {scenario_name}' not in scenarios_text:
            problems.append(f'missing-scenario:{scenario_name}')
        if scenario_name not in doctor_text:
            problems.append(f'doctor-missing-reference:{scenario_name}')
    if 'playwright_business_journeys' not in doctor_text:
        problems.append('doctor-missing-business-journeys-step')

    if problems:
        print('[check_business_journey_e2e_matrix] FAIL')
        for item in problems:
            print(f'- {item}')
        return 1

    print('[check_business_journey_e2e_matrix] OK journeys=3 preset=business-journeys')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
