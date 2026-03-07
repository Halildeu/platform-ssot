# UI Library Page/Block Library Contract v1

Amaç: Hazır page ve block kütüphanesini mevcut layout/composite substrate üzerinden ürünleştirmek.

## Kapsam
- Mevcut exported bloklar: `PageLayout`, `FilterBar`, `ReportFilterPanel`, `PageHeader`, `SummaryStrip`, `EntitySummaryBlock`
- Planlı bloklar: `SectionShell`, `ActionHeader`
- Hariç tutulan aileler: `FormDrawer`, `DetailDrawer`, `AgGridServer`, `EntityGridTemplate`

## Temel Kurallar
- `apps/**` altında page/block kopyası üretilmez.
- Sayfa bileşenleri veri ve callback besler; davranış `ui-kit` içinde kalır.
- Yeni block önce kontrata, sonra registry/API catalog/preview zincirine girer.

## Wave
- Wave: `wave_7_page_blocks`
- Durum: `completed`

## Kanıt
- `python3 scripts/check_ui_library_page_block_contract.py`
- `python3 scripts/check_ui_library_wave_7_page_blocks.py`
- `npm -C web run doctor:frontend -- --preset ui-library`
- `npm -C web run test:ui-kit`
- `npm -C web run gate:ui-library-wave -- --wave wave_7_page_blocks`
