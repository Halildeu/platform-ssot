// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { ConfidenceBadge } from '../ConfidenceBadge';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => cleanup());

describe('ConfidenceBadge contract', () => {
  it('has displayName', () => {
    expect(ConfidenceBadge.displayName).toBe('ConfidenceBadge');
  });

  it('renders with default props', () => {
    const { container } = render(<ConfidenceBadge />);
    expect(container.querySelector('[data-confidence-level="medium"]')).toBeInTheDocument();
  });

  it('renders correct label for each level', () => {
    const { rerender } = render(<ConfidenceBadge level="low" />);
    expect(screen.getByText(/Dusuk guven/)).toBeInTheDocument();

    rerender(<ConfidenceBadge level="high" />);
    expect(screen.getByText(/Yuksek guven/)).toBeInTheDocument();

    rerender(<ConfidenceBadge level="very-high" />);
    expect(screen.getByText(/Cok yuksek guven/)).toBeInTheDocument();
  });

  it('shows score when provided', () => {
    render(<ConfidenceBadge level="high" score={85} />);
    expect(screen.getByText(/85%/)).toBeInTheDocument();
  });

  it('shows source count in non-compact mode', () => {
    render(<ConfidenceBadge level="medium" sourceCount={3} />);
    expect(screen.getByText(/3 sources/)).toBeInTheDocument();
  });

  it('hides source count in compact mode', () => {
    render(<ConfidenceBadge level="medium" sourceCount={3} compact />);
    expect(screen.queryByText(/3 sources/)).not.toBeInTheDocument();
  });

  it('merges custom className', () => {
    const { container } = render(<ConfidenceBadge className="custom-badge" />);
    expect(container.querySelector('.custom-badge')).toBeInTheDocument();
  });

  it('renders custom label', () => {
    render(<ConfidenceBadge label="Custom label" />);
    expect(screen.getByText('Custom label')).toBeInTheDocument();
  });

  it('returns null when access is hidden', () => {
    const { container } = render(<ConfidenceBadge access="hidden" />);
    expect(container.querySelector('[data-confidence-level]')).not.toBeInTheDocument();
  });
});

describe('ConfidenceBadge — accessibility', () => {
  it('has no axe-core a11y violations', async () => {
    const { container } = render(<ConfidenceBadge level="high" score={90} />);
    await expectNoA11yViolations(container);
  });
});
