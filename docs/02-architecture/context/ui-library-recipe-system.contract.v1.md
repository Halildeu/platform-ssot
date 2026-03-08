# UI Library Recipe System Contract v1

Kanonik kaynak:
`docs/02-architecture/context/ui-library-recipe-system.contract.v1.json`

## Amac

Component seviyesini asan ortak ekran kaliplarini reusable recipe olarak tanimlamak.

## Mevcut recipe aileleri

- `search_filter_listing`
- `detail_summary`
- `approval_review`
- `empty_error_loading`
- `ai_guided_authoring`

## Sonuc

Sayfalar UI davranisini yeniden yazmaz; veri ve config besleyerek ortak recipe tuketir.
