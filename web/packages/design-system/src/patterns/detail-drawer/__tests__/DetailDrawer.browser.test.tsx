import { describe, it, expect, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { DetailDrawer } from '../DetailDrawer';

describe('DetailDrawer (Browser)', () => {
  it('renders title and content when open', async () => {
    const screen = await render(
      <DetailDrawer open onClose={() => {}} title="Order #1234">
        <p>Order details here</p>
      </DetailDrawer>,
    );
    await expect.element(screen.getByText('Order #1234')).toBeVisible();
    await expect.element(screen.getByText('Order details here')).toBeVisible();
  });

  it('does not render dialog when closed', async () => {
    await render(
      <DetailDrawer open={false} onClose={() => {}} title="Hidden">
        <p>Hidden content</p>
      </DetailDrawer>,
    );
    expect(document.querySelector('[role="dialog"]')).toBeNull();
  });

  it('renders close button', async () => {
    const screen = await render(
      <DetailDrawer open onClose={() => {}} title="Closable">
        <p>Content</p>
      </DetailDrawer>,
    );
    await expect.element(screen.getByLabelText('Close drawer')).toBeVisible();
  });

  it('calls onClose when close button is clicked', async () => {
    const onClose = vi.fn();
    const screen = await render(
      <DetailDrawer open onClose={onClose} title="Test">
        <p>Content</p>
      </DetailDrawer>,
    );
    await screen.getByLabelText('Close drawer').click();
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('renders subtitle when provided', async () => {
    const screen = await render(
      <DetailDrawer open onClose={() => {}} title="Order" subtitle="Order details">
        <p>Body</p>
      </DetailDrawer>,
    );
    await expect.element(screen.getByText('Order details')).toBeVisible();
  });

  it('renders sections', async () => {
    const screen = await render(
      <DetailDrawer
        open
        onClose={() => {}}
        title="Detail"
        sections={[
          { key: 's1', title: 'Section 1', content: <p>Section content</p> },
        ]}
      />,
    );
    await expect.element(screen.getByText('Section 1')).toBeVisible();
    await expect.element(screen.getByText('Section content')).toBeVisible();
  });

  it('renders footer slot', async () => {
    const screen = await render(
      <DetailDrawer open onClose={() => {}} title="Test" footer={<button>Save</button>}>
        <p>Content</p>
      </DetailDrawer>,
    );
    await expect.element(screen.getByText('Save')).toBeVisible();
  });

  it('renders dialog with role attribute', async () => {
    await render(
      <DetailDrawer open onClose={() => {}} title="Dialog">
        <p>Content</p>
      </DetailDrawer>,
    );
    const dialog = document.querySelector('[role="dialog"]');
    expect(dialog).not.toBeNull();
  });
});
