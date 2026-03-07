# UI Library Wave 4: Data Display

- Wave: `wave_4_data_display`
- Family: `data_display`
- Durum: `completed`
- Tamamlanan batch'ler: `TableSimple`, `Descriptions`, `AgGridServer`, `EntityGridTemplate`, `List`, `JsonViewer`, `Tree`, `TreeTable`

## Amac

Hafif tablo, liste ve JSON veri gosterim primitive'lerini token-first, access-aware ve live preview destekli hale getirmek.

## Batch'ler

1. `batch_1_light_tables` → `TableSimple`, `Descriptions` (completed)
2. `batch_2_grid_upgrade` → `AgGridServer`, `EntityGridTemplate` (completed)
3. `batch_3_structured_views` → `List`, `JsonViewer`, `Tree`, `TreeTable` (completed)

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
- `Tree` ve `TreeTable` beta export + live preview + API catalog + doctor evidence seviyesine cekildi.
- `wave_4_data_display` bu kapanisla birlikte tamamladi.
