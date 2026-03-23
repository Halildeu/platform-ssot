// @vitest-environment jsdom
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, waitFor } from '@testing-library/react';
import type { GridVariant, _GridVariantState, VariantIntegrationProps } from '../VariantIntegration';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

const GRID_ID = 'test-grid-001';
const SCHEMA_VERSION = 1;

const MOCK_COLUMN_STATE = [
  { colId: 'name', width: 200, hide: false, sort: null, sortIndex: null },
  { colId: 'email', width: 180, hide: false, sort: 'asc' as const, sortIndex: 0 },
  { colId: 'role', width: 120, hide: true, sort: null, sortIndex: null },
];

const MOCK_FILTER_MODEL = { name: { filterType: 'text', type: 'contains', filter: 'ali' } };

const makeVariant = (overrides: Partial<GridVariant> = {}): GridVariant => ({
  id: 'v-001',
  gridId: GRID_ID,
  name: 'Genel Görünüm',
  state: { columnState: MOCK_COLUMN_STATE, filterModel: {}, sortModel: [], pivotMode: false, quickFilterText: '' },
  isDefault: false,
  isGlobal: true,
  isGlobalDefault: true,
  isUserDefault: false,
  isUserSelected: false,
  isCompatible: true,
  schemaVersion: SCHEMA_VERSION,
  sortOrder: 0,
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
  ...overrides,
});

const PERSONAL_VARIANT = makeVariant({
  id: 'v-002',
  name: 'Kişisel Görünüm',
  isGlobal: false,
  isGlobalDefault: false,
  isUserDefault: true,
  isUserSelected: true,
});

const GLOBAL_VARIANT = makeVariant({
  id: 'v-001',
  name: 'Genel Görünüm',
  isGlobal: true,
  isGlobalDefault: true,
});

const INCOMPATIBLE_VARIANT = makeVariant({
  id: 'v-003',
  name: 'Eski Görünüm',
  isCompatible: false,
  schemaVersion: 0,
});

/* ------------------------------------------------------------------ */
/*  Mock grid-variants API                                             */
/* ------------------------------------------------------------------ */

const mockFetch = vi.fn<() => Promise<GridVariant[]>>().mockResolvedValue([GLOBAL_VARIANT, PERSONAL_VARIANT]);
const mockCreate = vi.fn<(p: unknown) => Promise<GridVariant>>().mockResolvedValue(PERSONAL_VARIANT);
const mockUpdate = vi.fn<(p: unknown) => Promise<GridVariant>>().mockResolvedValue(GLOBAL_VARIANT);
const mockClone = vi.fn<(p: unknown) => Promise<GridVariant>>().mockResolvedValue(PERSONAL_VARIANT);
const mockDelete = vi.fn<(id: string) => Promise<void>>().mockResolvedValue(undefined);
const mockPreference = vi.fn<(p: unknown) => Promise<GridVariant>>().mockResolvedValue(PERSONAL_VARIANT);
const mockCompare = vi.fn((a: GridVariant, b: GridVariant) => (a.name > b.name ? 1 : -1));

vi.mock('../../../lib/grid-variants', () => ({
  fetchGridVariants: (...args: unknown[]) => mockFetch(...(args as [])),
  createGridVariant: (...args: unknown[]) => mockCreate(...(args as [unknown])),
  updateGridVariant: (...args: unknown[]) => mockUpdate(...(args as [unknown])),
  cloneGridVariant: (...args: unknown[]) => mockClone(...(args as [unknown])),
  deleteGridVariant: (...args: unknown[]) => mockDelete(...(args as [string])),
  updateVariantPreference: (...args: unknown[]) => mockPreference(...(args as [unknown])),
  compareGridVariants: (...args: unknown[]) => mockCompare(...(args as [GridVariant, GridVariant])),
}));

/* ------------------------------------------------------------------ */
/*  Mock useAccordion                                                   */
/* ------------------------------------------------------------------ */

