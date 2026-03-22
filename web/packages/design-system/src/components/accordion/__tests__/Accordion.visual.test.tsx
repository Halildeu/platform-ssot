import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { Accordion } from '../Accordion';

const items = [
  { value: 'item-1', title: 'First Section', content: 'First section content' },
  { value: 'item-2', title: 'Second Section', content: 'Second section content' },
  { value: 'item-3', title: 'Third Section', content: 'Third section content' },
];

describe('Accordion Visual Regression', () => {
  /* ---- 1. Default collapsed ---- */
  it('collapsed state matches screenshot', async () => {
    const screen = render(
      <div style={{ padding: 20, background: '#fff', width: 500 }}>
        <Accordion items={items} />
      </div>,
    );
    await expect(screen.container).toMatchScreenshot();
  });

  /* ---- 2. Expanded ---- */
  it('expanded state matches screenshot', async () => {
    const screen = render(
      <div style={{ padding: 20, background: '#fff', width: 500 }}>
        <Accordion items={items} defaultValue="item-1" />
      </div>,
    );
    await expect(screen.container).toMatchScreenshot();
  });

  /* ---- 3. All sizes ---- */
  it('sm size matches screenshot', async () => {
    const screen = render(
      <div style={{ padding: 20, background: '#fff', width: 500 }}>
        <Accordion items={items} size="sm" defaultValue="item-1" />
      </div>,
    );
    await expect(screen.container).toMatchScreenshot();
  });

  /* ---- 4. Ghost variant ---- */
  it('ghost (unborderd) variant matches screenshot', async () => {
    const screen = render(
      <div style={{ padding: 20, background: '#fff', width: 500 }}>
        <Accordion items={items} ghost bordered={false} defaultValue="item-1" />
      </div>,
    );
    await expect(screen.container).toMatchScreenshot();
  });

  /* ---- 5. Disabled item ---- */
  it('disabled item matches screenshot', async () => {
    const disabledItems = [
      { value: 'item-1', title: 'Active Section', content: 'Active content' },
      { value: 'item-2', title: 'Disabled Section', content: 'Disabled content', disabled: true },
    ];
    const screen = render(
      <div style={{ padding: 20, background: '#fff', width: 500 }}>
        <Accordion items={disabledItems} />
      </div>,
    );
    await expect(screen.container).toMatchScreenshot();
  });

  /* ---- 6. Dark mode ---- */
  it('dark theme matches screenshot', async () => {
    const screen = render(
      <div data-theme="dark" style={{ padding: 20, background: '#1a1a2e', width: 500 }}>
        <Accordion items={items} defaultValue="item-1" />
      </div>,
    );
    await expect(screen.container).toMatchScreenshot();
  });
});
