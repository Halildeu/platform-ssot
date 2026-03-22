import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { Upload } from '../Upload';

describe('Upload Visual Regression', () => {
  it('empty state matches screenshot', async () => {
    const screen = render(
      <div style={{ padding: 20, background: '#fff', width: 400 }}>
        <Upload label="Upload Files" />
      </div>,
    );
    await expect(screen.container).toMatchScreenshot();
  });
});
