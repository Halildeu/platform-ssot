# AC-0037 – Theme & Layout System v1.0 Acceptance

ID: AC-0037  
Story: STORY-0037-theme-layout-system-v1  
Status: Done  
Owner: @team/frontend

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- Theme & Layout System v1.0 kararlarının yeni doküman mimarisi içinde
  tam ve test edilebilir şekilde temsil edildiğini doğrulamak.

-------------------------------------------------------------------------------
## 2. KAPSAM
-------------------------------------------------------------------------------

- Tema/mode/density eksenlerinin HTML kökünde yönetimi.  
- Figma token → CSS var → Tailwind config eşlemesi.  
- UI Kit primitives ve Shell layout bileşenleri için tema bağımlılıkları.  
- Ant Design bağımlılıklarının kaldırılması için yol haritası.

-------------------------------------------------------------------------------
## 3. GIVEN / WHEN / THEN SENARYOLARI
-------------------------------------------------------------------------------

- [x] Senaryo 1 – Doküman Zinciri:  
  - Given: Theme & Layout System v1.0 için STORY-0037 / AC-0037 / TP-0037
    doküman zinciri mevcuttur.  
    When: Bu dokümanlar ve PROJECT-FLOW satırı incelenir.  
    Then: Amaç/kapsam/akış E03-THEME-SYSTEM Epic’i altındaki kararlarla
    tutarlıdır ve PROJECT-FLOW’da STORY-0037 satırı görünür.

- [x] Senaryo 2 – Tema Eksenleri:  
  - Given: Tema/mode/density veri öznitelikleri HTML kökünde uygulanmıştır.  
    When: Theme controller akışı ve ilgili dokümanlar incelenir.  
    Then: Bu davranış Theme & Layout System v1.0 kararlarıyla uyumludur.

- [x] Senaryo 3 – Ant → Tailwind Geçişi:  
  - Given: Ant Design bağımlılıklarının kaldırılması için legacy mapping
    rehberleri vardır.  
    When: Yeni doküman zinciri ve ilgili teknik tasarımlar incelenir.  
    Then: En az bir referans mapping dokümanı LİNKLER bölümünde yer alır.

-------------------------------------------------------------------------------
## 4. NOTLAR / KISITLAR
-------------------------------------------------------------------------------

- Bu acceptance, tema/layout sisteminin **dokümantasyon ve governance**
  tarafını doğrular; kod seviyesindeki teknik kabul kriterleri ilgili
  teknik story ve test planlarında detaylandırılır.

-------------------------------------------------------------------------------
## 5. ÖZET
-------------------------------------------------------------------------------

- Theme & Layout System v1.0 için governance seviyesi kabul kriterleri
  yeni doküman yapısına taşınmıştır.  
- Legacy governance dokümanına bakmak yerine yalnız docs/ altındaki
  STORY/AC/TP zincirine bakmak yeterlidir.

-------------------------------------------------------------------------------
## 6. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Story: docs/03-delivery/STORIES/STORY-0037-theme-layout-system-v1.md  
- Test Plan: docs/03-delivery/TEST-PLANS/TP-0037-theme-layout-system-v1.md  
