/* eslint-disable semantic-theme/no-inline-color-literals */
import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { AIActionAuditTimeline } from '../AIActionAuditTimeline';
import { LIGHT_BG_HEX } from '../../../__tests__/visual-constants';

describe('AIActionAuditTimeline Visual Regression', () => {
  it('timeline with items matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: LIGHT_BG_HEX, width: 500 }}>
        <AIActionAuditTimeline
          items={[
            { id: '1', actor: 'ai', title: 'Draft created', timestamp: '09:00', status: 'drafted' },
            { id: '2', actor: 'human', title: 'Review done', timestamp: '09:30', status: 'approved' },
          ]}
        />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
