// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CitationPanel, type CitationPanelItem } from '../CitationPanel';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => cleanup());

const makeItems = (): CitationPanelItem[] => [
  { id: 'c1', title: 'Policy Alpha', excerpt: 'Excerpt one', source: 'Source A', kind: 'policy' },
  { id: 'c2', title: 'Doc Beta', excerpt: 'Excerpt two', source: 'Source B', kind: 'doc' },
];

describe('CitationPanel contract', () => {
  it('has displayName', () => {
    expect(CitationPanel.displayName).toBe('CitationPanel');
  });

  it('renders with required props', () => {
    const { container } = render(<CitationPanel items={makeItems()} />);
    expect(container.querySelector('[data-component="citation-panel"]')).toBeInTheDocument();
  });

  it('renders citation items', () => {
    render(<CitationPanel items={makeItems()} />);
    expect(screen.getByText('Policy Alpha')).toBeInTheDocument();
    expect(screen.getByText('Doc Beta')).toBeInTheDocument();
  });

  it('renders custom title and description', () => {
    render(<CitationPanel items={[]} title="Sources" description="All references" />);
    expect(screen.getByText('Sources')).toBeInTheDocument();
    expect(screen.getByText('All references')).toBeInTheDocument();
  });

  it('merges custom className', () => {
    const { container } = render(<CitationPanel items={[]} className="custom-panel" />);
    expect(container.querySelector('.custom-panel')).toBeInTheDocument();
  });

  it('renders empty state when items is empty', () => {
    const { container } = render(<CitationPanel items={[]} />);
    expect(container.querySelector('[data-component="citation-panel"]')).toBeInTheDocument();
  });

  it('fires onOpenCitation callback', async () => {
    const handler = vi.fn();
    const user = userEvent.setup();
    render(<CitationPanel items={makeItems()} onOpenCitation={handler} />);
    await user.click(screen.getByText('Policy Alpha'));
    expect(handler).toHaveBeenCalledWith('c1', expect.objectContaining({ id: 'c1' }));
  });

  it('sets data-access-state attribute', () => {
    const { container } = render(<CitationPanel items={[]} access="disabled" />);
    expect(container.querySelector('[data-access-state="disabled"]')).toBeInTheDocument();
  });

  it('returns null when access is hidden', () => {
    const { container } = render(<CitationPanel items={[]} access="hidden" />);
    expect(container.querySelector('[data-component="citation-panel"]')).not.toBeInTheDocument();
  });
});

describe('CitationPanel — accessibility', () => {
  it('has no axe-core a11y violations', async () => {
    const { container } = render(<CitationPanel items={makeItems()} />);
    await expectNoA11yViolations(container);
  });
});
