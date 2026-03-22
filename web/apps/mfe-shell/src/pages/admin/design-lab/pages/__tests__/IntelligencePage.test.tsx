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

vi.mock('../../intelligence/AssistantPanel', () => ({ default: () => <div data-testid="assistant" /> }));

import IntelligencePage from '../IntelligencePage';

describe('IntelligencePage', () => {
  it('renders without crashing', () => {
    render(<MemoryRouter><IntelligencePage /></MemoryRouter>);
    expect(document.body).toBeTruthy();
  });
});
