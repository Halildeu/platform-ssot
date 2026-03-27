import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { Badge } from '../Badge';

describe('Badge (Browser)', () => {
  it('renders with text', async () => {
    const screen = await render(<Badge>New</Badge>);
    await expect.element(screen.getByText('New')).toBeVisible();
  });

  it('renders success variant', async () => {
    const screen = await render(<Badge variant="success">Success</Badge>);
    await expect.element(screen.getByText('Success')).toBeVisible();
  });

  it('renders error variant', async () => {
    const screen = await render(<Badge variant="error">Error</Badge>);
    await expect.element(screen.getByText('Error')).toBeVisible();
  });

  it('renders warning variant', async () => {
    const screen = await render(<Badge variant="warning">Warning</Badge>);
    await expect.element(screen.getByText('Warning')).toBeVisible();
  });

  it('renders info variant', async () => {
    const screen = await render(<Badge variant="info">Info</Badge>);
    await expect.element(screen.getByText('Info')).toBeVisible();
  });

  it('renders as a dot', async () => {
    const screen = await render(<Badge dot variant="success" data-testid="dot-badge" />);
    expect(screen.container.querySelector('[data-testid="dot-badge"]')).not.toBeNull();
  });

  it('renders data-component attribute', async () => {
    await render(<Badge>Test</Badge>);
    const el = document.querySelector('[data-component="badge"]');
    expect(el).not.toBeNull();
  });

  it('renders different sizes', async () => {
    const screen = await render(
      <div>
        <Badge size="sm" data-testid="sm">Small</Badge>
        <Badge size="md" data-testid="md">Medium</Badge>
        <Badge size="lg" data-testid="lg">Large</Badge>
      </div>,
    );
    await expect.element(screen.getByTestId('sm')).toBeVisible();
    await expect.element(screen.getByTestId('md')).toBeVisible();
    await expect.element(screen.getByTestId('lg')).toBeVisible();
  });
});
