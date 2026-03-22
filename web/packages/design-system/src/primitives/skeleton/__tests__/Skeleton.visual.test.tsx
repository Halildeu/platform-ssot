import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { Skeleton } from '../Skeleton';

describe('Skeleton Visual Regression', () => {
  it('default skeleton matches screenshot', async () => {
    render(
      <div style={{ padding: 20, background: '#fff', width: 300 }}>
        <Skeleton height={16} animated={false} />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
