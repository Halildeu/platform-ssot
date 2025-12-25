# BM-0003: Fleet Operations Management — Metrics & Reporting (v0.1)

## Amaç
Operasyonun uyum ve maliyet performansını ölçmek ve sürekli iyileştirme döngüsünü kurmak.

## KPI/KRI Seti (Minimum)
- BM-0003-MET-KPI-001: Aktif araç sayısı (durum bazlı)
- BM-0003-MET-KPI-002: 30 gün içinde süresi dolacak sigorta sayısı/oranı
- BM-0003-MET-KPI-003: 30 gün içinde süresi dolacak muayene sayısı/oranı
- BM-0003-MET-KPI-004: Bakım gecikme oranı (overdue)
- BM-0003-MET-KPI-005: Ortalama bakım kapanış süresi (p50/p95)
- BM-0003-MET-KPI-006: Yakıt tüketimi (L/100km) — araç ve filo bazlı
- BM-0003-MET-KPI-007: Yakıt anomali oranı (beklenen dışı tüketim/spike)
- BM-0003-MET-KPI-008: Trafik cezası maliyeti (aylık) + kapanış süresi
- BM-0003-MET-KPI-009: Doküman tamlık oranı (ruhsat/sigorta/muayene)
- BM-0003-MET-KPI-010: Bildirim teslim başarısızlık oranı (kanal bazlı)

## Guardrail
- Metrikler “suçlama” için değil; uyum, maliyet ve süreç iyileştirme için kullanılır.
- Tek metrik optimize edilmez; hız yanında kalite ve uyum sinyalleri birlikte izlenir.

## Platform Dependencies (Shared Capability First)
- Platform Spec: `SPEC-0014`
- Search & Reporting
- Notification & Communications (delivery metrics)

