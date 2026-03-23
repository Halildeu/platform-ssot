import { describe, it, expect, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { Tag } from '../Tag';

describe('Tag (Browser)', () => {
  it('renders with text', async () => {
    const screen = await render(<Tag>Active</Tag>);
    await expect.element(screen.getByText('Active')).toBeVisible();
  });

  it('renders closable tag with remove button', async () => {
    const screen = await render(<Tag closable>Removable</Tag>);
    await expect.element(screen.getByText('Removable')).toBeVisible();
    await expect.element(screen.getByLabelText('Remove')).toBeVisible();
  });

  it('calls onClose when remove button is clicked', async () => {
    const onClose = vi.fn();
    const screen = await render(<Tag closable onClose={onClose}>Remove me</Tag>);
    await screen.getByLabelText('Remove').click();
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('renders success variant', async () => {
    const screen = await render(<Tag variant="success">Success</Tag>);
    await expect.element(screen.getByText('Success')).toBeVisible();
  });

  it('renders error variant', async () => {
    const screen = await render(<Tag variant="error">Error</Tag>);
    await expect.element(screen.getByText('Error')).toBeVisible();
  });

  it('renders warning variant', async () => {
    const screen = await render(<Tag variant="warning">Warning</Tag>);
    await expect.element(screen.getByText('Warning')).toBeVisible();
  });

  it('renders data-component attribute', async () => {
    await render(<Tag>Test</Tag>);
    const el = document.querySelector('[data-component="tag"]');
    expect(el).not.toBeNull();
  });

  it('renders different sizes', async () => {
    const screen = await render(
      <div>
        <Tag size="sm" data-testid="sm">Small</Tag>
        <Tag size="md" data-testid="md">Medium</Tag>
        <Tag size="lg" data-testid="lg">Large</Tag>
      </div>,
    );
    await expect.element(screen.getByTestId('sm')).toBeVisible();
    await expect.element(screen.getByTestId('md')).toBeVisible();
    await expect.element(screen.getByTestId('lg')).toBeVisible();
  });
});
