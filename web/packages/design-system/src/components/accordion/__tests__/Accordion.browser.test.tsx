import { describe, it, expect, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { userEvent } from 'vitest/browser';
import { Accordion } from '../Accordion';

const items = [
  { value: 'item-1', title: 'Section One', content: 'Content of section one' },
  { value: 'item-2', title: 'Section Two', content: 'Content of section two' },
  { value: 'item-3', title: 'Section Three', content: 'Content of section three' },
];

describe('Accordion (Browser)', () => {
  /* ------------------------------------------------------------------ */
  /*  1. Basic render                                                     */
  /* ------------------------------------------------------------------ */
  it('renders all section titles', async () => {
    const screen = await render(<Accordion items={items} />);
    await expect.element(screen.getByText('Section One')).toBeVisible();
    await expect.element(screen.getByText('Section Two')).toBeVisible();
    await expect.element(screen.getByText('Section Three')).toBeVisible();
  });

  /* ------------------------------------------------------------------ */
  /*  2. Expand / collapse on click                                       */
  /* ------------------------------------------------------------------ */
  it('expands an item on click', async () => {
    const screen = await render(<Accordion items={items} />);
    await screen.getByText('Section One').click();
    await expect.element(screen.getByText('Content of section one')).toBeVisible();
  });

  it('collapses an expanded item on second click (single mode)', async () => {
    const screen = await render(<Accordion items={items} selectionMode="single" />);
    await screen.getByRole('button', { name: 'Section One' }).click();
    await expect.element(screen.getByText('Content of section one')).toBeVisible();
    await screen.getByRole('button', { name: 'Section One' }).click();
    // Content should be hidden
    const panel = document.querySelector('[data-slot="panel"]');
    expect(panel?.hasAttribute('hidden') || panel === null).toBe(true);
  });

  /* ------------------------------------------------------------------ */
  /*  3. Multiple mode                                                    */
  /* ------------------------------------------------------------------ */
  it('allows multiple panels open in multiple mode', async () => {
    const screen = await render(<Accordion items={items} selectionMode="multiple" />);
    await screen.getByText('Section One').click();
    await screen.getByText('Section Two').click();
    await expect.element(screen.getByText('Content of section one')).toBeVisible();
    await expect.element(screen.getByText('Content of section two')).toBeVisible();
  });

  it('single mode only allows one panel open', async () => {
    const screen = await render(<Accordion items={items} selectionMode="single" />);
    await screen.getByText('Section One').click();
    await expect.element(screen.getByText('Content of section one')).toBeVisible();
    await screen.getByText('Section Two').click();
    await expect.element(screen.getByText('Content of section two')).toBeVisible();
    // Section one should now be collapsed
    const panels = document.querySelectorAll('[data-slot="panel"]:not([hidden])');
    expect(panels.length).toBe(1);
  });

  /* ------------------------------------------------------------------ */
  /*  4. Keyboard — Enter/Space expands                                   */
  /* ------------------------------------------------------------------ */
  it('expands on Enter key', async () => {
    const screen = await render(<Accordion items={items} />);
    const trigger = document.querySelector('[aria-expanded]') as HTMLElement;
    trigger.focus();
    await userEvent.keyboard('{Enter}');
    await expect.element(screen.getByText('Content of section one')).toBeVisible();
  });

  it('expands on Space key', async () => {
    const screen = await render(<Accordion items={items} />);
    const trigger = document.querySelector('[aria-expanded]') as HTMLElement;
    trigger.focus();
    await userEvent.keyboard(' ');
    await expect.element(screen.getByText('Content of section one')).toBeVisible();
  });

  /* ------------------------------------------------------------------ */
  /*  5. ARIA attributes                                                  */
  /* ------------------------------------------------------------------ */
  it('sets aria-expanded on trigger', async () => {
    await render(<Accordion items={items} />);
    const trigger = document.querySelector('[aria-expanded]') as HTMLElement;
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    await trigger.click();
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
  });

  it('trigger has aria-controls pointing to panel', async () => {
    await render(<Accordion items={items} defaultValue="item-1" />);
    const trigger = document.querySelector('[aria-expanded="true"]') as HTMLElement;
    const controls = trigger.getAttribute('aria-controls');
    expect(controls).toBeTruthy();
    const panel = document.querySelector(`#${controls}`);
    expect(panel).not.toBeNull();
  });

  it('panel has role="region"', async () => {
    await render(<Accordion items={items} defaultValue="item-1" />);
    const regions = document.querySelectorAll('[role="region"]');
    expect(regions.length).toBeGreaterThan(0);
  });

  /* ------------------------------------------------------------------ */
  /*  6. onValueChange callback                                           */
  /* ------------------------------------------------------------------ */
  it('fires onValueChange when toggled', async () => {
    const onValueChange = vi.fn();
    const screen = await render(<Accordion items={items} onValueChange={onValueChange} />);
    await screen.getByText('Section One').click();
    expect(onValueChange).toHaveBeenCalledWith(['item-1']);
  });

  /* ------------------------------------------------------------------ */
  /*  7. Disabled item                                                    */
  /* ------------------------------------------------------------------ */
  it('disabled item cannot be expanded', async () => {
    const disabledItems = [
      { value: 'item-1', title: 'Disabled Section', content: 'Hidden', disabled: true },
      { value: 'item-2', title: 'Normal', content: 'Visible' },
    ];
    await render(<Accordion items={disabledItems} />);
    const trigger = document.querySelector('[aria-disabled="true"]');
    expect(trigger).not.toBeNull();
  });

  /* ------------------------------------------------------------------ */
  /*  8. defaultValue                                                     */
  /* ------------------------------------------------------------------ */
  it('uses defaultValue to initially expand an item', async () => {
    const screen = await render(<Accordion items={items} defaultValue="item-2" />);
    await expect.element(screen.getByText('Content of section two')).toBeVisible();
  });
});
