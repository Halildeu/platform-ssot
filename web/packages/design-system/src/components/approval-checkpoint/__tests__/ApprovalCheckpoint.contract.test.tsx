// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ApprovalCheckpoint } from '../ApprovalCheckpoint';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => cleanup());

describe('ApprovalCheckpoint contract', () => {
  const requiredProps = {
    title: 'Release Gate',
    summary: 'Review all evidence before approving.',
  };

  /* ---- Identity ---- */
  it('has displayName', () => {
    expect(ApprovalCheckpoint.displayName).toBe('ApprovalCheckpoint');
  });

  /* ---- Default render ---- */
  it('renders title and summary', () => {
    render(<ApprovalCheckpoint {...requiredProps} />);
    expect(screen.getByText('Release Gate')).toBeInTheDocument();
    expect(screen.getByText('Review all evidence before approving.')).toBeInTheDocument();
  });

  it('sets data-component attribute', () => {
    const { container } = render(<ApprovalCheckpoint {...requiredProps} />);
    expect(container.querySelector('[data-component="approval-checkpoint"]')).toBeInTheDocument();
  });

  /* ---- Status badge ---- */
  it('renders status badge with default pending', () => {
    render(<ApprovalCheckpoint {...requiredProps} />);
    expect(screen.getByText('Beklemede')).toBeInTheDocument();
  });

  it('renders approved status', () => {
    render(<ApprovalCheckpoint {...requiredProps} status="approved" />);
    expect(screen.getByText('Onaylandi')).toBeInTheDocument();
  });

  /* ---- Action buttons ---- */
  it('renders primary and secondary action buttons', () => {
    render(<ApprovalCheckpoint {...requiredProps} />);
    expect(screen.getByText('Onayla')).toBeInTheDocument();
    expect(screen.getByText('Inceleme talep et')).toBeInTheDocument();
  });

  /* ---- Callback: onPrimaryAction ---- */
  it('calls onPrimaryAction when primary button clicked', async () => {
    const handler = vi.fn();
    const user = userEvent.setup();
    render(<ApprovalCheckpoint {...requiredProps} onPrimaryAction={handler} />);
    await user.click(screen.getByText('Onayla'));
    expect(handler).toHaveBeenCalledOnce();
  });

  /* ---- className merging ---- */
  it('merges className', () => {
    const { container } = render(<ApprovalCheckpoint {...requiredProps} className="my-cls" />);
    const article = container.querySelector('[data-component="approval-checkpoint"]');
    expect(article?.className).toContain('my-cls');
  });

  /* ---- Access hidden ---- */
  it('renders nothing when access=hidden', () => {
    const { container } = render(<ApprovalCheckpoint {...requiredProps} access="hidden" />);
    expect(container.innerHTML).toBe('');
  });
});

describe('ApprovalCheckpoint — accessibility', () => {
  it('has no axe-core a11y violations', async () => {
    const { container } = render(
      <ApprovalCheckpoint title="Gate" summary="Summary" />,
    );
    await expectNoA11yViolations(container);
  });
});
