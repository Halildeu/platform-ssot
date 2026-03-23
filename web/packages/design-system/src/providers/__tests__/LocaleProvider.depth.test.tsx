// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

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

  it('click via userEvent through provider', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <LocaleProvider>
        <button onClick={onClick}>UE Action</button>
      </LocaleProvider>,
    );
    await user.click(screen.getByText('UE Action'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
