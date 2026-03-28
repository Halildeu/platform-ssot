/**
 * filterModelConverter — Converts between FilterBuilder tree and AG Grid FilterModel.
 *
 * AG Grid FilterModel format (column-keyed):
 *   { role: { filterType:'set', values:['ADMIN'] }, fullName: { filterType:'text', type:'contains', filter:'John' } }
 *
 * FilterBuilder tree format (recursive AND/OR):
 *   { type:'group', logic:'AND', children: [{ type:'condition', colId:'role', ... }] }
 */
import type { ColDef } from 'ag-grid-community';
import type { FilterGroup, FilterCondition, FilterNode, FilterType } from './useFilterBuilder';
import { createEmptyGroup } from './useFilterBuilder';

// ── Tree → AG Grid FilterModel ──

export function treeToFilterModel(root: FilterGroup): Record<string, unknown> {
  const model: Record<string, unknown> = {};
  const conditions = flattenConditions(root);

  // Group conditions by colId
  const byCol = new Map<string, FilterCondition[]>();
  for (const c of conditions) {
    if (!c.colId || c.value === '' || c.value === null || c.value === undefined) continue;
    const list = byCol.get(c.colId) ?? [];
    list.push(c);
    byCol.set(c.colId, list);
  }

  for (const [colId, conds] of byCol) {
    // Expand comma-separated values into individual OR conditions
    const expanded: FilterCondition[] = [];
    for (const c of conds) {
      if (c.filterType === 'text' && typeof c.value === 'string' && c.value.includes(',')) {
        const parts = c.value.split(',').map((s) => s.trim()).filter(Boolean);
        if (parts.length > 1) {
          for (const part of parts) {
            expanded.push({ ...c, id: `${c.id}_${part}`, value: part });
          }
          continue;
        }
      }
      expanded.push(c);
    }

    if (expanded.length === 1) {
      model[colId] = conditionToAgModel(expanded[0]);
    } else {
      // Multiple conditions on same column → use AG Grid's conditions array with OR
      model[colId] = {
        filterType: expanded[0].filterType === 'set' ? 'set' : expanded[0].filterType,
        operator: 'OR',
        conditions: expanded.map(conditionToAgModel),
      };
    }
  }

  return model;
}

function conditionToAgModel(c: FilterCondition): Record<string, unknown> {
  switch (c.filterType) {
    case 'text':
      return { filterType: 'text', type: c.operator, filter: String(c.value) };
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
      return {
        filterType: 'set',
        values: Array.isArray(c.value) ? c.value : [c.value],
      };
    default:
      return { filterType: 'text', type: 'contains', filter: String(c.value) };
  }
}

function flattenConditions(node: FilterNode): FilterCondition[] {
  if (node.type === 'condition') return [node];
  return node.children.flatMap(flattenConditions);
}

function findParentLogic(root: FilterGroup, colId: string): 'AND' | 'OR' {
  // Find the group that directly contains conditions for this colId
  function search(group: FilterGroup): 'AND' | 'OR' | null {
    const directMatch = group.children.some(
      (c) => c.type === 'condition' && c.colId === colId,
    );
    if (directMatch) return group.logic;
    for (const child of group.children) {
      if (child.type === 'group') {
        const found = search(child);
        if (found) return found;
      }
    }
    return null;
  }
  return search(root) ?? 'AND';
}

// ── AG Grid FilterModel → Tree ──

export function filterModelToTree(
  model: Record<string, unknown> | null,
  columnDefs: ColDef[],
): FilterGroup {
  if (!model || Object.keys(model).length === 0) {
    return createEmptyGroup();
  }

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

    // Check if it has nested conditions
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

  if (root.children.length === 0) {
    return createEmptyGroup();
  }

  return root;
}

function agModelToCondition(
  colId: string,
  m: Record<string, unknown>,
  filterType: FilterType,
): FilterCondition {
  let nextIdCounter = Date.now();
  const id = `fb_import_${nextIdCounter++}_${colId}`;

  switch (filterType) {
    case 'set':
      return {
        type: 'condition',
        id,
        colId,
        filterType: 'set',
        operator: 'in',
        value: (m.values as unknown[]) ?? [],
      };
    case 'number':
      return {
        type: 'condition',
        id,
        colId,
        filterType: 'number',
        operator: (m.type as string) ?? 'equals',
        value: m.filter as number,
        valueTo: m.filterTo as number | undefined,
      };
    case 'date':
      return {
        type: 'condition',
        id,
        colId,
        filterType: 'date',
        operator: (m.type as string) ?? 'equals',
        value: m.dateFrom as string,
        valueTo: m.dateTo as string | undefined,
      };
    default:
      return {
        type: 'condition',
        id,
        colId,
        filterType: 'text',
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

  // Detect from colDef
  if (colDef) {
    const filter = colDef.filter;
    if (filter === 'agSetColumnFilter') return 'set';
    if (filter === 'agNumberColumnFilter') return 'number';
    if (filter === 'agDateColumnFilter') return 'date';
  }

  return 'text';
}

// ── Operator labels ──

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
