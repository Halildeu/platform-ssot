# UI Library Wave 5 Overlay Summary

- Wave: `wave_5_overlay`
- Durum: `in_progress`
- Aile: `overlay`
- Doktor preset: `ui-library`
- Gate komutu: `npm -C web run gate:ui-library-wave -- --wave wave_5_overlay`

## Tamamlanan batch
- `batch_1_overlay_primitives`: `Modal`, `Dropdown`, `Tooltip`

## Sonraki batch
- `batch_2_drawer_and_popover`: `FormDrawer`, `DetailDrawer`, `Popover`

## Bu batch odagi
- `Modal`: confirm / destructive / audit dialog
- `Dropdown`: action / filter menu
- `Tooltip`: short hint / readonly guidance

## Notlar
- Overlay batch'i doktor kaniti ve keyboard/dismiss davranisi ile fail-closed calisir.
- `Tooltip` ilk asamada `beta` lifecycle ile izlenir; diger iki primitive `stable` hedefindedir.
