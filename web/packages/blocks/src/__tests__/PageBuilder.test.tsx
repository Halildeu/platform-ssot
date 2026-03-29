// @vitest-environment jsdom
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PageBuilder } from '../composition/PageBuilder';
import { createBlockRegistry } from '../registry';
import type { PageComposition } from '../types';

function MockBlockA({ label }: { label: string }) {
  return <div data-testid="block-a">{label}</div>;
}

function MockBlockB() {
  return <div data-testid="block-b">Block B content</div>;
}

function buildRegistry() {
  const registry = createBlockRegistry();
  registry.register({
    id: 'mock-a',
    name: 'Mock A',
    category: 'dashboard',
    description: 'Test block A',
    tags: ['test'],
    component: MockBlockA,
    defaultProps: { label: 'default-label' },
  });
  registry.register({
    id: 'mock-b',
    name: 'Mock B',
    category: 'crud',
    description: 'Test block B',
    tags: ['test'],
    component: MockBlockB,
  });
  return registry;
}

describe('PageBuilder', () => {
  it('renders blocks from composition', () => {
    const registry = buildRegistry();
    const composition: PageComposition = {
      id: 'test',
      title: 'Test Page',
      layout: 'single',
      blocks: [
        { blockId: 'mock-a' },
        { blockId: 'mock-b' },
      ],
    };
    render(<PageBuilder composition={composition} registry={registry} />);
    expect(screen.getByText('Test Page')).toBeInTheDocument();
    expect(screen.getByTestId('block-a')).toHaveTextContent('default-label');
    expect(screen.getByTestId('block-b')).toHaveTextContent('Block B content');
  });

  it('overrides default props with composition props', () => {
    const registry = buildRegistry();
    const composition: PageComposition = {
      id: 'test',
      title: 'Override Test',
      layout: 'single',
      blocks: [{ blockId: 'mock-a', props: { label: 'overridden' } }],
    };
    render(<PageBuilder composition={composition} registry={registry} />);
    expect(screen.getByTestId('block-a')).toHaveTextContent('overridden');
  });

  it('shows fallback for missing blocks', () => {
    const registry = buildRegistry();
    const composition: PageComposition = {
      id: 'test',
      title: '',
      layout: 'single',
      blocks: [{ blockId: 'nonexistent' }],
    };
    render(<PageBuilder composition={composition} registry={registry} />);
    expect(screen.getByText(/Block not found: nonexistent/)).toBeInTheDocument();
  });

  it('respects block ordering', () => {
    const registry = buildRegistry();
    const composition: PageComposition = {
      id: 'test',
      title: '',
      layout: 'single',
      blocks: [
        { blockId: 'mock-b', order: 2 },
        { blockId: 'mock-a', order: 1 },
      ],
    };
    const { container } = render(
      <PageBuilder composition={composition} registry={registry} />,
    );
    const blocks = container.querySelectorAll('[data-testid]');
    expect(blocks[0]).toHaveAttribute('data-testid', 'block-a');
    expect(blocks[1]).toHaveAttribute('data-testid', 'block-b');
  });
});
