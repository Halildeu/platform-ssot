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

import FigmaSyncPage from '../FigmaSyncPage';

describe('FigmaSyncPage', () => {
  it('renders without crashing', () => {
    render(<MemoryRouter><FigmaSyncPage /></MemoryRouter>);
    expect(document.body).toBeTruthy();
  });
});
