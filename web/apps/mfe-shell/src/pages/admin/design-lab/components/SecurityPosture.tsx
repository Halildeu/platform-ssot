import React from 'react';
import { ShieldAlert, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { Text } from '@mfe/design-system';

type ScanStatus = 'passing' | 'pending' | 'warning' | 'failing';

interface SecurityScan {
  name: string;
  description: string;
  status: ScanStatus;
  lastRun?: string;
}

const STATUS_CONFIG: Record<ScanStatus, { icon: React.ReactNode; badge: string }> = {
  passing: {
    icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
    badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  },
  pending: {
    icon: <Clock className="h-4 w-4 text-blue-500" />,
    badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  },
  warning: {
    icon: <AlertTriangle className="h-4 w-4 text-amber-500" />,
    badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  },
  failing: {
    icon: <ShieldAlert className="h-4 w-4 text-red-500" />,
    badge: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  },
};

const SCANS: SecurityScan[] = [
  { name: 'CodeQL', description: 'Statik kod analizi', status: 'passing', lastRun: '2 saat önce' },
  { name: 'Secret Scan', description: 'Gizli bilgi taraması', status: 'passing', lastRun: '1 saat önce' },
  { name: 'Dependency Scan', description: 'Bağımlılık güvenlik taraması', status: 'warning', lastRun: '3 saat önce' },
  { name: 'SBOM', description: 'Yazılım malzeme listesi', status: 'pending', lastRun: 'Bekliyor' },
];

const STATUS_LABELS: Record<ScanStatus, string> = {
  passing: 'Başarılı',
  pending: 'Bekliyor',
  warning: 'Uyarı',
  failing: 'Başarısız',
};

export function SecurityPosture() {
  const passingCount = SCANS.filter((s) => s.status === 'passing').length;

  return (
    <div className="rounded-2xl border border-border-subtle bg-surface-default p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-violet-500" />
          <Text as="div" className="text-sm font-semibold text-text-primary">
            Security Posture
          </Text>
        </div>
        <div className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
          passingCount === SCANS.length
            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
            : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
        }`}>
          {passingCount}/{SCANS.length} geçiyor
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {SCANS.map((scan) => {
          const config = STATUS_CONFIG[scan.status];
          return (
            <div
              key={scan.name}
              className="rounded-xl border border-border-subtle bg-surface-canvas/50 p-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {config.icon}
                  <Text className="text-xs font-semibold text-text-primary">{scan.name}</Text>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${config.badge}`}>
                  {STATUS_LABELS[scan.status]}
                </span>
              </div>
              <Text variant="secondary" className="mt-1 text-[10px]">
                {scan.description}
              </Text>
              {scan.lastRun && (
                <Text variant="secondary" className="mt-0.5 text-[10px] italic">
                  Son: {scan.lastRun}
                </Text>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
