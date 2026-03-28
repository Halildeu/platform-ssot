#!/usr/bin/env python3
from __future__ import annotations

import csv
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CONTRACT = ROOT / 'docs/02-architecture/context/live-release-provisioning.contract.v1.json'
AUTH_REGISTRY = ROOT / 'docs/00-handbook/AUTH-REGISTRY.tsv'


def fail(message: str) -> int:
    print(f"[check_live_release_provisioning_contract] HATA: {message}", file=sys.stderr)
    return 1


def expand_names(values: list[str]) -> set[str]:
    names: set[str] = set()
    for value in values:
        for item in value.split('|'):
            item = item.strip()
            if item:
                names.add(item)
    return names


def main() -> int:
    if not CONTRACT.exists():
        return fail(f"kontrat bulunamadi: {CONTRACT}")
    if not AUTH_REGISTRY.exists():
        return fail(f"AUTH-REGISTRY bulunamadi: {AUTH_REGISTRY}")

    contract = json.loads(CONTRACT.read_text())
    required_top = {'version', 'contract_id', 'last_verified', 'canary', 'dast', 'registry_bindings', 'success_criteria'}
    missing_top = sorted(required_top - contract.keys())
    if missing_top:
        return fail(f"kontratta eksik alanlar var: {', '.join(missing_top)}")

    with AUTH_REGISTRY.open(newline='') as handle:
        reader = csv.DictReader(handle, delimiter='\t')
        names = {row['NAME'] for row in reader if row.get('NAME')}

    contract_names = set()
    contract_names |= expand_names(contract['canary']['modes']['live']['required_secrets'])
    contract_names |= expand_names(contract['canary']['modes']['live']['required_variables'])
    contract_names |= expand_names(contract['dast']['required_secrets'])
    for mode in contract['dast']['supported_auth_modes']:
        contract_names |= expand_names(mode.get('required_variables', []))
        contract_names |= expand_names(mode.get('required_secrets', []))

    missing_registry = sorted(name for name in contract_names if name not in names)
    if missing_registry:
        return fail(f"AUTH-REGISTRY eksik isimler: {', '.join(missing_registry)}")

    workflow_files = [
        ROOT / contract['canary']['workflow'],
        ROOT / contract['dast']['workflow'],
    ]
    script_files = [
        ROOT / contract['canary']['script'],
        ROOT / contract['dast']['script'],
    ]
    for path in workflow_files + script_files:
        if not path.exists():
            return fail(f"referans bulunamadi: {path}")

    workflow_text = '\n'.join(path.read_text() for path in workflow_files)
    script_text = '\n'.join(path.read_text() for path in script_files)
    for name in sorted(contract_names):
        if name not in workflow_text and name not in script_text:
            return fail(f"isim workflow/script zincirinde bulunamadi: {name}")

    print('[check_live_release_provisioning_contract] Live release provisioning kontrati registry ve workflow zinciri ile uyumlu ✅')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
