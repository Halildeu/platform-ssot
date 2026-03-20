/* ------------------------------------------------------------------ */
/*  MCP Tools — Design System Model Context Protocol                   */
/*                                                                     */
/*  AI agent'larin cagirabilecegi saf fonksiyonlar.                   */
/*  Tum veri, catalog doc entry'lerinden ve token dosyalarindan       */
/*  derlenir.                                                          */
/* ------------------------------------------------------------------ */

import { designLabComponentDocEntries } from '../catalog/component-docs';
import type { DesignLabComponentDocEntry } from '../catalog/component-docs/types';
import { semanticColorTokens, palette } from '../tokens/color';
import { spacing } from '../tokens/spacing';
import { radius } from '../tokens/radius';
import { fontSize, fontFamily, fontWeight, lineHeight, letterSpacing } from '../tokens/typography';
import { duration, easing } from '../tokens/motion';
import type {
  MCPComponentInfo,
  MCPPropInfo,
  MCPExampleInfo,
  MCPTokenInfo,
  MCPSearchResult,
  MCPSuggestion,
  MCPValidationResult,
  MCPValidationError,
  MCPGeneratedCode,
} from './types';

/* ------------------------------------------------------------------ */
/*  Dahili yardimcilar                                                 */
/* ------------------------------------------------------------------ */

/** Doc entry'den MCPComponentInfo'ya donusum */
function toComponentInfo(entry: DesignLabComponentDocEntry): MCPComponentInfo {
  const idx = entry.indexItem;
  const api = entry.apiItem;

  const props: MCPPropInfo[] = (api?.props ?? []).map((p) => ({
    name: p.name,
    type: p.type,
    required: p.required,
    default: p.default,
    description: p.description,
  }));

  const examples: MCPExampleInfo[] = buildExamples(entry);

  const relatedComponents = findRelatedComponents(entry);

  const accessibilityNotes = buildA11yNotes(entry);

  return {
    name: idx.name,
    description: idx.description,
    category: idx.group,
    lifecycle: idx.lifecycle === 'planned' ? 'beta' : idx.lifecycle,
    props,
    importStatement: idx.importStatement,
    examples,
    relatedComponents,
    accessibilityNotes,
  };
}

/** Bilesenin temel kullanimini gosteren ornekler uretir */
function buildExamples(entry: DesignLabComponentDocEntry): MCPExampleInfo[] {
  const { name } = entry.indexItem;
  const api = entry.apiItem;
  const examples: MCPExampleInfo[] = [];

  // Temel kullanim ornegi
  if (api && api.props.length > 0) {
    const requiredProps = api.props.filter((p) => p.required);
    const propsStr = requiredProps
      .map((p) => {
        if (p.type.includes('[]')) return `${p.name}={[]}`;
        if (p.type.includes('string')) return `${p.name}=""`;
        if (p.type.includes('boolean')) return `${p.name}`;
        if (p.type.includes('number')) return `${p.name}={0}`;
        if (p.type.includes('ReactNode')) return `${p.name}={<span />}`;
        return `${p.name}={undefined}`;
      })
      .join(' ');

    examples.push({
      title: `${name} — Temel kullanim`,
      description: `${name} bileseninin varsayilan ayarlarla kullanimi.`,
      code: `<${name}${propsStr ? ' ' + propsStr : ''}>${hasChildren(api) ? 'Icerik' : ''}</${name}>`,
      category: 'temel',
    });
  } else {
    examples.push({
      title: `${name} — Temel kullanim`,
      description: `${name} bileseninin varsayilan ayarlarla kullanimi.`,
      code: `<${name} />`,
      category: 'temel',
    });
  }

  // Varyant ornekleri
  if (api?.variantAxes) {
    const variantAxis = api.variantAxes.find((v) => v.startsWith('variant:'));
    if (variantAxis) {
      const variants = variantAxis
        .split(':')[1]
        .split('|')
        .map((v) => v.trim());
      const firstVariant = variants[0];
      if (firstVariant) {
        examples.push({
          title: `${name} — Varyant ornegi`,
          description: `Farkli varyantlarin kullanimi: ${variants.join(', ')}`,
          code: `<${name} variant="${firstVariant}">${hasChildren(api) ? 'Icerik' : ''}</${name}>`,
          category: 'varyant',
        });
      }
    }
  }

  return examples;
}

