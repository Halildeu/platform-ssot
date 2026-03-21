import React from 'react';
import { Badge, Text } from '@mfe/design-system';
import platformContractsRaw from '../../design-lab.platform-contracts.v1.json';

/* ── Types ── */

type PlatformContract = {
  id: string;
  title: string;
  scope: string;
  enforcement: string;
  rules: string[];
  appliesTo: string[];
  gate: string;
};

type ComplianceLayerEntry = {
  mustComply: string[];
  mustEnforce: string[];
};

type PlatformContractsCatalog = {
  contracts: PlatformContract[];
  complianceMatrix: Record<string, ComplianceLayerEntry>;
};

const catalog = platformContractsRaw as unknown as PlatformContractsCatalog;

/* ── Constants ── */

const ENFORCEMENT_TONE: Record<string, 'success' | 'warning' | 'info' | 'muted'> = {
  'build-time': 'info',
  runtime: 'warning',
  'build-time + runtime': 'success',
};

const LAYER_COLORS: Record<string, string> = {
  foundations: 'bg-violet-400',
  components: 'bg-blue-400',
  recipes: 'bg-emerald-400',
  pages: 'bg-amber-400',
  ecosystem: 'bg-red-400',
};

/* ── Layer filter type ── */

export type ContractLayerFilter = 'all' | 'foundations' | 'components' | 'recipes' | 'pages' | 'ecosystem';

/* ── Main Panel ── */

type PlatformContractsCompliancePanelProps = {
  layerFilter?: ContractLayerFilter;
  DetailLabelComponent: React.ComponentType<any>;
  SectionBadgeComponent: React.ComponentType<any>;
  MetricCardComponent: React.ComponentType<any>;
};

/**
 * Shared platform contracts compliance panel.
 * Reads from `design-lab.platform-contracts.v1.json` and renders
 * contract rules, enforcement types, CI gates and per-layer compliance matrix.
 * Optionally filtered by layer.
 */
