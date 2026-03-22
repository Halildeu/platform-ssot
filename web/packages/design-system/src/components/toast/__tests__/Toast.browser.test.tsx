import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { ToastProvider, useToast } from '../Toast';

function ToastTrigger({ variant, message, title }: { variant: 'success' | 'error' | 'info' | 'warning'; message: string; title?: string }) {
  const toast = useToast();
  return <button onClick={() => toast[variant](message, title ? { title } : undefined)}>Show Toast</button>;
}

describe('Toast (Browser)', () => {
  it('renders success toast on trigger', async () => {
    render(
      <ToastProvider>
        <ToastTrigger variant="success" message="Item saved!" />
      </ToastProvider>,
    );
    await screen.getByText('Show Toast').click();
    await expect.element(screen.getByText('Item saved!')).toBeVisible();
  });

  it('renders error toast', async () => {
    render(
      <ToastProvider>
        <ToastTrigger variant="error" message="Something went wrong" />
      </ToastProvider>,
    );
    await screen.getByText('Show Toast').click();
    await expect.element(screen.getByText('Something went wrong')).toBeVisible();
  });

  it('renders info toast', async () => {
    render(
      <ToastProvider>
        <ToastTrigger variant="info" message="FYI: Update available" />
      </ToastProvider>,
    );
    await screen.getByText('Show Toast').click();
    await expect.element(screen.getByText('FYI: Update available')).toBeVisible();
  });

  it('renders warning toast', async () => {
    render(
      <ToastProvider>
        <ToastTrigger variant="warning" message="Disk space low" />
      </ToastProvider>,
    );
    await screen.getByText('Show Toast').click();
    await expect.element(screen.getByText('Disk space low')).toBeVisible();
  });

  it('renders toast with title', async () => {
    render(
      <ToastProvider>
        <ToastTrigger variant="success" message="Done!" title="Operation Complete" />
      </ToastProvider>,
    );
    await screen.getByText('Show Toast').click();
    await expect.element(screen.getByText('Operation Complete')).toBeVisible();
  });

  it('renders dismiss button on toast', async () => {
    render(
      <ToastProvider>
        <ToastTrigger variant="success" message="Dismissable" />
      </ToastProvider>,
    );
    await screen.getByText('Show Toast').click();
    await expect.element(screen.getByText('Dismissable')).toBeVisible();
    const dismissBtn = screen.getByLabelText('Dismiss');
    await expect.element(dismissBtn).toBeVisible();
  });

  it('renders children inside provider', async () => {
    render(
      <ToastProvider>
        <div>App Content</div>
      </ToastProvider>,
    );
    await expect.element(screen.getByText('App Content')).toBeVisible();
  });
});
