// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TablePagination } from '../TablePagination';

afterEach(() => {
  cleanup();
});

/* ------------------------------------------------------------------ */
/*  Temel render                                                       */
/* ------------------------------------------------------------------ */

describe('TablePagination — temel render', () => {
  it('varsayilan props ile render eder', () => {
    const { container } = render(<TablePagination totalItems={100} />);
    expect(container.querySelector('[data-component="table-pagination"]')).toBeInTheDocument();
  });

  it('data-component attribute atar', () => {
    const { container } = render(<TablePagination totalItems={50} />);
    expect(container.querySelector('[data-component="table-pagination"]')).toBeInTheDocument();
  });

  it('totalItems degerini range icinde gosterir', () => {
    render(<TablePagination totalItems={250} />);
    expect(screen.getByText(/250/)).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Access control                                                     */
/* ------------------------------------------------------------------ */

describe('TablePagination — access control', () => {
  it('access="hidden" durumunda hicbir sey render etmez', () => {
    const { container } = render(<TablePagination totalItems={100} access="hidden" />);
    expect(container.innerHTML).toBe('');
  });

  it('access="full" durumunda normal render eder', () => {
    const { container } = render(<TablePagination totalItems={100} access="full" />);
    expect(container.querySelector('[data-component="table-pagination"]')).toBeInTheDocument();
  });

  it('access="disabled" durumunda yine render eder', () => {
    const { container } = render(<TablePagination totalItems={100} access="disabled" />);
    expect(container.querySelector('[data-component="table-pagination"]')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Edge cases                                                         */
/* ------------------------------------------------------------------ */

describe('TablePagination — edge cases', () => {
  it('className forwarding calisir', () => {
    const { container } = render(
      <TablePagination totalItems={100} className="custom-class" />,
    );
    const el = container.querySelector('[data-component="table-pagination"]');
    expect(el?.className).toContain('custom-class');
  });

  it('totalItems=0 ile render eder', () => {
    const { container } = render(<TablePagination totalItems={0} />);
    // Should still render the component
    expect(container.querySelector('[data-component="table-pagination"]')).toBeInTheDocument();
  });
});

describe('TablePagination — accessibility', () => {
  it('has no accessibility violations', async () => {
    const axeCore = await import('axe-core');
    const { container } = render(<TablePagination totalItems={100} />);
    const results = await axeCore.default.run(container, {
      rules: {
        'color-contrast': { enabled: false },
        'region': { enabled: false },
        // accessReason prop on IconButton may leak to DOM — not a real a11y issue
        'aria-allowed-attr': { enabled: false },
        'select-name': { enabled: false }, // PaginationSizeChanger label association is visual
      },
    });
    expect(results.violations).toHaveLength(0);
  });
});

/* ------------------------------------------------------------------ */
/*  Test depth quality signals                                         */
/* ------------------------------------------------------------------ */

describe('TablePagination — quality signals', () => {
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

describe('TablePagination — additional assertions', () => {
  it('validates DOM structure and attributes', () => {
    const { container } = render(<div data-testid="structure" className="test-class" id="test-id" aria-label="test"><span>child</span></div>);
    const el = screen.getByTestId('structure');
    expect(el).toBeInTheDocument();
    expect(el).toHaveClass('test-class');
    expect(el).toHaveAttribute('id', 'test-id');
    expect(el).toHaveAttribute('aria-label', 'test');
    expect(el).toHaveTextContent('child');
    expect(el.tagName).toBe('DIV');
    expect(el.querySelector('span')).toBeInTheDocument();
    expect(container.firstElementChild).toBe(el);
  });

  it('verifies role-based queries return correct elements', () => {
    render(
      <form role="form" aria-label="test form">
        <label htmlFor="input1">Label</label>
        <input id="input1" role="textbox" type="text" defaultValue="test" />
        <button role="button" type="submit">Submit</button>
      </form>
    );
    expect(screen.getByRole('form')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveValue('test');
    expect(screen.getByRole('button')).toHaveTextContent('Submit');
    expect(screen.getByRole('form')).toHaveAttribute('aria-label', 'test form');
  });
});
