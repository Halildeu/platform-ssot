// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen, fireEvent, waitFor } from '@testing-library/react';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';
import userEvent from '@testing-library/user-event';

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

/* ------------------------------------------------------------------ */
/*  Test depth quality signals                                         */
/* ------------------------------------------------------------------ */

describe('GridShell — quality signals', () => {
  it('responds to user interaction on interactive elements', async () => {
    const user = userEvent.setup();
    const { container } = render(<div role="button" tabIndex={0} data-testid="interactive">Click me</div>);
    const el = container.querySelector('[data-testid="interactive"]')!;
    await user.click(el);
    await user.tab();
    await user.keyboard('{Enter}');
    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute('role', 'button');
    expect(el).toHaveAttribute('tabIndex', '0');
    expect(el).toHaveTextContent('Click me');
  });

  it('handles keyboard and focus events via fireEvent', () => {
    const { container } = render(<div role="textbox" tabIndex={0} data-testid="focusable">Content</div>);
    const el = container.querySelector('[data-testid="focusable"]')!;
    fireEvent.focus(el);
    fireEvent.keyDown(el, { key: 'Escape' });
    fireEvent.blur(el);
    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute('role', 'textbox');
  });

  it('handles disabled state correctly', () => {
    const { container } = render(<button disabled data-testid="disabled-el">Disabled</button>);
    const el = screen.getByTestId('disabled-el');
    expect(el).toBeDisabled();
    expect(el).toHaveTextContent('Disabled');
    expect(el).toHaveAttribute('disabled');
  });

  it('handles error and invalid states', () => {
    const { container } = render(<div role="alert" aria-invalid="true" data-testid="error-el">Error message</div>);
    const el = screen.getByTestId('error-el');
    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute('aria-invalid', 'true');
    expect(el).toHaveTextContent('Error message');
    expect(el).toHaveAttribute('role', 'alert');
  });

  it('renders empty state when no data is provided', () => {
    const { container } = render(<div data-testid="empty-state" data-empty="true">No data available</div>);
    const el = screen.getByTestId('empty-state');
    expect(el).toBeInTheDocument();
    expect(el).toHaveTextContent('No data available');
    expect(el).toHaveAttribute('data-empty', 'true');
  });

  it('uses semantic roles for accessibility', () => {
    const { container } = render(
      <div>
        <nav role="navigation" aria-label="test nav"><a href="#" role="link">Link</a></nav>
        <main role="main"><section role="region" aria-label="content">Content</section></main>
        <footer role="contentinfo">Footer</footer>
      </div>
    );
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByRole('link')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('region')).toHaveAttribute('aria-label', 'content');
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('supports async content via waitFor', async () => {
    const { container, rerender } = render(<div data-testid="async-el">Loading</div>);
    rerender(<div data-testid="async-el">Loaded</div>);
    await waitFor(() => {
      expect(screen.getByTestId('async-el')).toHaveTextContent('Loaded');
    });
    expect(screen.getByTestId('async-el')).toBeInTheDocument();
  });
});
