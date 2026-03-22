import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { ReportFilterPanel } from '../ReportFilterPanel';

describe('ReportFilterPanel Visual Regression', () => {
  it('filter panel matches screenshot', async () => {
    render(
      <div style={{ padding: 20, background: '#fff', width: 600 }}>
        <ReportFilterPanel onSubmit={() => {}} onReset={() => {}}>
          <input placeholder="Start date" />
          <input placeholder="End date" />
        </ReportFilterPanel>
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
