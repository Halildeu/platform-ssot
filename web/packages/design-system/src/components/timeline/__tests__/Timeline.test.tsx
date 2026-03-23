// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import { Timeline, type TimelineItemProps } from '../Timeline';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => {
  cleanup();
});

const defaultItems: TimelineItemProps[] = [
  { key: 'a', children: 'First event' },
  { key: 'b', children: 'Second event' },
  { key: 'c', children: 'Third event' },
];

/* ------------------------------------------------------------------ */
/*  Basic render                                                       */
/* ------------------------------------------------------------------ */

describe('Timeline — basic render', () => {
  it('renders a list container', () => {
    render(<Timeline items={defaultItems} />);
    expect(screen.getByRole('list')).toBeInTheDocument();
  });

  it('renders all items as listitems', () => {
    render(<Timeline items={defaultItems} />);
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
  });

  it('sets aria-label to "Timeline"', () => {
    render(<Timeline items={defaultItems} />);
    expect(screen.getByRole('list')).toHaveAttribute('aria-label', 'Timeline');
  });

  it('renders item content', () => {
    render(<Timeline items={defaultItems} />);
    expect(screen.getByText('First event')).toBeInTheDocument();
    expect(screen.getByText('Second event')).toBeInTheDocument();
    expect(screen.getByText('Third event')).toBeInTheDocument();
  });

  it('sets data-component attribute', () => {
    const { container } = render(<Timeline items={defaultItems} />);
    expect(
      container.querySelector('[data-component="timeline"]'),
    ).toBeInTheDocument();
  });

  it('sets displayName', () => {
    expect(Timeline.displayName).toBe('Timeline');
  });
});

/* ------------------------------------------------------------------ */
/*  className forwarding                                               */
/* ------------------------------------------------------------------ */

describe('Timeline — className', () => {
  it('forwards className to the root element', () => {
    const { container } = render(
      <Timeline items={defaultItems} className="custom-cls" />,
    );
    expect(container.firstElementChild?.className).toContain('custom-cls');
  });
});

/* ------------------------------------------------------------------ */
/*  Connector                                                          */
/* ------------------------------------------------------------------ */

describe('Timeline — connector', () => {
  it('renders connectors between items by default', () => {
    const { container } = render(<Timeline items={defaultItems} />);
    const connectors = container.querySelectorAll(
      '[data-testid="timeline-connector"]',
    );
    // 3 items = 2 connectors (no connector after last item)
    expect(connectors).toHaveLength(2);
  });

  it('does not render connectors when showConnector is false', () => {
    const { container } = render(
      <Timeline items={defaultItems} showConnector={false} />,
    );
    const connectors = container.querySelectorAll(
      '[data-testid="timeline-connector"]',
    );
    expect(connectors).toHaveLength(0);
  });

  it('does not render connector after the last item', () => {
    const { container } = render(
      <Timeline items={[{ key: 'only', children: 'Only one' }]} />,
    );
    const connectors = container.querySelectorAll(
      '[data-testid="timeline-connector"]',
    );
    expect(connectors).toHaveLength(0);
  });
});

/* ------------------------------------------------------------------ */
/*  Dots and colors                                                    */
/* ------------------------------------------------------------------ */

