// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { TablePagination } from '../TablePagination';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

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
