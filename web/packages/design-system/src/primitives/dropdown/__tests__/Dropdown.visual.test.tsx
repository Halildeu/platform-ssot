/* eslint-disable semantic-theme/no-inline-color-literals */
import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { Dropdown } from '../Dropdown';
import { LIGHT_BG_HEX, DARK_BG_HEX } from '../../../__tests__/visual-constants';

const items = [
  { key: 'edit', label: 'Edit' },
  { key: 'duplicate', label: 'Duplicate' },
  { key: 'delete', label: 'Delete', danger: true },
];

describe('Dropdown Visual Regression', () => {
  /* ---- 1. Closed state ---- */
  it('closed state matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: LIGHT_BG_HEX }}>
        <Dropdown items={items}>
          <button>Actions</button>
        </Dropdown>
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  /* ---- 2. Open state ---- */
  it('open state matches screenshot', async () => {
    const screen = await render(
      <div style={{ padding: 20, paddingBottom: 200, background: LIGHT_BG_HEX }}>
        <Dropdown items={items}>
          <button>Actions</button>
        </Dropdown>
      </div>,
    );
    await screen.getByText('Actions').click();
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  /* ---- 3. With disabled item ---- */
  it('disabled item in menu matches screenshot', async () => {
    const disabledItems = [
      { key: 'edit', label: 'Edit' },
      { key: 'duplicate', label: 'Duplicate', disabled: true },
      { key: 'delete', label: 'Delete', danger: true },
    ];
    const screen = await render(
      <div style={{ padding: 20, paddingBottom: 200, background: LIGHT_BG_HEX }}>
        <Dropdown items={disabledItems}>
          <button>Actions</button>
        </Dropdown>
      </div>,
    );
    await screen.getByText('Actions').click();
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  /* ---- 4. With labels and separators ---- */
  it('rich menu with labels and separators matches screenshot', async () => {
    const richItems = [
      { type: 'label' as const, label: 'Editing' },
      { key: 'edit', label: 'Edit' },
      { key: 'duplicate', label: 'Duplicate' },
      { type: 'separator' as const },
      { type: 'label' as const, label: 'Danger zone' },
      { key: 'delete', label: 'Delete', danger: true },
    ];
    const screen = await render(
      <div style={{ padding: 20, paddingBottom: 300, background: LIGHT_BG_HEX }}>
        <Dropdown items={richItems}>
          <button>Actions</button>
        </Dropdown>
      </div>,
    );
    await screen.getByText('Actions').click();
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  /* ---- 5. Disabled dropdown ---- */
  it('disabled dropdown matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: LIGHT_BG_HEX }}>
        <Dropdown items={items} disabled>
          <button>Disabled</button>
        </Dropdown>
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  /* ---- 6. Dark mode ---- */
  it('dark theme matches screenshot', async () => {
    const screen = await render(
      <div data-theme="dark" style={{ padding: 20, paddingBottom: 200, background: DARK_BG_HEX }}>
        <Dropdown items={items}>
          <button>Actions</button>
        </Dropdown>
      </div>,
    );
    await screen.getByText('Actions').click();
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
