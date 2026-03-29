 
import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { Skeleton } from '../Skeleton';
import { LIGHT_BG_HEX } from '../../../__tests__/visual-constants';

describe('Skeleton Visual Regression', () => {
  it('default skeleton matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: LIGHT_BG_HEX, width: 300 }}>
        <Skeleton height={16} animated={false} />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