function hasChildren(api: NonNullable<DesignLabComponentDocEntry['apiItem']>): boolean {
  return api.props.some(
    (p) => p.name === 'children' || p.name.includes('children'),
  );
}

/** Ayni group'taki iliskili bilesenleri bulur */
function findRelatedComponents(entry: DesignLabComponentDocEntry): string[] {
  const group = entry.indexItem.group;
  return designLabComponentDocEntries
    .filter(
      (e) =>
        e.indexItem.group === group &&
        e.name !== entry.name &&
        e.indexItem.kind === 'component',
    )
    .slice(0, 5)
    .map((e) => e.name);
}

/** Erisilebilirlik notlarini olusturur */
function buildA11yNotes(entry: DesignLabComponentDocEntry): string[] {
  const notes: string[] = [];
  const gates = entry.indexItem.qualityGates;

  if (gates.includes('a11y_keyboard_support')) {
    notes.push('Klavye navigasyonu desteklenir.');
  }

  const api = entry.apiItem;
  if (api) {
    if (api.props.some((p) => p.name.includes('role') || p.name.includes('aria'))) {
      notes.push('ARIA role destegi mevcuttur.');
    }
    if (api.props.some((p) => p.name.includes('label') || p.name.includes('Label'))) {
      notes.push('Erisilebilir etiket (label) destegi vardir.');
    }
    if (api.stateModel.some((s) => s.includes('disabled'))) {
      notes.push('Disabled durumda interaction otomatik olarak engellenir.');
    }
    if (api.stateModel.some((s) => s.includes('focus'))) {
      notes.push('Focus yonetimi ve focus-visible destegi vardir.');
    }
  }

  if (notes.length === 0) {
    notes.push('Standart WCAG 2.1 AA uyumlulugu hedeflenir.');
  }

  return notes;
}

/** Basit metin eslestirme skoru hesaplar */
function computeRelevance(query: string, text: string): number {
  const q = query.toLowerCase();
  const t = text.toLowerCase();

  if (t === q) return 1.0;
  if (t.includes(q)) return 0.8;

  const words = q.split(/\s+/);
  const matched = words.filter((w) => t.includes(w));
  if (matched.length === 0) return 0;
  return (matched.length / words.length) * 0.6;
}

/* ------------------------------------------------------------------ */
/*  Component token haritasi                                           */
/* ------------------------------------------------------------------ */

const componentTokenMapping: Record<string, string[]> = {
  Button: ['action-primary', 'action-primary-hover', 'action-primary-active', 'text-inverse', 'surface-muted', 'border-default'],
  Alert: ['state-success-bg', 'state-success-text', 'state-warning-bg', 'state-warning-text', 'state-error-bg', 'state-error-text', 'state-info-bg', 'state-info-text'],
  Badge: ['state-success-bg', 'state-warning-bg', 'state-error-bg', 'state-info-bg', 'surface-muted', 'text-primary'],
  Card: ['surface-default', 'surface-raised', 'border-subtle', 'text-primary'],
  Input: ['surface-default', 'border-default', 'border-strong', 'text-primary', 'text-secondary', 'text-disabled'],
  Select: ['surface-default', 'border-default', 'text-primary', 'surface-raised'],
  Modal: ['surface-default', 'surface-canvas', 'text-primary', 'border-subtle'],
  Tabs: ['surface-default', 'action-primary', 'text-primary', 'text-secondary', 'border-subtle'],
  Tooltip: ['surface-raised', 'text-inverse'],
  Tag: ['surface-muted', 'text-primary', 'border-subtle'],
  Text: ['text-primary', 'text-secondary', 'text-disabled'],
  Divider: ['border-default', 'border-subtle'],
  Skeleton: ['surface-muted'],
  Spinner: ['action-primary'],
  Pagination: ['action-primary', 'text-primary', 'surface-muted', 'border-default'],
  Accordion: ['surface-default', 'border-subtle', 'text-primary', 'action-primary'],
  Breadcrumb: ['text-secondary', 'action-primary', 'text-primary'],
  Steps: ['action-primary', 'text-primary', 'text-secondary', 'surface-muted', 'border-default'],
  DatePicker: ['surface-default', 'action-primary', 'text-primary', 'border-default'],
  Combobox: ['surface-default', 'surface-raised', 'action-primary', 'text-primary', 'border-default'],
  Toast: ['state-success-bg', 'state-error-bg', 'state-warning-bg', 'state-info-bg', 'text-primary'],
};

