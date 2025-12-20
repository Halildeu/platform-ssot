# AC-0050 – i18n Locale Propagation Fix v1 Acceptance

ID: AC-0050  
Story: STORY-0050-i18n-locale-propagation-fix-v1  
Status: Done  
Owner: @team/frontend

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- Locale değişiminde stale UI riskini ortadan kaldıracak, test edilebilir kabul kriterlerini tanımlamak.  

-------------------------------------------------------------------------------
## 2. KAPSAM
-------------------------------------------------------------------------------

- Shell locale switch (header language select)  
- Embedded MFE’lerde i18n hook davranışı (`t`/memo invalidation)  
- Intl format fonksiyonları (number/date) memo invalidation  
- E2E smoke (Playwright scenario runner)  

-------------------------------------------------------------------------------
## 3. GIVEN / WHEN / THEN SENARYOLARI
-------------------------------------------------------------------------------

### Web

- [x] Senaryo 1 – Locale switch sonrası `/admin/users` label güncellenir:
  - Given: Kullanıcı authenticated ve `/admin/users` sayfasındadır.  
  - When: Header’daki “Dil seçimi” ile locale `tr → en` değiştirilir.  
  - Then: “Kullanıcıları Yenile” label’ı “Refresh users” olur (reload yok).  
  - Kanıt/Evidence:
    - Kod: `web/apps/mfe-users/src/i18n/useUsersI18n.ts`  
    - E2E: `web/tests/playwright/pw_scenarios.yml` (`story_0050_locale_switch_propagation`)  

- [x] Senaryo 2 – `useMemo([t])` cache stale üretmez:
  - Given: UI `useMemo([t])` ile breadcrumb/actions gibi parçaları memoize eder.  
  - When: Locale değişir ve hook rerender olur.  
  - Then: `t` referansı değiştiği için memo sonuçları yeniden hesaplanır ve UI güncellenir.  
  - Kanıt/Evidence:
    - Kod: `web/apps/mfe-users/src/pages/users/UsersPage.ui.tsx` (`useMemo([t])`)  

- [x] Senaryo 3 – Intl format fonksiyonları locale değişince güncellenir:
  - Given: UI `formatNumber/formatDate` gibi callback’leri memoize eder.  
  - When: Locale değişir.  
  - Then: callback referansı locale ile ilişkilendirildiği için stale format üretilmez.  
  - Kanıt/Evidence:
    - Kod: `web/apps/mfe-access/src/i18n/useAccessI18n.ts`  

- [x] Senaryo 4 – E2E smoke telemetry 5xx=0 korunur:
  - Given: E2E koşumda backend erişilemez veya 5xx üretebilir.  
  - When: `PW_MOCK_API=1` ile gerekli endpoint’ler mock’lanır.  
  - Then: `xhr/fetch 5xx=0` ve `requestfailed=0` olarak PASS olur.  
  - Kanıt/Evidence:
    - Kod: `web/tests/playwright/scenario-runner.spec.ts`  

-------------------------------------------------------------------------------
## 4. NOTLAR / KISITLAR
-------------------------------------------------------------------------------

- Mock’lar yalnız Playwright koşumunda gate’li olarak aktiftir (`PW_MOCK_API=1`).  
- Prod davranışı değişmez; amaç E2E smoke stabilizasyonudur.  

-------------------------------------------------------------------------------
## 5. ÖZET
-------------------------------------------------------------------------------

- Locale switch sonrası stale UI kalmamalıdır.  
- E2E smoke telemetry guard’ları (5xx/requestfailed) korunmalıdır.  

-------------------------------------------------------------------------------
## 6. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Story: docs/03-delivery/STORIES/STORY-0050-i18n-locale-propagation-fix-v1.md  
- Test Plan: docs/03-delivery/TEST-PLANS/TP-0050-i18n-locale-propagation-fix-v1.md  

