/**
 * useFilterBuilder — State management for the custom filter builder tree.
 *
 * Manages a recursive AND/OR tree of filter conditions.
 * Supports: add/remove/move/clone/lock/not operations, independent combinators,
 * and drag-and-drop reordering via @dnd-kit.
 */
import { useCallback, useState } from 'react';
import type { FilterType, FilterCondition, FilterCombinator, FilterGroup, FilterNode, FilterTreeNode } from './types';

export type { FilterType, FilterCondition, FilterCombinator, FilterGroup, FilterNode, FilterTreeNode };

// ── ID generation ──

let _nextId = 1;
const uid = () => `fb_${_nextId++}`;

// ── Factory helpers ──

export function createEmptyCondition(): FilterCondition {
  return { type: 'condition', id: uid(), colId: '', filterType: 'text', operator: 'contains', value: '' };
}

export function createCombinator(logic: 'AND' | 'OR' = 'AND'): FilterCombinator {
  return { type: 'combinator', id: uid(), logic };
}

export function createEmptyGroup(logic: 'AND' | 'OR' = 'AND'): FilterGroup {
  return { type: 'group', id: uid(), logic, not: false, children: [] };
}

// ── Deep tree helpers ──

/** Recursively finds a node by id and calls updater. Return null to delete. */
function findAndUpdate(
  nodes: FilterTreeNode[],
  targetId: string,
  updater: (node: FilterTreeNode) => FilterTreeNode | null,
): FilterTreeNode[] {
  const result: FilterTreeNode[] = [];
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (node.id === targetId) {
      const updated = updater(node);
      if (updated !== null) {
        result.push(updated);
      } else {
        // Remove node and adjacent combinator
        if (result.length > 0 && result[result.length - 1].type === 'combinator') {
          result.pop(); // remove combinator before this node
        } else if (i + 1 < nodes.length && nodes[i + 1].type === 'combinator') {
          i++; // skip combinator after this node
        }
      }
    } else if (node.type === 'group') {
      result.push({ ...node, children: findAndUpdate(node.children, targetId, updater) });
    } else {
      result.push(node);
    }
  }
  return result;
}

function getSubstantialChildren(nodes: FilterTreeNode[]): FilterNode[] {
  return nodes.filter((n) => n.type !== 'combinator') as FilterNode[];
}

function countDepth(nodes: FilterTreeNode[], current: number = 0): number {
  let max = current;
  for (const node of nodes) {
    if (node.type === 'group') max = Math.max(max, countDepth(node.children, current + 1));
  }
  return max;
}

function deepClone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v)) as T;
}

/** Assign fresh IDs to an entire subtree (for clone operations). */
function freshenIds(node: FilterTreeNode): FilterTreeNode {
  const next = { ...node, id: uid() };
  if (next.type === 'group') {
    (next as FilterGroup).children = (next as FilterGroup).children.map(freshenIds);
  }
  return next;
}

// ── Hook interface ──

export interface UseFilterBuilderReturn {
  root: FilterGroup;
  setRoot: (root: FilterGroup) => void;
  addCondition: (parentId: string) => void;
  addGroup: (parentId: string) => void;
  removeNode: (id: string) => void;
  updateCondition: (id: string, updates: Partial<FilterCondition>) => void;
  setLogic: (targetId: string, logic: 'AND' | 'OR') => void;
  indentNode: (id: string) => void;
  outdentNode: (id: string) => void;
  moveNode: (id: string, direction: 'up' | 'down') => void;
  moveNodeDnD: (activeId: string, overId: string) => void;
  cloneNode: (id: string) => void;
  toggleLock: (id: string) => void;
  toggleNot: (groupId: string) => void;
  clear: () => void;
  isEmpty: boolean;
  maxDepthReached: boolean;
}

