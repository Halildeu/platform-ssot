#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
BACKEND_POM="${ROOT_DIR}/pom.xml"
REPORT_DIR="${ROOT_DIR}/test-results/security/dependency-check"
TARGET_REPORT_DIR="${ROOT_DIR}/target"
mkdir -p "${REPORT_DIR}"
cd "${ROOT_DIR}"

DC_VERSION="${DEPENDENCY_CHECK_VERSION:-10.0.3}"
FAIL_CVSS="${DEPENDENCY_CHECK_FAIL_CVSS:-7.0}"
NVD_API_KEY_VALUE="${NVD_API_KEY:-}"
GLOBAL_DC_CACHE_DIR="${HOME}/.m2/repository/org/owasp/dependency-check-data/9.0"
LOCAL_DC_CACHE_DIR="${REPORT_DIR}/cache"
SUPPRESSION_FILE="${ROOT_DIR}/backend/scripts/ci/security/dependency-check-suppressions.xml"

echo "[security][dependency-check] Running OWASP Dependency-Check v${DC_VERSION} (fail on CVSS >= ${FAIL_CVSS})"

cmd=(
  mvn -B
  -f "${BACKEND_POM}"
  "org.owasp:dependency-check-maven:${DC_VERSION}:aggregate"
  -DskipTests=true
  -Dformats=HTML,JSON,CSV,XML
  -DoutputDirectory="${REPORT_DIR}"
  -DfailOnError=true
  "-DfailBuildOnCVSS=${FAIL_CVSS}"
)

if [[ -f "${SUPPRESSION_FILE}" ]]; then
  cmd+=("-DsuppressionFile=${SUPPRESSION_FILE}")
fi

if [[ -n "${NVD_API_KEY_VALUE}" ]]; then
  cmd+=("-DnvdApiKey=${NVD_API_KEY_VALUE}")
else
  if [[ -d "${GLOBAL_DC_CACHE_DIR}" && ! -d "${LOCAL_DC_CACHE_DIR}" ]]; then
    mkdir -p "$(dirname "${LOCAL_DC_CACHE_DIR}")"
    cp -R "${GLOBAL_DC_CACHE_DIR}" "${LOCAL_DC_CACHE_DIR}"
  fi
  if [[ -d "${LOCAL_DC_CACHE_DIR}" ]]; then
    echo "[security][dependency-check] NVD_API_KEY yok; mevcut cache ile auto update kapatiliyor."
    rm -f "${LOCAL_DC_CACHE_DIR}/odc.update.lock"
    cmd+=("-DautoUpdate=false")
    cmd+=("-DossindexAnalyzerEnabled=false")
    cmd+=("-DdataDirectory=${LOCAL_DC_CACHE_DIR}")
  else
    echo "[security][dependency-check] NVD_API_KEY ve lokal cache yok; ilk veritabani bootstrap'i icin auto update acik birakiliyor."
  fi
fi

scan_status=0
"${cmd[@]}" || scan_status=$?

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
