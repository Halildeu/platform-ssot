import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { CitationPanel } from '../CitationPanel';

describe('CitationPanel (Browser)', () => {
  it('renders citation items', async () => {
    const screen = render(
      <CitationPanel
        items={[
          { id: 'c1', title: 'Policy doc', excerpt: 'Relevant excerpt', source: 'Internal wiki', kind: 'policy' },
        ]}
      />,
    );
    await expect.element(screen.getByText('Policy doc')).toBeVisible();
    await expect.element(screen.getByText('Relevant excerpt')).toBeVisible();
  });

  it('renders empty state', async () => {
    const screen = render(<CitationPanel items={[]} />);
    await expect.element(screen.getByText('Kaynak bulunamadi.')).toBeVisible();
  });
});