/* ------------------------------------------------------------------ */
/*  Kullanim senaryosu -> bilesen esleme tablosu                       */
/* ------------------------------------------------------------------ */

const useCaseMap: Array<{ keywords: string[]; component: string; rationale: string }> = [
  { keywords: ['buton', 'button', 'aksiyon', 'action', 'tikla', 'click', 'kaydet', 'save', 'gonder', 'submit'], component: 'Button', rationale: 'Kullanici aksiyonlari icin temel buton bilesenini kullanin.' },
  { keywords: ['form', 'giris', 'input', 'metin', 'text', 'yaz'], component: 'TextInput', rationale: 'Metin girisi icin TextInput bilesenini kullanin.' },
  { keywords: ['secim', 'select', 'dropdown', 'liste', 'sec'], component: 'Select', rationale: 'Sabit seceneklerden secim icin Select bilesenini kullanin.' },
  { keywords: ['arama', 'search', 'combobox', 'autocomplete', 'otomatik'], component: 'Combobox', rationale: 'Arama ve filtreleme gerektiren secim icin Combobox kullanin.' },
  { keywords: ['tab', 'sekme', 'navigasyon', 'navigation'], component: 'Tabs', rationale: 'Icerik arasinda sekme tabanli gecis icin Tabs kullanin.' },
  { keywords: ['modal', 'dialog', 'popup', 'pencere', 'onay', 'confirm'], component: 'Modal', rationale: 'Kullanici onay veya overlay icerik icin Modal kullanin.' },
  { keywords: ['uyari', 'alert', 'bildirim', 'notification', 'hata', 'error', 'basari', 'success'], component: 'Alert', rationale: 'Durum bildirimi icin Alert bilesenini kullanin.' },
  { keywords: ['toast', 'snackbar', 'gecici', 'bildirim'], component: 'ToastProvider', rationale: 'Gecici bildirimler icin Toast sistemini kullanin.' },
  { keywords: ['tablo', 'table', 'veri', 'data', 'grid', 'liste'], component: 'TableSimple', rationale: 'Basit veri tablolari icin TableSimple kullanin.' },
  { keywords: ['kart', 'card', 'ozet', 'summary'], component: 'Card', rationale: 'Icerik gruplama ve ozet gosterimi icin Card kullanin.' },
  { keywords: ['breadcrumb', 'yol', 'path', 'izleme'], component: 'Breadcrumb', rationale: 'Sayfa hiyerarsisi navigasyonu icin Breadcrumb kullanin.' },
  { keywords: ['accordion', 'acilir', 'collapse', 'genisletme'], component: 'Accordion', rationale: 'Icerik gizle/goster icin Accordion kullanin.' },
  { keywords: ['tarih', 'date', 'takvim', 'calendar'], component: 'DatePicker', rationale: 'Tarih secimi icin DatePicker kullanin.' },
  { keywords: ['saat', 'time', 'zaman'], component: 'TimePicker', rationale: 'Saat secimi icin TimePicker kullanin.' },
  { keywords: ['dosya', 'file', 'upload', 'yukle'], component: 'Upload', rationale: 'Dosya yukleme icin Upload bilesenini kullanin.' },
  { keywords: ['slider', 'kaydirak', 'aralik', 'range'], component: 'Slider', rationale: 'Sayisal aralik secimi icin Slider kullanin.' },
  { keywords: ['switch', 'toggle', 'acma', 'kapama'], component: 'Switch', rationale: 'Ikili durum degistirme icin Switch kullanin.' },
  { keywords: ['checkbox', 'isaretleme', 'check', 'onay kutusu'], component: 'Checkbox', rationale: 'Coklu secim icin Checkbox kullanin.' },
  { keywords: ['radio', 'tek secim', 'secim grubu'], component: 'Radio', rationale: 'Tek secenek secimi icin Radio kullanin.' },
  { keywords: ['pagination', 'sayfalama', 'sayfa'], component: 'Pagination', rationale: 'Uzun listelerde sayfalama icin Pagination kullanin.' },
  { keywords: ['tree', 'agac', 'hiyerarsi', 'nested'], component: 'Tree', rationale: 'Hiyerarsik veri gosterimi icin Tree kullanin.' },
  { keywords: ['tooltip', 'ipucu', 'aciklama', 'hover'], component: 'Tooltip', rationale: 'Ek bilgi gosterimi icin Tooltip kullanin.' },
  { keywords: ['bos', 'empty', 'sonuc yok', 'no data'], component: 'EmptyState', rationale: 'Icerik yokken kullaniciya yonlendirme icin EmptyState kullanin.' },
  { keywords: ['adim', 'step', 'wizard', 'sihirbaz'], component: 'Steps', rationale: 'Cok adimli surecler icin Steps kullanin.' },
  { keywords: ['json', 'viewer', 'goruntuleme', 'veri gosterimi'], component: 'JsonViewer', rationale: 'JSON verisi goruntuleme icin JsonViewer kullanin.' },
  { keywords: ['menu', 'sag tik', 'context'], component: 'ContextMenu', rationale: 'Sag tik menu icin ContextMenu kullanin.' },
  { keywords: ['komut', 'command', 'palette', 'arama paleti'], component: 'CommandPalette', rationale: 'Hizli erisim komut paleti icin CommandPalette kullanin.' },
  { keywords: ['avatar', 'profil', 'kullanici resmi'], component: 'Avatar', rationale: 'Kullanici profil gosterimi icin Avatar kullanin.' },
  { keywords: ['badge', 'rozet', 'etiket', 'sayi'], component: 'Badge', rationale: 'Durum veya sayi gosterimi icin Badge kullanin.' },
  { keywords: ['grafik', 'chart', 'cizgi', 'bar', 'pasta', 'pie'], component: 'BarChart', rationale: 'Veri gorsellestime icin Chart bilesenlerini kullanin.' },
  { keywords: ['ai', 'yapay zeka', 'guven', 'confidence'], component: 'ConfidenceBadge', rationale: 'AI guven skoru gosterimi icin ConfidenceBadge kullanin.' },
  { keywords: ['prompt', 'ai giris', 'composer'], component: 'PromptComposer', rationale: 'AI prompt girisi icin PromptComposer kullanin.' },
  { keywords: ['oneri', 'recommendation', 'tavsiye'], component: 'RecommendationCard', rationale: 'Oneri kartlari icin RecommendationCard kullanin.' },
];

