# Orchestrator Adoption Bridge v1

Kanonik kaynak: `docs/02-architecture/context/orchestrator-adoption-bridge.v1.json`

Amaç:
- Taşeron repodaki backend/frontend platform tabanını orchestrator'a taşımak için
  kaynak envanteri ve core-lock uyumlu geçiş planını tanımlamak.

Kaynak altyapı:
- Backend runtime: gateway, discovery, auth, user, permission, variant, core-data, common-auth
- Frontend runtime: shell, MFE'ler, ui-kit, shared-http, shared-types, i18n
- Platform controls: diagnostics registry, frontend-doctor, playwright telemetry, gateway smoke, UX/governance kontratları

Mevcut durum:
- Managed repo tarafında platform tabanı hazır.
- Orchestrator core repo yazımı `CORE_UNLOCK` olmadan kapalı.
- Bu yüzden orchestrator tarafı için mevcut mod: `report_only_until_core_unlock`

Core unlock sonrası hedef işler:
- managed repo diagnostics registry'yi sync kapsamına almak
- frontend-doctor kanıtını multi-repo operating contract'a bağlamak
- portfolio/system status çıktısına diagnostics health özetini eklemek
