// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { Timeline, type TimelineItemProps } from '../Timeline';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => cleanup());

const makeItems = (): TimelineItemProps[] => [
  { key: '1', children: 'Event one' },
  { key: '2', children: 'Event two' },
  { key: '3', children: 'Event three' },
];

describe('Timeline contract', () => {
  /* ---- Identity ---- */
  it('has displayName', () => {
    expect(Timeline.displayName).toBe('Timeline');
  });

  /* ---- Renders without crashing ---- */
  it('renders without crashing', () => {
    render(<Timeline items={makeItems()} />);
    expect(screen.getByRole('list', { name: 'Timeline' })).toBeInTheDocument();
  });

  /* ---- Custom className ---- */
  it('merges custom className', () => {
    const { container } = render(
      <Timeline items={makeItems()} className="custom-timeline" />,
    );
    expect(container.firstElementChild).toHaveClass('custom-timeline');
  });

  /* ---- data-component attribute ---- */
  it('has data-component="timeline"', () => {
    const { container } = render(<Timeline items={makeItems()} />);
    expect(container.querySelector('[data-component="timeline"]')).toBeInTheDocument();
  });

  /* ---- ARIA structure ---- */
  it('renders items as listitems', () => {
    render(<Timeline items={makeItems()} />);
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
  });

  /* ---- Renders all item content ---- */
  it('renders all item content', () => {
    render(<Timeline items={makeItems()} />);
    expect(screen.getByText('Event one')).toBeInTheDocument();
    expect(screen.getByText('Event two')).toBeInTheDocument();
    expect(screen.getByText('Event three')).toBeInTheDocument();
  });

  /* ---- Modes ---- */
  it.each(['left', 'right', 'alternate'] as const)(
    'renders mode=%s without crash',
    (mode) => {
      render(<Timeline items={makeItems()} mode={mode} />);
      expect(screen.getByRole('list')).toBeInTheDocument();
    },
  );

  /* ---- Pending item ---- */
  it('renders pending item at the end', () => {
    render(<Timeline items={makeItems()} pending="Loading more..." />);
    expect(screen.getByText('Loading more...')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(4);
  });

  /* ---- Access control: hidden ---- */
  it('returns null when access=hidden', () => {
    const { container } = render(
      <Timeline items={makeItems()} access="hidden" />,
    );
    expect(container.firstElementChild).toBeNull();
  });
});

describe('Timeline — accessibility', () => {
  it('has no axe-core a11y violations', async () => {
    const { container } = render(<Timeline items={makeItems()} />);
    await expectNoA11yViolations(container);
  });
});
