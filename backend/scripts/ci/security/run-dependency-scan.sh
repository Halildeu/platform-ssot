#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
BACKEND_POM="${ROOT_DIR}/pom.xml"
REPORT_DIR="${ROOT_DIR}/test-results/security/dependency-check"
TARGET_REPORT_DIR="${ROOT_DIR}/target"
mkdir -p "${REPORT_DIR}"
cd "${ROOT_DIR}"

DC_VERSION="${DEPENDENCY_CHECK_VERSION:-12.2.0}"
FAIL_CVSS="${DEPENDENCY_CHECK_FAIL_CVSS:-7.0}"
NVD_API_KEY_VALUE="${NVD_API_KEY:-}"
CACHE_DIR_SUFFIX="${DC_VERSION//./_}"
LOCAL_DC_CACHE_DIR="${REPORT_DIR}/cache-v${CACHE_DIR_SUFFIX}"
SUPPRESSION_FILE="${ROOT_DIR}/backend/scripts/ci/security/dependency-check-suppressions.xml"

echo "[security][dependency-check] Running OWASP Dependency-Check v${DC_VERSION} (fail on CVSS >= ${FAIL_CVSS})"

mkdir -p "${LOCAL_DC_CACHE_DIR}"

has_cache_data() {
  find "${LOCAL_DC_CACHE_DIR}" -mindepth 1 -print -quit | grep -q .
}

build_cmd() {
  local use_cached_data="$1"

  cmd=(
    mvn -B
    -f "${BACKEND_POM}"
    package
    "org.owasp:dependency-check-maven:${DC_VERSION}:aggregate"
    -DskipTests=true
    -Dformats=HTML,JSON,CSV,XML
    -DoutputDirectory="${REPORT_DIR}"
    -DfailOnError=true
    "-DfailBuildOnCVSS=${FAIL_CVSS}"
    "-DdataDirectory=${LOCAL_DC_CACHE_DIR}"
  )

  if [[ -f "${SUPPRESSION_FILE}" ]]; then
    cmd+=("-DsuppressionFile=${SUPPRESSION_FILE}")
  fi

  if [[ -n "${NVD_API_KEY_VALUE}" ]]; then
    cmd+=("-DnvdApiKey=${NVD_API_KEY_VALUE}")
    return
  fi

  if [[ "${use_cached_data}" == "true" ]]; then
    echo "[security][dependency-check] NVD_API_KEY yok; mevcut versioned cache ile auto update kapatiliyor."
    rm -f "${LOCAL_DC_CACHE_DIR}/odc.update.lock"
    cmd+=("-DautoUpdate=false")
    cmd+=("-DossindexAnalyzerEnabled=false")
  else
    echo "[security][dependency-check] NVD_API_KEY ve versioned cache yok; ilk veritabani bootstrap'i icin auto update acik birakiliyor."
  fi
}

cache_present_at_start=false
if has_cache_data; then
  cache_present_at_start=true
fi

build_cmd "${cache_present_at_start}"

scan_status=0
"${cmd[@]}" || scan_status=$?

if [[ "${scan_status}" -ne 0 && -z "${NVD_API_KEY_VALUE}" && "${cache_present_at_start}" != "true" ]] && has_cache_data; then
  echo "[security][dependency-check] Bootstrap sonrasi versioned cache olustu; cache-only modda bir kez daha deneniyor."
  build_cmd true
  scan_status=0
  "${cmd[@]}" || scan_status=$?
fi

for artifact in \
  "${TARGET_REPORT_DIR}/dependency-check-report.html" \
  "${TARGET_REPORT_DIR}/dependency-check-report.json" \
  "${TARGET_REPORT_DIR}/dependency-check-report.xml" \
  "${TARGET_REPORT_DIR}/dependency-check-report.csv"
do
  if [[ -f "${artifact}" ]]; then
    cp "${artifact}" "${REPORT_DIR}/"
  fi
done

echo "[security][dependency-check] Reports stored under ${REPORT_DIR}"
exit "${scan_status}"
