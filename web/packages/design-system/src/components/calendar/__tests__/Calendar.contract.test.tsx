// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { Calendar } from '../Calendar';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => cleanup());

describe('Calendar contract', () => {
  /* ---- Identity ---- */
  it('has displayName', () => {
    expect(Calendar.displayName).toBe('Calendar');
  });

  /* ---- Renders without crashing ---- */
  it('renders without crashing', () => {
    render(<Calendar defaultMonth={new Date(2025, 0, 1)} />);
    expect(screen.getByRole('group', { name: 'Calendar' })).toBeInTheDocument();
  });

  /* ---- Forwards ref ---- */
  it('forwards ref', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Calendar ref={ref} defaultMonth={new Date(2025, 0, 1)} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  /* ---- Custom className ---- */
  it('merges custom className', () => {
    const { container } = render(
      <Calendar className="custom-cal" defaultMonth={new Date(2025, 0, 1)} />,
    );
    expect(container.firstElementChild).toHaveClass('custom-cal');
  });

  /* ---- data-component attribute ---- */
  it('has data-component="calendar"', () => {
    const { container } = render(
      <Calendar defaultMonth={new Date(2025, 0, 1)} />,
    );
    expect(container.querySelector('[data-component="calendar"]')).toBeInTheDocument();
  });

  /* ---- Grid structure ---- */
  it('renders a grid with day cells', () => {
    render(<Calendar defaultMonth={new Date(2025, 0, 1)} />);
    expect(screen.getByRole('grid')).toBeInTheDocument();
    expect(screen.getAllByRole('gridcell').length).toBeGreaterThan(0);
  });

  /* ---- Navigation ---- */
  it('renders prev/next month buttons', () => {
    render(<Calendar defaultMonth={new Date(2025, 0, 1)} />);
    expect(screen.getByTestId('calendar-prev')).toBeInTheDocument();
    expect(screen.getByTestId('calendar-next')).toBeInTheDocument();
  });

  /* ---- Sizes ---- */
  it.each(['sm', 'md', 'lg'] as const)(
    'renders size=%s without crash',
    (size) => {
      render(<Calendar size={size} defaultMonth={new Date(2025, 0, 1)} />);
      expect(screen.getByRole('group')).toBeInTheDocument();
    },
  );

  /* ---- Access control: hidden ---- */
  it('returns null when access=hidden', () => {
    const { container } = render(
      <Calendar access="hidden" defaultMonth={new Date(2025, 0, 1)} />,
    );
    expect(container.firstElementChild).toBeNull();
  });
});

describe('Calendar — accessibility', () => {
  it('has no axe-core a11y violations', async () => {
    const { container } = render(
      <Calendar defaultMonth={new Date(2025, 0, 1)} />,
    );
    await expectNoA11yViolations(container);
  });
});
