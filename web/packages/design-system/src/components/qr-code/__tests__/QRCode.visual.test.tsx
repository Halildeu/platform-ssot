import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { QRCode } from '../QRCode';

describe('QRCode Visual Regression', () => {
  it('default QR code matches screenshot', async () => {
    const screen = await render(
      <div style={{ padding: 20, background: '#fff' }}>
        <QRCode value="https://example.com" size={128} />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
