# BM-0002: Uygunsuzluk (NC) & CAPA — Core İşletim Modeli (v0.1)

-------------------------------------------------------------------------------
1. AMAÇ
-------------------------------------------------------------------------------

- Uygunsuzlukları (NC) izlenebilir şekilde kaydetmek, sınıflandırmak ve kök neden analiziyle tekrar oranını azaltmak.
- CAPA aksiyonlarını sahip/süre/verifikasyon ile takip edip “kapanış kalitesi”ni yükseltmek.

-------------------------------------------------------------------------------
2. KAPSAM
-------------------------------------------------------------------------------

- NC Intake (kayıt)
- Triage / sınıflandırma / önceliklendirme
- Kök neden analizi (RCA)
- CAPA aksiyon planı (owner + due date)
- Doğrulama & kapanış
- Trend analizi & iyileştirme backlog’u

Platform Dependencies (Shared Capability First):
- Platform Spec: `docs/03-delivery/SPECS/SPEC-0014-platform-capabilities-catalog-v1.md`
- Case / Work Item Engine
- SLA & Calendar
- Audit Trail & View Log
- Evidence / Attachment
- Notification & Communications
- Search & Reporting

-------------------------------------------------------------------------------
3. KAPSAM DIŞI
-------------------------------------------------------------------------------

- Denetim/sertifikasyon süreçlerinin kurumsal detayı (policy düzeyi).
- ERP/MES gibi sistemlerle entegrasyon (MVP dışı; sonraki faz).

-------------------------------------------------------------------------------
4. İŞLETİM MODELİ
-------------------------------------------------------------------------------

1) NC Intake (kayıt)  
2) Triage / sınıflandırma / önceliklendirme  
3) Kök neden analizi (RCA)  
4) CAPA aksiyon planı (owner + due date)  
5) Doğrulama & kapanış  
6) Trend analizi & iyileştirme backlog’u  

-------------------------------------------------------------------------------
5. KARAR NOKTALARI (ID'Lİ)
-------------------------------------------------------------------------------

- BM-0002-CORE-DEC-001: RCA yöntemi şablonlu ve standardize mi olacak? (Evet.)
- BM-0002-CORE-DEC-002: CAPA due date breach durumunda escalation policy uygulanacak mı? (Evet.)
- BM-0002-CORE-DEC-003: Evidence/ekler için “silinmez + sürümlenir” beklentisi zorunlu mu? (Evet.)

-------------------------------------------------------------------------------
6. GUARDRAIL'LER (ID'Lİ)
-------------------------------------------------------------------------------

- BM-0002-CORE-GRD-001: NC kapanışı “kapandı” değil; doğrulama zorunlu.
- BM-0002-CORE-GRD-002: Kanıt/delil silinmez; erişim ve değişiklikler audit’e düşer.
- BM-0002-CORE-GRD-003: SLA tanımı “iş günü takvimi” semantiği ile netleştirilir (raporlama doğruluğu).
- BM-0002-CORE-GRD-004: RCA şablonu doldurulmadan CAPA kapanışı yapılmaz.

-------------------------------------------------------------------------------
7. VARSAYIMLAR (ID'Lİ)
-------------------------------------------------------------------------------

- BM-0002-CORE-ASM-001: NC sınıflandırma taksonomisi (kategori/severity) işletilebilir şekilde tanımlanacak.
- BM-0002-CORE-ASM-002: CAPA doğrulama adımı için sorumlu rol/ekip tanımlı olacak.

-------------------------------------------------------------------------------
8. DOĞRULAMA PLANI (ID'Lİ)
-------------------------------------------------------------------------------

- BM-0002-CORE-VAL-001: 20 NC örnek seti ile intake → triage → RCA → CAPA → kapanış akışı pilotlanacak.
- BM-0002-CORE-VAL-002: 10 senaryolu due date / escalation testi (iş günü takvimi dahil) çalıştırılacak.

-------------------------------------------------------------------------------
9. TOP 10 SÜRPRİZ ÖNLEYİCİ (ID'Lİ)
-------------------------------------------------------------------------------

- BM-0002-CORE-RSK-001: “Kapanmadan kapatma” → doğrulama zorunlu + audit
- BM-0002-CORE-RSK-002: RCA yüzeyselliği → şablon + kalite kontrol checklist
- BM-0002-CORE-RSK-003: Due date drift → SLA & Calendar tek semantik + regression senaryoları
- BM-0002-CORE-RSK-004: Delil kaybı → versioning + view log

-------------------------------------------------------------------------------
10. LİNKLER
-------------------------------------------------------------------------------

- PB: `docs/01-product/PROBLEM-BRIEFS/PB-0005-nc-capa-management.md`
- PRD: `docs/01-product/PRD/PRD-0005-nc-capa-management-mvp.md`
- Delivery SPEC: `docs/03-delivery/SPECS/SPEC-0015-nc-capa-contract-v1.md`
- Platform Spec: `docs/03-delivery/SPECS/SPEC-0014-platform-capabilities-catalog-v1.md`
