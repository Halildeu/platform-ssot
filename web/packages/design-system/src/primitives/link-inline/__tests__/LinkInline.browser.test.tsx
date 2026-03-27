import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { LinkInline } from '../LinkInline';

describe('LinkInline (Browser)', () => {
  it('renders with text and href', async () => {
    const screen = await render(<LinkInline href="/about">About</LinkInline>);
    const link = screen.getByRole('link', { name: 'About' });
    await expect.element(link).toBeVisible();
  });

  it('renders external link with indicator', async () => {
    const screen = await render(
      <LinkInline href="https://example.com" external>External</LinkInline>,
    );
    const link = screen.getByRole('link', { name: /External/ });
    await expect.element(link).toBeVisible();
  });

  it('renders as disabled span when disabled', async () => {
    const screen = await render(<LinkInline href="/test" disabled>Disabled</LinkInline>);
    await expect.element(screen.getByText('Disabled')).toBeVisible();
    expect(document.querySelector('a')).toBeNull();
  });

  it('renders data-component attribute', async () => {
    await render(<LinkInline href="/test">Link</LinkInline>);
    const el = document.querySelector('[data-component="link-inline"]');
    expect(el).not.toBeNull();
  });

  it('renders primary tone by default', async () => {
    const screen = await render(<LinkInline href="/test">Primary</LinkInline>);
    await expect.element(screen.getByRole('link', { name: 'Primary' })).toBeVisible();
  });

  it('renders secondary tone', async () => {
    const screen = await render(<LinkInline href="/test" tone="secondary">Secondary</LinkInline>);
    await expect.element(screen.getByText('Secondary')).toBeVisible();
  });

  it('renders with current aria attribute', async () => {
    await render(<LinkInline href="/current" current>Current Page</LinkInline>);
    const link = document.querySelector('[aria-current="page"]');
    expect(link).not.toBeNull();
  });

  it('renders nothing when access is hidden', async () => {
    const screen = await render(<LinkInline href="/test" access="hidden">Hidden</LinkInline>);
    expect(screen.container.innerHTML.trim()).toBe('');
  });
});
