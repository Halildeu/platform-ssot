/**
 * ScheduleEditor — Cron-based report scheduling UI.
 */

import React, { useState, useCallback } from 'react';
import { Clock, Mail, FileText } from 'lucide-react';
import type { ScheduleConfig } from './types';

interface Props {
  reportId: string;
  existing?: ScheduleConfig | null;
  onSave?: (config: ScheduleConfig) => void;
}

const PRESETS = [
  { label: 'Her gün 09:00', cron: '0 9 * * *' },
  { label: 'Her Pazartesi 09:00', cron: '0 9 * * 1' },
  { label: 'Her ayın 1\'i', cron: '0 9 1 * *' },
  { label: 'Her saat başı', cron: '0 * * * *' },
];

const FORMATS = [
  { value: 'excel', label: 'Excel', icon: '📊' },
  { value: 'csv', label: 'CSV', icon: '📄' },
  { value: 'pdf', label: 'PDF', icon: '📑' },
  { value: 'png', label: 'PNG (Screenshot)', icon: '📸' },
];

export const ScheduleEditor: React.FC<Props> = ({ reportId, existing, onSave }) => {
  const [config, setConfig] = useState<Partial<ScheduleConfig>>(existing ?? {
    reportId,
    enabled: true,
    cron: '0 9 * * 1',
    timezone: 'Europe/Istanbul',
    recipients: [],
    format: 'excel',
    createdAt: new Date().toISOString(),
  });
  const [recipientInput, setRecipientInput] = useState('');

  const addRecipient = useCallback(() => {
    if (!recipientInput.trim()) return;
    setConfig((prev) => ({
      ...prev,
      recipients: [...(prev.recipients ?? []), recipientInput.trim()],
    }));
    setRecipientInput('');
  }, [recipientInput]);

  return (
    <div className="space-y-4">
      <h3 className="flex items-center gap-2 text-sm font-semibold">
        <Clock className="h-4 w-4 text-action-primary" /> Zamanlanmış Gönderim
      </h3>

      {/* Presets */}
      <div className="flex flex-wrap gap-1">
        {PRESETS.map((p) => (
          <button
            key={p.cron}
            type="button"
            onClick={() => setConfig((prev) => ({ ...prev, cron: p.cron }))}
            className={`rounded-full px-3 py-1 text-[10px] font-medium ${
              config.cron === p.cron ? 'bg-action-primary text-action-primary-text' : 'bg-surface-muted text-text-secondary'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Custom cron */}
      <label className="block">
        <span className="text-[10px] font-medium text-text-tertiary">Cron ifadesi</span>
        <input
          type="text"
          value={config.cron ?? ''}
          onChange={(e) => setConfig((prev) => ({ ...prev, cron: e.target.value }))}
          className="mt-1 w-full rounded-lg border border-border-subtle px-3 py-2 font-mono text-sm"
          placeholder="0 9 * * 1"
        />
      </label>

      {/* Format */}
      <div>
        <span className="text-[10px] font-medium text-text-tertiary">Format</span>
        <div className="mt-1 flex gap-2">
          {FORMATS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setConfig((prev) => ({ ...prev, format: f.value as any }))}
              className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs ${
                config.format === f.value ? 'bg-action-primary text-action-primary-text' : 'border border-border-subtle text-text-secondary'
              }`}
            >
              {f.icon} {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Recipients */}
      <div>
        <span className="text-[10px] font-medium text-text-tertiary">Alıcılar</span>
        <div className="mt-1 flex gap-2">
          <input
            type="email"
            value={recipientInput}
            onChange={(e) => setRecipientInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addRecipient()}
            placeholder="email@example.com"
            className="flex-1 rounded-lg border border-border-subtle px-3 py-1.5 text-sm"
          />
          <button type="button" onClick={addRecipient} className="rounded-lg bg-surface-muted px-3 py-1.5 text-xs">Ekle</button>
        </div>
        <div className="mt-1 flex flex-wrap gap-1">
          {(config.recipients ?? []).map((r, i) => (
            <span key={i} className="inline-flex items-center gap-1 rounded-full bg-surface-muted px-2 py-0.5 text-[10px]">
              <Mail className="h-3 w-3" /> {r}
              <button type="button" onClick={() => setConfig((prev) => ({ ...prev, recipients: prev.recipients?.filter((_, j) => j !== i) }))} className="text-text-tertiary hover:text-state-danger-text">×</button>
            </span>
          ))}
        </div>
      </div>

      {onSave && (
        <button type="button" onClick={() => onSave(config as ScheduleConfig)} className="rounded-xl bg-action-primary px-4 py-2 text-sm font-medium text-action-primary-text">
          Zamanlamayı Kaydet
        </button>
      )}
    </div>
  );
};
