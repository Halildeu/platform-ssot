# BENCH-0003: NC/CAPA — Trendler, Boşluklar, AI Yapılabilirlik (v0.1)

1. AMAÇ
NC/CAPA alanında sektörün gittiği yönü ve “biz neyi daha iyi yapacağız?” fırsatlarını çıkarmak.

2. KAPSAM
- NC→RCA→CAPA döngüsü
- SLA/eskalasyon
- Audit/evidence
- Raporlama (tekrar/trend)

3. CAPABILITY MATRIX (KANIT STANDARDI)
Bkz: `BENCH-0003-nc-capa-capability-matrix.md`.

4. TRENDLER
- Kapanış hızı → kapanış kalitesi ve tekrar azaltma
- Evidence/audit’in “denetim izi” değil “işletim sinyali” olarak ele alınması
- Ortak yeteneklerin (SLA/Audit/Evidence/Reporting) platform modülleri olarak ürünleşmesi

5. BOŞLUKLAR (GAPS)
- RCA çıktılarının standardize olmaması
- CAPA doğrulama adımının “kağıt üstü” kalması
- Trend analizi → aksiyon backlog’una bağlanmaması

6. AI YAPILABİLİRLİK + RİSK KONTROLLERİ
- Uygun:
  - sınıflandırma önerisi (kategori/kök neden)
  - benzer vaka önerisi
  - aksiyon taslağı (insan onaylı)
- Yasak:
  - otomatik sorumluluk/suç isnadı
  - otomatik yaptırım önerisi
- Kontroller (minimum):
  - Human-in-the-loop zorunlu
  - Veri sınıfı sınırı (PII/redaction)
  - Audit: AI önerileri loglanır (model/version)

7. LİNKLER / KAYNAKLAR
- `BENCH-0003-nc-capa-capability-matrix.md`
- BM-0002 / PRD-0005 / SPEC-0015
