import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { Cascader } from '../Cascader';

const options = [
  { value: 'asia', label: 'Asia', children: [{ value: 'china', label: 'China' }] },
  { value: 'europe', label: 'Europe', children: [{ value: 'germany', label: 'Germany' }] },
];

describe('Cascader Visual Regression', () => {
  it('closed state matches screenshot', async () => {
    const screen = render(
      <div style={{ padding: 20, background: '#fff', width: 300 }}>
        <Cascader options={options} placeholder="Select..." />
      </div>,
    );
    await expect(screen.container).toMatchScreenshot();
  });
});
