import React, { useMemo, useCallback } from 'react';
import { cn } from '../utils/cn';
import {
  resolveAccessState,
  accessStyles,
  type AccessControlledProps,
} from '../internal/access-controller';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** A single item within a SWOT quadrant. */
export interface SWOTItem {
  /** Unique identifier */
  id: string;
  /** Display text describing the item */
  text: string;
  /** Priority level for visual badge */
  priority?: 'high' | 'medium' | 'low';
}

/** Quadrant identifier. */
export type SWOTQuadrant = 'S' | 'W' | 'O' | 'T';

/**
 * Props for the SWOTMatrix component.
 *
 * @example
 * ```tsx
 * <SWOTMatrix
 *   strengths={[{ id: '1', text: 'Strong brand', priority: 'high' }]}
 *   weaknesses={[{ id: '2', text: 'Limited budget', priority: 'medium' }]}
 *   opportunities={[{ id: '3', text: 'New market', priority: 'high' }]}
 *   threats={[{ id: '4', text: 'Rising costs', priority: 'low' }]}
 *   onItemClick={(q, item) => console.log(q, item)}
 * />
 * ```
 *
 * @since 1.0.0
 * @see [Docs](https://design.mfe.dev/components/swot-matrix)
 */
export interface SWOTMatrixProps extends AccessControlledProps {
  /** Items in the Strengths quadrant (top-left, green) */
  strengths: SWOTItem[];
  /** Items in the Weaknesses quadrant (top-right, red) */
  weaknesses: SWOTItem[];
  /** Items in the Opportunities quadrant (bottom-left, blue) */
  opportunities: SWOTItem[];
  /** Items in the Threats quadrant (bottom-right, amber) */
  threats: SWOTItem[];
  /** Callback when an item is clicked */
  onItemClick?: (quadrant: SWOTQuadrant, item: SWOTItem) => void;
  /** Optional title displayed above the matrix */
  title?: string;
  /** Compact mode reduces padding and font sizes */
  compact?: boolean;
  /** Additional CSS class names for the root element */
  className?: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

interface QuadrantConfig {
  key: SWOTQuadrant;
  label: string;
  fullLabel: string;
  bgColor: string;
  headerBg: string;
  headerText: string;
  borderColor: string;
  badgeColors: Record<string, { bg: string; text: string }>;
}

const QUADRANT_CONFIGS: QuadrantConfig[] = [
  {
    key: 'S',
    label: 'S',
    fullLabel: 'Strengths',
    bgColor: 'var(--state-success-bg, #22c55e10)',
    headerBg: 'var(--state-success-bg, #22c55e20)',
    headerText: 'var(--state-success-text, #16a34a)',
    borderColor: 'var(--state-success-border, var(--state-success-text, #16a34a))',
    badgeColors: {
      high: { bg: 'var(--state-error-bg, #fee2e2)', text: 'var(--state-error-text, #dc2626)' },
      medium: { bg: 'var(--state-warning-bg, #fef3c7)', text: 'var(--state-warning-text, #a16207)' },
      low: { bg: 'var(--state-success-bg, #dcfce7)', text: 'var(--state-success-text, #16a34a)' },
    },
  },
  {
    key: 'W',
    label: 'W',
    fullLabel: 'Weaknesses',
    bgColor: 'var(--state-error-bg, #ef444410)',
    headerBg: 'var(--state-error-bg, #ef444420)',
    headerText: 'var(--state-error-text, #dc2626)',
    borderColor: 'var(--state-error-border, var(--state-error-text, #dc2626))',
    badgeColors: {
      high: { bg: 'var(--state-error-bg, #fee2e2)', text: 'var(--state-error-text, #dc2626)' },
      medium: { bg: 'var(--state-warning-bg, #fef3c7)', text: 'var(--state-warning-text, #a16207)' },
      low: { bg: 'var(--state-success-bg, #dcfce7)', text: 'var(--state-success-text, #16a34a)' },
    },
  },
  {
    key: 'O',
    label: 'O',
    fullLabel: 'Opportunities',
    bgColor: 'var(--state-info-bg, #3b82f610)',
    headerBg: 'var(--state-info-bg, #3b82f620)',
    headerText: 'var(--state-info-text, #2563eb)',
    borderColor: 'var(--state-info-border, var(--state-info-text, #2563eb))',
    badgeColors: {
      high: { bg: 'var(--state-error-bg, #fee2e2)', text: 'var(--state-error-text, #dc2626)' },
      medium: { bg: 'var(--state-warning-bg, #fef3c7)', text: 'var(--state-warning-text, #a16207)' },
      low: { bg: 'var(--state-success-bg, #dcfce7)', text: 'var(--state-success-text, #16a34a)' },
    },
  },
  {
    key: 'T',
    label: 'T',
    fullLabel: 'Threats',
    bgColor: 'var(--state-warning-bg, #f59e0b10)',
    headerBg: 'var(--state-warning-bg, #f59e0b20)',
    headerText: 'var(--state-warning-text, #a16207)',
    borderColor: 'var(--state-warning-border, var(--state-warning-text, #a16207))',
    badgeColors: {
      high: { bg: 'var(--state-error-bg, #fee2e2)', text: 'var(--state-error-text, #dc2626)' },
      medium: { bg: 'var(--state-warning-bg, #fef3c7)', text: 'var(--state-warning-text, #a16207)' },
      low: { bg: 'var(--state-success-bg, #dcfce7)', text: 'var(--state-success-text, #16a34a)' },
    },
  },
];

// ---------------------------------------------------------------------------
// Priority Badge
// ---------------------------------------------------------------------------

function PriorityBadge({
  priority,
  colors,
  compact,
}: {
  priority: 'high' | 'medium' | 'low';
  colors: { bg: string; text: string };
  compact?: boolean;
}) {
  const labels: Record<string, string> = { high: 'H', medium: 'M', low: 'L' };
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full font-semibold uppercase shrink-0',
        compact ? 'w-4 h-4 text-[9px]' : 'w-5 h-5 text-[10px]',
      )}
      style={{ backgroundColor: colors.bg, color: colors.text }}
      aria-label={`${priority} priority`}
    >
      {labels[priority]}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Quadrant component
