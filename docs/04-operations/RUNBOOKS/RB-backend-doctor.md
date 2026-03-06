# RB-backend-doctor – Backend Runtime Diagnostics Control Plane

ID: RB-backend-doctor  
Service: backend-doctor  
Status: Draft  
Owner: Backend Platform

-------------------------------------------------------------------------------
1. AMAÇ
-------------------------------------------------------------------------------

- Backend runtime health, compose service matrix, unauthorized smoke ve log triage
  zincirini tek doctor akısı altında toplamak.
- Kullanıcıya docker log, health endpoint ve smoke sonucunu tek tek taşıtmadan
  sistemin kendi kanıt paketini üretmesini sağlamak.
- Ham log dump yerine redacted triage özeti üretmek.

-------------------------------------------------------------------------------
2. KAPSAM
-------------------------------------------------------------------------------

- Kapsam:
  - `docs/02-architecture/context/backend-diagnostics.registry.v1.json`
  - `backend/scripts/ops/backend-doctor.py`
  - `backend/docker-compose.yml`
  - `backend/scripts/smoke.sh` (legacy manual smoke referansı)
- Varsayılan preset: `local-compose`
- Çıktılar:
  - `backend/test-results/diagnostics/backend-doctor/*/backend-doctor.summary.v1.json`
  - `backend/test-results/diagnostics/backend-doctor/*/backend-doctor.summary.v1.md`
  - `backend/test-results/diagnostics/backend-doctor/*/service-matrix.v1.json`
  - `backend/test-results/diagnostics/backend-doctor/*/health-probes.v1.json`
  - `backend/test-results/diagnostics/backend-doctor/*/smoke-checks.v1.json`
  - `backend/test-results/diagnostics/backend-doctor/*/log-triage.v1.json`

-------------------------------------------------------------------------------
3. BAŞLATMA / DURDURMA
-------------------------------------------------------------------------------

- Ön koşullar:
  - Docker erişilebilir olmalı.
  - `backend/docker-compose.yml` okunabilir olmalı.
  - Hedef local compose stack ayakta ise doctor gerçek runtime sonucunu verir.

- Başlatma:
  - `python3 backend/scripts/ops/backend-doctor.py`
  - `python3 backend/scripts/ops/backend-doctor.py --preset local-compose`

- Politika:
  - Varsayılan mod `report_only`.
  - Doctor `docker compose up/down` yapmaz.
  - Mevcut runtime'ı gözlemler ve summary üretir.

- Durdurma:
  - Tek-shot çalışır; arka planda süreç bırakmaz.

-------------------------------------------------------------------------------
4. GÖZLEMLEME / LOG / METRİKLER
-------------------------------------------------------------------------------

- Kanonik özet:
  - `backend-doctor.summary.v1.json`
  - `backend-doctor.summary.v1.md`
- Ana bölümler:
  - service matrix
  - health probes
  - smoke checks
  - log triage
  - fail reasons
  - warn reasons
- Minimum sinyaller:
  - kritik servis down mı
  - actuator/oidc/vault health yüzeyi dönüyor mu
  - gateway unauthorized davranışı doğru mu
  - auth JWKS yayında mı
  - Eureka registry erişilebilir mi
  - son 200 satırda error/exception kırmızı satır var mı

-------------------------------------------------------------------------------
5. ARIZA DURUMLARI VE ADIMLAR
-------------------------------------------------------------------------------

- [ ] Arıza senaryosu 1 – Kritik servis compose matrix'te yok:
  - Given: backend-doctor çalıştı,
  - When: `critical-service-missing:*` fail reason oluştu,
  - Then:
    - İlgili servis gerçekten ayağa kaldırılmış mı doğrula.
    - `docker-compose.yml` servis adı ile doctor registry eşleşmesini kontrol et.

- [ ] Arıza senaryosu 2 – Health probe FAIL:
  - Given: servis running görünüyor,
  - When: ilgili `actuator/health` veya OIDC metadata probe fail,
  - Then:
    - servis log triage excerpt'ini aç,
    - port mapping ve host endpoint uyumunu kontrol et,
    - discovery / db / auth bağımlılık zincirini incele.

- [ ] Arıza senaryosu 3 – Unauthorized smoke FAIL:
  - Given: `gateway_companies_unauthorized` fail,
  - When: 401/403 yerine başka kod dönüyor,
  - Then:
    - gateway route ve auth filter zincirini kontrol et,
    - route hiç yoksa registry / compose / downstream servis zincirine bak.

- [ ] Arıza senaryosu 4 – Log triage WARN:
  - Given: overall PASS/WARN ama log triage hit var,
  - When: excerpt içinde `ERROR`, `Exception`, `Caused by:` görülüyor,
  - Then:
    - ilgili servis için tam logu yalnız operasyonel inceleme amacıyla lokal aç,
    - secrets içeren satırları evidence'a kopyalama.

-------------------------------------------------------------------------------
6. ÖZET
-------------------------------------------------------------------------------

- `backend-doctor`, mevcut backend smoke ve runtime health parçalarını tek summary
  paketine toplar.
- Bu katman side-effect üretmez; mevcut runtime'ı ölçer.
- PASS olmasa bile summary her zaman yazılır; amaç gizli kırılmaları görünür kılmaktır.

-------------------------------------------------------------------------------
7. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Registry: `docs/02-architecture/context/backend-diagnostics.registry.v1.json`
- Registry özeti: `docs/02-architecture/context/backend-diagnostics.registry.v1.md`
- Doctor script: `backend/scripts/ops/backend-doctor.py`
- Monitoring: `docs/04-operations/MONITORING/MONITORING-backend-services.md`
