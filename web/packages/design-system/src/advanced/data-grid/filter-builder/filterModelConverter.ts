/**
 * filterModelConverter — Converts between FilterBuilder tree and AG Grid FilterModel.
 *
 * AG Grid FilterModel format (column-keyed):
 *   { role: { filterType:'set', values:['ADMIN'] }, name: { filterType:'text', type:'contains', filter:'John' } }
 *
 * FilterBuilder tree format (recursive AND/OR):
 *   { type:'group', logic:'AND', children: [{ type:'condition', colId:'role', ... }] }
 */
import type { ColDef } from 'ag-grid-community';
import type { FilterGroup, FilterCondition, FilterNode, FilterType, FilterTreeNode } from './types';
import { createEmptyGroup } from './useFilterBuilder';

// ── Tree → AG Grid FilterModel ──

export function treeToFilterModel(root: FilterGroup): Record<string, unknown> {
  const model: Record<string, unknown> = {};
  const conditions = flattenConditions(root);

  const byCol = new Map<string, FilterCondition[]>();
  for (const c of conditions) {
    if (!c.colId) continue;
    const isBlankOp = c.operator === 'blank' || c.operator === 'notBlank';
    if (!isBlankOp && (c.value === '' || c.value === null || c.value === undefined)) continue;
    if (c.filterType === 'set' && Array.isArray(c.value) && c.value.length === 0) continue;
    const list = byCol.get(c.colId) ?? [];
    list.push(c);
    byCol.set(c.colId, list);
  }

  for (const [colId, conds] of byCol) {
    if (conds.length === 1) {
      model[colId] = conditionToAgModel(conds[0]);
    } else if (conds.length === 2) {
      const logic = findParentLogic(root, colId);
      model[colId] = { filterType: conds[0].filterType, operator: logic, conditions: conds.map(conditionToAgModel) };
    } else {
      // AG Grid supports max 2 conditions per column — use first two
      const logic = findParentLogic(root, colId);
      model[colId] = { filterType: conds[0].filterType, operator: logic, conditions: conds.slice(0, 2).map(conditionToAgModel) };
    }
  }

  return model;
}

function conditionToAgModel(c: FilterCondition): Record<string, unknown> {
  switch (c.filterType) {
    case 'text':
      return { filterType: 'text', type: c.operator, filter: String(c.value ?? '') };
    case 'number':
      return {
        filterType: 'number',
        type: c.operator,
        filter: Number(c.value),
        ...(c.operator === 'inRange' && c.valueTo != null ? { filterTo: Number(c.valueTo) } : {}),
      };
    case 'date':
      return {
        filterType: 'date',
        type: c.operator,
        dateFrom: c.value ? String(c.value) : null,
        dateTo: c.valueTo ? String(c.valueTo) : null,
      };
    case 'set':
      return { filterType: 'set', values: Array.isArray(c.value) ? c.value : [c.value] };
    default:
      return { filterType: 'text', type: 'contains', filter: String(c.value ?? '') };
  }
}

function flattenConditions(node: FilterNode | FilterTreeNode): FilterCondition[] {
  if (node.type === 'condition') return [node];
  if (node.type === 'combinator') return [];
  return (node as FilterGroup).children.flatMap(flattenConditions);
}

function findParentLogic(root: FilterGroup, colId: string): 'AND' | 'OR' {
  function search(children: FilterTreeNode[]): 'AND' | 'OR' | null {
    let lastLogic: 'AND' | 'OR' = root.logic;
    for (const child of children) {
      if (child.type === 'combinator') {
        lastLogic = child.logic;
      } else if (child.type === 'condition' && child.colId === colId) {
        return lastLogic;
      } else if (child.type === 'group') {
        const found = search(child.children);
        if (found) return found;
      }
    }
    return null;
  }
  return search(root.children) ?? 'AND';
}

// ── AG Grid FilterModel → Tree ──

export function filterModelToTree(
  model: Record<string, unknown> | null,
  columnDefs: ColDef[],
): FilterGroup {
  if (!model || Object.keys(model).length === 0) return createEmptyGroup();

  const colMap = new Map<string, ColDef>();
  for (const col of columnDefs) {
    if (col.field) colMap.set(col.field, col);
  }

  const root = createEmptyGroup();
  root.children = [];

  for (const [colId, rawModel] of Object.entries(model)) {
    const m = rawModel as Record<string, unknown>;
    if (!m) continue;

    const colDef = colMap.get(colId);
    const filterType = detectFilterType(m, colDef);

    if (Array.isArray(m.conditions) && m.conditions.length > 0) {
      const subGroup = createEmptyGroup((m.operator as 'AND' | 'OR') ?? 'AND');
      subGroup.children = (m.conditions as Record<string, unknown>[]).map((cond) =>
        agModelToCondition(colId, cond, filterType),
      );
      root.children.push(subGroup);
    } else {
      root.children.push(agModelToCondition(colId, m, filterType));
    }
  }

  if (root.children.length === 0) return createEmptyGroup();
  return root;
}

