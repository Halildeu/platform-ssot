import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../observability/WebVitalsPanel', () => ({ default: () => <div data-testid="web-vitals" /> }));
vi.mock('../../observability/MFHealthPanel', () => ({ default: () => <div data-testid="mf-health" /> }));

import ObservabilityPage from '../ObservabilityPage';

describe('ObservabilityPage', () => {
  it('renders without crashing', () => {
    render(<MemoryRouter><ObservabilityPage /></MemoryRouter>);
    expect(document.body).toBeTruthy();
  });
});
