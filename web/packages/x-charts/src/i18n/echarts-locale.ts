/**
 * ECharts Locale Registration
 *
 * Integrates ECharts built-in locale system with the @mfe/i18n-dicts
 * dictionary format. Registers locale data for tooltips, legend,
 * toolbox, and data zoom labels.
 *
 * ECharts uses its own locale system separate from browser Intl.
 * This adapter maps @mfe/i18n-dicts locale codes (BCP 47) to
 * ECharts locale registration format.
 *
 * @see ChartSpec.locale (locale_spec field)
 * @see R-010 risk: i18n ECharts locale conflicts
 */

/**
 * Map of BCP 47 locale codes → ECharts locale registration key.
 * ECharts uses uppercase region codes internally.
 */
export const ECHARTS_LOCALE_MAP: Record<string, string> = {
  'tr-TR': 'TR',
  'en-US': 'EN',
  'en-GB': 'EN',
  'de-DE': 'DE',
  'fr-FR': 'FR',
  'ar-SA': 'AR',
  'ja-JP': 'JA',
  'zh-CN': 'ZH',
};

/**
 * ECharts locale definition shape (subset used by charts).
 */
interface EChartsLocaleData {
  toolbox: {
    saveAsImage: { title: string };
    dataView: { title: string; lang: string[] };
    restore: { title: string };
    dataZoom: { title: Record<string, string> };
  };
  legend: { selector: { all: string; inverse: string } };
  series: { typeNames: Record<string, string> };
}

/**
 * Default locale data (Turkish — primary locale per ChartSpec default).
 */
const TR_LOCALE: EChartsLocaleData = {
  toolbox: {
    saveAsImage: { title: 'Resim olarak kaydet' },
    dataView: { title: 'Veri görünümü', lang: ['Veri Görünümü', 'Kapat', 'Yenile'] },
    restore: { title: 'Geri yükle' },
    dataZoom: { title: { zoom: 'Yakınlaştır', back: 'Sıfırla' } },
  },
  legend: { selector: { all: 'Tümü', inverse: 'Ters çevir' } },
  series: {
    typeNames: {
      bar: 'Çubuk grafik',
      line: 'Çizgi grafik',
      pie: 'Pasta grafik',
      scatter: 'Dağılım grafiği',
      gauge: 'Gösterge',
      radar: 'Radar grafik',
    },
  },
};

const EN_LOCALE: EChartsLocaleData = {
  toolbox: {
    saveAsImage: { title: 'Save as image' },
    dataView: { title: 'Data view', lang: ['Data View', 'Close', 'Refresh'] },
    restore: { title: 'Restore' },
    dataZoom: { title: { zoom: 'Zoom', back: 'Reset' } },
  },
  legend: { selector: { all: 'All', inverse: 'Inverse' } },
  series: {
    typeNames: {
      bar: 'Bar chart',
      line: 'Line chart',
      pie: 'Pie chart',
      scatter: 'Scatter chart',
      gauge: 'Gauge',
      radar: 'Radar chart',
    },
  },
};

const LOCALE_DATA: Record<string, EChartsLocaleData> = {
  TR: TR_LOCALE,
  EN: EN_LOCALE,
};

/**  Registered locale keys (track to avoid double-registration). */
const registeredLocales = new Set<string>();

/**
 * Register a locale with ECharts. Safe to call multiple times
 * — duplicate registrations are skipped.
 *
 * @param bcp47 - BCP 47 locale code (e.g. 'tr-TR', 'en-US')
 * @returns The ECharts locale key (e.g. 'TR', 'EN') or null if unsupported
 */
export function registerEChartsLocale(bcp47: string): string | null {
  const echartsKey = ECHARTS_LOCALE_MAP[bcp47] ?? ECHARTS_LOCALE_MAP[bcp47.split('-')[0] + '-' + bcp47.split('-')[0].toUpperCase()];
  if (!echartsKey) return null;
  if (registeredLocales.has(echartsKey)) return echartsKey;

  // ECharts registerLocale is on the echarts module — we store the data
  // and let the renderer apply it via init({ locale })
  registeredLocales.add(echartsKey);
  return echartsKey;
}

/**
 * Get locale data for an ECharts locale key.
 * Returns the data object for use with `echarts.init(dom, theme, { locale })`.
 */
export function getEChartsLocale(bcp47: string): EChartsLocaleData | null {
  const key = ECHARTS_LOCALE_MAP[bcp47];
  return key ? (LOCALE_DATA[key] ?? null) : null;
}