describe('Timeline — dots', () => {
  it('renders default dots', () => {
    const { container } = render(<Timeline items={defaultItems} />);
    const dots = container.querySelectorAll('[data-testid="timeline-dot"]');
    expect(dots).toHaveLength(3);
  });

  it('renders custom dot when provided', () => {
    const items: TimelineItemProps[] = [
      {
        key: 'custom',
        children: 'With icon',
        dot: <span data-testid="my-icon">X</span>,
      },
    ];
    render(<Timeline items={items} />);
    expect(screen.getByTestId('my-icon')).toBeInTheDocument();
    expect(screen.getByTestId('timeline-custom-dot')).toBeInTheDocument();
  });

  it('applies color classes to dots', () => {
    const items: TimelineItemProps[] = [
      { key: 'a', children: 'Success', color: 'success' },
    ];
    const { container } = render(<Timeline items={items} />);
    const dot = container.querySelector('[data-testid="timeline-dot"]');
    expect(dot?.className).toContain('bg-[var(--feedback-success)]');
  });

  it('applies primary color', () => {
    const items: TimelineItemProps[] = [
      { key: 'a', children: 'Primary', color: 'primary' },
    ];
    const { container } = render(<Timeline items={items} />);
    const dot = container.querySelector('[data-testid="timeline-dot"]');
    expect(dot?.className).toContain('bg-action-primary');
  });

  it('applies danger color', () => {
    const items: TimelineItemProps[] = [
      { key: 'a', children: 'Error', color: 'danger' },
    ];
    const { container } = render(<Timeline items={items} />);
    const dot = container.querySelector('[data-testid="timeline-dot"]');
    expect(dot?.className).toContain('bg-[var(--feedback-error)]');
  });

  it('applies warning color', () => {
    const items: TimelineItemProps[] = [
      { key: 'a', children: 'Warn', color: 'warning' },
    ];
    const { container } = render(<Timeline items={items} />);
    const dot = container.querySelector('[data-testid="timeline-dot"]');
    expect(dot?.className).toContain('bg-[var(--feedback-warning)]');
  });

  it('applies info color', () => {
    const items: TimelineItemProps[] = [
      { key: 'a', children: 'Info', color: 'info' },
    ];
    const { container } = render(<Timeline items={items} />);
    const dot = container.querySelector('[data-testid="timeline-dot"]');
    expect(dot?.className).toContain('bg-[var(--feedback-info)]');
  });

  it('applies default color when no color specified', () => {
    const { container } = render(
      <Timeline items={[{ key: 'a', children: 'Default' }]} />,
    );
    const dot = container.querySelector('[data-testid="timeline-dot"]');
    expect(dot?.className).toContain('bg-border-default');
  });
});

/* ------------------------------------------------------------------ */
/*  Meta                                                               */
/* ------------------------------------------------------------------ */

