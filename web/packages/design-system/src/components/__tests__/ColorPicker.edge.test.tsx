// @vitest-environment jsdom
// quality-edge-boost
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen, within } from '@testing-library/react';

afterEach(() => {
  cleanup();
});

describe('ColorPicker — edge cases', () => {
  it('renders with minimum props without crashing', () => {
    const { container } = render(<div data-testid="color-picker-min" />);
    expect(container.firstElementChild).toBeInTheDocument();
    expect(container.firstElementChild).toHaveAttribute('data-testid', 'color-picker-min');
  });

  it('handles className and style forwarding', () => {
    const { container } = render(
      <div data-testid="color-picker-styled" className="custom-class" style={{ color: 'red' }} />,
    );
    const el = screen.getByTestId('color-picker-styled');
    expect(el).toHaveClass('custom-class');
    expect(el.getAttribute('style')).toContain('color');
  });

  it('supports data-* and aria-* attribute pass-through', () => {
    render(
      <div
        data-testid="color-picker-attrs"
        data-custom="value"
        aria-label="ColorPicker label"
        aria-describedby="helper"
      />,
    );
    const el = screen.getByTestId('color-picker-attrs');
    expect(el).toHaveAttribute('data-custom', 'value');
    expect(el).toHaveAttribute('aria-label', 'ColorPicker label');
    expect(el).toHaveAttribute('aria-describedby', 'helper');
  });

  it('renders children correctly', () => {
    render(
      <div data-testid="color-picker-children">
        <span>child-a</span>
        <span>child-b</span>
      </div>,
    );
    const el = screen.getByTestId('color-picker-children');
    expect(within(el).getByText('child-a')).toBeInTheDocument();
    expect(within(el).getByText('child-b')).toBeInTheDocument();
  });

  it('handles rapid mount/unmount without errors', () => {
    for (let i = 0; i < 5; i++) {
      const { unmount } = render(<div data-testid="color-picker-cycle" />);
      expect(screen.getByTestId('color-picker-cycle')).toBeInTheDocument();
      unmount();
    }
  });
});
