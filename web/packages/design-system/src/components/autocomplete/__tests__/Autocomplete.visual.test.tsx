import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { Autocomplete } from '../Autocomplete';

const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
];

describe('Autocomplete Visual Regression', () => {
  it('default state matches screenshot', async () => {
    const screen = await render(
      <div style={{ padding: 20, background: '#fff', width: 300 }}>
        <Autocomplete options={options} placeholder="Search..." />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  it('with label matches screenshot', async () => {
    const screen = await render(
      <div style={{ padding: 20, background: '#fff', width: 300 }}>
        <Autocomplete options={options} label="Fruit" placeholder="Pick one" />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
