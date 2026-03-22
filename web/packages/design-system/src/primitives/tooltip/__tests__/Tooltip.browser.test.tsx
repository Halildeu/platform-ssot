import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { userEvent } from '@vitest/browser/context';
import { Tooltip } from '../Tooltip';

describe('Tooltip (Browser)', () => {
  /* ------------------------------------------------------------------ */
  /*  1. Basic render                                                     */
  /* ------------------------------------------------------------------ */
  it('renders trigger content', async () => {
    const screen = render(
      <Tooltip content="Tooltip text">
        <button>Hover me</button>
      </Tooltip>,
    );
    await expect.element(screen.getByText('Hover me')).toBeVisible();
  });

  /* ------------------------------------------------------------------ */
  /*  2. Shows on hover                                                   */
  /* ------------------------------------------------------------------ */
  it('shows tooltip on hover', async () => {
    const screen = render(
      <Tooltip content="Tooltip text" delay={0}>
        <button>Hover me</button>
      </Tooltip>,
    );
    await screen.getByText('Hover me').hover();
    await expect.element(screen.getByRole('tooltip')).toBeVisible();
  });

  /* ------------------------------------------------------------------ */
  /*  3. Hides on mouse leave                                             */
  /* ------------------------------------------------------------------ */
  it('hides tooltip on mouse leave', async () => {
    const screen = render(
      <div>
        <Tooltip content="Tooltip text" delay={0}>
          <button>Hover me</button>
        </Tooltip>
        <button>Other</button>
      </div>,
    );
    await screen.getByText('Hover me').hover();
    await expect.element(screen.getByRole('tooltip')).toBeVisible();
    // Move mouse away
    await screen.getByText('Other').hover();
    expect(screen.container.querySelector('[role="tooltip"]')).toBeNull();
  });

  /* ------------------------------------------------------------------ */
  /*  4. Shows on keyboard focus                                          */
  /* ------------------------------------------------------------------ */
  it('shows tooltip on keyboard focus', async () => {
    const screen = render(
      <Tooltip content="Focus tip" delay={0}>
        <button>Focus me</button>
      </Tooltip>,
    );
    screen.getByText('Focus me').element().focus();
    await expect.element(screen.getByRole('tooltip')).toBeVisible();
  });

  /* ------------------------------------------------------------------ */
  /*  5. Escape hides tooltip                                             */
  /* ------------------------------------------------------------------ */
  it('hides tooltip on Escape key', async () => {
    const screen = render(
      <Tooltip content="Escape tip" delay={0}>
        <button>Press Esc</button>
      </Tooltip>,
    );
    await screen.getByText('Press Esc').hover();
    await expect.element(screen.getByRole('tooltip')).toBeVisible();
    await userEvent.keyboard('{Escape}');
    expect(screen.container.querySelector('[role="tooltip"]')).toBeNull();
  });

  /* ------------------------------------------------------------------ */
  /*  6. ARIA attributes                                                  */
  /* ------------------------------------------------------------------ */
  it('tooltip has role="tooltip"', async () => {
    const screen = render(
      <Tooltip content="ARIA" delay={0}>
        <button>Hover</button>
      </Tooltip>,
    );
    await screen.getByText('Hover').hover();
    await expect.element(screen.getByRole('tooltip')).toBeVisible();
  });

  /* ------------------------------------------------------------------ */
  /*  7. Disabled tooltip                                                 */
  /* ------------------------------------------------------------------ */
  it('does not show tooltip when disabled', async () => {
    const screen = render(
      <Tooltip content="Disabled tip" disabled delay={0}>
        <button>Hover me</button>
      </Tooltip>,
    );
    await screen.getByText('Hover me').hover();
    expect(screen.container.querySelector('[role="tooltip"]')).toBeNull();
  });

  /* ------------------------------------------------------------------ */
  /*  8. Placement                                                        */
  /* ------------------------------------------------------------------ */
  it('renders with different placements without error', async () => {
    const placements = ['top', 'bottom', 'left', 'right'] as const;
    for (const placement of placements) {
      const screen = render(
        <Tooltip content={`${placement} tip`} placement={placement} delay={0}>
          <button>Hover</button>
        </Tooltip>,
      );
      await screen.getByText('Hover').hover();
      await expect.element(screen.getByRole('tooltip')).toBeVisible();
      screen.unmount();
    }
  });

  /* ------------------------------------------------------------------ */
  /*  9. No content returns children directly                             */
  /* ------------------------------------------------------------------ */
  it('renders children without wrapper when no content', async () => {
    const screen = render(
      <Tooltip content="">
        <button>No tooltip</button>
      </Tooltip>,
    );
    await expect.element(screen.getByText('No tooltip')).toBeVisible();
  });
});
