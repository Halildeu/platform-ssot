import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { TableSimple } from '../TableSimple';

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'role', label: 'Role' },
];

const rows = [
  { name: 'Alice', role: 'Admin' },
  { name: 'Bob', role: 'User' },
];

describe('TableSimple Visual Regression', () => {
  it('default table matches screenshot', async () => {
    const screen = render(
      <div style={{ padding: 20, background: '#fff', width: 500 }}>
        <TableSimple columns={columns} rows={rows} caption="Team Members" />
      </div>,
    );
    await expect(screen.container).toMatchScreenshot();
  });
});
