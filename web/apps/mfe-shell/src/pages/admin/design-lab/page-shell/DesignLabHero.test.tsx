// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { DesignLabHero } from './DesignLabHero';

describe('DesignLabHero', () => {
  afterEach(() => {
    cleanup();
  });

  it('section navigator slotunu hero altinda render eder', () => {
    render(
      <DesignLabHero
        breadcrumbs={<div>crumbs</div>}
        topBadges={<span>badge</span>}
        activeHeroLabel="Kutuphane"
        activeHeroTitle="Design Lab"
        activeHeroDescription="Header alani"
        sectionNavigator={<div data-testid="hero-nav">hero nav</div>}
      />,
    );

    expect(screen.getByTestId('design-lab-detail-hero')).toBeInTheDocument();
    expect(screen.getByTestId('design-lab-hero-section-navigator')).toContainElement(screen.getByTestId('hero-nav'));
  });

  it('supporting content slotunu hero govdesinde render eder', () => {
    render(
      <DesignLabHero
        breadcrumbs={<div>crumbs</div>}
        topBadges={<span>badge</span>}
        activeHeroLabel="Kutuphane"
        activeHeroTitle="Design Lab"
        activeHeroDescription="Header alani"
        supportingContent={<div data-testid="hero-supporting">legacy notice</div>}
      />,
    );

    expect(screen.getByTestId('hero-supporting')).toHaveTextContent('legacy notice');
  });
});
