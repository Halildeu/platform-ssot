import { describe, it, expect, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { EmptyErrorLoading } from '../EmptyErrorLoading';

describe('EmptyErrorLoading (Browser)', () => {
  it('renders empty mode with fallback text', async () => {
    const screen = render(<EmptyErrorLoading mode="empty" />);
    await expect.element(screen.getByText('Veri bulunamadi.')).toBeVisible();
  });

  it('renders error mode with retry button', async () => {
    const screen = render(<EmptyErrorLoading mode="error" onRetry={() => {}} />);
    await expect.element(screen.getByText('Retry')).toBeVisible();
  });

  it('renders loading mode with spinner', async () => {
    const screen = render(<EmptyErrorLoading mode="loading" />);
    await expect.element(screen.getByText('Loading')).toBeVisible();
  });

  it('calls onRetry when retry button is clicked', async () => {
    const onRetry = vi.fn();
    const screen = render(<EmptyErrorLoading mode="error" onRetry={onRetry} />);
    await screen.getByText('Retry').click();
    expect(onRetry).toHaveBeenCalledOnce();
  });

  it('renders data-mode attribute', async () => {
    const screen = render(<EmptyErrorLoading mode="loading" />);
    const el = screen.container.querySelector('[data-mode="loading"]');
    expect(el).not.toBeNull();
  });

  it('renders data-component attribute', async () => {
    const screen = render(<EmptyErrorLoading mode="empty" />);
    const el = screen.container.querySelector('[data-component="empty-error-loading"]');
    expect(el).not.toBeNull();
  });

  it('renders nothing when access is hidden', async () => {
    const screen = render(<EmptyErrorLoading mode="empty" access="hidden" />);
    expect(screen.container.querySelector('[data-component="empty-error-loading"]')).toBeNull();
  });

  it('renders custom title and description', async () => {
    const screen = render(
      <EmptyErrorLoading mode="empty" title="Custom Title" description="Custom Desc" />,
    );
    await expect.element(screen.getByText('Custom Title')).toBeVisible();
    await expect.element(screen.getByText('Custom Desc')).toBeVisible();
  });
});
