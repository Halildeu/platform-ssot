# STORY-0020 – Theme Accent & Focus Standardization

ID: STORY-0020-theme-accent-and-focus  
Epic: E03-THEME-SYSTEM  
Status: Planned  
Owner: @team/frontend  
Upstream: E03-S01-S01, E03-S01-S01.1 (legacy)  
Downstream: AC-0020, TP-0020

## 1. AMAÇ

Theme & Layout System v1.0 kapsamında accent primary, focus state ve high‑contrast
davranışlarını standardize etmek; tüm uygulamada odak göstergelerinin tutarlı,
erişilebilir ve tema eksenleriyle uyumlu olmasını sağlamak.

## 2. TANIM

- Bir kullanıcı olarak, tutarlı ve görünür focus/accent davranışları istiyorum; böylece klavye ve erişilebilirlik senaryolarında arayüzü rahat kullanabileyim.
- Bir frontend geliştiricisi olarak, tek bir accent/focus standardı istiyorum; böylece tüm MFE’lerde aynı token ve CSS pattern’lerini tekrar kullanabileyim.

## 3. KAPSAM VE SINIRLAR

Dahil:
- Accent primary/focus token’larının (normal + high‑contrast) tanımı ve
  UI genelinde uygulanması (form kontrolleri, linkler, buton ve gridler).  
- Focus ring ve hover/active state’ler için minimum A11y gereksinimlerinin
  belirlenmesi (kontrast, kalınlık, offset vb.).  
- E03‑S01‑S01 ve S01.1 altında tasarlanan accent/HC tuning kararlarının
  yeni dokümantasyon ve stil rehberlerine taşınması.

Hariç:
- Tam tema redesign; yalnız accent/focus davranışlarının standardizasyonu
  kapsamdadır.

## 4. ACCEPTANCE KRİTERLERİ

- [ ] Stil rehberinde accent/focus için tek bir token seti ve kullanım
  rehberi yer alır (normal + high‑contrast).  
- [ ] Örnek ekranlar (form, navigation, grid) üzerinde focus/accent
  davranışları A11y gereksinimlerini karşılar ve A11y smoke testlerinden
  geçer.  

## 5. BAĞIMLILIKLAR

- Theme & Layout System v1.0 kararları.  
- Globalization & Accessibility v1.0 (A11y smoke testleri).  

## 6. ÖZET

- E03 serisindeki accent/focus çalışmalarının sonucu bu STORY ile yeni
  dokümantasyon sistemine taşınacak ve tutarlı bir standart haline getirilecektir.

## 7. LİNKLER (İSTEĞE BAĞLI)

- Acceptance: docs/03-delivery/ACCEPTANCE/AC-0020-theme-accent-and-focus.md  
- Test Plan: `docs/03-delivery/TEST-PLANS/TP-0020-theme-accent-and-focus.md`  
