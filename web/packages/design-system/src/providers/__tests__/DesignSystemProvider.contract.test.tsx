// @vitest-environment jsdom
// Auto-generated contract test
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { DesignSystemProvider } from '../DesignSystemProvider';

describe('DesignSystemProvider — contract', () => {
  it('renders without crash', () => {
    const { container } = render(<DesignSystemProvider><div>child</div></DesignSystemProvider>);
    expect(container.firstElementChild).toBeTruthy();
  });

  it('exports a named component', () => {
    expect(typeof DesignSystemProvider).toBe('function');
  });

  it('renders children', () => {
    const { container } = render(<DesignSystemProvider><span data-testid="inner">inner</span></DesignSystemProvider>);
    expect(container.querySelector('[data-testid="inner"]')).toBeTruthy();
  });
});
