// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Carousel } from '../Carousel';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => cleanup());

const slides = [
  { key: 's1', content: <div>Slide 1</div> },
  { key: 's2', content: <div>Slide 2</div> },
  { key: 's3', content: <div>Slide 3</div> },
];

describe('Carousel contract', () => {
  /* ---- Identity ---- */
  it('has displayName', () => {
    expect(Carousel.displayName).toBe('Carousel');
  });

  /* ---- Default render ---- */
  it('renders all slides', () => {
    render(<Carousel items={slides} />);
    expect(screen.getByText('Slide 1')).toBeInTheDocument();
    expect(screen.getByText('Slide 2')).toBeInTheDocument();
    expect(screen.getByText('Slide 3')).toBeInTheDocument();
  });

  it('has carousel role with aria-roledescription', () => {
    render(<Carousel items={slides} />);
    const region = screen.getByRole('region');
    expect(region).toHaveAttribute('aria-roledescription', 'carousel');
  });

  it('has default aria-label', () => {
    render(<Carousel items={slides} />);
    expect(screen.getByRole('region')).toHaveAttribute('aria-label', 'Slayt gosterisi');
  });

  /* ---- Navigation arrows ---- */
  it('renders prev and next arrow buttons', () => {
    render(<Carousel items={slides} />);
    expect(screen.getByLabelText('Onceki slayt')).toBeInTheDocument();
    expect(screen.getByLabelText('Sonraki slayt')).toBeInTheDocument();
  });

  /* ---- Callback: onSlideChange ---- */
  it('calls onSlideChange when next arrow is clicked', async () => {
    const handler = vi.fn();
    const user = userEvent.setup();
    render(<Carousel items={slides} onSlideChange={handler} />);
    await user.click(screen.getByLabelText('Sonraki slayt'));
    expect(handler).toHaveBeenCalledWith(1);
  });

  /* ---- Dots ---- */
  it('renders dot indicators by default', () => {
    render(<Carousel items={slides} />);
    const tablist = screen.getByRole('tablist');
    expect(tablist).toBeInTheDocument();
  });

  it('hides dots when showDots=false', () => {
    render(<Carousel items={slides} showDots={false} />);
    expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
  });

  /* ---- className merging ---- */
  it('merges className', () => {
    render(<Carousel items={slides} className="my-carousel" />);
    expect(screen.getByRole('region').className).toContain('my-carousel');
  });

  /* ---- Access hidden ---- */
  it('renders nothing when access=hidden', () => {
    const { container } = render(<Carousel items={slides} access="hidden" />);
    expect(container.innerHTML).toBe('');
  });
});

describe('Carousel — accessibility', () => {
  it('has no axe-core a11y violations', async () => {
    const { container } = render(<Carousel items={slides} />);
    await expectNoA11yViolations(container);
  });
});
