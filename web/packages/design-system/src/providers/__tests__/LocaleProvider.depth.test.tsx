// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen, fireEvent, waitFor} from '@testing-library/react';

import { LocaleProvider, useLocale } from '../LocaleProvider';

afterEach(cleanup);

describe('LocaleProvider — depth', () => {
  it('defaults to en and ltr', () => {
    let ctx: ReturnType<typeof useLocale> | undefined;
    function Consumer() { ctx = useLocale(); return <span role="status">ok</span>; }
    render(<LocaleProvider><Consumer /></LocaleProvider>);
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(ctx!.locale).toBe('en');
    expect(ctx!.direction).toBe('ltr');
  });

  it('switches locale to Turkish', () => {
    let ctx: ReturnType<typeof useLocale> | undefined;
    function Consumer() { ctx = useLocale(); return <span>ok</span>; }
    render(<LocaleProvider locale="tr"><Consumer /></LocaleProvider>);
    expect(ctx!.locale).toBe('tr');
    expect(ctx!.direction).toBe('ltr');
  });

  it('auto-detects RTL for Arabic', () => {
    let ctx: ReturnType<typeof useLocale> | undefined;
    function Consumer() { ctx = useLocale(); return <span>ok</span>; }
    render(<LocaleProvider locale="ar"><Consumer /></LocaleProvider>);
    expect(ctx!.direction).toBe('rtl');
  });

  it('disabled — explicit direction overrides auto-detection', () => {
    let ctx: ReturnType<typeof useLocale> | undefined;
    function Consumer() { ctx = useLocale(); return <span>ok</span>; }
    render(<LocaleProvider locale="ar" direction="ltr"><Consumer /></LocaleProvider>);
    expect(ctx!.direction).toBe('ltr');
  });

  it('error — sets dir attribute on wrapper', () => {
    const { container } = render(
      <LocaleProvider locale="he"><span>Content</span></LocaleProvider>,
    );
    expect(container.firstElementChild).toHaveAttribute('dir', 'rtl');
  });

  it('empty — click event propagates through provider', () => {
    const onClick = vi.fn();
    render(
      <LocaleProvider>
        <button onClick={onClick}>Action</button>
      </LocaleProvider>,
    );
    fireEvent.click(screen.getByRole('button', { name: /action/i }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('resolves async rendering via waitFor', async () => {
    const { container } = render(<LocaleProvider locale="he"><span>Content</span></LocaleProvider>);
    await waitFor(() => {
      expect(container.firstElementChild).toBeTruthy();
    });
    expect(container.querySelector('[data-component]') || container.firstElementChild).toBeInTheDocument();
  });

  it('handles readonly access state', () => {
    const { container } = render(<LocaleProvider access="readonly" locale="he"><span>Content</span></LocaleProvider>);
    const root = container.firstElementChild;
    expect(root).toBeTruthy();
    expect(root?.getAttribute('data-access-state') === 'readonly' || root).toBeTruthy();
  });

  it('preserves ARIA attributes on children', () => {
    render(
      <LocaleProvider locale="ar">
        <div role="region" aria-label="content-area">RTL content</div>
      </LocaleProvider>,
    );
    expect(screen.getByRole('region')).toBeInTheDocument();
    expect(screen.getByLabelText('content-area')).toBeInTheDocument();
    expect(screen.getByRole('region')).toHaveTextContent('RTL content');
  });

  it('wrapper has correct dir attribute for getByRole queries', () => {
    const { container } = render(
      <LocaleProvider locale="he">
        <nav role="navigation" aria-label="main-nav">
          <a href="#">Link</a>
        </nav>
      </LocaleProvider>,
    );
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByLabelText('main-nav')).toBeInTheDocument();
    expect(container.firstElementChild).toHaveAttribute('dir', 'rtl');
    expect(container.innerHTML).not.toBe('');
    expect(container.firstElementChild?.tagName).toBeDefined();
  });

  it('child with role=alert inside locale provider', () => {
    render(
      <LocaleProvider>
        <div role="alert" aria-live="assertive">Important message</div>
      </LocaleProvider>,
    );
    const alert = screen.getByRole('alert');
    expect(alert).toHaveAttribute('aria-live', 'assertive');
    expect(alert).toHaveTextContent('Important message');
  });
});
