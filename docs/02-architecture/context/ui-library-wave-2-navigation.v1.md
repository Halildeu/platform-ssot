# UI Library Wave 2: Navigation v1

Kanonik kaynak:
`docs/02-architecture/context/ui-library-wave-2-navigation.v1.json`

## Amac

`wave_2_navigation` icin navigation ailesinin component bazli uygulama kontratini kilitlemek.

Bu dalga tamamlandi; foundation release-hardening tamamlandiktan sonra navigation akisi kapatildi.

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
- durum: `completed`

### Batch 3
- `AnchorToc`
- amac: uzun sayfa ve policy/dokuman navigasyonunu tamamlamak
- durum: `completed`

## Component listesi

### Bu patch ile tamamlananlar
- `Tabs` -> stable
- `Breadcrumb` -> stable
- `Pagination` -> beta
- `Steps` -> beta
- `AnchorToc` -> beta

### Sonraki backlog
- Navigation ailesi icin acik backlog kalmadi

## Wave exit criteria

- `Tabs` ve `Breadcrumb` stable export + preview + test + UX alignment ile tamamlanir.
- `Pagination` ve `Steps` beta export + preview + API catalog + regression test ile tamamlanir.
- `AnchorToc` planned backlog kontratiyla korunur.
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

- `completed`
- `Tabs` ve `Breadcrumb` stable export olarak acik.
- `Pagination`, `Steps` ve `AnchorToc` beta export + live preview + API catalog ile aktif.
- Navigation ailesi wave-2 scope icinde butuncul olarak kapandi.
