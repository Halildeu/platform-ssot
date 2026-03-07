#!/usr/bin/env python3
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path('.')
CONTRACT = ROOT / 'docs/02-architecture/context/ui-library-wave-2-navigation.v1.json'
API_CATALOG = ROOT / 'web/packages/ui-kit/src/catalog/component-api-catalog.v1.json'
EXPECTED_COMPONENTS = {
    'Tabs',
    'Breadcrumb',
    'Pagination',
    'Steps',
    'AnchorToc',
}
EXPORTED_COMPONENTS = {
    'Tabs',
    'Breadcrumb',
    'Pagination',
    'Steps',
}
REQUIRED_TOP = [
    'version',
    'subject_id',
    'wave_id',
    'family_id',
    'status',
    'baseline',
    'gate_runner_command',
    'doctor_preset',
    'required_read_order',
    'implementation_batches',
    'components',
    'wave_exit_criteria',
]
REQUIRED_COMPONENT_KEYS = [
    'component_name',
    'implementation_order',
    'source_state',
    'registry_action',
    'target_maturity',
    'preview_mode',
    'ux_primary_theme_id',
    'ux_primary_subtheme_id',
    'acceptance_criteria',
    'preview_scenarios',
    'gate_checks',
    'evidence_requirements',
]
REQUIRED_GATE_COMMAND = 'npm -C web run gate:ui-library-wave -- --wave wave_2_navigation'


def main() -> int:
    if not CONTRACT.exists():
        print('[check_ui_library_wave_2_navigation] FAIL: missing contract')
        return 1
    if not API_CATALOG.exists():
        print('[check_ui_library_wave_2_navigation] FAIL: missing api catalog')
        return 1

    data = json.loads(CONTRACT.read_text(encoding='utf-8'))
    api_catalog = json.loads(API_CATALOG.read_text(encoding='utf-8'))
    problems: list[str] = []

    for key in REQUIRED_TOP:
        if key not in data:
            problems.append(f'missing-key:{key}')

    if data.get('wave_id') != 'wave_2_navigation':
        problems.append('invalid-wave-id')
    if data.get('family_id') != 'navigation':
        problems.append('invalid-family-id')
    if data.get('doctor_preset') != 'ui-library':
        problems.append('invalid-doctor-preset')
    if data.get('gate_runner_command') != REQUIRED_GATE_COMMAND:
        problems.append('invalid-gate-runner-command')

    components = data.get('components', [])
    api_items = {item.get('name'): item for item in api_catalog.get('items', [])}
    seen = {item.get('component_name') for item in components}
    for name in EXPECTED_COMPONENTS:
        if name not in seen:
            problems.append(f'missing-component:{name}')

    for name in EXPORTED_COMPONENTS:
        api_item = api_items.get(name)
        if not api_item:
            problems.append(f'missing-api-catalog-entry:{name}')
            continue
        for key in ['variantAxes', 'stateModel', 'props', 'previewFocus', 'regressionFocus']:
            if not api_item.get(key):
                problems.append(f'empty-api-catalog-field:{name}:{key}')

    orders = [item.get('implementation_order') for item in components]
    if sorted(orders) != list(range(1, len(EXPECTED_COMPONENTS) + 1)):
        problems.append('invalid-implementation-order-sequence')

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

    if not any('doctor' in criterion.lower() for criterion in data.get('wave_exit_criteria', [])):
        problems.append('missing-doctor-wave-exit-criteria')

    if problems:
        print('[check_ui_library_wave_2_navigation] FAIL')
        for problem in problems:
            print(f'- {problem}')
        return 1

    print('[check_ui_library_wave_2_navigation] OK components=%d' % len(components))
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
