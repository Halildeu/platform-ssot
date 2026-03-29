// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../DesignLabProvider', () => ({
  useDesignLab: () => ({
    t: (key: string) => key,
    index: { items: [], pages: { currentFamilies: [] }, recipes: { currentFamilies: [] }, ecosystem: { currentFamilies: [] } },
    taxonomy: { groups: [] },
    layer: 'components',
  }),
}));

import ComponentsListing from '../ComponentsListing';

describe('ComponentsListing', () => {
  it('renders without crashing', () => {
    render(<MemoryRouter><ComponentsListing /></MemoryRouter>);
    expect(document.body).toBeTruthy();
  });
});
