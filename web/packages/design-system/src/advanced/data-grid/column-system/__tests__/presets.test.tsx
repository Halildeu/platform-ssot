import { describe, expect, it } from 'vitest';
import {
  createBoldTextRenderer,
  createBadgeRenderer,
  createStatusRenderer,
  createDateRenderer,
  createNumberRenderer,
  createCurrencyRenderer,
  createBooleanRenderer,
  createPercentRenderer,
  createEnumRenderer,
} from '../presets';

const t = (key: string) => {
  const map: Record<string, string> = {
    'shared.status.active': 'Aktif',
    'shared.status.inactive': 'Pasif',
    'shared.role.admin': 'Yönetici',
    'shared.boolean.yes': 'Evet',
    'shared.boolean.no': 'Hayır',
  };
  return map[key] ?? key;
};

describe('createBoldTextRenderer', () => {
  const render = createBoldTextRenderer()!;

  it('değer varsa semibold span döndürür', () => {
    const result = render({ value: 'Dev Admin', data: undefined });
    expect(result).toBeTruthy();
  });

  it('null/boş değer — dash gösterir', () => {
    const result = render({ value: null, data: undefined });
    expect(result).toBeTruthy();
  });
});

describe('createBadgeRenderer', () => {
  const render = createBadgeRenderer(
    { ADMIN: 'danger', USER: 'info' },
    'default',
  );

  it('map edilen değer için Badge döndürür', () => {
    const result = render({ value: 'ADMIN', data: undefined });
    expect(result).toBeTruthy();
  });

  it('boş değer — dash döndürür', () => {
    const result = render({ value: '', data: undefined });
    expect(result).toBeTruthy();
  });

  it('labelMap ile i18n label gösterir', () => {
    const renderWithLabels = createBadgeRenderer(
      { ADMIN: 'danger' },
      'default',
      { ADMIN: 'shared.role.admin' },
      t,
    );
    const result = renderWithLabels({ value: 'ADMIN', data: undefined });
    expect(result).toBeTruthy();
  });
});

describe('createStatusRenderer', () => {
  const render = createStatusRenderer(
    {
      statusMap: {
        ACTIVE: { variant: 'success', labelKey: 'shared.status.active' },
        INACTIVE: { variant: 'muted', labelKey: 'shared.status.inactive' },
      },
    },
    t,
  );

  it('status map ile Badge + label döndürür', () => {
    const result = render({ value: 'ACTIVE', data: undefined });
    expect(result).toBeTruthy();
  });

  it('bilinmeyen status — ham değer gösterir', () => {
    const result = render({ value: 'UNKNOWN', data: undefined });
    expect(result).toBeTruthy();
  });
});

describe('createDateRenderer', () => {
  const render = createDateRenderer({ format: 'datetime' }, 'tr-TR');

  it('geçerli tarih — locale string döndürür', () => {
    const result = render({ value: '2024-01-15T10:30:00Z', data: undefined });
    expect(typeof result).toBe('string');
  });

  it('null değer — dash gösterir', () => {
    const result = render({ value: null, data: undefined });
    expect(result).toBeTruthy();
  });

  it('relative format — "az önce" gibi metin', () => {
    const recentRender = createDateRenderer({ format: 'relative' }, 'tr-TR');
    const result = recentRender({ value: new Date().toISOString(), data: undefined });
    expect(typeof result).toBe('string');
  });
});

describe('createNumberRenderer', () => {
  it('sayı + suffix formatlar', () => {
    const render = createNumberRenderer({ suffix: 'dk', decimals: 0 }, 'tr-TR');
    const result = render({ value: 60, data: undefined });
    expect(typeof result).toBe('string');
    expect(result).toContain('dk');
  });

  it('prefix + sayı formatlar', () => {
    const render = createNumberRenderer({ prefix: '₺', decimals: 2 }, 'tr-TR');
    const result = render({ value: 1500.5, data: undefined });
    expect(typeof result).toBe('string');
    expect(result).toContain('₺');
  });

  it('null değer — dash', () => {
    const render = createNumberRenderer({}, 'tr-TR');
    const result = render({ value: null, data: undefined });
    expect(result).toBeTruthy();
  });
});

describe('createCurrencyRenderer', () => {
  it('TRY formatlar', () => {
    const render = createCurrencyRenderer({ currencyCode: 'TRY' }, 'tr-TR');
    const result = render({ value: 1500, data: undefined });
    expect(typeof result).toBe('string');
  });
});

describe('createBooleanRenderer', () => {
  it('true → ✓ ikonu (icon mode)', () => {
    const render = createBooleanRenderer({ display: 'icon' }, t);
    const result = render({ value: true, data: undefined });
    expect(result).toBeTruthy();
  });

  it('false → ✗ ikonu', () => {
    const render = createBooleanRenderer({ display: 'icon' }, t);
    const result = render({ value: false, data: undefined });
    expect(result).toBeTruthy();
  });

  it('text mode — Evet/Hayır', () => {
    const render = createBooleanRenderer({ display: 'text', trueLabelKey: 'shared.boolean.yes', falseLabelKey: 'shared.boolean.no' }, t);
    expect(render({ value: true, data: undefined })).toBe('Evet');
    expect(render({ value: false, data: undefined })).toBe('Hayır');
  });
});

describe('createPercentRenderer', () => {
  it('yüzde formatlar', () => {
    const render = createPercentRenderer({ decimals: 1, showBar: false });
    const result = render({ value: 75.5, data: undefined });
    expect(result).toBe('%75.5');
  });

  it('bar ile render', () => {
    const render = createPercentRenderer({ showBar: true });
    const result = render({ value: 50, data: undefined });
    expect(result).toBeTruthy();
  });
});

describe('createEnumRenderer', () => {
  it('labelMap ile çevirir', () => {
    const render = createEnumRenderer({ A: 'Birinci', B: 'İkinci' }, false, t);
    expect(render({ value: 'A', data: undefined })).toBe('Birinci');
    expect(render({ value: 'B', data: undefined })).toBe('İkinci');
  });

  it('i18n key ile çevirir', () => {
    const render = createEnumRenderer({ ACTIVE: 'shared.status.active' }, true, t);
    expect(render({ value: 'ACTIVE', data: undefined })).toBe('Aktif');
  });
});
