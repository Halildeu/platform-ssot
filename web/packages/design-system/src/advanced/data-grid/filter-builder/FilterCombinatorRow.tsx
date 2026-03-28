/**
 * FilterCombinatorRow — Independent AND/OR selector between rules.
 *
 * Each combinator is independent: toggling one does NOT affect the others.
 * Renders as a compact centered row with branch-line decorators on both sides.
 */
import React from 'react';
import type { FilterCombinator } from './types';

interface FilterCombinatorRowProps {
  combinator: FilterCombinator;
  onSetLogic: (id: string, logic: 'AND' | 'OR') => void;
  /** When parent group is locked, this combinator is read-only */
  disabled?: boolean;
}

export const FilterCombinatorRow: React.FC<FilterCombinatorRowProps> = ({
  combinator,
  onSetLogic,
  disabled = false,
}) => {
  const isAnd = combinator.logic === 'AND';

  return (
    <div className="relative flex items-center py-0.5">
      {/* Left branch line */}
      <div className="h-px flex-1 bg-border-subtle" />

      {/* Toggle button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => onSetLogic(combinator.id, isAnd ? 'OR' : 'AND')}
        title={disabled ? undefined : `Tıkla: ${isAnd ? 'VEYA' : 'VE'} olarak değiştir`}
        className={[
          'mx-2 min-w-[46px] rounded-full px-2.5 py-0.5 text-[10px] font-bold transition-colors',
          isAnd
            ? 'bg-blue-100 text-blue-700 hover:bg-orange-100 hover:text-orange-700'
            : 'bg-orange-100 text-orange-700 hover:bg-blue-100 hover:text-blue-700',
          disabled ? 'cursor-default opacity-60 hover:bg-blue-100 hover:text-blue-700' : 'cursor-pointer',
        ].join(' ')}
      >
        {isAnd ? 'VE' : 'VEYA'}
      </button>

      {/* Right branch line */}
      <div className="h-px flex-1 bg-border-subtle" />
    </div>
  );
};
