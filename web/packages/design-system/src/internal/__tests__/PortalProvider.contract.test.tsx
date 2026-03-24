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
    expect(typeof PortalProvider).toBe('function');
  });

  it('renders children', () => {
    const { container } = render(<PortalProvider><span data-testid="inner">inner</span></PortalProvider>);
    expect(container.querySelector('[data-testid="inner"]')).toBeTruthy();
  });
});
