// @vitest-environment jsdom
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { DesignLabHeaderMenu } from './DesignLabHeaderMenu';

vi.mock('../i18n', () => ({
  useShellCommonI18n: () => ({
    t: (key: string) =>
      ({
        'shell.nav.designLab': 'Design Lab',
      }[key] ?? key),
  }),
}));

vi.mock('../../pages/admin/design-lab/useDesignLabI18n', async () => {
  const { getDictionary } = await import('@mfe/i18n-dicts');
  const dict = getDictionary('tr', 'designlab')?.dictionary ?? {};
  return {
    useDesignLabI18n: () => ({
      t: (key: string) => dict[key] ?? key,
    }),
  };
});

const routerFuture = {
  v7_startTransition: true,
  v7_relativeSplatPath: true,
} as const;

const LocationViewer = () => {
  const location = useLocation();
  return <span data-testid="location-display">{`${location.pathname}${location.search}`}</span>;
};

const renderMenu = (initialEntry: string) =>
  render(
    <MemoryRouter initialEntries={[initialEntry]} future={routerFuture}>
      <Routes>
        <Route
          path="*"
          element={(
            <>
              <DesignLabHeaderMenu />
              <LocationViewer />
            </>
          )}
        />
      </Routes>
    </MemoryRouter>,
  );

const expectNoRawDesignLabKeys = (text: string) => {
  expect(text).not.toMatch(/designlab\.[a-z0-9_.-]+/i);
};

describe('DesignLabHeaderMenu', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
      configurable: true,
      value: vi.fn(),
    });
  });

  afterEach(() => {
    cleanup();
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('design lab tetikleyicisine tiklayinca taxonomy panelini acar', () => {
    renderMenu('/admin/users');

    fireEvent.click(screen.getByTestId('nav-design-lab'));

    expect(screen.getByTestId('design-lab-header-taxonomy-panel')).toBeInTheDocument();
    expect(screen.getByTestId('location-display')).toHaveTextContent('/admin/users');
  });

  it('hover ile taxonomy panelini acar ve secili sectiona gider', () => {
    const { container } = renderMenu('/admin/users');

    fireEvent.mouseEnter(screen.getByTestId('nav-design-lab'));

    expect(screen.getByTestId('design-lab-header-taxonomy-panel')).toBeInTheDocument();
    expectNoRawDesignLabKeys(container.textContent ?? '');
    expect(screen.getByTestId('design-lab-header-adapter-badges')).toBeInTheDocument();
    expect(screen.getByText(/Bileşenler · Legacy adaptör/i)).toBeInTheDocument();
    expect(screen.getByText(/Reçeteler · Legacy adaptör/i)).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('design-lab-header-section-components'));

    expect(screen.getByTestId('location-display')).toHaveTextContent('/admin/design-lab?dl_mode=components&dl_section=components');
  });

  it('click ile acilan taxonomy panelinden secili sectiona gider', () => {
    const { container } = renderMenu('/admin/users');

    fireEvent.click(screen.getByTestId('nav-design-lab'));
    expectNoRawDesignLabKeys(container.textContent ?? '');
    fireEvent.click(screen.getByTestId('design-lab-header-section-components'));

    expect(screen.getByTestId('location-display')).toHaveTextContent('/admin/design-lab?dl_mode=components&dl_section=components');
  });

  it('design lab icindeyken mode ve tab bilgisini korur, item parametrelerini temizler', () => {
    renderMenu('/admin/design-lab?dl_mode=recipes&dl_section=patterns&dl_tab=demo&dl_item=input&dl_recipe=search_filter_listing');

    fireEvent.mouseEnter(screen.getByTestId('nav-design-lab'));

    fireEvent.click(screen.getByTestId('design-lab-header-section-pages'));

    const locationText = screen.getByTestId('location-display');
    expect(locationText).toHaveTextContent('/admin/design-lab?dl_mode=pages&dl_section=pages&dl_tab=demo');
    expect(locationText).not.toHaveTextContent('dl_item=');
    expect(locationText).not.toHaveTextContent('dl_recipe=');
  });

  it('legacy adapter section ile acilsa da yeni navigasyonda canonical section yazar', () => {
    renderMenu('/admin/design-lab?dl_mode=recipes&dl_section=ai_ux&dl_tab=demo');

    fireEvent.mouseEnter(screen.getByTestId('nav-design-lab'));
    fireEvent.click(screen.getByTestId('design-lab-header-section-recipes'));

    expect(screen.getByTestId('location-display')).toHaveTextContent('/admin/design-lab?dl_mode=recipes&dl_section=recipes&dl_tab=demo');
    expect(screen.getByTestId('location-display')).not.toHaveTextContent('dl_section=ai_ux');
  });
});
