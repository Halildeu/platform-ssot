import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { Tooltip } from '../Tooltip';

describe('Tooltip (Browser)', () => {
  it('renders trigger content', async () => {
    const screen = render(
      <Tooltip content="Tooltip text">
        <button>Hover me</button>
      </Tooltip>,
    );
    await expect.element(screen.getByText('Hover me')).toBeVisible();
  });

  it('shows tooltip on hover', async () => {
    const screen = render(
      <Tooltip content="Tooltip text" delay={0}>
        <button>Hover me</button>
      </Tooltip>,
    );
    await screen.getByText('Hover me').hover();
    await expect.element(screen.getByRole('tooltip')).toBeVisible();
  });

  it('does not show tooltip when disabled', async () => {
    const screen = render(
      <Tooltip content="Tooltip text" disabled delay={0}>
        <button>Hover me</button>
      </Tooltip>,
    );
    await screen.getByText('Hover me').hover();
    expect(screen.container.querySelector('[role="tooltip"]')).toBeNull();
  });
});
