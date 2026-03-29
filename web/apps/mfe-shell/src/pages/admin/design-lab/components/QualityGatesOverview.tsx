import React, { useMemo } from 'react';
import { ShieldCheck, CheckCircle2, XCircle } from 'lucide-react';
import { Text } from '@mfe/design-system';

interface QualityGateItem {
  qualityGates: string[];
}

interface QualityGatesOverviewProps {
  items: QualityGateItem[];
}

const GATES = [
  { key: 'design_tokens', label: 'Design Tokens', description: 'Token-tabanlı stil kullanımı' },
  { key: 'a11y_keyboard_support', label: 'Keyboard A11y', description: 'Klavye erişilebilirlik desteği' },
  { key: 'ux_catalog_alignment', label: 'UX Catalog', description: 'UX katalog hizalaması' },
  { key: 'api_consistency', label: 'API Consistency', description: 'Tutarlı API sözleşmeleri' },
  { key: 'test_coverage', label: 'Test Coverage', description: 'Birim ve entegrasyon testleri' },
];

export function QualityGatesOverview({ items }: QualityGatesOverviewProps) {
  const gateStats = useMemo(() => {
    const total = items.length;
    return GATES.map((gate) => {
      const passing = items.filter((item) => item.qualityGates.includes(gate.key)).length;
      const pct = total > 0 ? Math.round((passing / total) * 100) : 0;
      return { ...gate, passing, total, pct };
    });
  }, [items]);

  const overallPassing = useMemo(() => {
    const total = gateStats.reduce((s, g) => s + g.total, 0);
    const passing = gateStats.reduce((s, g) => s + g.passing, 0);
    return total > 0 ? Math.round((passing / total) * 100) : 0;
  }, [gateStats]);

  return (
    <div className="rounded-2xl border border-border-subtle bg-surface-default p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-action-primary" />
          <Text as="div" className="text-sm font-semibold text-text-primary">
            Quality Gates Overview
          </Text>
        </div>
        <div className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
          overallPassing >= 80
            ? 'bg-state-success-bg text-state-success-text dark:bg-state-success-text/30 dark:text-state-success-text'
            : overallPassing >= 50
              ? 'bg-state-warning-bg text-state-warning-text dark:bg-state-warning-text/30 dark:text-state-warning-text'
              : 'bg-state-danger-bg text-state-danger-text dark:bg-state-danger-text/30 dark:text-state-danger-text'
        }`}>
          Genel: {overallPassing}%
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {gateStats.map((gate) => (
          <div key={gate.key}>
            <div className="mb-1 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {gate.pct >= 80 ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-state-success-text" />
                ) : (
                  <XCircle className="h-3.5 w-3.5 text-state-danger-text" />
                )}
                <Text className="text-xs font-medium text-text-primary">{gate.label}</Text>
              </div>
              <div className="flex items-center gap-2">
                <Text className="text-[10px] tabular-nums text-text-secondary">
                  {gate.passing}/{gate.total}
                </Text>
                <span className={`rounded-xs px-1.5 py-0.5 text-[10px] font-semibold ${
                  gate.pct >= 80
                    ? 'bg-state-success-bg text-state-success-text'
                    : gate.pct >= 50
                      ? 'bg-state-warning-bg text-state-warning-text'
                      : 'bg-state-danger-bg text-state-danger-text'
                }`}>
                  {gate.pct}%
                </span>
              </div>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-surface-muted">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  gate.pct >= 80
                    ? 'bg-state-success-text'
                    : gate.pct >= 50
                      ? 'bg-state-warning-text'
                      : 'bg-state-danger-text'
                }`}
                style={{ width: `${gate.pct}%` }}
              />
            </div>
            <Text variant="secondary" className="mt-0.5 text-[10px]">
              {gate.description}
            </Text>
          </div>
        ))}
      </div>
    </div>
  );
}
