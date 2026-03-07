# UI Library Wave 4: Data Display

- Wave: `wave_4_data_display`
- Family: `data_display`
- Durum: `in_progress`
- Ilk batch: `TableSimple`, `Descriptions`

## Amac

Hafif tablo ve key-value veri gosterim primitive'lerini token-first, access-aware ve live preview destekli hale getirmek.

## Batch'ler

1. `batch_1_light_tables` → `TableSimple`, `Descriptions` (completed)
2. `batch_2_grid_upgrade` → `AgGridServer`, `EntityGridTemplate` (planned)
3. `batch_3_structured_views` → `List`, `Tree`, `TreeTable`, `JsonViewer` (planned)

## Gate

- `python3 scripts/check_ui_library_wave_4_data_display.py`
- `npm -C web run gate:ui-library-wave -- --wave wave_4_data_display`
- `doctor:frontend -- --preset ui-library`
