#!/usr/bin/env python3
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path('.')
CONTRACT = ROOT / 'docs/02-architecture/context/ui-library-package-release.contract.v1.json'
PACKAGE_JSON = ROOT / 'web/packages/ui-kit/package.json'
WEB_PACKAGE_JSON = ROOT / 'web/package.json'
RELEASE_NOTES = ROOT / 'docs/04-operations/RELEASE-NOTES/RELEASE-NOTES-ui-library.md'
STORYBOOK_MAIN = ROOT / 'web/.storybook/main.ts'
PUBLISH_BUNDLE = ROOT / 'web/scripts/ci/publish_bundle.sh'
REGISTRY = ROOT / 'web/packages/ui-kit/src/catalog/component-registry.v1.json'
API_CATALOG = ROOT / 'web/packages/ui-kit/src/catalog/component-api-catalog.v1.json'

REQUIRED_TOP = [
    'version',
    'contract_id',
    'subject_id',
    'package_name',
    'package_json_path',
    'purpose',
    'versioning_strategy',
    'distribution_targets',
    'required_scripts',
    'release_evidence',
    'changelog_policy',
    'fail_closed_rules',
    'success_criteria',
]


def main() -> int:
    missing = [path for path in (CONTRACT, PACKAGE_JSON, WEB_PACKAGE_JSON, RELEASE_NOTES, STORYBOOK_MAIN, PUBLISH_BUNDLE, REGISTRY, API_CATALOG) if not path.exists()]
    if missing:
        print('[check_ui_library_package_release_contract] FAIL')
        for path in missing:
            print(f'- missing:{path}')
        return 1

    data = json.loads(CONTRACT.read_text(encoding='utf-8'))
    package_json = json.loads(PACKAGE_JSON.read_text(encoding='utf-8'))
    web_package = json.loads(WEB_PACKAGE_JSON.read_text(encoding='utf-8'))
    problems: list[str] = []

    for key in REQUIRED_TOP:
        if key not in data:
            problems.append(f'missing-key:{key}')

    if data.get('package_name') != 'mfe-ui-kit':
        problems.append('invalid-package-name')
    if data.get('package_json_path') != 'web/packages/ui-kit/package.json':
        problems.append('invalid-package-json-path')

    if data.get('versioning_strategy', {}).get('source_of_truth') != 'web/packages/ui-kit/package.json:version':
        problems.append('invalid-version-source')
    if not package_json.get('version'):
        problems.append('missing-package-version')

    scripts = web_package.get('scripts', {})
    for name in data.get('required_scripts', []):
        if name not in scripts:
            problems.append(f'missing-web-script:{name}')

    dist_targets = data.get('distribution_targets', [])
    if len(dist_targets) < 3:
        problems.append('insufficient-distribution-targets')
    target_ids = {item.get('target_id') for item in dist_targets}
    for required in {'module_federation_remote', 'publish_bundle', 'storybook_static'}:
        if required not in target_ids:
            problems.append(f'missing-distribution-target:{required}')

    required_files = data.get('release_evidence', {}).get('required_files', [])
    for rel in required_files:
        if not (ROOT / rel).exists():
            problems.append(f'missing-required-file:{rel}')

    release_notes_text = RELEASE_NOTES.read_text(encoding='utf-8')
    for token in ['version:', 'date:', 'changed_components:', 'evidence_refs:']:
        if token not in release_notes_text:
            problems.append(f'release-notes-missing:{token}')

    for command in [
        'doctor:frontend',
        'gate:ui-library-wave',
        'publish:bundle',
        'build-storybook',
        'chromatic',
    ]:
        if command not in data.get('required_scripts', []):
            problems.append(f'contract-missing-script:{command}')

    if problems:
        print('[check_ui_library_package_release_contract] FAIL')
        for problem in problems:
            print(f'- {problem}')
        return 1

    print('[check_ui_library_package_release_contract] OK version=%s targets=%d' % (
        package_json.get('version'),
        len(dist_targets),
    ))
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
