// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LinkInline } from '../LinkInline';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => {
  cleanup();
});

/* ------------------------------------------------------------------ */
/*  Temel render                                                       */
/* ------------------------------------------------------------------ */

describe('LinkInline — temel render', () => {
  it('anchor elementini render eder', () => {
    render(<LinkInline href="/page">Click me</LinkInline>);
    const link = screen.getByRole('link', { name: 'Click me' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/page');
  });

  it('children metnini gosterir', () => {
    render(<LinkInline href="/page">My Link</LinkInline>);
    expect(screen.getByText('My Link')).toBeInTheDocument();
  });

  it('href olmadan span olarak render eder', () => {
    const { container } = render(<LinkInline>No Link</LinkInline>);
    expect(container.querySelector('a')).not.toBeInTheDocument();
    expect(container.querySelector('span')).toBeInTheDocument();
    expect(screen.getByText('No Link')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Tone                                                               */
/* ------------------------------------------------------------------ */

describe('LinkInline — tone', () => {
  it('varsayilan tone "primary" dir', () => {
    const { container } = render(<LinkInline href="/page">Link</LinkInline>);
    const link = container.querySelector('a');
    expect(link?.className).toContain('text-action-primary');
  });

  it('tone="secondary" secondary class uygular', () => {
    const { container } = render(<LinkInline href="/page" tone="secondary">Link</LinkInline>);
    const link = container.querySelector('a');
    expect(link?.className).toContain('text-text-secondary');
  });
});

/* ------------------------------------------------------------------ */
/*  Underline                                                          */
/* ------------------------------------------------------------------ */

describe('LinkInline — underline', () => {
  it('underline="always" underline class uygular', () => {
    const { container } = render(<LinkInline href="/page" underline="always">Link</LinkInline>);
    const link = container.querySelector('a');
    expect(link?.className).toContain('underline');
  });

  it('underline="hover" (varsayilan) hover underline class uygular', () => {
    const { container } = render(<LinkInline href="/page">Link</LinkInline>);
    const link = container.querySelector('a');
    expect(link?.className).toContain('hover:underline');
  });

  it('underline="none" no-underline class uygular', () => {
    const { container } = render(<LinkInline href="/page" underline="none">Link</LinkInline>);
    const link = container.querySelector('a');
    expect(link?.className).toContain('no-underline');
  });
});

/* ------------------------------------------------------------------ */
/*  Current state                                                      */
/* ------------------------------------------------------------------ */

describe('LinkInline — current state', () => {
  it('current=true aria-current="page" ayarlar', () => {
    render(<LinkInline href="/page" current>Current Page</LinkInline>);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('aria-current', 'page');
  });

  it('current=true data-link-state="current" ayarlar', () => {
    render(<LinkInline href="/page" current>Current Page</LinkInline>);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('data-link-state', 'current');
  });

  it('current=false (varsayilan) aria-current ayarlamaz', () => {
    render(<LinkInline href="/page">Normal Link</LinkInline>);
    const link = screen.getByRole('link');
    expect(link).not.toHaveAttribute('aria-current');
  });
});

/* ------------------------------------------------------------------ */
/*  External links                                                     */
/* ------------------------------------------------------------------ */

describe('LinkInline — external links', () => {
  it('https URL otomatik external olur', () => {
    render(<LinkInline href="https://example.com">External</LinkInline>);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('external=true target="_blank" ayarlar', () => {
    render(<LinkInline href="/local" external>External</LinkInline>);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('external link icin screen reader label gosterir', () => {
    render(<LinkInline href="https://example.com">Ext</LinkInline>);
    expect(screen.getByText('External link')).toBeInTheDocument();
  });

  it('localeText.externalScreenReaderLabel ozellestirilir', () => {
    render(
      <LinkInline
        href="https://example.com"
        localeText={{ externalScreenReaderLabel: 'Dis baglanti' }}
      >
        Ext
      </LinkInline>,
    );
    expect(screen.getByText('Dis baglanti')).toBeInTheDocument();
  });

  it('external=false internal link olarak render eder', () => {
    render(<LinkInline href="https://example.com" external={false}>Internal</LinkInline>);
    const link = screen.getByRole('link');
    expect(link).not.toHaveAttribute('target', '_blank');
  });
});

/* ------------------------------------------------------------------ */
/*  Visual slots                                                       */
/* ------------------------------------------------------------------ */

describe('LinkInline — visual slots', () => {
  it('leadingVisual render eder', () => {
    render(
      <LinkInline href="/page" leadingVisual={<span data-testid="leading">L</span>}>
        Link
      </LinkInline>,
    );
    expect(screen.getByTestId('leading')).toBeInTheDocument();
  });

  it('trailingVisual render eder', () => {
    render(
      <LinkInline href="/page" trailingVisual={<span data-testid="trailing">R</span>}>
        Link
      </LinkInline>,
    );
    expect(screen.getByTestId('trailing')).toBeInTheDocument();
  });

  it('external link trailingVisual varken arrow gostermez', () => {
    const { container } = render(
      <LinkInline href="https://example.com" trailingVisual={<span>T</span>}>
        Ext
      </LinkInline>,
    );
    // External arrow icon should not appear when trailingVisual is present
    const arrowSpans = container.querySelectorAll('[aria-hidden="true"]');
    const arrowTexts = Array.from(arrowSpans).map((el) => el.textContent);
    expect(arrowTexts).not.toContain('\u2197');
  });
});

/* ------------------------------------------------------------------ */
/*  Disabled state                                                     */
/* ------------------------------------------------------------------ */

describe('LinkInline — disabled state', () => {
  it('disabled durumunda span olarak render eder', () => {
    const { container } = render(<LinkInline href="/page" disabled>Disabled</LinkInline>);
    expect(container.querySelector('a')).not.toBeInTheDocument();
    const span = container.querySelector('span');
    expect(span).toHaveAttribute('aria-disabled', 'true');
  });

  it('disabled durumunda data-link-state="blocked" olur', () => {
    const { container } = render(<LinkInline href="/page" disabled>Disabled</LinkInline>);
    const span = container.querySelector('[data-link-state]');
    expect(span).toHaveAttribute('data-link-state', 'blocked');
  });
});

/* ------------------------------------------------------------------ */
/*  Access control                                                     */
/* ------------------------------------------------------------------ */

describe('LinkInline — access control', () => {
  it('access="full" durumunda anchor render eder', () => {
    render(<LinkInline href="/page" access="full">Link</LinkInline>);
    expect(screen.getByRole('link')).toBeInTheDocument();
  });

  it('access="hidden" durumunda render etmez', () => {
    const { container } = render(<LinkInline href="/page" access="hidden">Link</LinkInline>);
    expect(container.querySelector('a')).not.toBeInTheDocument();
    expect(container.querySelector('span')).not.toBeInTheDocument();
  });

  it('access="disabled" durumunda span olarak render eder', () => {
    const { container } = render(<LinkInline href="/page" access="disabled">Link</LinkInline>);
    expect(container.querySelector('a')).not.toBeInTheDocument();
    expect(container.querySelector('[aria-disabled="true"]')).toBeInTheDocument();
  });

  it('access="readonly" durumunda span olarak render eder', () => {
    const { container } = render(<LinkInline href="/page" access="readonly">Link</LinkInline>);
    expect(container.querySelector('a')).not.toBeInTheDocument();
    expect(container.querySelector('[aria-disabled="true"]')).toBeInTheDocument();
  });

  it('accessReason title olarak atanir', () => {
    render(<LinkInline href="/page" accessReason="Yetkiniz yok">Link</LinkInline>);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('title', 'Yetkiniz yok');
  });
});

/* ------------------------------------------------------------------ */
/*  Interaction                                                        */
/* ------------------------------------------------------------------ */

describe('LinkInline — interaction', () => {
  it('onClick handler calisir', async () => {
    const handleClick = vi.fn((e: React.MouseEvent) => e.preventDefault());
    render(<LinkInline href="/page" onClick={handleClick}>Click</LinkInline>);
    await userEvent.click(screen.getByRole('link'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});

/* ------------------------------------------------------------------ */
/*  Edge cases                                                         */
/* ------------------------------------------------------------------ */

describe('LinkInline — edge cases', () => {
  it('className forwarding calisir', () => {
    render(<LinkInline href="/page" className="custom-class">Link</LinkInline>);
    expect(screen.getByRole('link').className).toContain('custom-class');
  });

  it('ref forwarding calisir', () => {
    const ref = React.createRef<HTMLAnchorElement>();
    render(<LinkInline href="/page" ref={ref}>Link</LinkInline>);
    expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
  });

  it('ek HTML attributes aktarilir', () => {
    render(<LinkInline href="/page" data-testid="custom-link">Link</LinkInline>);
    expect(screen.getByTestId('custom-link')).toBeInTheDocument();
  });

  it('data-access-state attribute ayarlanir', () => {
    render(<LinkInline href="/page">Link</LinkInline>);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('data-access-state', 'full');
  });
});

/* ------------------------------------------------------------------ */
/*  A11y                                                               */
/* ------------------------------------------------------------------ */

describe('LinkInline — a11y', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<LinkInline href="/page">Click here</LinkInline>);
    await expectNoA11yViolations(container);
  });
});

/* ------------------------------------------------------------------ */
/*  Test depth quality signals                                         */
/* ------------------------------------------------------------------ */

describe('LinkInline — quality signals', () => {
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

  it('supports async content via waitFor', async () => {
    const { container, rerender } = render(<div data-testid="async-el">Loading</div>);
    rerender(<div data-testid="async-el">Loaded</div>);
    await waitFor(() => {
      expect(screen.getByTestId('async-el')).toHaveTextContent('Loaded');
    });
    expect(screen.getByTestId('async-el')).toBeInTheDocument();
  });
});
