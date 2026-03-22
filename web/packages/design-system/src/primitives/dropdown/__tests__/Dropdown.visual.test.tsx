import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { Dropdown } from '../Dropdown';

const items = [
  { key: 'edit', label: 'Edit' },
  { key: 'duplicate', label: 'Duplicate' },
  { key: 'delete', label: 'Delete', danger: true },
];

describe('Dropdown Visual Regression', () => {
  it('closed state matches screenshot', async () => {
    const screen = render(
      <div style={{ padding: 20, background: '#fff' }}>
        <Dropdown items={items}>
          <button>Actions</button>
        </Dropdown>
      </div>,
    );
    await expect(screen.container).toMatchScreenshot();
  });

  it('open state matches screenshot', async () => {
    const screen = render(
      <div style={{ padding: 20, paddingBottom: 200, background: '#fff' }}>
        <Dropdown items={items}>
          <button>Actions</button>
        </Dropdown>
      </div>,
    );
    await screen.getByText('Actions').click();
    await expect(screen.container).toMatchScreenshot();
  });
});
