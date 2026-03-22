import { describe, it, expect, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { Alert } from '../Alert';

describe('Alert (Browser)', () => {
  it('renders with title and description', async () => {
    const screen = render(
      <Alert title="Heads up">This is an info alert.</Alert>,
    );
    await expect.element(screen.getByText('Heads up')).toBeVisible();
    await expect.element(screen.getByText('This is an info alert.')).toBeVisible();
  });

  it('has alert role', async () => {
    const screen = render(<Alert>Alert content</Alert>);
    await expect.element(screen.getByRole('alert')).toBeVisible();
  });

  it('renders close button when closable', async () => {
    const onClose = vi.fn();
    const screen = render(
      <Alert closable onClose={onClose}>
        Closable alert
      </Alert>,
    );
    const closeBtn = screen.getByLabelText('Dismiss');
    await expect.element(closeBtn).toBeVisible();
    await closeBtn.click();
    expect(onClose).toHaveBeenCalledOnce();
  });
});
