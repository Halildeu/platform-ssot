# UI Library Component Roadmap v1

Kanonik kaynak:
`docs/02-architecture/context/ui-library-component-roadmap.v1.json`

## Amaç

`ui_kutuphane_sistemi` için component family matrix, olgunluk hedefi, gate/check/evidence planı ve release wave sırasını tek yerde toplamak.

## Baseline

- Foundation lock commit: `0900750`
- Exported item: `46`
- Planned item: `24`
- Live demo item: `17`

## Kod başlamadan önce

Şu üçlü netleşmeden component geliştirmesi başlamaz:

1. component family seçimi
2. maturity hedefi
3. gate/check/evidence planı

## Family matrix özeti

### 1. Foundation Primitives

- Amaç: temel atom/primitive setini sabitlemek
- Mevcut: `Button`, `Badge`, `Tag`, `Text`, `Tooltip`, `Empty`
- Eksik/gap:
  - `LinkInline`
  - `IconButton`
  - `Avatar`
  - `Divider`
  - `Skeleton`
  - `Spinner`

### 2. Navigation

- Amaç: yön bulma ve bilgi kokusu kalıplarını standardize etmek
- Hedef:
  - `Tabs`
  - `Breadcrumb`
  - `Pagination`
  - `Steps`
  - `AnchorToc`

### 3. Forms

- Amaç: input, validation ve recovery davranışını standartlaştırmak
- Mevcut:
  - `Select`
- Hedef:
  - `TextInput`
  - `TextArea`
  - `Checkbox`
  - `Radio`
  - `Switch`
  - `Slider`
  - `DatePicker`
  - `TimePicker`
  - `Upload`

### 4. Data Display

- Amaç: görev odaklı veri görüntüleme ailesini tamamlamak
- Mevcut:
  - `AgGridServer`
  - `EntityGridTemplate`
- Hedef:
  - `TableSimple`
  - `List`
  - `Tree`
  - `TreeTable`
  - `Descriptions`
  - `JsonViewer`

### 5. Overlay

- Amaç: dialog/drawer/popover akışlarını güvenli ve izlenebilir hale getirmek
- Mevcut:
  - `Modal`
  - `FormDrawer`
  - `DetailDrawer`
- Hedef:
  - `Popover`
  - `ContextMenu`
  - `TourCoachmarks`

### 6. AI-Native Helpers

- Amaç: AI destekli karar ve onay deneyimi için ortak UI katmanı üretmek
- Hedef:
  - `CommandPalette`
  - `RecommendationCard`
  - `ConfidenceBadge`
  - `ApprovalCheckpoint`
  - `CitationPanel`
  - `AIActionAuditTimeline`
  - `PromptComposer`

## Maturity hedefi

- `planned`: backlog/registry var, export yok
- `beta`: export + preview + test + a11y smoke var
- `stable`: adoption + regression evidence + açık blocker yok

Hedef mix:

- foundation_primitives: `4 stable / 4 beta`
- navigation: `2 stable / 3 beta`
- forms: `5 stable / 4 beta`
- data_display: `2 stable / 6 beta`
- overlay: `3 stable / 3 beta`
- ai_native_helpers: `0 stable / 7 beta`

## Gate / Check / Evidence planı

Ortak kapılar:

- `python3 scripts/check_ui_library_governance_contract.py`
- `python3 scripts/check_ui_library_ux_alignment.py`
- `npm -C web run designlab:index`
- `npm -C web run lint:tailwind`
- `npm -C web run lint:no-antd`
- `npm -C web run test:ui-kit`

Minimum evidence:

- registry update
- Design Lab preview
- test summary
- UX primary theme/subtheme declaration
- interactive widget ise APG/a11y notu
- stable veya breaking ise release note

## Release waves

### Wave 0

- `completed`
- governance + UX alignment + registry + preview foundation locked

### Wave 1

- `completed`
- `Foundation Primitives`
- hedef:
  - `Button`
  - `Text`
  - `LinkInline`
  - `IconButton`
  - `Avatar`
  - `Divider`
  - `Skeleton`
  - `Spinner`

### Wave 2

- `Navigation`
- hedef:
  - `Tabs`
  - `Breadcrumb`
  - `Pagination`
  - `Steps`
  - `AnchorToc`

### Wave 3

- `Forms`
- hedef:
  - `TextInput`
  - `TextArea`
  - `Checkbox`
  - `Radio`
  - `Switch`
  - `Slider`
  - `DatePicker`
  - `TimePicker`
  - `Upload`

### Wave 4

- `Data Display`
- hedef:
  - `AgGridServer`
  - `EntityGridTemplate`
  - `TableSimple`
  - `List`
  - `Tree`
  - `TreeTable`
  - `Descriptions`
  - `JsonViewer`

### Wave 5

- `Overlay`
- hedef:
  - `Modal`
  - `FormDrawer`
  - `DetailDrawer`
  - `Popover`
  - `ContextMenu`
  - `TourCoachmarks`

### Wave 6

- `AI-Native Helpers`
- hedef:
  - `CommandPalette`
  - `RecommendationCard`
  - `ConfidenceBadge`
  - `ApprovalCheckpoint`
  - `CitationPanel`
  - `AIActionAuditTimeline`
  - `PromptComposer`
