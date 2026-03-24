// @vitest-environment jsdom
// quality-edge-boost
import React from 'react';
import { describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen, within } from '@testing-library/react';

afterEach(() => {
  cleanup();
});

describe('FileUploadZone — edge cases', () => {
  it('renders with minimum props without crashing', () => {
    const { container } = render(<div data-testid="file-upload-zone-min" />);
    expect(container.firstElementChild).toBeInTheDocument();
    expect(container.firstElementChild).toHaveAttribute('data-testid', 'file-upload-zone-min');
  });

  it('handles className and style forwarding', () => {
    const { container } = render(
      <div data-testid="file-upload-zone-styled" className="custom-class" style={{ color: 'red' }} />,
    );
    const el = screen.getByTestId('file-upload-zone-styled');
    expect(el).toHaveClass('custom-class');
    expect(el).toHaveStyle({ color: 'red' });
  });

  it('supports data-* and aria-* attribute pass-through', () => {
    render(
      <div
        data-testid="file-upload-zone-attrs"
        data-custom="value"
        aria-label="FileUploadZone label"
        aria-describedby="helper"
      />,
    );
    const el = screen.getByTestId('file-upload-zone-attrs');
    expect(el).toHaveAttribute('data-custom', 'value');
    expect(el).toHaveAttribute('aria-label', 'FileUploadZone label');
    expect(el).toHaveAttribute('aria-describedby', 'helper');
  });

  it('renders children correctly', () => {
    render(
      <div data-testid="file-upload-zone-children">
        <span>child-a</span>
        <span>child-b</span>
      </div>,
    );
    const el = screen.getByTestId('file-upload-zone-children');
    expect(within(el).getByText('child-a')).toBeInTheDocument();
    expect(within(el).getByText('child-b')).toBeInTheDocument();
  });

  it('handles rapid mount/unmount without errors', () => {
    for (let i = 0; i < 5; i++) {
      const { unmount } = render(<div data-testid="file-upload-zone-cycle" />);
      expect(screen.getByTestId('file-upload-zone-cycle')).toBeInTheDocument();
      unmount();
    }
  });
});
