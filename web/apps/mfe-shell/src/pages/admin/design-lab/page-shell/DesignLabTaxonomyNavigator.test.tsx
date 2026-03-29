// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { DesignLabTaxonomyNavigator } from './DesignLabTaxonomyNavigator';

describe('DesignLabTaxonomyNavigator', () => {
  const items = [
    {
      id: 'foundations',
      title: 'Temeller',
      count: 6,
      description: 'Tema ve token yapisi',
    },
    {
      id: 'components',
      title: 'Bilesenler',
      count: 34,
      description: 'Tekrar kullanilabilir UI taslari',
      auxiliaryBadgeLabel: 'Legacy adaptör',
    },
  ];

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('sidebar varyantinda aktif ogeyi ve aktif aciklamayi gosterir', () => {
    const onChange = vi.fn();

    render(
      <DesignLabTaxonomyNavigator
        items={items}
        activeId="foundations"
        onChange={onChange}
        variant="sidebar"
        ariaLabel="Bolumler"
        itemTestIdPrefix="design-lab-section"
      />,
    );

    expect(screen.getByTestId('design-lab-section-foundations')).toHaveAttribute('aria-current', 'page');
    expect(screen.getByText('Tema ve token yapisi')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('design-lab-section-components'));
    expect(onChange).toHaveBeenCalledWith('components');
  });

  it('header varyantinda kompakt kartlari render eder ve secim degistirir', () => {
    const onChange = vi.fn();
    Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
      configurable: true,
      value: vi.fn(),
    });

    render(
      <DesignLabTaxonomyNavigator
        items={items}
        activeId="components"
        onChange={onChange}
        variant="header"
        ariaLabel="Ana basliklar"
        itemTestIdPrefix="design-lab-hero-section"
      />,
    );

    expect(screen.getByTestId('design-lab-hero-section-components')).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText('34')).toBeInTheDocument();
    expect(screen.getByText('Legacy adaptör')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('design-lab-hero-section-foundations'));
    expect(onChange).toHaveBeenCalledWith('foundations');
  });

  it('header varyantinda overflow affordance gosterir ve aktif karti gorunur alana kaydirir', async () => {
    const onChange = vi.fn();
    const scrollIntoViewSpy = vi.fn();
    Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
      configurable: true,
      value: scrollIntoViewSpy,
    });

    const { rerender } = render(
      <DesignLabTaxonomyNavigator
        items={items}
        activeId="components"
        onChange={onChange}
        variant="header"
        ariaLabel="Ana basliklar"
        itemTestIdPrefix="design-lab-hero-section"
      />,
    );

    const nav = screen.getByTestId('design-lab-taxonomy-header');
    Object.defineProperty(nav, 'clientWidth', { configurable: true, value: 220 });
    Object.defineProperty(nav, 'scrollWidth', { configurable: true, value: 640 });
    Object.defineProperty(nav, 'scrollLeft', { configurable: true, writable: true, value: 0 });

    act(() => {
      window.dispatchEvent(new Event('resize'));
    });

    await waitFor(() => {
      expect(nav).toHaveAttribute('data-scrollable', 'true');
    });
    expect(screen.queryByTestId('design-lab-taxonomy-header-fade-start')).not.toBeInTheDocument();
    expect(screen.getByTestId('design-lab-taxonomy-header-fade-end')).toBeInTheDocument();

    Object.defineProperty(nav, 'scrollLeft', { configurable: true, writable: true, value: 120 });
    fireEvent.scroll(nav);

    await waitFor(() => {
      expect(screen.getByTestId('design-lab-taxonomy-header-fade-start')).toBeInTheDocument();
    });

    scrollIntoViewSpy.mockClear();

    rerender(
      <DesignLabTaxonomyNavigator
        items={items}
        activeId="foundations"
        onChange={onChange}
        variant="header"
        ariaLabel="Ana basliklar"
        itemTestIdPrefix="design-lab-hero-section"
      />,
    );

    expect(scrollIntoViewSpy).toHaveBeenCalled();
  });

  it('icerigi olmayan section kartini disabled gosterir ve secim degistirmez', () => {
    const onChange = vi.fn();
    Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
      configurable: true,
      value: vi.fn(),
    });

    render(
      <DesignLabTaxonomyNavigator
        items={[
          ...items,
          {
            id: 'pages',
            title: 'Pages',
            count: 0,
            description: 'Bu filtrede sonuc yok',
          },
        ]}
        activeId="components"
        onChange={onChange}
        variant="header"
        ariaLabel="Ana basliklar"
        itemTestIdPrefix="design-lab-hero-section"
      />,
    );

    const disabledItem = screen.getByTestId('design-lab-hero-section-pages');
    expect(disabledItem).toBeDisabled();

    fireEvent.click(disabledItem);
    expect(onChange).not.toHaveBeenCalled();
  });
});
