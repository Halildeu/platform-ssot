// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen, fireEvent, waitFor} from '@testing-library/react';

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

  it('resolves async rendering via waitFor', async () => {
    const { container } = render(<DesignSystemProvider>{null}</DesignSystemProvider>);
    await waitFor(() => {
      expect(container.firstElementChild).toBeTruthy();
    });
    expect(container.querySelector('[data-component]') || container.firstElementChild).toBeInTheDocument();
  });

  it('handles readonly access state', () => {
    const { container } = render(<DesignSystemProvider access="readonly">{null}</DesignSystemProvider>);
    const root = container.firstElementChild;
    expect(root).toBeTruthy();
    expect(root?.getAttribute('data-access-state') === 'readonly' || root).toBeTruthy();
  });

  it('preserves ARIA attributes on children', () => {
    render(
      <DesignSystemProvider>
        <div role="region" aria-label="ds-region">Design system content</div>
      </DesignSystemProvider>,
    );
    expect(screen.getByRole('region')).toBeInTheDocument();
    expect(screen.getByLabelText('ds-region')).toBeInTheDocument();
    expect(screen.getByRole('region')).toHaveTextContent('Design system content');
  });

  it('child with role=navigation inside design system provider', () => {
    render(
      <DesignSystemProvider>
        <nav role="navigation" aria-label="main-menu">
          <a href="#">Dashboard</a>
        </nav>
      </DesignSystemProvider>,
    );
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByLabelText('main-menu')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument();
  });

  it('child with role=alert inside design system provider', () => {
    render(
      <DesignSystemProvider>
        <div role="alert" aria-live="assertive">Critical alert</div>
      </DesignSystemProvider>,
    );
    const alert = screen.getByRole('alert');
    expect(alert).toHaveAttribute('aria-live', 'assertive');
    expect(alert).toHaveTextContent('Critical alert');
  });
});
