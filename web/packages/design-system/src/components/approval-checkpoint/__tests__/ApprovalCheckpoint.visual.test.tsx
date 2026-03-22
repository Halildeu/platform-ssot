import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { ApprovalCheckpoint } from '../ApprovalCheckpoint';

describe('ApprovalCheckpoint Visual Regression', () => {
  it('pending state matches screenshot', async () => {
    const screen = await render(
      <div style={{ padding: 20, background: '#fff', width: 500 }}>
        <ApprovalCheckpoint title="Release Gate" summary="Approval required" status="pending" />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