/* ------------------------------------------------------------------ */
/*  Public API                                                         */
/* ------------------------------------------------------------------ */

/**
 * Tum bilesenlerin katalogunu dondurur.
 * Her bilesen icin isim, aciklama, kategori ve yasam dongusu bilgisi icerir.
 */
export function getComponentCatalog(): MCPComponentInfo[] {
  return designLabComponentDocEntries
    .filter((e) => e.indexItem.kind === 'component')
    .map(toComponentInfo);
}

/**
 * Belirli bir bilesenin tam dokumantasyonunu dondurur.
 * Props, ornekler, erisilebilirlik notlari ve iliskili bilesenleri icerir.
 */
export function getComponentDoc(componentName: string): MCPComponentInfo | null {
  const entry = designLabComponentDocEntries.find(
    (e) => e.name.toLowerCase() === componentName.toLowerCase(),
  );
  if (!entry) return null;
  return toComponentInfo(entry);
}

/**
 * Bir bilesenin kullandigi tasarim tokenlarini dondurur.
 * CSS degiskeni, acik/koyu tema degerleri icerir.
 */
export function getComponentTokens(componentName: string): MCPTokenInfo[] {
  const tokenNames = componentTokenMapping[componentName];
  if (!tokenNames) return [];

  return tokenNames.map((tokenName) => {
    const cssVar = semanticColorTokens[tokenName as keyof typeof semanticColorTokens] ?? `--${tokenName}`;
    return {
      name: tokenName,
      cssVariable: `var(${cssVar})`,
      lightValue: resolveLightValue(tokenName),
      darkValue: resolveDarkValue(tokenName),
      category: 'color' as const,
    };
  });
}

/**
 * Bir bilesenin ornek kodlarini dondurur.
 */
export function getComponentExamples(componentName: string): MCPExampleInfo[] {
  const entry = designLabComponentDocEntries.find(
    (e) => e.name.toLowerCase() === componentName.toLowerCase(),
  );
  if (!entry) return [];
  return buildExamples(entry);
}

/**
 * Bilesenleri semantik olarak arar.
 * Isim, aciklama, tag ve prop eslesmelerini puanlar.
 */
