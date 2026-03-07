# UI Library Wave 5 Overlay Summary

- Wave: `wave_5_overlay`
- Durum: `completed`
- Aile: `overlay`
- Doktor preset: `ui-library`
- Gate komutu: `npm -C web run gate:ui-library-wave -- --wave wave_5_overlay`

## Tamamlanan batch'ler
- `batch_1_overlay_primitives`: `Modal`, `Dropdown`, `Tooltip`
- `batch_2_drawer_and_popover`: `FormDrawer`, `DetailDrawer`, `Popover`

## Aktif odak seti
- `Modal`: confirm / destructive / audit dialog
- `Dropdown`: action / filter menu
- `Tooltip`: short hint / readonly guidance
- `FormDrawer`: create / edit / readonly side-panel form
- `DetailDrawer`: tabbed review / evidence / audit drawer
- `Popover`: rich guidance / readonly blocked popover

## Kalan backlog
- Bu dalga icin kalan aktif backlog yok.
- `ContextMenu` ve `TourCoachmarks` overlay ailesinin gelecek backlog'unda tutulur; `wave_5_overlay` kapsaminda degildir.

## Notlar
- Overlay batch'i doktor kaniti ve keyboard/dismiss davranisi ile fail-closed calisir.
- `Tooltip` ve `Popover` `beta` lifecycle ile izlenir; `Modal`, `Dropdown`, `FormDrawer`, `DetailDrawer` `stable` hedefindedir.
