# BM-0003: Fleet Operations Management — Core İşletim Modeli (v0.1)

-------------------------------------------------------------------------------
1. AMAÇ
-------------------------------------------------------------------------------

Filo operasyonu “araç listesi” değil; **uyum (compliance) + maliyet + süreklilik** yönetim sistemidir.

- Araç kayıt, bakım, muayene, sigorta, trafik cezası ve yakıt süreçlerini tek zincirde izlenebilir kılmak.
- Uyum riskini (muayene/sigorta süresi dolması vb.) erken yakalayıp bildirim + raporlama ile önlemek.

-------------------------------------------------------------------------------
2. KAPSAM
-------------------------------------------------------------------------------

- Araç kayıt (kimlik, durum, sahiplik/bağlılık, dokümanlar)
- Bakım planı ve bakım kayıtları (planlı/plansız)
- Muayene ve sigorta geçerlilik takibi (tarih/süre)
- Trafik cezası kaydı ve yaşam döngüsü (kayıt → doğrulama → ödeme/itiraz → kapanış)
- Yakıt işlemleri (fiş/kart işlemi) ve basit tüketim raporlama
- Arama/filtreleme ve temel raporlama

-------------------------------------------------------------------------------
3. KAPSAM DIŞI
-------------------------------------------------------------------------------

- Telematics/IoT cihaz yönetimi ve canlı takip
- Otomatik ceza/itiraz kararı (insan onayı olmadan)
- “Tam muhasebe” entegrasyonu (ERP muhasebe fişi üretimi)

-------------------------------------------------------------------------------
4. İŞLETİM MODELİ
-------------------------------------------------------------------------------

İşletim akışı (referans):
1) Araç Onboarding (kayıt + doküman)  
2) Operasyon Takibi (durum, kilometre, atama)  
3) Bakım Planlama ve Yürütme  
4) Uyum Takibi (muayene/sigorta)  
5) Ceza Yönetimi (kayıt → doğrulama → ödeme/itiraz)  
6) Yakıt Takibi (işlem → doğrulama → anomali)  
7) Raporlama & İyileştirme Backlog’u  

Platform Dependencies (Shared Capability First):
- Platform Spec: `docs/03-delivery/SPECS/SPEC-0014-platform-capabilities-catalog-v1.md`
- Case / Work Item Engine
- SLA & Calendar
- Audit Trail & View Log
- Evidence / Attachment
- Notification & Communications
- Search & Reporting

-------------------------------------------------------------------------------
5. KARAR NOKTALARI (ID'Lİ)
-------------------------------------------------------------------------------

- BM-0003-CORE-DEC-001: Tekil araç kimliği VIN + plaka geçmişi ile yönetilecek mi? (Evet; plaka değişimi “history” olarak tutulur.)
- BM-0003-CORE-DEC-002: Araç kaydı hem manuel hem de toplu içe aktarma ile desteklenecek mi? (Evet; entegrasyonlar sonraki iterasyonda.)
- BM-0003-CORE-DEC-003: Uyum takibi (muayene/sigorta) için takvim semantiği tek SSOT olacak mı? (Evet; timezone + takvim kuralları `SLA & Calendar` üzerinden.)
- BM-0003-CORE-DEC-004: Kritik dokümanlar (ruhsat/sigorta/muayene) “silinmez, sürümlenir” kuralı ile mi yönetilecek? (Evet; kanıt/evidence yaklaşımı.)
- BM-0003-CORE-DEC-005: Bakım/ceza/uyum işleri ortak “work item” yaklaşımı ile state machine üzerinden mi izlenecek? (Evet; shared capability reuse.)

-------------------------------------------------------------------------------
6. GUARDRAIL'LER (ID'Lİ)
-------------------------------------------------------------------------------

