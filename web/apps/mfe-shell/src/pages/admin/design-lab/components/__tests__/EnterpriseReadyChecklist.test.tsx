// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { EnterpriseReadyChecklist } from '../EnterpriseReadyChecklist';

vi.mock('../QualityBadge', () => ({
  QualityBadge: ({ score }: { score: number }) => <span data-testid="quality-badge">{score}</span>,
  getQualityTier: (score: number) => score >= 95 ? 'platinum' : 'bronze',
}));

describe('EnterpriseReadyChecklist', () => {
  const minimalIndexItem = { maturity: 'stable' as const, qualityGates: ['design_tokens'] };
  const minimalApiItem = {
    props: [{ name: 'className' }, { name: 'children' }],
    stateModel: ['default'],
    previewStates: ['default'],
    behaviorModel: ['click'],
    variantAxes: ['size'],
    regressionFocus: ['visual'],
  };

  it('renders without crashing', () => {
    render(<EnterpriseReadyChecklist indexItem={minimalIndexItem} apiItem={minimalApiItem} />);
    expect(document.body).toBeTruthy();
  });

  it('renders with null apiItem', () => {
    render(<EnterpriseReadyChecklist indexItem={minimalIndexItem} apiItem={null} />);
    expect(document.body).toBeTruthy();
  });
});
