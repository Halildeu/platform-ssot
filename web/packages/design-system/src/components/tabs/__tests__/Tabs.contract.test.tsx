// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tabs, type TabItem } from '../Tabs';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => cleanup());

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const makeItems = (): TabItem[] => [
  { key: 'tab1', label: 'Tab 1', content: 'Content 1' },
  { key: 'tab2', label: 'Tab 2', content: 'Content 2' },
  { key: 'tab3', label: 'Tab 3', content: 'Content 3' },
];

/* ------------------------------------------------------------------ */
/*  Tabs contract                                                      */
/* ------------------------------------------------------------------ */

describe('Tabs contract', () => {
  /* ---- Identity ---- */
  it('has displayName', () => {
    expect(Tabs.displayName).toBe('Tabs');
  });

  /* ---- Renders with required props ---- */
  it('renders with required props', () => {
    render(<Tabs items={makeItems()} />);
    expect(screen.getByRole('tablist')).toBeInTheDocument();
    expect(screen.getAllByRole('tab')).toHaveLength(3);
  });

  /* ---- Accepts className ---- */
  it('merges custom className', () => {
    const { container } = render(
      <Tabs items={makeItems()} className="custom-tabs" />,
    );
    expect(container.firstElementChild).toHaveClass('custom-tabs');
  });

  /* ---- data-testid support ---- */
  it('forwards data-testid via item content', () => {
    const items: TabItem[] = [
      {
        key: 'a',
        label: 'A',
        content: <div data-testid="tab-content-a">CA</div>,
      },
    ];
    render(<Tabs items={items} />);
    expect(screen.getByTestId('tab-content-a')).toBeInTheDocument();
  });

  /* ---- Controlled value ---- */
  it('respects controlled activeKey', () => {
    render(<Tabs items={makeItems()} activeKey="tab3" />);
    expect(screen.getByRole('tab', { name: 'Tab 3' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(screen.getByText('Content 3')).toBeInTheDocument();
  });

  /* ---- onChange callback ---- */
  it('fires onChange when a tab is clicked', async () => {
    const handler = vi.fn();
    const user = userEvent.setup();
    render(<Tabs items={makeItems()} onChange={handler} />);
    await user.click(screen.getByRole('tab', { name: 'Tab 2' }));
    expect(handler).toHaveBeenCalledWith('tab2');
  });

  /* ---- Renders all items ---- */
  it('renders all tab items in the tablist', () => {
    render(<Tabs items={makeItems()} />);
    expect(screen.getByText('Tab 1')).toBeInTheDocument();
    expect(screen.getByText('Tab 2')).toBeInTheDocument();
    expect(screen.getByText('Tab 3')).toBeInTheDocument();
  });

  /* ---- Keyboard navigation ---- */
  it('navigates tabs with ArrowRight key', async () => {
    const handler = vi.fn();
    const user = userEvent.setup();
    render(<Tabs items={makeItems()} onChange={handler} />);

    const tabs = screen.getAllByRole('tab');
    tabs[0].focus();
    await user.keyboard('{ArrowRight}');

    expect(handler).toHaveBeenCalledWith('tab2');
  });

  it('navigates tabs with ArrowLeft key', async () => {
    const handler = vi.fn();
    const user = userEvent.setup();
    render(
      <Tabs items={makeItems()} defaultActiveKey="tab2" onChange={handler} />,
    );

    const tabs = screen.getAllByRole('tab');
    tabs[1].focus();
    await user.keyboard('{ArrowLeft}');

    expect(handler).toHaveBeenCalledWith('tab1');
  });

  /* ---- Access control: disabled ---- */
  it('blocks interaction on disabled tabs', async () => {
    const handler = vi.fn();
    const user = userEvent.setup();
    const items: TabItem[] = [
      { key: 'a', label: 'A', content: 'CA' },
      { key: 'b', label: 'B', content: 'CB', disabled: true },
    ];
    render(<Tabs items={items} onChange={handler} />);
    await user.click(screen.getByRole('tab', { name: 'B' }));
    expect(handler).not.toHaveBeenCalled();
    expect(screen.getByRole('tab', { name: 'B' })).toBeDisabled();
  });

  /* ---- Access control: hidden ---- */
  it('does not render content for non-active tabs (hidden)', () => {
    render(<Tabs items={makeItems()} activeKey="tab1" />);
    expect(screen.getByText('Content 1')).toBeInTheDocument();
    expect(screen.queryByText('Content 2')).not.toBeInTheDocument();
    expect(screen.queryByText('Content 3')).not.toBeInTheDocument();
  });
});

describe('Tabs — accessibility', () => {
  it('has no axe-core a11y violations', async () => {
    const { container } = render(<Tabs items={makeItems()} />);
    await expectNoA11yViolations(container);
  });
});
