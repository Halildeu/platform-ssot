import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { EmptyErrorLoading } from '../EmptyErrorLoading';

describe('EmptyErrorLoading Visual Regression', () => {
  it('empty mode matches screenshot', async () => {
    const screen = await render(
      <div style={{ padding: 20, background: '#fff', width: 400 }}>
        <EmptyErrorLoading mode="empty" />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
