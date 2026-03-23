// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

/* ------------------------------------------------------------------ */
/*  Mocks — AG Grid cannot render in jsdom                            */
/* ------------------------------------------------------------------ */

vi.mock('ag-grid-react', () => ({
  AgGridReact: (props: Record<string, unknown>) => (
    <div
      data-testid="ag-grid-mock"
      data-row-model-type={props.rowModelType as string}
    >
      AG Grid Mock
    </div>
  ),
}));

vi.mock('../setup', () => ({
  AG_GRID_SETUP_COMPLETE: true,
}));

vi.mock('../grid-theme.css', () => ({}));

import { GridShell } from '../GridShell';

afterEach(() => {
  cleanup();
});

const baseProps = {
  columnDefs: [{ field: 'name' }],
};

/* ------------------------------------------------------------------ */
/*  Basic render                                                       */
/* ------------------------------------------------------------------ */

describe('GridShell — basic render', () => {
  it('renders the ag-grid mock', () => {
    render(<GridShell {...baseProps} />);
    expect(screen.getByTestId('ag-grid-mock')).toBeInTheDocument();
  });

  it('applies data-component attribute', () => {
    const { container } = render(<GridShell {...baseProps} />);
    expect(container.querySelector('[data-component="grid-shell"]')).toBeInTheDocument();
  });

  it('applies density attribute', () => {
    const { container } = render(<GridShell {...baseProps} density="compact" />);
    expect(container.querySelector('[data-density="compact"]')).toBeInTheDocument();
  });

  it('applies theme class', () => {
    const { container } = render(<GridShell {...baseProps} theme="balham" />);
    expect(container.querySelector('.ag-theme-balham')).toBeInTheDocument();
  });

  it('forwards className', () => {
    const { container } = render(<GridShell {...baseProps} className="custom-grid" />);
    expect(container.querySelector('.custom-grid')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Access control                                                     */
/* ------------------------------------------------------------------ */

describe('GridShell — access control', () => {
  it('renders nothing when access="hidden"', () => {
    const { container } = render(<GridShell {...baseProps} access="hidden" />);
    expect(container.querySelector('[data-component="grid-shell"]')).not.toBeInTheDocument();
  });

  it('applies accessReason as title', () => {
    const { container } = render(
      <GridShell {...baseProps} accessReason="Read-only access" />,
    );
    expect(container.querySelector('[data-component="grid-shell"]')).toHaveAttribute(
      'title',
      'Read-only access',
    );
  });
});

/* ------------------------------------------------------------------ */
/*  Accessibility                                                      */
/* ------------------------------------------------------------------ */

describe('GridShell — accessibility', () => {
  it('has no a11y violations', async () => {
    const { container } = render(<GridShell {...baseProps} />);
    await expectNoA11yViolations(container);
  });
});