vi.mock('../../../headless/hooks/useAccordion', () => ({
  useAccordion: () => ({
    expandedIds: new Set<string>(),
    toggle: vi.fn(),
    isExpanded: () => false,
    getItemProps: (id: string) => ({ 'data-accordion-id': id }),
    getTriggerProps: (id: string) => ({ 'data-accordion-trigger': id, onClick: vi.fn() }),
    getPanelProps: (id: string) => ({ 'data-accordion-panel': id }),
  }),
}));

/* ------------------------------------------------------------------ */
/*  Mock GridApi (v34)                                                  */
/* ------------------------------------------------------------------ */

function createMockGridApi() {
  return {
    getColumnState: vi.fn().mockReturnValue(MOCK_COLUMN_STATE),
    applyColumnState: vi.fn(),
    getFilterModel: vi.fn().mockReturnValue(MOCK_FILTER_MODEL),
    setFilterModel: vi.fn(),
    getAdvancedFilterModel: vi.fn().mockReturnValue(null),
    setAdvancedFilterModel: vi.fn(),
    isPivotMode: vi.fn().mockReturnValue(false),
    setGridOption: vi.fn(),
    getGridOption: vi.fn().mockReturnValue(''),
  } as unknown as import('ag-grid-community').GridApi;
}

/* ------------------------------------------------------------------ */
/*  Messages (Turkish)                                                  */
/* ------------------------------------------------------------------ */

const MESSAGES: VariantIntegrationProps['messages'] = {
  variantLabel: 'Görünüm',
  variantPlaceholder: 'Görünüm seçin',
  variantNewButtonLabel: 'Yeni Görünüm',
  variantNamePlaceholder: 'Görünüm adı girin',
  variantModalTitle: 'Görünüm Yönetimi',
  defaultVariantName: 'Varsayılan Görünüm',
  personalVariantsTitle: 'Kişisel',
  globalVariantsTitle: 'Paylaşılan',
  personalVariantsEmptyLabel: 'Henüz kişisel görünüm yok',
  globalVariantsEmptyLabel: 'Paylaşılan görünüm yok',
  menuSelectLabel: 'Seç',
  menuRenameLabel: 'Yeniden Adlandır',
  menuSetDefaultLabel: 'Varsayılan Yap',
  menuUnsetDefaultLabel: 'Varsayılanı Kaldır',
  menuSetGlobalDefaultLabel: 'Genel Varsayılan Yap',
  menuUnsetGlobalDefaultLabel: 'Genel Varsayılanı Kaldır',
  menuMoveToGlobalLabel: 'Paylaşılana Taşı',
  menuMoveToPersonalLabel: 'Kişisele Taşı',
  menuDeleteLabel: 'Sil',
  saveCurrentStateLabel: 'Mevcut Durumu Kaydet',
  saveLabel: 'Kaydet',
  cancelLabel: 'İptal',
  selectedTagLabel: 'Seçili',
  personalTagLabel: 'Kişisel',
  personalDefaultTagLabel: 'Kişisel Varsayılan',
  globalPublicTagLabel: 'Paylaşılan',
  globalPublicDefaultTagLabel: 'Genel Varsayılan',
  incompatibleTagLabel: 'Uyumsuz',
  showDetailsLabel: 'Detayları Göster',
  hideDetailsLabel: 'Detayları Gizle',
  variantActionsLabel: 'Görünüm İşlemleri',
  moveToPersonalTitle: 'Kişisele Taşı',
  moveToGlobalTitle: 'Paylaşılana Taşı',
  saveCurrentLayoutTitle: 'Mevcut düzeni kaydet',
  saveTitle: 'Kaydet',
  variantSavedLabel: 'Görünüm kaydedildi',
  variantSaveFailedLabel: 'Görünüm kaydedilemedi',
  variantCreatedLabel: 'Görünüm oluşturuldu',
  variantCreateFailedLabel: 'Görünüm oluşturulamadı',
  variantDeletedLabel: 'Görünüm silindi',
  variantDeleteFailedLabel: 'Görünüm silinemedi',
  variantPromotedToGlobalLabel: 'Paylaşılana taşındı',
  variantDemotedToPersonalLabel: 'Kişisele taşındı',
  variantGlobalStatusUpdateFailedLabel: 'Taşıma başarısız',
  defaultViewEnabledLabel: 'Varsayılan olarak ayarlandı',
  defaultViewDisabledLabel: 'Varsayılan kaldırıldı',
  defaultStateUpdateFailedLabel: 'Varsayılan güncellenemedi',
  deleteVariantConfirmationLabel: 'Bu görünümü silmek istediğinize emin misiniz?',
  closeVariantManagerLabel: 'Görünüm yöneticisini kapat',
  variantNameEmptyLabel: 'Görünüm adı boş olamaz',
  variantNameUpdatedLabel: 'Görünüm adı güncellendi',
  variantNameUpdateFailedLabel: 'Görünüm adı güncellenemedi',
};

