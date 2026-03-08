# UI Library Iconography Contract v1

Kanonik kaynak:
`docs/02-architecture/context/ui-library-iconography.contract.v1.json`

## Ana karar

- Runtime icon set: `lucide-react`
- Runtime yasak setler:
  - `@mui/icons-material`
  - `@ant-design/icons`

## Kurallar

- Decorative icon gizlenir.
- Informative icon label veya metinle gelir.
- Emoji/text glyph canonical icon yerine gecmez.

## Teknik borc

- `EntityGridTemplate` tarafinda legacy glyph izi izleniyor.
