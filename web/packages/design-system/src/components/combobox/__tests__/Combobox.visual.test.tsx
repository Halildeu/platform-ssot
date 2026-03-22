import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { Combobox } from '../Combobox';

const options = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
];

describe('Combobox Visual Regression', () => {
  it('closed combobox matches screenshot', async () => {
    const screen = await render(
      <div style={{ padding: 20, background: '#fff', width: 300 }}>
        <Combobox label="Fruit" placeholder="Select..." options={options} />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  it('combobox with value matches screenshot', async () => {
    const screen = await render(
      <div style={{ padding: 20, background: '#fff', width: 300 }}>
        <Combobox label="Fruit" options={options} defaultValue="banana" />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
