import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { CoverageMatrix } from '../CoverageMatrix';

describe('CoverageMatrix', () => {
  const sampleItems = [
    { name: 'Button', hasGuide: true, hasTokens: true, hasExamples: true, hasPlayground: false, hasTests: true },
    { name: 'Input', hasGuide: true, hasTokens: false, hasExamples: true, hasPlayground: false, hasTests: false },
  ];

  it('renders without crashing', () => {
    render(<CoverageMatrix items={sampleItems} />);
    expect(document.body).toBeTruthy();
  });

  it('renders with empty items', () => {
    render(<CoverageMatrix items={[]} />);
    expect(document.body).toBeTruthy();
  });

  it('renders with onNavigate callback', () => {
    const onNavigate = vi.fn();
    render(<CoverageMatrix items={sampleItems} onNavigate={onNavigate} />);
    expect(document.body).toBeTruthy();
  });
});
