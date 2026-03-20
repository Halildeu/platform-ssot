// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { ApprovalReview } from '../ApprovalReview';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => cleanup());

const minimalProps = {
  checkpoint: {
    title: 'Gate 1',
    summary: 'Review before release',
  },
  citations: [
    { id: 'c1', title: 'Doc A', source: 'internal', url: '#' },
  ],
  auditItems: [
    {
      id: 'a1',
      actor: 'ai' as const,
      title: 'Generated report',
      timestamp: '2024-01-01',
    },
  ],
};

describe('ApprovalReview contract', () => {
  /* ---- Identity ---- */
  it('has displayName', () => {
    expect(ApprovalReview.displayName).toBe('ApprovalReview');
  });

  /* ---- Default render ---- */
  it('renders with default title', () => {
    render(<ApprovalReview {...minimalProps} />);
    expect(screen.getByText('Approval review')).toBeInTheDocument();
  });

  it('sets data-component attribute', () => {
    const { container } = render(<ApprovalReview {...minimalProps} />);
    expect(container.querySelector('[data-component="approval-review"]')).toBeInTheDocument();
  });

  /* ---- Custom title and description ---- */
  it('renders custom title', () => {
    render(<ApprovalReview {...minimalProps} title="Custom Title" />);
    expect(screen.getByText('Custom Title')).toBeInTheDocument();
  });

  it('renders custom description', () => {
    render(<ApprovalReview {...minimalProps} description="Custom desc" />);
    expect(screen.getByText('Custom desc')).toBeInTheDocument();
  });

  /* ---- Renders nested checkpoint ---- */
  it('renders approval checkpoint title', () => {
    render(<ApprovalReview {...minimalProps} />);
    expect(screen.getByText('Gate 1')).toBeInTheDocument();
  });

  /* ---- Renders audit timeline ---- */
  it('renders audit timeline item', () => {
    render(<ApprovalReview {...minimalProps} />);
    expect(screen.getByText('Generated report')).toBeInTheDocument();
  });

  /* ---- className merging ---- */
  it('merges className', () => {
    const { container } = render(<ApprovalReview {...minimalProps} className="review-cls" />);
    const section = container.querySelector('[data-component="approval-review"]');
    expect(section?.className).toContain('review-cls');
  });

  /* ---- Access hidden ---- */
  it('renders nothing when access=hidden', () => {
    const { container } = render(<ApprovalReview {...minimalProps} access="hidden" />);
    expect(container.innerHTML).toBe('');
  });
});

describe('ApprovalReview — accessibility', () => {
  it('has no axe-core a11y violations', async () => {
    const { container } = render(<ApprovalReview {...minimalProps} />);
    await expectNoA11yViolations(container);
  });
});
