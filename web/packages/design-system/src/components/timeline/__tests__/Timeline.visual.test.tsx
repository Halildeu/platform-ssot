 
import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { Timeline } from '../Timeline';
import { LIGHT_BG_HEX } from '../../../__tests__/visual-constants';

describe('Timeline Visual Regression', () => {
  it('default with 3 items matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: LIGHT_BG_HEX, width: 400 }}>
        <Timeline
          items={[
            { key: '1', children: 'First event', color: 'success' },
            { key: '2', children: 'Second event', color: 'primary' },
            { key: '3', children: 'Third event' },
          ]}
        />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
