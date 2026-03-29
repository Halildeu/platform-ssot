// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../observability/WebVitalsPanel', () => ({
  default: () => <div data-testid="web-vitals-panel">Web Vitals Content</div>,
}));
vi.mock('../../observability/MFHealthPanel', () => ({
  default: () => <div data-testid="mf-health-panel">MF Health Content</div>,
}));

import ObservabilityPage from '../ObservabilityPage';

function renderPage() {
  return render(<MemoryRouter><ObservabilityPage /></MemoryRouter>);
}

describe('ObservabilityPage', () => {
  it('renders the page title "Observability"', () => {
    renderPage();
    expect(screen.getByText('Observability')).toBeInTheDocument();
  });

  it('shows the page subtitle in Turkish', () => {
    renderPage();
    expect(screen.getByText(/Canli performans, saglik ve izleme verileri/)).toBeInTheDocument();
  });

  it('renders the Web Vitals panel', () => {
    renderPage();
    expect(screen.getByTestId('web-vitals-panel')).toBeInTheDocument();
  });

  it('renders the MF Health panel', () => {
    renderPage();
    expect(screen.getByTestId('mf-health-panel')).toBeInTheDocument();
  });

  it('renders the Synthetic Monitor section', () => {
    renderPage();
    expect(screen.getByText('Synthetic Monitor')).toBeInTheDocument();
    expect(screen.getByText(/Kritik akislarin otomatik duman testleri/)).toBeInTheDocument();
  });

  it('shows the npm run monitor:synthetic command', () => {
    renderPage();
    expect(screen.getByText('npm run monitor:synthetic')).toBeInTheDocument();
  });

  it('renders the Sentry external link section', () => {
    renderPage();
    expect(screen.getByText('Sentry')).toBeInTheDocument();
  });

  it('renders the Tempo tracing section', () => {
    renderPage();
    expect(screen.getByText('Tempo')).toBeInTheDocument();
  });
});