export function useFilterBuilder(maxNesting: number = 3): UseFilterBuilderReturn {
  const [root, setRoot] = useState<FilterGroup>(createEmptyGroup);

  // ── Add condition ──
  const addCondition = useCallback((parentId: string) => {
    setRoot((prev) => {
      const addTo = (group: FilterGroup): FilterGroup => {
        if (group.id === parentId) {
          const hasRules = getSubstantialChildren(group.children).length > 0;
          const newItems: FilterTreeNode[] = hasRules
            ? [createCombinator(group.logic), createEmptyCondition()]
            : [createEmptyCondition()];
          return { ...group, children: [...group.children, ...newItems] };
        }
        return { ...group, children: group.children.map((c) => (c.type === 'group' ? addTo(c) : c)) };
      };
      return addTo(prev);
    });
  }, []);

  // ── Add group ──
  const addGroup = useCallback((parentId: string) => {
    setRoot((prev) => {
      if (countDepth(prev.children, 1) >= maxNesting) return prev;
      const addTo = (group: FilterGroup): FilterGroup => {
        if (group.id === parentId) {
          const hasRules = getSubstantialChildren(group.children).length > 0;
          const newGroup = createEmptyGroup('OR');
          const newItems: FilterTreeNode[] = hasRules
            ? [createCombinator(group.logic), newGroup]
            : [newGroup];
          return { ...group, children: [...group.children, ...newItems] };
        }
        return { ...group, children: group.children.map((c) => (c.type === 'group' ? addTo(c) : c)) };
      };
      return addTo(prev);
    });
  }, [maxNesting]);

  // ── Remove node ──
  const removeNode = useCallback((id: string) => {
    setRoot((prev) => ({ ...prev, children: findAndUpdate(prev.children, id, () => null) }));
  }, []);

  // ── Update condition ──
  const updateCondition = useCallback((id: string, updates: Partial<FilterCondition>) => {
    setRoot((prev) => ({
      ...prev,
      children: findAndUpdate(prev.children, id, (n) =>
        n.type === 'condition' ? { ...n, ...updates } : n,
      ),
    }));
  }, []);

  // ── Set logic (combinator or group) ──
  const setLogic = useCallback((targetId: string, logic: 'AND' | 'OR') => {
    setRoot((prev) => {
      const update = (children: FilterTreeNode[]): FilterTreeNode[] =>
        children.map((c) => {
          if (c.id === targetId) {
            if (c.type === 'combinator') return { ...c, logic };
            if (c.type === 'group') return { ...c, logic };
          }
          if (c.type === 'group') return { ...c, children: update(c.children) };
          return c;
        });
      if (prev.id === targetId) return { ...prev, logic };
      return { ...prev, children: update(prev.children) };
    });
  }, []);

  // ── Indent: wrap node in a new OR sub-group ──
  const indentNode = useCallback((id: string) => {
    setRoot((prev) => {
      if (countDepth(prev.children, 1) >= maxNesting) return prev;
      function doIndent(children: FilterTreeNode[]): FilterTreeNode[] {
        return children.map((child) => {
          if (child.id === id) {
            return { type: 'group' as const, id: uid(), logic: 'OR' as const, not: false, children: [child] };
          }
          if (child.type === 'group') return { ...child, children: doIndent(child.children) };
          return child;
        });
      }
      return { ...prev, children: doIndent(prev.children) };
    });
  }, [maxNesting]);

  // ── Outdent: move node up to grandparent ──
  const outdentNode = useCallback((id: string) => {
    setRoot((prev) => {
      function doOutdent(children: FilterTreeNode[]): FilterTreeNode[] {
        const result: FilterTreeNode[] = [];
        for (const child of children) {
          if (child.type === 'group') {
            const idx = child.children.findIndex((c) => c.id === id);
            if (idx >= 0) {
              const target = child.children[idx];
              const remaining = child.children.filter((_, i) => i !== idx);
              if (remaining.length > 0) result.push({ ...child, children: remaining });
              result.push(target);
            } else {
              result.push({ ...child, children: doOutdent(child.children) });
            }
          } else {
            result.push(child);
          }
        }
        return result;
      }
      return { ...prev, children: doOutdent(prev.children) };
    });
  }, []);

  // ── Move node up/down within siblings ──
  const moveNode = useCallback((id: string, direction: 'up' | 'down') => {
    setRoot((prev) => {
      function doMove(children: FilterTreeNode[]): FilterTreeNode[] {
        // Work only with non-combinator children for index calculation
        const substantial = children.filter((c) => c.type !== 'combinator');
        const idx = substantial.findIndex((c) => c.id === id);
        if (idx >= 0) {
          const newIdx = direction === 'up' ? idx - 1 : idx + 1;
          if (newIdx < 0 || newIdx >= substantial.length) return children;
          const arr = [...substantial];
          [arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]];
          // Rebuild the full children array maintaining combinator positions
          let subIdx = 0;
          return children.map((c) => (c.type === 'combinator' ? c : arr[subIdx++]));
        }
        return children.map((c) =>
          c.type === 'group' ? { ...c, children: doMove(c.children) } : c,
        );
      }
      return { ...prev, children: doMove(prev.children) };
    });
  }, []);

  // ── DnD reorder: swap activeId with overId within same parent ──
  const moveNodeDnD = useCallback((activeId: string, overId: string) => {
    if (activeId === overId) return;
    setRoot((prev) => {
      function doSwap(children: FilterTreeNode[]): FilterTreeNode[] {
        const activeIdx = children.findIndex((c) => c.id === activeId);
        const overIdx = children.findIndex((c) => c.id === overId);
        if (activeIdx >= 0 && overIdx >= 0) {
          const arr = [...children];
          const [removed] = arr.splice(activeIdx, 1);
          arr.splice(overIdx, 0, removed);
          return arr;
        }
        return children.map((c) =>
          c.type === 'group' ? { ...c, children: doSwap(c.children) } : c,
        );
      }
      return { ...prev, children: doSwap(prev.children) };
    });
  }, []);

  // ── Clone node (deep copy with fresh ids) ──
  const cloneNode = useCallback((id: string) => {
    setRoot((prev) => {
      function doClone(children: FilterTreeNode[]): FilterTreeNode[] {
        const result: FilterTreeNode[] = [];
        for (const child of children) {
          result.push(child);
          if (child.id === id) {
            result.push(createCombinator('AND'));
            result.push(freshenIds(deepClone(child)));
          } else if (child.type === 'group') {
            result[result.length - 1] = { ...child, children: doClone(child.children) };
          }
        }
        return result;
      }
      return { ...prev, children: doClone(prev.children) };
    });
  }, []);

  // ── Toggle locked on a node ──
  const toggleLock = useCallback((id: string) => {
    setRoot((prev) => {
      const toggle = (children: FilterTreeNode[]): FilterTreeNode[] =>
        children.map((c) => {
          if (c.id === id) {
            if (c.type === 'condition') return { ...c, locked: !c.locked };
            if (c.type === 'group') return { ...c, locked: !c.locked };
          }
          if (c.type === 'group') return { ...c, children: toggle(c.children) };
          return c;
        });
      if (prev.id === id) return { ...prev, locked: !prev.locked };
      return { ...prev, children: toggle(prev.children) };
    });
  }, []);

  // ── Toggle NOT on a group ──
  const toggleNot = useCallback((groupId: string) => {
    setRoot((prev) => {
      const toggle = (children: FilterTreeNode[]): FilterTreeNode[] =>
        children.map((c) => {
          if (c.id === groupId && c.type === 'group') return { ...c, not: !c.not };
          if (c.type === 'group') return { ...c, children: toggle(c.children) };
          return c;
        });
      if (prev.id === groupId) return { ...prev, not: !prev.not };
      return { ...prev, children: toggle(prev.children) };
    });
  }, []);

  // ── Clear all ──
  const clear = useCallback(() => { setRoot(createEmptyGroup()); }, []);

  const isEmpty = root.children.length === 0;
  const maxDepthReached = countDepth(root.children, 1) >= maxNesting;

  return {
    root, setRoot,
    addCondition, addGroup, removeNode, updateCondition, setLogic,
    indentNode, outdentNode, moveNode, moveNodeDnD,
    cloneNode, toggleLock, toggleNot,
    clear, isEmpty, maxDepthReached,
  };
}
