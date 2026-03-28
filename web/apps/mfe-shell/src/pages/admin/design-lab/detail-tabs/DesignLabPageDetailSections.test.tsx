// @vitest-environment jsdom

import React from 'react';
import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  DesignLabPageDetailSections,
  type DesignLabPageApiPanelId,
  type DesignLabPageOverviewPanelId,
  type DesignLabPageQualityPanelId,
} from './DesignLabPageDetailSections';

vi.mock('../useDesignLabI18n', () => ({
  useDesignLabI18n: () => ({
    t: (key: string, params?: Record<string, unknown>) => {
      if (params?.count !== undefined) {
        return `${key}:${String(params.count)}`;
      }
      return key;
    },
  }),
}));

vi.mock('@mfe/design-system', () => ({
  Badge: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
  Tabs: ({
    value,
    items,
    onValueChange,
  }: {
    value: string;
    items: Array<{ value: string; label: React.ReactNode; content: React.ReactNode }>;
    onValueChange: (value: string) => void;
  }) => (
    <div>
      <div>{value}</div>
      {items.map((item) => (
        <button key={item.value} type="button" onClick={() => onValueChange(item.value)}>
          {item.label}
        </button>
      ))}
      <div>{items.find((item) => item.value === value)?.content ?? null}</div>
    </div>
  ),
  Text: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

const createProps = () => ({
  activeTab: 'overview' as const,
  activeOverviewPanel: 'regions' as DesignLabPageOverviewPanelId,
  activeApiPanel: 'regions' as DesignLabPageApiPanelId,
  activeQualityPanel: 'readiness' as DesignLabPageQualityPanelId,
  template: {
    recipeId: 'dashboard_template',
    title: 'Dashboard Template',
    clusterTitle: 'Dashboard',
    clusterDescription: 'Dashboard ailesi',
    intent: 'KPI ve karar akisini tek shell altinda toplar',
    ownerBlocks: ['PageHeader', 'SummaryStrip', 'EntityGridTemplate'],
  },
  generalContent: <div>general</div>,
  demoContent: <div>demo</div>,
  templateContractId: 'page.dashboard.contract',
  selectedTemplateTracks: ['new_packages'],
  selectedTemplateSections: ['header', 'content'],
  selectedTemplateThemes: ['data_density'],
  selectedTemplateQualityGates: ['visual_regression'],
  selectedTemplateItems: [
    { lifecycle: 'stable', demoMode: 'live' },
    { lifecycle: 'beta', demoMode: 'live' },
  ],
  onApiPanelChange: vi.fn(),
  onQualityPanelChange: vi.fn(),
  onOverviewPanelChange: vi.fn(),
  DocsSectionComponent: ({ children }: { children: React.ReactNode }) => <section>{children}</section>,
  DetailLabelComponent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SectionBadgeComponent: ({ label }: { label: React.ReactNode }) => <span>{label}</span>,
  MetricCardComponent: ({ label, value }: { label: React.ReactNode; value: React.ReactNode }) => (
    <div>{`${String(label)}:${String(value)}`}</div>
  ),
  ShowcaseCardComponent: ({ title, children }: { title: React.ReactNode; children: React.ReactNode }) => (
    <div>
      <div>{title}</div>
      {children}
    </div>
  ),
  CodeBlockComponent: ({ code }: { code: string }) => <pre>{code}</pre>,
  UsageRecipesPanelComponent: ({ title }: { title: React.ReactNode }) => <div>{title}</div>,
});

describe('DesignLabPageDetailSections', () => {
  afterEach(() => {
    cleanup();
  });

  it('overview tabinda page-first panel etiketlerini gosterir', () => {
    render(<DesignLabPageDetailSections {...createProps()} />);

    expect(screen.getByText('Regions')).toBeInTheDocument();
    expect(screen.getByText('Adoption')).toBeInTheDocument();
    expect(screen.getByText('Layout building blocks')).toBeInTheDocument();
    expect(screen.queryByText('Coverage')).not.toBeInTheDocument();
    expect(screen.queryByText('Flow')).not.toBeInTheDocument();
  });

  it('api tabinda binding/usage yerine regions/dependencies kullanir', () => {
    const props = createProps();
    render(<DesignLabPageDetailSections {...props} activeTab="api" />);

    expect(screen.getByText('Regions')).toBeInTheDocument();
    expect(screen.getByText('Dependencies')).toBeInTheDocument();
    expect(screen.queryByText('Binding')).not.toBeInTheDocument();
    expect(screen.queryByText('Usage')).not.toBeInTheDocument();
  });

  it('page panel secim degisimini kendi handlerlariyla tetikler', () => {
    const props = createProps();
    render(<DesignLabPageDetailSections {...props} activeTab="quality" />);

    fireEvent.click(screen.getByText('Gates'));

    expect(props.onQualityPanelChange).toHaveBeenCalledWith('gates');
  });
});
