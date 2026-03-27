import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { ToastProvider, useToast } from '../Toast';

function ToastTrigger({ variant, message }: { variant: 'success' | 'error'; message: string }) {
  const toast = useToast();
  return <button onClick={() => toast[variant](message)}>Trigger</button>;
}

describe('Toast Visual Regression', () => {
  it('success toast matches screenshot', async () => {
    const screen = await render(
      <ToastProvider position="top-right">
        <ToastTrigger variant="success" message="Saved successfully" />
      </ToastProvider>,
    );
    await screen.getByText('Trigger').click();
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  it('error toast matches screenshot', async () => {
    const screen = await render(
      <ToastProvider position="top-right">
        <ToastTrigger variant="error" message="Failed to save" />
      </ToastProvider>,
    );
    await screen.getByText('Trigger').click();
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
