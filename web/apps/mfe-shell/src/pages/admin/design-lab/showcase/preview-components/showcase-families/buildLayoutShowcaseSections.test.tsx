// @vitest-environment jsdom
import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { afterEach, describe, expect, it } from 'vitest';
import type { DescriptionsItem, SummaryStripItem } from '@mfe/design-system';
import { buildLayoutShowcaseSections } from './buildLayoutShowcaseSections';

const PreviewPanel = ({
  title,
  children,
}: {
  title: React.ReactNode;
  children: React.ReactNode;
}) => (
  <section>
    <h2>{title}</h2>
    {children}
  </section>
);

const baseContext = {
  PreviewPanel,
  t: (key: string) => key,
  avatarPreviewImageSrc: '/avatar.svg',
  descriptionsLocaleText: {},
  dropdownAction: 'Saved view',
  entitySummaryItems: [
    { key: 'owner', label: 'Owner', value: 'Platform UI', tone: 'info' },
    { key: 'wave', label: 'Wave', value: 'Wave 7', tone: 'success' },
  ] as DescriptionsItem[],
  pageHeaderMeta: null,
  rolloutDescriptionItems: [
    { key: 'scope', label: 'Scope', value: 'Cross-suite', tone: 'info' },
    { key: 'risk', label: 'Risk', value: 'Low', tone: 'success' },
    { key: 'owner', label: 'Owner', value: 'Platform Ops', tone: 'info' },
    { key: 'review', label: 'Review', value: 'Required', tone: 'warning' },
  ] as DescriptionsItem[],
  searchInputValue: 'users',
  selectValue: 'ready',
  summaryStripItems: [
    { key: 'coverage', label: 'Coverage', value: '91%', note: 'Story + adoption', tone: 'success' },
    { key: 'issues', label: 'Issues', value: '3', note: 'Open regression items', tone: 'warning' },
    { key: 'owners', label: 'Owners', value: '5', note: 'Mapped families', tone: 'info' },
    { key: 'releases', label: 'Releases', value: '2', note: 'Current sprint', tone: 'info' },
  ] as SummaryStripItem[],
  setDropdownAction: () => undefined,
  setSearchInputValue: () => undefined,
  setSelectValue: () => undefined,
};

afterEach(() => {
  cleanup();
});

describe('buildLayoutShowcaseSections page templates', () => {
  it('dashboard template icin canli section uretir', () => {
    const sections = buildLayoutShowcaseSections('Dashboard Template', baseContext);

    expect(sections).not.toBeNull();
    expect(sections?.[0]?.id).toBe('dashboard-template-shell');

    render(<>{sections?.[0]?.content}</>);

    expect(screen.getByText('Executive operations dashboard')).toBeInTheDocument();
    expect(screen.getByText('Release cadence')).toBeInTheDocument();
    expect(screen.getByText('Analytics Pages')).toBeInTheDocument();
  });

  it('crud template icin table odakli section uretir', () => {
    const sections = buildLayoutShowcaseSections('CRUD Template', baseContext);

    expect(sections).not.toBeNull();
    expect(sections?.[0]?.id).toBe('crud-template-shell');

    render(<>{sections?.[0]?.content}</>);

    expect(screen.getByText('User administration')).toBeInTheDocument();
    expect(screen.getByText('Current records')).toBeInTheDocument();
    expect(screen.getByText('Operational Pages')).toBeInTheDocument();
  });

  it('detail template icin inspector odakli section uretir', () => {
    const sections = buildLayoutShowcaseSections('Detail Template', baseContext);

    expect(sections).not.toBeNull();
    expect(sections?.[0]?.id).toBe('detail-template-shell');

    render(<>{sections?.[0]?.content}</>);

    expect(screen.getByText('Access decision detail')).toBeInTheDocument();
    expect(screen.getByText('Inspector rail')).toBeInTheDocument();
  });

  it('command workspace icin search-first section uretir', () => {
    const sections = buildLayoutShowcaseSections('Command Workspace', baseContext);

    expect(sections).not.toBeNull();
    expect(sections?.[0]?.id).toBe('command-workspace-shell');

    render(<>{sections?.[0]?.content}</>);

    expect(screen.getByRole('heading', { name: 'Command workspace', level: 1 })).toBeInTheDocument();
    expect(screen.getByText('Command-ready results')).toBeInTheDocument();
  });

  it('settings template icin section tabs odakli section uretir', () => {
    const sections = buildLayoutShowcaseSections('Settings Template', baseContext);

    expect(sections).not.toBeNull();
    expect(sections?.[0]?.id).toBe('settings-template-shell');

    render(<>{sections?.[0]?.content}</>);

    expect(screen.getByText('Workspace settings')).toBeInTheDocument();
    expect(screen.getByText('Configuration summary')).toBeInTheDocument();
    expect(screen.getByText('Configuration Pages')).toBeInTheDocument();
  });
});
