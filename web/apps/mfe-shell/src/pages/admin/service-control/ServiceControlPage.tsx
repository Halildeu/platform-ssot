/**
 * ServiceControlPage — Faz 18.3 retirement compat page.
 *
 * Eski içerik: Docker socket üzerinden compose container start/stop/restart/bulk/logs
 * write-operasyonları. platform-service-manager-1 cross-realm control plane.
 *
 * Yeni içerik: Statik "Ops Links" page — ArgoCD + Grafana + runbook docs yönlendirme.
 *
 * Referanslar:
 * - platform-k8s-gitops PLAN.md §Faz 18.3 (Codex thread 019dbfa5 iter-4 AGREE)
 * - platform-k8s-gitops docs/phase18-evidence/tombstone-deploy-20260424.md
 * - `/api/services/` edge 410 Gone (2026-04-24 deploy, removal 2026-05-01)
 */

import React from 'react';
import { ExternalLink, Gauge, GitBranch, Terminal, AlertTriangle } from 'lucide-react';
import { Text } from '@mfe/design-system';

interface OpsLink {
  label: string;
  href: string | null;  // null → disabled state (ops-only, UI'dan erişilmez)
  description: string;
  icon: React.ReactNode;
  disabledNote?: string;
}

/**
 * Canlı smoke doğrulanmış linkler (2026-04-24):
 * - https://ai.acik.com/argocd  → HTTP 200 ✓
 * - https://ai.acik.com/grafana → HTTP 200 ✓
 *
 * Runbook erişimi UI'da YOK (özel repo auth prompt riski). Ops team için:
 * - SSH ile staging-sw erişim
 * - GitHub reposu (Halildeu/platform-k8s-gitops) docs/ dizini
 */
const OPS_LINKS: OpsLink[] = [
  {
    label: 'ArgoCD',
    href: 'https://ai.acik.com/argocd',
    description: 'GitOps deployment state — Application sync/healthy, manifest drift',
    icon: <GitBranch aria-hidden size={20} />,
  },
  {
    label: 'Grafana',
    href: 'https://ai.acik.com/grafana',
    description: 'Prometheus metrics + Loki logs + Tempo traces — platform observability',
    icon: <Gauge aria-hidden size={20} />,
  },
  {
    label: 'Runbook (Ops-only)',
    href: null,  // MFE içinde erişim yok
    description: 'Day-2 ops + DR + cert rotation runbook SSH ile staging-sw üzerinden veya özel repoda.',
    icon: <Terminal aria-hidden size={20} />,
    disabledNote: 'Public MFE erişimi yok (auth/güvenlik).',
  },
];

export default function ServiceControlPage() {
  return (
    <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
      {/* Retirement notice */}
      <div
        style={{
          display: 'flex',
          gap: '12px',
          padding: '16px',
          marginBottom: '24px',
          borderRadius: '8px',
          backgroundColor: 'var(--color-warning-bg, #fef3c7)',
          border: '1px solid var(--color-warning-border, #f59e0b)',
          color: 'var(--color-warning-text, #92400e)',
        }}
        role="alert"
        aria-labelledby="service-control-retirement-title"
      >
        <AlertTriangle aria-hidden size={24} style={{ flexShrink: 0, marginTop: 2 }} />
        <div>
          <Text
            id="service-control-retirement-title"
            weight="bold"
            style={{ marginBottom: '4px' }}
          >
            Service Control panel kaldırıldı (Faz 18.3)
          </Text>
          <Text size="sm">
            Eski Docker socket tabanlı start/stop/restart/logs write-op yüzeyi cross-realm
            control-plane riski nedeniyle retire edildi. Platform operasyonları artık
            ArgoCD + Grafana + K8s RBAC üzerinden yapılır. /api/services/ endpoint HTTP 410
            Gone döner.
          </Text>
        </div>
      </div>

      {/* Title */}
      <div style={{ marginBottom: '24px' }}>
        <Text as="h1" size="xl" weight="bold" style={{ marginBottom: '8px' }}>
          Platform Ops Links
        </Text>
        <Text size="md" style={{ color: 'var(--color-text-muted, #6b7280)' }}>
          Operasyonel kontrol duzlemi icin kanonik tool linkleri. Read-only health, deploy
          history, metrics ve dokumantasyon asagidaki araclarda.
        </Text>
      </div>

      {/* Ops links grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px',
        }}
      >
        {OPS_LINKS.map((link) => {
          const isDisabled = link.href === null;
          const testId = `ops-link-${link.label.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, '')}`;
          const content = (
            <>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '8px',
                }}
              >
                {link.icon}
                <Text weight="bold" size="md">
                  {link.label}
                </Text>
                {!isDisabled && (
                  <ExternalLink
                    aria-hidden
                    size={14}
                    style={{ color: 'var(--color-text-muted, #6b7280)' }}
                  />
                )}
              </div>
              <Text size="sm" style={{ color: 'var(--color-text-muted, #6b7280)' }}>
                {link.description}
              </Text>
              {isDisabled && link.disabledNote && (
                <Text
                  size="xs"
                  style={{
                    marginTop: '8px',
                    color: 'var(--color-warning-text, #92400e)',
                    fontStyle: 'italic',
                  }}
                >
                  {link.disabledNote}
                </Text>
              )}
            </>
          );

          const baseStyle: React.CSSProperties = {
            display: 'block',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid var(--color-border, #e5e7eb)',
            backgroundColor: 'var(--color-surface, #ffffff)',
            textDecoration: 'none',
            color: 'inherit',
            transition: 'border-color 0.2s, transform 0.2s',
          };

          if (isDisabled) {
            return (
              <div
                key={link.label}
                style={{
                  ...baseStyle,
                  opacity: 0.6,
                  cursor: 'not-allowed',
                  backgroundColor: 'var(--color-surface-muted, #f3f4f6)',
                }}
                data-testid={testId}
                aria-disabled="true"
              >
                {content}
              </div>
            );
          }

          return (
            <a
              key={link.label}
              href={link.href ?? '#'}
              target="_blank"
              rel="noopener noreferrer"
              style={baseStyle}
              data-testid={testId}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-primary, #3b82f6)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-border, #e5e7eb)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {content}
            </a>
          );
        })}
      </div>

      {/* Footer note */}
      <div
        style={{
          marginTop: '32px',
          paddingTop: '16px',
          borderTop: '1px solid var(--color-border, #e5e7eb)',
        }}
      >
        <Text size="sm" style={{ color: 'var(--color-text-muted, #6b7280)' }}>
          Tarihsel Service Control (Docker socket debug) paneli{' '}
          <code>platform-service-manager-1</code> compose container ile birlikte Faz 18.3
          kapsaminda retire edildi. Detay platform-k8s-gitops repo PLAN.md Faz 18
          bolumunde (ops-only erisim).
        </Text>
      </div>
    </div>
  );
}
