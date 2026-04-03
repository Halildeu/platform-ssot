import React, { useState, useMemo, useCallback } from 'react';
import { Calendar, ChevronDown, Check } from 'lucide-react';
import { Dropdown, Badge } from '@mfe/design-system';
import type { DropdownEntry } from '@mfe/design-system';
import { useShellCommonI18n } from '../../i18n';

/* ------------------------------------------------------------------ */
/*  WorkspaceSwitcher — Year/company context selector in the header    */
/*                                                                     */
/*  Persists selection to localStorage. Dispatches CustomEvent on      */
/*  change so other modules can react.                                 */
/* ------------------------------------------------------------------ */

interface Workspace {
  id: string;
  labelKey: string;
  year: number;
}

const WORKSPACES: Workspace[] = [
  { id: 'ws-2026', labelKey: 'shell.workspace.year2026', year: 2026 },
  { id: 'ws-2025', labelKey: 'shell.workspace.year2025', year: 2025 },
  { id: 'ws-2024', labelKey: 'shell.workspace.year2024', year: 2024 },
];

const STORAGE_KEY = 'shell.workspace';
const DEFAULT_WS = 'ws-2026';

function getStoredWorkspace(): string {
  try {
    return window.localStorage.getItem(STORAGE_KEY) ?? DEFAULT_WS;
  } catch {
    return DEFAULT_WS;
  }
}

export const WorkspaceSwitcher: React.FC = () => {
  const { t } = useShellCommonI18n();
  const [activeId, setActiveId] = useState(getStoredWorkspace);

  const activeWs = WORKSPACES.find((ws) => ws.id === activeId) ?? WORKSPACES[0];

  const changeWorkspace = useCallback((id: string) => {
    setActiveId(id);
    try {
      window.localStorage.setItem(STORAGE_KEY, id);
      window.dispatchEvent(
        new CustomEvent('shell:workspace-change', { detail: { workspace: id } }),
      );
    } catch { /* storage unavailable */ }
  }, []);

  const items = useMemo<DropdownEntry[]>(() => {
    const entries: DropdownEntry[] = [
      { type: 'label' as const, label: t('shell.workspace.label') },
    ];
    for (const ws of WORKSPACES) {
      entries.push({
        key: ws.id,
        label: (
          <span className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 text-text-subtle" />
            <span>{t(ws.labelKey)}</span>
            {activeId === ws.id && (
              <Check className="ml-auto h-3.5 w-3.5 text-[var(--accent-primary)]" />
            )}
          </span>
        ),
        onClick: () => changeWorkspace(ws.id),
      });
    }
    return entries;
  }, [t, activeId, changeWorkspace]);

  return (
    <Dropdown items={items} placement="bottom-start" minWidth={160}>
      <button
        type="button"
        className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-[13px] font-medium text-text-secondary transition-colors duration-150 hover:bg-surface-muted hover:text-text-primary"
        aria-label={t('shell.workspace.aria')}
      >
        <Calendar className="h-4 w-4" aria-hidden />
        <span>{t(activeWs.labelKey)}</span>
        <ChevronDown className="h-3 w-3 text-text-subtle" aria-hidden />
      </button>
    </Dropdown>
  );
};
