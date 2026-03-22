import { describe, it, expect, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { CitationPanel } from '../CitationPanel';

const sampleItems = [
  { id: 'c1', title: 'Policy doc', excerpt: 'Relevant excerpt', source: 'Internal wiki', kind: 'policy' as const },
  { id: 'c2', title: 'Code ref', excerpt: 'Code snippet', source: 'GitHub', kind: 'code' as const },
];

describe('CitationPanel (Browser)', () => {
  it('renders citation items', async () => {
    const screen = render(<CitationPanel items={sampleItems} />);
    await expect.element(screen.getByText('Policy doc')).toBeVisible();
    await expect.element(screen.getByText('Relevant excerpt')).toBeVisible();
  });

  it('renders empty state when no items', async () => {
    const screen = render(<CitationPanel items={[]} />);
    await expect.element(screen.getByText('Kaynak bulunamadi.')).toBeVisible();
  });

  it('renders kind badge for each citation', async () => {
    const screen = render(<CitationPanel items={sampleItems} />);
    await expect.element(screen.getByText('policy')).toBeVisible();
    await expect.element(screen.getByText('code')).toBeVisible();
  });

  it('renders source information', async () => {
    const screen = render(<CitationPanel items={sampleItems} />);
    await expect.element(screen.getByText('Internal wiki')).toBeVisible();
    await expect.element(screen.getByText('GitHub')).toBeVisible();
  });

  it('calls onOpenCitation when item is clicked', async () => {
    const onOpen = vi.fn();
    const screen = render(<CitationPanel items={sampleItems} onOpenCitation={onOpen} />);
    await screen.getByText('Policy doc').click();
    expect(onOpen).toHaveBeenCalledWith('c1', expect.objectContaining({ id: 'c1' }));
  });

  it('renders data-component attribute', async () => {
    const screen = render(<CitationPanel items={sampleItems} />);
    const el = screen.container.querySelector('[data-component="citation-panel"]');
    expect(el).not.toBeNull();
  });

  it('renders nothing when access is hidden', async () => {
    const screen = render(<CitationPanel items={sampleItems} access="hidden" />);
    expect(screen.container.querySelector('[data-component="citation-panel"]')).toBeNull();
  });

  it('renders custom title', async () => {
    const screen = render(<CitationPanel items={[]} title="Sources" />);
    await expect.element(screen.getByText('Sources')).toBeVisible();
  });
});
