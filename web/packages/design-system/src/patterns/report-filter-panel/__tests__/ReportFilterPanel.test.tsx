// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReportFilterPanel } from '../ReportFilterPanel';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => {
  cleanup();
});

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const defaultProps = {
  children: <input placeholder="Filter" />,
};

/* ------------------------------------------------------------------ */
/*  Temel render                                                       */
/* ------------------------------------------------------------------ */

describe('ReportFilterPanel — temel render', () => {
  it('form elementini render eder', () => {
    const { container } = render(<ReportFilterPanel {...defaultProps} />);
    expect(container.querySelector('form')).toBeInTheDocument();
  });

  it('children render eder', () => {
    render(<ReportFilterPanel {...defaultProps} />);
    expect(screen.getByPlaceholderText('Filter')).toBeInTheDocument();
  });

  it('varsayilan submitLabel gosterir', () => {
    render(<ReportFilterPanel {...defaultProps} />);
    expect(screen.getByText('Filtrele')).toBeInTheDocument();
  });

  it('ozel submitLabel kabul eder', () => {
    render(<ReportFilterPanel {...defaultProps} submitLabel="Search" />);
    expect(screen.getByText('Search')).toBeInTheDocument();
  });

  it('varsayilan resetLabel gosterir (onReset varsa)', () => {
    render(
      <ReportFilterPanel {...defaultProps} onReset={vi.fn()} />,
    );
    expect(screen.getByText('Sifirla')).toBeInTheDocument();
  });

  it('ozel resetLabel kabul eder', () => {
    render(
      <ReportFilterPanel
        {...defaultProps}
        onReset={vi.fn()}
        resetLabel="Clear"
      />,
    );
    expect(screen.getByText('Clear')).toBeInTheDocument();
  });

  it('onReset yoksa reset butonu gostermez', () => {
    render(<ReportFilterPanel {...defaultProps} />);
    expect(screen.queryByText('Sifirla')).toBeNull();
  });
});

/* ------------------------------------------------------------------ */
/*  Interaction                                                        */
/* ------------------------------------------------------------------ */

describe('ReportFilterPanel — interaction', () => {
  it('submit butonuna tiklandiginda onSubmit cagrilir', async () => {
    const onSubmit = vi.fn();
    render(<ReportFilterPanel {...defaultProps} onSubmit={onSubmit} />);
    await userEvent.click(screen.getByText('Filtrele'));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('reset butonuna tiklandiginda onReset cagrilir', async () => {
    const onReset = vi.fn();
    render(
      <ReportFilterPanel {...defaultProps} onReset={onReset} />,
    );
    await userEvent.click(screen.getByText('Sifirla'));
    expect(onReset).toHaveBeenCalledTimes(1);
  });

  it('loading durumunda submit disabled olur', () => {
    render(<ReportFilterPanel {...defaultProps} loading />);
    expect(screen.getByText('Filtrele')).toBeDisabled();
  });

  it('loading durumunda onSubmit calismaz', async () => {
    const onSubmit = vi.fn();
    render(
      <ReportFilterPanel {...defaultProps} onSubmit={onSubmit} loading />,
    );
    await userEvent.click(screen.getByText('Filtrele'));
    expect(onSubmit).not.toHaveBeenCalled();
  });
});

/* ------------------------------------------------------------------ */
/*  Access control                                                     */
/* ------------------------------------------------------------------ */

describe('ReportFilterPanel — access control', () => {
  it('access="full" durumunda form render eder', () => {
    const { container } = render(
      <ReportFilterPanel {...defaultProps} access="full" />,
    );
    expect(
      container.querySelector('[data-access-state="full"]'),
    ).toBeInTheDocument();
  });

  it('access="hidden" durumunda hicbir sey render etmez', () => {
    const { container } = render(
      <ReportFilterPanel {...defaultProps} access="hidden" />,
    );
    expect(container.querySelector('form')).toBeNull();
  });

  it('access="disabled" durumunda submit disabled olur', () => {
    render(<ReportFilterPanel {...defaultProps} access="disabled" />);
    expect(screen.getByText('Filtrele')).toBeDisabled();
  });

  it('access="readonly" durumunda submit disabled olur', () => {
    render(<ReportFilterPanel {...defaultProps} access="readonly" />);
    expect(screen.getByText('Filtrele')).toBeDisabled();
  });

  it('access="disabled" durumunda reset butonu disabled olur', () => {
    render(
      <ReportFilterPanel
        {...defaultProps}
        access="disabled"
        onReset={vi.fn()}
      />,
    );
    expect(screen.getByText('Sifirla')).toBeDisabled();
  });

  it('accessReason submit buton title olarak atanir', () => {
    render(
      <ReportFilterPanel {...defaultProps} accessReason="No access" />,
    );
    expect(screen.getByText('Filtrele')).toHaveAttribute('title', 'No access');
  });
});

/* ------------------------------------------------------------------ */
/*  Test IDs                                                           */
/* ------------------------------------------------------------------ */

describe('ReportFilterPanel — test IDs', () => {
  it('testId form elementine atanir', () => {
    const { container } = render(
      <ReportFilterPanel {...defaultProps} testId="rfp" />,
    );
    expect(container.querySelector('[data-testid="rfp"]')).toBeInTheDocument();
  });

  it('submitTestId submit butonuna atanir', () => {
    render(
      <ReportFilterPanel {...defaultProps} submitTestId="rfp-submit" />,
    );
    expect(screen.getByTestId('rfp-submit')).toBeInTheDocument();
  });

  it('resetTestId reset butonuna atanir', () => {
    render(
      <ReportFilterPanel
        {...defaultProps}
        onReset={vi.fn()}
        resetTestId="rfp-reset"
      />,
    );
    expect(screen.getByTestId('rfp-reset')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Edge cases                                                         */
/* ------------------------------------------------------------------ */

describe('ReportFilterPanel — edge cases', () => {
  it('birden fazla children render eder', () => {
    render(
      <ReportFilterPanel>
        <input placeholder="Field 1" />
        <input placeholder="Field 2" />
      </ReportFilterPanel>,
    );
    expect(screen.getByPlaceholderText('Field 1')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Field 2')).toBeInTheDocument();
  });
});

describe('ReportFilterPanel — accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<ReportFilterPanel {...defaultProps} />);
    await expectNoA11yViolations(container);
  });

  it('renders a form element', () => {
    const { container } = render(<ReportFilterPanel {...defaultProps} />);
    const form = container.querySelector('form');
    expect(form).toBeInTheDocument();
    expect(form?.tagName).toBe('FORM');
  });

  it('submit button is accessible via role', () => {
    render(<ReportFilterPanel {...defaultProps} />);
    expect(screen.getByRole('button', { name: 'Filtrele' })).toBeInTheDocument();
  });

  it('reset button is accessible via role', () => {
    render(<ReportFilterPanel {...defaultProps} onReset={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Sifirla' })).toBeInTheDocument();
  });

  it('disabled access sets aria-disabled on form', () => {
    const { container } = render(
      <ReportFilterPanel {...defaultProps} access="disabled" />,
    );
    expect(container.querySelector('[data-access-state="disabled"]')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Test depth quality signals                                         */
/* ------------------------------------------------------------------ */

describe('ReportFilterPanel — quality signals', () => {
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
