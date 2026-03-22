import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { Text } from '../Text';

describe('Text (Browser)', () => {
  it('renders children text', async () => {
    const screen = render(<Text>Hello world</Text>);
    await expect.element(screen.getByText('Hello world')).toBeVisible();
  });

  it('renders as heading element', async () => {
    const screen = render(<Text as="h1" size="3xl" weight="bold">Title</Text>);
    const heading = screen.getByRole('heading', { level: 1 });
    await expect.element(heading).toBeVisible();
  });

  it('renders with variant', async () => {
    const screen = render(<Text variant="error">Error text</Text>);
    await expect.element(screen.getByText('Error text')).toBeVisible();
  });
});
