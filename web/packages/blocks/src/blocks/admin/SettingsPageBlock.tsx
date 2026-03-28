import React from 'react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface SettingsField {
  name: string;
  label: string;
  type: 'text' | 'toggle' | 'select';
  value: any;
  onChange: (v: any) => void;
  options?: Array<{ label: string; value: string }>;
}

export interface SettingsSection {
  title: string;
  description?: string;
  fields: SettingsField[];
}

export interface SettingsPageBlockProps {
  sections: SettingsSection[];
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function SettingsPageBlock({ sections }: SettingsPageBlockProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {sections.map((section, sIdx) => (
        <div
          key={sIdx}
          style={{
            padding: '1.25rem',
            borderRadius: '0.5rem',
            border: '1px solid var(--color-border, #e2e8f0)',
            backgroundColor: 'var(--color-surface, #fff)',
          }}
        >
          <h3
            style={{
              fontSize: '1rem',
              fontWeight: 600,
              color: 'var(--color-text-primary, #0f172a)',
              margin: '0 0 0.25rem 0',
            }}
          >
            {section.title}
          </h3>
          {section.description && (
            <p
              style={{
                fontSize: '0.8125rem',
                color: 'var(--color-text-secondary, #64748b)',
                margin: '0 0 1rem 0',
              }}
            >
              {section.description}
            </p>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {section.fields.map((field) => (
              <div
                key={field.name}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.5rem 0',
                  borderBottom: '1px solid var(--color-border, #e2e8f0)',
                }}
              >
                <label
                  htmlFor={field.name}
                  style={{
                    fontSize: '0.875rem',
                    color: 'var(--color-text-primary, #0f172a)',
                  }}
                >
                  {field.label}
                </label>

                {field.type === 'toggle' ? (
                  <button
                    type="button"
                    role="switch"
                    aria-checked={!!field.value}
                    onClick={() => field.onChange(!field.value)}
                    style={{
                      width: '44px',
                      height: '24px',
                      borderRadius: '12px',
                      border: 'none',
                      cursor: 'pointer',
                      backgroundColor: field.value
                        ? 'var(--color-primary, #2563eb)'
                        : 'var(--color-border, #e2e8f0)',
                      position: 'relative',
                      transition: 'background-color 0.2s',
                    }}
                  >
                    <span
                      style={{
                        display: 'block',
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        backgroundColor: '#fff',
                        position: 'absolute',
                        top: '3px',
                        left: field.value ? '23px' : '3px',
                        transition: 'left 0.2s',
                      }}
                    />
                  </button>
                ) : field.type === 'select' ? (
                  <select
                    id={field.name}
                    value={String(field.value)}
                    onChange={(e) => field.onChange(e.target.value)}
                    style={{
                      padding: '0.375rem 0.5rem',
                      borderRadius: '0.375rem',
                      border: '1px solid var(--color-border, #e2e8f0)',
                      fontSize: '0.875rem',
                    }}
                  >
                    {field.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    id={field.name}
                    type="text"
                    value={String(field.value ?? '')}
                    onChange={(e) => field.onChange(e.target.value)}
                    style={{
                      padding: '0.375rem 0.5rem',
                      borderRadius: '0.375rem',
                      border: '1px solid var(--color-border, #e2e8f0)',
                      fontSize: '0.875rem',
                      maxWidth: '240px',
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
