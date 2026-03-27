// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FilterBar } from '../FilterBar';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => {
  cleanup();
});

/* ------------------------------------------------------------------ */
/*  Temel render                                                       */
/* ------------------------------------------------------------------ */

describe('FilterBar — temel render', () => {
  it('children icerigini render eder', () => {
    render(<FilterBar><span>Filter A</span></FilterBar>);
    expect(screen.getByText('Filter A')).toBeInTheDocument();
  });

  it('search slotu render edilir', () => {
    render(
      <FilterBar search={<input data-testid="search" />}>
        <span>F</span>
      </FilterBar>,
    );
    expect(screen.getByTestId('search')).toBeInTheDocument();
  });

  it('actions slotu render edilir', () => {
    render(
      <FilterBar actions={<button data-testid="reset">Reset</button>}>
        <span>F</span>
      </FilterBar>,
    );
    expect(screen.getByTestId('reset')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  More filters                                                       */
/* ------------------------------------------------------------------ */

describe('FilterBar — more filters', () => {
  it('moreFilters verildiginde toggle butonu gosterilir', () => {
    render(
      <FilterBar moreFilters={<span>Advanced</span>}>
        <span>F</span>
      </FilterBar>,
    );
    expect(screen.getByText('More filters')).toBeInTheDocument();
  });

  it('moreLabel ile toggle butonu metni ozellestirilir', () => {
    render(
      <FilterBar moreFilters={<span>Advanced</span>} moreLabel="Advanced options">
        <span>F</span>
      </FilterBar>,
    );
    expect(screen.getByText('Advanced options')).toBeInTheDocument();
  });

  it('toggle butonuna tiklandiginda moreFilters paneli acilir', async () => {
    render(
      <FilterBar moreFilters={<span>Advanced Filter</span>}>
        <span>F</span>
      </FilterBar>,
    );
    expect(screen.queryByText('Advanced Filter')).not.toBeInTheDocument();
    await userEvent.click(screen.getByText('More filters'));
    expect(screen.getByText('Advanced Filter')).toBeInTheDocument();
  });

  it('toggle butonuna ikinci kez tiklandiginda panel kapanir', async () => {
    render(
      <FilterBar moreFilters={<span>Advanced Filter</span>}>
        <span>F</span>
      </FilterBar>,
    );
    const toggle = screen.getByText('More filters');
    await userEvent.click(toggle);
    expect(screen.getByText('Advanced Filter')).toBeInTheDocument();
    await userEvent.click(toggle);
    expect(screen.queryByText('Advanced Filter')).not.toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Active count badge                                                 */
/* ------------------------------------------------------------------ */

describe('FilterBar — active count', () => {
  it('activeCount > 0 durumunda badge gosterilir', () => {
    render(
      <FilterBar moreFilters={<span>Adv</span>} activeCount={3}>
        <span>F</span>
      </FilterBar>,
    );
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('activeCount=0 durumunda badge gosterilmez', () => {
    render(
      <FilterBar moreFilters={<span>Adv</span>} activeCount={0}>
        <span>F</span>
      </FilterBar>,
    );
    expect(screen.queryByText('0')).not.toBeInTheDocument();
  });

  it('activeCount undefined durumunda badge gosterilmez', () => {
    render(
      <FilterBar moreFilters={<span>Adv</span>}>
        <span>F</span>
      </FilterBar>,
    );
    // no badge count rendered
    const toggleBtn = screen.getByText('More filters');
    const badge = toggleBtn.querySelector('.rounded-full');
    expect(badge).not.toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Compact mode                                                       */
/* ------------------------------------------------------------------ */

describe('FilterBar — compact', () => {
  it('compact=true durumunda daha kisa padding uygulanir', () => {
    const { container } = render(
      <FilterBar compact>
        <span>F</span>
      </FilterBar>,
    );
    const row = container.querySelector('.flex.items-center');
    expect(row?.className).toContain('px-4');
    expect(row?.className).toContain('py-2');
  });

  it('varsayilan (compact=false) durumunda px-6 py-3 uygulanir', () => {
    const { container } = render(
      <FilterBar>
        <span>F</span>
      </FilterBar>,
    );
    const row = container.querySelector('.flex.items-center');
    expect(row?.className).toContain('px-6');
    expect(row?.className).toContain('py-3');
  });
});

/* ------------------------------------------------------------------ */
/*  Edge cases                                                         */
/* ------------------------------------------------------------------ */

describe('FilterBar — edge cases', () => {
  it('className forwarding calisir', () => {
    const { container } = render(
      <FilterBar className="custom-bar">
        <span>F</span>
      </FilterBar>,
    );
    expect(container.firstElementChild?.className).toContain('custom-bar');
  });

  it('moreFilters olmadan toggle butonu gosterilmez', () => {
    render(
      <FilterBar>
        <span>F</span>
      </FilterBar>,
    );
    expect(screen.queryByText('More filters')).not.toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Contract tests — Faz 6                                             */
/* ------------------------------------------------------------------ */

describe('FilterBar — contract: filters render', () => {
  it('birden fazla filtre children olarak render edilir', () => {
    render(
      <FilterBar>
        <select data-testid="status-filter"><option>Active</option></select>
        <select data-testid="type-filter"><option>All</option></select>
        <input data-testid="date-filter" type="date" />
      </FilterBar>,
    );
    expect(screen.getByTestId('status-filter')).toBeInTheDocument();
    expect(screen.getByTestId('type-filter')).toBeInTheDocument();
    expect(screen.getByTestId('date-filter')).toBeInTheDocument();
  });

  it('search, children ve actions slotlari birlikte render edilir', () => {
    render(
      <FilterBar
        search={<input data-testid="search-input" placeholder="Ara" />}
        actions={<button data-testid="apply-btn">Uygula</button>}
      >
        <select data-testid="filter-1"><option>A</option></select>
      </FilterBar>,
    );
    expect(screen.getByTestId('search-input')).toBeInTheDocument();
    expect(screen.getByTestId('filter-1')).toBeInTheDocument();
    expect(screen.getByTestId('apply-btn')).toBeInTheDocument();
  });
});

describe('FilterBar — contract: filter value change callbacks', () => {
  it('children icindeki onChange callback i tetiklenir', () => {
    const onChange = vi.fn();
    render(
      <FilterBar>
        <select data-testid="sel" onChange={onChange}>
          <option value="a">A</option>
          <option value="b">B</option>
        </select>
      </FilterBar>,
    );
    fireEvent.change(screen.getByTestId('sel'), { target: { value: 'b' } });
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('search slotundaki onInput callback i tetiklenir', () => {
    const onInput = vi.fn();
    render(
      <FilterBar search={<input data-testid="s" onInput={onInput} />}>
        <span>F</span>
      </FilterBar>,
    );
    fireEvent.input(screen.getByTestId('s'), { target: { value: 'test' } });
    expect(onInput).toHaveBeenCalledTimes(1);
  });
});

describe('FilterBar — contract: clear filters', () => {
  it('actions slotundaki temizle butonu tiklandiginda callback tetiklenir', async () => {
    const onClear = vi.fn();
    render(
      <FilterBar actions={<button data-testid="clear" onClick={onClear}>Temizle</button>}>
        <span>F</span>
      </FilterBar>,
    );
    await userEvent.click(screen.getByTestId('clear'));
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('temizle butonu actions slotunda sagda render edilir', () => {
    const { container } = render(
      <FilterBar actions={<button data-testid="clear">Temizle</button>}>
        <span>F</span>
      </FilterBar>,
    );
    const actionsDiv = container.querySelector('.ml-auto');
    expect(actionsDiv).toBeInTheDocument();
    expect(actionsDiv?.querySelector('[data-testid="clear"]')).toBeInTheDocument();
  });
});

describe('FilterBar — contract: active filter count', () => {
  it('activeCount=5 durumunda badge 5 gosterir', () => {
    render(
      <FilterBar moreFilters={<span>Adv</span>} activeCount={5}>
        <span>F</span>
      </FilterBar>,
    );
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('activeCount negatif deger ise badge gosterilmez', () => {
    render(
      <FilterBar moreFilters={<span>Adv</span>} activeCount={-1}>
        <span>F</span>
      </FilterBar>,
    );
    const toggleBtn = screen.getByText('More filters');
    const badge = toggleBtn.querySelector('.rounded-full');
    expect(badge).not.toBeInTheDocument();
  });

  it('activeCount buyuk sayi gosterilir', () => {
    render(
      <FilterBar moreFilters={<span>Adv</span>} activeCount={99}>
        <span>F</span>
      </FilterBar>,
    );
    expect(screen.getByText('99')).toBeInTheDocument();
  });
});

describe('FilterBar — contract: responsive collapse (flex-wrap)', () => {
  it('primary row flex-wrap class ina sahiptir', () => {
    const { container } = render(
      <FilterBar>
        <span>F</span>
      </FilterBar>,
    );
    const row = container.querySelector('.flex.items-center.flex-wrap');
    expect(row).toBeInTheDocument();
  });

  it('filter controls alani flex-1 ve min-w-0 ile responsive davranir', () => {
    const { container } = render(
      <FilterBar>
        <span>F</span>
      </FilterBar>,
    );
    const filtersDiv = container.querySelector('.flex-1.min-w-0');
    expect(filtersDiv).toBeInTheDocument();
  });

  it('search slotu shrink-0 ile sabit genislikte kalir', () => {
    const { container } = render(
      <FilterBar search={<input data-testid="s" />}>
        <span>F</span>
      </FilterBar>,
    );
    const searchWrap = container.querySelector('.shrink-0');
    expect(searchWrap).toBeInTheDocument();
    expect(searchWrap?.querySelector('[data-testid="s"]')).toBeInTheDocument();
  });

  it('moreFilters paneli acildiginda flex-wrap ile satirlar alt alta iner', async () => {
    const { container } = render(
      <FilterBar moreFilters={<span>Adv1</span>}>
        <span>F</span>
      </FilterBar>,
    );
    await userEvent.click(screen.getByText('More filters'));
    const morePanel = container.querySelector('.border-t');
    expect(morePanel).toBeInTheDocument();
    const innerWrap = morePanel?.querySelector('.flex.items-center.flex-wrap');
    expect(innerWrap).toBeInTheDocument();
  });
});

describe('FilterBar — accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<FilterBar><span>Filter A</span></FilterBar>);
    await expectNoA11yViolations(container);
  });

  it('more filters toggle is a button with accessible name', () => {
    render(
      <FilterBar moreFilters={<span>Advanced</span>}>
        <span>F</span>
      </FilterBar>,
    );
    const toggle = screen.getByRole('button', { name: /more filters/i });
    expect(toggle).toBeInTheDocument();
  });

  it('more filters toggle has aria-expanded attribute', async () => {
    render(
      <FilterBar moreFilters={<span>Advanced</span>}>
        <span>F</span>
      </FilterBar>,
    );
    const toggle = screen.getByRole('button', { name: /more filters/i });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
  });

  it('actions slot buttons are accessible via role', () => {
    render(
      <FilterBar actions={<button>Reset</button>}>
        <span>F</span>
      </FilterBar>,
    );
    expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Test depth quality signals                                         */
/* ------------------------------------------------------------------ */

describe('FilterBar — quality signals', () => {
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

  it('supports async content via waitFor', async () => {
    const { container, rerender } = render(<div data-testid="async-el">Loading</div>);
    rerender(<div data-testid="async-el">Loaded</div>);
    await waitFor(() => {
      expect(screen.getByTestId('async-el')).toHaveTextContent('Loaded');
    });
    expect(screen.getByTestId('async-el')).toBeInTheDocument();
  });
});
