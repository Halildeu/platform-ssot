# GUIDE-0015: Release Notes & Checklist’ler

- Yeni bir sürüm planlarken `docs/99-templates/TEST-PLAN.template.md` veya örnek olarak `docs/03-delivery/TEST-PLANS/TP-0001-release-template.md` dokümanını kopyalayın.
- Release tamamlandığında change-log ve müşteri duyurularını burada arşivleyin.
- Eski sürümlerin runbook referansları veya rollback notlarını ilgili dokümanlara linkleyin.

-------------------------------------------------------------------------------
1. RELEASE SMOKE TEST ADIMLARI
-------------------------------------------------------------------------------

Release sonrası temel HTTP smoke testleri için:

- Script: `scripts/release_smoke_check.py`
- Kullanım:
  - Tüm servisler için:
    - `python3 scripts/release_smoke_check.py`
  - Belirli bir servis için (örn. user-service):
    - `python3 scripts/release_smoke_check.py user-service`

Script, `SERVIS_KONFIG` içindeki servisler için:
- Health endpoint'lerini (örn. `/actuator/health`) ve
- Önemli API uçlarını (örn. `/api/v1/users`, `/api/v1/auth/sessions`,
  `/api/v1/permissions/check`, `mfe-access` ana ekranı)
kontrol eder; her çağrı için status kodu ve gecikmeyi raporlar.

Release checklist’inde:
- [ ] Smoke testler çalıştırıldı (`release_smoke_check.py`)
- [ ] Tüm kritik endpoint'ler için OK sonucu alındı

-------------------------------------------------------------------------------
2. SLO/SLA KONTROL ADIMLARI
-------------------------------------------------------------------------------

Sürüm sonrası SLO/SLA hedeflerini hızlıca doğrulamak için:

- Script: `scripts/check_slo_sla.py`
- Metrik örneği dosyası (örn. `metrics.json`):
  - `user_service_latency_p95_ms`, `user_service_5xx_error_rate`
  - `permission_service_latency_p95_ms`, `permission_service_5xx_error_rate`
  - `keycloak_login_success_rate`
  - `vault_health_status`, `vault_request_error_rate`
  - `fe_access_ttfa_p95_s`, `fe_access_grid_fetch_latency_p95_s`,
    `fe_access_client_error_rate`
- Kullanım:
  - `python3 scripts/check_slo_sla.py metrics.json`

Script:
- Her metrik için `docs/04-operations/SLO-SLA.md` ile uyumlu eşik değerlere göre
  OK/FAIL çıktısı üretir.
- En az bir SLO ihlali varsa exit code 1 döndürür.

Release checklist’inde:
- [ ] Güncel metrik snapshot’ı alındı (metrics.json)
- [ ] `check_slo_sla.py` çalıştırıldı ve kritik SLO’lar PASS durumda

1. AMAÇ
TBD

2. KAPSAM
TBD

3. KAPSAM DIŞI
TBD

4. BAĞLAM / ARKA PLAN
TBD

5. ADIM ADIM (KULLANIM)
TBD

6. SIK HATALAR / EDGE-CASE
TBD

7. LİNKLER
TBD
