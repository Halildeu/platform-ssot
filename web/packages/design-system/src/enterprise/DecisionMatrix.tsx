import React, { useMemo, useCallback, useState } from 'react';
import { cn } from '../utils/cn';
import {
  resolveAccessState,
  accessStyles,
  type AccessControlledProps,
} from '../internal/access-controller';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** A single option (column) in the decision matrix. */
export interface DecisionOption {
  /** Unique identifier */
  id: string;
  /** Display name */
  name: string;
}

/** A criterion (row) with associated weight. */
export interface DecisionCriterion {
  /** Unique identifier */
  id: string;
  /** Display name */
  name: string;
  /** Relative weight (0-100). Used for weighted total calculation. */
  weight: number;
}

/** A score for a specific option-criterion pair. */
export interface DecisionScore {
  /** References DecisionOption.id */
  optionId: string;
  /** References DecisionCriterion.id */
  criterionId: string;
  /** Score value (0 to maxScore) */
  score: number;
}

/**
 * Props for the DecisionMatrix component.
 *
 * @example
 * ```tsx
 * <DecisionMatrix
 *   options={[{ id: 'a', name: 'Option A' }, { id: 'b', name: 'Option B' }]}
 *   criteria={[{ id: 'c1', name: 'Cost', weight: 40 }, { id: 'c2', name: 'Quality', weight: 60 }]}
 *   scores={[
 *     { optionId: 'a', criterionId: 'c1', score: 8 },
 *     { optionId: 'a', criterionId: 'c2', score: 6 },
 *     { optionId: 'b', criterionId: 'c1', score: 5 },
 *     { optionId: 'b', criterionId: 'c2', score: 9 },
 *   ]}
 *   showWeightedTotals
 *   highlightWinner
 * />
 * ```
 *
 * @since 1.0.0
 * @see [Docs](https://design.mfe.dev/components/decision-matrix)
 */
export interface DecisionMatrixProps extends AccessControlledProps {
  /** Decision options (table columns) */
  options: DecisionOption[];
  /** Evaluation criteria (table rows) */
  criteria: DecisionCriterion[];
  /** Score data mapping options to criteria */
  scores: DecisionScore[];
  /** Callback when a score cell is clicked for editing */
  onScoreChange?: (optionId: string, criterionId: string, score: number) => void;
  /** Maximum possible score value (default 10) */
  maxScore?: number;
  /** Show the weighted totals row at the bottom */
  showWeightedTotals?: boolean;
  /** Highlight the winning option column */
  highlightWinner?: boolean;
  /** Additional CSS class names for the root element */
  className?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getScoreColor(score: number, maxScore: number): string {
  const ratio = score / maxScore;
  if (ratio >= 0.8) return 'var(--state-success-text, #16a34a)';
  if (ratio >= 0.6) return 'var(--state-success-text, #16a34a)';
  if (ratio >= 0.4) return 'var(--state-warning-text, #a16207)';
  if (ratio >= 0.2) return 'var(--state-error-text, #dc2626)';
  return 'var(--state-error-text, #dc2626)';
}

function getScoreBg(score: number, maxScore: number): string {
  const ratio = score / maxScore;
  if (ratio >= 0.8) return 'var(--state-success-bg, #22c55e15)';
  if (ratio >= 0.6) return 'var(--state-success-bg, #22c55e10)';
  if (ratio >= 0.4) return 'var(--state-warning-bg, #eab30815)';
  if (ratio >= 0.2) return 'var(--state-error-bg, #ef444415)';
  return 'var(--state-error-bg, #ef444410)';
}

function normalizeWeight(criteria: DecisionCriterion[]): Map<string, number> {
  const totalWeight = criteria.reduce((sum, c) => sum + c.weight, 0);
  const map = new Map<string, number>();
  for (const c of criteria) {
    map.set(c.id, totalWeight > 0 ? c.weight / totalWeight : 0);
  }
  return map;
}

// ---------------------------------------------------------------------------
// Inline score editor
// ---------------------------------------------------------------------------

interface ScoreCellProps {
  score: number;
  maxScore: number;
  canEdit: boolean;
  onEdit: (newScore: number) => void;
}

function ScoreCell({ score, maxScore, canEdit, onEdit }: ScoreCellProps) {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(String(score));

  const handleStartEdit = useCallback(() => {
    if (!canEdit) return;
    setEditValue(String(score));
    setEditing(true);
  }, [canEdit, score]);

  const handleCommit = useCallback(() => {
    setEditing(false);
    const parsed = parseFloat(editValue);
    if (!isNaN(parsed)) {
      const clamped = Math.max(0, Math.min(maxScore, Math.round(parsed * 10) / 10));
      onEdit(clamped);
    }
  }, [editValue, maxScore, onEdit]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        handleCommit();
      } else if (e.key === 'Escape') {
        setEditing(false);
      }
    },
    [handleCommit],
  );

  if (editing) {
    return (
      <input
        type="number"
        min={0}
        max={maxScore}
        step={1}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleCommit}
        onKeyDown={handleKeyDown}
        className="w-12 text-center text-xs rounded border px-1 py-0.5 outline-none focus:ring-1"
        style={{
          borderColor: 'var(--border-default)',
          backgroundColor: 'var(--surface-default)',
          color: 'var(--text-primary)',
        }}
        autoFocus
        aria-label="Edit score"
      />
    );
  }

  const color = getScoreColor(score, maxScore);
  const bg = getScoreBg(score, maxScore);

  return (
    <span
      role={canEdit ? 'button' : undefined}
      tabIndex={canEdit ? 0 : undefined}
      onClick={handleStartEdit}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && canEdit) {
          e.preventDefault();
          handleStartEdit();
        }
      }}
      className={cn(
        'inline-flex items-center justify-center rounded-md font-semibold text-xs min-w-[2rem] px-1.5 py-0.5',
        canEdit
          ? 'cursor-pointer hover:ring-1 hover:ring-[var(--focus-ring)] focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)]'
          : '',
      )}
      style={{ backgroundColor: bg, color }}
      aria-label={`Score: ${score} of ${maxScore}${canEdit ? ' (click to edit)' : ''}`}
    >
      {score}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Score bar (visual indicator)
