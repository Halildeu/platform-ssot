import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { Pagination } from '../Pagination';

describe('Pagination Visual Regression', () => {
  it('default state matches screenshot', async () => {
    const screen = render(
      <div style={{ padding: 20, background: '#fff' }}>
        <Pagination total={100} current={3} pageSize={10} />
      </div>,
    );
    await expect(screen.container).toMatchScreenshot();
  });
});
