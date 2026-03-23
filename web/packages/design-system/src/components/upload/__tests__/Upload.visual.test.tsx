/* eslint-disable semantic-theme/no-inline-color-literals */
import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { Upload } from '../Upload';

describe('Upload Visual Regression', () => {
  it('empty state matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: '#fff', width: 400 }}>
        <Upload label="Upload Files" />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
