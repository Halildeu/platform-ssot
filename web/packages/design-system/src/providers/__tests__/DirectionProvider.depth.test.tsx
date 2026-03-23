// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen, fireEvent } from '@testing-library/react';

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
    render(
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
});
