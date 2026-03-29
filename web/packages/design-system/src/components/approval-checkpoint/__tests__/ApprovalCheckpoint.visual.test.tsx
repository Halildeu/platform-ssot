 
import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { ApprovalCheckpoint } from '../ApprovalCheckpoint';
import { LIGHT_BG_HEX } from '../../../__tests__/visual-constants';

describe('ApprovalCheckpoint Visual Regression', () => {
  it('pending state matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: LIGHT_BG_HEX, width: 500 }}>
        <ApprovalCheckpoint title="Release Gate" summary="Approval required" status="pending" />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
