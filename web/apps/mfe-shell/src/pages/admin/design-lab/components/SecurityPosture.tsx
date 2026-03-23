import React from 'react';
import { ShieldAlert, CheckCircle2, XCircle, HelpCircle } from 'lucide-react';
import { Text } from '@mfe/design-system';
import { DataProvenanceBadge } from './DataProvenanceBadge';
import { useEvidence, FALLBACK_REGISTRY } from '../evidence/useEvidence';
import type { EvidenceStatus } from '../evidence/useEvidence';

/* ------------------------------------------------------------------ */
/*  SecurityPosture — Derived from actual workflow & config files       */
/*                                                                     */
/*  Checks presence of:                                                */
/*  - .github/workflows/codeql.yml           → CodeQL                  */
/*  - .github/workflows/secret-scan.yml      → Secret Scan             */
/*  - .github/workflows/security-guardrails.yml → Dependency Scan      */
/*  - SECURITY.md                            → Security Policy         */
/*  - .codecov.yml                           → Coverage Gate           */
/*                                                                     */
/*  Status is "yapilandirildi" (configured) — not pass/fail.           */
/*  Actual pass/fail requires live CI run data.                        */
/* ------------------------------------------------------------------ */

type ConfigStatus = 'configured' | 'missing' | 'no_data';

interface SecurityCheck {
  name: string;
  description: string;
  /** File path that determines existence */
  derivedFrom: string;
  status: ConfigStatus;
}

/** Static check definitions — status is overridden from evidence at runtime */
const CHECK_DEFS: Array<{ name: string; description: string; derivedFrom: string; evidenceKey: string }> = [
  { name: 'CodeQL', description: 'Statik kod analizi', derivedFrom: '.github/workflows/codeql.yml', evidenceKey: 'codeql' },
  { name: 'Secret Scan', description: 'Gizli bilgi taramasi', derivedFrom: '.github/workflows/secret-scan.yml', evidenceKey: 'secret_scan' },
  { name: 'Dependency Scan', description: 'Bagimlililk guvenlik taramasi', derivedFrom: '.github/workflows/security-guardrails.yml', evidenceKey: 'trivy' },
  { name: 'SBOM', description: 'Yazilim malzeme listesi', derivedFrom: '.github/workflows/security-guardrails.yml', evidenceKey: 'sbom' },
  { name: 'Guardrails', description: 'Guvenlik koruma raylari', derivedFrom: '.github/workflows/security-guardrails.yml', evidenceKey: 'guardrails' },
];

function mapEvidenceStatus(status: EvidenceStatus): ConfigStatus {
  if (status === 'configured' || status === 'passing') return 'configured';
  if (status === 'no_data') return 'no_data';
  if (status === 'missing' || status === 'failing' || status === 'never_run') return 'missing';
  return 'missing';
}

const STATUS_CONFIG: Record<ConfigStatus, { icon: React.ReactNode; badge: string; label: string }> = {
  configured: {
    icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
    badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    label: 'Yapilandirildi',
  },
  missing: {
    icon: <XCircle className="h-4 w-4 text-red-500" />,
    badge: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    label: 'Eksik',
  },
  no_data: {
    icon: <HelpCircle className="h-4 w-4 text-zinc-400" />,
    badge: 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800/30 dark:text-zinc-400',
    label: 'Veri yok',
  },
};

export function SecurityPosture() {
  const evidenceState = useEvidence();
  const securityEvidence =
    evidenceState.status === 'loaded'
      ? evidenceState.data.security
      : FALLBACK_REGISTRY.security;
  const evidenceAvailable = evidenceState.status === 'loaded';

  // Build checks from evidence
  const checks: SecurityCheck[] = CHECK_DEFS.map((def) => {
    const ev = securityEvidence[def.evidenceKey];
    const status: ConfigStatus = ev
      ? mapEvidenceStatus(ev.status as EvidenceStatus)
      : evidenceAvailable ? 'missing' : 'no_data';
    return { name: def.name, description: def.description, derivedFrom: def.derivedFrom, status };
  });

  const configuredCount = checks.filter((s) => s.status === 'configured').length;
  const provenanceLevel = evidenceAvailable ? 'ci' as const : 'derived' as const;

  return (
    <div className="rounded-2xl border border-border-subtle bg-surface-default p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-violet-500" />
          <Text as="div" className="text-sm font-semibold text-text-primary">
            Security Posture
          </Text>
          <DataProvenanceBadge level={provenanceLevel} />
        </div>
        <div className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
          configuredCount === checks.length
            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
            : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
        }`}>
          {configuredCount}/{checks.length} yapilandirildi
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {checks.map((check) => {
          const config = STATUS_CONFIG[check.status];
          return (
            <div
              key={check.name}
              className="rounded-xl border border-border-subtle bg-surface-canvas/50 p-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {config.icon}
                  <Text className="text-xs font-semibold text-text-primary">{check.name}</Text>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${config.badge}`}>
                  {config.label}
                </span>
              </div>
              <Text variant="secondary" className="mt-1 text-[10px]">
                {check.description}
              </Text>
              <Text variant="secondary" className="mt-0.5 text-[10px] font-mono italic">
                {check.derivedFrom}
              </Text>
            </div>
          );
        })}
      </div>

      {!evidenceAvailable && (
        <Text variant="secondary" className="mt-3 text-[10px]">
          Evidence registry bulunamadi — <code className="rounded-sm bg-surface-muted px-1">npm run collect:evidence</code> calistirin.
        </Text>
      )}
      <Text variant="secondary" className="mt-1 text-[10px]">
        Yapilandirildi = dosya repoda mevcut. Gercek basarili/basarisiz durumu CI calisma sonuclarindan gelir.
      </Text>
    </div>
  );
}
