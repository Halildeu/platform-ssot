# SPEC-0015: NC & CAPA Contract v1 (MVP)

## 1. AMAÇ
PRD-0005 kapsamındaki NC kayıtları ve CAPA döngüsü için “uygulanabilir kontrat” seviyesinde ortak beklentileri tanımlamak.

## 2. KAPSAM

- NC kaydı + RCA + CAPA akışı için business-level kontrat ve minimum alanlar.
- Kapsam dışı: implementasyon adımları (STORY/Tech-Design) ve test senaryoları (AC/TP).

## 3. KONTRAT (SSOT)

### Kaynaklar
- PB: `PB-0005`
- PRD: `PRD-0005`
- Platform Spec: `SPEC-0014`

### Platform Dependencies (Zorunlu)
- Platform Spec: `SPEC-0014`
- Case / Work Item Engine
- SLA & Calendar
- Audit Trail & View Log
- Evidence / Attachment
- Notification & Communications
- Search & Reporting

### Domain Kontrat (MVP)
- NC kaydı: kategori, şiddet, lokasyon/proje, açıklama
- Kanıt: ek/delil metadata + erişim izleri
- RCA: yöntem + çıktı (minimum şablon)
- CAPA: aksiyonlar, sorumlu, due date, doğrulama, kapanış

## 4. GOVERNANCE (DEĞİŞİKLİK POLİTİKASI)

- Breaking kontrat değişiklikleri yeni SPEC versiyonu ile yapılır.

## 5. LİNKLER

- PRD: `docs/01-product/PRD/PRD-0005-nc-capa-management-mvp.md`
