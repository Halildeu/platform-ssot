import React from 'react';
import {
  getMenuBarVariantDescriptor,
  normalizeMenuBarVariantId,
  type MenuBarVariantId,
} from '../../../../../../../../../packages/design-system/src/catalog/menu-bar-variant-catalog';
import type { ComponentShowcaseSection } from '../../showcaseTypes';
import {
  DesignLabMenuBarScenarioFrame,
  DesignLabMenuBarVariantPreview,
} from './menuBarShared';

export type MenuBarShowcaseItemName =
  | 'MenuBar'
  | 'App Header'
  | 'Navigation Menu'
  | 'Search / Command Header'
  | 'Action Header'
  | 'Desktop Menubar';

type MenuBarShowcaseLegacyAlias = 'Command Header' | 'Action Bar';

const menuBarShowcaseLegacyAliasMap: Record<MenuBarShowcaseLegacyAlias, MenuBarShowcaseItemName> = {
  'Command Header': 'Search / Command Header',
  'Action Bar': 'Action Header',
};

const normalizeMenuBarShowcaseItemName = (itemName: string): MenuBarShowcaseItemName => {
  const isCanonicalMenuBarShowcaseItemName = (candidate: string): candidate is MenuBarShowcaseItemName =>
    menuBarShowcaseCatalog.some((descriptor) => descriptor.itemName === candidate);

  if (isCanonicalMenuBarShowcaseItemName(itemName)) {
    return itemName;
  }

  return menuBarShowcaseLegacyAliasMap[itemName as MenuBarShowcaseLegacyAlias] ?? 'MenuBar';
};

export type BuildMenuBarShowcaseSectionsOptions = {
  ariaLabel?: string;
  locale?: string;
  itemName?: string;
};

type MenuBarShowcaseDescriptor = {
  itemName: MenuBarShowcaseItemName;
  title: string;
  description: string;
  variantIds: MenuBarVariantId[];
};

export const resolveMenuBarShowcaseVariantIds = (variantIds: readonly MenuBarVariantId[]): MenuBarVariantId[] =>
  Array.from(
    new Set(variantIds.map((variantId) => normalizeMenuBarVariantId(variantId))),
  );

export const menuBarShowcaseCatalog: readonly MenuBarShowcaseDescriptor[] = [
  {
    itemName: 'MenuBar',
    title: 'MenuBar Variant Gallery',
    description:
      'Gercek menubar davranislarini gosteren varyantlar. Typed submenu, overflow ve pinned root gibi menubar-first capability setini odakta tutar.',
    variantIds: ['navigation_menu', 'desktop_menubar', 'overflow_more', 'pinned_favorites', 'theme_contrast'],
  },
  {
    itemName: 'App Header',
    title: 'App Header Gallery',
    description:
      'Branding, utility cluster, responsive shell ve subdomain rhythm senaryolarini ayni ust uygulama kabugunda toplar.',
    variantIds: ['app_header', 'responsive_app_header', 'account_utility_cluster', 'subdomain_shell'],
  },
  {
    itemName: 'Navigation Menu',
    title: 'Navigation Menu Gallery',
    description:
      'Buyuk bilgi mimarisini, overflow kontrolunu ve subdomain navigation akisini menu-first yuzeylerde gosteren varyant seti.',
    variantIds: ['navigation_menu', 'overflow_more', 'subdomain_shell', 'pinned_favorites'],
  },
  {
    itemName: 'Search / Command Header',
    title: 'Search / Command Header Gallery',
    description:
      'Search handoff, recents, favorites ve command-centric root akisini modern ust bar deneyiminde birlestirir.',
    variantIds: ['search_command_header', 'command_hybrid', 'pinned_favorites'],
  },
  {
    itemName: 'Action Header',
    title: 'Action Header Gallery',
    description:
      'Selection-driven bulk action, dense operations ve governance odakli task header varyantlarini ust seviyede ayristirir.',
    variantIds: ['action_header', 'readonly_governance', 'analytics_dense'],
  },
  {
    itemName: 'Desktop Menubar',
    title: 'Desktop Menubar Gallery',
    description:
      'File / view / tools çizgisinde desktop menubar davranisini artıran, hover ve typed alt menü ile masaüstü ritmi veren varyantlar.',
    variantIds: ['desktop_menubar', 'overflow_more'],
  },
] as const;

const defaultMenuBarShowcaseItemName: MenuBarShowcaseItemName = 'MenuBar';

export const isMenuBarShowcaseItemName = (value: string): value is MenuBarShowcaseItemName =>
  menuBarShowcaseCatalog.some((descriptor) => descriptor.itemName === normalizeMenuBarShowcaseItemName(value));

export const getMenuBarShowcaseDescriptor = (
  itemName: string = defaultMenuBarShowcaseItemName,
): MenuBarShowcaseDescriptor =>
  menuBarShowcaseCatalog.find((descriptor) => descriptor.itemName === normalizeMenuBarShowcaseItemName(itemName))
  ?? menuBarShowcaseCatalog[0];

export const buildMenuBarShowcaseSections = ({
  ariaLabel,
  locale = 'tr',
  itemName = defaultMenuBarShowcaseItemName,
}: BuildMenuBarShowcaseSectionsOptions = {}): ComponentShowcaseSection[] =>
  resolveMenuBarShowcaseVariantIds(getMenuBarShowcaseDescriptor(itemName).variantIds).map((variantId, index) => {
    const resolvedVariantId = normalizeMenuBarVariantId(variantId);
    const variant = getMenuBarVariantDescriptor(resolvedVariantId);

    return {
      id: resolvedVariantId.replace(/_/g, '-'),
      eyebrow: `Variant ${String(index + 1).padStart(2, '0')}`,
      title: variant.name,
      description: variant.description,
      badges: variant.badges,
      content: (
        <DesignLabMenuBarScenarioFrame variantId={resolvedVariantId}>
          <DesignLabMenuBarVariantPreview
            variantId={resolvedVariantId}
            ariaLabel={ariaLabel}
            locale={locale}
          />
        </DesignLabMenuBarScenarioFrame>
      ),
    };
  });
