/**
 * Audit trail for Design Lab changes
 *
 * Tracks:
 * - Doc entry modifications
 * - Quality override decisions
 * - Deprecation approvals
 * - Role changes
 * - Component lifecycle transitions
 *
 * Storage: localStorage in dev, API endpoint in prod
 */

import { useState, useCallback, useEffect } from "react";

export interface AuditEntry {
  id: string;
  timestamp: string;
  actor: string;
  action: AuditAction;
  target: string;
  details: string;
  metadata?: Record<string, unknown>;
}

export type AuditAction =
  | "doc_entry_modified"
  | "quality_override"
  | "deprecation_approved"
  | "deprecation_proposed"
  | "role_changed"
  | "lifecycle_transition"
  | "exception_created"
  | "component_published";

const STORAGE_KEY = "design-lab-audit-trail";

function loadEntries(): AuditEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as AuditEntry[];
  } catch {
    return [];
  }
}

function persistEntries(entries: AuditEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // Storage quota or unavailable — silently drop
  }
}

let nextId = Date.now();

export function useAuditTrail(): {
  entries: AuditEntry[];
  log: (
    action: AuditAction,
    target: string,
    details: string,
    metadata?: Record<string, unknown>,
  ) => void;
  getByTarget: (target: string) => AuditEntry[];
  getByAction: (action: AuditAction) => AuditEntry[];
  clear: () => void;
} {
  const [entries, setEntries] = useState<AuditEntry[]>(() => loadEntries());

  // Sync to localStorage on change
  useEffect(() => {
    persistEntries(entries);
  }, [entries]);

  const log = useCallback(
    (
      action: AuditAction,
      target: string,
      details: string,
      metadata?: Record<string, unknown>,
    ) => {
      const entry: AuditEntry = {
        id: `audit-${++nextId}`,
        timestamp: new Date().toISOString(),
        actor: "current-user",
        action,
        target,
        details,
        metadata,
      };
      setEntries((prev) => [entry, ...prev]);
    },
    [],
  );

  const getByTarget = useCallback(
    (target: string) => entries.filter((e) => e.target === target),
    [entries],
  );

  const getByAction = useCallback(
    (action: AuditAction) => entries.filter((e) => e.action === action),
    [entries],
  );

  const clear = useCallback(() => {
    setEntries([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { entries, log, getByTarget, getByAction, clear };
}
