# AC-0049 – Sidebar & Navigation v1 Acceptance

ID: AC-0049  
Story: STORY-0049-sidebar-navigation-v1  
Status: Planned  
Owner: @team/frontend

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- Sidebar ve navigasyonun v1 davranışını test edilebilir şekilde tanımlamak.  
- Nav Registry (SSOT) yaklaşımının header/sidebar arasında drift üretmemesini sağlamak.  

-------------------------------------------------------------------------------
## 2. KAPSAM
-------------------------------------------------------------------------------

- Collapse/expand persistence  
- Keyboard navigation + erişilebilirlik  
- Search ile navigasyon  
- Permission gating (hidden/disabled policy)  
- Active route doğruluğu  
- Reduced motion davranışı  

-------------------------------------------------------------------------------
## 3. GIVEN / WHEN / THEN SENARYOLARI
-------------------------------------------------------------------------------

### Web

- [ ] Senaryo 1 – Collapse/expand persistence:
  - Given: Sidebar collapse moduna alınır.  
  - When: Sayfa reload edilir.  
  - Then: Sidebar mode (collapsed/expanded) kalıcı tercihe göre korunur.  
  - Kanıt/Evidence (önerilen):
    - Kod: `web/apps/mfe-shell/src/app/layout/Sidebar.tsx` (localStorage: `shell.sidebar.mode`)
    - E2E: (plan) Playwright `sidebar_navigation` senaryosu  

- [ ] Senaryo 2 – Keyboard navigation:
  - Given: Sidebar içinde nav item listesi görünür ve focus nav bölgesindedir.  
  - When: Kullanıcı ArrowUp/ArrowDown/Enter/Escape kullanır.  
  - Then: Odak deterministik gezinir ve Enter ile route değişir; Escape search/panel kapatır.  
  - Kanıt/Evidence (önerilen):
    - E2E: (plan) Playwright `sidebar_navigation`  

- [ ] Senaryo 3 – Search ile navigasyon:
  - Given: Search entrypoint (Ctrl+K) aktiftir.  
  - When: Kullanıcı bir nav item adı/etiketi arar ve sonuç seçer.  
  - Then: Doğru route’a navigasyon olur ve arama paneli kapanır.  
  - Kanıt/Evidence (önerilen):
    - UI: Sidebar search button (`data-testid="sidebar-search"`)  

- [ ] Senaryo 4 – Permission gating policy:
  - Given: Kullanıcının bazı modüller için izni yoktur.  
  - When: Sidebar ve header nav render edilir.  
  - Then: Yetkisiz item’lar DOM’da render edilmez (hidden policy); kullanıcı navigasyon yapamaz.  
  - Kanıt/Evidence (önerilen):
    - Kod: `web/apps/mfe-shell/src/app/ShellApp.tsx` (permission gating)
    - Kod: `web/apps/mfe-shell/src/app/layout/Sidebar.tsx`

- [ ] Senaryo 5 – Active route doğruluğu:
  - Given: Kullanıcı `/audit/events` gibi bir route üzerindedir.  
  - When: Sidebar render edilir.  
  - Then: İlgili nav item “active” görünür (doğru highlight).  

- [ ] Senaryo 6 – Reduced motion:
  - Given: Kullanıcı `prefers-reduced-motion: reduce` tercihindedir.  
  - When: Sidebar collapse/expand veya menü aç/kapa işlemleri yapılır.  
  - Then: Animasyonlar minimuma iner ve UX erişilebilir kalır.  

-------------------------------------------------------------------------------
## 4. NOTLAR / KISITLAR
-------------------------------------------------------------------------------

- Favorites/Recent ve analytics v1 kapsam dışıdır.  
- “Nav Registry (SSOT)” yaklaşımı uygulandığında header/sidebar kopya liste barındırmamalıdır.  

-------------------------------------------------------------------------------
## 5. ÖZET
-------------------------------------------------------------------------------

- Persistence + keyboard + search + permission gating v1 kabul kapsamıdır.  
- Reduced motion ve active route doğruluğu zorunludur.  

-------------------------------------------------------------------------------
## 6. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Story: docs/03-delivery/STORIES/STORY-0049-sidebar-navigation-v1.md  
- Test Plan: docs/03-delivery/TEST-PLANS/TP-0049-sidebar-navigation-v1.md  
