# TP-9002 – Access Module MVP Release Test Plan

ID: TP-9002  
Story: STORY-XXXX-access-mvp  
Status: Draft  
Owner: @team/platform-fe

-------------------------------------------------------------------------------
1. AMAÇ
-------------------------------------------------------------------------------

- Access modülünün 2025-11-10 tarihli MVP release’i için ön hazırlık,
  test & doğrulama, release ve rollback adımlarını tek planda toplamak.

-------------------------------------------------------------------------------
2. KAPSAM
-------------------------------------------------------------------------------

- Dahil:
  - `mfe-access` modülü ve shell entegrasyonu
  - Access ile ilgili feature flag’ler:
    - `access_mutation_write`
    - `access_grid_lazy_load`
    - `audit_deeplink_enabled`
  - i18n sözlükleri ve pseudolocale smoke pipeline’ı
- Hariç:
  - Access dışı MFE’ler ve backend servis detayları (sadece smoke ile doğrulanır)

-------------------------------------------------------------------------------
3. STRATEJİ
-------------------------------------------------------------------------------

- Akış:
  1) Ön Hazırlık  
  2) Test & Doğrulama  
  3) Release Adımları  
  4) Yayın Sonrası İzleme  
  5) Rollback Planı  
  6) Lessons & Follow-up

-------------------------------------------------------------------------------
4. TEST SENARYOLARI ÖZETİ
-------------------------------------------------------------------------------

### 1) Ön Hazırlık

- [ ] Roadmap / changelog güncellendi (PROJECT_FLOW + ilgili epics/stories).  
- [ ] Feature flag’ler hedef değerlere çekildi:  
      - `access_mutation_write = true`  
      - `access_grid_lazy_load = true`  
      - `audit_deeplink_enabled = true`  
- [ ] TMS sözlükleri çekildi (`npm run i18n:pull`).  
- [ ] `i18n-smoke.yml` pseudolocale pipeline yeşil.

### 2) Test & Doğrulama

- [ ] `npm run test --prefix web/apps/mfe-access`  
- [ ] `npm run test --prefix packages/i18n-dicts`  
- [ ] `npm run i18n:pseudo`  
- [ ] `npm run build:shell`  
- [ ] `npm run security:sri:check`  
- [ ] `docs/04-operations/RUNBOOKS/RB-mfe-access.md` gözden geçirildi ve güncel.

### 3) Release Adımları

- [ ] `npm run build --prefix web/apps/mfe-access`  
- [ ] Artefact publish: Argo CD pipeline `mfe-access` → `access-mvp-2025-11` etiketiyle deploy.  
- [ ] Config/secrets: Vault path `kv/platform/access` kontrol edildi.

### 4) Yayın Sonrası

- [ ] Prod smoke: Shell Access sayfası TTFA < 5s, grid yükleniyor.  
- [ ] Notification center audit link testi başarılı.  
- [ ] Grafana Access dashboard’ı en az 2 saat izlendi (TTFA, mutation success, error rate).  
- [ ] Release notu `docs/03-delivery/guides/releases/notes/access-mvp.md` üzerinden yayınlandı (örn. Slack `#release-updates`).

### 5) Geri Dönüş (Rollback) Planı

- [ ] Argo CD üzerinden `mfe-access` için rollback senaryosu test edildi.  
- [ ] Feature flag fallback:  
      - `access_mutation_write = false`  
      - `access_grid_lazy_load = false`  
- [ ] Manifest SRI revert (`security/sri-manifest.json` önceki hash’e alındı).

### 6) Lessons & Follow-up

- [ ] Telemetry olayları (audit link tıklanma, mutation success) raporlandı.  
- [ ] `mfe-audit` deep-link POC için sonraki flow planlandı.

-------------------------------------------------------------------------------
5. ÇEVRE VE ARAÇLAR
-------------------------------------------------------------------------------

- CI/CD:
  - Argo CD application: `mfe-access`
  - i18n smoke pipeline: `i18n-smoke.yml`
- Ortamlar:
  - Prod: `https://shell.example.com/access/*`
  - Stage: `https://shell-stage.example.com/access/*`
- Dashboard:
  - Grafana: *Access Module Overview*
  - Log index: `logs-fe-access-*`

-------------------------------------------------------------------------------
6. RİSKLER / ÖNCELİKLER
-------------------------------------------------------------------------------

- Access modülündeki hatalar doğrudan rol/policy yönetimini etkiler; fallback senaryoları
  (read-only grid, flag rollback) test edilmeden release yapılmamalıdır.

-------------------------------------------------------------------------------
7. ÖZET
-------------------------------------------------------------------------------

- Bu test planı, Access Module MVP release’inin güvenli yayınlanması ve gerektiğinde
  hızlı rollback yapılabilmesi için gereken temel adımları tanımlar.

-------------------------------------------------------------------------------
8. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Story: (ilgili STORY-XXXX dosyası)  
- Acceptance: (ilgili AC-XXXX dosyası)  
- Runbook: docs/04-operations/RUNBOOKS/RB-mfe-access.md  
