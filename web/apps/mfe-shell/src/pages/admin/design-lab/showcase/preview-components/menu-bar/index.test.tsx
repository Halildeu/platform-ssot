// @vitest-environment jsdom
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { describe, expect, it } from 'vitest';
import { buildMenuBarShowcaseSections } from './index';

describe('buildMenuBarShowcaseSections', () => {
  it('menu bar ailesi icin yalniz menubar varyantlarini uretir', () => {
    const sections = buildMenuBarShowcaseSections({
      ariaLabel: 'Menu bar preview',
      locale: 'tr',
      itemName: 'MenuBar',
    });

    expect(sections.length).toBe(5);
    expect(sections.map((section) => section.id)).toEqual(
      expect.arrayContaining([
        'navigation-menu',
        'desktop-menubar',
        'overflow-more',
        'pinned-favorites',
        'theme-contrast',
      ]),
    );

    render(<>{sections[0]?.content}</>);

    expect(screen.getByText('Ant Design Menu')).toBeInTheDocument();
    expect(screen.getByText('DEFAULT')).toBeInTheDocument();
  });

  it('action bar icin task odakli alt kume uretir', () => {
    const sections = buildMenuBarShowcaseSections({
      ariaLabel: 'Action header preview',
      locale: 'tr',
      itemName: 'Action Header',
    });

    expect(sections.length).toBe(3);
    expect(sections.map((section) => section.id)).toEqual([
      'action-header',
      'readonly-governance',
      'analytics-dense',
    ]);
  });

  it('app header galerisi canonical varyantlari tekil tutar', () => {
    const sections = buildMenuBarShowcaseSections({
      ariaLabel: 'App header preview',
      locale: 'tr',
      itemName: 'App Header',
    });

    expect(sections.length).toBe(4);
    expect(sections.map((section) => section.id)).toEqual([
      'app-header',
      'responsive-app-header',
      'account-utility-cluster',
      'subdomain-shell',
    ]);
  });

  it('desktop menubar icin ustun variant seti uretir', () => {
    const sections = buildMenuBarShowcaseSections({
      ariaLabel: 'Desktop menubar preview',
      locale: 'en',
      itemName: 'Desktop Menubar',
    });

    expect(sections.length).toBe(2);
    expect(sections.map((section) => section.id)).toEqual([
      'desktop-menubar',
      'overflow-more',
    ]);
  });

  it('legacy item isimleri de canonical isme normalize edilir', () => {
    const sections = buildMenuBarShowcaseSections({
      ariaLabel: 'Command header legacy',
      locale: 'en',
       
      itemName: 'Command Header' as unknown as any,
    });

    expect(sections.map((section) => section.id)).toEqual([
      'search-command-header',
      'command-hybrid',
      'pinned-favorites',
    ]);
  });

  it('action bar legacy ismini action header galerisine normalize eder', () => {
    const sections = buildMenuBarShowcaseSections({
      ariaLabel: 'Action bar legacy',
      locale: 'en',
       
      itemName: 'Action Bar' as unknown as any,
    });

    expect(sections.map((section) => section.id)).toEqual([
      'action-header',
      'readonly-governance',
      'analytics-dense',
    ]);
  });
});
