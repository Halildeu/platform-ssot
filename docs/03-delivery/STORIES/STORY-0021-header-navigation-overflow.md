# STORY-0021 – Header Navigation & Overflow

ID: STORY-0021-header-navigation-overflow  
Epic: E03-THEME-SYSTEM  
Status: Planned  
Owner: @team/frontend  
Upstream: E03-S04 (legacy)  
Downstream: AC-0021, TP-0021

## 1. AMAÇ

Shell header navigasyonunu ve overflow davranışını standardize ederek,
küçük ekranlarda ve dar genişliklerde dahi öngörülebilir, erişilebilir ve
dokümante bir navigation deneyimi sağlamak.

## 2. TANIM

- Bir kullanıcı olarak, header navigation komponentlerinin farklı ekran genişliklerinde tutarlı davranmasını istiyorum; böylece menüleri her durumda rahat kullanabileyim.
- Bir frontend geliştiricisi olarak, navigation overflow kurallarının açıkça tanımlanmasını istiyorum; böylece yeni ekranlar eklediğimde aynı deseni tekrar uygulayabileyim.

## 3. KAPSAM VE SINIRLAR

Dahil:
- Header navigation bileşenleri için slot/alan tanımı (logo, primary nav,
  secondary aksiyonlar, profil menüsü vb.).  
- Overflow davranışı (ör. “More” menüsü) ve klavye/reader erişilebilirliği.  
- Breakpoint’ler ve responsive kuralların kısa dokümantasyonu.

Hariç:
- Tam shell redesign; yalnız header navigation ve overflow kapsamdadır.

## 4. ACCEPTANCE KRİTERLERİ

- [ ] Header navigation için layout ve overflow davranışını tarif eden
  doküman günceldir ve gerçek UI ile uyumludur.  
- [ ] Küçük ekranlarda navigation kullanılabilirliği (klavye/reader) A11y
  smoke testlerinden geçer.  

## 5. BAĞIMLILIKLAR

- Theme & Layout System v1.0.  
- Globalization & Accessibility v1.0 (navigasyon A11y gereksinimleri).  

## 6. ÖZET

- Header navigasyon ve overflow kuralları, bu STORY sayesinde yeni sistemde
  tek bir referans olarak takip edilecektir.

## 7. LİNKLER (İSTEĞE BAĞLI)

- Acceptance: docs/03-delivery/ACCEPTANCE/AC-0021-header-navigation-overflow.md  
- Test Plan: `docs/03-delivery/TEST-PLANS/TP-0021-header-navigation-overflow.md`  
