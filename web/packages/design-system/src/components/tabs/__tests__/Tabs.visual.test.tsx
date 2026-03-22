import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { Tabs } from '../Tabs';

const items = [
  { key: 'tab1', label: 'First', content: <div>First tab content</div> },
  { key: 'tab2', label: 'Second', content: <div>Second tab content</div> },
];

describe('Tabs Visual Regression', () => {
  it('default line variant matches screenshot', async () => {
    const screen = render(
      <div style={{ padding: 20, background: '#fff', width: 400 }}>
        <Tabs items={items} />
      </div>,
    );
    await expect(screen.container).toMatchScreenshot();
  });

  it('second tab selected matches screenshot', async () => {
    const screen = render(
      <div style={{ padding: 20, background: '#fff', width: 400 }}>
        <Tabs items={items} defaultActiveKey="tab2" />
      </div>,
    );
    await expect(screen.container).toMatchScreenshot();
  });
});
