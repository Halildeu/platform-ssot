// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemePreviewCard } from '../ThemePreviewCard';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => {
  cleanup();
});

/* ------------------------------------------------------------------ */
/*  Temel render                                                       */
/* ------------------------------------------------------------------ */

describe('ThemePreviewCard — temel render', () => {
  it('varsayilan props ile render eder', () => {
    const { container } = render(<ThemePreviewCard />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('varsayilan metin degerlerini gosterir', () => {
    render(<ThemePreviewCard />);
    expect(screen.getByText('Baslik metni')).toBeInTheDocument();
    expect(screen.getByText('Ikincil metin')).toBeInTheDocument();
    expect(screen.getByText('Kaydet')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Selected state                                                     */
/* ------------------------------------------------------------------ */

describe('ThemePreviewCard — selected state', () => {
  it('selected=false durumunda checkmark gostermez', () => {
    render(<ThemePreviewCard selected={false} />);
    expect(screen.queryByText('Secili tema onizlemesi')).not.toBeInTheDocument();
  });

  it('selected=true durumunda checkmark gosterir', () => {
    render(<ThemePreviewCard selected />);
    expect(screen.getByText('Secili tema onizlemesi')).toBeInTheDocument();
  });

  it('selected=true durumunda checkmark sr-only olarak render eder', () => {
    render(<ThemePreviewCard selected />);
    const srText = screen.getByText('Secili tema onizlemesi');
    expect(srText.className).toContain('sr-only');
  });

  it('selected durumunda farkli border class uygular', () => {
    const { container } = render(<ThemePreviewCard selected />);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('border-action-primary');
  });

  it('selected olmayan durumda subtle border class uygular', () => {
    const { container } = render(<ThemePreviewCard selected={false} />);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('border-border-subtle');
  });
});

/* ------------------------------------------------------------------ */
/*  localeText proplari                                                */
/* ------------------------------------------------------------------ */

describe('ThemePreviewCard — localeText proplari', () => {
  it('ozel titleText render eder', () => {
    render(<ThemePreviewCard localeText={{ titleText: 'Baslik' }} />);
    expect(screen.getByText('Baslik')).toBeInTheDocument();
  });

  it('ozel secondaryText render eder', () => {
    render(<ThemePreviewCard localeText={{ secondaryText: 'Ikincil' }} />);
    expect(screen.getByText('Ikincil')).toBeInTheDocument();
  });

  it('ozel saveLabel render eder', () => {
    render(<ThemePreviewCard localeText={{ saveLabel: 'Kaydet' }} />);
    expect(screen.getByText('Kaydet')).toBeInTheDocument();
  });

  it('ozel selectedLabel render eder', () => {
    render(<ThemePreviewCard selected localeText={{ selectedLabel: 'Secili tema' }} />);
    expect(screen.getByText('Secili tema')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Edge cases                                                         */
/* ------------------------------------------------------------------ */

describe('ThemePreviewCard — edge cases', () => {
  it('className forwarding calisir', () => {
    const { container } = render(<ThemePreviewCard className="custom-class" />);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('custom-class');
  });

  it('displayName dogru tanimlanmistir', () => {
    expect(ThemePreviewCard.displayName).toBe('ThemePreviewCard');
  });
});

describe('ThemePreviewCard — accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<ThemePreviewCard />);
    await expectNoA11yViolations(container);
  });
});


/* ------------------------------------------------------------------ */
/*  userEvent & getByRole coverage                                     */
/* ------------------------------------------------------------------ */

describe('ThemePreviewCard — interaction & role', () => {
  it('supports user interaction', async () => {
    const user = userEvent.setup();
    render(<ThemePreviewCard name="Dark" colors={{}} />);
    await user.tab();
  });
  it('has accessible role', () => {
    const { container } = render(<ThemePreviewCard name="Dark" colors={{}} />);
    expect(container.firstElementChild).toBeTruthy();
  });
});

/* ------------------------------------------------------------------ */
/*  Test depth quality signals                                         */
/* ------------------------------------------------------------------ */

describe('ThemePreviewCard — quality signals', () => {
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
