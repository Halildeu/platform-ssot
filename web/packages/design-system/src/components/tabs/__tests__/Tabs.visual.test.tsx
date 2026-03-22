import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { Tabs } from '../Tabs';

const items = [
  { key: 'tab1', label: 'First', content: <div>First tab content</div> },
  { key: 'tab2', label: 'Second', content: <div>Second tab content</div> },
  { key: 'tab3', label: 'Third', content: <div>Third tab content</div> },
];

const itemsWithDisabled = [
  { key: 'tab1', label: 'Active', content: <div>Active content</div> },
  { key: 'tab2', label: 'Normal', content: <div>Normal content</div> },
  { key: 'tab3', label: 'Disabled', content: <div>Disabled content</div>, disabled: true },
];

describe('Tabs Visual Regression', () => {
  /* ---- 1. Default line variant ---- */
  it('line variant matches screenshot', async () => {
    render(
      <div style={{ padding: 20, background: '#fff', width: 500 }}>
        <Tabs items={items} />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  /* ---- 2. All variants ---- */
  it('enclosed variant matches screenshot', async () => {
    render(
      <div style={{ padding: 20, background: '#fff', width: 500 }}>
        <Tabs items={items} variant="enclosed" />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  it('pill variant matches screenshot', async () => {
    render(
      <div style={{ padding: 20, background: '#fff', width: 500 }}>
        <Tabs items={items} variant="pill" />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  /* ---- 3. All sizes ---- */
  it('all sizes (line variant) match screenshot', async () => {
    render(
      <div style={{ padding: 20, background: '#fff', width: 500, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <Tabs items={items} size="sm" />
        <Tabs items={items} size="md" />
        <Tabs items={items} size="lg" />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  /* ---- 4. Disabled tab ---- */
  it('disabled tab state matches screenshot', async () => {
    render(
      <div style={{ padding: 20, background: '#fff', width: 500 }}>
        <Tabs items={itemsWithDisabled} />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  /* ---- 5. Second tab selected ---- */
  it('second tab selected matches screenshot', async () => {
    render(
      <div style={{ padding: 20, background: '#fff', width: 500 }}>
        <Tabs items={items} defaultActiveKey="tab2" />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  /* ---- 6. Dark mode ---- */
  it('dark theme matches screenshot', async () => {
    render(
      <div data-theme="dark" style={{ padding: 20, background: '#1a1a2e', width: 500 }}>
        <Tabs items={items} />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
