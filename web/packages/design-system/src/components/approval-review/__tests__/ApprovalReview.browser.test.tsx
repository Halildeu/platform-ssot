import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { ApprovalReview } from '../ApprovalReview';

describe('ApprovalReview (Browser)', () => {
  it('renders without crashing', async () => {
    const screen = render(
      <ApprovalReview
        checkpoint={{ title: 'Gate', summary: 'Summary' }}
        citations={[]}
        auditItems={[]}
      />,
    );
    await expect.element(screen.getByText('Approval review')).toBeVisible();
  });

  it('renders checkpoint within review', async () => {
    const screen = render(
      <ApprovalReview
        checkpoint={{ title: 'Deploy Gate', summary: 'Check before deploy' }}
        citations={[{ id: 'c1', title: 'Policy', excerpt: 'Excerpt', source: 'Internal' }]}
        auditItems={[{ id: 'a1', actor: 'ai', title: 'Scan', timestamp: '10:00' }]}
      />,
    );
    await expect.element(screen.getByText('Deploy Gate')).toBeVisible();
    await expect.element(screen.getByText('Policy')).toBeVisible();
  });
});
