/* eslint-disable semantic-theme/no-inline-color-literals */
import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { JsonViewer } from '../JsonViewer';

describe('JsonViewer Visual Regression', () => {
  it('expanded JSON tree matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: '#fff', width: 500 }}>
        <JsonViewer value={{ name: 'Alice', active: true }} defaultExpandedDepth={2} />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
