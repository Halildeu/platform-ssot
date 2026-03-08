# UI Library Adoption / Enforcement Contract v1

Kanonik kaynak:
`docs/02-architecture/context/ui-library-adoption-enforcement.contract.v1.json`

## Ana hedef

Design system’in yalniz var olmasi degil, zorunlu olarak kullanilmasi.

## Mevcut enforcement

- `lint:tailwind`
- `lint:no-antd`
- `doctor:frontend`
- `gate:ui-library-wave`
- governance / UX / diagnostics check’leri

## Yasaklar

- apps/** icinde local primitive
- raw color/spacing/radius/typography
- registry’siz export
- evidence’siz common UI degisikligi