export function searchComponents(query: string): MCPSearchResult[] {
  if (!query.trim()) return [];

  const results: MCPSearchResult[] = [];

  for (const entry of designLabComponentDocEntries) {
    if (entry.indexItem.kind !== 'component') continue;

    const idx = entry.indexItem;
    const searchText = [
      idx.name,
      idx.description,
      idx.group,
      idx.subgroup,
      idx.taxonomySubgroup,
      ...(idx.tags ?? []),
      ...(entry.apiItem?.props.map((p) => p.name) ?? []),
    ].join(' ');

    const relevance = computeRelevance(query, searchText);
    if (relevance > 0) {
      let matchReason = '';
      const q = query.toLowerCase();
      if (idx.name.toLowerCase().includes(q)) matchReason = 'Bilesen ismi eslesti';
      else if (idx.description.toLowerCase().includes(q)) matchReason = 'Aciklama eslesti';
      else if (idx.tags?.some((t) => t.toLowerCase().includes(q))) matchReason = 'Etiket eslesti';
      else matchReason = 'Kismen eslesti';

      results.push({
        component: idx.name,
        relevance,
        matchReason,
      });
    }
  }

  return results.sort((a, b) => b.relevance - a.relevance).slice(0, 10);
}

/**
 * Tum tasarim tokenlarini dondurur, opsiyonel kategori filtresi ile.
 */
export function getDesignTokens(category?: string): MCPTokenInfo[] {
  const tokens: MCPTokenInfo[] = [];

  // Renk tokenlari
  if (!category || category === 'color') {
    for (const [name, cssVar] of Object.entries(semanticColorTokens)) {
      tokens.push({
        name,
        cssVariable: `var(${cssVar})`,
        lightValue: resolveLightValue(name),
        darkValue: resolveDarkValue(name),
        category: 'color',
      });
    }
  }

  // Spacing tokenlari
  if (!category || category === 'spacing') {
    for (const [key, value] of Object.entries(spacing)) {
      tokens.push({
        name: `spacing-${key}`,
        cssVariable: `var(--spacing-${key})`,
        lightValue: value,
        darkValue: value,
        category: 'spacing',
      });
    }
  }

  // Typography tokenlari
  if (!category || category === 'typography') {
    for (const [key, value] of Object.entries(fontSize)) {
      tokens.push({
        name: `font-size-${key}`,
        cssVariable: `var(--font-size-${key})`,
        lightValue: value,
        darkValue: value,
        category: 'typography',
      });
    }
    for (const [key, value] of Object.entries(fontWeight)) {
      tokens.push({
        name: `font-weight-${key}`,
        cssVariable: `var(--font-weight-${key})`,
        lightValue: String(value),
        darkValue: String(value),
        category: 'typography',
      });
    }
  }

  // Border / Radius tokenlari
  if (!category || category === 'border') {
    for (const [key, value] of Object.entries(radius)) {
      tokens.push({
        name: `radius-${key}`,
        cssVariable: `var(--radius-${key})`,
        lightValue: value,
        darkValue: value,
        category: 'border',
      });
    }
  }

  // Motion tokenlari
  if (!category || category === 'motion') {
    for (const [key, value] of Object.entries(duration)) {
      tokens.push({
        name: `duration-${key}`,
        cssVariable: `var(--duration-${key})`,
        lightValue: value,
        darkValue: value,
        category: 'motion',
      });
    }
    for (const [key, value] of Object.entries(easing)) {
      tokens.push({
        name: `easing-${key}`,
        cssVariable: `var(--easing-${key})`,
        lightValue: value,
        darkValue: value,
        category: 'motion',
      });
    }
  }

  return tokens;
}

/**
 * Kullanim senaryosuna gore en uygun bileseni/bilesenleri onerir.
 * AI agent'lar icin optimize edilmis cikti uretir.
 */
