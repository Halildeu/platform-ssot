import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { Descriptions } from '../Descriptions';

const items = [
  { key: 'name', label: 'Name', value: 'John Doe' },
  { key: 'email', label: 'Email', value: 'john@example.com' },
];

describe('Descriptions Visual Regression', () => {
  it('default layout matches screenshot', async () => {
    const screen = render(
      <div style={{ padding: 20, background: '#fff', width: 500 }}>
        <Descriptions items={items} title="User Info" />
      </div>,
    );
    await expect(screen.container).toMatchScreenshot();
  });
});
