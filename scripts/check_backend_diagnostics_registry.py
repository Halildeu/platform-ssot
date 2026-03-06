#!/usr/bin/env python3
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path('.')
REGISTRY = ROOT / 'docs/02-architecture/context/backend-diagnostics.registry.v1.json'
DOCTOR = ROOT / 'backend/scripts/ops/backend-doctor.py'
RUNBOOK = ROOT / 'docs/04-operations/RUNBOOKS/RB-backend-doctor.md'


REQUIRED_SERVICE_IDS = {
    'discovery_server',
    'postgres_db',
    'auth_service',
    'permission_service',
    'user_service',
    'variant_service',
    'core_data_service',
    'api_gateway',
    'keycloak',
}
REQUIRED_SMOKE_IDS = {
    'gateway_companies_unauthorized',
    'auth_jwks',
    'eureka_registry',
}


def main() -> int:
    missing = [str(path) for path in (REGISTRY, DOCTOR, RUNBOOK) if not path.exists()]
    if missing:
        print('[check_backend_diagnostics_registry] FAIL')
        for item in missing:
            print(f'- missing:{item}')
        return 1

    data = json.loads(REGISTRY.read_text(encoding='utf-8'))
    problems: list[str] = []

    for key in ('version', 'registry_id', 'canonical_entrypoints', 'diagnostic_layers', 'service_matrix', 'smoke_checks', 'doctor_presets', 'hard_rules'):
        if key not in data:
            problems.append(f'missing-key:{key}')

    for rel in data.get('canonical_entrypoints', []):
        if not (ROOT / rel).exists():
            problems.append(f'missing-entrypoint:{rel}')

    service_ids = {item.get('service_id') for item in data.get('service_matrix', []) if isinstance(item, dict)}
    for service_id in sorted(REQUIRED_SERVICE_IDS - service_ids):
        problems.append(f'missing-service:{service_id}')

    smoke_ids = {item.get('check_id') for item in data.get('smoke_checks', []) if isinstance(item, dict)}
    for check_id in sorted(REQUIRED_SMOKE_IDS - smoke_ids):
        problems.append(f'missing-smoke:{check_id}')

    preset_map = {item.get('preset_id'): item for item in data.get('doctor_presets', []) if isinstance(item, dict)}
    preset = preset_map.get('local-compose')
    if not preset:
        problems.append('missing-preset:local-compose')
    else:
        for step in ('compose_service_matrix', 'http_health_probes', 'unauthorized_runtime_smoke', 'log_triage', 'summary_bundle'):
            if step not in preset.get('steps', []):
                problems.append(f'missing-preset-step:local-compose:{step}')

    doctor_text = DOCTOR.read_text(encoding='utf-8')
    for token in ('backend-doctor.summary.v1.json', 'service-matrix.v1.json', 'health-probes.v1.json', 'smoke-checks.v1.json', 'log-triage.v1.json'):
        if token not in doctor_text:
            problems.append(f'doctor-missing-token:{token}')

    runbook_text = RUNBOOK.read_text(encoding='utf-8')
    if 'ID: RB-backend-doctor' not in runbook_text:
        problems.append('runbook-missing-id')
    if 'Backend Runtime Diagnostics Control Plane' not in runbook_text:
        problems.append('runbook-missing-title')

    if problems:
        print('[check_backend_diagnostics_registry] FAIL')
        for item in problems:
            print(f'- {item}')
        return 1

    print('[check_backend_diagnostics_registry] OK preset=local-compose')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
