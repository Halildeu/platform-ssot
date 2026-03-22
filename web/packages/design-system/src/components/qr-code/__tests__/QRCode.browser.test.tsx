import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { QRCode } from '../QRCode';

describe('QRCode (Browser)', () => {
  it('renders QR code SVG', async () => {
    const screen = render(<QRCode value="https://example.com" />);
    await expect.element(screen.getByTestId('qrcode-svg')).toBeVisible();
  });

  it('renders with img role and aria label', async () => {
    const screen = render(<QRCode value="https://example.com" />);
    await expect.element(screen.getByRole('img')).toBeVisible();
  });
});
