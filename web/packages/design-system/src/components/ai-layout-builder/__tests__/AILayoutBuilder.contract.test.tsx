// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { AILayoutBuilder, type LayoutBlock } from '../AILayoutBuilder';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => cleanup());

const makeBlocks = (): LayoutBlock[] => [
  { key: 'b1', type: 'metric', title: 'Revenue', content: <span>$100k</span> },
  { key: 'b2', type: 'chart', title: 'Trend', content: <span>Chart here</span> },
  { key: 'b3', type: 'text', title: 'Notes', content: <span>Some notes</span> },
];

describe('AILayoutBuilder contract', () => {
  it('has displayName', () => {
    expect(AILayoutBuilder.displayName).toBe('AILayoutBuilder');
  });

  it('renders with required props', () => {
    const { container } = render(<AILayoutBuilder blocks={makeBlocks()} />);
    expect(container.querySelector('[data-component="ai-layout-builder"]')).toBeInTheDocument();
  });

  it('renders block titles', () => {
    render(<AILayoutBuilder blocks={makeBlocks()} />);
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByText('Trend')).toBeInTheDocument();
    expect(screen.getByText('Notes')).toBeInTheDocument();
  });

  it('merges custom className', () => {
    const { container } = render(<AILayoutBuilder blocks={makeBlocks()} className="custom-layout" />);
    expect(container.querySelector('.custom-layout')).toBeInTheDocument();
  });

  it('renders title and description', () => {
    render(<AILayoutBuilder blocks={makeBlocks()} title="Dashboard" description="Overview metrics" />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Overview metrics')).toBeInTheDocument();
  });

  it('sets data-intent attribute', () => {
    const { container } = render(<AILayoutBuilder blocks={makeBlocks()} intent="monitoring" />);
    expect(container.querySelector('[data-intent="monitoring"]')).toBeInTheDocument();
  });

  it('sets data-access-state attribute', () => {
    const { container } = render(<AILayoutBuilder blocks={makeBlocks()} access="readonly" />);
    expect(container.querySelector('[data-access-state="readonly"]')).toBeInTheDocument();
  });

  it('returns null when access is hidden', () => {
    const { container } = render(<AILayoutBuilder blocks={makeBlocks()} access="hidden" />);
    expect(container.querySelector('[data-component="ai-layout-builder"]')).not.toBeInTheDocument();
  });

  it('renders blocks as regions', () => {
    render(<AILayoutBuilder blocks={makeBlocks()} />);
    expect(screen.getAllByRole('region').length).toBeGreaterThanOrEqual(3);
  });
});

describe('AILayoutBuilder — accessibility', () => {
  it('has no axe-core a11y violations', async () => {
    const { container } = render(<AILayoutBuilder blocks={makeBlocks()} />);
    await expectNoA11yViolations(container);
  });
});
