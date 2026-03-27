import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { QRCode } from '../QRCode';

describe('QRCode (Browser)', () => {
  it('renders QR code SVG', async () => {
    const screen = await render(<QRCode value="https://example.com" />);
    await expect.element(screen.getByTestId('qrcode-svg')).toBeVisible();
  });

  it('renders with img role', async () => {
    const screen = await render(<QRCode value="https://example.com" />);
    await expect.element(screen.getByRole('img')).toBeVisible();
  });

  it('renders with custom size', async () => {
    const screen = await render(<QRCode value="test" size={200} />);
    await expect.element(screen.getByTestId('qrcode-svg')).toBeVisible();
  });

  it('renders data-testid attribute', async () => {
    const screen = await render(<QRCode value="test" />);
    await expect.element(screen.getByTestId('qrcode-root')).toBeVisible();
  });

  it('renders nothing when access is hidden', async () => {
    await render(<QRCode value="test" access="hidden" />);
    expect(document.querySelector('[data-component="qr-code"]')).toBeNull();
  });

  it('renders with bordered style', async () => {
    const screen = await render(<QRCode value="test" bordered />);
    await expect.element(screen.getByTestId('qrcode-svg')).toBeVisible();
  });

  it('renders expired status overlay', async () => {
    const screen = await render(<QRCode value="test" status="expired" />);
    await expect.element(screen.getByText(/expired/i)).toBeVisible();
  });

  it('renders loading status overlay', async () => {
    const screen = await render(<QRCode value="test" status="loading" />);
    await expect.element(screen.getByTestId('qrcode-loading')).toBeVisible();
  });
});
