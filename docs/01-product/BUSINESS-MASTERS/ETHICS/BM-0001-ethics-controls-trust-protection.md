# BM-0001: Etik Programı — Controls (Güven, Tarafsızlık, Koruma) (v0.1)

-------------------------------------------------------------------------------
1. AMAÇ
-------------------------------------------------------------------------------

Programın güvenilirliğini belirleyen kontrol mekanizmalarını tanımlamak.

-------------------------------------------------------------------------------
2. KAPSAM
-------------------------------------------------------------------------------

- Gizlilik ve anonimlik kontrol seti
- COI (çıkar çatışması) yönetimi
- Delil/evidence disiplini + audit trail + view log beklentisi
- Misilleme koruması süreci
- Veri yaşam döngüsü (retention/legal hold/redaksiyon) policy hooks

-------------------------------------------------------------------------------
3. KAPSAM DIŞI
-------------------------------------------------------------------------------

- KVKK/retention değerlerinin sayısal tarifleri (policy ayrı SSOT’ta netleşir).
- Teknik implementasyon detayları (ADR/SPEC seviyesinde türetilir).

-------------------------------------------------------------------------------
4. İŞLETİM MODELİ
-------------------------------------------------------------------------------

Kontroller, vaka yaşam döngüsünün tüm adımlarında birlikte işler (intake → triage → inceleme → karar → kapanış):

- Gizlilik/anonimlik: kimlik yönetimi ve güvenli iki yönlü iletişim (case mailbox).
- COI: sinyal varsa erişim duvarı + bağımsız yeniden atama.
- Evidence/Audit: silinmez/sürümlenir delil + kim-ne-zaman logları (write audit + view log).
- Misilleme: kapanış sonrası check-in takibi ve gerektiğinde yeni vaka açılışı.
- Veri yaşam döngüsü: retention/legal hold ve raporlama çıktılarında redaksiyon.

-------------------------------------------------------------------------------
5. KARAR NOKTALARI (ID'Lİ)
-------------------------------------------------------------------------------

- BM-0001-CTRL-DEC-001: COI kontrolü zorunlu (evet).
- BM-0001-CTRL-DEC-002: Anonim bildirimi kabul ediyor muyuz?
- BM-0001-CTRL-DEC-003: Gizli kimlik yönetimi nasıl? (kimler görebilir, hangi şartta)

-------------------------------------------------------------------------------
6. GUARDRAIL'LER (ID'Lİ)
-------------------------------------------------------------------------------

- BM-0001-CTRL-GRD-001: COI sinyali varsa otomatik erişim engeli + bağımsız yeniden atama.
- BM-0001-CTRL-GRD-002: Komite üyeleri dahil “ilgili kişi” erişemez.
- BM-0001-CTRL-GRD-003: Delil/ekler silinmez; yeni sürüm eklenir (immutability beklentisi).
- BM-0001-CTRL-GRD-004: Kim, neyi, ne zaman görüntüledi/değiştirdi kayıt altındadır.
- BM-0001-CTRL-GRD-005: Kapanış sonrası 30/60/90 gün kontrol (risk bazlı)
- BM-0001-CTRL-GRD-006: Misilleme iddiası ayrı vaka tipi olarak açılır
- BM-0001-CTRL-GRD-007: Kimlik bilgisi “varsayılan gizli”; yalnız rol bazlı ve gerekçeli erişim.
- BM-0001-CTRL-GRD-008: Anonim vakalarda güvenli iki yönlü iletişim (case mailbox) varsa, kimlik açığa çıkarmadan konuşma sürer.
- BM-0001-CTRL-GRD-009: Saklama süreleri (retention) ve legal hold yaklaşımı policy ile yönetilir.
- BM-0001-CTRL-GRD-010: Raporlama/eğitim çıktılarında PII maskeleme/redaksiyon policy ile uygulanır.

-------------------------------------------------------------------------------
7. VARSAYIMLAR (ID'Lİ)
-------------------------------------------------------------------------------

- BM-0001-CTRL-ASM-001: KVKK/yerel mevzuat çerçevesi netleştirilecek.
- BM-0001-CTRL-ASM-002: Case mailbox / güvenli iki yönlü iletişim kanalı işletilecek.

-------------------------------------------------------------------------------
8. DOĞRULAMA PLANI (ID'Lİ)
-------------------------------------------------------------------------------

- BM-0001-CTRL-VAL-001: Pilot sırasında “erişim testi” yapılacak (need-to-know + COI duvarı).
- BM-0001-CTRL-VAL-002: Pilot sırasında “audit/view log” örneklemi alınacak ve doğrulanacak.
- BM-0001-CTRL-VAL-003: Retention/redaksiyon policy senaryoları ile rapor çıktıları kontrol edilecek.

-------------------------------------------------------------------------------
9. TOP 10 SÜRPRİZ ÖNLEYİCİ (ID'Lİ)
-------------------------------------------------------------------------------

- BM-0001-CTRL-RSK-001: COI sinyali kaçırma → bağımsız yeniden atama + audit uyarısı
- BM-0001-CTRL-RSK-002: Yanlış görünürlük (need-to-know ihlali) → rol/policy test seti + view log izlemesi
- BM-0001-CTRL-RSK-003: Delil silme/overwrite → sürümleme + immutable log beklentisi
- BM-0001-CTRL-RSK-004: Retention belirsizliği → policy SSOT + per-ülke takvim/süre seti

-------------------------------------------------------------------------------
10. LİNKLER
-------------------------------------------------------------------------------

- PB: `docs/01-product/PROBLEM-BRIEFS/PB-0004-ethics-speakup-and-case-management.md`
- PRD: `docs/01-product/PRD/PRD-0004-ethics-speakup-and-case-management-mvp.md`
- BM Core: `docs/01-product/BUSINESS-MASTERS/ETHICS/BM-0001-ethics-core-operating-model.md`
- BENCH Pack: `docs/01-product/BENCHMARKS/ETHICS/`
- TRACE: `docs/03-delivery/TRACES/TRACE-0001-ethics-bm-to-delivery.tsv`
- Delivery SPEC: `docs/03-delivery/SPECS/SPEC-0013-ethics-case-management-contract-v1.md`
- Platform Spec: `docs/03-delivery/SPECS/SPEC-0014-platform-capabilities-catalog-v1.md`
