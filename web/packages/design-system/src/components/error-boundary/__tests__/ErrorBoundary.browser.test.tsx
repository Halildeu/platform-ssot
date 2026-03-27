import { describe, it, expect, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { ErrorBoundary } from '../ErrorBoundary';

const GoodChild = () => <div>All is well</div>;

const BadChild = () => {
  throw new Error('Test error');
};

describe('ErrorBoundary (Browser)', () => {
  it('renders children when no error', async () => {
    const screen = await render(
      <ErrorBoundary>
        <GoodChild />
      </ErrorBoundary>,
    );
    await expect.element(screen.getByText('All is well')).toBeVisible();
  });

  it('renders default fallback when child throws', async () => {
    const screen = await render(
      <ErrorBoundary>
        <BadChild />
      </ErrorBoundary>,
    );
    await expect.element(screen.getByRole('alert')).toBeVisible();
    await expect.element(screen.getByText('Something went wrong')).toBeVisible();
  });

  it('displays error message in fallback', async () => {
    const screen = await render(
      <ErrorBoundary>
        <BadChild />
      </ErrorBoundary>,
    );
    await expect.element(screen.getByText('Test error')).toBeVisible();
  });

  it('renders Try again button in default fallback', async () => {
    const screen = await render(
      <ErrorBoundary>
        <BadChild />
      </ErrorBoundary>,
    );
    await expect.element(screen.getByText('Try again')).toBeVisible();
  });

  it('renders custom static fallback', async () => {
    const screen = await render(
      <ErrorBoundary fallback={<div>Custom fallback content</div>}>
        <BadChild />
      </ErrorBoundary>,
    );
    await expect.element(screen.getByText('Custom fallback content')).toBeVisible();
  });

  it('renders custom fallback render function', async () => {
    const screen = await render(
      <ErrorBoundary fallback={(error) => <div>Error: {error.message}</div>}>
        <BadChild />
      </ErrorBoundary>,
    );
    await expect.element(screen.getByText('Error: Test error')).toBeVisible();
  });

  it('calls onError callback when error occurs', async () => {
    const onError = vi.fn();
    await render(
      <ErrorBoundary onError={onError}>
        <BadChild />
      </ErrorBoundary>,
    );
    expect(onError).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Test error' }),
      expect.any(Object),
    );
  });

  it('renders data-component attribute', async () => {
    await render(
      <ErrorBoundary>
        <GoodChild />
      </ErrorBoundary>,
    );
    const el = document.querySelector('[data-component="error-boundary"]');
    expect(el).not.toBeNull();
  });
});
