import type { Meta, StoryObj } from '@storybook/react';
import React, { useEffect } from 'react';
import { VariantIntegration } from './VariantIntegration';

const meta: Meta<typeof VariantIntegration> = {
  component: VariantIntegration,
  title: 'Advanced/DataGrid/VariantIntegration',
  decorators: [(Story) => <div style={{ padding: '1rem', position: 'relative', minHeight: 500 }}><Story /></div>],
  argTypes: {
    gridId: { control: 'text', description: 'Grid kimlik no — variant izolasyonu' },
    gridSchemaVersion: { control: 'number', description: 'Şema sürümü — uyumsuz varyant tespiti' },
    canPromoteToGlobal: { control: 'boolean', description: 'Kişisel → Paylaşılan yükseltme yetkisi' },
    canDemoteToPersonal: { control: 'boolean', description: 'Paylaşılan → Kişisel indirme yetkisi' },
    canDeleteGlobal: { control: 'boolean', description: 'Paylaşılan varyant silme yetkisi' },
  },
};
export default meta;
type Story = StoryObj<typeof VariantIntegration>;

// ---------------------------------------------------------------------------
// Mock GridApi — grid olmadan variant panel'ini test etmek için
// ---------------------------------------------------------------------------
const createMockGridApi = () => ({
  getColumnState: () => [
    { colId: 'fullName', width: 200, hide: false, pinned: null, sort: 'asc', sortIndex: 0 },
    { colId: 'email', width: 250, hide: false, pinned: null, sort: null, sortIndex: null },
    { colId: 'department', width: 150, hide: false, pinned: null, sort: null, sortIndex: null },
    { colId: 'role', width: 120, hide: false, pinned: null, sort: null, sortIndex: null },
    { colId: 'status', width: 100, hide: false, pinned: null, sort: null, sortIndex: null },
    { colId: 'age', width: 80, hide: true, pinned: null, sort: null, sortIndex: null },
  ],
  getFilterModel: () => ({}),
  getAdvancedFilterModel: () => null,
  isPivotMode: () => false,
  getGridOption: () => '',
  applyColumnState: () => {},
  setFilterModel: () => {},
  setAdvancedFilterModel: () => {},
  setGridOption: () => {},
});

// ---------------------------------------------------------------------------
// Seed data — localStorage'a örnek varyantlar yaz
// ---------------------------------------------------------------------------
const SEED_GRID_ID = 'demo/showcase-full';
const LOCAL_STORAGE_KEY = 'grid-variants';
const LOCAL_PREF_KEY = 'grid-variants-preferences';

