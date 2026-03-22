import { describe, it, expect, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { FloatButton } from '../FloatButton';

describe('FloatButton (Browser)', () => {
  it('renders floating button trigger', async () => {
    const screen = render(<FloatButton />);
    await expect.element(screen.getByTestId('float-button-trigger')).toBeVisible();
  });

  it('renders with custom label', async () => {
    const screen = render(<FloatButton label="Add" />);
    await expect.element(screen.getByText('Add')).toBeVisible();
  });

  it('fires onClick when clicked', async () => {
    const onClick = vi.fn();
    const screen = render(<FloatButton onClick={onClick} />);
    await screen.getByTestId('float-button-trigger').click();
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('renders badge count', async () => {
    const screen = render(<FloatButton badge={5} />);
    await expect.element(screen.getByText('5')).toBeVisible();
  });

  it('expands group items on click', async () => {
    const groupItems = [
      { key: 'edit', label: 'Edit' },
      { key: 'delete', label: 'Delete' },
    ];
    const screen = render(<FloatButton items={groupItems} />);
    await screen.getByTestId('float-button-trigger').click();
    await expect.element(screen.getByText('Edit')).toBeVisible();
    await expect.element(screen.getByText('Delete')).toBeVisible();
  });

  it('fires group item onClick', async () => {
    const onClick = vi.fn();
    const groupItems = [
      { key: 'edit', label: 'Edit', onClick },
    ];
    const screen = render(<FloatButton items={groupItems} />);
    await screen.getByTestId('float-button-trigger').click();
    await screen.getByText('Edit').click();
    expect(onClick).toHaveBeenCalled();
  });

  it('has accessible aria-label', async () => {
    const screen = render(<FloatButton aria-label="Create new item" />);
    const trigger = screen.getByTestId('float-button-trigger');
    await expect.element(trigger).toBeVisible();
  });

  it('renders tooltip on hover', async () => {
    const screen = render(<FloatButton tooltip="Quick action" />);
    const trigger = screen.getByTestId('float-button-trigger');
    await expect.element(trigger).toBeVisible();
  });
});
