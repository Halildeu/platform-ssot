import React from 'react';

type StatusBadgeProps = {
  status: string;
};

const toneMap: Record<string, { bg: string; text: string; dot: string }> = {
  OK: { bg: 'bg-status-success/5', text: 'text-status-success-text', dot: 'bg-status-success-text' },
  READY: { bg: 'bg-status-success/5', text: 'text-status-success-text', dot: 'bg-status-success-text' },
  PASS: { bg: 'bg-status-success/5', text: 'text-status-success-text', dot: 'bg-status-success-text' },
  WARN: { bg: 'bg-status-warning/5', text: 'text-status-warning-text', dot: 'bg-status-warning-text' },
  NOT_READY: { bg: 'bg-status-danger/5', text: 'text-status-danger-text', dot: 'bg-status-danger-text' },
  FAIL: { bg: 'bg-status-danger/5', text: 'text-status-danger-text', dot: 'bg-status-danger-text' },
  BLOCKED: { bg: 'bg-status-danger/5', text: 'text-status-danger-text', dot: 'bg-status-danger-text' },
  IDLE: { bg: 'bg-surface-muted', text: 'text-text-secondary', dot: 'bg-text-subtle' },
  NOT_CONFIGURED: { bg: 'bg-surface-muted', text: 'text-text-secondary', dot: 'bg-text-subtle' },
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const tone = toneMap[status] ?? toneMap.IDLE;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${tone.bg} ${tone.text}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${tone.dot}`} />
      {status}
    </span>
  );
};

export default StatusBadge;
