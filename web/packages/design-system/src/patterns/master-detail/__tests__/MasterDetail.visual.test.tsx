 
import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { MasterDetail } from '../MasterDetail';
import { LIGHT_BG_HEX } from '../../../__tests__/visual-constants';

describe('MasterDetail Visual Regression', () => {
  it('split layout matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: LIGHT_BG_HEX, width: 700, height: 300 }}>
        <MasterDetail
          master={<div style={{ padding: 16 }}>Master list</div>}
          detail={<div style={{ padding: 16 }}>Detail view</div>}
        />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