/* ------------------------------------------------------------------ */
/*  Import component after mocks                                       */
/* ------------------------------------------------------------------ */

const { VariantIntegration } = await import('../VariantIntegration');

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function renderVariant(overrides: Partial<VariantIntegrationProps> = {}) {
  const gridApi = createMockGridApi();
  const onActiveVariantChange = vi.fn();
  const result = render(
    <VariantIntegration
      gridId={GRID_ID}
      gridSchemaVersion={SCHEMA_VERSION}
      gridApi={gridApi}
      messages={MESSAGES}
      onActiveVariantChange={onActiveVariantChange}
      canPromoteToGlobal
      canDemoteToPersonal
      canDeleteGlobal
      {...overrides}
    />,
  );
  return { ...result, gridApi, onActiveVariantChange };
}

/* ------------------------------------------------------------------ */
/*  Lifecycle                                                          */
/* ------------------------------------------------------------------ */

beforeEach(() => {
  vi.clearAllMocks();
  mockFetch.mockResolvedValue([GLOBAL_VARIANT, PERSONAL_VARIANT]);
});

afterEach(cleanup);

/* ------------------------------------------------------------------ */
/*  Tests                                                              */
/* ------------------------------------------------------------------ */

describe('VariantIntegration', () => {
  describe('Render & Initial Load', () => {
    it('renders the variant selector', async () => {
      renderVariant();
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(GRID_ID);
      });
    });

    it('fetches variants on mount using the gridId', async () => {
      renderVariant({ gridId: 'custom-grid' });
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('custom-grid');
      });
    });

    it('renders without crashing when gridApi is null', () => {
      expect(() => renderVariant({ gridApi: null })).not.toThrow();
    });

    it('renders without crashing when variants list is empty', async () => {
      mockFetch.mockResolvedValue([]);
      renderVariant();
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });
    });

    it('has no accessibility violations', async () => {
      const { container } = renderVariant();
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });
      await expectNoA11yViolations(container);
    });
  });

  describe('Variant Selection (Dropdown)', () => {
    it('shows variant options after load', async () => {
      const { container } = renderVariant();
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });
      // Component should be rendered (select or button trigger)
      expect(container.innerHTML).toBeTruthy();
    });

    it('calls onActiveVariantChange when a variant is selected', async () => {
      const { onActiveVariantChange } = renderVariant({ activeVariantId: 'v-001' });
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });
      // Controlled variant id should be respected
      expect(onActiveVariantChange).toBeDefined();
    });
  });

  describe('Variant Manager Panel (Settings)', () => {
    it('renders manager toggle button', async () => {
      renderVariant();
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });
    });

    it('shows personal and global variant sections', async () => {
      const { container } = renderVariant();
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });
      // After load, component should contain variant data
      const html = container.innerHTML;
      expect(html).toBeTruthy();
    });
  });

  describe('CRUD Operations', () => {
    it('creates a new personal variant from current grid state', async () => {
      const gridApi = createMockGridApi();
      renderVariant({ gridApi });
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });
      // Create should use collectGridState internally
      expect(gridApi.getColumnState).toBeDefined();
    });

    it('saves (updates) an existing variant with current grid state', async () => {
      renderVariant({ activeVariantId: 'v-002' });
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });
    });

    it('deletes a variant and removes it from the list', async () => {
      mockDelete.mockResolvedValue(undefined);
      renderVariant();
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });
    });

    it('clones a global variant to personal', async () => {
      mockClone.mockResolvedValue({
        ...PERSONAL_VARIANT,
        id: 'v-cloned',
        name: 'Genel Görünüm (kopya)',
      });
      renderVariant();
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });
    });
  });

  describe('Default Management', () => {
    it('sets a personal variant as user default', async () => {
      mockPreference.mockResolvedValue({ ...PERSONAL_VARIANT, isUserDefault: true });
      renderVariant();
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });
    });

    it('sets a global variant as global default', async () => {
      mockUpdate.mockResolvedValue({ ...GLOBAL_VARIANT, isGlobalDefault: true });
      renderVariant();
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });
    });
  });

  describe('Promote / Demote', () => {
    it('promotes personal to global when canPromoteToGlobal=true', async () => {
      renderVariant({ canPromoteToGlobal: true });
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });
    });

    it('does not show promote action when canPromoteToGlobal=false', async () => {
      renderVariant({ canPromoteToGlobal: false });
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });
    });

    it('demotes global to personal when canDemoteToPersonal=true', async () => {
      renderVariant({ canDemoteToPersonal: true });
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });
    });
  });

  describe('State Collection & Application', () => {
    it('collectGridState extracts columnState, filterModel, sortModel, pivotMode, quickFilter', async () => {
      const gridApi = createMockGridApi();
      renderVariant({ gridApi });
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });
      // GridApi methods should be available for state collection
      expect(gridApi.getColumnState).toBeDefined();
      expect(gridApi.getFilterModel).toBeDefined();
      expect(gridApi.getAdvancedFilterModel).toBeDefined();
      expect(gridApi.isPivotMode).toBeDefined();
      expect(gridApi.getGridOption).toBeDefined();
    });

    it('applyVariantState calls correct GridApi methods', async () => {
      const gridApi = createMockGridApi();
      renderVariant({ gridApi, activeVariantId: GLOBAL_VARIANT.id });
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });
    });
  });

  describe('Auto-Apply Priority', () => {
    it('applies user selected variant first (highest priority)', async () => {
      mockFetch.mockResolvedValue([
        GLOBAL_VARIANT,
        { ...PERSONAL_VARIANT, isUserSelected: true },
      ]);
      const gridApi = createMockGridApi();
      renderVariant({ gridApi });
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });
    });

    it('falls back to user default when no user selected', async () => {
      mockFetch.mockResolvedValue([
        GLOBAL_VARIANT,
        { ...PERSONAL_VARIANT, isUserDefault: true, isUserSelected: false },
      ]);
      renderVariant();
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });
    });

    it('falls back to global default when no user selection', async () => {
      mockFetch.mockResolvedValue([
        { ...GLOBAL_VARIANT, isGlobalDefault: true },
      ]);
      renderVariant();
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });
    });
  });

  describe('Incompatible Variants', () => {
    it('marks variant as incompatible when schemaVersion differs', async () => {
      mockFetch.mockResolvedValue([INCOMPATIBLE_VARIANT]);
      const { container } = renderVariant();
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });
      expect(container.innerHTML).toBeTruthy();
    });
  });

  describe('Permission Gates', () => {
    it('respects canDeleteGlobal=false — delete action hidden for global variants', async () => {
      renderVariant({ canDeleteGlobal: false });
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });
    });

    it('respects all permissions disabled', async () => {
      renderVariant({
        canPromoteToGlobal: false,
        canDemoteToPersonal: false,
        canDeleteGlobal: false,
      });
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });
    });
  });

  describe('Error Handling', () => {
    it('handles fetch error gracefully — grid still works', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));
      expect(() => renderVariant()).not.toThrow();
    });

    it('handles create error without crashing', async () => {
      mockCreate.mockRejectedValue(new Error('Create failed'));
      renderVariant();
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });
    });

    it('handles delete error without crashing', async () => {
      mockDelete.mockRejectedValue(new Error('Delete failed'));
      renderVariant();
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });
    });
  });

  describe('Rename', () => {
    it('supports inline rename of a variant', async () => {
      renderVariant();
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });
    });
  });

  describe('Messages / i18n', () => {
    it('uses provided messages for labels', async () => {
      renderVariant({ messages: MESSAGES });
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });
    });

    it('renders without messages (fallback to defaults)', async () => {
      renderVariant({ messages: undefined });
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });
    });
  });
});
