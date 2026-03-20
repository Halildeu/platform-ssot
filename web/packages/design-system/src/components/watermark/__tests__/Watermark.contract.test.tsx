// @vitest-environment jsdom
import React from 'react';
import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { Watermark } from '../Watermark';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

// jsdom does not support canvas — stub getContext so generateWatermarkDataUrl doesn't throw.
beforeAll(() => {
  HTMLCanvasElement.prototype.getContext = (() => {
    return {
      font: '',
      fillStyle: '',
      textAlign: '',
      textBaseline: '',
      globalAlpha: 1,
      measureText: () => ({ width: 50 }),
      translate: () => {},
      rotate: () => {},
      fillText: () => {},
      drawImage: () => {},
    };
  }) as unknown as typeof HTMLCanvasElement.prototype.getContext;

  HTMLCanvasElement.prototype.toDataURL = () => 'data:image/png;base64,stub';
});

afterEach(() => cleanup());

describe('Watermark contract', () => {
  it('has displayName', () => {
    expect(Watermark.displayName).toBe('Watermark');
  });

  it('renders with children', () => {
    render(<Watermark content="Draft"><div>Page content</div></Watermark>);
    expect(screen.getByText('Page content')).toBeInTheDocument();
  });

  it('renders watermark overlay when content is provided', () => {
    render(<Watermark content="Confidential"><span>Body</span></Watermark>);
    expect(screen.getByTestId('watermark-overlay')).toBeInTheDocument();
  });

  it('does not render overlay when no content or image', () => {
    render(<Watermark><span>Body</span></Watermark>);
    expect(screen.queryByTestId('watermark-overlay')).not.toBeInTheDocument();
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Watermark ref={ref} content="Test"><span>Child</span></Watermark>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('merges custom className', () => {
    const { container } = render(<Watermark content="Draft" className="custom-watermark"><span>Body</span></Watermark>);
    expect(container.querySelector('.custom-watermark')).toBeInTheDocument();
  });

  it('sets aria-hidden on overlay', () => {
    render(<Watermark content="Secret"><span>Body</span></Watermark>);
    expect(screen.getByTestId('watermark-overlay')).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders root data-testid', () => {
    render(<Watermark content="Draft"><span>Body</span></Watermark>);
    expect(screen.getByTestId('watermark-root')).toBeInTheDocument();
  });
});

describe('Watermark — accessibility', () => {
  it('has no axe-core a11y violations', async () => {
    const { container } = render(<Watermark content="Draft"><div>Content</div></Watermark>);
    await expectNoA11yViolations(container);
  });
});
