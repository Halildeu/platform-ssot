import React, { useState, useMemo } from 'react';
import {
  Server,
  RefreshCw,
  Play,
  Square,
  CheckCircle2,
  XCircle,
  HelpCircle,
} from 'lucide-react';
import { Text } from '@mfe/design-system';
import { DataProvenanceBadge } from '../../admin/design-lab/components/DataProvenanceBadge';
import { useServiceManager } from './useServiceManager';
import { ServiceCard } from './ServiceCard';
import { ServiceLogDrawer } from './ServiceLogDrawer';

const CATEGORIES = [
  { key: 'all', label: 'Tumu' },
  { key: 'core', label: 'Core' },
  { key: 'auth', label: 'Auth' },
  { key: 'business', label: 'Business' },
  { key: 'data', label: 'Data' },
  { key: 'observability', label: 'Observability' },
  { key: 'frontend', label: 'Frontend' },
];

export default function ServiceControlPage() {
  const {
    services,
    loading,
    error,
    lastRefresh,
    actionPending,
    refresh,
    startService,
    stopService,
    restartService,
    bulkAction,
    fetchLogs,
  } = useServiceManager();

  const [activeTab, setActiveTab] = useState('all');
  const [logTarget, setLogTarget] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<'start' | 'stop' | null>(null);

  const filtered = useMemo(() => {
    if (activeTab === 'all') return services;
    return services.filter((s) => s.category === activeTab);
  }, [services, activeTab]);

  const upCount = services.filter((s) => s.health === 'UP').length;
  const downCount = services.filter((s) => s.health === 'DOWN' || s.health === 'TIMEOUT').length;
  const unknownCount = services.length - upCount - downCount;

  const handleBulk = (action: 'start' | 'stop') => {
    setConfirmAction(null);
    bulkAction(action);
  };

  if (error && services.length === 0) {
    return (
      <div className="flex flex-col gap-6 pb-12">
        <PageHeader upCount={0} total={0} onRefresh={refresh} />
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center">
          <XCircle className="mx-auto h-8 w-8 text-rose-500" />
          <Text className="mt-3 text-sm font-medium text-rose-700">
            Service Manager API baglantisi kurulamadi
          </Text>
          <Text variant="secondary" className="mt-1 text-xs">
            {error}
          </Text>
          <Text variant="secondary" className="mt-2 text-xs font-mono">
            node backend/scripts/service-manager-api.js
          </Text>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Header */}
      <PageHeader
        upCount={upCount}
        total={services.length}
        onRefresh={refresh}
        onStartAll={() => setConfirmAction('start')}
        onStopAll={() => setConfirmAction('stop')}
        actionPending={actionPending}
        lastRefresh={lastRefresh}
      />

      {/* Summary strip */}
      <div className="flex items-center gap-6 rounded-xl border border-border-subtle bg-surface-default px-5 py-3">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <Text className="text-sm font-medium text-text-primary">{upCount} Healthy</Text>
        </div>
        <div className="flex items-center gap-2">
          <XCircle className="h-4 w-4 text-rose-600" />
          <Text className="text-sm font-medium text-text-primary">{downCount} Down</Text>
        </div>
        <div className="flex items-center gap-2">
          <HelpCircle className="h-4 w-4 text-text-secondary" />
          <Text className="text-sm font-medium text-text-primary">{unknownCount} Unknown</Text>
        </div>
        {lastRefresh && (
          <Text variant="secondary" className="ml-auto text-[10px]">
            Son guncelleme: {new Date(lastRefresh).toLocaleTimeString('tr-TR')}
          </Text>
        )}
      </div>

      {/* Category tabs */}
      <div className="flex items-center gap-1 rounded-xl border border-border-subtle bg-surface-default p-1">
        {CATEGORIES.map((cat) => {
          const count = cat.key === 'all'
            ? services.length
            : services.filter((s) => s.category === cat.key).length;
          return (
            <button
              key={cat.key}
              onClick={() => setActiveTab(cat.key)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition ${
                activeTab === cat.key
                  ? 'bg-action-primary text-white shadow-sm'
                  : 'text-text-secondary hover:bg-surface-muted'
              }`}
            >
              {cat.label}
              <span className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                activeTab === cat.key ? 'bg-white/20' : 'bg-surface-muted'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Service grid */}
      {loading && services.length === 0 ? (
        <div className="flex items-center justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-border-subtle border-t-action-primary" />
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 16,
          }}
        >
          {filtered.map((svc) => (
            <ServiceCard
              key={svc.name}
              service={svc}
              actionPending={actionPending}
              onStart={startService}
              onStop={stopService}
              onRestart={restartService}
              onLogs={setLogTarget}
            />
          ))}
        </div>
      )}

      {/* Log drawer */}
      <ServiceLogDrawer
        serviceName={logTarget}
        onClose={() => setLogTarget(null)}
        fetchLogs={fetchLogs}
      />

      {/* Bulk confirm dialog */}
      {confirmAction && (
        <>
          <div className="fixed inset-0 z-50 bg-black/30" onClick={() => setConfirmAction(null)} />
          <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border-subtle bg-surface-default p-6 shadow-2xl">
            <Text as="h3" className="text-base font-semibold text-text-primary">
              {confirmAction === 'start' ? 'Tum servisleri baslat?' : 'Tum servisleri durdur?'}
            </Text>
            <Text variant="secondary" className="mt-2 text-sm">
              {confirmAction === 'start'
                ? `${services.length} servisin tamami baslatilacak.`
                : `${services.length} servisin tamami durdurulacak. Bu islem uygulamayi gecici olarak kullanilmaz hale getirebilir.`}
            </Text>
            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                onClick={() => setConfirmAction(null)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-text-secondary transition hover:bg-surface-muted"
              >
                Iptal
              </button>
              <button
                onClick={() => handleBulk(confirmAction)}
                className={`rounded-lg px-4 py-2 text-sm font-semibold text-white transition ${
                  confirmAction === 'start'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                {confirmAction === 'start' ? 'Baslat' : 'Durdur'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ── Page Header ──────────────────────────────────────────────────────

function PageHeader({
  upCount,
  total,
  onRefresh,
  onStartAll,
  onStopAll,
  actionPending,
  lastRefresh,
}: {
  upCount: number;
  total: number;
  onRefresh: () => void;
  onStartAll?: () => void;
  onStopAll?: () => void;
  actionPending?: string | null;
  lastRefresh?: string;
}) {
  return (
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
          <Server className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <Text as="h1" className="text-2xl font-bold text-text-primary">
              Service Control Panel
            </Text>
            {total > 0 && (
              <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                upCount === total
                  ? 'bg-emerald-100 text-emerald-700'
                  : upCount > 0
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-rose-100 text-rose-700'
              }`}>
                {upCount}/{total} UP
              </span>
            )}
          </div>
          <Text variant="secondary" className="text-sm">
            Backend servislerini izle ve yonet
          </Text>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <DataProvenanceBadge level="live" />
        <button
          onClick={onRefresh}
          disabled={actionPending === 'bulk'}
          className="flex items-center gap-1.5 rounded-lg border border-border-subtle bg-surface-default px-3 py-2 text-xs font-medium text-text-primary transition hover:bg-surface-muted disabled:opacity-50"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Yenile
        </button>
        {onStartAll && (
          <button
            onClick={onStartAll}
            disabled={!!actionPending}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
          >
            <Play className="h-3.5 w-3.5" />
            Tumu Baslat
          </button>
        )}
        {onStopAll && (
          <button
            onClick={onStopAll}
            disabled={!!actionPending}
            className="flex items-center gap-1.5 rounded-lg bg-rose-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-rose-700 disabled:opacity-50"
          >
            <Square className="h-3.5 w-3.5" />
            Tumu Durdur
          </button>
        )}
      </div>
    </div>
  );
}
