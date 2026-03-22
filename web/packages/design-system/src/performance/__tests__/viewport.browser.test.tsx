import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import React from 'react';

// Simple lazy load component for viewport testing
const LazyBox = ({ id }: { id: string }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  return <div ref={ref} data-testid={id} style={{ height: 100 }}>Lazy Content</div>;
};

describe('Viewport Tests (Browser Mode)', () => {
  it('element in viewport is visible', async () => {
    const screen = render(<LazyBox id="visible-box" />);
    const el = screen.getByTestId('visible-box');
    await expect.element(el).toBeInViewport();
  });

  it('element below fold is not in viewport', async () => {
    const screen = render(
      <div>
        <div style={{ height: '200vh' }}>Spacer</div>
        <LazyBox id="below-fold" />
      </div>
    );
    const el = screen.getByTestId('below-fold');
    await expect.element(el).not.toBeInViewport();
  });
});
