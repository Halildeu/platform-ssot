// @vitest-environment jsdom
// Auto-generated contract test
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { OverlaySurface } from '../OverlaySurface';

describe('OverlaySurface — contract', () => {
  it('renders without crash', () => {
    const { container } = render(
      <OverlaySurface open={true}><div>child</div></OverlaySurface>,
    );
    // OverlaySurface portals content, check in document.body
    expect(document.querySelector('[role="dialog"]') || container.firstElementChild).toBeTruthy();
  });

  it('exports a named component', () => {
    expect(typeof OverlaySurface).toBe('function');
  });

  it('renders children', () => {
    render(
      <OverlaySurface open={true}><span data-testid="inner">inner</span></OverlaySurface>,
    );
    expect(document.querySelector('[data-testid="inner"]')).toBeTruthy();
  });
});
