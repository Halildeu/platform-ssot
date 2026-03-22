import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { DetailSummary } from '../DetailSummary';

describe('DetailSummary Visual Regression', () => {
  it('default layout matches screenshot', async () => {
    render(
      <div style={{ padding: 20, background: '#fff', width: 800 }}>
        <DetailSummary
          title="Order #1234"
          entity={{
            title: 'Acme Corp',
            items: [
              { key: 'status', label: 'Status', value: 'Active' },
              { key: 'type', label: 'Type', value: 'Enterprise' },
            ],
          }}
        />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
