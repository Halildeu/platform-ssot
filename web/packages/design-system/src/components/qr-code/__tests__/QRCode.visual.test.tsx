 
import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { QRCode } from '../QRCode';
import { LIGHT_BG_HEX } from '../../../__tests__/visual-constants';

describe('QRCode Visual Regression', () => {
  it('default QR code matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: LIGHT_BG_HEX }}>
        <QRCode value="https://example.com" size={128} />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
