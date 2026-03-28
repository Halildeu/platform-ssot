import React, { useState, useMemo } from 'react';
import {
  Server,
  RefreshCw,
  Play,
  Square,
  CheckCircle2,
  XCircle,
  HelpCircle,
  MemoryStick,
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
  const [statusFilter, setStatusFilter] = useState<'all' | 'up' | 'down' | 'unknown'>('all');
  const [logTarget, setLogTarget] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<'start' | 'stop' | 'restart' | null>(null);

  const toggleStatusFilter = (filter: 'up' | 'down' | 'unknown') => {
    setStatusFilter((prev) => (prev === filter ? 'all' : filter));
  };

  const filtered = useMemo(() => {
    let result = services;
    if (activeTab !== 'all') {
      result = result.filter((s) => s.category === activeTab);
    }
    if (statusFilter === 'up') {
      result = result.filter((s) => s.health === 'UP');
    } else if (statusFilter === 'down') {
      result = result.filter((s) => s.health === 'DOWN' || s.health === 'TIMEOUT');
    } else if (statusFilter === 'unknown') {
      result = result.filter((s) => s.health !== 'UP' && s.health !== 'DOWN' && s.health !== 'TIMEOUT');
    }
    return result;
  }, [services, activeTab, statusFilter]);

  const upCount = services.filter((s) => s.health === 'UP').length;
  const downCount = services.filter((s) => s.health === 'DOWN' || s.health === 'TIMEOUT').length;
  const unknownCount = services.length - upCount - downCount;

  // RAM stats by category + total
  const ramStats = useMemo(() => {
    const byCategory: Record<string, { ram: number; count: number }> = {};
    let totalRam = 0;
    for (const s of services) {
      const ram = (s as any).rssMb ?? 0;
      totalRam += ram;
      if (!byCategory[s.category]) byCategory[s.category] = { ram: 0, count: 0 };
      byCategory[s.category].ram += ram;
      byCategory[s.category].count += 1;
    }
    return { byCategory, totalRam };
  }, [services]);

  const handleBulk = (action: 'start' | 'stop' | 'restart') => {
    setConfirmAction(null);
    bulkAction(action);
  };

  if (error && services.length === 0) {
    return (
      <div className="flex flex-col gap-6 pb-12">
        <PageHeader upCount={0} total={0} onRefresh={refresh} />
        <div className="rounded-2xl border border-state-danger-text/20 bg-state-danger-bg p-8 text-center">
          <XCircle className="mx-auto h-8 w-8 text-state-danger-text" />
          <Text className="mt-3 text-sm font-medium text-state-danger-text">
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
        onRestartAll={() => setConfirmAction('restart')}
        onStopAll={() => setConfirmAction('stop')}
        actionPending={actionPending}
        lastRefresh={lastRefresh}
      />

      {/* Summary strip — clickable status filters */}
      <div className="flex items-center gap-2 rounded-xl border border-border-subtle bg-surface-default px-5 py-3">
        <button
          onClick={() => toggleStatusFilter('up')}
          className={`flex items-center gap-2 rounded-lg px-3 py-1.5 transition ${
            statusFilter === 'up'
              ? 'bg-state-success-bg ring-2 ring-state-success-text'
              : 'hover:bg-state-success-bg'
          }`}
        >
          <CheckCircle2 className="h-4 w-4 text-state-success-text" />
          <Text className="text-sm font-medium text-text-primary">{upCount} Healthy</Text>
        </button>
        <button
          onClick={() => toggleStatusFilter('down')}
          className={`flex items-center gap-2 rounded-lg px-3 py-1.5 transition ${
            statusFilter === 'down'
              ? 'bg-state-danger-bg ring-2 ring-state-danger-text'
              : 'hover:bg-state-danger-bg'
          }`}
        >
          <XCircle className="h-4 w-4 text-state-danger-text" />
          <Text className="text-sm font-medium text-text-primary">{downCount} Down</Text>
        </button>
        <button
          onClick={() => toggleStatusFilter('unknown')}
          className={`flex items-center gap-2 rounded-lg px-3 py-1.5 transition ${
            statusFilter === 'unknown'
              ? 'bg-surface-raised ring-2 ring-border-strong'
              : 'hover:bg-surface-muted'
          }`}
        >
          <HelpCircle className="h-4 w-4 text-text-secondary" />
          <Text className="text-sm font-medium text-text-primary">{unknownCount} Unknown</Text>
        </button>
        {statusFilter !== 'all' && (
          <button
            onClick={() => setStatusFilter('all')}
            className="ml-1 rounded-lg px-2 py-1 text-xs text-text-secondary hover:bg-surface-muted"
          >
            Filtreyi Kaldir
          </button>
        )}
        {lastRefresh && (
          <Text variant="secondary" className="ml-auto text-[10px]">
            Son guncelleme: {new Date(lastRefresh).toLocaleTimeString('tr-TR')}
          </Text>
        )}
      </div>

      {/* Resource overview */}
      {ramStats.totalRam > 0 && (
        <div className="rounded-xl border border-border-subtle bg-surface-default px-5 py-3">
          <div className="flex items-center gap-6">
            {/* Total */}
            <div className="flex items-center gap-2 border-r border-border-subtle pr-6">
              <MemoryStick className="h-4 w-4 text-text-secondary" />
              <div>
                <Text className="text-[10px] text-text-secondary">Toplam RAM</Text>
                <Text className={`text-lg font-bold ${
                  ramStats.totalRam > 8000 ? 'text-state-danger-text' : ramStats.totalRam > 5000 ? 'text-state-warning-text' : 'text-text-primary'
                }`}>
                  {ramStats.totalRam >= 1024
                    ? `${(ramStats.totalRam / 1024).toFixed(1)} GB`
                    : `${ramStats.totalRam} MB`}
                </Text>
              </div>
            </div>

            {/* Per category */}
            {CATEGORIES.filter((c) => c.key !== 'all').map((cat) => {
              const stats = ramStats.byCategory[cat.key];
              if (!stats || stats.ram === 0) return null;
              const ramLabel = stats.ram >= 1024
                ? `${(stats.ram / 1024).toFixed(1)}GB`
                : `${stats.ram}MB`;
              const pct = Math.round((stats.ram / ramStats.totalRam) * 100);
              return (
                <button
                  key={cat.key}
                  onClick={() => setActiveTab(cat.key === activeTab ? 'all' : cat.key)}
                  className={`flex flex-col items-center gap-0.5 rounded-lg px-3 py-1 transition ${
                    activeTab === cat.key ? 'bg-surface-muted ring-1 ring-border-subtle' : 'hover:bg-surface-muted'
                  }`}
                >
                  <Text className="text-[10px] text-text-secondary">{cat.label}</Text>
                  <Text className="text-sm font-semibold text-text-primary">{ramLabel}</Text>
                  <div className="h-1 w-12 overflow-hidden rounded-full bg-surface-raised">
                    <div
                      className="h-full rounded-full bg-action-primary"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <Text className="text-[9px] text-text-secondary">{pct}%</Text>
                </button>
              );
            })}
          </div>
        </div>
      )}

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
                  ? 'bg-action-primary text-text-inverse shadow-sm'
                  : 'text-text-secondary hover:bg-surface-muted'
              }`}
            >
              {cat.label}
              <span className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                activeTab === cat.key ? 'bg-surface-default/20' : 'bg-surface-muted'
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
          <div className="fixed inset-0 z-50 bg-surface-inverse/30" onClick={() => setConfirmAction(null)} />
          <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border-subtle bg-surface-default p-6 shadow-2xl">
            <Text as="h3" className="text-base font-semibold text-text-primary">
              {confirmAction === 'start' && 'Tum servisleri baslat?'}
              {confirmAction === 'restart' && 'Tum servisleri yeniden baslat?'}
              {confirmAction === 'stop' && 'Tum servisleri durdur?'}
            </Text>
            <Text variant="secondary" className="mt-2 text-sm">
              {confirmAction === 'start' && `${services.length} servisin tamami baslatilacak.`}
              {confirmAction === 'restart' && `${services.length} servis sirayla yeniden baslatilacak. Kisa sureli kesinti olabilir.`}
              {confirmAction === 'stop' && `${services.length} servisin tamami durdurulacak. Bu islem uygulamayi gecici olarak kullanilmaz hale getirebilir.`}
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
                className={`rounded-lg px-4 py-2 text-sm font-semibold text-text-inverse transition ${
                  confirmAction === 'start'
                    ? 'bg-state-success-text hover:bg-state-success-text'
                    : confirmAction === 'restart'
                      ? 'bg-action-primary hover:bg-action-primary'
                      : 'bg-state-danger-text hover:bg-state-danger-text'
                }`}
              >
                {confirmAction === 'start' ? 'Baslat' : confirmAction === 'restart' ? 'Yeniden Baslat' : 'Durdur'}
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
  onRestartAll,
  onStopAll,
  actionPending,
  lastRefresh,
}: {
  upCount: number;
  total: number;
  onRefresh: () => void;
  onStartAll?: () => void;
  onRestartAll?: () => void;
  onStopAll?: () => void;
  actionPending?: string | null;
  lastRefresh?: string;
}) {
  return (
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-action-primary/10">
          <Server className="h-5 w-5 text-action-primary" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <Text as="h1" className="text-2xl font-bold text-text-primary">
              Service Control Panel
            </Text>
            {total > 0 && (
              <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                upCount === total
                  ? 'bg-state-success-bg text-state-success-text'
                  : upCount > 0
                    ? 'bg-state-warning-bg text-state-warning-text'
                    : 'bg-state-danger-bg text-state-danger-text'
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
            className="flex items-center gap-1.5 rounded-lg bg-state-success-text px-3 py-2 text-xs font-semibold text-text-inverse transition hover:bg-state-success-text disabled:opacity-50"
          >
            <Play className="h-3.5 w-3.5" />
            Tumu Baslat
          </button>
        )}
        {onRestartAll && (
          <button
            onClick={onRestartAll}
            disabled={!!actionPending}
            className="flex items-center gap-1.5 rounded-lg bg-action-primary px-3 py-2 text-xs font-semibold text-text-inverse transition hover:bg-action-primary disabled:opacity-50"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Tumu Restart
          </button>
        )}
        {onStopAll && (
          <button
            onClick={onStopAll}
            disabled={!!actionPending}
            className="flex items-center gap-1.5 rounded-lg bg-state-danger-text px-3 py-2 text-xs font-semibold text-text-inverse transition hover:bg-state-danger-text disabled:opacity-50"
          >
            <Square className="h-3.5 w-3.5" />
            Tumu Durdur
          </button>
        )}
      </div>
    </div>
  );
}
