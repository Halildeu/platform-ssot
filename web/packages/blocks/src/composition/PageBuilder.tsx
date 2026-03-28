import React, { useContext } from 'react';
import type { PageComposition, BlockRegistry } from '../types';
import { BlockRegistryContext } from '../registry';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface PageBuilderProps {
  composition: PageComposition;
  registry?: BlockRegistry;
}

/* ------------------------------------------------------------------ */
/*  Layout helpers                                                     */
/* ------------------------------------------------------------------ */

const layoutStyles: Record<PageComposition['layout'], React.CSSProperties> = {
  single: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  sidebar: {
    display: 'grid',
    gridTemplateColumns: '1fr 320px',
    gap: '1.5rem',
  },
  split: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1.5rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(12, 1fr)',
    gap: '1.5rem',
  },
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function PageBuilder({ composition, registry: registryProp }: PageBuilderProps) {
  const contextRegistry = useContext(BlockRegistryContext);
  const registry = registryProp ?? contextRegistry;

  const sorted = [...composition.blocks].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0),
  );

  return (
    <div>
      {composition.title && (
        <h1
          style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            color: 'var(--color-text-primary))',
            margin: '0 0 1.5rem 0',
          }}
        >
          {composition.title}
        </h1>
      )}

      <div style={layoutStyles[composition.layout]}>
        {sorted.map((entry, idx) => {
          const block = registry.get(entry.blockId);

          if (!block) {
            return (
              <div
                key={idx}
                style={{
                  padding: '1rem',
                  border: '1px dashed var(--color-border))',
                  borderRadius: '0.5rem',
                  color: 'var(--color-text-secondary))',
                  fontSize: '0.875rem',
                  ...(composition.layout === 'grid' && entry.span
                    ? { gridColumn: `span ${entry.span}` }
                    : {}),
                }}
              >
                Block not found: {entry.blockId}
              </div>
            );
          }

          const Component = block.component;
          const mergedProps = { ...block.defaultProps, ...entry.props };

          return (
            <div
              key={idx}
              style={
                composition.layout === 'grid' && entry.span
                  ? { gridColumn: `span ${entry.span}` }
                  : undefined
              }
            >
              <Component {...mergedProps} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
