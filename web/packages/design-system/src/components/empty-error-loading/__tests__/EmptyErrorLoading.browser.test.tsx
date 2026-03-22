import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { EmptyErrorLoading } from '../EmptyErrorLoading';

describe('EmptyErrorLoading (Browser)', () => {
  it('renders empty mode', async () => {
    const screen = render(<EmptyErrorLoading mode="empty" />);
    await expect.element(screen.getByText('Veri bulunamadi.')).toBeVisible();
  });

  it('renders error mode with retry', async () => {
    const screen = render(<EmptyErrorLoading mode="error" onRetry={() => {}} />);
    await expect.element(screen.getByText('Retry')).toBeVisible();
  });
});
