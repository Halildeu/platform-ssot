// @vitest-environment jsdom
// Auto-generated contract test
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { createLazyComponent } from '../LazyComponent';

// Create a test lazy component from a synchronously-resolving import
const DummyComponent: React.FC<Record<string, unknown>> = () => <div data-testid="lazy-inner">loaded</div>;
const LazyDummy = createLazyComponent(
  () => Promise.resolve({ default: DummyComponent }),
  'LazyDummy',
);

describe('LazyComponent — contract', () => {
  it('renders without crash', () => {
    const { container } = render(<LazyDummy />);
    // Suspense shows fallback initially
    expect(container.firstElementChild).toBeTruthy();
  });

  it('exports a named component', () => {
    expect(typeof createLazyComponent).toBe('function');
  });

  it('renders children', async () => {
    const { findByTestId } = render(<LazyDummy />);
    const inner = await findByTestId('lazy-inner');
    expect(inner).toBeTruthy();
  });
});
