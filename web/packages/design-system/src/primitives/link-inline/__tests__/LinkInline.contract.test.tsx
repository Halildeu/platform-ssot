// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, within } from '@testing-library/react';
import { LinkInline } from '../LinkInline';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => cleanup());

describe('LinkInline contract', () => {
  /* ---- Identity ---- */
  it('has displayName', () => {
    expect(LinkInline.displayName).toBe('LinkInline');
  });

  /* ---- Renders without crashing ---- */
  it('renders as anchor when href is provided', () => {
    const { container } = render(<LinkInline href="/page">Link</LinkInline>);
    expect(container.querySelector('a')).toBeInTheDocument();
  });

  /* ---- Forwards ref ---- */
  it('forwards ref to <a>', () => {
    const ref = React.createRef<HTMLAnchorElement>();
    render(<LinkInline ref={ref} href="/page">Link</LinkInline>);
    expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
  });

  /* ---- data-component attribute ---- */
  it('has data-component="link-inline"', () => {
    const { container } = render(<LinkInline href="/page">Link</LinkInline>);
    expect(container.querySelector('[data-component="link-inline"]')).toBeInTheDocument();
  });

  /* ---- Custom className ---- */
  it('merges custom className', () => {
    const { container } = render(<LinkInline href="/page" className="custom-link">Link</LinkInline>);
    expect(container.querySelector('a')).toHaveClass('custom-link');
  });

  /* ---- Tones ---- */
  it.each(['primary', 'secondary'] as const)(
    'renders tone=%s without crash',
    (tone) => {
      const { container } = render(<LinkInline href="/page" tone={tone}>Link</LinkInline>);
      expect(container.querySelector('a')).toBeInTheDocument();
    },
  );

  /* ---- Underline modes ---- */
  it.each(['always', 'hover', 'none'] as const)(
    'renders underline=%s without crash',
    (underline) => {
      const { container } = render(<LinkInline href="/page" underline={underline}>Link</LinkInline>);
      expect(container.querySelector('a')).toBeInTheDocument();
    },
  );

  /* ---- External link ---- */
  it('adds target=_blank and rel for external links', () => {
    const { container } = render(<LinkInline href="https://example.com">External</LinkInline>);
    const anchor = container.querySelector('a');
    expect(anchor).toHaveAttribute('target', '_blank');
    expect(anchor).toHaveAttribute('rel', 'noopener noreferrer');
  });

  /* ---- External link indicator ---- */
  it('renders external link indicator arrow', () => {
    const { container } = render(<LinkInline href="https://example.com">External</LinkInline>);
    expect(container.textContent).toContain('\u2197');
  });

  /* ---- External screen reader label ---- */
  it('renders screen reader label for external links', () => {
    const { container } = render(<LinkInline href="https://example.com">External</LinkInline>);
    const srOnly = container.querySelector('.sr-only');
    expect(srOnly).toHaveTextContent('External link');
  });

  /* ---- Current page ---- */
  it('sets aria-current="page" when current=true', () => {
    const { container } = render(<LinkInline href="/page" current>Current</LinkInline>);
    expect(container.querySelector('a')).toHaveAttribute('aria-current', 'page');
  });

  /* ---- Disabled state ---- */
  it('renders as span with aria-disabled when disabled', () => {
    const { container } = render(<LinkInline href="/page" disabled>Disabled</LinkInline>);
    expect(container.querySelector('a')).not.toBeInTheDocument();
    const span = container.querySelector('span');
    expect(span).toBeInTheDocument();
    expect(span).toHaveAttribute('aria-disabled', 'true');
  });

  /* ---- No href renders as span ---- */
  it('renders as span when no href is provided', () => {
    const { container } = render(<LinkInline>No href</LinkInline>);
    expect(container.querySelector('a')).not.toBeInTheDocument();
    expect(container.querySelector('span')).toBeInTheDocument();
  });

  /* ---- access=hidden renders nothing ---- */
  it('renders nothing when access="hidden"', () => {
    const { container } = render(<LinkInline href="/page" access="hidden">Hidden</LinkInline>);
    expect(container.innerHTML).toBe('');
  });

  /* ---- Leading visual ---- */
  it('renders leadingVisual', () => {
    const visual = <span data-testid="lead-icon">*</span>;
    const { container } = render(<LinkInline href="/page" leadingVisual={visual}>Link</LinkInline>);
    expect(container.querySelector('[data-testid="lead-icon"]')).toBeInTheDocument();
  });

  /* ---- Trailing visual ---- */
  it('renders trailingVisual', () => {
    const visual = <span data-testid="trail-icon">!</span>;
    const { container } = render(<LinkInline href="/page" trailingVisual={visual}>Link</LinkInline>);
    expect(container.querySelector('[data-testid="trail-icon"]')).toBeInTheDocument();
  });

  /* ---- Props propagation ---- */
  it('passes through HTML attributes', () => {
    const { container } = render(<LinkInline href="/page" data-testid="my-link">Link</LinkInline>);
    expect(container.querySelector('[data-testid="my-link"]')).toBeInTheDocument();
  });
});

describe('LinkInline — accessibility', () => {
  it('has no axe-core a11y violations', async () => {
    const { container } = render(<LinkInline href="/page">Accessible link</LinkInline>);
    await expectNoA11yViolations(container);
  });
});
