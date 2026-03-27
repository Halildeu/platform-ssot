// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { AIGuidedAuthoring } from '../AIGuidedAuthoring';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => cleanup());

describe('AIGuidedAuthoring contract', () => {
  it('has displayName', () => {
    expect(AIGuidedAuthoring.displayName).toBe('AIGuidedAuthoring');
  });

  it('renders with default props', () => {
    const { container } = render(<AIGuidedAuthoring />);
    expect(container.querySelector('[data-component="ai-guided-authoring"]')).toBeInTheDocument();
  });

  it('renders custom title', () => {
    render(<AIGuidedAuthoring title="Custom Title" />);
    expect(screen.getByText('Custom Title')).toBeInTheDocument();
  });

  it('renders custom description', () => {
    render(<AIGuidedAuthoring description="Custom description text" />);
    expect(screen.getByText('Custom description text')).toBeInTheDocument();
  });

  it('merges custom className', () => {
    const { container } = render(<AIGuidedAuthoring className="custom-class" />);
    expect(container.querySelector('.custom-class')).toBeInTheDocument();
  });

  it('renders recommendations', () => {
    const recommendations = [
      { id: 'r1', title: 'Rec One', summary: 'Summary one' },
      { id: 'r2', title: 'Rec Two', summary: 'Summary two' },
    ];
    render(<AIGuidedAuthoring recommendations={recommendations} />);
    expect(screen.getByText('Rec One')).toBeInTheDocument();
    expect(screen.getByText('Rec Two')).toBeInTheDocument();
  });

  it('renders confidence badge with level prop', () => {
    const { container } = render(<AIGuidedAuthoring confidenceLevel="high" />);
    expect(container.querySelector('[data-confidence-level="high"]')).toBeInTheDocument();
  });

  it('sets data-access-state attribute', () => {
    const { container } = render(<AIGuidedAuthoring access="readonly" />);
    expect(container.querySelector('[data-access-state="readonly"]')).toBeInTheDocument();
  });

  it('returns null when access is hidden', () => {
    const { container } = render(<AIGuidedAuthoring access="hidden" />);
    expect(container.querySelector('[data-component="ai-guided-authoring"]')).not.toBeInTheDocument();
  });
});

describe('AIGuidedAuthoring — accessibility', () => {
  it('has no axe-core a11y violations', async () => {
    const { container } = render(<AIGuidedAuthoring />);
    await expectNoA11yViolations(container);
  });
});
