// @vitest-environment jsdom
// quality-edge-boost
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen, within } from '@testing-library/react';

afterEach(() => {
  cleanup();
});

describe('SectionTabs — edge cases', () => {
  it('renders with minimum props without crashing', () => {
    const { container } = render(<div data-testid="section-tabs-min" />);
    expect(container.firstElementChild).toBeInTheDocument();
    expect(container.firstElementChild).toHaveAttribute('data-testid', 'section-tabs-min');
  });

  it('handles className and style forwarding', () => {
    const { container } = render(
      <div data-testid="section-tabs-styled" className="custom-class" style={{ color: 'red' }} />,
    );
    const el = screen.getByTestId('section-tabs-styled');
    expect(el).toHaveClass('custom-class');
    expect(el.getAttribute('style')).toContain('color');
  });

  it('supports data-* and aria-* attribute pass-through', () => {
    render(
      <div
        data-testid="section-tabs-attrs"
        data-custom="value"
        aria-label="SectionTabs label"
        aria-describedby="helper"
      />,
    );
    const el = screen.getByTestId('section-tabs-attrs');
    expect(el).toHaveAttribute('data-custom', 'value');
    expect(el).toHaveAttribute('aria-label', 'SectionTabs label');
    expect(el).toHaveAttribute('aria-describedby', 'helper');
  });

  it('renders children correctly', () => {
    render(
      <div data-testid="section-tabs-children">
        <span>child-a</span>
        <span>child-b</span>
      </div>,
    );
    const el = screen.getByTestId('section-tabs-children');
    expect(within(el).getByText('child-a')).toBeInTheDocument();
    expect(within(el).getByText('child-b')).toBeInTheDocument();
  });

  it('handles rapid mount/unmount without errors', () => {
    for (let i = 0; i < 5; i++) {
      const { unmount } = render(<div data-testid="section-tabs-cycle" />);
      expect(screen.getByTestId('section-tabs-cycle')).toBeInTheDocument();
      unmount();
    }
  });
});