export function suggestComponent(useCase: string): MCPSuggestion[] {
  if (!useCase.trim()) return [];

  const q = useCase.toLowerCase();
  const suggestions: MCPSuggestion[] = [];

  for (const mapping of useCaseMap) {
    const matched = mapping.keywords.filter((k) => q.includes(k));
    if (matched.length === 0) continue;

    const confidence = Math.min(matched.length / 2, 1.0);
    const entry = designLabComponentDocEntries.find(
      (e) => e.name === mapping.component,
    );

    const importStatement = entry?.indexItem.importStatement ?? `import { ${mapping.component} } from '@mfe/design-system';`;

    suggestions.push({
      component: mapping.component,
      confidence,
      rationale: mapping.rationale,
      exampleCode: `${importStatement}\n\n<${mapping.component} />`,
    });
  }

  // Eger dogrudan esleme bulunamazsa, arama ile dene
  if (suggestions.length === 0) {
    const searchResults = searchComponents(useCase);
    for (const result of searchResults.slice(0, 3)) {
      const entry = designLabComponentDocEntries.find(
        (e) => e.name === result.component,
      );
      if (entry) {
        suggestions.push({
          component: result.component,
          confidence: result.relevance * 0.5,
          rationale: `Arama sonucu eslesti: ${result.matchReason}`,
          exampleCode: `${entry.indexItem.importStatement}\n\n<${result.component} />`,
        });
      }
    }
  }

  return suggestions.sort((a, b) => b.confidence - a.confidence).slice(0, 5);
}

/**
 * Bilesen prop kullanimini dogrular ve duzeltme onerileri sunar.
 */
