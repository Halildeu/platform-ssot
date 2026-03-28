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
      <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/50 px-5 py-4 dark:border-emerald-800 dark:bg-emerald-950/20">
        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
        <Text className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
          Tüm sistemler sağlıklı — açık uyarı yok
        </Text>
      </div>
    );
  }

  const severityConfig = {
    critical: { bg: 'bg-red-50 dark:bg-red-950/20', border: 'border-red-200 dark:border-red-800', icon: <AlertCircle className="h-4 w-4 text-red-600" />, label: 'P0' },
    warning: { bg: 'bg-amber-50 dark:bg-amber-950/20', border: 'border-amber-200 dark:border-amber-800', icon: <AlertTriangle className="h-4 w-4 text-amber-600" />, label: 'P1' },
    info: { bg: 'bg-blue-50 dark:bg-blue-950/20', border: 'border-blue-200 dark:border-blue-800', icon: <CheckCircle2 className="h-4 w-4 text-blue-600" />, label: 'P2' },
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
                  <span className="rounded-xs bg-black/10 px-1.5 py-0.5 text-[10px] font-bold">{config.label}</span>
                  <Text className="text-sm font-semibold text-text-primary">{alert.title}</Text>
                </div>
                <Text className="text-xs text-text-secondary">{alert.description}</Text>
              </div>
            </div>
            {alert.action && (
              <a href={alert.action.href} className="flex items-center gap-1 rounded-lg bg-white/80 px-3 py-1.5 text-xs font-medium text-text-primary shadow-xs transition hover:bg-white">
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
