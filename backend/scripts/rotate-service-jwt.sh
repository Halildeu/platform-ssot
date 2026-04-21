#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 2 ]]; then
  echo "Kullanım: $0 <env> <kid>" >&2
  exit 1
fi

if [[ -z "${VAULT_ADDR:-}" || -z "${VAULT_TOKEN:-}" ]]; then
  echo "VAULT_ADDR ve VAULT_TOKEN ayarlanmalı" >&2
  exit 1
fi

ENV="$1"
KEY_ID="$2"
OUTPUT_DIR=${OUTPUT_DIR:-/tmp}
VAULT_KV_MOUNT="${VAULT_KV_MOUNT:-secret}"

PRIVATE_KEY="${OUTPUT_DIR}/service-jwt-${KEY_ID}-private.pem"
PUBLIC_KEY="${OUTPUT_DIR}/service-jwt-${KEY_ID}-public.pem"
PRIVATE_KEY_DER_B64="${OUTPUT_DIR}/service-jwt-${KEY_ID}-private.der.b64"
PUBLIC_KEY_DER_B64="${OUTPUT_DIR}/service-jwt-${KEY_ID}-public.der.b64"

openssl genrsa -out "${PRIVATE_KEY}" 2048 >/dev/null 2>&1
openssl pkcs8 -topk8 -nocrypt -in "${PRIVATE_KEY}" -out "${PRIVATE_KEY}" >/dev/null 2>&1
openssl rsa -in "${PRIVATE_KEY}" -pubout -out "${PUBLIC_KEY}" >/dev/null 2>&1

openssl pkcs8 -topk8 -nocrypt -in "${PRIVATE_KEY}" -outform DER 2>/dev/null | base64 | tr -d '\n' > "${PRIVATE_KEY_DER_B64}"
openssl pkey -pubin -in "${PUBLIC_KEY}" -outform DER 2>/dev/null | base64 | tr -d '\n' > "${PUBLIC_KEY_DER_B64}"

vault kv put "${VAULT_KV_MOUNT}/${ENV}/jwt/auth-service" \
  privateKey=@"${PRIVATE_KEY_DER_B64}" \
  publicKey=@"${PUBLIC_KEY_DER_B64}" \
  keyId="${KEY_ID}"

echo "Yeni anahtar yüklendi: ${VAULT_KV_MOUNT}/${ENV}/jwt/auth-service (kid=${KEY_ID})"
echo "JWKS endpointi güncellendiğinde servisleri rolling restart ile yenileyin."
