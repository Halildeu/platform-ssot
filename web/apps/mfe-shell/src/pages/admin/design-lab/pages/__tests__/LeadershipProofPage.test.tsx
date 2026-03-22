import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../DesignLabProvider', () => ({
  useDesignLab: () => ({
    t: (key: string) => key,
    index: { items: [], pages: { currentFamilies: [] }, recipes: { currentFamilies: [] }, ecosystem: { currentFamilies: [] } },
    layer: 'components',
  }),
}));

vi.mock('../../intelligence/ReleaseTimelinePanel', () => ({ default: () => <div data-testid="timeline" /> }));
vi.mock('../../intelligence/ROICalculator', () => ({ default: () => <div data-testid="roi" /> }));
vi.mock('../../intelligence/useDesignLabAnalytics', () => ({
  useDesignLabAnalytics: () => ({
    totalComponents: 0,
    adoptionRate: 0,
    avgQuality: 0,
    getTopViewed: () => [],
    getTopSearched: () => [],
    getEngagement: () => ({ weeklyActive: 0, monthlyActive: 0, trend: 'stable' }),
  }),
}));

import LeadershipProofPage from '../LeadershipProofPage';

describe('LeadershipProofPage', () => {
  it('renders without crashing', () => {
    render(<MemoryRouter><LeadershipProofPage /></MemoryRouter>);
    expect(document.body).toBeTruthy();
  });
});
