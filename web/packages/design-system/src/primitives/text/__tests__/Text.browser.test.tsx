import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { Text } from '../Text';

describe('Text (Browser)', () => {
  it('renders children text', async () => {
    const screen = await render(<Text>Hello world</Text>);
    await expect.element(screen.getByText('Hello world')).toBeVisible();
  });

  it('renders as heading element', async () => {
    const screen = await render(<Text as="h1" size="3xl" weight="bold">Title</Text>);
    const heading = screen.getByRole('heading', { level: 1 });
    await expect.element(heading).toBeVisible();
  });

  it('renders with error variant', async () => {
    const screen = await render(<Text variant="error">Error text</Text>);
    await expect.element(screen.getByText('Error text')).toBeVisible();
  });

  it('renders with secondary variant', async () => {
    const screen = await render(<Text variant="secondary">Secondary</Text>);
    await expect.element(screen.getByText('Secondary')).toBeVisible();
  });

  it('renders as span by default', async () => {
    const screen = await render(<Text>Default</Text>);
    const el = screen.container.querySelector('span');
    expect(el).not.toBeNull();
    expect(el!.textContent).toBe('Default');
  });

  it('renders as custom element', async () => {
    const screen = await render(<Text as="label">Label text</Text>);
    const label = document.querySelector('label');
    expect(label).not.toBeNull();
  });

  it('renders with truncate', async () => {
    const screen = await render(<Text truncate>Very long text that should be truncated</Text>);
    await expect.element(screen.getByText('Very long text that should be truncated')).toBeVisible();
  });

  it('renders with different sizes', async () => {
    const screen = await render(
      <div>
        <Text size="xs">Extra small</Text>
        <Text size="lg">Large text</Text>
        <Text size="2xl">Extra large</Text>
      </div>,
    );
    await expect.element(screen.getByText('Extra small')).toBeVisible();
    await expect.element(screen.getByText('Large text')).toBeVisible();
    await expect.element(screen.getByText('Extra large')).toBeVisible();
  });
});
