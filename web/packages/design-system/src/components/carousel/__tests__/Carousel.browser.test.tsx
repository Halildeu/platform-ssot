import { describe, it, expect, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { Carousel } from '../Carousel';

const slides = [
  { key: 's1', content: <div>Slide 1</div> },
  { key: 's2', content: <div>Slide 2</div> },
  { key: 's3', content: <div>Slide 3</div> },
];

describe('Carousel (Browser)', () => {
  it('renders first slide and dot indicators', async () => {
    const screen = await render(<Carousel items={slides} />);
    await expect.element(screen.getByText('Slide 1')).toBeVisible();
    const dots = document.querySelectorAll('[role="tab"]');
    expect(dots).toHaveLength(3);
  });

  it('renders as carousel region with aria-label', async () => {
    const screen = await render(<Carousel items={slides} />);
    const region = screen.getByRole('region');
    await expect.element(region).toBeVisible();
  });

  it('navigates to next slide on arrow click', async () => {
    const onSlideChange = vi.fn();
    const screen = await render(<Carousel items={slides} onSlideChange={onSlideChange} />);
    const nextBtn = screen.getByLabelText('Sonraki slayt');
    await nextBtn.click();
    expect(onSlideChange).toHaveBeenCalledWith(1);
  });

  it('navigates to previous slide on arrow click', async () => {
    const onSlideChange = vi.fn();
    const screen = await render(<Carousel items={slides} onSlideChange={onSlideChange} />);
    // Go to slide 2 first
    await screen.getByLabelText('Sonraki slayt').click();
    await screen.getByLabelText('Onceki slayt').click();
    expect(onSlideChange).toHaveBeenLastCalledWith(0);
  });

  it('navigates via dot click', async () => {
    const onSlideChange = vi.fn();
    await render(<Carousel items={slides} onSlideChange={onSlideChange} />);
    const dots = document.querySelectorAll('[role="tab"]');
    (dots[2] as HTMLElement).click();
    expect(onSlideChange).toHaveBeenCalledWith(2);
  });

  it('marks active dot with aria-selected', async () => {
    await render(<Carousel items={slides} />);
    const dots = document.querySelectorAll('[role="tab"]');
    expect(dots[0]?.getAttribute('aria-selected')).toBe('true');
  });

  it('hides arrows when showArrows is false', async () => {
    await render(<Carousel items={slides} showArrows={false} />);
    expect(document.querySelector('[aria-label="Sonraki slayt"]')).toBeNull();
    expect(document.querySelector('[aria-label="Onceki slayt"]')).toBeNull();
  });

  it('hides dots when showDots is false', async () => {
    await render(<Carousel items={slides} showDots={false} />);
    const dots = document.querySelectorAll('[role="tab"]');
    expect(dots).toHaveLength(0);
  });
});
