# BENCH-0001: Etik Sistemleri — Trendler, Boşluklar, AI Yapılabilirlik (v0.1)

-------------------------------------------------------------------------------
1. AMAÇ
-------------------------------------------------------------------------------

Sektörün gittiği yönü ve “biz neyi farklı/iyi yapacağız?” fırsatlarını çıkarmak.

-------------------------------------------------------------------------------
2. KAPSAM
-------------------------------------------------------------------------------

- Bu doküman BENCH pack’in “trend/gap/AI” kısmıdır.
- Capability matrix + kanıt standardı ayrı dokümanda tutulur.

-------------------------------------------------------------------------------
3. CAPABILITY MATRIX (KANIT STANDARDI)
-------------------------------------------------------------------------------

Capability matrix ve kanıt standardı burada SSOT’tur:
- `docs/01-product/BENCHMARKS/ETHICS/BENCH-0001-ethics-capability-matrix.md`

-------------------------------------------------------------------------------
4. TRENDLER
-------------------------------------------------------------------------------

- Hotline → program işletim sistemi (Ethics OS)
- Kapanış hızı → kapanış kalitesi ve tekrar azaltma
- Platformlaşma (uyum/risk/privacy ile daha entegre)

-------------------------------------------------------------------------------
5. BOŞLUKLAR (GAPS)
-------------------------------------------------------------------------------

- COI yönetimi kağıt üzerinde kalması
- Misilleme korumasının süreç olarak işletilmemesi
- Kapanış kalite kontrolünün zayıf olması
- Kanıt/delil disiplininin zayıf olması

-------------------------------------------------------------------------------
6. AI YAPILABİLİRLİK + RİSK KONTROLLERİ
-------------------------------------------------------------------------------

AI Yapılabilirlik (Asistan Rolü):

Uygun:
- Özetleme, kategori önerisi, benzer vaka eşleştirme
- PII redaksiyon (kontrollü)
- Çok dilli destek

Riskli / Yasak:
- Suçlama/niyet okuma
- Yaptırım önerisi
- İnsan onayı olmadan karar

Guardrail Önerileri:
- Human-in-the-loop zorunlu
- AI çıktısı “öneri” olarak etiketlenir ve audit’e düşer

AI Risk Kontrolleri (Minimum Set):
- Veri sınıfı sınırı: hangi veri AI’ye asla gitmez (PII/özel nitelikli vb.)
- Human-in-the-loop: karar/sonuç insan onayı olmadan ilerlemez
- Açıklanabilirlik: AI önerisi “neden/ipuçları” ile sunulur
- Audit: AI önerileri loglanır, versiyon/model bilgisi kaydedilir
- Redaksiyon: PII maskesi / güvenli özetleme

-------------------------------------------------------------------------------
7. LİNKLER / KAYNAKLAR
-------------------------------------------------------------------------------

- BENCH Pack (matrix): `docs/01-product/BENCHMARKS/ETHICS/BENCH-0001-ethics-capability-matrix.md`
- BM Pack: `docs/01-product/BUSINESS-MASTERS/ETHICS/`
- PRD: `docs/01-product/PRD/PRD-0004-ethics-speakup-and-case-management-mvp.md`