const seedVariants = [
  {
    id: 'seed-personal-default',
    gridId: SEED_GRID_ID,
    name: 'Varsayılan Görünüm',
    isDefault: true,
    isGlobal: false,
    isGlobalDefault: false,
    isUserDefault: true,
    isUserSelected: true,
    isCompatible: true,
    schemaVersion: 1,
    sortOrder: 0,
    createdAt: '2026-01-15T09:00:00Z',
    updatedAt: '2026-03-20T14:30:00Z',
    state: {
      columnState: [
        { colId: 'fullName', width: 200, hide: false, pinned: null, sort: 'asc', sortIndex: 0 },
        { colId: 'email', width: 250, hide: false, pinned: null, sort: null, sortIndex: null },
        { colId: 'department', width: 150, hide: false, pinned: null, sort: null, sortIndex: null },
        { colId: 'role', width: 120, hide: false, pinned: null, sort: null, sortIndex: null },
        { colId: 'status', width: 100, hide: false, pinned: null, sort: null, sortIndex: null },
      ],
      filterModel: {},
      sortModel: [{ colId: 'fullName', sort: 'asc' }],
    },
  },
  {
    id: 'seed-personal-compact',
    gridId: SEED_GRID_ID,
    name: 'Kompakt Tablo',
    isDefault: false,
    isGlobal: false,
    isGlobalDefault: false,
    isUserDefault: false,
    isUserSelected: false,
    isCompatible: true,
    schemaVersion: 1,
    sortOrder: 1,
    createdAt: '2026-02-10T11:00:00Z',
    updatedAt: '2026-03-18T16:00:00Z',
    state: {
      columnState: [
        { colId: 'fullName', width: 160, hide: false, pinned: 'left', sort: null, sortIndex: null },
        { colId: 'department', width: 120, hide: false, pinned: null, sort: 'asc', sortIndex: 0 },
        { colId: 'status', width: 80, hide: false, pinned: null, sort: null, sortIndex: null },
      ],
      filterModel: { status: { type: 'equals', filter: 'ACTIVE' } },
      sortModel: [{ colId: 'department', sort: 'asc' }],
    },
  },
  {
    id: 'seed-personal-detailed',
    gridId: SEED_GRID_ID,
    name: 'Detaylı Analiz',
    isDefault: false,
    isGlobal: false,
    isGlobalDefault: false,
    isUserDefault: false,
    isUserSelected: false,
    isCompatible: true,
    schemaVersion: 1,
    sortOrder: 2,
    createdAt: '2026-03-01T08:00:00Z',
    updatedAt: '2026-03-22T10:00:00Z',
    state: {
      columnState: [
        { colId: 'fullName', width: 180, hide: false, pinned: null, sort: null, sortIndex: null },
        { colId: 'email', width: 220, hide: false, pinned: null, sort: null, sortIndex: null },
        { colId: 'department', width: 140, hide: false, pinned: null, sort: null, sortIndex: null },
        { colId: 'role', width: 130, hide: false, pinned: null, sort: null, sortIndex: null },
        { colId: 'status', width: 100, hide: false, pinned: null, sort: null, sortIndex: null },
        { colId: 'age', width: 80, hide: false, pinned: null, sort: 'desc', sortIndex: 0 },
      ],
      filterModel: {},
      sortModel: [{ colId: 'age', sort: 'desc' }],
    },
  },
  {
    id: 'seed-global-standard',
    gridId: SEED_GRID_ID,
    name: 'Şirket Standardı',
    isDefault: false,
    isGlobal: true,
    isGlobalDefault: true,
    isUserDefault: false,
    isUserSelected: false,
    isCompatible: true,
    schemaVersion: 1,
    sortOrder: 0,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-03-15T12:00:00Z',
    state: {
      columnState: [
        { colId: 'fullName', width: 200, hide: false, pinned: null, sort: 'asc', sortIndex: 0 },
        { colId: 'department', width: 160, hide: false, pinned: null, sort: null, sortIndex: null },
        { colId: 'role', width: 130, hide: false, pinned: null, sort: null, sortIndex: null },
        { colId: 'status', width: 100, hide: false, pinned: null, sort: null, sortIndex: null },
      ],
      filterModel: {},
      sortModel: [{ colId: 'fullName', sort: 'asc' }],
    },
  },
  {
    id: 'seed-global-hr',
    gridId: SEED_GRID_ID,
    name: 'İK Görünümü',
    isDefault: false,
    isGlobal: true,
    isGlobalDefault: false,
    isUserDefault: false,
    isUserSelected: false,
    isCompatible: true,
    schemaVersion: 1,
    sortOrder: 1,
    createdAt: '2026-02-01T00:00:00Z',
    updatedAt: '2026-03-10T09:00:00Z',
    state: {
      columnState: [
        { colId: 'fullName', width: 200, hide: false, pinned: 'left', sort: null, sortIndex: null },
        { colId: 'department', width: 150, hide: false, pinned: null, sort: 'asc', sortIndex: 0 },
        { colId: 'role', width: 120, hide: false, pinned: null, sort: null, sortIndex: null },
        { colId: 'age', width: 80, hide: false, pinned: null, sort: null, sortIndex: null },
        { colId: 'status', width: 100, hide: false, pinned: null, sort: null, sortIndex: null },
      ],
      filterModel: {},
      sortModel: [{ colId: 'department', sort: 'asc' }],
    },
  },
];

/** localStorage'a seed varyantları yazar */
function useSeedVariants(gridId: string) {
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : {};
      // Sadece bu gridId için seed yaz (mevcut veriyi korumak için kontrol)
      if (!parsed[gridId] || parsed[gridId].length === 0) {
        parsed[gridId] = seedVariants;
        window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(parsed));
      }
      // Preference: varsayılan seçili
      const prefRaw = window.localStorage.getItem(LOCAL_PREF_KEY);
      const prefs = prefRaw ? JSON.parse(prefRaw) : {};
      if (!prefs[gridId]) {
        prefs[gridId] = {
          defaultVariantId: 'seed-personal-default',
          selectedVariantId: 'seed-personal-default',
        };
        window.localStorage.setItem(LOCAL_PREF_KEY, JSON.stringify(prefs));
      }
    } catch { /* silent */ }
  }, [gridId]);
}

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

/**
 * Tam özellikli showcase — 3 kişisel + 2 paylaşılan hazır varyant ile.
 *
 * Test edilebilir işlevler:
 * - ⚙ tıkla → panel açılır
 * - Kişisel: Varsayılan Görünüm ★, Kompakt Tablo, Detaylı Analiz
 * - Paylaşılan: Şirket Standardı ★, İK Görünümü
 * - "Oluştur" → yeni kişisel varyant eklenir
 * - Variant seç → dropdown güncellenir
 * - Sil → listeden kalkar
 * - Ad değiştir → inline düzenleme
 * - Varsayılan yap/kaldır → ★ ikonu toggle
 */
