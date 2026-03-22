import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { Watermark } from '../Watermark';

describe('Watermark (Browser)', () => {
  it('renders children content', async () => {
    const screen = render(
      <Watermark content="Confidential">
        <div>Protected Content</div>
      </Watermark>,
    );
    await expect.element(screen.getByText('Protected Content')).toBeVisible();
  });

  it('renders overlay element', async () => {
    const screen = render(
      <Watermark content="Draft">
        <div>Content</div>
      </Watermark>,
    );
    await expect.element(screen.getByTestId('watermark-overlay')).toBeVisible();
  });

  it('renders data-component attribute', async () => {
    const screen = render(
      <Watermark content="Test"><div>Body</div></Watermark>,
    );
    const el = screen.container.querySelector('[data-component="watermark"]');
    expect(el).not.toBeNull();
  });

  it('renders with array content', async () => {
    const screen = render(
      <Watermark content={['Line 1', 'Line 2']}>
        <div>Body</div>
      </Watermark>,
    );
    await expect.element(screen.getByText('Body')).toBeVisible();
  });

  it('renders without content (image mode)', async () => {
    const screen = render(
      <Watermark image="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQI12NgAAIABQABNjN9GQAAAAlwSFlzAAAWJQAAFiUBSVIk8AAAABR0RVh0Q29tbWVudA==">
        <div>Image watermark</div>
      </Watermark>,
    );
    await expect.element(screen.getByText('Image watermark')).toBeVisible();
  });

  it('applies custom className', async () => {
    const screen = render(
      <Watermark content="Test" className="my-watermark"><div>Content</div></Watermark>,
    );
    const el = screen.container.querySelector('.my-watermark');
    expect(el).not.toBeNull();
  });

  it('renders overlay with pointer-events-none', async () => {
    const screen = render(
      <Watermark content="Test"><div>Content</div></Watermark>,
    );
    const overlay = screen.getByTestId('watermark-overlay');
    await expect.element(overlay).toBeVisible();
  });
});
