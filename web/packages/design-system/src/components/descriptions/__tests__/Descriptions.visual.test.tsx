 
import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { Descriptions } from '../Descriptions';
import { LIGHT_BG_HEX } from '../../../__tests__/visual-constants';

const items = [
  { key: 'name', label: 'Name', value: 'John Doe' },
  { key: 'email', label: 'Email', value: 'john@example.com' },
];

describe('Descriptions Visual Regression', () => {
  it('default layout matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: LIGHT_BG_HEX, width: 500 }}>
        <Descriptions items={items} title="User Info" />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
