// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import ThemeAdminRegistryEditor from './ThemeAdminRegistryEditor';
import type { ThemeAdminRow } from './ThemeAdminPage.shared';

vi.mock('./useThemeAdminI18n', () => ({
  useThemeAdminI18n: () => ({
    t: (key: string, params?: Record<string, unknown>) => {
      if (params?.label !== undefined) {
        return `${key}:${String(params.label)}`;
      }
      if (params?.usageHint !== undefined) {
        return `${key}:${String(params.usageHint)}`;
      }
      return key;
    },
  }),
}));

describe('ThemeAdminRegistryEditor', () => {
  afterEach(() => {
    cleanup();
  });

  it('registry disclosure yapisini Accordion uzerinden surdurur', () => {
    const textAreaRows: ThemeAdminRow[] = [
      {
        id: 'text-primary',
        key: 'text.primary',
        label: 'Body Text',
        groupName: 'Text',
        controlType: 'COLOR',
        editableBy: 'USER_ALLOWED',
        value: 'var(--text-primary)',
        cssVars: ['--text-primary'],
      },
    ];
    const groupedRows: ThemeAdminRow[] = [
      {
        id: 'surface-radius',
        key: 'surface.radius',
        label: 'Panel Radius',
        groupName: 'Surface',
        controlType: 'RADIUS',
        editableBy: 'ADMIN_ONLY',
        value: 'rounded',
      },
    ];

    render(
      <ThemeAdminRegistryEditor
        textAreaGroups={[
          {
            id: 'text',
            label: 'Typography',
            rows: textAreaRows,
          },
        ]}
        rowsByGroup={[
          {
            id: 'surface',
            rows: groupedRows,
          },
        ]}
        resolvedPreviewCssVars={{ '--text-primary': 'var(--text-primary)' }}
        resolvedPreviewDisplayCssVars={{ '--text-primary': 'var(--text-primary)' }}
        activeColorPicker={null}
        contrastWarnings={{}}
        onValueChange={vi.fn()}
        onOpenColorPicker={vi.fn()}
        onCloseColorPicker={vi.fn()}
        onColorPickerChange={vi.fn()}
      />,
    );

    expect(screen.getByRole('button', { name: 'themeadmin.registry.sectionTitle' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'themeadmin.registry.textColorsTitle' })).toBeInTheDocument();
    expect(screen.getByText('themeadmin.registry.textColorNote')).toBeInTheDocument();
    expect(screen.queryByText('Body Text')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Typography' }));

    expect(screen.getByText('Body Text')).toBeInTheDocument();
    expect(screen.getByDisplayValue('var(--text-primary)')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'themeadmin.shared.group.surface' }));

    expect(screen.getByText('Panel Radius')).toBeInTheDocument();
    expect(screen.getByDisplayValue('rounded')).toBeInTheDocument();
    expect(screen.getByText('themeadmin.registry.editable.adminOnly')).toBeInTheDocument();
  });
});
