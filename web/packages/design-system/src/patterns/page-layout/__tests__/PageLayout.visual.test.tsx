import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { PageLayout } from '../PageLayout';

describe('PageLayout Visual Regression', () => {
  it('basic page layout matches screenshot', async () => {
    const screen = await render(
      <div style={{ background: '#fff', width: 800, minHeight: 400 }}>
        <PageLayout
          title="Dashboard"
          description="Overview of your workspace"
          actions={<button>New</button>}
        >
          <p>Main content area</p>
        </PageLayout>
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  it('page layout with footer matches screenshot', async () => {
    const screen = await render(
      <div style={{ background: '#fff', width: 800, minHeight: 400 }}>
        <PageLayout
          title="Settings"
          footer={<span>Footer content</span>}
        >
          <p>Settings body</p>
        </PageLayout>
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
