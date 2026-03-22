import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { Breadcrumb } from '../Breadcrumb';

describe('Breadcrumb Visual Regression', () => {
  it('default with 3 items matches screenshot', async () => {
    const screen = render(
      <div style={{ padding: 20, background: '#fff' }}>
        <Breadcrumb
          items={[
            { label: 'Home' },
            { label: 'Category' },
            { label: 'Current Page' },
          ]}
        />
      </div>,
    );
    await expect(screen.container).toMatchScreenshot();
  });
});
