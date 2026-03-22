import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { PackageQualityScore } from '../PackageQualityScore';

vi.mock('../QualityBadge', () => ({
  QualityBadge: ({ score }: { score: number }) => <span>{score}</span>,
  getQualityTier: (score: number) => score >= 95 ? 'platinum' : 'bronze',
}));

describe('PackageQualityScore', () => {
  it('renders without crashing', () => {
    render(<PackageQualityScore packageName="@mfe/design-system" components={[{ name: 'Button', a11yScore: 90, qualityScore: 85 }]} />);
    expect(document.body).toBeTruthy();
  });

  it('renders empty state when no components', () => {
    const { container } = render(<PackageQualityScore packageName="@mfe/empty" components={[]} />);
    expect(container.textContent).toContain('@mfe/empty');
  });
});
