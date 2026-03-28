import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { describe, expect, it } from 'vitest';
import { buildNavigationRailLivePreview, buildNavigationRailShowcaseSections } from './index';

const PreviewPanel = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
  kind?: 'live' | 'reference' | 'recipe';
}) => (
  <section>
    <h3>{title}</h3>
    {children}
  </section>
);

describe('NavigationRail showcase builders', () => {
  it('navigation rail icin live preview ve section listesi uretir', () => {
    const sections = buildNavigationRailShowcaseSections('NavigationRail', { PreviewPanel });

    expect(sections).not.toBeNull();
    expect(sections).toHaveLength(3);
    expect(sections?.map((section) => section.id)).toEqual([
      'navigationrail-workspace',
      'navigationrail-compact',
      'navigationrail-route-aware',
    ]);

    render(
      <>
        {buildNavigationRailLivePreview('NavigationRail', { PreviewPanel })}
        {sections?.[2]?.content}
      </>,
    );

    expect(screen.getAllByText('Workspace rail').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Compact utility rail').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Route aware preset').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Workspace settings').length).toBeGreaterThan(0);
  });

  it('farkli component icin null doner', () => {
    expect(buildNavigationRailLivePreview('MenuBar', { PreviewPanel })).toBeNull();
    expect(buildNavigationRailShowcaseSections('MenuBar', { PreviewPanel })).toBeNull();
  });
});
