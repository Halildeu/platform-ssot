import { describe, it, expect, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { userEvent } from '@vitest/browser/context';
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
    await expect.element(screen.getByText('Item C')).toBeVisible();
  });

  it('renders items in target panel when targetKeys given', async () => {
    const screen = render(<Transfer dataSource={data} defaultTargetKeys={['b']} />);
    // Item B should be in the right panel
    await expect.element(screen.getByText('Item B')).toBeVisible();
  });

  it('moves items to target on selection and transfer', async () => {
    const onChange = vi.fn();
    const screen = render(<Transfer dataSource={data} onChange={onChange} />);
    // Click on Item A checkbox to select it
    await screen.getByText('Item A').click();
    // Click the move-right button
    const moveRight = screen.getByLabelText('Move to target');
    await moveRight.click();
    expect(onChange).toHaveBeenCalled();
  });

  it('renders panel titles', async () => {
    const screen = render(<Transfer dataSource={data} titles={['Source', 'Target']} />);
    await expect.element(screen.getByText('Source')).toBeVisible();
    await expect.element(screen.getByText('Target')).toBeVisible();
  });

  it('supports search in panels', async () => {
    const screen = render(<Transfer dataSource={data} searchable />);
    const searchInputs = screen.container.querySelectorAll('input[type="search"], input[placeholder]');
    expect(searchInputs.length).toBeGreaterThan(0);
  });

  it('shows empty state when no items', async () => {
    const screen = render(<Transfer dataSource={[]} />);
    await expect.element(screen.getByText('Sonuc bulunamadi')).toBeVisible();
  });

  it('renders default panel titles', async () => {
    const screen = render(<Transfer dataSource={data} />);
    await expect.element(screen.getByText('Kaynak')).toBeVisible();
    await expect.element(screen.getByText('Hedef')).toBeVisible();
  });
});
