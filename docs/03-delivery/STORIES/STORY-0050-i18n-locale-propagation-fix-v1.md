# STORY-0050 – i18n Locale Propagation Fix v1

ID: STORY-0050-i18n-locale-propagation-fix-v1  
Epic: UX-GLOBAL-A11Y  
Status: Done  
Owner: @team/frontend  
Upstream: STORY-0013-globalization-accessibility-v1  
Downstream: AC-0050, TP-0050  

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- Shell’de locale değişince embedded MFE’lerde “stale UI” kalmamasını sağlamak.  
- i18n hook’larında locale değişimini “rerender + memo invalidation” ile deterministik hale getirmek.  
- Playwright smoke koşumlarında backend bağımlılığı kaynaklı 5xx/requestfailed flakiness’i azaltmak (yalnız PW modunda, gate’li).  

-------------------------------------------------------------------------------
## 2. TANIM
-------------------------------------------------------------------------------

- Bir kullanıcı olarak, uygulamada dili değiştirdiğimde sayfadaki tüm label ve aksiyonların aynı anda güncellenmesini istiyorum; böylece karışıklık yaşamam.  
- Bir geliştirici olarak, `useMemo([t])` ile üretilen UI bloklarının locale değişince otomatik yenilenmesini istiyorum; böylece stale UI bug’ı tekrar etmesin.  

-------------------------------------------------------------------------------
## 3. KAPSAM VE SINIRLAR
-------------------------------------------------------------------------------

Dahil:
- i18n hook’larında `t/formatNumber/formatDate` fonksiyonlarının referansı locale değişince güncellenir.  
- `useMemo([t])` / `useCallback([t])` ile üretilen label/option/actions gibi UI parçaları locale değişince yeniden hesaplanır.  
- Playwright YAML scenario runner içinde, sadece gerekli endpoint’ler için gate’li mock (PW_MOCK_API=1).  

Kapsam dışı:
- TMS/remote dictionary download mimarisi değişiklikleri.  
- Yeni dil ekleme veya çeviri kapsam genişletme.  
- Shell’de locale selector UX/persistence iyileştirmeleri (mevcut davranış korunur).  

-------------------------------------------------------------------------------
## 4. ACCEPTANCE KRİTERLERİ
-------------------------------------------------------------------------------

- Shell’de locale değişince `/admin/users` sayfasındaki “Kullanıcıları Yenile” label’ı “Refresh users” olarak güncellenir (reload yok).  
- `useMemo([t])` ile üretilen breadcrumb/actions gibi objeler locale değişince yeniden hesaplanır (stale UI yok).  
- `formatNumber/formatDate` gibi Intl format fonksiyonları locale değişince yeni locale ile üretim yapar (memo invalidation).  
- E2E senaryosu `story_0050_locale_switch_propagation` PASS olur ve telemetry `xhr/fetch 5xx=0` korunur.  

Detaylı Given/When/Then senaryoları: AC-0050.

-------------------------------------------------------------------------------
## 5. BAĞIMLILIKLAR
-------------------------------------------------------------------------------

- Shell locale event kaynağı:
  - `web/apps/mfe-shell/src/app/ShellApp.ui.tsx`
- i18n hook’ları:
  - `web/apps/mfe-users/src/i18n/useUsersI18n.ts`
  - `web/apps/mfe-access/src/i18n/useAccessI18n.ts`
  - `web/apps/mfe-reporting/src/i18n/useReportingI18n.ts`
  - `web/apps/mfe-shell/src/app/i18n/useShellCommonI18n.ts`
- Playwright scenario runner:
  - `web/tests/playwright/scenario-runner.spec.ts`
  - `web/tests/playwright/pw_scenarios.yml`

-------------------------------------------------------------------------------
## 6. ÖZET
-------------------------------------------------------------------------------

- Çözüm: i18n hook’larında `t/format*` referanslarını locale ile ilişkilendirerek memo cache’in invalidation’ını garantilemek.  
- Doğrulama: Playwright senaryosu ile locale switch → UI label güncellemesi; telemetry 5xx=0.  

-------------------------------------------------------------------------------
## 7. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Story: docs/03-delivery/STORIES/STORY-0050-i18n-locale-propagation-fix-v1.md  
- Acceptance: docs/03-delivery/ACCEPTANCE/AC-0050-i18n-locale-propagation-fix-v1.md  
- Test Plan: docs/03-delivery/TEST-PLANS/TP-0050-i18n-locale-propagation-fix-v1.md  

