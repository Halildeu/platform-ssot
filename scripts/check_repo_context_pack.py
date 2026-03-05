#!/usr/bin/env python3
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path('.')
PACK = ROOT / 'docs/02-architecture/context/repo-context-pack.v1.json'


def main() -> int:
    if not PACK.exists():
        print('[check_repo_context_pack] FAIL: missing repo-context-pack.v1.json')
        return 1
    data = json.loads(PACK.read_text(encoding='utf-8'))
    missing: list[str] = []
    for rel in data.get('canonical_read_order', []):
        if not (ROOT / rel).exists():
            missing.append(rel)
    for rel in data.get('secondary_human_sources', []):
        if '*' in rel:
            continue
        if not (ROOT / rel).exists():
            missing.append(rel)
    required_top = [
        'version',
        'pack_id',
        'canonical_read_order',
        'feature_start_requirements',
        'hard_rules_for_ai'
    ]
    for key in required_top:
        if key not in data:
            missing.append(f'missing-key:{key}')
    if missing:
        print('[check_repo_context_pack] FAIL')
        for item in missing:
            print(f'- {item}')
        return 1
    print('[check_repo_context_pack] OK canonical_files=%d' % len(data.get('canonical_read_order', [])))
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
