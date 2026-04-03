/**
 * AlertRuleEditor — UI for creating/editing alert rules on a report.
 */

import React, { useState, useCallback } from 'react';
import { Bell, Plus, Trash2, Mail, MessageSquare, Globe, BellRing } from 'lucide-react';
import type { AlertRule, AlertChannel } from './types';

interface Props {
  reportId: string;
  existingRules?: AlertRule[];
  onSave?: (rules: AlertRule[]) => void;
}

const CONDITION_LABELS: Record<string, string> = {
  gt: 'Büyüktür (>)',
  lt: 'Küçüktür (<)',
  eq: 'Eşittir (=)',
  change: 'Değiştiğinde',
  anomaly: 'Anomali Algılandığında',
};

const CHANNEL_ICONS: Record<string, React.ReactNode> = {
  email: <Mail className="h-3.5 w-3.5" />,
  slack: <MessageSquare className="h-3.5 w-3.5" />,
  webhook: <Globe className="h-3.5 w-3.5" />,
  'in-app': <BellRing className="h-3.5 w-3.5" />,
};

export const AlertRuleEditor: React.FC<Props> = ({ reportId, existingRules = [], onSave }) => {
  const [rules, setRules] = useState<AlertRule[]>(existingRules);

  const addRule = useCallback(() => {
    const newRule: AlertRule = {
      id: `alert-${Date.now()}`,
      reportId,
      field: '',
      condition: 'gt',
      threshold: 0,
      channels: [{ type: 'in-app', target: '' }],
      frequency: 'daily',
      enabled: true,
      createdAt: new Date().toISOString(),
    };
    setRules((prev) => [...prev, newRule]);
  }, [reportId]);

  const removeRule = useCallback((id: string) => {
    setRules((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const updateRule = useCallback((id: string, updates: Partial<AlertRule>) => {
    setRules((prev) => prev.map((r) => r.id === id ? { ...r, ...updates } : r));
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-semibold">
          <Bell className="h-4 w-4 text-action-primary" /> Uyarı Kuralları
        </h3>
        <button type="button" onClick={addRule} className="inline-flex items-center gap-1 rounded-lg bg-action-primary px-3 py-1.5 text-xs font-medium text-action-primary-text">
          <Plus className="h-3.5 w-3.5" /> Kural Ekle
        </button>
      </div>

      {rules.map((rule) => (
        <div key={rule.id} className="rounded-xl border border-border-subtle p-4 space-y-3">
          <div className="flex items-center gap-2">
            <input
              type="text" value={rule.field} placeholder="Alan adı"
              onChange={(e) => updateRule(rule.id, { field: e.target.value })}
              className="flex-1 rounded-lg border border-border-subtle px-2 py-1.5 text-sm"
            />
            <select
              value={rule.condition}
              onChange={(e) => updateRule(rule.id, { condition: e.target.value as AlertRule['condition'] })}
              className="rounded-lg border border-border-subtle px-2 py-1.5 text-sm"
            >
              {Object.entries(CONDITION_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <input
              type="text" value={String(rule.threshold)} placeholder="Eşik"
              onChange={(e) => updateRule(rule.id, { threshold: e.target.value })}
              className="w-24 rounded-lg border border-border-subtle px-2 py-1.5 text-sm"
            />
            <button type="button" onClick={() => removeRule(rule.id)}>
              <Trash2 className="h-4 w-4 text-text-tertiary hover:text-state-danger-text" />
            </button>
          </div>
          <div className="flex items-center gap-2 text-xs text-text-secondary">
            <span>Bildirim:</span>
            {(['email', 'slack', 'webhook', 'in-app'] as const).map((ch) => (
              <button
                key={ch}
                type="button"
                onClick={() => {
                  const hasChannel = rule.channels.some((c) => c.type === ch);
                  const channels = hasChannel
                    ? rule.channels.filter((c) => c.type !== ch)
                    : [...rule.channels, { type: ch, target: '' }];
                  updateRule(rule.id, { channels });
                }}
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 ${
                  rule.channels.some((c) => c.type === ch)
                    ? 'bg-action-primary text-action-primary-text'
                    : 'bg-surface-muted text-text-tertiary'
                }`}
              >
                {CHANNEL_ICONS[ch]} {ch}
              </button>
            ))}
          </div>
        </div>
      ))}

      {rules.length > 0 && onSave && (
        <button type="button" onClick={() => onSave(rules)} className="rounded-xl bg-action-primary px-4 py-2 text-sm font-medium text-action-primary-text">
          Kuralları Kaydet
        </button>
      )}
    </div>
  );
};
