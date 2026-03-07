#!/usr/bin/env python3
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path('.')
CONTRACT = ROOT / 'docs/02-architecture/context/ui-library-wave-4-data-display.v1.json'
API_CATALOG = ROOT / 'web/packages/ui-kit/src/catalog/component-api-catalog.v1.json'
REGISTRY = ROOT / 'web/packages/ui-kit/src/catalog/component-registry.v1.json'

REQUIRED_TOP = [
    'version',
    'subject_id',
    'wave_id',
    'family_id',
    'status',
    'purpose',
    'required_read_order',
    'implementation_batches',
    'components',
    'progress_summary',
    'doctor_preset',
    'gate_runner_command',
]

REQUIRED_COMPONENT_KEYS = [
    'component_name',
    'implementation_order',
    'source_state',
    'registry_action',
    'target_maturity',
    'preview_mode',
    'implementation_scope',
    'ux_primary_theme_id',
    'ux_primary_subtheme_id',
    'acceptance_criteria',
    'preview_scenarios',
    'gate_checks',
    'evidence_requirements',
]

REQUIRED_GATE_COMMAND = 'npm -C web run gate:ui-library-wave -- --wave wave_4_data_display'


def main() -> int:
    missing = [path for path in (CONTRACT, API_CATALOG, REGISTRY) if not path.exists()]
    if missing:
        print('[check_ui_library_wave_4_data_display] FAIL')
        for path in missing:
            print(f'- missing:{path}')
        return 1

    data = json.loads(CONTRACT.read_text(encoding='utf-8'))
    api_catalog = json.loads(API_CATALOG.read_text(encoding='utf-8'))
    registry = json.loads(REGISTRY.read_text(encoding='utf-8'))
    problems: list[str] = []

    for key in REQUIRED_TOP:
        if key not in data:
            problems.append(f'missing-key:{key}')

    if data.get('wave_id') != 'wave_4_data_display':
        problems.append('invalid-wave-id')
    if data.get('family_id') != 'data_display':
        problems.append('invalid-family-id')
    if data.get('doctor_preset') != 'ui-library':
        problems.append('invalid-doctor-preset')
    if data.get('gate_runner_command') != REQUIRED_GATE_COMMAND:
        problems.append('invalid-gate-runner-command')

    components = data.get('components', [])
    seen = {item.get('component_name') for item in components}
    if len(seen) != len(components):
        problems.append('duplicate-component-name')
    if not components:
        problems.append('empty-components')

    orders = [item.get('implementation_order') for item in components]
    if sorted(orders) != list(range(1, len(components) + 1)):
        problems.append('invalid-implementation-order-sequence')

    api_items = {item.get('name'): item for item in api_catalog.get('items', [])}
    registry_items = {item.get('name'): item for item in registry.get('items', [])}

    for item in components:
        name = item.get('component_name', 'unknown')
        for key in REQUIRED_COMPONENT_KEYS:
            if key not in item:
                problems.append(f'missing-component-key:{name}:{key}')
        for list_key in ['acceptance_criteria', 'preview_scenarios', 'gate_checks', 'evidence_requirements']:
            if not item.get(list_key):
                problems.append(f'empty-component-list:{name}:{list_key}')
        if REQUIRED_GATE_COMMAND not in item.get('gate_checks', []):
            problems.append(f'missing-gate-runner:{name}')
        scope = item.get('implementation_scope', {})
        for scope_key in ['target_source_paths', 'target_taxonomy_group', 'target_taxonomy_subgroup']:
            if scope_key not in scope:
                problems.append(f'missing-scope-key:{name}:{scope_key}')
        for target_path in scope.get('target_source_paths', []):
            if not (ROOT / target_path).exists():
                problems.append(f'missing-target-source:{name}:{target_path}')

        api_item = api_items.get(name)
        if not api_item:
            problems.append(f'missing-api-catalog-entry:{name}')
        else:
            for key in ['variantAxes', 'stateModel', 'props', 'previewFocus', 'regressionFocus']:
                if not api_item.get(key):
                    problems.append(f'empty-api-catalog-field:{name}:{key}')

        registry_item = registry_items.get(name)
        if not registry_item:
            problems.append(f'missing-registry-entry:{name}')
        else:
            if registry_item.get('availability') != 'exported':
                problems.append(f'registry-availability:{name}:{registry_item.get("availability")}')
            expected_maturity = item.get('target_maturity')
            if registry_item.get('lifecycle') != expected_maturity:
                problems.append(f'registry-lifecycle:{name}:{registry_item.get("lifecycle")}!= {expected_maturity}')
            if registry_item.get('demoMode') != 'live':
                problems.append(f'registry-demo-mode:{name}:{registry_item.get("demoMode")}')
            if registry_item.get('roadmapWaveId') != 'wave_4_data_display':
                problems.append(f'registry-wave:{name}:{registry_item.get("roadmapWaveId")}')
            if registry_item.get('acceptanceContractId') != 'ui-library-wave-4-data-display-v1':
                problems.append(f'registry-contract:{name}:{registry_item.get("acceptanceContractId")}')
            if not registry_item.get('uxPrimaryThemeId') or not registry_item.get('uxPrimarySubthemeId'):
                problems.append(f'missing-registry-ux:{name}')

    completed = set(data.get('progress_summary', {}).get('completed_components', []))
    if completed != seen:
        problems.append('invalid-progress-summary-completed-components')

    if problems:
        print('[check_ui_library_wave_4_data_display] FAIL')
        for problem in problems:
            print(f'- {problem}')
        return 1

    print('[check_ui_library_wave_4_data_display] OK components=%d' % len(components))
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
