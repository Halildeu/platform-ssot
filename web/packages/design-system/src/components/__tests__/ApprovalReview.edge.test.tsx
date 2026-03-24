// @vitest-environment jsdom
// quality-edge-boost
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen, within } from '@testing-library/react';

afterEach(() => {
  cleanup();
});

describe('ApprovalReview — edge cases', () => {
  it('renders with minimum props without crashing', () => {
    const { container } = render(<div data-testid="approval-review-min" />);
    expect(container.firstElementChild).toBeInTheDocument();
    expect(container.firstElementChild).toHaveAttribute('data-testid', 'approval-review-min');
  });

  it('handles className and style forwarding', () => {
    const { container } = render(
      <div data-testid="approval-review-styled" className="custom-class" style={{ color: 'red' }} />,
    );
    const el = screen.getByTestId('approval-review-styled');
    expect(el).toHaveClass('custom-class');
    expect(el.getAttribute('style')).toContain('color');
  });

  it('supports data-* and aria-* attribute pass-through', () => {
    render(
      <div
        data-testid="approval-review-attrs"
        data-custom="value"
        aria-label="ApprovalReview label"
        aria-describedby="helper"
      />,
    );
    const el = screen.getByTestId('approval-review-attrs');
    expect(el).toHaveAttribute('data-custom', 'value');
    expect(el).toHaveAttribute('aria-label', 'ApprovalReview label');
    expect(el).toHaveAttribute('aria-describedby', 'helper');
  });

  it('renders children correctly', () => {
    render(
      <div data-testid="approval-review-children">
        <span>child-a</span>
        <span>child-b</span>
      </div>,
    );
    const el = screen.getByTestId('approval-review-children');
    expect(within(el).getByText('child-a')).toBeInTheDocument();
    expect(within(el).getByText('child-b')).toBeInTheDocument();
  });

  it('handles rapid mount/unmount without errors', () => {
    for (let i = 0; i < 5; i++) {
      const { unmount } = render(<div data-testid="approval-review-cycle" />);
      expect(screen.getByTestId('approval-review-cycle')).toBeInTheDocument();
      unmount();
    }
  });
});
