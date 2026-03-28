import React from 'react';
import { AlertTriangle, AlertCircle, CheckCircle2, ExternalLink } from 'lucide-react';
import { Text } from '@mfe/design-system';

interface Alert {
  severity: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  action?: { label: string; href: string };
}

interface AlertPanelProps {
  alerts: Alert[];
}

export type { Alert };

export function AlertPanel({ alerts }: AlertPanelProps) {
  if (alerts.length === 0) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-state-success-text/20 bg-state-success-bg/50 px-5 py-4 dark:border-state-success-text dark:bg-state-success-text/20">
        <CheckCircle2 className="h-5 w-5 text-state-success-text" />
        <Text className="text-sm font-medium text-state-success-text dark:text-state-success-text">
          Tüm sistemler sağlıklı — açık uyarı yok
        </Text>
      </div>
    );
  }

  const severityConfig = {
    critical: { bg: 'bg-state-danger-bg dark:bg-state-danger-text-950/20', border: 'border-state-danger-text/20 dark:border-state-danger-text', icon: <AlertCircle className="h-4 w-4 text-state-danger-text" />, label: 'P0' },
    warning: { bg: 'bg-state-warning-bg dark:bg-state-warning-text/20', border: 'border-state-warning-text/20 dark:border-state-warning-text', icon: <AlertTriangle className="h-4 w-4 text-state-warning-text" />, label: 'P1' },
    info: { bg: 'bg-state-info-bg dark:bg-action-primary-950/20', border: 'border-state-info-text/20 dark:border-action-primary', icon: <CheckCircle2 className="h-4 w-4 text-action-primary" />, label: 'P2' },
  };

  return (
    <div className="flex flex-col gap-2">
      {alerts.map((alert, i) => {
        const config = severityConfig[alert.severity];
        return (
          <div key={i} className={`flex items-center justify-between rounded-xl border ${config.border} ${config.bg} px-4 py-3`}>
            <div className="flex items-center gap-3">
              {config.icon}
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-xs bg-surface-inverse/10 px-1.5 py-0.5 text-[10px] font-bold">{config.label}</span>
                  <Text className="text-sm font-semibold text-text-primary">{alert.title}</Text>
                </div>
                <Text className="text-xs text-text-secondary">{alert.description}</Text>
              </div>
            </div>
            {alert.action && (
              <a href={alert.action.href} className="flex items-center gap-1 rounded-lg bg-surface-default/80 px-3 py-1.5 text-xs font-medium text-text-primary shadow-xs transition hover:bg-surface-default">
                {alert.action.label}
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        );
      })}
    </div>
  );
}
