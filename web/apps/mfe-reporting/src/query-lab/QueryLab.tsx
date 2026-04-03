/**
 * QueryLab — SQL editor with schema browser and result grid.
 *
 * Layout: Left (schema tree) + Center (SQL editor + results)
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Play, Clock, Trash2, Table2, ChevronDown, ChevronRight, Copy } from 'lucide-react';
import { useQueryExecution } from './useQueryExecution';
import type { QueryHistoryEntry } from './types';

const HISTORY_KEY = 'query-lab-history';
const MAX_HISTORY = 50;

function loadHistory(): QueryHistoryEntry[] {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) ?? '[]');
  } catch { return []; }
}

function saveHistory(entries: QueryHistoryEntry[]) {
  try { localStorage.setItem(HISTORY_KEY, JSON.stringify(entries.slice(0, MAX_HISTORY))); } catch { /* */ }
}

interface Props {
  schema?: string;
  tables?: Array<{ name: string; columns: Array<{ name: string; dataType: string }> }>;
}

export const QueryLab: React.FC<Props> = ({ schema = '', tables = [] }) => {
  const [sql, setSql] = useState('SELECT TOP 100 * FROM ');
  const [activeSchema, setActiveSchema] = useState(schema);
  const [history, setHistory] = useState<QueryHistoryEntry[]>(loadHistory);
  const [showHistory, setShowHistory] = useState(false);
  const [expandedTables, setExpandedTables] = useState<Set<string>>(new Set());
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { execution, execute, clear } = useQueryExecution();

  const handleRun = useCallback(() => {
    if (!sql.trim()) return;
    execute(sql, activeSchema);
  }, [sql, activeSchema, execute]);

  /* Save to history on success */
  useEffect(() => {
    if (execution?.status === 'success') {
      const entry: QueryHistoryEntry = {
        id: execution.id,
        sql: execution.sql,
        schema: execution.schema,
        executedAt: execution.startedAt,
        durationMs: execution.durationMs ?? 0,
        rowCount: execution.rowCount ?? 0,
        status: 'success',
      };
      const updated = [entry, ...history.filter((h) => h.sql !== sql)].slice(0, MAX_HISTORY);
      setHistory(updated);
      saveHistory(updated);
    }
  }, [execution?.status]);

  /* Ctrl+Enter to run */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleRun();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleRun]);

  const toggleTable = (name: string) => {
    setExpandedTables((prev) => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  };

  return (
    <div className="flex h-[calc(100vh-200px)] gap-3">
      {/* Left: Schema tree */}
      <div className="w-[220px] shrink-0 overflow-y-auto rounded-xl border border-border-subtle bg-surface-default p-2">
        <div className="mb-2 text-xs font-semibold text-text-secondary">Tablolar ({tables.length})</div>
        {tables.map((table) => (
          <div key={table.name}>
            <button
              type="button"
              onClick={() => toggleTable(table.name)}
              className="flex w-full items-center gap-1 rounded px-2 py-1 text-[11px] font-medium hover:bg-surface-muted"
            >
              {expandedTables.has(table.name) ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
              <Table2 className="h-3 w-3 text-text-tertiary" />
              <span className="truncate">{table.name}</span>
            </button>
            {expandedTables.has(table.name) && table.columns.map((col) => (
              <button
                key={`${table.name}.${col.name}`}
                type="button"
                onClick={() => {
                  const ref = textareaRef.current;
                  if (ref) {
                    const pos = ref.selectionStart;
                    const newSql = sql.slice(0, pos) + col.name + sql.slice(pos);
                    setSql(newSql);
                    ref.focus();
                  }
                }}
                className="ml-5 flex w-[calc(100%-20px)] items-center gap-1 rounded px-2 py-0.5 text-[10px] text-text-tertiary hover:bg-surface-muted"
              >
                <span className="truncate">{col.name}</span>
                <span className="ml-auto text-[9px]">{col.dataType}</span>
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* Center: Editor + Results */}
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        {/* SQL Editor */}
        <div className="rounded-xl border border-border-subtle bg-surface-default">
          <div className="flex items-center gap-2 border-b border-border-subtle px-3 py-2">
            <button
              type="button"
              onClick={handleRun}
              disabled={execution?.status === 'running'}
              className="inline-flex items-center gap-1.5 rounded-lg bg-action-primary px-3 py-1.5 text-xs font-medium text-action-primary-text hover:opacity-90 disabled:opacity-40"
            >
              <Play className="h-3.5 w-3.5" />
              {execution?.status === 'running' ? 'Çalışıyor...' : 'Çalıştır'}
            </button>
            <kbd className="text-[9px] text-text-tertiary">⌘Enter</kbd>
            <div className="ml-auto flex items-center gap-2">
              <input
                type="text"
                value={activeSchema}
                onChange={(e) => setActiveSchema(e.target.value)}
                placeholder="Schema"
                className="w-40 rounded border border-border-subtle px-2 py-1 text-[11px]"
              />
              <button type="button" onClick={() => setShowHistory(!showHistory)} className="text-text-tertiary hover:text-text-primary">
                <Clock className="h-4 w-4" />
              </button>
            </div>
          </div>
          <textarea
            ref={textareaRef}
            value={sql}
            onChange={(e) => setSql(e.target.value)}
            className="w-full resize-none bg-transparent px-3 py-3 font-mono text-sm text-text-primary outline-none"
            rows={6}
            placeholder="SELECT * FROM ..."
            spellCheck={false}
          />
        </div>

        {/* Results */}
        <div className="min-h-0 flex-1 overflow-auto rounded-xl border border-border-subtle bg-surface-default">
          {execution?.status === 'running' && (
            <div className="flex h-full items-center justify-center">
              <span className="inline-flex h-5 w-5 animate-spin rounded-full border-2 border-border-subtle border-t-action-primary" />
            </div>
          )}
          {execution?.status === 'error' && (
            <div className="p-4 text-sm text-state-danger-text">{execution.error}</div>
          )}
          {execution?.status === 'success' && execution.columns && (
            <div>
              <div className="border-b border-border-subtle px-3 py-1.5 text-[10px] text-text-tertiary">
                {execution.rowCount} satır · {execution.durationMs}ms
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border-subtle bg-surface-muted">
                      {execution.columns.map((col) => (
                        <th key={col} className="px-3 py-1.5 text-left font-medium text-text-secondary">{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(execution.rows ?? []).slice(0, 100).map((row, i) => (
                      <tr key={i} className="border-b border-border-subtle hover:bg-surface-muted">
                        {(row as unknown[]).map((cell, j) => (
                          <td key={j} className="px-3 py-1 text-text-primary">{cell != null ? String(cell) : <span className="text-text-tertiary">NULL</span>}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {!execution && (
            <div className="flex h-full items-center justify-center text-sm text-text-tertiary">
              SQL yazın ve ⌘Enter ile çalıştırın
            </div>
          )}
        </div>

        {/* History drawer */}
        {showHistory && (
          <div className="max-h-[200px] overflow-y-auto rounded-xl border border-border-subtle bg-surface-default p-2">
            <div className="mb-1 text-xs font-semibold text-text-secondary">Sorgu Geçmişi</div>
            {history.map((h) => (
              <button
                key={h.id}
                type="button"
                onClick={() => { setSql(h.sql); setShowHistory(false); }}
                className="flex w-full items-center gap-2 rounded px-2 py-1 text-left text-[11px] hover:bg-surface-muted"
              >
                <span className="min-w-0 flex-1 truncate font-mono">{h.sql}</span>
                <span className="text-text-tertiary">{h.durationMs}ms</span>
                <span className="text-text-tertiary">{h.rowCount} satır</span>
              </button>
            ))}
            {!history.length && <p className="text-xs text-text-tertiary">Henüz sorgu çalıştırılmadı.</p>}
          </div>
        )}
      </div>
    </div>
  );
};
