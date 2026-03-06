#!/usr/bin/env python3
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path('.')
CONTRACT = ROOT / 'docs/02-architecture/context/ui-library-wave-2-navigation.v1.json'
EXPECTED_COMPONENTS = {
    'Tabs',
    'Breadcrumb',
    'Pagination',
    'Steps',
    'AnchorToc',
}
REQUIRED_TOP = [
    'version',
    'subject_id',
    'wave_id',
    'family_id',
    'baseline',
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


def main() -> int:
    if not CONTRACT.exists():
        print('[check_ui_library_wave_2_navigation] FAIL: missing contract')
        return 1

    data = json.loads(CONTRACT.read_text(encoding='utf-8'))
    problems: list[str] = []

    for key in REQUIRED_TOP:
        if key not in data:
            problems.append(f'missing-key:{key}')

    if data.get('wave_id') != 'wave_2_navigation':
        problems.append('invalid-wave-id')
    if data.get('family_id') != 'navigation':
        problems.append('invalid-family-id')

    components = data.get('components', [])
    seen = {item.get('component_name') for item in components}
    for name in EXPECTED_COMPONENTS:
        if name not in seen:
            problems.append(f'missing-component:{name}')

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
        scope = item.get('implementation_scope', {})
        for scope_key in ['target_source_paths', 'target_taxonomy_group', 'target_taxonomy_subgroup']:
            if scope_key not in scope:
                problems.append(f'missing-scope-key:{name}:{scope_key}')

    if problems:
        print('[check_ui_library_wave_2_navigation] FAIL')
        for problem in problems:
            print(f'- {problem}')
        return 1

    print('[check_ui_library_wave_2_navigation] OK components=%d' % len(components))
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
