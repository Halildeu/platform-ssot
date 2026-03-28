// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { ReportFilterPanel } from '../ReportFilterPanel';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => {
  cleanup();
});

/* ------------------------------------------------------------------ */
/*  Contract: Default render                                           */
/* ------------------------------------------------------------------ */

describe('ReportFilterPanel contract — default render', () => {
  it('renders as a form element', () => {
    const { container } = render(
      <ReportFilterPanel>
        <input placeholder="Date" />
      </ReportFilterPanel>,
    );
    expect(container.querySelector('form')).toBeInTheDocument();
  });

  it('renders children as filter inputs', () => {
    render(
      <ReportFilterPanel>
        <input data-testid="date-filter" placeholder="Date" />
      </ReportFilterPanel>,
    );
    expect(screen.getByTestId('date-filter')).toBeInTheDocument();
  });

  it('renders submit button with default label', () => {
    render(
      <ReportFilterPanel>
        <input placeholder="Date" />
      </ReportFilterPanel>,
    );
    expect(screen.getByText('Filtrele')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Contract: Key props                                                */
/* ------------------------------------------------------------------ */

describe('ReportFilterPanel contract — key props', () => {
  it('renders custom submitLabel', () => {
    render(
      <ReportFilterPanel submitLabel="Apply">
        <input placeholder="Date" />
      </ReportFilterPanel>,
    );
    expect(screen.getByText('Apply')).toBeInTheDocument();
  });

  it('renders reset button when onReset is provided', () => {
    render(
      <ReportFilterPanel onReset={() => {}} resetLabel="Clear">
        <input placeholder="Date" />
      </ReportFilterPanel>,
    );
    expect(screen.getByText('Clear')).toBeInTheDocument();
  });

  it('does not render reset button when onReset is omitted', () => {
    render(
      <ReportFilterPanel>
        <input placeholder="Date" />
      </ReportFilterPanel>,
    );
    expect(screen.queryByText('Sifirla')).toBeNull();
  });

  it('calls onSubmit when form is submitted', () => {
    const onSubmit = vi.fn();
    const { container } = render(
      <ReportFilterPanel onSubmit={onSubmit}>
        <input placeholder="Date" />
      </ReportFilterPanel>,
    );
    fireEvent.submit(container.querySelector('form')!);
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('calls onReset when reset button is clicked', () => {
    const onReset = vi.fn();
    render(
      <ReportFilterPanel onReset={onReset}>
        <input placeholder="Date" />
      </ReportFilterPanel>,
    );
    fireEvent.click(screen.getByText('Sifirla'));
    expect(onReset).toHaveBeenCalledTimes(1);
  });

  it('disables submit button when loading=true', () => {
    render(
      <ReportFilterPanel loading>
        <input placeholder="Date" />
      </ReportFilterPanel>,
    );
    expect(screen.getByText('Filtrele')).toBeDisabled();
  });

  it('returns null when access=hidden', () => {
    const { container } = render(
      <ReportFilterPanel access="hidden">
        <input placeholder="Date" />
      </ReportFilterPanel>,
    );
    expect(container.innerHTML).toBe('');
  });
});

/* ------------------------------------------------------------------ */
/*  Contract: Slot rendering                                           */
/* ------------------------------------------------------------------ */

describe('ReportFilterPanel contract — slot rendering', () => {
  it('renders multiple children as filter fields', () => {
    render(
      <ReportFilterPanel>
        <input data-testid="filter-1" placeholder="Start Date" />
        <input data-testid="filter-2" placeholder="End Date" />
        <select data-testid="filter-3"><option>All</option></select>
      </ReportFilterPanel>,
    );
    expect(screen.getByTestId('filter-1')).toBeInTheDocument();
    expect(screen.getByTestId('filter-2')).toBeInTheDocument();
    expect(screen.getByTestId('filter-3')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Contract: className / testId                                       */
/* ------------------------------------------------------------------ */

describe('ReportFilterPanel contract — testId', () => {
  it('sets data-testid on form when testId provided', () => {
    render(
      <ReportFilterPanel testId="report-filters">
        <input placeholder="Date" />
      </ReportFilterPanel>,
    );
    expect(screen.getByTestId('report-filters')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Contract: Accessibility                                            */
/* ------------------------------------------------------------------ */

describe('ReportFilterPanel — accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(
      <ReportFilterPanel>
        <label>Date <input placeholder="Date" /></label>
      </ReportFilterPanel>,
    );
    await expectNoA11yViolations(container);
  });
});
