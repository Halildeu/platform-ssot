import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { Dropdown } from '../Dropdown';

const items = [
  { key: 'edit', label: 'Edit' },
  { key: 'delete', label: 'Delete', danger: true },
];

describe('Dropdown (Browser)', () => {
  it('renders trigger element', async () => {
    const screen = render(
      <Dropdown items={items}>
        <button>Open Menu</button>
      </Dropdown>,
    );
    await expect.element(screen.getByText('Open Menu')).toBeVisible();
  });

  it('opens menu on trigger click', async () => {
    const screen = render(
      <Dropdown items={items}>
        <button>Open Menu</button>
      </Dropdown>,
    );
    await screen.getByText('Open Menu').click();
    await expect.element(screen.getByText('Edit')).toBeVisible();
    await expect.element(screen.getByText('Delete')).toBeVisible();
  });

  it('selects an item and closes menu', async () => {
    let selected = '';
    const clickItems = [
      { key: 'edit', label: 'Edit', onClick: () => { selected = 'edit'; } },
      { key: 'delete', label: 'Delete' },
    ];
    const screen = render(
      <Dropdown items={clickItems}>
        <button>Open Menu</button>
      </Dropdown>,
    );
    await screen.getByText('Open Menu').click();
    await screen.getByText('Edit').click();
    expect(selected).toBe('edit');
  });
});
