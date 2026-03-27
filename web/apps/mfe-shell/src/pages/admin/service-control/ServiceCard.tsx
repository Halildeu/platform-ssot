import React from 'react';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Play,
  Square,
  RotateCw,
  ScrollText,
  Loader2,
} from 'lucide-react';
import { Text } from '@mfe/design-system';
import type { ServiceInfo } from './useServiceManager';

type Props = {
  service: ServiceInfo;
  actionPending: string | null;
  onStart: (name: string) => void;
  onStop: (name: string) => void;
  onRestart: (name: string) => void;
  onLogs: (name: string) => void;
};

const STATUS_ICON: Record<string, React.ReactNode> = {
  UP: <CheckCircle2 className="h-5 w-5 text-emerald-600" />,
  DOWN: <XCircle className="h-5 w-5 text-rose-600" />,
  TIMEOUT: <XCircle className="h-5 w-5 text-amber-600" />,
  UNKNOWN: <HelpCircle className="h-5 w-5 text-text-secondary" />,
  no_healthcheck: <HelpCircle className="h-5 w-5 text-text-secondary" />,
};

const STATUS_BG: Record<string, string> = {
  UP: 'border-emerald-200 bg-emerald-50/50',
  DOWN: 'border-rose-200 bg-rose-50/50',
  TIMEOUT: 'border-amber-200 bg-amber-50/50',
  UNKNOWN: 'border-border-subtle bg-surface-muted',
  no_healthcheck: 'border-border-subtle bg-surface-muted',
};

const CATEGORY_COLORS: Record<string, string> = {
  core: 'bg-blue-100 text-blue-700',
  auth: 'bg-violet-100 text-violet-700',
  business: 'bg-emerald-100 text-emerald-700',
  data: 'bg-amber-100 text-amber-700',
  observability: 'bg-cyan-100 text-cyan-700',
};

export function ServiceCard({ service, actionPending, onStart, onStop, onRestart, onLogs }: Props) {
  const isPending = actionPending === service.name || actionPending === 'bulk';
  const health = service.health || 'UNKNOWN';

  return (
    <div className={`relative rounded-xl border p-4 transition-all ${STATUS_BG[health] || STATUS_BG.UNKNOWN}`}>
      {isPending && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-white/60">
          <Loader2 className="h-6 w-6 animate-spin text-action-primary" />
        </div>
      )}

      {/* Header: icon + name + category */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          {STATUS_ICON[health] || STATUS_ICON.UNKNOWN}
          <div>
            <Text className="text-sm font-semibold text-text-primary">
              {service.name}
            </Text>
            <Text variant="secondary" className="text-[10px]">
              {service.containerId || '—'}
            </Text>
          </div>
        </div>
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${CATEGORY_COLORS[service.category] || ''}`}>
          {service.category}
        </span>
      </div>

      {/* Info row */}
      <div className="mt-3 flex items-center gap-4 text-xs text-text-secondary">
        {service.port && (
          <span className="font-mono">:{service.port}</span>
        )}
        <span>{health}</span>
        {service.responseTime != null && (
          <span>{service.responseTime}ms</span>
        )}
        {service.uptime && (
          <span>{service.uptime}</span>
        )}
      </div>

      {/* Type + health badge */}
      <div className="mt-2 flex items-center gap-1.5">
        {service.type === 'process' ? (
          <span className="inline-block rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-medium text-indigo-700">
            process{service.containerId ? ` (${service.containerId})` : ''}
          </span>
        ) : service.dockerHealth ? (
          <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${
            service.dockerHealth === 'healthy'
              ? 'bg-emerald-100 text-emerald-700'
              : service.dockerHealth === 'unhealthy'
                ? 'bg-rose-100 text-rose-700'
                : 'bg-amber-100 text-amber-700'
          }`}>
            docker: {service.dockerHealth}
          </span>
        ) : null}
      </div>

      {/* Actions */}
      <div className="mt-3 flex items-center gap-1.5">
        <button
          onClick={() => onStart(service.name)}
          disabled={isPending || service.running || service.type === 'process'}
          className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-[11px] font-medium text-emerald-700 transition hover:bg-emerald-100 disabled:opacity-40 disabled:cursor-not-allowed"
          title={service.type === 'process' ? 'Use npm scripts to start' : 'Start'}
        >
          <Play className="h-3.5 w-3.5" />
          Start
        </button>
        <button
          onClick={() => onStop(service.name)}
          disabled={isPending || !service.running}
          className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-[11px] font-medium text-rose-700 transition hover:bg-rose-100 disabled:opacity-40 disabled:cursor-not-allowed"
          title="Stop"
        >
          <Square className="h-3.5 w-3.5" />
          Stop
        </button>
        <button
          onClick={() => onRestart(service.name)}
          disabled={isPending || !service.running}
          className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-[11px] font-medium text-blue-700 transition hover:bg-blue-100 disabled:opacity-40 disabled:cursor-not-allowed"
          title="Restart"
        >
          <RotateCw className="h-3.5 w-3.5" />
          Restart
        </button>
        <button
          onClick={() => onLogs(service.name)}
          disabled={isPending}
          className="ml-auto flex items-center gap-1 rounded-lg px-2 py-1.5 text-[11px] font-medium text-text-secondary transition hover:bg-surface-muted disabled:opacity-40"
          title="View Logs"
        >
          <ScrollText className="h-3.5 w-3.5" />
          Logs
        </button>
      </div>
    </div>
  );
}
