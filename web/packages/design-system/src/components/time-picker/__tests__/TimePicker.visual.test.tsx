import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { TimePicker } from '../TimePicker';

describe('TimePicker Visual Regression', () => {
  it('empty state matches screenshot', async () => {
    render(
      <div style={{ padding: 20, background: '#fff', width: 300 }}>
        <TimePicker label="Meeting Time" />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
