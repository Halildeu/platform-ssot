import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../DesignLabProvider', () => ({
  useDesignLab: () => ({
    t: (key: string) => key,
    index: {
      items: [
        { name: 'Button', kind: 'component', availability: 'exported', lifecycle: 'stable', group: 'general', subgroup: 'actions', taxonomyGroupId: 'general', taxonomySubgroup: 'actions', importStatement: '', whereUsed: [], tags: [], demoMode: 'live', description: '', sectionIds: [], qualityGates: [] },
      ],
      pages: { currentFamilies: [] },
      recipes: { currentFamilies: [] },
      ecosystem: { currentFamilies: [] },
    },
    apiItemMap: new Map(),
    layer: 'components',
  }),
}));

vi.mock('../../intelligence/AssistantPanel', () => ({
  default: () => <div data-testid="assistant-panel">AI Assistant Content</div>,
}));
vi.mock('../../intelligence/BlastRadiusPanel', () => ({
  default: () => <div data-testid="blast-radius-panel">Blast Radius Content</div>,
}));
vi.mock('../../intelligence/ConsumerHeatmap', () => ({
  default: () => <div data-testid="consumer-heatmap">Heatmap Content</div>,
}));
vi.mock('../../intelligence/useCodegenSandbox', () => ({
  useCodegenSandbox: () => ({
    generate: () => ({ isValid: true, warnings: [], fullExample: '<Button />' }),
  }),
}));
vi.mock('../../intelligence/mcpExport', () => ({
  generateMCPManifest: () => '{}',
}));

import IntelligencePage from '../IntelligencePage';

function renderPage() {
  return render(<MemoryRouter><IntelligencePage /></MemoryRouter>);
}

describe('IntelligencePage', () => {
  it('renders the page title "Impact Intelligence"', () => {
    renderPage();
    expect(screen.getByText('Impact Intelligence')).toBeInTheDocument();
  });

  it('shows the subtitle describing features', () => {
    renderPage();
    expect(screen.getByText(/Blast-radius analizi, AI asistan, codegen sandbox ve MCP export/)).toBeInTheDocument();
  });

  it('renders the MCP Manifest download button', () => {
    renderPage();
    expect(screen.getByText('MCP Manifest Indir')).toBeInTheDocument();
  });

  it('renders the AI Asistan collapsible section (default open)', () => {
    renderPage();
    expect(screen.getByText('AI Asistan')).toBeInTheDocument();
    expect(screen.getByTestId('assistant-panel')).toBeInTheDocument();
  });

  it('renders the Blast Radius collapsible section (default open)', () => {
    renderPage();
    expect(screen.getByText('Blast Radius')).toBeInTheDocument();
    expect(screen.getByTestId('blast-radius-panel')).toBeInTheDocument();
  });

  it('renders the Consumer Heatmap section title (collapsed by default)', () => {
    renderPage();
    expect(screen.getByText('Consumer Heatmap')).toBeInTheDocument();
  });

  it('renders the Codegen Sandbox section title (collapsed by default)', () => {
    renderPage();
    expect(screen.getByText('Codegen Sandbox')).toBeInTheDocument();
  });

  it('opens Consumer Heatmap section when clicked', () => {
    renderPage();
    fireEvent.click(screen.getByText('Consumer Heatmap'));
    expect(screen.getByTestId('consumer-heatmap')).toBeInTheDocument();
  });
});
