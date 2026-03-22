import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { Popover } from '../Popover';

describe('Popover (Browser)', () => {
  it('renders trigger element', async () => {
    const screen = render(
      <Popover
        trigger={<button>Open</button>}
        content="Popover content"
        disablePortal
      />,
    );
    await expect.element(screen.getByText('Open')).toBeVisible();
  });

  it('shows popover content when open', async () => {
    const screen = render(
      <Popover
        trigger={<button>Toggle</button>}
        content="Visible content"
        open
        disablePortal
      />,
    );
    await expect.element(screen.getByText('Visible content')).toBeVisible();
  });

  it('hides popover content when closed', async () => {
    const screen = render(
      <Popover
        trigger={<button>Toggle</button>}
        content="Hidden content"
        open={false}
        disablePortal
      />,
    );
    expect(screen.container.querySelector('[role="dialog"]')).toBeNull();
  });
});
