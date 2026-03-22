import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { Mentions } from '../Mentions';

const options = [
  { key: 'alice', label: 'Alice' },
  { key: 'bob', label: 'Bob' },
];

describe('Mentions (Browser)', () => {
  it('renders textarea with placeholder', async () => {
    const screen = render(<Mentions options={options} placeholder="Type something..." />);
    await expect.element(screen.getByPlaceholderText('Type something...')).toBeVisible();
  });

  it('renders combobox wrapper', async () => {
    const screen = render(<Mentions options={options} />);
    await expect.element(screen.getByRole('combobox')).toBeVisible();
  });
});
