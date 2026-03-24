// @vitest-environment jsdom
// Auto-generated contract test
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { OverlaySurface } from '../OverlaySurface';

describe('OverlaySurface — contract', () => {
  it('renders without crash', () => {
    const { container } = render(<OverlaySurface><div>child</div></OverlaySurface>);
    expect(container.firstElementChild).toBeTruthy();
  });

  it('exports a named component', () => {
    expect(typeof OverlaySurface).toBe('function');
  });

  it('renders children', () => {
    const { container } = render(<OverlaySurface><span data-testid="inner">inner</span></OverlaySurface>);
    expect(container.querySelector('[data-testid="inner"]')).toBeTruthy();
  });
});
