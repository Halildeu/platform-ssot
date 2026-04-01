import { useCallback, useMemo, useState } from "react";

const STORAGE_KEY_PREFIX = "reporting-groups";

type GroupStateMap = Record<string, boolean>;

function loadState(topCategory: string): GroupStateMap {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}-${topCategory}`);
    return raw ? (JSON.parse(raw) as GroupStateMap) : {};
  } catch {
    return {};
  }
}

function saveState(topCategory: string, state: GroupStateMap) {
  localStorage.setItem(
    `${STORAGE_KEY_PREFIX}-${topCategory}`,
    JSON.stringify(state),
  );
}

/**
 * Persists group open/closed state per top category.
 * Groups default to open unless explicitly collapsed by user.
 */
export function useReportingSidebarGroupState(topCategory: string) {
  const [state, setState] = useState<GroupStateMap>(() =>
    loadState(topCategory),
  );

  const isOpen = useCallback(
    (groupId: string, defaultOpen = true) => state[groupId] ?? defaultOpen,
    [state],
  );

  const toggle = useCallback(
    (groupId: string) => {
      setState((prev) => {
        const next = { ...prev, [groupId]: !(prev[groupId] ?? true) };
        saveState(topCategory, next);
        return next;
      });
    },
    [topCategory],
  );

  const expandAll = useCallback(() => {
    setState((prev) => {
      const next = Object.fromEntries(
        Object.keys(prev).map((k) => [k, true]),
      );
      saveState(topCategory, next);
      return next;
    });
  }, [topCategory]);

  const collapseAll = useCallback(
    (groupIds: string[]) => {
      setState(() => {
        const next = Object.fromEntries(groupIds.map((k) => [k, false]));
        saveState(topCategory, next);
        return next;
      });
    },
    [topCategory],
  );

  return useMemo(
    () => ({ isOpen, toggle, expandAll, collapseAll }),
    [isOpen, toggle, expandAll, collapseAll],
  );
}
