#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
APPS_DIST_DIR="${ROOT_DIR}/apps/dist"
UI_KIT_DIST_DIR="${ROOT_DIR}/packages/dist/ui-kit"
PUBLISH_DIR="${ROOT_DIR}/dist"
RELEASE_MANIFEST_PATH="${ROOT_DIR}/test-results/releases/ui-library/latest/ui-library-release-manifest.v1.json"
RELEASE_MARKDOWN_PATH="${ROOT_DIR}/test-results/releases/ui-library/latest/ui-library-release-manifest.v1.md"

if [[ ! -d "${APPS_DIST_DIR}" ]]; then
  echo "[publish_bundle] HATA: kaynak dist klasoru bulunamadi: ${APPS_DIST_DIR}" >&2
  exit 1
fi

if [[ ! -d "${UI_KIT_DIST_DIR}" ]]; then
  echo "[publish_bundle] HATA: ui-kit dist klasoru bulunamadi: ${UI_KIT_DIST_DIR}" >&2
  exit 1
fi

rm -rf "${PUBLISH_DIR}"
mkdir -p "${PUBLISH_DIR}"
cp -R "${APPS_DIST_DIR}/." "${PUBLISH_DIR}/"
mkdir -p "${PUBLISH_DIR}/ui-kit"
cp -R "${UI_KIT_DIST_DIR}/." "${PUBLISH_DIR}/ui-kit/"

if [[ -f "${RELEASE_MANIFEST_PATH}" ]]; then
  cp "${RELEASE_MANIFEST_PATH}" "${PUBLISH_DIR}/ui-kit/ui-library-release-manifest.v1.json"
fi

if [[ -f "${RELEASE_MARKDOWN_PATH}" ]]; then
  cp "${RELEASE_MARKDOWN_PATH}" "${PUBLISH_DIR}/ui-kit/ui-library-release-manifest.v1.md"
fi

required=(
  "index.html"
  "remoteEntry.js"
  "ui-kit/remoteEntry.js"
  "access/remoteEntry.js"
  "ethic/remoteEntry.js"
  "users/remoteEntry.js"
  "suggestions/remoteEntry.js"
  "audit/remoteEntry.js"
  "reports/remoteEntry.js"
)

for item in "${required[@]}"; do
  if [[ ! -f "${PUBLISH_DIR}/${item}" ]]; then
    echo "[publish_bundle] HATA: eksik artefact ${PUBLISH_DIR}/${item}" >&2
    exit 1
  fi
done

echo "[publish_bundle] OK publish root hazir: ${PUBLISH_DIR}"
