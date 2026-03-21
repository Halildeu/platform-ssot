import React from 'react';
import { SettingsPageBlock } from '../blocks/admin/SettingsPageBlock';
import type { SettingsSection } from '../blocks/admin/SettingsPageBlock';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface SettingsPageTemplateProps {
  title: string;
  sections: SettingsSection[];
  onSave: () => void;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function SettingsPageTemplate({
  title,
  sections,
  onSave,
}: SettingsPageTemplateProps) {
  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
        }}
      >
        <h1
          style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            color: 'var(--color-text-primary, #0f172a)',
            margin: 0,
          }}
        >
          {title}
        </h1>
        <button
          type="button"
          onClick={onSave}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '0.375rem',
            border: 'none',
            background: 'var(--color-primary, #2563eb)',
            color: '#fff',
            fontSize: '0.875rem',
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          Save Changes
        </button>
      </div>

      <SettingsPageBlock sections={sections} />
    </div>
  );
}
