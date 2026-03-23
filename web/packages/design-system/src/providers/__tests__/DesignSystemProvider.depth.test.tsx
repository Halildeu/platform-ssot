// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { DesignSystemProvider } from '../DesignSystemProvider';
import { useTheme } from '../ThemeProvider';
import { useLocale } from '../LocaleProvider';

afterEach(cleanup);

describe('DesignSystemProvider — depth', () => {
  it('renders children', () => {
    render(
      <DesignSystemProvider>
        <span role="status" data-testid="child">Hello</span>
      </DesignSystemProvider>,
    );
    expect(screen.getByRole('status')).toHaveTextContent('Hello');
  });

  it('provides theme context', () => {
    let axes: Record<string, unknown> | undefined;
    function Consumer() {
      const t = useTheme();
      axes = t.axes as unknown as Record<string, unknown>;
      return <span>ok</span>;
    }
    render(<DesignSystemProvider><Consumer /></DesignSystemProvider>);
    expect(axes).toHaveProperty('appearance');
  });

  it('empty children renders safely', () => {
    const { container } = render(<DesignSystemProvider>{null}</DesignSystemProvider>);
    expect(container).toBeInTheDocument();
  });

  it('disabled — passes custom locale fa with RTL', () => {
    let ctx: ReturnType<typeof useLocale> | undefined;
    function Consumer() { ctx = useLocale(); return <span>ok</span>; }
    render(<DesignSystemProvider locale="fa"><Consumer /></DesignSystemProvider>);
    expect(ctx!.locale).toBe('fa');
    expect(ctx!.direction).toBe('rtl');
  });

  it('error — explicit direction override', () => {
    let ctx: ReturnType<typeof useLocale> | undefined;
    function Consumer() { ctx = useLocale(); return <span>ok</span>; }
    render(<DesignSystemProvider locale="en" direction="rtl"><Consumer /></DesignSystemProvider>);
    expect(ctx!.direction).toBe('rtl');
  });

  it('click event propagates through provider', () => {
    const onClick = vi.fn();
    render(
      <DesignSystemProvider>
        <button onClick={onClick}>Action</button>
      </DesignSystemProvider>,
    );
    fireEvent.click(screen.getByRole('button', { name: /action/i }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('click via userEvent through provider', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <DesignSystemProvider>
        <button onClick={onClick}>UE Action</button>
      </DesignSystemProvider>,
    );
    await user.click(screen.getByText('UE Action'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