function agModelToCondition(
  colId: string,
  m: Record<string, unknown>,
  filterType: FilterType,
): FilterCondition {
  const id = `fb_import_${Date.now()}_${colId}`;

  switch (filterType) {
    case 'set':
      return { type: 'condition', id, colId, filterType: 'set', operator: 'in', value: (m.values as unknown[]) ?? [] };
    case 'number':
      return {
        type: 'condition', id, colId, filterType: 'number',
        operator: (m.type as string) ?? 'equals',
        value: m.filter as number,
        valueTo: m.filterTo as number | undefined,
      };
    case 'date':
      return {
        type: 'condition', id, colId, filterType: 'date',
        operator: (m.type as string) ?? 'equals',
        value: m.dateFrom as string,
        valueTo: m.dateTo as string | undefined,
      };
    default:
      return {
        type: 'condition', id, colId, filterType: 'text',
        operator: (m.type as string) ?? 'contains',
        value: (m.filter as string) ?? '',
      };
  }
}

function detectFilterType(m: Record<string, unknown>, colDef?: ColDef): FilterType {
  if (m.filterType === 'set' || Array.isArray(m.values)) return 'set';
  if (m.filterType === 'number') return 'number';
  if (m.filterType === 'date' || m.dateFrom !== undefined) return 'date';
  if (m.filterType === 'text') return 'text';

  if (colDef) {
    const f = colDef.filter;
    if (f === 'agSetColumnFilter') return 'set';
    if (f === 'agNumberColumnFilter') return 'number';
    if (f === 'agDateColumnFilter') return 'date';
    if (f === 'agMultiColumnFilter' && colDef.filterParams) {
      const filters = (colDef.filterParams as Record<string, unknown>).filters as Array<{ filter: string }> | undefined;
      if (filters?.[0]?.filter === 'agNumberColumnFilter') return 'number';
      if (filters?.[0]?.filter === 'agDateColumnFilter') return 'date';
      if (filters?.[0]?.filter === 'agSetColumnFilter') return 'set';
    }
  }

  return 'text';
}

// ── Multi-search extraction ──

/**
 * For text columns with 3+ values (comma-separated in value field or multiple conditions),
 * returns a map of colId → pipe-separated values for backend multiSearch parameter.
 * AG Grid supports max 2 conditions per column; this captures overflow values.
 */
export function extractMultiSearchParams(root: FilterGroup): Record<string, string> {
  const conditions = flattenConditions(root);
  const byCol = new Map<string, string[]>();

  for (const c of conditions) {
    if (!c.colId || c.filterType !== 'text') continue;
    const raw = String(c.value ?? '').trim();
    if (!raw) continue;
    const vals = raw.split(/[,;]+/).map((s) => s.trim()).filter(Boolean);
    const list = byCol.get(c.colId) ?? [];
    list.push(...vals);
    byCol.set(c.colId, list);
  }

  const result: Record<string, string> = {};
  for (const [colId, vals] of byCol) {
    if (vals.length >= 3) {
      result[colId] = [...new Set(vals)].join('|');
    }
  }
  return result;
}

// ── Operator label maps (Turkish) ──

export const TEXT_OPERATORS = [
  { value: 'contains', label: 'İçerir' },
  { value: 'equals', label: 'Eşittir' },
  { value: 'notEqual', label: 'Eşit Değil' },
  { value: 'startsWith', label: 'İle Başlar' },
  { value: 'endsWith', label: 'İle Biter' },
  { value: 'notContains', label: 'İçermez' },
  { value: 'blank', label: 'Boş' },
  { value: 'notBlank', label: 'Boş Değil' },
];

export const NUMBER_OPERATORS = [
  { value: 'equals', label: 'Eşittir' },
  { value: 'notEqual', label: 'Eşit Değil' },
  { value: 'greaterThan', label: 'Büyüktür' },
  { value: 'greaterThanOrEqual', label: 'Büyük Eşittir' },
  { value: 'lessThan', label: 'Küçüktür' },
  { value: 'lessThanOrEqual', label: 'Küçük Eşittir' },
  { value: 'inRange', label: 'Aralıkta' },
  { value: 'blank', label: 'Boş' },
];

export const DATE_OPERATORS = [
  { value: 'equals', label: 'Eşittir' },
  { value: 'notEqual', label: 'Eşit Değil' },
  { value: 'greaterThan', label: 'Sonra' },
  { value: 'lessThan', label: 'Önce' },
  { value: 'inRange', label: 'Aralıkta' },
  { value: 'blank', label: 'Boş' },
];
