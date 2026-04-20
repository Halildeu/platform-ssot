# Frontend MFE — K8s deployment Docker image
# Multi-stage build: pnpm install + build + nginx serve
# Used by platform-k8s-gitops kustomize/base/apps/frontend/deployment.yaml
# GHCR target: ghcr.io/halildeu/platform-ssot-frontend:sha-<short>
#
# 2026-04-20: ADR-0002 K8s migration Faz B kapanış (testai/ai UI artifact)
# Build context: ./web (workflow frontend-image.yml)

# Stage 1: Builder
FROM node:22-alpine AS builder

WORKDIR /app

# pnpm via corepack (npm-compatible, lock file deterministic)
RUN corepack enable && corepack prepare pnpm@10 --activate

# Workspace manifests first (cache layer)
# pnpm-workspace.yaml ile monorepo; install cache için kök manifest + lock
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml* .npmrc* ./

# Tüm kaynak (scripts, apps, packages, design-tokens, tsconfig, configs)
# .dockerignore node_modules + dist + cache exclude eder
COPY . .

# Workspace install (frozen lockfile = reproducible, tüm workspace packages dahil)
RUN pnpm install --frozen-lockfile --prod=false

# Build (scripts/deploy/build-single-domain.mjs → dist/ubuntu-single-domain)
# Single-domain Module Federation layout (tek host nginx arkasında shell+remotes)
RUN pnpm run build:ubuntu:single-domain

# Stage 2: Runtime (nginx serve)
FROM nginx:1.27-alpine

# Build artifact'leri kopyala (46 MB civarı)
COPY --from=builder /app/dist/ubuntu-single-domain /usr/share/nginx/html

# K8s default nginx config (basit; reverse-proxy host nginx'te yapılır)
# /index.html no-store + /assets immutable (entry vs hashed asset cache strategy)
RUN cat > /etc/nginx/conf.d/default.conf <<'EOF'
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # Entry files MUST NOT cache (hashed asset references)
    location = / {
        try_files /index.html =404;
        add_header Cache-Control "no-store, must-revalidate" always;
    }
    location = /index.html {
        add_header Cache-Control "no-store, must-revalidate" always;
    }
    location = /remoteEntry.js {
        try_files $uri =404;
        add_header Cache-Control "no-store, must-revalidate" always;
    }
    location ~ ^/remotes/[^/]+/remoteEntry\.js$ {
        try_files $uri =404;
        add_header Cache-Control "no-store, must-revalidate" always;
    }

    # Hashed assets — long cache (immutable)
    location /assets/ {
        try_files $uri =404;
        access_log off;
        add_header Cache-Control "public, max-age=3600, immutable" always;
    }

    # SPA catch-all
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Health
    location = /healthz {
        access_log off;
        add_header Content-Type text/plain;
        return 200 'ok';
    }
}
EOF

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -q -O- http://localhost/healthz | grep -q 'ok' || exit 1
