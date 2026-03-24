export type MenuBarReplaceableLegacyVariantId =
  | 'horizontal_default'
  | 'header_utility'
  | 'search_header'
  | 'submenu_checkbox_radio'
  | 'selection_action_header';

export type MenuBarCompatibilityVariantId =
  | 'overflow_more'
  | 'responsive_app_header'
  | 'account_utility_cluster'
  | 'pinned_favorites'
  | 'readonly_governance'
  | 'analytics_dense'
  | 'command_hybrid'
  | 'subdomain_shell'
  | 'theme_contrast';

export type MenuBarLegacyVariantId =
  | MenuBarReplaceableLegacyVariantId
  | MenuBarCompatibilityVariantId;

export type MenuBarCanonicalRecipeId =
  | 'app_header'
  | 'navigation_menu'
  | 'search_command_header'
  | 'action_header'
  | 'desktop_menubar';

export type MenuBarRenderableVariantId =
  | MenuBarCanonicalRecipeId
  | MenuBarCompatibilityVariantId;

export type MenuBarVariantId = MenuBarCanonicalRecipeId | MenuBarLegacyVariantId;

export type MenuBarVariantCluster =
  | 'core_navigation'
  | 'header_shells'
  | 'search_and_command'
  | 'enterprise_and_density'
  | 'governance_and_access';

export type MenuBarVariantDescriptor = {
  id: MenuBarRenderableVariantId;
  cluster: MenuBarVariantCluster;
  name: string;
  description: string;
  badges: string[];
  modes: string[];
  benchmarkPrimary: string[];
  benchmarkSecondary: string[];
  variantAxes: string[];
  stateModel: string[];
  previewFocus: string[];
  regressionFocus: string[];
};

