import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { Tag } from '../Tag';

describe('Tag Visual Regression', () => {
  it('default variant matches screenshot', async () => {
    render(
      <div style={{ padding: 20, background: '#fff' }}>
        <Tag>Default</Tag>
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  it('closable variant matches screenshot', async () => {
    render(
      <div style={{ padding: 20, background: '#fff' }}>
        <Tag closable>Closable</Tag>
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  it('color variants match screenshot', async () => {
    render(
      <div style={{ padding: 20, background: '#fff', display: 'flex', gap: 8 }}>
        <Tag variant="primary">Primary</Tag>
        <Tag variant="success">Success</Tag>
        <Tag variant="warning">Warning</Tag>
        <Tag variant="error">Error</Tag>
        <Tag variant="info">Info</Tag>
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
