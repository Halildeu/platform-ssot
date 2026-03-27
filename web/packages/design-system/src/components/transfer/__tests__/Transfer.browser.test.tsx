import { describe, it, expect, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { Transfer } from '../Transfer';

const data = [
  { key: 'a', label: 'Item A' },
  { key: 'b', label: 'Item B' },
  { key: 'c', label: 'Item C' },
];

describe('Transfer (Browser)', () => {
  it('renders two panels', async () => {
    const screen = await render(<Transfer dataSource={data} />);
    await expect.element(screen.getByTestId('transfer-panel-left')).toBeVisible();
    await expect.element(screen.getByTestId('transfer-panel-right')).toBeVisible();
  });

  it('renders items in source panel', async () => {
    const screen = await render(<Transfer dataSource={data} />);
    await expect.element(screen.getByText('Item A')).toBeVisible();
    await expect.element(screen.getByText('Item B')).toBeVisible();
    await expect.element(screen.getByText('Item C')).toBeVisible();
  });

  it('renders items in target panel when targetKeys given', async () => {
    const screen = await render(<Transfer dataSource={data} defaultTargetKeys={['b']} />);
    // Item B should be in the right panel
    await expect.element(screen.getByText('Item B')).toBeVisible();
  });

  it('moves items to target on selection and transfer', async () => {
    const onChange = vi.fn();
    const screen = await render(<Transfer dataSource={data} onChange={onChange} />);
    // Click on Item A checkbox to select it
    await screen.getByText('Item A').click();
    // Click the move-right button
    const moveRight = screen.getByLabelText('Move selected items to right');
    await moveRight.click();
    expect(onChange).toHaveBeenCalled();
  });

  it('renders panel titles', async () => {
    const screen = await render(<Transfer dataSource={data} titles={['Source', 'Target']} />);
    await expect.element(screen.getByText('Source')).toBeVisible();
    await expect.element(screen.getByText('Target')).toBeVisible();
  });

  it('supports search in panels', async () => {
    await render(<Transfer dataSource={data} searchable />);
    const searchInputs = document.querySelectorAll('input[type="search"], input[placeholder]');
    expect(searchInputs.length).toBeGreaterThan(0);
  });

  it('shows empty state when no items', async () => {
    const screen = await render(<Transfer dataSource={[]} />);
    // Both panels show empty state text, just verify at least one exists
    const emptyTexts = screen.container.querySelectorAll('span');
    const hasEmpty = Array.from(emptyTexts).some(el => el.textContent === 'Sonuc bulunamadi');
    expect(hasEmpty).toBe(true);
  });

  it('renders default panel titles', async () => {
    const screen = await render(<Transfer dataSource={data} />);
    await expect.element(screen.getByText('Kaynak')).toBeVisible();
    await expect.element(screen.getByText('Hedef')).toBeVisible();
  });
});
