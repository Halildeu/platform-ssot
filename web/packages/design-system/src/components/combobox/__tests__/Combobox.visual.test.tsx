 
import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { Combobox } from '../Combobox';
import { LIGHT_BG_HEX } from '../../../__tests__/visual-constants';

const options = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
];

describe('Combobox Visual Regression', () => {
  it('closed combobox matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: LIGHT_BG_HEX, width: 300 }}>
        <Combobox label="Fruit" placeholder="Select..." options={options} />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  it('combobox with value matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: LIGHT_BG_HEX, width: 300 }}>
        <Combobox label="Fruit" options={options} defaultValue="banana" />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
