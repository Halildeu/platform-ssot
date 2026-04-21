#!/usr/bin/env bash
set -euo pipefail

MISSING=()

# OI-02 post-mortem (2026-04-18): canonical vars are AUTH_SERVICE_JWT_* per
# auth-service application.properties + render-backend-env.sh + prod compose.
# SERVICE_JWT_KEY_ID is shared across services (not auth-specific).
for var in AUTH_SERVICE_JWT_PRIVATE_KEY AUTH_SERVICE_JWT_PUBLIC_KEY SERVICE_JWT_KEY_ID; do
  if [[ -z ${!var-} ]]; then
    MISSING+=("$var")
  fi
done

if (( ${#MISSING[@]} > 0 )); then
  echo "Eksik servis JWT değişkenleri: ${MISSING[*]}" >&2
  exit 1
fi

for var in AUTH_SERVICE_JWT_PRIVATE_KEY AUTH_SERVICE_JWT_PUBLIC_KEY; do
  value="${!var}"
  lower="$(printf '%s' "${value}" | tr '[:upper:]' '[:lower:]')"

  if [[ "${lower}" == placeholder* || "${lower}" == changeme* || "${lower}" == dummy* ]]; then
    echo "Geçersiz servis JWT değişkeni: ${var} placeholder içeriyor." >&2
    exit 1
  fi

  python3 - "$var" "$value" <<'PY'
import base64
import binascii
import sys

name = sys.argv[1]
value = sys.argv[2]

if any(ch.isspace() for ch in value):
    print(f"{name} tek satır base64 DER olmalı.", file=sys.stderr)
    raise SystemExit(1)

try:
    decoded = base64.b64decode(value, validate=True)
except binascii.Error as exc:
    print(f"{name} geçerli standart base64 değil: {exc}", file=sys.stderr)
    raise SystemExit(1)

if not decoded:
    print(f"{name} boş içeriğe decode oldu.", file=sys.stderr)
    raise SystemExit(1)
PY
done

echo "Servis JWT ortam değişkenleri mevcut ve formatları geçerli."
