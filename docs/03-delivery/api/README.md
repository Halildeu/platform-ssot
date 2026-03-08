# API Sözleşmeleri (Yeni Sistem)

Bu klasör, backend servisleri için API sözleşmelerini ve entegrasyon
rehberlerini `STYLE-API-001` ve NUMARALANDIRMA standardına uygun şekilde tutar.

## 1. Amaç

- Kullanıcı, auth, permission ve audit API'larının tek ve güncel kaynağını
  sağlamak.
- FE, BE ve 3rd‑party entegrasyonların aynı sözleşmeye bakmasını sağlamak.

## 2. Stil ve Kurallar

- Genel stil: `docs/00-handbook/STYLE-API-001.md`
- İsimlendirme:
  - `users.api.md`
  - `auth.api.md`
  - `permission.api.md`
  - `audit-events.api.md`
  - `common-headers.md`
- Versiyonlama: Tüm yeni endpoint'ler `/api/v1/**` path'i altında tanımlanır;
  legacy uçlar "Legacy" bölümünde belirtilir.

## 3. Mevcut Dokümanlar

- `users.api.md` — kullanıcı listeleme/detay, SSRM uyumlu filtre/sort/paging.
- `auth.api.md` — login, kayıt, şifre işlemleri, JWT claim'leri.
- `permission.api.md` — rol/izin atama ve listeleme uçları.
- `access-permission-bulk-assign.api.md` — permission bulk-assign/bulk-revoke v2 sözleşmesi.
- `audit-events.api.md` — audit event listeleme, export ve SSE.
- `common-headers.md` — ortak header ve güvenlik scope'ları.
- `notification-preferences.api.md` — kullanıcı bildirim tercihleri uçları.
 - `notification-digest.api.md` — kullanıcı notification digest e‑mail uçları.

## 4. OpenAPI ve İstemci Örnekleri

- OpenAPI tanımları: `docs/03-delivery/api/openapi/*.yaml`
  - `users.yaml` → kullanıcı servis uçları
  - `permission.yaml` → permission servis uçları
- Örnek istemci koleksiyonları:
  - `docs-ssot/03-delivery/api/client-examples/Users-Permissions-API.postman_collection.json`
  - `docs/03-delivery/api/client-examples/insomnia-export.yaml`

Detaylı kabul kriterleri için:
- `docs/03-delivery/ACCEPTANCE/AC-0004-api-openapi-refactor.md`
