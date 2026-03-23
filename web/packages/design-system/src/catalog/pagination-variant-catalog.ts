export type PaginationVariantId =
  | 'server_default'
  | 'client_compact'
  | 'server_dense'
  | 'client_default'
  | 'simple_pill'
  | 'rounded_outlined'
  | 'centered_first_last'
  | 'unknown_total_stream'
  | 'ghost_mobile'
  | 'ellipsis_tight'
  | 'ellipsis_wide'
  | 'server_no_info'
  | 'compact_no_info'
  | 'readonly'
  | 'disabled';

export type PaginationVariantDescriptor = {
  id: PaginationVariantId;
  name: string;
  description: string;
  badges: string[];
  variantAxes: string[];
  stateModel: string[];
  previewFocus: string[];
  regressionFocus: string[];
};

export const paginationVariantCatalog: PaginationVariantDescriptor[] = [
  {
    id: 'server_default',
    name: 'Show Total Footer',
    description: 'Ant Design showTotal hissine yakin olacak sekilde toplam kayit ve pencere ozetini footer sayfalamasi ile birlestirir.',
    badges: ['SERVER', 'SHOW-TOTAL', 'GRID'],
    variantAxes: ['mode: server', 'size: md', 'summary: visible', 'table footer: enabled'],
    stateModel: ['controlled page state', 'server fetch hand-off', 'footer metrics strip', 'table footer sync'],
    previewFocus: ['table pagination footer', 'visible total window', 'show total summary'],
    regressionFocus: ['page clamp', 'range summary sync', 'footer alignment'],
  },
  {
    id: 'client_compact',
    name: 'Mini Size Changer',
    description: 'Mini boyutlu sayfalamayi built-in size changer ile tek primitive satirinda toplar; Ant Design mini varyantina daha yakindir.',
    badges: ['CLIENT', 'MINI', 'SIZE-CHANGER'],
    variantAxes: ['mode: client', 'size: sm', 'compact: true', 'showSizeChanger: true'],
    stateModel: ['controlled page state', 'compact spacing', 'built-in page-size sync'],
    previewFocus: ['mini list footer', 'tight control spacing', 'card deck pagination'],
    regressionFocus: ['small button sizing', 'wrap behavior', 'page-size reset'],
  },
  {
    id: 'server_dense',
    name: 'Dense Side Rail',
    description: 'Yan panel, rail ve dar filtre kolonlari icin kucuk boyutlu ama tam kontrollu sunucu sayfalamasi.',
    badges: ['SERVER', 'RAIL', 'SM'],
    variantAxes: ['mode: server', 'size: sm', 'container: narrow', 'state model: context'],
    stateModel: ['context-driven page state', 'small control footprint', 'narrow rail summary'],
    previewFocus: ['pagination context', 'side rail container', 'custom first-prev-next-last controls'],
    regressionFocus: ['context sync', 'keyboard order', 'rail overflow'],
  },
  {
    id: 'client_default',
    name: 'Inline Size Changer',
    description: 'Pagination ile built-in page-size secicisini ayni primitive hatta tutar; gorsel olarak Ant Design changer duzenine yakindir.',
    badges: ['CLIENT', 'INLINE', 'SIZE-CHANGER'],
    variantAxes: ['mode: client', 'pageSize: dynamic', 'showSizeChanger: true', 'summary: adaptive'],
    stateModel: ['controlled page state', 'page-size reset', 'adaptive page count', 'built-in size changer'],
    previewFocus: ['inline size changer', 'page count recalculation', 'list personalization'],
    regressionFocus: ['page-size clamp', 'selection sync', 'range recalculation'],
  },
  {
    id: 'simple_pill',
    name: 'Simple Pill Pager',
    description: 'Ant Design simple mode hissini daha modern pill sekli ve kompakt odakla sunar; yalniz prev-next ve sayfa gostergesi gorunur.',
    badges: ['SIMPLE', 'PILL', 'ANTD-INSPIRED'],
    variantAxes: ['simple: true', 'shape: pill', 'appearance: ghost', 'align: center'],
    stateModel: ['controlled page state', 'minimal navigation', 'summary indicator chip'],
    previewFocus: ['simple pager', 'compact toolbar', 'pill navigation'],
    regressionFocus: ['simple indicator sync', 'prev-next guard', 'align behavior'],
  },
  {
    id: 'rounded_outlined',
    name: 'Rounded Outline Set',
    description: 'MUI outlined + rounded-sm hissine daha yakin, sakin tonlu ve merkezi hizalanmis page button seti.',
    badges: ['MUI-INSPIRED', 'OUTLINE', 'ROUNDED'],
    variantAxes: ['appearance: outline', 'shape: rounded-sm', 'align: center'],
    stateModel: ['controlled page state', 'outlined active state', 'balanced page window'],
    previewFocus: ['outlined page chips', 'centered pager', 'rounded button rhythm'],
    regressionFocus: ['active outline styling', 'center alignment', 'shape persistence'],
  },
  {
    id: 'centered_first_last',
    name: 'Centered First Last',
    description: 'Merkeze hizali, first-last kontrollu ve genis pencere gosteren tam navigasyonlu toolbar.',
    badges: ['CENTER', 'FIRST-LAST', 'DESKTOP'],
    variantAxes: ['align: center', 'showFirstLastButtons: true', 'boundaryCount: 2'],
    stateModel: ['controlled page state', 'full navigation rails', 'wide context window'],
    previewFocus: ['first-last affordance', 'desktop toolbar', 'wide context around current page'],
    regressionFocus: ['first-last bounds', 'center wrapping', 'boundary math'],
  },
  {
    id: 'unknown_total_stream',
    name: 'Unknown Total Stream',
    description: 'MUI table pagination count=-1 modeline benzer sekilde toplam kayit bilinmeden ileri akisi surdurur.',
    badges: ['UNKNOWN-TOTAL', 'SERVER', 'STREAM'],
    variantAxes: ['table footer', 'totalItemsKnown: false', 'hasNextPage: dynamic'],
    stateModel: ['server cursor mode', 'unknown total label', 'next-page availability'],
    previewFocus: ['streaming footer', 'unknown total copy', 'cursor-like paging'],
    regressionFocus: ['unknown total label', 'last button guard', 'next availability'],
  },
  {
    id: 'ghost_mobile',
    name: 'Ghost Mobile Pager',
    description: 'Dar ekranlar ve alt toolbarlar icin ghost gorunumlu, pill sekilli ve kisa metrikli mobil odakli sayfalama.',
    badges: ['MOBILE', 'GHOST', 'COMPACT'],
    variantAxes: ['size: sm', 'appearance: ghost', 'shape: pill', 'showPageInfo: false'],
    stateModel: ['controlled page state', 'compact mobile spacing', 'minimal footer controls'],
    previewFocus: ['mobile footer', 'ghost buttons', 'narrow layout resilience'],
    regressionFocus: ['wrap under narrow width', 'pill spacing', 'touch target density'],
  },
  {
    id: 'ellipsis_tight',
    name: 'Inline Quick Jumper',
    description: 'Pagination built-in size changer ve quick jumper alanlarini ayni primitive satirda birlestirir; dogrudan sayfa atlamayi gorunur kilar.',
    badges: ['SERVER', 'INLINE', 'JUMPER'],
    variantAxes: ['mode: server', 'siblingCount: 1', 'showSizeChanger: true', 'showQuickJumper: true'],
    stateModel: ['controlled page state', 'direct input jump', 'tight ellipsis window', 'built-in jumper sync'],
    previewFocus: ['quick jumper', 'long-range navigation', 'page input validation'],
    regressionFocus: ['jump clamp', 'ellipsis placement', 'input sync'],
  },
  {
    id: 'ellipsis_wide',
    name: 'More Pages Window',
    description: 'Daha genis sayfa penceresi ve ellipsis davranisiyla klasik more-pages gorunumunu verir.',
    badges: ['SERVER', 'ELLIPSIS', 'MORE'],
    variantAxes: ['mode: server', 'siblingCount: 2', 'summary: visible'],
    stateModel: ['controlled page state', 'wide context window', 'context-rich footer'],
    previewFocus: ['wider context around current page', 'analytics pagination', 'balanced page window'],
    regressionFocus: ['sibling window math', 'ellipsis thresholds', 'footer stability'],
  },
  {
    id: 'server_no_info',
    name: 'Simple Toolbar Pager',
    description: 'Bilgi satiri disarida kalan, sadece inline toolbar controls gosteren sade sayfalama paterni.',
    badges: ['SERVER', 'SIMPLE', 'TOOLBAR'],
    variantAxes: ['mode: server', 'showPageInfo: false', 'layout: inline toolbar'],
    stateModel: ['controlled page state', 'summary hidden', 'inline toolbar composition'],
    previewFocus: ['minimal toolbar footer', 'inline navigation', 'space-efficient actions'],
    regressionFocus: ['page-info toggle', 'toolbar wrap', 'navigation semantics'],
  },
  {
    id: 'compact_no_info',
    name: 'Mini Simple Footer',
    description: 'Bilgi satiri olmadan kart ve modal footerlari icin mini, sade ve hizli bir navigasyon sunar.',
    badges: ['CLIENT', 'MINI', 'SIMPLE'],
    variantAxes: ['mode: client', 'compact: true', 'showPageInfo: false'],
    stateModel: ['controlled page state', 'summary hidden', 'card footer spacing'],
    previewFocus: ['card deck footer', 'minimal visual footprint', 'modal-friendly navigation'],
    regressionFocus: ['compact layout wrap', 'footer spacing', 'page selection state'],
  },
  {
    id: 'readonly',
    name: 'Readonly Snapshot',
    description: 'Audit ve governance ekranlarinda mevcut sayfayi gosteren, etkilesimi bilincli olarak kapatan snapshot hali.',
    badges: ['READONLY', 'AUDIT', 'LOCKED'],
    variantAxes: ['access: readonly', 'mode: server', 'snapshot: visible'],
    stateModel: ['blocked interaction', 'visible current page', 'lock reason hint'],
    previewFocus: ['audit freeze state', 'readonly affordance', 'visible snapshot context'],
    regressionFocus: ['readonly guard', 'hint visibility', 'access-state styling'],
  },
  {
    id: 'disabled',
    name: 'Disabled Jumper States',
    description: 'Built-in size changer ve quick jumper alanlarinin enabled ve disabled hallerini ayni primitive state kontrati icinde karsilastirir.',
    badges: ['DISABLED', 'JUMPER', 'STATE-COMPARE'],
    variantAxes: ['access: disabled', 'mode: server', 'loading: visible', 'quick jumper: built-in compared'],
    stateModel: ['disabled buttons', 'guarded interaction', 'loading-safe navigation', 'enabled-disabled parity', 'built-in control lock'],
    previewFocus: ['enabled vs disabled comparison', 'transition-safe controls', 'disabled semantics'],
    regressionFocus: ['disabled guard', 'button opacity and state', 'quick jumper lock state', 'size changer lock state'],
  },
];

export const paginationVariantNames = paginationVariantCatalog.map((variant) => variant.name);

export const paginationVariantById = new Map(
  paginationVariantCatalog.map((variant) => [variant.id, variant] as const),
);

export const paginationVariantByName = new Map(
  paginationVariantCatalog.map((variant) => [variant.name, variant] as const),
);

export const getPaginationVariantDescriptor = (id: PaginationVariantId): PaginationVariantDescriptor => {
  const variant = paginationVariantById.get(id);
  if (!variant) {
    throw new Error(`Unknown pagination variant: ${id}`);
  }

  return variant;
};
