import React from 'react';
import type { ReactNode } from 'react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface DetailViewField {
  label: string;
  value: ReactNode;
}

export interface DetailViewSection {
  title: string;
  fields: DetailViewField[];
}

export interface DetailViewBlockProps {
  title: string;
  sections: DetailViewSection[];
  actions?: ReactNode;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function DetailViewBlock({ title, sections, actions }: DetailViewBlockProps) {
  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
        }}
      >
        <h2
          style={{
            fontSize: '1.25rem',
            fontWeight: 600,
            color: 'var(--color-text-primary, #0f172a)',
            margin: 0,
          }}
        >
          {title}
        </h2>
        {actions && <div style={{ display: 'flex', gap: '0.5rem' }}>{actions}</div>}
      </div>

      {/* Sections */}
      {sections.map((section, sIdx) => (
        <div key={sIdx} style={{ marginBottom: '1.5rem' }}>
          <h3
            style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'var(--color-text-secondary, #64748b)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '0.75rem',
              margin: '0 0 0.75rem 0',
            }}
          >
            {section.title}
          </h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: '0.75rem',
            }}
          >
            {section.fields.map((field, fIdx) => (
              <div key={fIdx}>
                <div
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--color-text-secondary, #64748b)',
                    marginBottom: '0.25rem',
                  }}
                >
                  {field.label}
                </div>
                <div
                  style={{
                    fontSize: '0.875rem',
                    color: 'var(--color-text-primary, #0f172a)',
                  }}
                >
                  {field.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