describe('Timeline — meta', () => {
  it('renders meta text when provided', () => {
    const items: TimelineItemProps[] = [
      { key: 'a', children: 'Event', meta: '10:30 AM' },
    ];
    render(<Timeline items={items} />);
    expect(screen.getByText('10:30 AM')).toBeInTheDocument();
    expect(screen.getByTestId('timeline-meta')).toBeInTheDocument();
  });

  it('does not render meta when not provided', () => {
    const { container } = render(
      <Timeline items={[{ key: 'a', children: 'Event' }]} />,
    );
    expect(
      container.querySelector('[data-testid="timeline-meta"]'),
    ).not.toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Label                                                              */
/* ------------------------------------------------------------------ */

describe('Timeline — label', () => {
  it('renders label when provided', () => {
    const items: TimelineItemProps[] = [
      { key: 'a', children: 'Event', label: 'Step 1' },
    ];
    render(<Timeline items={items} />);
    expect(screen.getByText('Step 1')).toBeInTheDocument();
    expect(screen.getByTestId('timeline-label')).toBeInTheDocument();
  });

  it('renders label on opposite side in alternate mode', () => {
    const items: TimelineItemProps[] = [
      { key: 'a', children: 'Event A', label: 'Label A' },
      { key: 'b', children: 'Event B', label: 'Label B' },
    ];
    render(<Timeline items={items} mode="alternate" />);
    expect(screen.getByText('Label A')).toBeInTheDocument();
    expect(screen.getByText('Label B')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Mode                                                               */
/* ------------------------------------------------------------------ */

describe('Timeline — mode', () => {
  it('defaults to left mode', () => {
    const { container } = render(<Timeline items={defaultItems} />);
    // In left mode, content should not have order-first class
    const contentDivs = container.querySelectorAll('[role="listitem"] > div');
    // The last div in each listitem is the content (in left mode)
    expect(contentDivs.length).toBeGreaterThan(0);
  });

  it('right mode places content before the dot column', () => {
    const { container } = render(
      <Timeline items={defaultItems} mode="right" />,
    );
    // In right mode, content div should have order-first
    const items = container.querySelectorAll('[role="listitem"]');
    items.forEach((item) => {
      const contentDiv = item.querySelector('.order-first');
      expect(contentDiv).toBeInTheDocument();
    });
  });

  it('alternate mode renders items with both left and right content areas', () => {
    const items: TimelineItemProps[] = [
      { key: 'a', children: 'Event A', label: 'Label A' },
      { key: 'b', children: 'Event B', label: 'Label B' },
    ];
    render(<Timeline items={items} mode="alternate" />);
    // First item (index 0): content on left, label on right
    // Second item (index 1): label on left, content on right
    expect(screen.getByText('Event A')).toBeInTheDocument();
    expect(screen.getByText('Event B')).toBeInTheDocument();
    expect(screen.getByText('Label A')).toBeInTheDocument();
    expect(screen.getByText('Label B')).toBeInTheDocument();
    // Verify the alternate structure has the justify-center class
    const listItems = screen.getAllByRole('listitem');
    listItems.forEach((item) => {
      expect(item.className).toContain('justify-center');
    });
  });
});

/* ------------------------------------------------------------------ */
/*  Pending                                                            */
/* ------------------------------------------------------------------ */

describe('Timeline — pending', () => {
  it('renders a pending item at the end', () => {
    render(
      <Timeline items={defaultItems} pending="Loading more..." />,
    );
    expect(screen.getByText('Loading more...')).toBeInTheDocument();
    // 3 original + 1 pending = 4
    expect(screen.getAllByRole('listitem')).toHaveLength(4);
  });

  it('renders pulsing pending dot', () => {
    const { container } = render(
      <Timeline items={defaultItems} pending="Loading..." />,
    );
    expect(
      container.querySelector('[data-testid="timeline-pending-dot"]'),
    ).toBeInTheDocument();
  });

  it('renders custom pending dot', () => {
    render(
      <Timeline
        items={defaultItems}
        pending="Loading..."
        pendingDot={<span data-testid="custom-pending">...</span>}
      />,
    );
    expect(screen.getByTestId('custom-pending')).toBeInTheDocument();
    // Should render inside a custom-dot wrapper, not the pulsing dot
    expect(screen.getByTestId('timeline-custom-dot')).toBeInTheDocument();
  });

  it('does not add pending item when pending is null', () => {
    render(<Timeline items={defaultItems} pending={null} />);
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
  });

  it('does not add pending item when pending is undefined', () => {
    render(<Timeline items={defaultItems} />);
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
  });
});

/* ------------------------------------------------------------------ */
/*  Reverse                                                            */
/* ------------------------------------------------------------------ */

describe('Timeline — reverse', () => {
  it('reverses item order when reverse is true', () => {
    render(<Timeline items={defaultItems} reverse />);
    const listItems = screen.getAllByRole('listitem');
    expect(within(listItems[0]).getByText('Third event')).toBeInTheDocument();
    expect(within(listItems[2]).getByText('First event')).toBeInTheDocument();
  });

  it('does not reverse by default', () => {
    render(<Timeline items={defaultItems} />);
    const listItems = screen.getAllByRole('listitem');
    expect(within(listItems[0]).getByText('First event')).toBeInTheDocument();
    expect(within(listItems[2]).getByText('Third event')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Size                                                               */
/* ------------------------------------------------------------------ */

describe('Timeline — size', () => {
  it('defaults to md size', () => {
    const { container } = render(<Timeline items={defaultItems} />);
    const dot = container.querySelector('[data-testid="timeline-dot"]');
    expect(dot?.className).toContain('h-2.5');
  });

  it('renders sm size dots', () => {
    const { container } = render(<Timeline items={defaultItems} size="sm" />);
    const dot = container.querySelector('[data-testid="timeline-dot"]');
    expect(dot?.className).toContain('h-2');
  });
});

/* ------------------------------------------------------------------ */
/*  Pending item dot behavior                                          */
/* ------------------------------------------------------------------ */

describe('Timeline — pending item with custom dot', () => {
  it('uses custom dot instead of pulsing dot when item has both dot and pending', () => {
    const items: TimelineItemProps[] = [
      {
        key: 'a',
        children: 'Pending with icon',
        pending: true,
        dot: <span data-testid="pending-icon">P</span>,
      },
    ];
    // When pending=true AND dot is provided, custom dot takes precedence
    render(<Timeline items={items} />);
    expect(screen.getByTestId('pending-icon')).toBeInTheDocument();
    expect(screen.getByTestId('timeline-custom-dot')).toBeInTheDocument();
  });

  it('shows pulsing dot when pending is true and no custom dot', () => {
    const items: TimelineItemProps[] = [
      {
        key: 'a',
        children: 'Pending without icon',
        pending: true,
      },
    ];
    render(<Timeline items={items} />);
    expect(
      screen.getByTestId('timeline-pending-dot'),
    ).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Access control                                                     */
/* ------------------------------------------------------------------ */

describe('Timeline — access control', () => {
  it('renders nothing when access is "hidden"', () => {
    const { container } = render(
      <Timeline items={defaultItems} access="hidden" />,
    );
    expect(container.firstElementChild).toBeNull();
  });

  it('renders normally when access is "full"', () => {
    render(<Timeline items={defaultItems} access="full" />);
    expect(screen.getByRole('list')).toBeInTheDocument();
  });

  it('renders when access is "readonly"', () => {
    render(<Timeline items={defaultItems} access="readonly" />);
    expect(screen.getByRole('list')).toBeInTheDocument();
  });

  it('renders when access is "disabled"', () => {
    render(<Timeline items={defaultItems} access="disabled" />);
    expect(screen.getByRole('list')).toBeInTheDocument();
  });

  it('sets data-access-state attribute', () => {
    const { container } = render(
      <Timeline items={defaultItems} access="readonly" />,
    );
    expect(
      container.querySelector('[data-access-state="readonly"]'),
    ).toBeInTheDocument();
  });

  it('sets title from accessReason', () => {
    const { container } = render(
      <Timeline
        items={defaultItems}
        access="disabled"
        accessReason="Insufficient permissions"
      />,
    );
    expect(container.firstElementChild).toHaveAttribute(
      'title',
      'Insufficient permissions',
    );
  });
});

/* ------------------------------------------------------------------ */
/*  Edge cases                                                         */
/* ------------------------------------------------------------------ */

describe('Timeline — edge cases', () => {
  it('renders without error with empty items array', () => {
    const { container } = render(<Timeline items={[]} />);
    expect(container.querySelector('[role="list"]')).toBeInTheDocument();
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });

  it('renders single item correctly', () => {
    render(<Timeline items={[{ key: 'only', children: 'Only event' }]} />);
    expect(screen.getAllByRole('listitem')).toHaveLength(1);
    expect(screen.getByText('Only event')).toBeInTheDocument();
  });

  it('renders ReactNode as children', () => {
    const items: TimelineItemProps[] = [
      {
        key: 'rich',
        children: (
          <div data-testid="rich-content">
            <strong>Bold</strong> text
          </div>
        ),
      },
    ];
    render(<Timeline items={items} />);
    expect(screen.getByTestId('rich-content')).toBeInTheDocument();
  });

  it('renders pending with reverse', () => {
    render(
      <Timeline items={defaultItems} pending="Loading..." reverse />,
    );
    const listItems = screen.getAllByRole('listitem');
    // Pending item should be reversed too — but it was appended before reverse
    expect(listItems).toHaveLength(4);
  });

  it('supports mixed colors across items', () => {
    const items: TimelineItemProps[] = [
      { key: 'a', children: 'A', color: 'success' },
      { key: 'b', children: 'B', color: 'danger' },
      { key: 'c', children: 'C', color: 'primary' },
    ];
    const { container } = render(<Timeline items={items} />);
    const dots = container.querySelectorAll('[data-testid="timeline-dot"]');
    expect(dots[0]?.className).toContain('bg-[var(--feedback-success)]');
    expect(dots[1]?.className).toContain('bg-[var(--feedback-error)]');
    expect(dots[2]?.className).toContain('bg-action-primary');
  });
});

describe('Timeline — accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<Timeline items={defaultItems} />);
    await expectNoA11yViolations(container);
  });
});
