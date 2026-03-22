import { describe, it, expect, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { FormDrawer } from '../FormDrawer';

describe('FormDrawer (Browser)', () => {
  it('renders nothing when closed', async () => {
    render(
      <FormDrawer open={false} onClose={() => {}} title="Create">
        <div>Form content</div>
      </FormDrawer>,
    );
    expect(document.body.textContent).toBe('');
  });

  it('renders title when open', async () => {
    render(
      <FormDrawer open onClose={() => {}} title="Create Item">
        <div>Form content</div>
      </FormDrawer>,
    );
    await expect.element(screen.getByText('Create Item')).toBeVisible();
  });

  it('renders children content when open', async () => {
    render(
      <FormDrawer open onClose={() => {}} title="Create">
        <div>Form fields here</div>
      </FormDrawer>,
    );
    await expect.element(screen.getByText('Form fields here')).toBeVisible();
  });

  it('renders dialog with role', async () => {
    render(
      <FormDrawer open onClose={() => {}} title="Dialog">
        <div>Content</div>
      </FormDrawer>,
    );
    const dialog = document.querySelector('[role="dialog"]');
    expect(dialog).not.toBeNull();
  });

  it('renders close button', async () => {
    render(
      <FormDrawer open onClose={() => {}} title="Test">
        <div>Content</div>
      </FormDrawer>,
    );
    await expect.element(screen.getByLabelText('Close drawer')).toBeVisible();
  });

  it('calls onClose when close button is clicked', async () => {
    const onClose = vi.fn();
    render(
      <FormDrawer open onClose={onClose} title="Test">
        <div>Content</div>
      </FormDrawer>,
    );
    await screen.getByLabelText('Close drawer').click();
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('renders footer slot', async () => {
    render(
      <FormDrawer open onClose={() => {}} title="Test" footer={<button>Submit</button>}>
        <div>Content</div>
      </FormDrawer>,
    );
    await expect.element(screen.getByText('Submit')).toBeVisible();
  });

  it('renders subtitle', async () => {
    render(
      <FormDrawer open onClose={() => {}} title="Create" subtitle="Fill in the details">
        <div>Content</div>
      </FormDrawer>,
    );
    await expect.element(screen.getByText('Fill in the details')).toBeVisible();
  });
});
