import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { Popover } from '../Popover';

describe('Popover Visual Regression', () => {
  /* ---- 1. Default open with title ---- */
  it('open popover with title matches screenshot', async () => {
    const screen = await render(
      <div style={{ padding: 80, background: '#fff' }}>
        <Popover
          trigger={<button>Trigger</button>}
          content="This is popover content"
          title="Info"
          open
          disablePortal
        />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  /* ---- 2. Without title ---- */
  it('popover without title matches screenshot', async () => {
    const screen = await render(
      <div style={{ padding: 80, background: '#fff' }}>
        <Popover
          trigger={<button>More</button>}
          content="Simple popover text"
          open
          disablePortal
        />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  /* ---- 3. Without arrow ---- */
  it('popover without arrow matches screenshot', async () => {
    const screen = await render(
      <div style={{ padding: 80, background: '#fff' }}>
        <Popover
          trigger={<button>No Arrow</button>}
          content="No arrow popover"
          showArrow={false}
          open
          disablePortal
        />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  /* ---- 4. Closed state ---- */
  it('closed state (trigger only) matches screenshot', async () => {
    const screen = await render(
      <div style={{ padding: 20, background: '#fff' }}>
        <Popover
          trigger={<button>Click me</button>}
          content="Hidden content"
          open={false}
          disablePortal
        />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  /* ---- 5. Dark mode ---- */
  it('dark theme matches screenshot', async () => {
    const screen = await render(
      <div data-theme="dark" style={{ padding: 80, background: '#1a1a2e' }}>
        <Popover
          trigger={<button>Dark</button>}
          content="Dark popover content"
          title="Dark Info"
          open
          disablePortal
        />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
