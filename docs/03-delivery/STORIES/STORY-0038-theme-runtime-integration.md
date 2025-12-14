# STORY-0038 – Theme Runtime Integration (Docs Migration)

ID: STORY-0038-theme-runtime-integration  
Epic: E03-THEME-SYSTEM  
Status: Done  
Owner: @team/frontend  
Upstream: E03-S02, ADR-016 Theme & Layout System  
Downstream: AC-0038, TP-0038

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- Legacy E03-S02 “Theme Runtime Integration” içeriğini yeni doküman
  yapısına taşımak ve runtime tema eksenleri için tek referans oluşturmak.  
- HTML data-* eksenleri, semantic token → CSS var → Tailwind mapping ve
  UI Kit/AG Grid entegrasyonunun governance seviyesinde izlenmesini sağlamak.

-------------------------------------------------------------------------------
## 2. TANIM
-------------------------------------------------------------------------------

- Bir frontend geliştiricisi olarak, tema eksenlerinin (appearance/density/ radius/elevation/motion) HTML kökünde ve kodda net bir sözleşmeyle yönetilmesini istiyorum; böylece tema değişimleri kontrol altında olsun.
- BI/UX ekibi olarak, AG Grid ve Shell bileşenlerinin bu eksenlere göre tutarlı davranmasını istiyoruz; böylece yoğun ekranlarda bile okunabilirlik ve erişilebilirlik korunabilsin.

-------------------------------------------------------------------------------
## 3. KAPSAM VE SINIRLAR
-------------------------------------------------------------------------------

Dahil:
- HTML kökünde appearance/density/radius/elevation/motion eksenleri ve
  runtime ThemeController sözleşmesi.  
- Semantic token → CSS var → Tailwind mapping’in genel prensipleri.  
- UI Kit ve AG Grid bileşenleri için tema/density/radius/elevation/motion
  seçeneklerinin governance tanımı.  
- access=`full|readonly|disabled|hidden` deseninin tema/a11y ile ilişkisi.

Hariç:
- Yeni tema paletleri tasarlamak (Figma tarafı).  
- Backend veya auth policy değişiklikleri (yalnız UI davranışı kapsamdadır).

-------------------------------------------------------------------------------
## 4. ACCEPTANCE KRİTERLERİ
-------------------------------------------------------------------------------

- [x] STORY-0038 / AC-0038 / TP-0038 zinciri E03-S02 kapsamındaki tema
  runtime kararlarını ana maddeleriyle özetler.  
- [x] PROJECT-FLOW tablosunda E03-S02 ID’si, ilgili STORY satırında
  SPEC sütununda görünür.  
- [x] LİNKLER bölümünden ilgili STORY/AC/TP ve teknik tasarım dokümanlarına
  ulaşılabilir.

-------------------------------------------------------------------------------
## 5. BAĞIMLILIKLAR
-------------------------------------------------------------------------------

- docs/00-handbook/STYLE-WEB-001.md  

-------------------------------------------------------------------------------
## 6. ÖZET
-------------------------------------------------------------------------------

- Bu Story, tema runtime entegrasyonuna dair governance bilgisini docs/
  altına taşıyarak legacy PROJECT_FLOW bağımlılığını kaldırır.  
- Teknik detaylar ilgili TECH-DESIGN/ADR dokümanlarında, governance
  seviyesi kararlar ise bu STORY/AC/TP zincirinde izlenir.

-------------------------------------------------------------------------------
## 7. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Story: docs/03-delivery/STORIES/STORY-0038-theme-runtime-integration.md  
- Acceptance: docs/03-delivery/ACCEPTANCE/AC-0038-theme-runtime-integration.md  
- Test Plan: `docs/03-delivery/TEST-PLANS/TP-0038-theme-runtime-integration.md`  