export const menuBarVariantCatalog: MenuBarVariantDescriptor[] = [
  {
    id: 'navigation_menu',
    cluster: 'core_navigation',
    name: 'Navigation Menu',
    description:
      'Ant Design Menu ve MUI Menu cizgisindeki temel yatay menubar. Route-aware secim, submenu acilisi ve sakin utility ritmi icin baseline vitrindir.',
    badges: ['DEFAULT', 'ROUTE-AWARE', 'SUBMENU'],
    modes: ['default', 'route-aware', 'desktop'],
    benchmarkPrimary: ['Ant Design Menu', 'MUI Menu'],
    benchmarkSecondary: ['Base UI Menubar', 'Ariakit Menubar'],
    variantAxes: ['default appearance', 'currentPath active root', 'submenu parity'],
    stateModel: ['route-aware active root', 'desktop roving focus', 'submenu trigger'],
    previewFocus: ['default shell parity', 'active root emphasis', 'submenu affordance'],
    regressionFocus: ['root selection sync', 'link activation', 'submenu open state'],
  },
  {
    id: 'app_header',
    cluster: 'header_shells',
    name: 'App Header',
    description:
      'Branding ve utility cluster ile daha urunlesmis header yorumu. Ust barda nav ile durum/yardimci alanlar birlikte calisir.',
    badges: ['HEADER', 'UTILITY', 'PRODUCT'],
    modes: ['header shell', 'utility slot', 'status chip'],
    benchmarkPrimary: ['Ant Design Menu', 'MUI App Bar', 'MUI Toolbar'],
    benchmarkSecondary: ['Primer SubdomainNavBar', 'Toolpad Layout'],
    variantAxes: ['startSlot/endSlot', 'utility chip cluster', 'route-aware shell'],
    stateModel: ['top shell context', 'utility persistence', 'active route parity'],
    previewFocus: ['header rhythm', 'utility balance', 'product shell feel'],
    regressionFocus: ['slot layout', 'route-aware active state', 'utility rendering'],
  },
  {
    id: 'search_command_header',
    cluster: 'search_and_command',
    name: 'Search / Command Header',
    description:
      'Search-first modern ust bar. Route, hizli islem ve rich submenu handoff ayni ust yuzeyde birlesir.',
    badges: ['SEARCH', 'COMMAND', 'HANDOFF'],
    modes: ['search-first', 'command handoff', 'rich submenu'],
    benchmarkPrimary: ['MUI App Bar', 'Ant Design Menu'],
    benchmarkSecondary: ['Mantine Spotlight', 'React Aria Menu', 'Chakra Action Bar'],
    variantAxes: ['enableSearchHandoff', 'searchPlaceholder', 'rich menu panel'],
    stateModel: ['search result routing', 'recent roots', 'favorite-friendly discovery'],
    previewFocus: ['header search UX', 'command discoverability', 'single-surface navigation'],
    regressionFocus: ['search menu naming', 'search result routing', 'submenu handoff'],
  },
  {
    id: 'desktop_menubar',
    cluster: 'core_navigation',
    name: 'Desktop Menubar',
    description:
      'Typed submenu parity odakli masaustu yorumu. Checkbox ve radio item tipleri ile preference menu deneyimini gosterir.',
    badges: ['CHECKBOX', 'RADIO', 'PREFERENCES'],
    modes: ['typed submenu', 'desktop settings', 'hover parity'],
    benchmarkPrimary: ['Ant Design Menu', 'MUI Menu'],
    benchmarkSecondary: ['Base UI Menubar', 'Ariakit Menubar'],
    variantAxes: ['checkbox menu items', 'radio menu items', 'hover submenu trigger'],
    stateModel: ['typed item state', 'submenu focus handoff', 'preference grouping'],
    previewFocus: ['typed submenu parity', 'desktop preference feel', 'group readability'],
    regressionFocus: ['checkbox state', 'radio selection', 'submenu grouping'],
  },
  {
    id: 'overflow_more',
    cluster: 'core_navigation',
    name: 'Overflow More',
    description:
      'Buyuk bilgi mimarisinde kritik rootlari koruyup ikincil rotalari kontrollu More menusu altina toplar.',
    badges: ['OVERFLOW', 'MORE', 'PRIORITY'],
    modes: ['collapse-to-more', 'priority retention', 'large IA'],
    benchmarkPrimary: ['Ant Design Menu', 'MUI Toolbar'],
    benchmarkSecondary: ['Primer ActionMenu', 'Chakra Menu'],
    variantAxes: ['overflowBehavior', 'overflowLabel', 'maxVisibleItems + priority'],
    stateModel: ['visible root retention', 'overflow bucket', 'active root preservation'],
    previewFocus: ['large IA control', 'priority-based simplification', 'overflow clarity'],
    regressionFocus: ['overflow trigger', 'priority retention', 'active route preservation'],
  },
  {
    id: 'responsive_app_header',
    cluster: 'header_shells',
    name: 'Responsive App Header',
    description:
      'Geniste label + icon, orta kirilimda ikon-only, daha darda menu fallback ile calisan responsive header.',
    badges: ['RESPONSIVE', 'ICON-ONLY', 'APP HEADER'],
    modes: ['responsive labels', 'menu fallback', 'utility collapse'],
    benchmarkPrimary: ['MUI App Bar', 'Ant Design Menu'],
    benchmarkSecondary: ['Toolpad Layout', 'Primer SubdomainNavBar'],
    variantAxes: ['labelVisibility: responsive', 'labelCollapseBreakpoint', 'mobileFallback'],
    stateModel: ['compact labels', 'compact viewport fallback', 'utility hide/preserve'],
    previewFocus: ['wider demo shell', 'icon-only transition', 'mobile fallback'],
    regressionFocus: ['responsive labels', 'menu fallback', 'utility collapse'],
  },
  {
    id: 'account_utility_cluster',
    cluster: 'header_shells',
    name: 'Account Utility Cluster',
    description:
      `Bildirim, rol ve hesap alanlarini ust barda toplayan urun shell recipe’i. Dense admin yuzeylerinde daginik utility hissini azaltir.`,
    badges: ['ACCOUNT', 'UTILITY', 'ADMIN'],
    modes: ['account cluster', 'notification shell', 'product header'],
    benchmarkPrimary: ['MUI Toolbar', 'Ant Design Menu'],
    benchmarkSecondary: ['Primer SubdomainNavBar', 'Chakra Menu'],
    variantAxes: ['endSlot utility cluster', 'badge-heavy roots', 'header balance'],
    stateModel: ['account persistence', 'notification context', 'case-focused active route'],
    previewFocus: ['account cluster readability', 'utility grouping', 'admin shell clarity'],
    regressionFocus: ['utility slot rendering', 'badge visibility', 'active root sync'],
  },
  {
    id: 'pinned_favorites',
    cluster: 'enterprise_and_density',
    name: 'Pinned Favorites',
    description:
      'Kurumsal bilgi mimarisinde kritik rotalari sabit tutar. Favoriler overflow algoritmasina da etki ederek hizli erisimi korur.',
    badges: ['PINNED', 'FAVORITES', 'ENTERPRISE'],
    modes: ['pinned roots', 'favorite memory', 'enterprise IA'],
    benchmarkPrimary: ['Ant Design Menu', 'MUI App Bar'],
    benchmarkSecondary: ['Primer SubdomainNavBar', 'React Aria Menu'],
    variantAxes: ['items[].pinned', 'showFavoriteToggle', 'overflow retention'],
    stateModel: ['favorite state', 'pinned priority', 'recent return paths'],
    previewFocus: ['critical root retention', 'favorite UX', 'enterprise manageability'],
    regressionFocus: ['favorite toggle', 'pinned indicator', 'overflow ordering'],
  },
  {
    id: 'readonly_governance',
    cluster: 'governance_and_access',
    name: 'Readonly Governance',
    description:
      'Policy ve denetim yuzeyleri icin readonly access farkini acik gosteren governance yorumu.',
    badges: ['READONLY', 'GOVERNANCE', 'ACCESS'],
    modes: ['readonly', 'governance shell', 'access-aware'],
    benchmarkPrimary: ['Ant Design Menu', 'MUI Toolbar'],
    benchmarkSecondary: ['React Aria Menu', 'Base UI Menubar'],
    variantAxes: ['access=readonly', 'disabled roots', 'governance badges'],
    stateModel: ['policy guard', 'hidden/disabled access state', 'readonly interaction block'],
    previewFocus: ['governance tone', 'readonly clarity', 'policy-safe behavior'],
    regressionFocus: ['readonly interaction blocking', 'disabled item state', 'access rendering'],
  },
  {
    id: 'analytics_dense',
    cluster: 'enterprise_and_density',
    name: 'Analytics Dense',
    description:
      'Veri yogun dashboard yuzeyleri icin daha sik menubar ritmi. Badge, grouped submenu ve saved-view hissi bir arada.',
    badges: ['ANALYTICS', 'DENSE', 'BADGE-HEAVY'],
    modes: ['dense workspace', 'saved view shell', 'analytics routing'],
    benchmarkPrimary: ['MUI Toolbar', 'Ant Design Menu'],
    benchmarkSecondary: ['Primer ActionMenu', 'Chakra Menu'],
    variantAxes: ['dense spacing rhythm', 'grouped submenu', 'badge-heavy roots'],
    stateModel: ['active report context', 'watchlist signal state', 'dense workspace routing'],
    previewFocus: ['data-dense rhythm', 'saved view context', 'watch signal visibility'],
    regressionFocus: ['dense root readability', 'badge rendering', 'submenu grouping'],
  },
  {
    id: 'action_header',
    cluster: 'search_and_command',
    name: 'Action Header',
    description:
      'Bulk selection yapan ekranlar icin action-heavy menu yorumu. Ust bar, secim baglamini ve toplu islemleri ayni yerde tutar.',
    badges: ['SELECTION', 'ACTION', 'BULK'],
    modes: ['selection context', 'bulk action', 'task-oriented'],
    benchmarkPrimary: ['MUI Toolbar', 'Ant Design Menu'],
    benchmarkSecondary: ['Chakra Action Bar', 'Primer ActionMenu'],
    variantAxes: ['selection badge', 'action mix', 'task-focused submenu'],
    stateModel: ['selection-driven actions', 'bulk routing', 'task grouping'],
    previewFocus: ['bulk action clarity', 'selection context', 'action density balance'],
    regressionFocus: ['selection state visibility', 'bulk action routing', 'submenu action grouping'],
  },
  {
    id: 'command_hybrid',
    cluster: 'search_and_command',
    name: 'Command Hybrid',
    description:
      'Navigation ile komut tetiklemeyi ayni ust yuzeyde birlestiren hibrit varyant. Ozellikle operasyon ekipleri icin hizlidir.',
    badges: ['COMMAND', 'HYBRID', 'OPS'],
    modes: ['command-centric', 'search handoff', 'ops shell'],
    benchmarkPrimary: ['MUI App Bar', 'Ant Design Menu'],
    benchmarkSecondary: ['Mantine Spotlight', 'Chakra Action Bar'],
    variantAxes: ['search handoff', 'command-centric roots', 'rich submenu metadata'],
    stateModel: ['command routing', 'ops queue context', 'recent command memory'],
    previewFocus: ['command speed', 'ops discoverability', 'navigation-command fusion'],
    regressionFocus: ['search handoff', 'command submenu routing', 'recent root updates'],
  },
  {
    id: 'subdomain_shell',
    cluster: 'header_shells',
    name: 'Subdomain Shell',
    description:
      'Primer benzeri urun shell hissi verir; marka, route ve release bilgisini ayni ust navigasyonda dengeler.',
    badges: ['SUBDOMAIN', 'SHELL', 'PRODUCT'],
    modes: ['subdomain header', 'brand shell', 'release context'],
    benchmarkPrimary: ['Ant Design Menu', 'MUI App Bar'],
    benchmarkSecondary: ['Primer SubdomainNavBar', 'Radix Navigation Menu'],
    variantAxes: ['brand slot', 'route grouping', 'release badge'],
    stateModel: ['brand-route balance', 'release context', 'subdomain navigation'],
    previewFocus: ['brand balance', 'subdomain clarity', 'product shell polish'],
    regressionFocus: ['brand slot rendering', 'route grouping', 'release badge visibility'],
  },
  {
    id: 'theme_contrast',
    cluster: 'governance_and_access',
    name: 'Theme Contrast',
    description:
      'Ayni primitive’in tema ve kontrast davranisini gosteren varyant. Farkli renk duzenlerinde okunurlugu ve buton ritmini test eder.',
    badges: ['THEME', 'CONTRAST', 'VISUAL'],
    modes: ['theme stress', 'contrast shell', 'visual QA'],
    benchmarkPrimary: ['MUI Toolbar', 'Ant Design Menu'],
    benchmarkSecondary: ['Chakra Menu', 'Base UI Menubar'],
    variantAxes: ['surface contrast', 'ghost/outline rhythm', 'badge readability'],
    stateModel: ['visual contrast state', 'theme token behavior', 'accent parity'],
    previewFocus: ['contrast durability', 'visual polish', 'theme adaptability'],
    regressionFocus: ['contrast readability', 'surface parity', 'theme token consistency'],
  },
];

