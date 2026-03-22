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

vi.mock('../../evidence/useEvidence', () => ({
  useEvidence: () => ({ status: 'no_data' }),
  FALLBACK_REGISTRY: {
    visual_regression: {
      provider: 'none',
      workflow_exists: false,
      last_run: null,
      status: 'no_data',
      stats: { pass: 0, fail: 0, changed: 0, new: 0, skipped: 0 },
    },
    security: {},
  },
}));

import VisualRegressionPage from '../VisualRegressionPage';

describe('VisualRegressionPage', () => {
  it('renders without crashing', () => {
    render(<MemoryRouter><VisualRegressionPage /></MemoryRouter>);
    expect(document.body).toBeTruthy();
  });
});
