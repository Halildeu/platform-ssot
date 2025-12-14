# GLOSSARY-GUIDE – Terim Sözlüğü Kullanım Rehberi

Bu doküman, proje genelindeki terim sözlüğü (glossary) girişlerinin nasıl
yazılacağını ve nerede kullanılacağını özetler.

-------------------------------------------------------------------------------
1. AMAÇ
-------------------------------------------------------------------------------

- Ortak terimlerin tek ve tutarlı bir tanımına sahip olmak.
- Feature/spec/story dokümanlarında geçen domain terimlerini merkezî bir sözlük
  üzerinden yönetmek.

-------------------------------------------------------------------------------
2. ŞABLON
-------------------------------------------------------------------------------

Yeni glossary girdileri için:

- Başlangıç noktası: eski `backend/docs/legacy/03-delivery/templates/06-glossary/glossary-entry.md`
  şablonunun yapısı.
- Yeni sistemde önerilen alanlar:
  - `term`: Terimin kendisi (canonical yazım).
  - `aliases`: Kullanılan kısaltmalar / varyantlar (varsa).
  - `owner`: Sözlük girdisinden sorumlu ekip.
  - `last_review`: Son gözden geçirme tarihi (YYYY-MM-DD).
  - Tanım, kullanım örnekleri, ilgili terimler, notlar.

-------------------------------------------------------------------------------
3. YERLEŞİM VE KULLANIM
-------------------------------------------------------------------------------

- Sözlük girişleri:
  - Küçük sözlükler → ilgili module/feature dokümanının yakınında tutulabilir.
  - Ortak/global terimler → ileride `docs/01-product` veya `docs/03-delivery` altında
    oluşturulacak merkezi “glossary” dokümanında toplanabilir.
- Terimler:
  - PB/PRD/TECH-DESIGN/STORY dokümanlarında ilk geçtiği yerde kısa açıklanmalı,
    detaylı açıklama için glossary girişine link verilebilir.

-------------------------------------------------------------------------------
4. GEÇİŞ NOTLARI (LEGACY → YENİ)
-------------------------------------------------------------------------------

- Eski template dosyası `backend/docs/03-delivery/templates/06-glossary/glossary-entry.md`
  legacy arşive alınmıştır:
  - `backend/docs/legacy/03-delivery/templates/06-glossary/glossary-entry.md`
- Yeni glossary girişleri için yalnızca bu rehber ve yeni docs/ yapısı referans
  alınmalıdır.