// ---------------------------------------------------------------------------

function ScoreBar({ score, maxScore }: { score: number; maxScore: number }) {
  const pct = maxScore > 0 ? (score / maxScore) * 100 : 0;
  return (
    <div
      className="w-full h-1 rounded-full mt-0.5"
      style={{ backgroundColor: 'var(--surface-muted, #e5e7eb)' }}
      aria-hidden="true"
    >
      <div
        className="h-full rounded-full transition-all duration-200"
        style={{
          width: `${Math.min(100, pct)}%`,
          backgroundColor: getScoreColor(score, maxScore),
        }}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

/** Weighted scoring decision matrix table for structured option evaluation. */
export function DecisionMatrix({
  options,
  criteria,
  scores,
  onScoreChange,
  maxScore = 10,
  showWeightedTotals = true,
  highlightWinner = true,
  className,
  access,
  accessReason,
}: DecisionMatrixProps) {
  const accessState = resolveAccessState(access);
  const { isHidden, isDisabled, isReadonly } = accessState;
  if (isHidden) return null;

  const canEdit = !isDisabled && !isReadonly && !!onScoreChange;

  // Build a lookup: optionId -> criterionId -> score
  const scoreMap = useMemo(() => {
    const map = new Map<string, Map<string, number>>();
    for (const s of scores) {
      if (!map.has(s.optionId)) map.set(s.optionId, new Map());
      map.get(s.optionId)!.set(s.criterionId, s.score);
    }
    return map;
  }, [scores]);

  // Normalize weights
  const weightMap = useMemo(() => normalizeWeight(criteria), [criteria]);

  // Calculate weighted totals per option
  const totals = useMemo(() => {
    const result = new Map<string, number>();
    for (const opt of options) {
      let total = 0;
      const optScores = scoreMap.get(opt.id);
      for (const crit of criteria) {
        const raw = optScores?.get(crit.id) ?? 0;
        const w = weightMap.get(crit.id) ?? 0;
        total += raw * w;
      }
      result.set(opt.id, Math.round(total * 100) / 100);
    }
    return result;
  }, [options, criteria, scoreMap, weightMap]);

  // Find winner
  const winnerId = useMemo(() => {
    let bestId = '';
    let bestTotal = -Infinity;
    for (const [id, total] of totals) {
      if (total > bestTotal) {
        bestTotal = total;
        bestId = id;
      }
    }
    return bestId;
  }, [totals]);

  const handleScoreChange = useCallback(
    (optionId: string, criterionId: string, newScore: number) => {
      if (onScoreChange) {
        onScoreChange(optionId, criterionId, newScore);
      }
    },
    [onScoreChange],
  );

  const totalWeight = criteria.reduce((sum, c) => sum + c.weight, 0);

  return (
    <div
      className={cn('w-full overflow-x-auto', accessStyles(accessState.state), className)}
      role="group"
      aria-label="Decision Matrix"
      data-component="decision-matrix"
      data-access-state={accessState.state}
      {...(isDisabled ? { 'aria-disabled': true } : {})}
      {...(accessReason ? { title: accessReason } : {})}
    >
      <table
        className="w-full border-collapse text-xs"
        style={{ color: 'var(--text-primary)' }}
        role="table"
        aria-label="Decision scoring table"
      >
        {/* Header: criterion | weight | option1 | option2 | ... */}
        <thead>
          <tr>
            <th
              className="text-left px-3 py-2 font-semibold border-b"
              style={{
                borderColor: 'var(--border-default)',
                color: 'var(--text-secondary)',
                backgroundColor: 'var(--surface-muted)',
              }}
            >
              Criterion
            </th>
            <th
              className="text-center px-2 py-2 font-semibold border-b"
              style={{
                borderColor: 'var(--border-default)',
                color: 'var(--text-secondary)',
                backgroundColor: 'var(--surface-muted)',
                minWidth: 60,
              }}
            >
              Weight
            </th>
            {options.map((opt) => {
              const isWinner = highlightWinner && opt.id === winnerId && showWeightedTotals;
              return (
                <th
                  key={opt.id}
                  className={cn(
                    'text-center px-3 py-2 font-semibold border-b transition-colors',
                    isWinner ? 'ring-2 ring-inset rounded-t-md' : '',
                  )}
                  style={{
                    borderColor: 'var(--border-default)',
                    color: isWinner ? 'var(--state-success-text)' : 'var(--text-primary)',
                    backgroundColor: isWinner
                      ? 'var(--state-success-bg, #22c55e10)'
                      : 'var(--surface-muted)',
                    ...(isWinner ? { ringColor: 'var(--state-success-text)' } : {}),
                    minWidth: 80,
                  }}
                >
                  {opt.name}
                  {isWinner && (
                    <span
                      className="block text-[10px] font-normal mt-0.5"
                      style={{ color: 'var(--state-success-text)' }}
                      aria-label="Winner"
                    >
                      ★ Winner
                    </span>
                  )}
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody>
          {criteria.map((crit, idx) => {
            const weightPct = totalWeight > 0 ? Math.round((crit.weight / totalWeight) * 100) : 0;
            return (
              <tr
                key={crit.id}
                className="transition-colors hover:bg-[var(--surface-hover)]"
                style={{
                  borderBottomColor: 'var(--border-default)',
                  borderBottomWidth: idx < criteria.length - 1 ? 1 : 0,
                }}
              >
                {/* Criterion name */}
                <td
                  className="px-3 py-2 font-medium"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {crit.name}
                </td>

                {/* Weight */}
                <td className="text-center px-2 py-2">
                  <span
                    className="inline-flex items-center gap-1"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    <span className="font-semibold">{crit.weight}</span>
                    <span className="text-[10px] opacity-70">({weightPct}%)</span>
                  </span>
                </td>

                {/* Score cells */}
                {options.map((opt) => {
                  const raw = scoreMap.get(opt.id)?.get(crit.id) ?? 0;
                  const isWinnerCol = highlightWinner && opt.id === winnerId && showWeightedTotals;
                  return (
                    <td
                      key={`${opt.id}-${crit.id}`}
                      className={cn(
                        'text-center px-3 py-2',
                        isWinnerCol ? 'ring-2 ring-inset' : '',
                      )}
                      style={
                        isWinnerCol
                          ? { backgroundColor: 'var(--state-success-bg, #22c55e05)' }
                          : undefined
                      }
                    >
                      <div className="flex flex-col items-center gap-0.5">
                        <ScoreCell
                          score={raw}
                          maxScore={maxScore}
                          canEdit={canEdit}
                          onEdit={(val) => handleScoreChange(opt.id, crit.id, val)}
                        />
                        <ScoreBar score={raw} maxScore={maxScore} />
                      </div>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>

        {/* Weighted totals */}
        {showWeightedTotals && (
          <tfoot>
            <tr
              className="font-semibold"
              style={{
                borderTopWidth: 2,
                borderTopColor: 'var(--border-default)',
                backgroundColor: 'var(--surface-muted)',
              }}
            >
              <td className="px-3 py-2" style={{ color: 'var(--text-primary)' }}>
                Weighted Total
              </td>
              <td className="text-center px-2 py-2" style={{ color: 'var(--text-secondary)' }}>
                —
              </td>
              {options.map((opt) => {
                const total = totals.get(opt.id) ?? 0;
                const isWinner = highlightWinner && opt.id === winnerId;
                return (
                  <td
                    key={`total-${opt.id}`}
                    className={cn(
                      'text-center px-3 py-2 text-sm',
                      isWinner ? 'ring-2 ring-inset rounded-b-md' : '',
                    )}
                    style={{
                      color: isWinner
                        ? 'var(--state-success-text)'
                        : 'var(--text-primary)',
                      backgroundColor: isWinner
                        ? 'var(--state-success-bg, #22c55e15)'
                        : undefined,
                    }}
                  >
                    {total.toFixed(2)}
                  </td>
                );
              })}
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}

DecisionMatrix.displayName = 'DecisionMatrix';

export default DecisionMatrix;
