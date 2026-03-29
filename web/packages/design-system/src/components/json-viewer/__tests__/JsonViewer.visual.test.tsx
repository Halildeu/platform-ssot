 
import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { JsonViewer } from '../JsonViewer';
import { LIGHT_BG_HEX } from '../../../__tests__/visual-constants';

describe('JsonViewer Visual Regression', () => {
  it('expanded JSON tree matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: LIGHT_BG_HEX, width: 500 }}>
        <JsonViewer value={{ name: 'Alice', active: true }} defaultExpandedDepth={2} />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
