/**
 * useFilterBuilder — State management for the custom filter builder tree.
 *
 * Manages a recursive AND/OR tree of filter conditions.
 * Converts to/from AG Grid FilterModel format.
 */
import { useCallback, useState } from 'react';

// ── Types ──

export type FilterType = 'text' | 'number' | 'date' | 'set';

export interface FilterCondition {
  type: 'condition';
  id: string;
  colId: string;
  filterType: FilterType;
  operator: string;
  value: unknown;
  valueTo?: unknown; // for inRange
}

export interface FilterCombinator {
  type: 'combinator';
  id: string;
  logic: 'AND' | 'OR';
}

export interface FilterGroup {
  type: 'group';
  id: string;
  logic: 'AND' | 'OR'; // default for new combinators
  children: FilterTreeNode[];
}

export type FilterNode = FilterCondition | FilterGroup;
export type FilterTreeNode = FilterNode | FilterCombinator;

// ── Helpers ──

let nextId = 1;
const uid = () => `fb_${nextId++}`;

export function createEmptyCondition(): FilterCondition {
  return {
    type: 'condition',
    id: uid(),
    colId: '',
    filterType: 'text',
    operator: 'contains',
    value: '',
  };
}

export function createCombinator(logic: 'AND' | 'OR' = 'AND'): FilterCombinator {
  return { type: 'combinator', id: uid(), logic };
}

export function createEmptyGroup(logic: 'AND' | 'OR' = 'AND'): FilterGroup {
  return {
    type: 'group',
    id: uid(),
    logic,
    children: [],
  };
}

// ── Deep tree operations ──

