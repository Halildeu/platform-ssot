import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { LinkInline } from '../LinkInline';

describe('LinkInline (Browser)', () => {
  it('renders with text and href', async () => {
    const screen = render(<LinkInline href="/about">About</LinkInline>);
    const link = screen.getByRole('link', { name: 'About' });
    await expect.element(link).toBeVisible();
  });

  it('renders external link with indicator', async () => {
    const screen = render(
      <LinkInline href="https://example.com" external>External</LinkInline>,
    );
    const link = screen.getByRole('link', { name: /External/ });
    await expect.element(link).toBeVisible();
  });

  it('renders as disabled span when disabled', async () => {
    const screen = render(<LinkInline href="/test" disabled>Disabled</LinkInline>);
    await expect.element(screen.getByText('Disabled')).toBeVisible();
    expect(screen.container.querySelector('a')).toBeNull();
  });
});
