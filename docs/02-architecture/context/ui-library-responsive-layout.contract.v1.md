# UI Library Responsive/Layout Contract v1

Kanonik kaynak:
`docs/02-architecture/context/ui-library-responsive-layout.contract.v1.json`

## Ana karar

- Breakpoint kaynagi: Tailwind varsayilan ekranlari
- Page shell owner’lari:
  - `PageLayout`
  - `PageHeader`
  - `SummaryStrip`
  - `FilterBar`

## Kurallar

- Responsive mantik apps/** icinde kopyalanmaz.
- Density/local spacing yerine theme axis ve shell API kullanilir.
- Dar genislik davranisi preview ile kanitlanir.
