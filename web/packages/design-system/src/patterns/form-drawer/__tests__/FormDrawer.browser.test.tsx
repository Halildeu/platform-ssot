import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { FormDrawer } from '../FormDrawer';

describe('FormDrawer (Browser)', () => {
  it('renders nothing when closed', async () => {
    const screen = render(
      <FormDrawer open={false} onClose={() => {}} title="Create">
        <div>Form content</div>
      </FormDrawer>,
    );
    expect(screen.container.textContent).toBe('');
  });

  it('renders dialog when open', async () => {
    const screen = render(
      <FormDrawer open onClose={() => {}} title="Create Item">
        <div>Form content</div>
      </FormDrawer>,
    );
    await expect.element(screen.getByText('Create Item')).toBeVisible();
    await expect.element(screen.getByText('Form content')).toBeVisible();
  });
});
