// @vitest-environment jsdom
// Auto-generated contract test
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { PortalProvider } from '../overlay-engine/PortalProvider';

describe('PortalProvider — contract', () => {
  it('renders without crash', () => {
    const { container } = render(<PortalProvider><div>child</div></PortalProvider>);
    expect(container.firstElementChild).toBeTruthy();
  });

  it('exports a named component', () => {
    // PortalProvider is a forwardRef, which is an object in React
    expect(PortalProvider).toBeTruthy();
    expect(typeof PortalProvider === 'function' || typeof PortalProvider === 'object').toBe(true);
  });

  it('renders children', () => {
    const { container } = render(<PortalProvider><span data-testid="inner">inner</span></PortalProvider>);
    expect(container.querySelector('[data-testid="inner"]')).toBeTruthy();
  });
});
