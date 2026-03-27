import { describe, it, expect, vi } from 'vitest';
import { render, cleanup } from 'vitest-browser-react';
import { userEvent } from 'vitest/browser';
import { Tabs } from '../Tabs';

const items = [
  { key: 'tab1', label: 'First', content: <div>First content</div> },
  { key: 'tab2', label: 'Second', content: <div>Second content</div> },
  { key: 'tab3', label: 'Third', content: <div>Third content</div>, disabled: true },
];

describe('Tabs (Browser)', () => {
  /* ------------------------------------------------------------------ */
  /*  1. Basic render                                                     */
  /* ------------------------------------------------------------------ */
  it('renders all tab buttons', async () => {
    const screen = await render(<Tabs items={items} />);
    await expect.element(screen.getByRole('tab', { name: 'First' })).toBeVisible();
    await expect.element(screen.getByRole('tab', { name: 'Second' })).toBeVisible();
    await expect.element(screen.getByRole('tab', { name: 'Third' })).toBeVisible();
  });

  it('shows first tab content by default', async () => {
    const screen = await render(<Tabs items={items} />);
    await expect.element(screen.getByText('First content')).toBeVisible();
  });

  /* ------------------------------------------------------------------ */
  /*  2. onClick / onChange callback                                      */
  /* ------------------------------------------------------------------ */
  it('fires onChange when a tab is clicked', async () => {
    const onChange = vi.fn();
    const screen = await render(<Tabs items={items} onChange={onChange} />);
    await screen.getByRole('tab', { name: 'Second' }).click();
    expect(onChange).toHaveBeenCalledWith('tab2');
  });

  it('switches tab content on click', async () => {
    const screen = await render(<Tabs items={items} />);
    await screen.getByRole('tab', { name: 'Second' }).click();
    await expect.element(screen.getByText('Second content')).toBeVisible();
  });

  /* ------------------------------------------------------------------ */
  /*  3. Disabled tab                                                     */
  /* ------------------------------------------------------------------ */
  it('disabled tab cannot be clicked', async () => {
    const onChange = vi.fn();
    const screen = await render(<Tabs items={items} onChange={onChange} />);
    const disabledTab = screen.getByRole('tab', { name: 'Third' });
    await expect.element(disabledTab).toBeDisabled();
    disabledTab.element().click();
    expect(onChange).not.toHaveBeenCalledWith('tab3');
  });

  /* ------------------------------------------------------------------ */
  /*  4. Arrow key navigation                                             */
  /* ------------------------------------------------------------------ */
  it('navigates between tabs with arrow keys', async () => {
    const onChange = vi.fn();
    const screen = await render(<Tabs items={items} onChange={onChange} />);
    // Focus first tab
    screen.getByRole('tab', { name: 'First' }).element().focus();
    // Arrow Right should move to Second
    await userEvent.keyboard('{ArrowRight}');
    expect(onChange).toHaveBeenCalledWith('tab2');
  });

  it('skips disabled tab with arrow keys', async () => {
    const onChange = vi.fn();
    const screen = await render(<Tabs items={items} onChange={onChange} />);
    // Focus second tab
    screen.getByRole('tab', { name: 'Second' }).element().focus();
    // Arrow Right should skip Third (disabled) and loop to First
    await userEvent.keyboard('{ArrowRight}');
    expect(onChange).toHaveBeenCalledWith('tab1');
  });

  /* ------------------------------------------------------------------ */
  /*  5. ARIA attributes                                                  */
  /* ------------------------------------------------------------------ */
  it('sets aria-selected on active tab', async () => {
    const screen = await render(<Tabs items={items} />);
    await expect.element(screen.getByRole('tab', { name: 'First' })).toHaveAttribute('aria-selected', 'true');
    await expect.element(screen.getByRole('tab', { name: 'Second' })).toHaveAttribute('aria-selected', 'false');
  });

  it('renders tabpanel role for content', async () => {
    const screen = await render(<Tabs items={items} />);
    await expect.element(screen.getByRole('tabpanel')).toBeVisible();
  });

  it('renders tablist role for tab container', async () => {
    const screen = await render(<Tabs items={items} />);
    await expect.element(screen.getByRole('tablist')).toBeVisible();
  });

  it('tab has aria-controls pointing to panel', async () => {
    const screen = await render(<Tabs items={items} />);
    const tab = screen.getByRole('tab', { name: 'First' });
    const controls = tab.element().getAttribute('aria-controls');
    expect(controls).toBeTruthy();
    const panel = screen.getByRole('tabpanel');
    expect(panel.element().id).toBe(controls);
  });

  /* ------------------------------------------------------------------ */
  /*  6. defaultActiveKey                                                 */
  /* ------------------------------------------------------------------ */
  it('uses defaultActiveKey to set initial tab', async () => {
    const screen = await render(<Tabs items={items} defaultActiveKey="tab2" />);
    await expect.element(screen.getByText('Second content')).toBeVisible();
    await expect.element(screen.getByRole('tab', { name: 'Second' })).toHaveAttribute('aria-selected', 'true');
  });

  /* ------------------------------------------------------------------ */
  /*  7. Variants                                                         */
  /* ------------------------------------------------------------------ */
  it('renders all variants without error', async () => {
    const variants = ['line', 'enclosed', 'pill'] as const;
    for (const variant of variants) {
    await cleanup();
    const screen = await render(<Tabs items={items} variant={variant} />);
      await expect.element(screen.getByRole('tablist')).toBeVisible();
      
    }
  });

  /* ------------------------------------------------------------------ */
  /*  8. Focus management                                                 */
  /* ------------------------------------------------------------------ */
  it('only one tab is tabbable (roving tabindex)', async () => {
    const screen = await render(<Tabs items={items} />);
    const firstTab = screen.getByRole('tab', { name: 'First' });
    const secondTab = screen.getByRole('tab', { name: 'Second' });
    // Active tab should have tabIndex 0, others -1
    expect(firstTab.element().tabIndex).toBe(0);
    expect(secondTab.element().tabIndex).toBe(-1);
  });
});
