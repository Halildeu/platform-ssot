# BENCH-0002: Fleet Operations Management — Trendler, Boşluklar, AI Yapılabilirlik (v0.1)

-------------------------------------------------------------------------------
1. AMAÇ
-------------------------------------------------------------------------------

Sektör trendlerini, tipik boşlukları ve AI’nin “asistan rolü” olarak nerede değer üretebileceğini çıkarmak.

-------------------------------------------------------------------------------
2. KAPSAM
-------------------------------------------------------------------------------

- Bu doküman BENCH pack’in “trend/gap/AI” kısmıdır.
- Capability matrix + kanıt standardı ayrı dokümanda tutulur.

-------------------------------------------------------------------------------
3. CAPABILITY MATRIX (KANIT STANDARDI)
-------------------------------------------------------------------------------

Capability matrix ve kanıt standardı burada SSOT’tur:
- `docs/01-product/BENCHMARKS/FLEET/BENCH-0002-fleet-operations-capability-matrix.md`

-------------------------------------------------------------------------------
4. TRENDLER
-------------------------------------------------------------------------------

- “Araç listesi” → “uyum + maliyet + süreklilik” odaklı operasyon yönetimi
- Elektrifikasyon ile yeni KPI’lar (şarj, batarya sağlığı, enerji maliyeti)
- Telematics + tüketim/anomali gözlemi (yakıt/rota/odometre)
- Doküman otomasyonu (OCR) ve denetim izi beklentisinin artması

-------------------------------------------------------------------------------
5. BOŞLUKLAR (GAPS)
-------------------------------------------------------------------------------

- Kimlik/duplicasyon: VIN/plaka belirsizliği ve history yönetiminin zayıflığı
- Takvim semantiği: timezone/iş günü/hatırlatma kurallarının tutarsız olması
- Doküman disiplini: sigorta/muayene dokümanlarının sürümsüz ve izsiz kalması
- Yakıt verisi kalitesi: manuel giriş, reconcile eksikliği ve fraud sinyalinin olmaması
- Ceza yönetimi: doğrulama/itiraz sürecinin dağınık olması

-------------------------------------------------------------------------------
6. AI YAPILABİLİRLİK + RİSK KONTROLLERİ
-------------------------------------------------------------------------------

AI Yapılabilirlik (Asistan Rolü):

Uygun:
- Doküman OCR: sigorta poliçesi / muayene raporu alanlarını çıkarma (kontrollü)
- Anomali tespiti: yakıt tüketim spike ve tutarsız odometre sinyali
- Özetleme: bakım/ceza kayıtlarının kısa özetlenmesi (policy ile)

Riskli / Yasak:
- İnsan onayı olmadan ceza/itiraz kararı üretimi
- PII içeren serbest metin üretimi veya rapor dışa aktarımı

Guardrail Önerileri (Minimum):
- Human-in-the-loop: karar/aksiyon otomasyonu yok; yalnız öneri.
- Audit: AI önerileri ve kullanılan veri sınıfları loglanır.
- Redaksiyon: PII maskeleme; policy allowlist dışında veri AI’ye gitmez.

-------------------------------------------------------------------------------
7. LİNKLER / KAYNAKLAR
-------------------------------------------------------------------------------

- BENCH Pack (matrix): `docs/01-product/BENCHMARKS/FLEET/BENCH-0002-fleet-operations-capability-matrix.md`
- BM Pack: `docs/01-product/BUSINESS-MASTERS/FLEET/`
- PRD: `docs/01-product/PRD/PRD-0006-fleet-operations-management-mvp.md`
