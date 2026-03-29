import React, { useState, useMemo } from 'react';
import { CheckCircle2, XCircle, Filter } from 'lucide-react';
import { Text } from '@mfe/design-system';

interface CoverageItem {
  name: string;
  hasGuide: boolean;
  hasTokens: boolean;
  hasExamples: boolean;
  hasPlayground: boolean;
  hasTests: boolean;
}

interface CoverageMatrixProps {
  items: CoverageItem[];
  onNavigate?: (componentName: string) => void;
}

export type { CoverageItem };

const DIMENSIONS = [
  { key: 'hasGuide' as const, label: 'Guide' },
  { key: 'hasTokens' as const, label: 'Tokens' },
  { key: 'hasExamples' as const, label: 'Examples' },
  { key: 'hasPlayground' as const, label: 'Playground' },
  { key: 'hasTests' as const, label: 'Tests' },
];

export function CoverageMatrix({ items, onNavigate }: CoverageMatrixProps) {
  const [onlyGaps, setOnlyGaps] = useState(false);

  const filtered = useMemo(() => {
    if (!onlyGaps) return items;
    return items.filter((item) =>
      DIMENSIONS.some((d) => !item[d.key]),
    );
  }, [items, onlyGaps]);

  const dimensionCoverage = useMemo(() => {
    return DIMENSIONS.map((d) => {
      const covered = items.filter((item) => item[d.key]).length;
      return { ...d, covered, total: items.length, pct: items.length > 0 ? Math.round((covered / items.length) * 100) : 0 };
    });
  }, [items]);

  return (
    <div className="rounded-2xl border border-border-subtle bg-surface-default">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border-subtle px-5 py-4">
        <Text as="div" className="text-sm font-semibold text-text-primary">
          Coverage Gaps Matrix
        </Text>
        <button
          onClick={() => setOnlyGaps((v) => !v)}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
            onlyGaps
              ? 'bg-state-warning-bg text-state-warning-text dark:bg-state-warning-text/30 dark:text-state-warning-text'
              : 'bg-surface-muted text-text-secondary hover:bg-surface-canvas'
          }`}
        >
          <Filter className="h-3 w-3" />
          {onlyGaps ? 'Sadece eksikleri göster' : 'Tümünü göster'}
        </button>
      </div>

      {/* Dimension coverage summary */}
      <div className="grid grid-cols-5 gap-px border-b border-border-subtle bg-border-subtle">
        {dimensionCoverage.map((d) => (
          <div key={d.key} className="bg-surface-default px-3 py-2 text-center">
            <Text className="text-[10px] font-medium text-text-secondary">{d.label}</Text>
            <Text className={`text-sm font-bold tabular-nums ${d.pct >= 80 ? 'text-state-success-text' : d.pct >= 50 ? 'text-state-warning-text' : 'text-state-danger-text'}`}>
              {d.pct}%
            </Text>
          </div>
        ))}
      </div>

      {/* Matrix body */}
      <div className="max-h-[400px] overflow-y-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border-subtle bg-surface-canvas/50">
              <th className="px-4 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-text-secondary">
                Component
              </th>
              {DIMENSIONS.map((d) => (
                <th key={d.key} className="px-2 py-2 text-center text-[10px] font-semibold uppercase tracking-wider text-text-secondary">
                  {d.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle/50">
            {filtered.map((item) => (
              <tr key={item.name} className="transition-colors hover:bg-surface-canvas/30">
                <td className="px-4 py-2">
                  <button
                    onClick={() => onNavigate?.(item.name)}
                    className="text-sm font-medium text-text-primary hover:text-action-primary hover:underline"
                  >
                    {item.name}
                  </button>
                </td>
                {DIMENSIONS.map((d) => (
                  <td key={d.key} className="px-2 py-2 text-center">
                    {item[d.key] ? (
                      <CheckCircle2 className="mx-auto h-4 w-4 text-state-success-text" />
                    ) : (
                      <XCircle className="mx-auto h-4 w-4 text-state-danger-text" />
                    )}
                  </td>
                ))}
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center">
                  <Text variant="secondary" className="text-sm">
                    {onlyGaps ? 'Tüm bileşenler tam kapsama sahip!' : 'Gösterilecek bileşen yok.'}
                  </Text>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer summary */}
      <div className="border-t border-border-subtle px-5 py-3">
        <Text variant="secondary" className="text-[10px]">
          {filtered.length} / {items.length} bileşen gösteriliyor
          {onlyGaps && ` — ${items.length - filtered.length} tam kapsama sahip bileşen gizlendi`}
        </Text>
      </div>
    </div>
  );
}
