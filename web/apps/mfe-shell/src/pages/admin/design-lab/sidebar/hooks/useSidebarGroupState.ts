import { useCallback, useMemo, useState } from "react";

const STORAGE_KEY_PREFIX = "design-lab-groups";

type GroupStateMap = Record<string, boolean>; // groupId → isOpen

function loadState(layer: string): GroupStateMap {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}-${layer}`);
    return raw ? (JSON.parse(raw) as GroupStateMap) : {};
  } catch {
    return {};
  }
}

function saveState(layer: string, state: GroupStateMap) {
  localStorage.setItem(`${STORAGE_KEY_PREFIX}-${layer}`, JSON.stringify(state));
}

/**
 * Persists group open/closed state per layer.
 * Groups default to open unless explicitly collapsed by user.
 */
export function useSidebarGroupState(layer: string) {
  const [state, setState] = useState<GroupStateMap>(() => loadState(layer));

  const isOpen = useCallback(
    (groupId: string, defaultOpen = true) => state[groupId] ?? defaultOpen,
    [state],
  );

  const toggle = useCallback(
    (groupId: string) => {
      setState((prev) => {
        const next = { ...prev, [groupId]: !(prev[groupId] ?? true) };
        saveState(layer, next);
        return next;
      });
    },
    [layer],
  );

  const expandAll = useCallback(() => {
    setState((prev) => {
      const next = Object.fromEntries(
        Object.keys(prev).map((k) => [k, true]),
      );
      saveState(layer, next);
      return next;
    });
  }, [layer]);

  const collapseAll = useCallback(
    (groupIds: string[]) => {
      setState(() => {
        const next = Object.fromEntries(groupIds.map((k) => [k, false]));
        saveState(layer, next);
        return next;
      });
    },
    [layer],
  );

  return useMemo(
    () => ({ isOpen, toggle, expandAll, collapseAll }),
    [isOpen, toggle, expandAll, collapseAll],
  );
}