function findAndUpdate(nodes: FilterTreeNode[], targetId: string, updater: (node: FilterTreeNode) => FilterTreeNode | null): FilterTreeNode[] {
  const result: FilterTreeNode[] = [];
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (node.id === targetId) {
      const updated = updater(node);
      if (updated) {
        result.push(updated);
      } else {
        // Removing node — also remove adjacent combinator
        // If node is after a combinator, remove the combinator before it
        if (result.length > 0 && result[result.length - 1].type === 'combinator') {
          result.pop();
        }
        // If node is first and next is combinator, skip next combinator
        else if (i + 1 < nodes.length && nodes[i + 1].type === 'combinator') {
          i++; // skip next combinator
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

function getNodeChildren(nodes: FilterTreeNode[]): FilterNode[] {
  return nodes.filter((n) => n.type !== 'combinator') as FilterNode[];
}

function countDepth(nodes: FilterTreeNode[], current: number = 0): number {
  let max = current;
  for (const node of nodes) {
    if (node.type === 'group') {
      max = Math.max(max, countDepth(node.children, current + 1));
    }
  }
  return max;
}

// ── Hook ──

export interface UseFilterBuilderReturn {
  root: FilterGroup;
  setRoot: (root: FilterGroup) => void;
  addCondition: (parentId: string) => void;
  addGroup: (parentId: string) => void;
  removeNode: (id: string) => void;
  updateCondition: (id: string, updates: Partial<FilterCondition>) => void;
  setLogic: (groupId: string, logic: 'AND' | 'OR') => void;
  indentNode: (id: string) => void;
  outdentNode: (id: string) => void;
  moveNode: (id: string, direction: 'up' | 'down') => void;
  clear: () => void;
  isEmpty: boolean;
  maxDepthReached: boolean;
}

export function useFilterBuilder(maxNesting: number = 3): UseFilterBuilderReturn {
  const [root, setRoot] = useState<FilterGroup>(createEmptyGroup);

  const addCondition = useCallback((parentId: string) => {
    setRoot((prev) => {
      const addToGroup = (group: FilterGroup): FilterGroup => {
        if (group.id === parentId) {
          const hasRules = getNodeChildren(group.children).length > 0;
          const newItems: FilterTreeNode[] = hasRules
            ? [createCombinator(group.logic), createEmptyCondition()]
            : [createEmptyCondition()];
          return { ...group, children: [...group.children, ...newItems] };
        }
        return {
          ...group,
          children: group.children.map((c) =>
            c.type === 'group' ? addToGroup(c) : c,
          ),
        };
      };
      return addToGroup(prev);
    });
  }, []);

  const addGroup = useCallback((parentId: string) => {
    setRoot((prev) => {
      const depth = countDepth(prev.children, 1);
      if (depth >= maxNesting) return prev;
      const addToGroup = (group: FilterGroup): FilterGroup => {
        if (group.id === parentId) {
          const hasRules = getNodeChildren(group.children).length > 0;
          const newGroup = createEmptyGroup('OR');
          const newItems: FilterTreeNode[] = hasRules
            ? [createCombinator(group.logic), newGroup]
            : [newGroup];
          return { ...group, children: [...group.children, ...newItems] };
        }
        return {
          ...group,
          children: group.children.map((c) =>
            c.type === 'group' ? addToGroup(c) : c,
          ),
        };
      };
      return addToGroup(prev);
    });
  }, [maxNesting]);

  const removeNode = useCallback((id: string) => {
    setRoot((prev) => ({
      ...prev,
      children: findAndUpdate(prev.children, id, () => null),
    }));
  }, []);

  const updateCondition = useCallback((id: string, updates: Partial<FilterCondition>) => {
    setRoot((prev) => ({
      ...prev,
      children: findAndUpdate(prev.children, id, (node) =>
        node.type === 'condition' ? { ...node, ...updates } : node,
      ),
    }));
  }, []);

  // setLogic works for both combinator IDs and group IDs
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

  // Indent: wrap node in a new OR sub-group (moves it one level deeper)
  const indentNode = useCallback((id: string) => {
    setRoot((prev) => {
      const depth = countDepth(prev.children, 1);
      if (depth >= maxNesting) return prev;

      function doIndent(children: FilterNode[]): FilterNode[] {
        return children.map((child) => {
          if (child.id === id) {
            // Wrap in a new group
            return createEmptyGroup('OR') as FilterGroup & { children: FilterNode[] } && {
              type: 'group' as const,
              id: uid(),
              logic: 'OR' as const,
              children: [child],
            };
          }
          if (child.type === 'group') {
            return { ...child, children: doIndent(child.children) };
          }
          return child;
        });
      }
      return { ...prev, children: doIndent(prev.children) };
    });
  }, [maxNesting]);

  // Outdent: unwrap node from its parent group, move to grandparent
  const outdentNode = useCallback((id: string) => {
    setRoot((prev) => {
      function doOutdent(children: FilterNode[]): FilterNode[] {
        const result: FilterNode[] = [];
        for (const child of children) {
          if (child.type === 'group') {
            const targetIdx = child.children.findIndex((c) => c.id === id);
            if (targetIdx >= 0) {
              // Found: extract the target from this group
              const target = child.children[targetIdx];
              const remaining = child.children.filter((_, i) => i !== targetIdx);
              if (remaining.length > 0) {
                result.push({ ...child, children: remaining });
              }
              result.push(target); // Move to parent level
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

  // Move node up/down within its sibling list
  const moveNode = useCallback((id: string, direction: 'up' | 'down') => {
    setRoot((prev) => {
      function doMove(children: FilterNode[]): FilterNode[] {
        const idx = children.findIndex((c) => c.id === id);
        if (idx >= 0) {
          const newIdx = direction === 'up' ? idx - 1 : idx + 1;
          if (newIdx < 0 || newIdx >= children.length) return children;
          const arr = [...children];
          [arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]];
          return arr;
        }
        return children.map((c) =>
          c.type === 'group' ? { ...c, children: doMove(c.children) } : c,
        );
      }
      return { ...prev, children: doMove(prev.children) };
    });
  }, []);

  const clear = useCallback(() => {
    setRoot(createEmptyGroup());
  }, []);

  const isEmpty = root.children.length === 0;

  const maxDepthReached = countDepth(root.children, 1) >= maxNesting;

  return { root, setRoot, addCondition, addGroup, removeNode, updateCondition, setLogic, indentNode, outdentNode, moveNode, clear, isEmpty, maxDepthReached };
}