export const menuBarVariantById = new Map(
  menuBarVariantCatalog.map((variant) => [variant.id, variant] as const),
);

const menuBarCanonicalVariantByLegacyId: Record<
  MenuBarReplaceableLegacyVariantId,
  MenuBarCanonicalRecipeId
> = {
  header_utility: 'app_header',
  horizontal_default: 'navigation_menu',
  search_header: 'search_command_header',
  selection_action_header: 'action_header',
  submenu_checkbox_radio: 'desktop_menubar',
};

export const normalizeMenuBarVariantId = (
  id: MenuBarVariantId,
): MenuBarRenderableVariantId =>
  menuBarCanonicalVariantByLegacyId[id as MenuBarReplaceableLegacyVariantId]
  ?? (id as MenuBarRenderableVariantId);

export const isMenuBarVariantId = (value: string): value is MenuBarVariantId =>
  menuBarVariantById.has(value as MenuBarRenderableVariantId) || value in menuBarCanonicalVariantByLegacyId;

export const getMenuBarVariantDescriptor = (id: MenuBarVariantId): MenuBarVariantDescriptor => {
  const resolvedVariantId = normalizeMenuBarVariantId(id);
  const variant = menuBarVariantById.get(resolvedVariantId);
  if (!variant) {
    throw new Error(`Unknown menu bar variant: ${id}`);
  }

  return variant;
};
