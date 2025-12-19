# STORY-0049 – Sidebar & Navigation v1

ID: STORY-0049-sidebar-navigation-v1  
Epic: UX-SHELL-NAV  
Status: Planned  
Owner: @team/frontend  
Upstream: STORY-0044-theme-ssot-single-chain-v1 (Dynamic Axes ilkeleri), i18n sözlüğü (web/packages/i18n-dicts), Design Lab (admin)  
Downstream: AC-0049, TP-0049

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- Shell içi Sidebar ve üst menü (header) navigasyonunu tek bir “Nav Registry (SSOT)” üzerinden yönetmek.  
- Kullanıcı deneyimini deterministik hale getirmek:
  - collapse/expand + persistence  
  - keyboard navigation + erişilebilirlik  
  - arama ile hızlı navigasyon  
  - permission gating politikasında tutarlılık  
- Uygulamada “hardcoded nav item list” ve “kopya permission/mapping” drift’ini engellemek.

-------------------------------------------------------------------------------
## 2. TANIM
-------------------------------------------------------------------------------

- Bir kullanıcı olarak, yetkim olan modüllere Sidebar üzerinden hızlı erişmek istiyorum; böylece sayfalar arasında arayüz tutarlı ve hızlı şekilde gezebilirim.  
- Bir geliştirici olarak, nav item’ları tek bir SSOT’ta tanımlamak istiyorum; böylece header/sidebar arasında drift oluşmasın ve test edilebilirlik artsın.

-------------------------------------------------------------------------------
## 3. KAPSAM VE SINIRLAR
-------------------------------------------------------------------------------

Dahil (v1):
- Sidebar:
  - Collapse/expand (kalıcı tercih)  
  - Search entrypoint (Ctrl+K)  
  - Keyboard navigation (arrow/enter/esc) + odak yönetimi  
  - Active route highlight doğruluğu  
  - Permission gating (policy)  
  - Overflow/scroll davranışı (küçük viewport)  
  - Reduced motion uyumu  
- Nav Registry (SSOT):
  - Tek kaynak: nav item listesi, route path, i18n labelKey, permission gereksinimi, testid, iconKey/grup bilgisi  
  - Hem header nav hem sidebar bu SSOT’tan beslenir (kopya liste yok).  
  - SSOT dosyası: `web/apps/mfe-shell/src/app/nav/nav-registry.ts`  
  - Selector/logic: `web/apps/mfe-shell/src/app/nav/nav-selectors.ts`  
- i18n:
  - Sidebar ve nav item label’ları i18n key ile gelir; hardcoded string azaltma planı bu scope’a dahil.  

Kapsam dışı (v1):
- Favorites/Recent (v1.1)  
- Analytics/telemetry (v1.1)  
- Server-driven nav registry (v2)  

-------------------------------------------------------------------------------
## 4. ACCEPTANCE KRİTERLERİ
-------------------------------------------------------------------------------

- Sidebar collapse/expand tercihi kalıcıdır ve reload sonrası korunur.  
- Keyboard ile sidebar içinde nav item’lar gezilebilir ve Enter ile navigasyon yapılır.  
- Search (Ctrl+K) ile nav item bulunur ve seçince doğru route’a gider.  
- Permission gating policy tutarlıdır (header/sidebar aynı kural seti).  
- Reduced motion tercihinde animasyonlar minimuma iner ve UX bozulmaz.  

Detaylı Given/When/Then senaryoları: AC-0049.

-------------------------------------------------------------------------------
## 5. BAĞIMLILIKLAR
-------------------------------------------------------------------------------

- Theme/Dynamic Axes prensipleri:
  - `docs/03-delivery/STORIES/STORY-0044-theme-ssot-single-chain-v1.md`  
- Permission modeli:
  - `web/apps/mfe-shell/src/features/auth/lib/permissions.constants`  
- Mevcut shell nav yapısı:
  - `web/apps/mfe-shell/src/app/ShellApp.ui.tsx`  
- Mevcut sidebar implementasyonu:
  - `web/apps/mfe-shell/src/widgets/app-shell/ui/Sidebar.ui.tsx`  
- Nav Registry SSOT:
  - `web/apps/mfe-shell/src/app/nav/nav-registry.ts`  
  - `web/apps/mfe-shell/src/app/nav/nav-selectors.ts`  
- i18n sözlüğü:
  - `web/packages/i18n-dicts/src/locales/en/common.ts`  
  - `web/packages/i18n-dicts/src/locales/tr/common.ts`  
  - `web/packages/i18n-dicts/src/locales/pseudo/common.ts`  
- Design Lab (admin):
  - `web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx`  

-------------------------------------------------------------------------------
## 6. ÖZET
-------------------------------------------------------------------------------

- Hedef: Sidebar + Header nav için Nav Registry SSOT ile drift’i bitirmek.  
- UX: persistence + keyboard + search + permission gating + reduced motion v1 kapsamıdır.  
- Doğrulama: AC-0049 ve TP-0049 ile L1/L2/L3 test planı kilitlenir.  

-------------------------------------------------------------------------------
## 7. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Story: docs/03-delivery/STORIES/STORY-0049-sidebar-navigation-v1.md  
- Acceptance: docs/03-delivery/ACCEPTANCE/AC-0049-sidebar-navigation-v1.md  
- Test Plan: docs/03-delivery/TEST-PLANS/TP-0049-sidebar-navigation-v1.md  
- Kod: web/apps/mfe-shell/src/widgets/app-shell/ui/Sidebar.ui.tsx  
- Kod: web/apps/mfe-shell/src/app/ShellApp.ui.tsx  
- Kod (Design Lab): web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx  

-------------------------------------------------------------------------------
## 8. PROGRESS
-------------------------------------------------------------------------------

- ✅ Nav Registry SSOT + selectors eklendi; Sidebar/Header aynı kaynaktan besleniyor (permission yoksa DOM’da yok).  
- ⏳ Kalan: Nav registry drift L2 gate (script) + a11y/i18n polish (v1.1).  
