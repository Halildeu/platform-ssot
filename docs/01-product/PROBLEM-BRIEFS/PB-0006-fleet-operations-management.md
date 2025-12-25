# PB-0006: Fleet Operations Management — Problem Brief

ID: PB-0006
Status: Draft
Owner: TBD

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- Filo operasyonunun (araç kayıt, bakım, muayene, sigorta, trafik cezası, yakıt) tek zincirde izlenebilir yönetilmesini sağlamak.

-------------------------------------------------------------------------------
## 2. KAPSAM
-------------------------------------------------------------------------------

- Araç kaydı ve dokümanları (ruhsat/sigorta/muayene)
- Bakım planı + bakım kayıtları
- Trafik cezası kaydı ve kapanış takibi (ödeme/itiraz)
- Yakıt işlemleri ve temel tüketim raporlama
- Bildirim ve raporlama (platform capability reuse)

-------------------------------------------------------------------------------
## 3. SORUN TANIMI
-------------------------------------------------------------------------------

- Mevcut durumda bilgiler farklı araçlarda (Excel/e-posta/manuel takip) dağınık.
- Süresi dolan sigorta/muayene “erken uyarı” olmadan yakalanıyor → uyum riski ve operasyon kesintisi.
- Bakım ve ceza maliyetleri tek görünümde izlenemiyor → maliyet optimizasyonu zayıf.
- Denetim izi/audit olmadığı için “kim neyi ne zaman değiştirdi?” sorusu cevapsız kalıyor.

-------------------------------------------------------------------------------
## 4. HEDEF VE BAŞARI KRİTERLERİ
-------------------------------------------------------------------------------

- Uyum: süresi dolan sigorta/muayene sayısı ve gecikme oranı ölçülebilir şekilde düşer.
- Operasyon: bakım gecikme oranı (overdue) ve kapanış süresi (p50/p95) iyileşir.
- Maliyet: yakıt ve ceza maliyetleri aylık raporlanır; anomali sinyalleri görülebilir olur.
- İzlenebilirlik: kritik alan değişiklikleri audit trail ile takip edilir.

-------------------------------------------------------------------------------
## 5. VARSAYIMLAR / RİSKLER
-------------------------------------------------------------------------------

- Varsayım: Yakıt ve ceza verisi için en az bir giriş yolu (manuel veya entegrasyon) vardır.
- Risk: Veri kalitesi (duplicate araç, yanlış tarih/timezone, odometre hatası) raporları bozabilir.
- Risk: “Platform capability reuse” ihlal edilirse (custom bildirim/audit), bakım maliyeti artar.

-------------------------------------------------------------------------------
## 6. ÖZET
-------------------------------------------------------------------------------

- Hedef: filo operasyonu için uyum + maliyet + izlenebilirlik zinciri kurmak.
- Kural: shared capability first (`SPEC-0014`) ile bildirim/audit/evidence/reporting yeniden yazılmaz.

-------------------------------------------------------------------------------
## 7. LİNKLER / SONRAKİ ADIMLAR
-------------------------------------------------------------------------------

- PRD: `docs/01-product/PRD/PRD-0006-fleet-operations-management-mvp.md`
- BM Pack: `docs/01-product/BUSINESS-MASTERS/FLEET/`
- BENCH Pack: `docs/01-product/BENCHMARKS/FLEET/`

