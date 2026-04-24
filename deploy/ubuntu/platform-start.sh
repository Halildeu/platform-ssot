#!/bin/bash
# Platform cold-start script — starts compose stateful tier (D6) + observability.
# Backend app tier is K8s-native (platform-k8s-gitops); compose only runs stateful + observability.
# Usage: /home/halil/platform/scripts/platform-start.sh

REPO_DIR="/home/halil/platform/repo/backend"
ENV_FILE="/home/halil/platform/env/backend.env"
COMPOSE="docker compose -f ${REPO_DIR}/../deploy/docker-compose.prod.yml --env-file ${ENV_FILE} --profile extras"
UNSEAL_SCRIPT="/home/halil/platform/scripts/vault-auto-unseal.sh"

export DOCKER_PULL_POLICY=never

echo "========================================="
echo "  PLATFORM START (compose stateful + observability)"
echo "========================================="

# Phase 1: Stateful infrastructure (ADR-0002 D6: PG + KC + Vault permanent)
# Faz 18.5-18.7: openfga + discovery-server retired (K8s StatefulSet/Deployment authoritative)
echo "[phase-1] Stateful (PG + KC + Vault)..."
$COMPOSE up -d postgres-db vault keycloak loki tempo prometheus 2>&1 | tail -3
sleep 5

# Phase 1b: Vault unseal
echo "[phase-1b] Vault unseal..."
bash "$UNSEAL_SCRIPT" || true

# Wait for vault healthy (max 30s)
for i in $(seq 1 15); do
  docker exec platform-vault-1 vault status >/dev/null 2>&1 && break
  sleep 2
done

# Phase 2: Supporting (web-nginx edge + observability)
# Faz 18.3 PR-B — service-manager retired (410 tombstone)
# Faz 18.4 — vault-snapshot + vault-audit-init retired (host cron @ 02:00/02:15)
# Faz 18.5-18.7 — 9 app stateless compose retired (K8s authoritative)
echo "[phase-2] Supporting..."
$COMPOSE up -d web-nginx grafana promtail vault-unseal 2>&1 | tail -2
docker rm -f platform-web-nginx 2>/dev/null || true

echo ""
HEALTHY=$(docker ps --filter "name=platform-" --filter "health=healthy" -q | wc -l)
TOTAL=$(docker ps --filter "name=platform-" -q | wc -l)
echo "========================================="
echo "  Running: $TOTAL, Healthy: $HEALTHY"
echo "  K8s app tier separate: kubectl --context k3d-prod get pods -n platform-prod"
echo "========================================="
