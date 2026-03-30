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
  MemoryStick,
  Cpu,
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
  UP: <CheckCircle2 className="h-5 w-5 text-state-success-text" />,
  DOWN: <XCircle className="h-5 w-5 text-state-danger-text" />,
  TIMEOUT: <XCircle className="h-5 w-5 text-state-warning-text" />,
  UNKNOWN: <HelpCircle className="h-5 w-5 text-text-secondary" />,
  no_healthcheck: <HelpCircle className="h-5 w-5 text-text-secondary" />,
};

const STATUS_BG: Record<string, string> = {
  UP: 'border-state-success-text/20 bg-state-success-bg/50',
  DOWN: 'border-state-danger-text/20 bg-state-danger-bg/50',
  TIMEOUT: 'border-state-warning-text/20 bg-state-warning-bg/50',
  UNKNOWN: 'border-border-subtle bg-surface-muted',
  no_healthcheck: 'border-border-subtle bg-surface-muted',
};

const CATEGORY_COLORS: Record<string, string> = {
  core: 'bg-state-info-bg text-state-info-text',
  auth: 'bg-action-primary/10 text-action-primary',
  business: 'bg-state-success-bg text-state-success-text',
  data: 'bg-state-warning-bg text-state-warning-text',
  observability: 'bg-state-info-bg text-state-info-text',
};

export function ServiceCard({ service, actionPending, onStart, onStop, onRestart, onLogs }: Props) {
  const isPending = actionPending === service.name || actionPending === 'bulk';
  const health = service.health || 'UNKNOWN';

  return (
    <div className={`relative rounded-xl border p-4 transition-all ${STATUS_BG[health] || STATUS_BG.UNKNOWN}`}>
      {isPending && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-surface-default/60">
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
      <div className="mt-3 flex items-center gap-3 text-xs text-text-secondary">
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

      {/* Resource usage */}
      {(service.rssMb != null || service.cpu != null) && (
        <div className="mt-2 flex items-center gap-3">
          {service.rssMb != null && (
            <div className="flex items-center gap-1">
              <MemoryStick className="h-3 w-3 text-text-secondary" />
              <span className={`text-[11px] font-semibold ${
                service.rssMb > 1000 ? 'text-state-danger-text' : service.rssMb > 500 ? 'text-state-warning-text' : 'text-state-success-text'
              }`}>
                {service.rssMb}MB
              </span>
              <div className="h-1.5 w-16 overflow-hidden rounded-full bg-surface-raised">
                <div
                  className={`h-full rounded-full transition-all ${
                    service.rssMb > 1000 ? 'bg-state-danger-text' : service.rssMb > 500 ? 'bg-state-warning-text' : 'bg-state-success-text'
                  }`}
                  style={{ width: `${Math.min(100, (service.rssMb / 1500) * 100)}%` }}
                />
              </div>
            </div>
          )}
          {service.cpu != null && service.cpu > 0 && (
            <div className="flex items-center gap-1">
              <Cpu className="h-3 w-3 text-text-secondary" />
              <span className="text-[11px] font-medium text-text-secondary">{service.cpu.toFixed(1)}%</span>
            </div>
          )}
        </div>
      )}

      {/* Type + health badge */}
      <div className="mt-2 flex items-center gap-1.5">
        {service.type === 'process' ? (
          <span className="inline-block rounded-full bg-action-primary/10 px-2 py-0.5 text-[10px] font-medium text-action-primary">
            process{service.containerId ? ` (${service.containerId})` : ''}
          </span>
        ) : service.dockerHealth ? (
          <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${
            service.dockerHealth === 'healthy'
              ? 'bg-state-success-bg text-state-success-text'
              : service.dockerHealth === 'unhealthy'
                ? 'bg-state-danger-bg text-state-danger-text'
                : 'bg-state-warning-bg text-state-warning-text'
          }`}>
            docker: {service.dockerHealth}
          </span>
        ) : null}
      </div>

      {/* Actions */}
      <div className="mt-3 flex items-center gap-1.5">
        <button
          onClick={() => onStart(service.name)}
          disabled={isPending || service.running}
          className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-[11px] font-medium text-state-success-text transition hover:bg-state-success-bg disabled:opacity-40 disabled:cursor-not-allowed"
          title="Start"
        >
          <Play className="h-3.5 w-3.5" />
          Start
        </button>
        <button
          onClick={() => onStop(service.name)}
          disabled={isPending || !service.running}
          className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-[11px] font-medium text-state-danger-text transition hover:bg-state-danger-bg disabled:opacity-40 disabled:cursor-not-allowed"
          title="Stop"
        >
          <Square className="h-3.5 w-3.5" />
          Stop
        </button>
        <button
          onClick={() => onRestart(service.name)}
          disabled={isPending || !service.running}
          className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-[11px] font-medium text-state-info-text transition hover:bg-state-info-bg disabled:opacity-40 disabled:cursor-not-allowed"
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
