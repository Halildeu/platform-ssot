import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import React from 'react';

const LazyBox = ({ id, height = 100 }: { id: string; height?: number }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  return <div ref={ref} data-testid={id} style={{ height }}>Lazy Content</div>;
};

describe('Viewport Tests (Browser Mode)', () => {
  it('element in viewport is visible', async () => {
    const screen = await render(<LazyBox id="visible-box" />);
    const el = screen.getByTestId('visible-box');
    await expect.element(el).toBeInViewport();
  });

  it('element below fold is not in viewport', async () => {
    const screen = await render(
      <div>
        <div style={{ height: '200vh' }}>Spacer</div>
        <LazyBox id="below-fold" />
      </div>,
    );
    const el = screen.getByTestId('below-fold');
    await expect.element(el).not.toBeInViewport();
  });

  it('multiple elements at top are all in viewport', async () => {
    const screen = await render(
      <div>
        <LazyBox id="box-1" height={50} />
        <LazyBox id="box-2" height={50} />
        <LazyBox id="box-3" height={50} />
      </div>,
    );
    await expect.element(screen.getByTestId('box-1')).toBeInViewport();
    await expect.element(screen.getByTestId('box-2')).toBeInViewport();
    await expect.element(screen.getByTestId('box-3')).toBeInViewport();
  });

  it('zero-height element is still in document', async () => {
    const screen = await render(<div data-testid="zero-height" style={{ height: 0 }}>Hidden</div>);
    await expect.element(screen.getByTestId('zero-height')).toBeInTheDocument();
  });

  it('hidden element is not visible', async () => {
    const screen = await render(
      <div data-testid="hidden-el" style={{ display: 'none' }}>Hidden content</div>,
    );
    const el = screen.getByTestId('hidden-el');
    await expect.element(el).not.toBeVisible();
  });

  it('element with overflow hidden clips children', async () => {
    const screen = await render(
      <div style={{ height: 50, overflow: 'hidden' }} data-testid="clip-container">
        <div style={{ height: 200 }}>Tall content</div>
      </div>,
    );
    await expect.element(screen.getByTestId('clip-container')).toBeInViewport();
  });

  it('element at bottom of long page is out of viewport', async () => {
    const screen = await render(
      <div>
        <div style={{ height: '300vh' }}>Long spacer</div>
        <LazyBox id="far-below" />
      </div>,
    );
    await expect.element(screen.getByTestId('far-below')).not.toBeInViewport();
  });
});
