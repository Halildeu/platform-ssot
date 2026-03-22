import { describe, it, expect, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { ApprovalCheckpoint } from '../ApprovalCheckpoint';

describe('ApprovalCheckpoint (Browser)', () => {
  it('renders with title and summary', async () => {
    const screen = await render(
      <ApprovalCheckpoint title="Release Gate" summary="Needs human approval" />,
    );
    await expect.element(screen.getByText('Release Gate')).toBeVisible();
  });

  it('renders primary action button', async () => {
    const screen = await render(
      <ApprovalCheckpoint title="Gate" summary="Summary" />,
    );
    await expect.element(screen.getByText('Onayla')).toBeVisible();
  });

  it('renders status badge for approved', async () => {
    const screen = await render(
      <ApprovalCheckpoint title="Gate" summary="Summary" status="approved" />,
    );
    await expect.element(screen.getByText('Onaylandi')).toBeVisible();
  });

  it('renders status badge for rejected', async () => {
    const screen = await render(
      <ApprovalCheckpoint title="Gate" summary="Summary" status="rejected" />,
    );
    await expect.element(screen.getByText('Reddedildi')).toBeVisible();
  });

  it('calls onPrimaryAction when approve button is clicked', async () => {
    const onPrimary = vi.fn();
    const screen = await render(
      <ApprovalCheckpoint title="Gate" summary="Summary" onPrimaryAction={onPrimary} />,
    );
    await screen.getByText('Onayla').click();
    expect(onPrimary).toHaveBeenCalledOnce();
  });

  it('renders data-component attribute', async () => {
    const screen = await render(
      <ApprovalCheckpoint title="Gate" summary="Summary" />,
    );
    const el = document.querySelector('[data-component="approval-checkpoint"]');
    expect(el).not.toBeNull();
  });

  it('renders nothing when access is hidden', async () => {
    const screen = await render(
      <ApprovalCheckpoint title="Gate" summary="Summary" access="hidden" />,
    );
    expect(document.querySelector('[data-component="approval-checkpoint"]')).toBeNull();
  });

  it('renders custom action labels', async () => {
    const screen = await render(
      <ApprovalCheckpoint
        title="Gate"
        summary="Summary"
        primaryActionLabel="Accept"
        secondaryActionLabel="Decline"
      />,
    );
    await expect.element(screen.getByText('Accept')).toBeVisible();
    await expect.element(screen.getByText('Decline')).toBeVisible();
  });
});
