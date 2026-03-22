import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { ErrorBoundary } from '../ErrorBoundary';

const GoodChild = () => <div>All is well</div>;

const BadChild = () => {
  throw new Error('Test error');
};

describe('ErrorBoundary (Browser)', () => {
  it('renders children when no error', async () => {
    const screen = render(
      <ErrorBoundary>
        <GoodChild />
      </ErrorBoundary>,
    );
    await expect.element(screen.getByText('All is well')).toBeVisible();
  });

  it('renders fallback when child throws', async () => {
    const screen = render(
      <ErrorBoundary>
        <BadChild />
      </ErrorBoundary>,
    );
    await expect.element(screen.getByRole('alert')).toBeVisible();
    await expect.element(screen.getByText('Something went wrong')).toBeVisible();
  });
});
