/* eslint-disable semantic-theme/no-inline-color-literals */
import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { CitationPanel } from '../CitationPanel';

describe('CitationPanel Visual Regression', () => {
  it('panel with citations matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: '#fff', width: 500 }}>
        <CitationPanel
          items={[
            { id: 'c1', title: 'Source A', excerpt: 'Key excerpt', source: 'Database', kind: 'doc' },
          ]}
        />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
