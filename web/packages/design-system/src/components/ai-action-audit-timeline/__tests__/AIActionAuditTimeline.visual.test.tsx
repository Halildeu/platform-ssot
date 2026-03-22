import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { AIActionAuditTimeline } from '../AIActionAuditTimeline';

describe('AIActionAuditTimeline Visual Regression', () => {
  it('timeline with items matches screenshot', async () => {
    const screen = render(
      <div style={{ padding: 20, background: '#fff', width: 500 }}>
        <AIActionAuditTimeline
          items={[
            { id: '1', actor: 'ai', title: 'Draft created', timestamp: '09:00', status: 'drafted' },
            { id: '2', actor: 'human', title: 'Review done', timestamp: '09:30', status: 'approved' },
          ]}
        />
      </div>,
    );
    await expect(screen.container).toMatchScreenshot();
  });
});
