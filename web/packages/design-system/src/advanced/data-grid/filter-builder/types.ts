/**
 * Filter Builder — shared type definitions.
 * Used by useFilterBuilder, filterModelConverter, and all UI components.
 */

export type FilterType = 'text' | 'number' | 'date' | 'set';

export interface FilterCondition {
  type: 'condition';
  id: string;
  colId: string;
  filterType: FilterType;
  operator: string;
  value: unknown;
  valueTo?: unknown; // for inRange operators
  locked?: boolean;
}

export interface FilterCombinator {
  type: 'combinator';
  id: string;
  logic: 'AND' | 'OR';
}

export interface FilterGroup {
  type: 'group';
  id: string;
  /** Default logic inserted for new combinators added to this group */
  logic: 'AND' | 'OR';
  /** NOT modifier — negates the entire group's output */
  not?: boolean;
  children: FilterTreeNode[];
  locked?: boolean;
}

export type FilterNode = FilterCondition | FilterGroup;
export type FilterTreeNode = FilterNode | FilterCombinator;
