// @vitest-environment jsdom
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { describe, expect, it, vi } from 'vitest';
import { DesignLabMenuBarShowcase } from './DesignLabMenuBarShowcase';

vi.mock('../../../../../app/i18n', () => ({
  useShellCommonI18n: () => ({
    t: (key: string) => {
      const map: Record<string, string> = {
        'shell.nav.home': 'Ana Sayfa',
        'shell.nav.suggestions': 'Öneriler',
        'shell.nav.ethic': 'Etik',
        'shell.nav.access': 'Erişim',
        'shell.nav.audit': 'Denetim',
        'shell.nav.users': 'Kullanıcılar',
        'shell.nav.themes': 'Temalar',
        'shell.nav.designLab': 'Design Lab',
        'shell.nav.morePages': 'Daha fazla',
      };
      return map[key] ?? key;
    },
  }),
}));

vi.mock('../../useDesignLabI18n', () => ({
  useDesignLabI18n: () => ({
    locale: 'tr',
    t: (key: string) => {
      const map: Record<string, string> = {
        'designlab.showcase.component.menuBar.aria': 'Shell header gezinmesi',
      };
      return map[key] ?? key;
    },
  }),
}));

describe('DesignLabMenuBarShowcase', () => {
  it('menu bar ailesi icin yalniz menubar varyantlarini gosterir', () => {
    const { container } = render(<DesignLabMenuBarShowcase />);

    const panels = container.querySelectorAll('[data-testid^="design-lab-menubar-panel-"]');
    expect(panels.length).toBe(5);
    expect(screen.getByText('Menubar kalite vektörleri')).toBeInTheDocument();
    expect(screen.getByTestId('design-lab-menubar-panel-navigation-menu')).toBeInTheDocument();
    expect(screen.getByTestId('design-lab-menubar-panel-desktop-menubar')).toBeInTheDocument();
    expect(screen.getByTestId('design-lab-menubar-panel-overflow-more')).toBeInTheDocument();
    expect(screen.getByTestId('design-lab-menubar-panel-pinned-favorites')).toBeInTheDocument();
    expect(screen.getByTestId('design-lab-menubar-panel-theme-contrast')).toBeInTheDocument();
  });

  it('action header icin ayri galeriyi gosterir', () => {
    const { container } = render(<DesignLabMenuBarShowcase itemName="Action Header" />);

    const panels = container.querySelectorAll('[data-testid^="design-lab-menubar-panel-"]');
    expect(panels.length).toBe(3);
    expect(screen.getByText('Action Header Gallery')).toBeInTheDocument();
    expect(screen.getByTestId('design-lab-menubar-panel-action-header')).toBeInTheDocument();
    expect(screen.getByTestId('design-lab-menubar-panel-analytics-dense')).toBeInTheDocument();
    expect(screen.getByTestId('design-lab-menubar-panel-readonly-governance')).toBeInTheDocument();
  });
});
