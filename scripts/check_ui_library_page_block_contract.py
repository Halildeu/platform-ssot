#!/usr/bin/env python3
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path('.')
CONTRACT = ROOT / 'docs/02-architecture/context/ui-library-page-block-library.contract.v1.json'
REGISTRY = ROOT / 'web/packages/ui-kit/src/catalog/component-registry.v1.json'
ROADMAP = ROOT / 'docs/02-architecture/context/ui-library-component-roadmap.v1.json'

REQUIRED_TOP = [
    'version',
    'contract_id',
    'subject_id',
    'family_id',
    'wave_id',
    'title',
    'purpose',
    'scope',
    'required_read_order',
    'operating_model',
    'component_targets',
    'gate_requirements',
    'evidence_requirements',
    'success_criteria',
]


def main() -> int:
    missing = [path for path in (CONTRACT, REGISTRY, ROADMAP) if not path.exists()]
    if missing:
        print('[check_ui_library_page_block_contract] FAIL')
        for path in missing:
            print(f'- missing:{path}')
        return 1

    data = json.loads(CONTRACT.read_text(encoding='utf-8'))
    registry = json.loads(REGISTRY.read_text(encoding='utf-8'))
    roadmap = json.loads(ROADMAP.read_text(encoding='utf-8'))
    problems: list[str] = []

    for key in REQUIRED_TOP:
        if key not in data:
            problems.append(f'missing-key:{key}')

    if data.get('family_id') != 'page_blocks':
        problems.append('invalid-family-id')
    if data.get('wave_id') != 'wave_7_page_blocks':
        problems.append('invalid-wave-id')

    scope = data.get('scope', {})
    for key in ['current_exported_blocks', 'planned_targets', 'excluded_to_other_families', 'canonical_source_paths']:
        if key not in scope:
            problems.append(f'missing-scope-key:{key}')
    for rel in scope.get('canonical_source_paths', []):
        if not (ROOT / rel).exists():
            problems.append(f'missing-source-path:{rel}')

    registry_items = {item.get('name'): item for item in registry.get('items', [])}
    for name in scope.get('current_exported_blocks', []):
        item = registry_items.get(name)
        if not item:
            problems.append(f'missing-registry-entry:{name}')
            continue
        if item.get('availability') != 'exported':
            problems.append(f'registry-availability:{name}:{item.get("availability")}')
        if item.get('demoMode') != 'live':
            problems.append(f'registry-demo-mode:{name}:{item.get("demoMode")}')

    targets = data.get('component_targets', [])
    if len(targets) < 3:
        problems.append('insufficient-component-targets')
    seen = set()
    for item in targets:
        name = item.get('component_name')
        if name in seen:
            problems.append(f'duplicate-component:{name}')
        seen.add(name)
        for key in ['component_name', 'source_type', 'current_maturity', 'target_maturity', 'preview_mode', 'ux_primary_theme_id', 'ux_primary_subtheme_id', 'acceptance_focus']:
            if key not in item:
                problems.append(f'missing-target-key:{name}:{key}')
        if item.get('source_type') == 'existing_upgrade' and name not in scope.get('current_exported_blocks', []):
            problems.append(f'upgrade-target-not-exported:{name}')

    roadmap_families = {family.get('family_id') for family in roadmap.get('component_family_matrix', [])}
    if 'page_blocks' not in roadmap_families:
        problems.append('roadmap-missing-family:page_blocks')
    roadmap_waves = {wave.get('wave_id') for wave in roadmap.get('release_waves', [])}
    if 'wave_7_page_blocks' not in roadmap_waves:
        problems.append('roadmap-missing-wave:wave_7_page_blocks')

    for command in [
        'python3 scripts/check_ui_library_page_block_contract.py',
        'npm -C web run doctor:frontend -- --preset ui-library',
    ]:
        if command not in data.get('gate_requirements', []):
            problems.append(f'missing-gate:{command}')

    if problems:
        print('[check_ui_library_page_block_contract] FAIL')
        for problem in problems:
            print(f'- {problem}')
        return 1

    print('[check_ui_library_page_block_contract] OK exported=%d targets=%d' % (
        len(scope.get('current_exported_blocks', [])),
        len(targets),
    ))
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
