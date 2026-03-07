# UI Library Wave 4: Data Display

- Wave: `wave_4_data_display`
- Family: `data_display`
- Durum: `in_progress`
- Acilan batch'ler: `TableSimple`, `Descriptions`, `AgGridServer`, `EntityGridTemplate`, `List`, `JsonViewer`

## Amac

Hafif tablo, liste ve JSON veri gosterim primitive'lerini token-first, access-aware ve live preview destekli hale getirmek.

## Batch'ler

1. `batch_1_light_tables` → `TableSimple`, `Descriptions` (completed)
2. `batch_2_grid_upgrade` → `AgGridServer`, `EntityGridTemplate` (completed)
3. `batch_3_structured_views` → `List`, `JsonViewer` (in progress), `Tree`, `TreeTable` (remaining)

## Gate

- `python3 scripts/check_ui_library_wave_4_data_display.py`
- `npm -C web run gate:ui-library-wave -- --wave wave_4_data_display`
- `doctor:frontend -- --preset ui-library`

## Batch 2 notu

- `AgGridServer` ve `EntityGridTemplate` artik ayni dalga kontratinda `exported + live + API catalog + doctor evidence`
  seviyesine cekildi.
- Bu batch, hafif tablo primitive'lerinden agir grid substrate'ine gecis adimidir.

## Batch 3 notu

- `List` ve `JsonViewer` artik `exported + live + API catalog + doctor evidence` seviyesine cekildi.
- `Tree` ve `TreeTable` data display dalgasinin kalan backlog'u olarak duruyor.
