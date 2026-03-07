# UI Library Wave 2: Navigation v1

Kanonik kaynak:
`docs/02-architecture/context/ui-library-wave-2-navigation.v1.json`

## Amac

`wave_2_navigation` icin navigation ailesinin component bazli uygulama kontratini kilitlemek.

Bu dalga aktif degildir; foundation release-hardening bittikten sonra yeniden acilir.

Bu dalgada kod ancak su dort sey netlestikten sonra baslar:

1. component bazli acceptance
2. UX primary theme/subtheme eslesmesi
3. preview senaryolari
4. gate/check/evidence listesi

## Batch sirasi

### Batch 1
- `Tabs`
- `Breadcrumb`
- amac: yuksek kullanimli navigation primitives katmanini acmak
- durum: `completed`

### Batch 2
- `Pagination`
- `Steps`
- amac: flow navigation ve progress kaliplarini eklemek
- durum: `planned`

### Batch 3
- `AnchorToc`
- amac: uzun sayfa ve policy/dokuman navigasyonunu tamamlamak
- durum: `planned`

## Component listesi

### Bu patch ile tamamlananlar
- `Tabs` -> stable
- `Breadcrumb` -> stable

### Sonraki backlog
- `Pagination` -> beta hedefi
- `Steps` -> beta hedefi
- `AnchorToc` -> beta hedefi

## Wave exit criteria

- `Tabs` ve `Breadcrumb` stable export + preview + test + UX alignment ile tamamlanir.
- `Pagination`, `Steps` ve `AnchorToc` planned backlog kontratiyla korunur.
- Navigation family registry drift = `0` olur.
- Keyboard navigation ve current-page a11y evidence yazili olur.

## Zorunlu check listesi

- `python3 scripts/check_ui_library_wave_2_navigation.py`
- `python3 scripts/check_ui_library_component_roadmap.py`
- `python3 scripts/check_ui_library_governance_contract.py`
- `python3 scripts/check_ui_library_ux_alignment.py`
- `npm -C web run gate:ui-library-wave -- --wave wave_2_navigation`
- `npm -C web run designlab:index`
- `npm -C web run lint:tailwind`
- `npm -C web run lint:no-antd`
- `npm -C web run test:ui-kit`
- `npm -C web run doctor:frontend -- --preset ui-library`

## Son durum

- `planned`
- `Tabs` ve `Breadcrumb` export edildi.
- `PageLayout` breadcrumb rendering yeni primitive'e tasindi.
- `Pagination`, `Steps` ve `AnchorToc` backlog kontratinda planned durumda tutuluyor.
- navigation sonraki aktif dalga; mevcut aktif release-hardening odağı foundation primitives.
