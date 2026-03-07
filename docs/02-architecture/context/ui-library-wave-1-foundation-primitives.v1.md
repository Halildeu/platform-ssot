# UI Library Wave 1: Foundation Primitives v1

Kanonik kaynak:
`docs/02-architecture/context/ui-library-wave-1-foundation-primitives.v1.json`

## Amac

`wave_1_foundation_primitives` icin foundation export setini zorunlu `doctor:frontend` kaniti ve wave gate altinda release-hardening modunda yeniden kilitlemek.

Bu dalgada kod ancak su dort sey netlestikten sonra baslar:

1. component bazli acceptance
2. UX primary theme/subtheme eslesmesi
3. preview senaryolari
4. gate/check/evidence listesi

## Batch sirasi

### Batch 1
- `Button`
- `Text`
- amac: mevcut stable primitive'leri governance standardina hizalamak

### Batch 2
- `LinkInline`
- `IconButton`
- amac: interactive primitive setini exported gercegiyle hizalayip release kanitini kapatmak

### Batch 3
- `Skeleton`
- `Spinner`
- amac: loading/feedback primitive'lerini token-first hale getirmek

### Batch 4
- `Avatar`
- `Divider`
- amac: identity ve separation primitive'lerini tamamlamak

## Component listesi

### Existing upgrade
- `Button` -> stable
- `Text` -> stable

### Exported release-hardening
- `LinkInline` -> beta
- `IconButton` -> beta
- `Skeleton` -> beta
- `Spinner` -> beta
- `Avatar` -> beta
- `Divider` -> beta

## Wave exit criteria

- Tum 8 component icin acceptance + preview + evidence tanimi olusur.
- `Button` ve `Text` stable seviyede kalir.
- Diger 6 component en az beta cikis kriterine ulasir.
- Registry/preview/UX alignment drift = 0 olur.
- Duplicate primitive ve raw visual bypass = 0 olur.
- `doctor:frontend -- --preset ui-library` PASS olur.
- `gate:ui-library-wave -- --wave wave_1_foundation_primitives` PASS olmadan wave kapanmaz.

## Zorunlu check listesi

- `python3 scripts/check_ui_library_wave_1_foundation_primitives.py`
- `python3 scripts/check_ui_library_component_roadmap.py`
- `python3 scripts/check_ui_library_governance_contract.py`
- `python3 scripts/check_ui_library_ux_alignment.py`
- `npm -C web run gate:ui-library-wave -- --wave wave_1_foundation_primitives`
- `npm -C web run designlab:index`
- `npm -C web run lint:tailwind`
- `npm -C web run lint:no-antd`
- `npm -C web run test:ui-kit`
- `npm -C web run doctor:frontend -- --preset ui-library`

## Son durum

- `in_progress`
- aktif batch: `Button`, `Text`, `LinkInline`, `IconButton`
- `LinkInline` ve `IconButton` artik roadmap-only degil, exported reality ile hizalanir.
- foundation wave bundan sonra doctor evidence olmadan tamamlanmis sayilmaz.
