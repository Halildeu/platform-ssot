/* eslint-disable semantic-theme/no-inline-color-literals */
import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { ApprovalReview } from '../ApprovalReview';

describe('ApprovalReview Visual Regression', () => {
  it('default state matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: '#fff', width: 800 }}>
        <ApprovalReview
          checkpoint={{ title: 'Gate', summary: 'Summary' }}
          citations={[]}
          auditItems={[]}
        />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
