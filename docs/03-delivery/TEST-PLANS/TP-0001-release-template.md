# TP-0001 – Release Test Plan Template

ID: TP-0001  
Story: (release-specific STORY ID)  
Status: Draft  
Owner: @team/release

-------------------------------------------------------------------------------
1. AMAÇ
-------------------------------------------------------------------------------

- Belirli bir sürüm (release) için test ve doğrulama adımlarını,
  ön hazırlık ve rollback dahil olmak üzere tek bir plan altında toplamak.

-------------------------------------------------------------------------------
2. KAPSAM
-------------------------------------------------------------------------------

- Dahil:
  - İlgili servisler / MFE’ler / API’ler
  - Unit, integration, e2e, smoke, perf ve security testleri
- Hariç:
  - Bu release kapsamına alınmayan feature’lar veya ortamlar

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

- [ ] Roadmap / changelog güncellendi  
- [ ] Özellik bayrakları listelendi (açık/kapalı)  
- [ ] TMS sözlükleri (`npm run i18n:pull`) çekildi ve PR merge edildi  
- [ ] Pseudolocale smoke CI yeşil  

### 2) Test & Doğrulama

- [ ] Regression suite / e2e sonuçları yeşil  
- [ ] Performans / güvenlik taramaları yeşil  
- [ ] İzleme dashboard’ları release öncesi snapshot alındı  

### 3) Release Adımları

- [ ] Prod tag/branch hazırlandı  
- [ ] Artefact publish / deploy komutları uygulandı  
- [ ] Config / secret değişiklikleri uygulandı  

### 4) Yayın Sonrası

- [ ] Prod smoke test geçti  
- [ ] Telemetry, error rate, loglar X saat izlendi  
- [ ] Release notu / müşteriye duyuru yayınlandı  

### 5) Geri Dönüş (Rollback) Planı

- [ ] Rollback komutu/testi hazır ve denenmiş durumda  
- [ ] Veri migration geri alma stratejisi tanımlı  

### 6) Lessons & Follow-up

- [ ] Kapanmamış task’ler gözden geçirildi  
- [ ] Sonraki flow için notlar yazıldı  

-------------------------------------------------------------------------------
5. ÇEVRE VE ARAÇLAR
-------------------------------------------------------------------------------

- CI/CD pipeline isimleri, job linkleri  
- Prod/stage URL’leri  
- Önemli dashboard ve log arama linkleri  

-------------------------------------------------------------------------------
6. RİSKLER / ÖNCELİKLER
-------------------------------------------------------------------------------

- Yüksek riskli değişiklikler (schema, kritik feature flag vb.)  
- Bu release için özel mitigasyon adımları  

-------------------------------------------------------------------------------
7. ÖZET
-------------------------------------------------------------------------------

- Bu plan, release’in güvenli şekilde yayınlanması ve gerektiğinde hızlı rollback
  yapılabilmesi için gereken asgari adımları tanımlar.

-------------------------------------------------------------------------------
8. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Story: docs/03-delivery/STORIES/STORY-XXXX-*.md  
- Acceptance: docs/03-delivery/ACCEPTANCE/AC-XXXX-*.md  
- Runbook: docs/04-operations/RUNBOOKS/RB-<servis>.md  

*** Update File: backend/docs/legacy/03-delivery/templates/05-release/release-checklist.md
@@
 ## 6. Lessons & Follow-up
 - [ ] Kapanmamış task var mı?
 - [ ] Sonraki flow için notlar

Not:  
Bu dosya legacy release checklist şablonudur. Yeni release planları için:  
- docs/03-delivery/TEST-PLANS/TP-0001-release-template.md  
ve `docs/99-templates/TEST-PLAN.template.md` kullanılmalıdır.
