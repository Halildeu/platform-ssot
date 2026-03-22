import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { QRCode } from '../QRCode';

describe('QRCode Visual Regression', () => {
  it('default QR code matches screenshot', async () => {
    const screen = render(
      <div style={{ padding: 20, background: '#fff' }}>
        <QRCode value="https://example.com" size={128} />
      </div>,
    );
    await expect(screen.container).toMatchScreenshot();
  });
});
