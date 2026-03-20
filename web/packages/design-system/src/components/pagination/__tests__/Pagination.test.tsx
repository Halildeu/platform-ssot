// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Pagination } from '../Pagination';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => {
  cleanup();
});

/* ------------------------------------------------------------------ */
/*  Temel render                                                       */
/* ------------------------------------------------------------------ */

describe('Pagination — temel render', () => {
  it('nav elementini render eder', () => {
    render(<Pagination total={100} />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('aria-label "Pagination" dir', () => {
    render(<Pagination total={100} />);
    expect(screen.getByRole('navigation')).toHaveAttribute('aria-label', 'Pagination');
  });

  it('Previous ve Next butonlarini render eder', () => {
    render(<Pagination total={100} />);
    expect(screen.getByLabelText('Previous page')).toBeInTheDocument();
    expect(screen.getByLabelText('Next page')).toBeInTheDocument();
  });

  it('sayfa butonlarini render eder', () => {
    render(<Pagination total={50} pageSize={10} />);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Current page                                                       */
/* ------------------------------------------------------------------ */

describe('Pagination — current page', () => {
  it('aktif sayfa aria-current="page" alir', () => {
    render(<Pagination total={50} pageSize={10} current={3} />);
    expect(screen.getByText('3')).toHaveAttribute('aria-current', 'page');
  });

  it('ilk sayfada Previous disabled olur', () => {
    render(<Pagination total={50} pageSize={10} current={1} />);
    expect(screen.getByLabelText('Previous page')).toBeDisabled();
  });

  it('son sayfada Next disabled olur', () => {
    render(<Pagination total={50} pageSize={10} current={5} />);
    expect(screen.getByLabelText('Next page')).toBeDisabled();
  });
});

/* ------------------------------------------------------------------ */
/*  Interaction                                                        */
/* ------------------------------------------------------------------ */

describe('Pagination — interaction', () => {
  it('sayfa butonuna tiklandiginda onChange cagrilir', async () => {
    const handleChange = vi.fn();
    render(<Pagination total={50} pageSize={10} current={1} onChange={handleChange} />);
    await userEvent.click(screen.getByText('3'));
    expect(handleChange).toHaveBeenCalledWith(3);
  });

  it('Next butonuna tiklandiginda bir sonraki sayfa secilir', async () => {
    const handleChange = vi.fn();
    render(<Pagination total={50} pageSize={10} current={2} onChange={handleChange} />);
    await userEvent.click(screen.getByLabelText('Next page'));
    expect(handleChange).toHaveBeenCalledWith(3);
  });

  it('Previous butonuna tiklandiginda bir onceki sayfa secilir', async () => {
    const handleChange = vi.fn();
    render(<Pagination total={50} pageSize={10} current={3} onChange={handleChange} />);
    await userEvent.click(screen.getByLabelText('Previous page'));
    expect(handleChange).toHaveBeenCalledWith(2);
  });
});

/* ------------------------------------------------------------------ */
/*  showTotal                                                          */
/* ------------------------------------------------------------------ */

describe('Pagination — showTotal', () => {
  it('showTotal=true durumunda toplam item sayisini gosterir', () => {
    render(<Pagination total={42} showTotal />);
    expect(screen.getByText('42 items')).toBeInTheDocument();
  });

  it('showTotal=false (varsayilan) durumunda toplam gosterilmez', () => {
    render(<Pagination total={42} />);
    expect(screen.queryByText('42 items')).not.toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Size                                                               */
/* ------------------------------------------------------------------ */

describe('Pagination — size', () => {
  it.each([
    ['sm', 'h-7'],
    ['md', 'h-8'],
  ] as const)('size="%s" dogru class uygular', (size, expected) => {
    render(<Pagination total={50} pageSize={10} size={size} />);
    const prevBtn = screen.getByLabelText('Previous page');
    expect(prevBtn.className).toContain(expected);
  });
});

/* ------------------------------------------------------------------ */
/*  Ellipsis                                                           */
/* ------------------------------------------------------------------ */

describe('Pagination — ellipsis', () => {
  it('cok sayfa oldugunda ellipsis gosterir', () => {
    render(<Pagination total={200} pageSize={10} current={10} />);
    const ellipses = screen.getAllByText('...');
    expect(ellipses.length).toBeGreaterThan(0);
  });
});

/* (Backward compat props totalItems, page, onPageChange removed in v2.0.0) */

/* ------------------------------------------------------------------ */
/*  Edge cases                                                         */
/* ------------------------------------------------------------------ */

describe('Pagination — edge cases', () => {
  it('total=0 durumunda bir sayfa gosterir', () => {
    render(<Pagination total={0} />);
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('className forwarding calisir', () => {
    const { container } = render(<Pagination total={50} className="my-class" />);
    expect(container.querySelector('nav')?.className).toContain('my-class');
  });
});

/* ------------------------------------------------------------------ */
/*  Uncontrolled mode (defaultCurrent)                                 */
/* ------------------------------------------------------------------ */

describe('Pagination — uncontrolled mode (defaultCurrent)', () => {
  it('renders with defaultCurrent and navigates internally on click', async () => {
    render(<Pagination total={50} pageSize={10} defaultCurrent={3} />);

    // Initially page 3 should be active via defaultCurrent
    expect(screen.getByText('3')).toHaveAttribute('aria-current', 'page');

    // Clicking page 4 should update internal state
    await userEvent.click(screen.getByText('4'));
    expect(screen.getByText('4')).toHaveAttribute('aria-current', 'page');
    expect(screen.getByText('3')).not.toHaveAttribute('aria-current');
  });

  it('controlled current prop overrides defaultCurrent', () => {
    render(<Pagination total={50} pageSize={10} current={1} defaultCurrent={3} />);
    // controlled current (1) should win over defaultCurrent (3)
    expect(screen.getByText('1')).toHaveAttribute('aria-current', 'page');
    expect(screen.getByText('3')).not.toHaveAttribute('aria-current');
  });
});

/* ------------------------------------------------------------------ */
/*  A11y                                                               */
/* ------------------------------------------------------------------ */

describe('Pagination — a11y', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<Pagination total={100} pageSize={10} />);
    await expectNoA11yViolations(container);
  });
});