// ---------------------------------------------------------------------------

interface QuadrantPanelProps {
  config: QuadrantConfig;
  items: SWOTItem[];
  compact?: boolean;
  canInteract: boolean;
  onItemClick?: (quadrant: SWOTQuadrant, item: SWOTItem) => void;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

function QuadrantPanel({
  config,
  items,
  compact,
  canInteract,
  onItemClick,
  position,
}: QuadrantPanelProps) {
  const handleClick = useCallback(
    (item: SWOTItem) => {
      if (canInteract && onItemClick) {
        onItemClick(config.key, item);
      }
    },
    [canInteract, onItemClick, config.key],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, item: SWOTItem) => {
      if ((e.key === 'Enter' || e.key === ' ') && canInteract && onItemClick) {
        e.preventDefault();
        onItemClick(config.key, item);
      }
    },
    [canInteract, onItemClick, config.key],
  );

  const borderRadius = {
    'top-left': 'rounded-tl-lg',
    'top-right': 'rounded-tr-lg',
    'bottom-left': 'rounded-bl-lg',
    'bottom-right': 'rounded-br-lg',
  }[position];

  return (
    <div
      className={cn('flex flex-col border overflow-hidden', borderRadius)}
      style={{ borderColor: config.borderColor, backgroundColor: config.bgColor }}
      role="region"
      aria-label={`${config.fullLabel} quadrant`}
    >
      {/* Header */}
      <div
        className={cn(
          'flex items-center gap-2 font-semibold',
          compact ? 'px-2 py-1 text-xs' : 'px-3 py-2 text-sm',
        )}
        style={{ backgroundColor: config.headerBg, color: config.headerText }}
      >
        <span
          className={cn(
            'inline-flex items-center justify-center rounded-md font-bold',
            compact ? 'w-5 h-5 text-[10px]' : 'w-6 h-6 text-xs',
          )}
          style={{ backgroundColor: config.headerText, color: 'var(--text-inverse, #fff)' }}
          aria-hidden="true"
        >
          {config.label}
        </span>
        <span>{config.fullLabel}</span>
        <span
          className="ml-auto text-xs opacity-70"
          style={{ color: config.headerText }}
        >
          {items.length}
        </span>
      </div>

      {/* Items list */}
      <ul
        className={cn('flex-1 overflow-y-auto', compact ? 'p-1.5 space-y-0.5' : 'p-2 space-y-1')}
        role="list"
        aria-label={`${config.fullLabel} items`}
      >
        {items.length === 0 && (
          <li
            className={cn(
              'text-center italic',
              compact ? 'py-2 text-[10px]' : 'py-3 text-xs',
            )}
            style={{ color: 'var(--text-tertiary)' }}
          >
            No items
          </li>
        )}
        {items.map((item) => (
          <li
            key={item.id}
            role={canInteract && onItemClick ? 'button' : 'listitem'}
            tabIndex={canInteract && onItemClick ? 0 : undefined}
            onClick={() => handleClick(item)}
            onKeyDown={(e) => handleKeyDown(e, item)}
            className={cn(
              'flex items-center gap-2 rounded-md transition-colors',
              compact ? 'px-1.5 py-1 text-[11px]' : 'px-2 py-1.5 text-xs',
              canInteract && onItemClick
                ? 'cursor-pointer hover:bg-[var(--surface-hover)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--focus-ring)]'
                : '',
            )}
            style={{ color: 'var(--text-primary)' }}
          >
            {item.priority && (
              <PriorityBadge
                priority={item.priority}
                colors={config.badgeColors[item.priority]}
                compact={compact}
              />
            )}
            <span className="truncate flex-1">{item.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

/** 4-quadrant strategic SWOT analysis matrix with color-coded quadrants and priority badges. */
export function SWOTMatrix({
  strengths,
  weaknesses,
  opportunities,
  threats,
  onItemClick,
  title,
  compact = false,
  className,
  access,
  accessReason,
}: SWOTMatrixProps) {
  const accessState = resolveAccessState(access);
  const { isHidden, isDisabled, isReadonly } = accessState;
  if (isHidden) return null;

  const canInteract = !isDisabled && !isReadonly;

  const quadrantData = useMemo<[QuadrantConfig, SWOTItem[], 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'][]>(
    () => [
      [QUADRANT_CONFIGS[0], strengths, 'top-left'],
      [QUADRANT_CONFIGS[1], weaknesses, 'top-right'],
      [QUADRANT_CONFIGS[2], opportunities, 'bottom-left'],
      [QUADRANT_CONFIGS[3], threats, 'bottom-right'],
    ],
    [strengths, weaknesses, opportunities, threats],
  );

  const totalItems = strengths.length + weaknesses.length + opportunities.length + threats.length;

  return (
    <div
      className={cn('w-full', accessStyles(accessState.state), className)}
      role="group"
      aria-label={title ?? 'SWOT Analysis Matrix'}
      data-component="swot-matrix"
      data-access-state={accessState.state}
      {...(isDisabled ? { 'aria-disabled': true } : {})}
      {...(accessReason ? { title: accessReason } : {})}
    >
      {/* Title */}
      {title && (
        <h3
          className={cn(
            'font-semibold mb-3',
            compact ? 'text-sm' : 'text-base',
          )}
          style={{ color: 'var(--text-primary)' }}
        >
          {title}
        </h3>
      )}

      {/* 2x2 grid */}
      <div
        className={cn('grid grid-cols-2', compact ? 'gap-0.5' : 'gap-1')}
        style={{ minHeight: compact ? 200 : 300 }}
      >
        {quadrantData.map(([config, items, position]) => (
          <QuadrantPanel
            key={config.key}
            config={config}
            items={items}
            compact={compact}
            canInteract={canInteract}
            onItemClick={onItemClick}
            position={position}
          />
        ))}
      </div>

      {/* Summary footer */}
      <div
        className={cn(
          'flex items-center justify-between mt-2',
          compact ? 'text-[10px]' : 'text-xs',
        )}
        style={{ color: 'var(--text-secondary)' }}
      >
        <span>{totalItems} total item{totalItems !== 1 ? 's' : ''}</span>
        <div className="flex items-center gap-3">
          {QUADRANT_CONFIGS.map((cfg) => {
            const count = [strengths, weaknesses, opportunities, threats][QUADRANT_CONFIGS.indexOf(cfg)].length;
            return (
              <span key={cfg.key} className="flex items-center gap-1">
                <span
                  className="inline-block w-2.5 h-2.5 rounded-xs"
                  style={{ backgroundColor: cfg.headerText }}
                  aria-hidden="true"
                />
                {cfg.label}: {count}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

SWOTMatrix.displayName = 'SWOTMatrix';

export default SWOTMatrix;