export const PlatformContractsCompliancePanel: React.FC<PlatformContractsCompliancePanelProps> = ({
  layerFilter = 'all',
  DetailLabelComponent,
  SectionBadgeComponent,
  MetricCardComponent,
}) => {
  const DetailLabel = DetailLabelComponent;
  const SectionBadge = SectionBadgeComponent;
  const MetricCard = MetricCardComponent;

  const filteredContracts = React.useMemo(() => {
    if (layerFilter === 'all') return catalog.contracts;
    return catalog.contracts.filter((c) => c.appliesTo.includes(layerFilter));
  }, [layerFilter]);

  // Compliance stats
  const complianceStats = React.useMemo(() => {
    if (layerFilter === 'all') {
      return {
        totalContracts: catalog.contracts.length,
        totalRules: catalog.contracts.reduce((s, c) => s + c.rules.length, 0),
        layers: Object.keys(catalog.complianceMatrix).length,
        ciGates: catalog.contracts.length, // each contract has a gate
      };
    }
    const layerCompliance = catalog.complianceMatrix[layerFilter];
    return {
      totalContracts: filteredContracts.length,
      totalRules: filteredContracts.reduce((s, c) => s + c.rules.length, 0),
      mustComply: layerCompliance?.mustComply.length ?? 0,
      mustEnforce: layerCompliance?.mustEnforce.length ?? 0,
    };
  }, [layerFilter, filteredContracts]);

  return (
    <div className="space-y-4">
      {/* Summary header */}
      <div className="rounded-[28px] border border-border-subtle bg-surface-panel p-5 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <DetailLabel>Platform Contracts Compliance</DetailLabel>
            <Text variant="secondary" className="mt-1 block text-sm leading-6">
              Cross-cutting platform contract&apos;lari, enforcement kurallari ve CI gate referanslari.
              {layerFilter !== 'all' ? ` (${layerFilter} katmani)` : ''}
            </Text>
          </div>
          <Badge variant="info">
            {filteredContracts.length} contract
          </Badge>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
          <MetricCard
            label="Contracts"
            value={complianceStats.totalContracts}
            note={layerFilter === 'all' ? 'Platform-wide contracts' : `Applies to ${layerFilter}`}
          />
          <MetricCard
            label="Rules"
            value={complianceStats.totalRules}
            note="Enforcement rules total"
          />
          {layerFilter === 'all' ? (
            <>
              <MetricCard label="Layers" value={complianceStats.layers} note="Layers in compliance matrix" />
              <MetricCard label="CI Gates" value={complianceStats.ciGates} note="Automated gate scripts" />
            </>
          ) : (
            <>
              <MetricCard label="Must comply" value={(complianceStats as any).mustComply} note="Contracts this layer must follow" />
              <MetricCard label="Must enforce" value={(complianceStats as any).mustEnforce} note="Contracts this layer owns" />
            </>
          )}
        </div>
      </div>

      {/* Contract cards */}
      <div className="rounded-[28px] border border-border-subtle bg-surface-panel p-5 shadow-sm">
        <DetailLabel>Contract details</DetailLabel>
        <div className="mt-4 space-y-3">
          {filteredContracts.map((contract) => {
            const layerCompliance = layerFilter !== 'all' ? catalog.complianceMatrix[layerFilter] : null;
            const isEnforcer = layerCompliance?.mustEnforce.includes(contract.id) ?? false;

            return (
              <div
                key={contract.id}
                className="rounded-[20px] border border-border-subtle bg-surface-default p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <Text className="text-sm font-semibold text-text-primary">
                      {contract.title}
                    </Text>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant={ENFORCEMENT_TONE[contract.enforcement] ?? 'muted'}>
                      {contract.enforcement}
                    </Badge>
                    {isEnforcer ? (
                      <Badge variant="success">enforcer</Badge>
                    ) : null}
                  </div>
                </div>

                {/* Rules */}
                <div className="mt-3 space-y-1.5">
                  {contract.rules.map((rule, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                      <Text variant="secondary" className="text-xs leading-5">
                        {rule}
                      </Text>
                    </div>
                  ))}
                </div>

                {/* Applies to + CI gate */}
                <div className="mt-3 flex items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-1.5">
                    {contract.appliesTo.map((layer) => (
                      <span
                        key={layer}
                        className="inline-flex items-center gap-1 rounded-md bg-surface-panel px-2 py-1 text-[10px] font-medium text-text-secondary"
                      >
                        <span className={`inline-block h-1.5 w-1.5 rounded-full ${LAYER_COLORS[layer] ?? 'bg-zinc-400'}`} />
                        {layer}
                      </span>
                    ))}
                  </div>
                  <SectionBadge label={contract.gate} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Compliance matrix (only in 'all' mode) */}
      {layerFilter === 'all' ? (
        <div className="rounded-[28px] border border-border-subtle bg-surface-panel p-5 shadow-sm">
          <DetailLabel>Compliance matrix</DetailLabel>
          <Text variant="secondary" className="mt-1 block text-xs leading-5">
            Her katmanin hangi contract&apos;lara uyum saglamasi ve hangilerini enforce etmesi gerektigi.
          </Text>
          <div className="mt-4 space-y-2">
            {Object.entries(catalog.complianceMatrix).map(([layerId, entry]) => (
              <div
                key={layerId}
                className="flex items-center justify-between gap-3 rounded-xl bg-surface-default px-3 py-2.5"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`inline-block h-2 w-2 shrink-0 rounded-full ${LAYER_COLORS[layerId] ?? 'bg-zinc-400'}`} />
                  <Text className="text-xs font-semibold text-text-primary">{layerId}</Text>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex items-center gap-1">
                    <Text variant="secondary" className="text-[10px]">comply:</Text>
                    <Text className="text-xs font-bold text-text-primary tabular-nums">{entry.mustComply.length}</Text>
                  </div>
                  <div className="flex items-center gap-1">
                    <Text variant="secondary" className="text-[10px]">enforce:</Text>
                    <Text className="text-xs font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">{entry.mustEnforce.length}</Text>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};
