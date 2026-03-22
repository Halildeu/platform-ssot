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

vi.mock('../../DesignLabSidebarRouter', () => ({
  PRIMITIVE_NAMES: [],
  ADVANCED_NAMES: [],
}));

import AdvancedListing from '../AdvancedListing';

describe('AdvancedListing', () => {
  it('renders without crashing', () => {
    render(<MemoryRouter><AdvancedListing /></MemoryRouter>);
    expect(document.body).toBeTruthy();
  });
});
