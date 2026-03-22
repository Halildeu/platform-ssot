import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { ToastProvider, useToast } from '../Toast';

function ToastTrigger({ variant, message }: { variant: 'success' | 'error' | 'info'; message: string }) {
  const toast = useToast();
  return <button onClick={() => toast[variant](message)}>Show Toast</button>;
}

describe('Toast (Browser)', () => {
  it('renders toast on trigger', async () => {
    const screen = render(
      <ToastProvider>
        <ToastTrigger variant="success" message="Item saved!" />
      </ToastProvider>,
    );
    await screen.getByText('Show Toast').click();
    await expect.element(screen.getByText('Item saved!')).toBeVisible();
  });

  it('renders error toast', async () => {
    const screen = render(
      <ToastProvider>
        <ToastTrigger variant="error" message="Something went wrong" />
      </ToastProvider>,
    );
    await screen.getByText('Show Toast').click();
    await expect.element(screen.getByText('Something went wrong')).toBeVisible();
  });
});
