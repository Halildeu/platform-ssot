## Theme Registry & Theme Resolution API Sözleşmesi (v1)

Amaç: Tema registry (semantic key → editableBy/controlType/cssVars[]) sözleşmesini
ve kullanıcı için “resolved theme” çıktısını tanımlamak.

Notlar:
- Public sayfalarda `/api/v1/me/**` çağrısı yapılmamalıdır (auth yoksa 401).  
- UI’da hardcoded css var listesi yasaktır; multi-apply mapping `cssVars[]`
  üzerinden gelir.

-------------------------------------------------------------------------------
1) Theme Registry Listeleme — v1
-------------------------------------------------------------------------------

- Method: `GET`  
- Path: `/api/v1/theme-registry`

Response: `ThemeRegistryEntry[]`
```json
[
  {
    "id": "uuid",
    "key": "surface.default.bg",
    "label": "Surface default background",
    "groupName": "SURFACE",
    "controlType": "COLOR",
    "editableBy": "USER_ALLOWED",
    "cssVars": ["--surface-default-bg", "--app-shell-bg"],
    "description": "Kullanıcı tarafından değiştirilebilir yüzey arka plan rengi.",
    "defaultSource": "figma.tokens.json:semantic.surface.default.bg"
  }
]
```

Alanlar:
- `key`: semantic override anahtarı (DB + API + UI’de SSOT).  
- `editableBy`: `USER_ALLOWED | ADMIN_ONLY`  
- `controlType`: `COLOR | TEXT | NUMBER | ENUM` (domain enum)  
- `cssVars[]`: bu key değişince uygulanacak CSS var listesi (multi apply).

-------------------------------------------------------------------------------
2) Global Theme Listeleme — v1
-------------------------------------------------------------------------------

- Method: `GET`  
- Path: `/api/v1/themes`  
- Query:
  - `scope=global|user` (default: `global`)

Not:
- `scope=user` için auth zorunludur.  
- Global temalar admin tarafından yönetilir.

-------------------------------------------------------------------------------
3) Global Theme Registry Overrides Güncelleme — v1 (Admin)
-------------------------------------------------------------------------------

- Method: `PUT`  
- Path: `/api/v1/themes/global/{id}`  
- Auth: THEME_ADMIN (veya SYSTEM_CONFIGURE)

Body: `overrides` (semantic key → value)
```json
{
  "surface.default.bg": "#f7f8fa",
  "text.primary": "rgba(255, 0, 0, 1)"
}
```

Kural:
- Allowlist: yalnız registry’de tanımlı `key`’ler kabul edilir.  
- `editableBy=ADMIN_ONLY` alanlar user scope’ta reddedilir.

-------------------------------------------------------------------------------
4) Global Theme Meta Güncelleme — v1 (Admin)
-------------------------------------------------------------------------------

- Method: `PUT`  
- Path: `/api/v1/themes/global/{id}/meta`  
- Auth: THEME_ADMIN (veya SYSTEM_CONFIGURE)

Body (özet):
```json
{
  "appearance": "light",
  "surfaceTone": "ultra-1",
  "axes": {
    "accent": "violet",
    "density": "comfortable",
    "radius": "rounded",
    "elevation": "raised",
    "motion": "standard"
  },
  "activeFlag": true
}
```

-------------------------------------------------------------------------------
5) Global Theme Palette Güncelleme — v1 (Admin)
-------------------------------------------------------------------------------

- Method: `PUT`  
- Path: `/api/v1/themes/global/palette`  
- Auth: THEME_ADMIN (veya SYSTEM_CONFIGURE)

Body:
```json
{
  "themes": [
    { "id": "uuid", "activeFlag": true }
  ]
}
```

-------------------------------------------------------------------------------
6) Global Varsayılan Tema Seçimi — v1 (Admin)
-------------------------------------------------------------------------------

- Method: `PUT`  
- Path: `/api/v1/themes/global/default/{id}`  
- Auth: THEME_ADMIN (veya SYSTEM_CONFIGURE)

-------------------------------------------------------------------------------
7) Kullanıcı Resolved Theme — v1
-------------------------------------------------------------------------------

- Method: `GET`  
- Path: `/api/v1/me/theme/resolved`  
- Auth: required
- Cache:
  - Response `ETag` dönebilir (`If-None-Match` → `304 Not Modified`).

Response: `ResolvedTheme`
```json
{
  "themeId": "uuid",
  "type": "GLOBAL|USER",
  "version": "string",
  "appearance": "light|dark",
  "surfaceTone": "ultra-1",
  "updatedAt": "2025-12-15T10:00:00Z",
  "axes": {
    "accent": "violet",
    "density": "comfortable",
    "radius": "rounded",
    "elevation": "raised",
    "motion": "standard"
  },
  "tokens": {
    "surface.default.bg": "#f7f8fa",
    "text.primary": "#111827"
  }
}
```

Kural:
- Public route’larda `/me` çağrısı yapılmaz; auth hazır olunca 1 kez fetch edilir.  
- `tokens` map’i UI için uygulanacak “resolved” semantic değerlerdir.

-------------------------------------------------------------------------------
8) Kullanıcı Tema Seçimi — v1
-------------------------------------------------------------------------------

- Method: `PATCH`  
- Path: `/api/v1/me/theme`  
- Auth: required

Body:
```json
{ "themeId": "uuid" }
```

-------------------------------------------------------------------------------
9) Bağlantılar
-------------------------------------------------------------------------------

- Story: docs/03-delivery/STORIES/STORY-0044-theme-ssot-single-chain-v1.md  
- ADR: docs/02-architecture/services/theme-system/ADR/ADR-0002-theme-contract-v0-1.md  
- STYLE-API-001: docs/00-handbook/STYLE-API-001.md

-------------------------------------------------------------------------------
10) Security
-------------------------------------------------------------------------------

- `GET /api/v1/theme-registry`:
  - Auth optional. Public route kullanımında anonim erişim mümkün olmalıdır.
- `GET /api/v1/themes?scope=global`:
  - Auth optional, read-only.
- `GET /api/v1/themes?scope=user` ve `/api/v1/me/theme/**`:
  - Auth required (`401` yetkisiz).
- `PUT /api/v1/themes/global/**`:
  - Role required: `THEME_ADMIN` veya `SYSTEM_CONFIGURE` (`403` yetkisiz rol).
- Token/credential asla response içine yazılmaz; audit trace id response header ile taşınır.

-------------------------------------------------------------------------------
11) Hata Modeli (ErrorResponse)
-------------------------------------------------------------------------------

Tüm endpointler aşağıdaki ErrorResponse sözleşmesiyle döner:

```json
{
  "timestamp": "2026-03-05T17:00:00Z",
  "status": 400,
  "error": "Bad Request",
  "code": "THEME_REGISTRY_VALIDATION",
  "message": "Unknown semantic key: surface.unknown",
  "path": "/api/v1/themes/global/123"
}
```

Hata kodları:
- `400 THEME_REGISTRY_VALIDATION`: allowlist dışı semantic key, hatalı payload.
- `401 AUTH_REQUIRED`: `/api/v1/me/**` veya user-scope çağrılarında auth yok.
- `403 ROLE_REQUIRED`: admin endpointine yetkisiz rol ile erişim.
- `404 THEME_NOT_FOUND`: hedef tema bulunamadı.
- `409 THEME_VERSION_CONFLICT`: eşzamanlı güncelleme çakışması.
