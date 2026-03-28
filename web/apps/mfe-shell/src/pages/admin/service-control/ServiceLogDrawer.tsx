import React, { useEffect, useState, useCallback } from 'react';
import { X, RefreshCw, Loader2 } from 'lucide-react';
import { Text } from '@mfe/design-system';

type Props = {
  serviceName: string | null;
  onClose: () => void;
  fetchLogs: (name: string, tail?: number) => Promise<string>;
};

export function ServiceLogDrawer({ serviceName, onClose, fetchLogs }: Props) {
  const [logs, setLogs] = useState('');
  const [loading, setLoading] = useState(false);
  const [tail, setTail] = useState(100);

  const load = useCallback(async () => {
    if (!serviceName) return;
    setLoading(true);
    try {
      const text = await fetchLogs(serviceName, tail);
      setLogs(text);
    } catch (err) {
      setLogs(`Error fetching logs: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  }, [serviceName, tail, fetchLogs]);

  useEffect(() => {
    if (serviceName) load();
  }, [serviceName, load]);

  if (!serviceName) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/20 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-2xl flex-col border-l border-border-subtle bg-surface-default shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border-subtle px-5 py-4">
          <div>
            <Text as="h3" className="text-base font-semibold text-text-primary">
              {serviceName}
            </Text>
            <Text variant="secondary" className="text-xs">
              Son {tail} satir log
            </Text>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={tail}
              onChange={(e) => setTail(Number(e.target.value))}
              className="rounded-lg border border-border-subtle bg-surface-muted px-2 py-1 text-xs text-text-primary"
            >
              <option value={50}>50 satir</option>
              <option value={100}>100 satir</option>
              <option value={300}>300 satir</option>
              <option value={500}>500 satir</option>
            </select>
            <button
              onClick={load}
              disabled={loading}
              className="flex items-center gap-1 rounded-lg bg-surface-muted px-3 py-1.5 text-xs font-medium text-text-primary transition hover:bg-surface-canvas disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <RefreshCw className="h-3.5 w-3.5" />
              )}
              Yenile
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-text-secondary transition hover:bg-surface-muted"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Log content */}
        <div className="flex-1 overflow-auto bg-gray-950 p-4">
          {loading && !logs ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          ) : (
            <pre className="whitespace-pre-wrap break-all font-mono text-xs leading-5 text-gray-300">
              {logs || 'No logs available.'}
            </pre>
          )}
        </div>
      </div>
    </>
  );
}