export const Default: Story = {
  render: () => {
    useSeedVariants(SEED_GRID_ID);
    return (
      <div>
        <p className="mb-4 text-sm text-text-secondary">
          ⚙ ikonuna tıklayarak Varyant Yönetimi panelini açın.
          3 kişisel + 2 paylaşılan hazır varyant yüklüdür.
        </p>
        <VariantIntegration
          gridId={SEED_GRID_ID}
          gridSchemaVersion={1}
          gridApi={createMockGridApi() as any}
          canPromoteToGlobal
          canDemoteToPersonal
          canDeleteGlobal
        />
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    // Panel otomatik açılsın
    await new Promise((r) => setTimeout(r, 500));
    const btn = canvasElement.querySelector('button[aria-label]');
    if (btn) (btn as HTMLElement).click();
  },
};

/**
 * Admin yetkili — promote/demote/delete global butonları görünür.
 */
export const AdminFullAccess: Story = {
  render: () => {
    useSeedVariants('demo/admin-full');
    return (
      <div>
        <p className="mb-4 text-sm text-text-secondary">
          Admin görünümü — Kişisel → Paylaşılan yükseltme,
          Paylaşılan → Kişisel indirme ve paylaşılan silme yetkileri aktif.
        </p>
        <VariantIntegration
          gridId="demo/admin-full"
          gridSchemaVersion={1}
          gridApi={createMockGridApi() as any}
          canPromoteToGlobal
          canDemoteToPersonal
          canDeleteGlobal
        />
      </div>
    );
  },
};

/**
 * Salt okunur — varyant seçilebilir ama düzenlenemez.
 */
export const ReadOnly: Story = {
  render: () => {
    useSeedVariants('demo/readonly');
    return (
      <div>
        <p className="mb-4 text-sm text-text-secondary">
          Salt okunur mod — varyant seçilebilir ama oluşturma/silme/düzenleme yapılamaz.
        </p>
        <VariantIntegration
          gridId="demo/readonly"
          gridSchemaVersion={1}
          gridApi={createMockGridApi() as any}
          access="readonly"
        />
      </div>
    );
  },
};

/**
 * Devre dışı — tüm kontroller pasif.
 */
export const Disabled: Story = {
  render: () => (
    <div>
      <p className="mb-4 text-sm text-text-secondary">
        Devre dışı mod — kullanıcının variant yönetim yetkisi yok.
      </p>
      <VariantIntegration
        gridId="demo/disabled"
        gridSchemaVersion={1}
        gridApi={createMockGridApi() as any}
        access="disabled"
      />
    </div>
  ),
};

/**
 * Özel Türkçe mesajlar — i18n override.
 */
export const CustomMessages: Story = {
  render: () => {
    useSeedVariants('demo/i18n');
    return (
      <div>
        <p className="mb-4 text-sm text-text-secondary">
          Özelleştirilmiş Türkçe mesajlar ile.
        </p>
        <VariantIntegration
          gridId="demo/i18n"
          gridSchemaVersion={1}
          gridApi={createMockGridApi() as any}
          messages={{
            variantLabel: 'Görünüm',
            variantPlaceholder: '— Görünüm seçin —',
            variantNewButtonLabel: 'Yeni Görünüm',
            variantNamePlaceholder: 'Görünüm adı girin...',
            variantModalTitle: 'Görünüm Yönetimi',
            defaultVariantName: 'Varsayılan Görünüm',
            personalVariantsTitle: 'Kişisel Görünümlerim',
            globalVariantsTitle: 'Şirket Görünümleri',
            personalVariantsEmptyLabel: 'Henüz kişisel görünüm oluşturmadınız',
            globalVariantsEmptyLabel: 'Paylaşılan görünüm bulunmuyor',
            saveCurrentStateLabel: 'Mevcut Durumu Kaydet',
            deleteVariantConfirmationLabel: 'Bu görünümü silmek istediğinize emin misiniz?',
          }}
        />
      </div>
    );
  },
};

/**
 * Toolbar içinde kompakt — dar alan kullanımı.
 */
export const CompactInToolbar: Story = {
  render: () => {
    useSeedVariants('demo/compact');
    return (
      <div>
        <p className="mb-4 text-sm text-text-secondary">
          Toolbar içinde kompakt kullanım — grid toolbar'daki gibi.
        </p>
        <div className="flex items-center gap-2 rounded-lg border border-border-default bg-surface-default p-2">
          <input className="h-8 w-48 rounded border border-border-subtle px-2 text-sm" placeholder="Tüm sütunlarda ara..." />
          <select className="h-8 rounded border border-border-subtle px-2 text-sm">
            <option>Quartz</option>
            <option>Balham</option>
          </select>
          <button className="h-8 rounded bg-action-primary px-3 text-xs font-medium text-text-inverse">Comfortable</button>
          <button className="h-8 rounded border border-border-subtle px-3 text-xs font-medium text-text-secondary">Compact</button>
          <span className="text-border-subtle">|</span>
          <VariantIntegration
            gridId="demo/compact"
            gridSchemaVersion={1}
            gridApi={createMockGridApi() as any}
            canPromoteToGlobal
          />
        </div>
      </div>
    );
  },
};
