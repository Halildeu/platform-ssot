// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QRCode } from '../QRCode';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => cleanup());

describe('QRCode contract', () => {
  it('has displayName', () => {
    expect(QRCode.displayName).toBe('QRCode');
  });

  it('renders with required props', () => {
    render(<QRCode value="https://example.com" />);
    expect(screen.getByTestId('qrcode-root')).toBeInTheDocument();
  });

  it('renders SVG element', () => {
    render(<QRCode value="test-value" />);
    expect(screen.getByTestId('qrcode-svg')).toBeInTheDocument();
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<QRCode ref={ref} value="test" />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('merges custom className', () => {
    const { container } = render(<QRCode value="test" className="custom-qr" />);
    expect(container.querySelector('.custom-qr')).toBeInTheDocument();
  });

  it('renders loading state', () => {
    render(<QRCode value="test" status="loading" />);
    expect(screen.getByTestId('qrcode-loading')).toBeInTheDocument();
  });

  it('renders expired state with refresh button', () => {
    const handler = vi.fn();
    render(<QRCode value="test" status="expired" onRefresh={handler} />);
    expect(screen.getByTestId('qrcode-expired')).toBeInTheDocument();
    expect(screen.getByTestId('qrcode-refresh')).toBeInTheDocument();
  });

  it('fires onRefresh callback', async () => {
    const handler = vi.fn();
    const user = userEvent.setup();
    render(<QRCode value="test" status="expired" onRefresh={handler} />);
    await user.click(screen.getByTestId('qrcode-refresh'));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('sets aria-label with value', () => {
    render(<QRCode value="https://example.com" />);
    expect(screen.getByRole('img')).toHaveAttribute('aria-label', 'QR Code for https://example.com');
  });

  it('returns null when access is hidden', () => {
    render(<QRCode value="test" access="hidden" />);
    expect(screen.queryByTestId('qrcode-root')).not.toBeInTheDocument();
  });
});

describe('QRCode — accessibility', () => {
  it('has no axe-core a11y violations', async () => {
    const { container } = render(<QRCode value="https://example.com" />);
    await expectNoA11yViolations(container);
  });
});
