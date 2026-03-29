// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import ThemingGuidePage from '../ThemingGuidePage';

describe('ThemingGuidePage', () => {
  it('renders without crashing', () => {
    render(<MemoryRouter><ThemingGuidePage /></MemoryRouter>);
    expect(document.body).toBeTruthy();
  });
});
