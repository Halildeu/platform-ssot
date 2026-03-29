// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => vi.fn(), useParams: () => ({ id: 'test-component' }), useLocation: () => ({ pathname: '/admin/design-lab/test' }) };
});

vi.mock('../../DesignLabProvider', () => ({
  useDesignLab: () => ({
    t: (key: string) => key,
    index: { items: [], pages: { currentFamilies: [] }, recipes: { currentFamilies: [] }, ecosystem: { currentFamilies: [] } },
    api: { catalog: {} },
    layer: 'components',
  }),
}));

import ComponentDetail from '../ComponentDetail';

describe('ComponentDetail', () => {
  it('renders without crashing', () => {
    render(<MemoryRouter><ComponentDetail /></MemoryRouter>);
    expect(document.body).toBeTruthy();
  });
});
