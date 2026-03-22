import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { Accordion } from '../Accordion';

const items = [
  { value: 'item-1', title: 'First Section', content: 'First section content' },
  { value: 'item-2', title: 'Second Section', content: 'Second section content' },
  { value: 'item-3', title: 'Third Section', content: 'Third section content' },
];

describe('Accordion Visual Regression', () => {
  it('collapsed state matches screenshot', async () => {
    const screen = render(
      <div style={{ padding: 20, background: '#fff', width: 500 }}>
        <Accordion items={items} />
      </div>,
    );
    await expect(screen.container).toMatchScreenshot();
  });

  it('expanded state matches screenshot', async () => {
    const screen = render(
      <div style={{ padding: 20, background: '#fff', width: 500 }}>
        <Accordion items={items} defaultValue="item-1" />
      </div>,
    );
    await expect(screen.container).toMatchScreenshot();
  });
});
