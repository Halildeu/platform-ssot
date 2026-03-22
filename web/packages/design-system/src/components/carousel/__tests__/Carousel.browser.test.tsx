import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { Carousel } from '../Carousel';

const slides = [
  { key: 's1', content: <div>Slide 1</div> },
  { key: 's2', content: <div>Slide 2</div> },
  { key: 's3', content: <div>Slide 3</div> },
];

describe('Carousel (Browser)', () => {
  it('renders slides and dots', async () => {
    const screen = render(<Carousel items={slides} />);
    await expect.element(screen.getByText('Slide 1')).toBeVisible();
    const dots = screen.container.querySelectorAll('[role="tab"]');
    expect(dots).toHaveLength(3);
  });

  it('renders as carousel region', async () => {
    const screen = render(<Carousel items={slides} />);
    await expect.element(screen.getByRole('region')).toBeVisible();
  });
});
