// @vitest-environment jsdom
// Auto-generated contract test
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { LocaleProvider } from '../LocaleProvider';

describe('LocaleProvider — contract', () => {
  it('renders without crash', () => {
    const { container } = render(<LocaleProvider><div>child</div></LocaleProvider>);
    expect(container.firstElementChild).toBeTruthy();
  });

  it('exports a named component', () => {
    expect(typeof LocaleProvider).toBe('function');
  });

  it('renders children', () => {
    const { container } = render(<LocaleProvider><span data-testid="inner">inner</span></LocaleProvider>);
    expect(container.querySelector('[data-testid="inner"]')).toBeTruthy();
  });
});