- BM-0003-CORE-GRD-001: Araç kaydı silinmez; yalnızca durum (active/inactive/sold) ile kapatılır.
- BM-0003-CORE-GRD-002: Uyum dokümanları silinmez; yeni sürüm eklenir (immutability beklentisi).
- BM-0003-CORE-GRD-003: Due-date hesapları “string tarih” ile yapılmaz; timezone zorunludur.
- BM-0003-CORE-GRD-004: Bildirim için domain içi SMTP/SMS yazılmaz; `Notification & Communications` capability kullanılır.
- BM-0003-CORE-GRD-005: Kilometre/odometre değeri geriye düşürülemez; istisna için gerekçe + audit zorunludur.

-------------------------------------------------------------------------------
7. VARSAYIMLAR (ID'Lİ)
-------------------------------------------------------------------------------

- BM-0003-CORE-ASM-001: Yakıt verisi için en az bir kaynak mevcut (yakıt kartı veya fiş/manuel giriş).
- BM-0003-CORE-ASM-002: Trafik cezası kaydı için başlangıçta manuel giriş kabul edilebilir; entegrasyon opsiyoneldir.
- BM-0003-CORE-ASM-003: Muayene/sigorta bitiş tarihleri, doküman veya kayıt üzerinden doğrulanabilir.
- BM-0003-CORE-ASM-004: Raporlama ihtiyacı (maliyet/uyum) iş birimi tarafından net KPI seti ile desteklenecek.

-------------------------------------------------------------------------------
8. DOĞRULAMA PLANI (ID'Lİ)
-------------------------------------------------------------------------------

- BM-0003-CORE-VAL-001: 50 araçlık pilot: onboarding + doküman yükleme + arama/filtreleme doğrulaması.
- BM-0003-CORE-VAL-002: 6 haftalık “due-date” testi: muayene/sigorta hatırlatmaları + gecikme raporu.
- BM-0003-CORE-VAL-003: 20 senaryolu veri kalitesi testi: duplicate araç, plaka değişimi, odometre hatası.
- BM-0003-CORE-VAL-004: Audit örneklemi: kritik alan değişikliklerinin (plaka/durum/doküman) izlenebilirliği.

-------------------------------------------------------------------------------
9. TOP 10 SÜRPRİZ ÖNLEYİCİ (ID'Lİ)
-------------------------------------------------------------------------------

- BM-0003-CORE-RSK-001: Duplicate araç kaydı (VIN/plaka) → dedup kuralı + idempotency anahtarı
- BM-0003-CORE-RSK-002: Süresi dolan sigorta/muayene → erken uyarı + escalation politikası
- BM-0003-CORE-RSK-003: Eksik/yanlış doküman → “doküman tamlık skoru” + zorunlu alanlar
- BM-0003-CORE-RSK-004: Odometre hatası/suistimali → monotonic kural + istisna audit
- BM-0003-CORE-RSK-005: Yakıt suistimali/anomali → anomali sinyali + inceleme işi
- BM-0003-CORE-RSK-006: Entegrasyon drift (ceza/yakıt) → “source of truth” etiketi + reconcile raporu
- BM-0003-CORE-RSK-007: Yanlış takvim/timezone → tek semantik + regression senaryoları
- BM-0003-CORE-RSK-008: Yetkisiz durum değişikliği (satış/iptal) → RBAC + audit + (gerekirse) onay akışı
- BM-0003-CORE-RSK-009: Veri sınıfı/PII belirsizliği → veri sınıfları + maskeleme politikası
- BM-0003-CORE-RSK-010: Rapor tutarsızlığı (maliyet/kapanış) → rapor sözleşmesi + test dataset’i

-------------------------------------------------------------------------------
10. LİNKLER
-------------------------------------------------------------------------------

- PB: `docs/01-product/PROBLEM-BRIEFS/PB-0006-fleet-operations-management.md`
- PRD: `docs/01-product/PRD/PRD-0006-fleet-operations-management-mvp.md`
- BENCH Pack: `docs/01-product/BENCHMARKS/FLEET/`
- TRACE: `docs/03-delivery/TRACES/TRACE-0002-fleet-operations-bm-to-delivery.tsv`
- Delivery SPEC: `docs/03-delivery/SPECS/SPEC-0016-fleet-operations-management-contract-v1.md`
- Platform Spec: `docs/03-delivery/SPECS/SPEC-0014-platform-capabilities-catalog-v1.md`
