# Column System — Roadmap

## Tamamlanan (2026-04-01)

- [x] 12 tipli ColumnMeta discriminated union (types.ts)
- [x] 11 preset renderer fabrikası (presets.tsx)
- [x] Otomatik AG Grid filter builder (filters.ts)
- [x] buildColDefs transformer (transformer.ts)
- [x] Auto detail drawer (detail-renderer.tsx)
- [x] Export rendered labels (export-helpers.ts)
- [x] Conditional formatting (conditional.tsx)
- [x] Responsive column hideBelow (transformer.ts)
- [x] Permission-based column visibility (transformer.ts)
- [x] 63 test (transformer, presets, filters, conditional)
- [x] 4 modül migration (users, access, audit, hr-demographic)
- [x] Dynamic report birleşimi (create-dynamic-module.tsx → getColumnMeta)
- [x] Reporting sidebar (4 kategori, search, chips, favorites, recents)
- [x] shared.* i18n namespace (common.ts)
- [x] Tooltip fix (fixed positioning)
- [x] admin/users i18n (Aktif, Yönetici)

## P0 — Hemen

- [ ] Column-system'i `@mfe/design-system`'e taşı
  - Tüm MFE'ler (admin/users dahil) aynı preset'leri kullanabilsin
  - `web/packages/design-system/src/grid/column-system/` hedef konum
- [ ] admin/users'ı skeleton'a taşı (UsersGrid.ui.tsx 880→50 satır)

## P1 — Bu Sprint

- [ ] shared.* i18n browser doğrulama (ACTIVE → Aktif)
- [ ] Periyodik kategori — backend schedule/tag sistemi
- [ ] Hub gallery + expanded sidebar responsive UX
- [ ] Grid localeText shared.grid.* key'lerden oku

## P2 — Sonraki Sprint

- [ ] Set filter label'ları Türkçe (filterParams.valueFormatter)
- [ ] "Reset Filters" → "Filtreleri sıfırla" (design-system locale)
- [ ] Mobile sidebar manual QA
- [ ] Dynamic report metadata → zengin ColumnMeta (backend)

## P3 — Roadmap

- [ ] Detail drawer custom extraFields override
- [ ] Column reorder persistence doğrulama
- [ ] DL sidebar tooltip → fixed positioning (shell sidebar gibi)

## Dosya Haritası

```
mfe-reporting/src/modules/column-system/
├── types.ts            — ColumnMeta discriminated union
├── presets.tsx          — Renderer fabrikaları
├── filters.ts          — AG Grid filter builder
├── transformer.ts      — buildColDefs(meta[], t, locale, perms?, vw?)
├── detail-renderer.tsx — buildDetailRenderer(columns, locale)
├── export-helpers.ts   — buildProcessCellCallback(columns, t, locale)
├── conditional.tsx     — withConditionalFormatting(renderer, rules)
├── index.ts            — Public API
└── __tests__/          — 63 test
```
