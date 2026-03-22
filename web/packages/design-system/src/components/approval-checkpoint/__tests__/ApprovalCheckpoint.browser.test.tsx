import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { ApprovalCheckpoint } from '../ApprovalCheckpoint';

describe('ApprovalCheckpoint (Browser)', () => {
  it('renders with title and summary', async () => {
    const screen = render(
      <ApprovalCheckpoint title="Release Gate" summary="Needs human approval before deploy" />,
    );
    await expect.element(screen.getByText('Release Gate')).toBeVisible();
    await expect.element(screen.getByText('Onayla')).toBeVisible();
  });

  it('renders status badge', async () => {
    const screen = render(
      <ApprovalCheckpoint title="Gate" summary="Summary" status="approved" />,
    );
    await expect.element(screen.getByText('Onaylandi')).toBeVisible();
  });
});
