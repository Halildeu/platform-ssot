import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { Popover } from '../Popover';

describe('Popover Visual Regression', () => {
  it('open popover matches screenshot', async () => {
    const screen = render(
      <div style={{ padding: 60, background: '#fff' }}>
        <Popover
          trigger={<button>Trigger</button>}
          content="This is popover content"
          title="Info"
          open
          disablePortal
        />
      </div>,
    );
    await expect(screen.container).toMatchScreenshot();
  });

  it('popover without title matches screenshot', async () => {
    const screen = render(
      <div style={{ padding: 60, background: '#fff' }}>
        <Popover
          trigger={<button>More</button>}
          content="Simple popover text"
          open
          disablePortal
        />
      </div>,
    );
    await expect(screen.container).toMatchScreenshot();
  });
});