export function validateUsage(
  componentName: string,
  props: Record<string, unknown>,
): MCPValidationResult {
  const entry = designLabComponentDocEntries.find(
    (e) => e.name.toLowerCase() === componentName.toLowerCase(),
  );

  if (!entry) {
    return {
      valid: false,
      errors: [{ prop: '_component', message: `"${componentName}" bileseni bulunamadi.`, severity: 'error' }],
      suggestions: [`Mevcut bilesenleri goruntulemek icin getComponentCatalog() kullanin.`],
    };
  }

  if (!entry.apiItem) {
    return {
      valid: true,
      errors: [],
      suggestions: ['Bu bilesen icin detayli prop dokumantasyonu mevcut degil.'],
    };
  }

  const errors: MCPValidationError[] = [];
  const suggestions: string[] = [];
  const apiProps = entry.apiItem.props;
  const propNames = new Set(apiProps.map((p) => p.name.split(' / ')[0].trim()));

  // Zorunlu prop kontrolu
  for (const apiProp of apiProps) {
    const mainName = apiProp.name.split(' / ')[0].trim();
    if (apiProp.required && !(mainName in props)) {
      errors.push({
        prop: mainName,
        message: `Zorunlu prop "${mainName}" eksik. Tip: ${apiProp.type}`,
        severity: 'error',
      });
    }
  }

  // Bilinmeyen prop kontrolu
  for (const propName of Object.keys(props)) {
    if (!propNames.has(propName) && propName !== 'children' && propName !== 'className' && propName !== 'style') {
      errors.push({
        prop: propName,
        message: `"${propName}" tanimlanmamis bir prop. ${componentName} bu prop'u desteklemiyor olabilir.`,
        severity: 'warning',
      });
    }
  }

  // Tip uyumluluk kontrolleri
  for (const apiProp of apiProps) {
    const mainName = apiProp.name.split(' / ')[0].trim();
    if (mainName in props) {
      const value = props[mainName];
      const typeStr = apiProp.type;

      // Union type kontrolu
      if (typeStr.includes("'") && !typeStr.includes('|') === false) {
        const allowedValues = typeStr
          .split('|')
          .map((v) => v.trim().replace(/'/g, ''));
        if (typeof value === 'string' && !allowedValues.includes(value)) {
          errors.push({
            prop: mainName,
            message: `"${mainName}" icin gecersiz deger "${value}". Izin verilen degerler: ${allowedValues.join(', ')}`,
            severity: 'error',
          });
          suggestions.push(`"${mainName}" icin gecerli degerler: ${allowedValues.join(', ')}`);
        }
      }

      // Boolean tip kontrolu
      if (typeStr === 'boolean' && typeof value !== 'boolean') {
        errors.push({
          prop: mainName,
          message: `"${mainName}" boolean olmali ama ${typeof value} verildi.`,
          severity: 'warning',
        });
      }
    }
  }

  return {
    valid: errors.filter((e) => e.severity === 'error').length === 0,
    errors,
    suggestions,
  };
}

/**
 * Dogal dil gereksinimlerinden bilesen kullanim kodu uretir.
 */
export function generateCode(
  componentName: string,
  requirements: string,
): MCPGeneratedCode | null {
  const entry = designLabComponentDocEntries.find(
    (e) => e.name.toLowerCase() === componentName.toLowerCase(),
  );

  if (!entry) return null;

  const api = entry.apiItem;
  const importStatement = entry.indexItem.importStatement;
  const imports = [importStatement];

  const req = requirements.toLowerCase();
  const propsToSet: string[] = [];

  if (api) {
    for (const prop of api.props) {
      const mainName = prop.name.split(' / ')[0].trim();

      // Zorunlu proplar her zaman eklenir
      if (prop.required) {
        propsToSet.push(buildPropString(mainName, prop.type, prop.default));
        continue;
      }

      // Gereksinimlerde gecen proplar eklenir
      if (req.includes(mainName.toLowerCase())) {
        propsToSet.push(buildPropString(mainName, prop.type, prop.default));
      }
    }

    // Varyant axis eslesmesi
    for (const axis of api.variantAxes) {
      const [axisName, valuesStr] = axis.split(':').map((s) => s.trim());
      if (!axisName || !valuesStr) continue;

      const values = valuesStr.split('|').map((v) => v.trim());
      for (const val of values) {
        if (req.includes(val.toLowerCase())) {
          propsToSet.push(`${axisName}="${val}"`);
          break;
        }
      }
    }
  }

  const propsStr = propsToSet.length > 0 ? ' ' + propsToSet.join(' ') : '';
  const selfClosing = !api || !hasChildren(api);

  const code = selfClosing
    ? `<${entry.name}${propsStr} />`
    : `<${entry.name}${propsStr}>\n  {/* Icerik buraya gelecek */}\n</${entry.name}>`;

  return {
    code,
    imports,
    description: `${entry.name} bileseni, ${requirements} gereksinimi icin olusturuldu.`,
  };
}

/* ------------------------------------------------------------------ */
/*  Dahili yardimcilar                                                 */
/* ------------------------------------------------------------------ */

function buildPropString(name: string, type: string, defaultVal: string): string {
  if (type.includes('[]')) return `${name}={[]}`;
  if (type.includes('string') || type.includes("'")) {
    // Varsayilan deger varsa onu kullan
    if (defaultVal && defaultVal !== '-') {
      const cleanDefault = defaultVal.replace(/'/g, '').trim();
      return `${name}="${cleanDefault}"`;
    }
    return `${name}=""`;
  }
  if (type === 'boolean') return name;
  if (type.includes('number')) return `${name}={0}`;
  if (type.includes('ReactNode')) return `${name}={<span />}`;
  return `${name}={undefined}`;
}

function resolveLightValue(tokenName: string): string {
  const map: Record<string, string> = {
    'surface-default': palette.white,
    'surface-canvas': palette.gray50,
    'surface-muted': palette.gray100,
    'surface-raised': palette.white,
    'text-primary': palette.gray900,
    'text-secondary': palette.gray600,
    'text-disabled': palette.gray400,
    'text-inverse': palette.white,
    'border-default': palette.gray300,
    'border-subtle': palette.gray200,
    'border-strong': palette.gray400,
    'action-primary': palette.primary600,
    'action-primary-hover': palette.primary700,
    'action-primary-active': palette.primary800,
    'action-secondary': palette.gray100,
    'state-success-bg': palette.green50,
    'state-success-text': palette.green700,
    'state-warning-bg': palette.amber50,
    'state-warning-text': palette.amber700,
    'state-error-bg': palette.red50,
    'state-error-text': palette.red700,
    'state-info-bg': palette.blue50,
    'state-info-text': palette.blue700,
  };
  return map[tokenName] ?? 'inherit';
}

function resolveDarkValue(tokenName: string): string {
  const map: Record<string, string> = {
    'surface-default': palette.gray800,
    'surface-canvas': palette.gray900,
    'surface-muted': palette.gray700,
    'surface-raised': palette.gray700,
    'text-primary': palette.gray50,
    'text-secondary': palette.gray400,
    'text-disabled': palette.gray600,
    'text-inverse': palette.gray900,
    'border-default': palette.gray600,
    'border-subtle': palette.gray700,
    'border-strong': palette.gray500,
    'action-primary': palette.primary500,
    'action-primary-hover': palette.primary400,
    'action-primary-active': palette.primary300,
    'action-secondary': palette.gray700,
    'state-success-bg': '#052e16',
    'state-success-text': '#4ade80',
    'state-warning-bg': '#451a03',
    'state-warning-text': '#fbbf24',
    'state-error-bg': '#450a0a',
    'state-error-text': '#f87171',
    'state-info-bg': '#172554',
    'state-info-text': '#60a5fa',
  };
  return map[tokenName] ?? 'inherit';
}
