# BM-0002: Uygunsuzluk (NC) & CAPA — Core İşletim Modeli (v0.1)

## Amaç
- Uygunsuzlukları (NC) izlenebilir şekilde kaydetmek, sınıflandırmak ve kök neden analiziyle tekrar oranını azaltmak.
- CAPA aksiyonlarını sahip/süre/verifikasyon ile takip edip “kapanış kalitesi”ni yükseltmek.

## İşletim Akışı
1) NC Intake (kayıt)
2) Triage / sınıflandırma / önceliklendirme
3) Kök neden analizi (RCA)
4) CAPA aksiyon planı (owner + due date)
5) Doğrulama & kapanış
6) Trend analizi & iyileştirme backlog’u

## Guardrail’ler (v0.1)
- NC kapanışı “kapandı” değil; doğrulama zorunlu.
- Kanıt/delil silinmez; erişim ve değişiklikler audit’e düşer.
- SLA tanımı “iş günü takvimi” semantiği ile netleştirilir (raporlama doğruluğu).

## Platform Dependencies (Shared Capability First)
- Platform Spec: `SPEC-0014`
- Case / Work Item Engine
- SLA & Calendar
- Audit Trail & View Log
- Evidence / Attachment
- Notification & Communications
- Search & Reporting

