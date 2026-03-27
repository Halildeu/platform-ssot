// @vitest-environment jsdom
// Auto-generated contract test — do not edit manually
// Regenerate with: node scripts/ci/generate-contract-tests.mjs --write
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { ErrorBoundary } from '../error-boundary/ErrorBoundary';
import type { ErrorBoundaryFallback, ErrorBoundaryProps } from '../error-boundary/ErrorBoundary';

describe('ErrorBoundary — contract', () => {
  
  it('renders without crash', () => {
    const { container } = render(<ErrorBoundary  />);
    expect(container.firstElementChild).toBeTruthy();
  });

  it('exports expected types', () => {
    // Type-level check — if this compiles, types are exported correctly
    const _errorboundaryfallback: ErrorBoundaryFallback | undefined = undefined; void _errorboundaryfallback;
    const _errorboundaryprops: ErrorBoundaryProps | undefined = undefined; void _errorboundaryprops;
    expect(true).toBe(true);
  });
});
