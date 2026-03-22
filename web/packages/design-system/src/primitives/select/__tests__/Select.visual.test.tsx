import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { Select } from '../Select';

const options = [
  { value: 'a', label: 'Alpha' },
  { value: 'b', label: 'Beta' },
  { value: 'c', label: 'Gamma' },
];

describe('Select Visual Regression', () => {
  it('default state matches screenshot', async () => {
    const screen = render(
      <div style={{ padding: 20, background: '#fff' }}>
        <Select options={options} placeholder="Choose one" />
      </div>,
    );
    await expect(screen.container).toMatchScreenshot();
  });

  it('disabled state matches screenshot', async () => {
    const screen = render(
      <div style={{ padding: 20, background: '#fff' }}>
        <Select options={options} defaultValue="a" disabled />
      </div>,
    );
    await expect(screen.container).toMatchScreenshot();
  });

  it('error state matches screenshot', async () => {
    const screen = render(
      <div style={{ padding: 20, background: '#fff' }}>
        <Select options={options} defaultValue="a" error />
      </div>,
    );
    await expect(screen.container).toMatchScreenshot();
  });
});
