import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { MasterDetail } from '../MasterDetail';

describe('MasterDetail Visual Regression', () => {
  it('split layout matches screenshot', async () => {
    const screen = await render(
      <div style={{ padding: 20, background: '#fff', width: 700, height: 300 }}>
        <MasterDetail
          master={<div style={{ padding: 16 }}>Master list</div>}
          detail={<div style={{ padding: 16 }}>Detail view</div>}
        />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
