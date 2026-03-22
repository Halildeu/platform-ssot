import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../DesignLabProvider', () => ({
  useDesignLab: () => ({
    t: (key: string) => key,
    index: { items: [], pages: { currentFamilies: [] }, recipes: { currentFamilies: [] }, ecosystem: { currentFamilies: [] } },
    layer: 'components',
  }),
}));

import DesignLabLanding from '../DesignLabLanding';

describe('DesignLabLanding', () => {
  it('renders without crashing', () => {
    render(<MemoryRouter><DesignLabLanding /></MemoryRouter>);
    expect(document.body).toBeTruthy();
  });
});
