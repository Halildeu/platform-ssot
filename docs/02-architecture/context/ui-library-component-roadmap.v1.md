# UI Library Component Roadmap

## Family Matrix
- `foundation_primitives`: completed
- `navigation`: completed
- `forms`: completed
- `data_display`: completed
- `page_blocks`: planned
- `overlay`: in_progress
- `ai_native_helpers`: planned

## Wave Status
- `wave_1_foundation_primitives`: completed
- `wave_2_navigation`: completed
- `wave_3_forms`: completed
- `wave_4_data_display`: completed
- `wave_5_overlay`: in_progress
- `wave_6_ai_native_helpers`: planned
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
- Overlay dalgasinin batch-1 focus seti: `Modal`, `Dropdown`, `Tooltip`.
