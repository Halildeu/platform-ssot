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

export interface FilterGroup {
  type: 'group';
  id: string;
  logic: 'AND' | 'OR';
  children: FilterNode[];
}

export type FilterNode = FilterCondition | FilterGroup;

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

export function createEmptyGroup(logic: 'AND' | 'OR' = 'AND'): FilterGroup {
  return {
    type: 'group',
    id: uid(),
    logic,
    children: [createEmptyCondition()],
  };
}

// ── Deep tree operations ──

function findAndUpdate(nodes: FilterNode[], targetId: string, updater: (node: FilterNode) => FilterNode | null): FilterNode[] {
  return nodes.reduce<FilterNode[]>((acc, node) => {
    if (node.id === targetId) {
      const result = updater(node);
      if (result) acc.push(result);
      // null = remove
    } else if (node.type === 'group') {
      acc.push({ ...node, children: findAndUpdate(node.children, targetId, updater) });
    } else {
      acc.push(node);
    }
    return acc;
  }, []);
}

function findAndInsert(nodes: FilterNode[], parentId: string, newNode: FilterNode): FilterNode[] {
  return nodes.map((node) => {
    if (node.type === 'group' && node.id === parentId) {
      return { ...node, children: [...node.children, newNode] };
    }
    if (node.type === 'group') {
      return { ...node, children: findAndInsert(node.children, parentId, newNode) };
    }
    return node;
  });
}

function countDepth(nodes: FilterNode[], current: number = 0): number {
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
  clear: () => void;
  isEmpty: boolean;
  maxDepthReached: boolean;
}

export function useFilterBuilder(maxNesting: number = 3): UseFilterBuilderReturn {
  const [root, setRoot] = useState<FilterGroup>(createEmptyGroup);

  const addCondition = useCallback((parentId: string) => {
    setRoot((prev) => ({
      ...prev,
      children: prev.id === parentId
        ? [...prev.children, createEmptyCondition()]
        : findAndInsert(prev.children, parentId, createEmptyCondition()),
    }));
  }, []);

  const addGroup = useCallback((parentId: string) => {
    setRoot((prev) => {
      const depth = countDepth(prev.children, 1);
      if (depth >= maxNesting) return prev;
      const newGroup = createEmptyGroup('OR');
      return {
        ...prev,
        children: prev.id === parentId
          ? [...prev.children, newGroup]
          : findAndInsert(prev.children, parentId, newGroup),
      };
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

  const setLogic = useCallback((groupId: string, logic: 'AND' | 'OR') => {
    if (groupId === root.id) {
      setRoot((prev) => ({ ...prev, logic }));
      return;
    }
    setRoot((prev) => ({
      ...prev,
      children: findAndUpdate(prev.children, groupId, (node) =>
        node.type === 'group' ? { ...node, logic } : node,
      ),
    }));
  }, [root.id]);

  const clear = useCallback(() => {
    setRoot(createEmptyGroup());
  }, []);

  const isEmpty = root.children.length === 0 ||
    (root.children.length === 1 && root.children[0].type === 'condition' && !(root.children[0] as FilterCondition).colId);

  const maxDepthReached = countDepth(root.children, 1) >= maxNesting;

  return { root, setRoot, addCondition, addGroup, removeNode, updateCondition, setLogic, clear, isEmpty, maxDepthReached };
}
