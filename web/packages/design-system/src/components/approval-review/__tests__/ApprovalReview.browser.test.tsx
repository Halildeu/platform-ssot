import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { ApprovalReview } from '../ApprovalReview';

const baseProps = {
  checkpoint: { title: 'Deploy Gate', summary: 'Check before deploy' },
  citations: [{ id: 'c1', title: 'Policy', excerpt: 'Excerpt text', source: 'Internal' }],
  auditItems: [{ id: 'a1', actor: 'ai' as const, title: 'Scan', timestamp: '10:00' }],
};

describe('ApprovalReview (Browser)', () => {
  it('renders default title', async () => {
    render(
      <ApprovalReview checkpoint={{ title: 'Gate', summary: 'Summary' }} citations={[]} auditItems={[]} />,
    );
    await expect.element(screen.getByText('Approval review')).toBeVisible();
  });

  it('renders checkpoint section', async () => {
    const screen = await render(<ApprovalReview {...baseProps} />);
    await expect.element(screen.getByText('Deploy Gate')).toBeVisible();
  });

  it('renders citation items', async () => {
    const screen = await render(<ApprovalReview {...baseProps} />);
    await expect.element(screen.getByText('Policy')).toBeVisible();
  });

  it('renders audit timeline items', async () => {
    const screen = await render(<ApprovalReview {...baseProps} />);
    await expect.element(screen.getByText('Scan')).toBeVisible();
  });

  it('renders data-component attribute', async () => {
    const screen = await render(<ApprovalReview {...baseProps} />);
    const el = document.querySelector('[data-component="approval-review"]');
    expect(el).not.toBeNull();
  });

  it('renders nothing when access is hidden', async () => {
    const screen = await render(<ApprovalReview {...baseProps} access="hidden" />);
    expect(document.querySelector('[data-component="approval-review"]')).toBeNull();
  });

  it('renders custom title and description', async () => {
    render(
      <ApprovalReview {...baseProps} title="Custom Review" description="Custom description" />,
    );
    await expect.element(screen.getByText('Custom Review')).toBeVisible();
    await expect.element(screen.getByText('Custom description')).toBeVisible();
  });

  it('renders with empty citations and audit items', async () => {
    render(
      <ApprovalReview checkpoint={{ title: 'Gate', summary: 'Sum' }} citations={[]} auditItems={[]} />,
    );
    await expect.element(screen.getByText('Gate')).toBeVisible();
  });
});
