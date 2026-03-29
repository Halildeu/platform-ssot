#!/usr/bin/env bash
set -euo pipefail

# Backend için otomatik test runner wrapper.
#
# Kullanım (repo kökünden):
#   ./scripts/run_tests_backend.sh
#   ./scripts/run_tests_backend.sh user-service
#   ./scripts/run_tests_backend.sh --with-upstream user-service
#   ./scripts/run_tests_backend.sh --run-id matrix-user-01 --with-upstream user-service
#
# Not:
# - Varsayılan davranış tüm multi-module Maven projesi için test çalıştırmaktır.
# - Modül bazlı koşularda surefire temp klasörü benzersizleştirilir; böylece
#   paralel matrix koşularında common-auth gibi paylaşılan upstream modüller
#   false negative üretmez.

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
WITH_UPSTREAM="${BACKEND_TEST_INCLUDE_UPSTREAM:-0}"
RUN_ID="${BACKEND_TEST_RUN_ID:-}"
MODULE=""
MOCKITO_AGENT_JAR="${HOME}/.m2/repository/org/mockito/mockito-core/5.17.0/mockito-core-5.17.0.jar"
SUREFIRE_ARG_LINE="-Xshare:off -javaagent:${MOCKITO_AGENT_JAR} -Dnet.bytebuddy.experimental=true"

usage() {
  cat <<'EOF'
Kullanim:
  ./scripts/run_tests_backend.sh
  ./scripts/run_tests_backend.sh <module>
  ./scripts/run_tests_backend.sh --with-upstream <module>
  ./scripts/run_tests_backend.sh --run-id <id> [--with-upstream] <module>
EOF
}

sanitize_token() {
  local raw="$1"
  raw="${raw//[^A-Za-z0-9._-]/-}"
  raw="${raw#-}"
  raw="${raw%-}"
  if [[ -z "$raw" ]]; then
    raw="run"
  fi
  printf '%s\n' "$raw"
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --with-upstream|-am)
      WITH_UPSTREAM="1"
      shift
      ;;
    --run-id)
      if [[ $# -lt 2 ]]; then
        echo "[run_tests_backend] HATA: --run-id deger bekler" >&2
        exit 1
      fi
      RUN_ID="$2"
      shift 2
      ;;
    --help|-h)
      usage
      exit 0
      ;;
    --)
      shift
      break
      ;;
    -*)
      echo "[run_tests_backend] HATA: bilinmeyen arguman: $1" >&2
      usage >&2
      exit 1
      ;;
    *)
      if [[ -n "$MODULE" ]]; then
        echo "[run_tests_backend] HATA: yalnizca tek modul desteklenir: '$MODULE' ve '$1'" >&2
        exit 1
      fi
      MODULE="$1"
      shift
      ;;
  esac
done

if [[ $# -gt 0 ]]; then
  echo "[run_tests_backend] HATA: beklenmeyen ek arguman(lar): $*" >&2
  exit 1
fi

echo "[run_tests_backend] Root: $ROOT_DIR"

if [[ ! -d "$BACKEND_DIR" ]]; then
  echo "[run_tests_backend] HATA: backend/ klasörü bulunamadı: $BACKEND_DIR" >&2
  exit 1
fi

if [[ ! -x "$BACKEND_DIR/mvnw" ]]; then
  echo "[run_tests_backend] HATA: backend/mvnw bulunamadı veya çalıştırılamıyor: $BACKEND_DIR/mvnw" >&2
  exit 1
fi

if [[ ! -f "$MOCKITO_AGENT_JAR" ]]; then
  echo "[run_tests_backend] Mockito agent jar bulunamadı, Maven ile indiriliyor..."
  (cd "$BACKEND_DIR" && ./mvnw -q dependency:get -Dartifact=org.mockito:mockito-core:5.17.0:jar 2>/dev/null) || true
  if [[ ! -f "$MOCKITO_AGENT_JAR" ]]; then
    echo "[run_tests_backend] HATA: Mockito agent jar indirilemedi: $MOCKITO_AGENT_JAR" >&2
    exit 1
  fi
  echo "[run_tests_backend] Mockito agent jar indirildi: $MOCKITO_AGENT_JAR"
fi

cd "$BACKEND_DIR"

if [[ -n "$MODULE" ]]; then
  SAFE_MODULE="$(sanitize_token "$MODULE")"
  if [[ -z "$RUN_ID" ]]; then
    RUN_ID="${SAFE_MODULE}-$(date -u +%Y%m%dT%H%M%SZ)-$$"
  fi
  SAFE_RUN_ID="$(sanitize_token "$RUN_ID")"
  MVN_ARGS=(-q -pl "$MODULE")
  if [[ "$WITH_UPSTREAM" == "1" ]]; then
    MVN_ARGS+=(-am)
  fi
  MVN_ARGS+=(
    "-DargLine=${SUREFIRE_ARG_LINE}"
    "-DtempDir=surefire-${SAFE_RUN_ID}"
    "-Dsurefire.reportNameSuffix=${SAFE_RUN_ID}"
    test
  )
  echo "[run_tests_backend] surefire izolasyonu: tempDir=surefire-${SAFE_RUN_ID} reportNameSuffix=${SAFE_RUN_ID}"
  echo "[run_tests_backend] ./mvnw ${MVN_ARGS[*]} (cwd=$BACKEND_DIR)"
  ./mvnw "${MVN_ARGS[@]}"
else
  echo "[run_tests_backend] ./mvnw -q -DargLine=${SUREFIRE_ARG_LINE} test (cwd=$BACKEND_DIR)"
  ./mvnw -q "-DargLine=${SUREFIRE_ARG_LINE}" test
fi

echo "[run_tests_backend] Backend testleri başarıyla tamamlandı ✅"
