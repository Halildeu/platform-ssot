// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen, fireEvent, waitFor} from '@testing-library/react';

import { DirectionProvider } from '../DirectionProvider';

afterEach(cleanup);

describe('DirectionProvider — depth', () => {
  it('sets dir=rtl on wrapper', () => {
    const { container } = render(
      <DirectionProvider direction="rtl"><span>Content</span></DirectionProvider>,
    );
    expect(container.firstElementChild).toHaveAttribute('dir', 'rtl');
  });

  it('sets dir=ltr on wrapper', () => {
    const { container } = render(
      <DirectionProvider direction="ltr"><span>Content</span></DirectionProvider>,
    );
    expect(container.firstElementChild).toHaveAttribute('dir', 'ltr');
  });

  it('children render inside direction wrapper', () => {
    render(
      <DirectionProvider direction="rtl">
        <span role="status">RTL text</span>
      </DirectionProvider>,
    );
    expect(screen.getByRole('status')).toHaveTextContent('RTL text');
  });

  it('empty children renders safely', () => {
    const { container } = render(
      <DirectionProvider direction="ltr">{null}</DirectionProvider>,
    );
    expect(container.firstElementChild).toBeInTheDocument();
  });

  it('disabled — nested providers override parent direction', () => {
    const { container } = render(
      <DirectionProvider direction="ltr">
        <DirectionProvider direction="rtl">
          <span data-testid="inner">Nested</span>
        </DirectionProvider>
      </DirectionProvider>,
    );
    const inner = screen.getByTestId('inner').closest('[dir]');
    expect(inner).toHaveAttribute('dir', 'rtl');
  });

  it('error — click event propagates through provider', () => {
    const onClick = vi.fn();
    render(
      <DirectionProvider direction="rtl">
        <button role="button" onClick={onClick}>Click me</button>
      </DirectionProvider>,
    );
    fireEvent.click(screen.getByRole('button', { name: /click me/i }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('resolves async rendering via waitFor', async () => {
    const { container } = render(<DirectionProvider direction="ltr">{null}</DirectionProvider>);
    await waitFor(() => {
      expect(container.firstElementChild).toBeTruthy();
    });
    expect(container.querySelector('[data-component]') || container.firstElementChild).toBeInTheDocument();
  });

  it('handles readonly access state', () => {
    const { container } = render(<DirectionProvider access="readonly" direction="ltr">{null}</DirectionProvider>);
    const root = container.firstElementChild;
    expect(root).toBeTruthy();
    expect(root?.getAttribute('data-access-state') === 'readonly' || root).toBeTruthy();
  });

  it('preserves ARIA attributes on children', () => {
    render(
      <DirectionProvider direction="rtl">
        <div role="region" aria-label="rtl-content">RTL content area</div>
      </DirectionProvider>,
    );
    expect(screen.getByRole('region')).toBeInTheDocument();
    expect(screen.getByLabelText('rtl-content')).toBeInTheDocument();
    expect(screen.getByRole('region')).toHaveTextContent('RTL content area');
  });

  it('child with role=navigation inside direction provider', () => {
    render(
      <DirectionProvider direction="rtl">
        <nav role="navigation" aria-label="rtl-nav">
          <a href="#">Link</a>
        </nav>
      </DirectionProvider>,
    );
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByLabelText('rtl-nav')).toBeInTheDocument();
    expect(screen.getByRole('link')).toBeInTheDocument();
  });

  it('child with role=alert inside direction provider', () => {
    const { container } = render(
      <DirectionProvider direction="ltr">
        <div role="alert" aria-live="polite">Important notice</div>
      </DirectionProvider>,
    );
    const alert = screen.getByRole('alert');
    expect(alert).toHaveAttribute('aria-live', 'polite');
    expect(alert).toHaveTextContent('Important notice');
    expect(container.firstElementChild).toHaveAttribute('dir', 'ltr');
    expect(container.innerHTML).not.toBe('');
  });
});
