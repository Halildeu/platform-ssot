import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { Transfer } from '../Transfer';

const data = [
  { key: 'a', label: 'Item A' },
  { key: 'b', label: 'Item B' },
  { key: 'c', label: 'Item C' },
];

describe('Transfer (Browser)', () => {
  it('renders two panels', async () => {
    const screen = render(<Transfer dataSource={data} />);
    await expect.element(screen.getByTestId('transfer-panel-left')).toBeVisible();
    await expect.element(screen.getByTestId('transfer-panel-right')).toBeVisible();
  });

  it('renders items in source panel', async () => {
    const screen = render(<Transfer dataSource={data} />);
    await expect.element(screen.getByText('Item A')).toBeVisible();
    await expect.element(screen.getByText('Item B')).toBeVisible();
  });
});
