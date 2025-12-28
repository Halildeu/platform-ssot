# PRD-0005 – NC & CAPA Yönetimi (MVP)

ID: PRD-0005  
Status: Draft  
Owner: @team/platform  
Problem Brief: PB-0005

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

NC kayıtlarını tek zincirde (NC → RCA → CAPA → doğrulama → kapanış) izlenebilir hale getirerek tekrar oranını azaltmak.

-------------------------------------------------------------------------------
## 2. KAPSAM
-------------------------------------------------------------------------------

Dahil (MVP):
- NC intake + sınıflandırma + öncelik.
- RCA şablonu (basit, çıktısı kayıt altında).
- CAPA aksiyonları (owner + due date + verifikasyon) ve kapanış.
- SLA breach + eskalasyon kuralı (policy).
- Kanıt/ek yönetimi ve audit/view log beklentisi.
- Trend raporlama (tekrar eden uygunsuzluklar).

-------------------------------------------------------------------------------
## 3. KULLANICI SENARYOLARI
-------------------------------------------------------------------------------

- Senaryo 1: Saha kullanıcısı NC kaydı açar ve kanıt ekler.
- Senaryo 2: Kalite mühendisi RCA doldurur, CAPA aksiyonlarını atar.
- Senaryo 3: Sorumlu, aksiyonu tamamlar; verifikasyon sonrası NC kapanır.
- Senaryo 4: Denetçi, audit trail ve raporlar üzerinden denetim yapar.

-------------------------------------------------------------------------------
## 4. DAVRANIŞ / GEREKSİNİMLER
-------------------------------------------------------------------------------

Fonksiyonel:
- NC kaydı temel alanları standardize edilir (kategori/şiddet/açıklama/konum vb.).
- RCA çıktısı kayıt altında ve geriye dönük izlenebilir olur.
- CAPA aksiyonları görev olarak takip edilir (durum, due date, sorumlu).
- Evidence/ekler silinmez; erişim ve değişiklik audit’e düşer.
- SLA breach olduğunda eskalasyon kuralı tetiklenir (policy).

Non-functional (business-level):
- İzlenebilirlik: audit trail + view log kritik.
- Veri sınıfı: saha notları/isimler PII olabilir; maskeleme politikası gerekebilir.

-------------------------------------------------------------------------------
## 5. NON-GOALS (KAPSAM DIŞI)
-------------------------------------------------------------------------------

- ERP/finans entegrasyonları.
- Otomatik karar/verifikasyon (insansız kapanış).
- İleri seviye workflow engine (MVP sonrası).

-------------------------------------------------------------------------------
## 6. ACCEPTANCE KRİTERLERİ ÖZETİ
-------------------------------------------------------------------------------

- Doc zinciri (PB→PRD→SPEC→STORY→AC/TP) eksiksizdir ve Doc QA gate seti PASS olur.
- Platform capabilities (SPEC-0014) reuse edilir; custom attachment/audit modülü yazılmaz.
- NC→RCA→CAPA→kapanış döngüsü test edilebilir şekilde tanımlanır.

-------------------------------------------------------------------------------
## 7. RİSKLER / BAĞIMLILIKLAR
-------------------------------------------------------------------------------

Riskler:
- Veri kalitesi (duplicate kayıtlar, hatalı sınıflandırma) trend raporlarını bozabilir.
- Sahada kanıt toplama UX’i zayıfsa adoption düşer.

Bağımlılıklar:
- Platform Spec: `docs/03-delivery/SPECS/SPEC-0014-platform-capabilities-catalog-v1.md`

-------------------------------------------------------------------------------
## 8. ÖZET
-------------------------------------------------------------------------------

- MVP, NC & CAPA döngüsünü izlenebilir ve ölçülebilir hale getirir.
- Reuse-first yaklaşımıyla tekrar eden platform bileşenleri yeniden yazılmaz.

-------------------------------------------------------------------------------
## 9. LİNKLER / SONRAKİ ADIMLAR
-------------------------------------------------------------------------------

- PB: `docs/01-product/PROBLEM-BRIEFS/PB-0005-nc-capa-management.md`
- Delivery SPEC: `docs/03-delivery/SPECS/SPEC-0015-nc-capa-contract-v1.md`
