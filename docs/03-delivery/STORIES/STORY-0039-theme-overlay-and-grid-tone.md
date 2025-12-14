# STORY-0039 – Theme Overlay & Grid Surface Tone (Docs Migration)

ID: STORY-0039-theme-overlay-and-grid-tone  
Epic: E03-THEME-SYSTEM  
Status: Done  
Owner: @team/frontend  
Upstream: E03-S03  
Downstream: AC-0039, TP-0039

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- Legacy E03-S03 “Theme Overlay & Grid Tone” içeriğini yeni doküman
  yapısına taşımak.  
- Dark/HC overlay renkleri ve grid yüzey tonu için governance seviyesinde
  tek sözleşme tanımlamak.

-------------------------------------------------------------------------------
## 2. TANIM
-------------------------------------------------------------------------------

- Bir kullanıcı olarak, dark/high-contrast modda modal/drawer ve grid yüzeylerinin okunabilir ve tutarlı olmasını istiyorum; böylece yoğun veri ekranlarında gözüm yorulmasın.
- Bir frontend geliştiricisi olarak, overlay ve table surface tonunun tema aksları olarak tanımlanmasını istiyorum; böylece tema değişimlerini token seviyesinde yönetebileyim.

-------------------------------------------------------------------------------
## 3. KAPSAM VE SINIRLAR
-------------------------------------------------------------------------------

Dahil:
- Dark/HC overlay tonları için yeni tema token’ları.  
- `tableSurfaceTone` aksı ve `--table-surface-bg` CSS değişkeni.  
- UI Kit overlay/panel bileşenleri ve grid bileşenlerinde bu aksların
  kullanımı.  
- Tema panelinde table surface/overlay ton kontrollerinin governance
  tanımı.

Hariç:
- Yeni grid feature’ları (toplu aksiyonlar, filtre builder, vb.).  
- Tam shell redesign; yalnız overlay ve grid yüzeyi kapsamda.

-------------------------------------------------------------------------------
## 4. ACCEPTANCE KRİTERLERİ
-------------------------------------------------------------------------------

- [x] STORY-0039 / AC-0039 / TP-0039 zinciri, tematize overlay ve grid
  yüzey tonu ile ilgili ana kararları özetler.  
- [x] PROJECT-FLOW’da E03-THEME-SYSTEM Epic’i altındaki bu Story satırı,
  doğru SPEC/Acceptance bilgileriyle ilişkilidir.

-------------------------------------------------------------------------------
## 5. BAĞIMLILIKLAR
-------------------------------------------------------------------------------

- docs/00-handbook/STYLE-WEB-001.md  

-------------------------------------------------------------------------------
## 6. ÖZET
-------------------------------------------------------------------------------

- Overlay ve grid yüzey tonu kararları yeni sistemde bu Story altında
  toplanarak governance tarafında tek kaynağa taşınmıştır.

-------------------------------------------------------------------------------
## 7. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Story: docs/03-delivery/STORIES/STORY-0039-theme-overlay-and-grid-tone.md  
- Acceptance: docs/03-delivery/ACCEPTANCE/AC-0039-theme-overlay-and-grid-tone.md  
- Test Plan: `docs/03-delivery/TEST-PLANS/TP-0039-theme-overlay-and-grid-tone.md`  
