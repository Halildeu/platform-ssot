// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RecommendationCard } from '../RecommendationCard';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => cleanup());

describe('RecommendationCard contract', () => {
  it('has displayName', () => {
    expect(RecommendationCard.displayName).toBe('RecommendationCard');
  });

  it('renders with required props', () => {
    render(<RecommendationCard title="Card Title" summary="Card summary text" />);
    expect(screen.getByText('Card Title')).toBeInTheDocument();
    expect(screen.getByText('Card summary text')).toBeInTheDocument();
  });

  it('merges custom className', () => {
    const { container } = render(<RecommendationCard title="T" summary="S" className="custom-card" />);
    expect(container.querySelector('.custom-card')).toBeInTheDocument();
  });

  it('renders primary and secondary action buttons', () => {
    render(<RecommendationCard title="T" summary="S" primaryActionLabel="Do it" secondaryActionLabel="Check it" />);
    expect(screen.getByText('Do it')).toBeInTheDocument();
    expect(screen.getByText('Check it')).toBeInTheDocument();
  });

  it('fires onPrimaryAction callback', async () => {
    const handler = vi.fn();
    const user = userEvent.setup();
    render(<RecommendationCard title="T" summary="S" onPrimaryAction={handler} />);
    await user.click(screen.getByText('Apply'));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('renders rationale items', () => {
    render(<RecommendationCard title="T" summary="S" rationale={['Reason A', 'Reason B']} />);
    expect(screen.getByText('Reason A')).toBeInTheDocument();
    expect(screen.getByText('Reason B')).toBeInTheDocument();
  });

  it('renders citations as badges', () => {
    render(<RecommendationCard title="T" summary="S" citations={['ref-1', 'ref-2']} />);
    expect(screen.getByText('ref-1')).toBeInTheDocument();
    expect(screen.getByText('ref-2')).toBeInTheDocument();
  });

  it('sets data-tone attribute', () => {
    const { container } = render(<RecommendationCard title="T" summary="S" tone="warning" />);
    expect(container.querySelector('[data-tone="warning"]')).toBeInTheDocument();
  });

  it('returns null when access is hidden', () => {
    const { container } = render(<RecommendationCard title="T" summary="S" access="hidden" />);
    expect(container.querySelector('article')).not.toBeInTheDocument();
  });
});

describe('RecommendationCard — accessibility', () => {
  it('has no axe-core a11y violations', async () => {
    const { container } = render(<RecommendationCard title="Rec Title" summary="Rec Summary" />);
    await expectNoA11yViolations(container);
  });
});
