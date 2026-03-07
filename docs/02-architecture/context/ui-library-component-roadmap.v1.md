# UI Library Component Roadmap

## Family Matrix
- `foundation_primitives`: completed
- `navigation`: completed
- `forms`: completed
- `data_display`: completed
- `page_blocks`: planned
- `overlay`: completed
- `ai_native_helpers`: in_progress

## Wave Status
- `wave_1_foundation_primitives`: completed
- `wave_2_navigation`: completed
- `wave_3_forms`: completed
- `wave_4_data_display`: completed
- `wave_5_overlay`: completed
- `wave_6_ai_native_helpers`: in_progress
- `wave_7_page_blocks`: planned

## Data display mevcut batch
- `TableSimple`
- `Descriptions`
- `AgGridServer`
- `EntityGridTemplate`
- `List`
- `JsonViewer`
- `Tree`
- `TreeTable`

## Page/block library hedefi
- Mevcut reusable shell'ler: `PageLayout`, `FilterBar`, `ReportFilterPanel`
- Urunlesecek yeni block'lar: `PageHeader`, `SummaryStrip`, `EntitySummaryBlock`, `SectionShell`, `ActionHeader`
- Hariç tutulan aileler: `FormDrawer`, `DetailDrawer`, `AgGridServer`, `EntityGridTemplate`

## Release / dagitim notu
- `mfe-ui-kit` versiyonlama ve dagitim kurali ayri package release contract ile yonetilir.
- Stable veya breaking davranis degisikligi:
  - release notes
  - wave gate PASS
  - doctor evidence
  olmadan tamam sayilmaz.

## Son not
- Data display dalgasinda ilk hafif tablo batch'i export + API + preview + doctor evidence ile acildi.
- `AgGridServer` ve `EntityGridTemplate` batch-2 ile ayni kontrata alindi; doktor kaniti ve wave gate PASS uretildi.
- `List`, `JsonViewer`, `Tree` ve `TreeTable` batch-3 ile beta export + live preview + API catalog seviyesine cekildi.
- Overlay dalgasinda `Modal`, `Dropdown`, `Tooltip`, `FormDrawer`, `DetailDrawer` ve `Popover` ayni kontrata alindi.
- `wave_5_overlay` dalgasi `Modal`, `Dropdown`, `Tooltip`, `FormDrawer`, `DetailDrawer` ve `Popover` ile kapandi.
- `ContextMenu` ve `TourCoachmarks` overlay ailesinin gelecek backlog'u olarak ayrildi; aktif dalga kapsamina dahil degil.
- AI helper dalgasinda `CommandPalette`, `RecommendationCard` ve `ConfidenceBadge` export + live preview + doctor evidence ile acildi.
