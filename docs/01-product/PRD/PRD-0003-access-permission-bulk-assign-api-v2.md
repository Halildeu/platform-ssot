# PRD-0003 – Access Permission Bulk-Assign API v2

ID: PRD-0003-access-permission-bulk-assign-api-v2

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

Access/permission yönetiminde, aynı permission set’ini çok sayıda kullanıcıya veya role’e hızlı, güvenli ve izlenebilir şekilde atamak için “bulk-assign API v2” gereksinimlerini tanımlamak.

Hedefler:
- Operasyon ekipleri için permission bulk-assign işlemlerini hızlandırmak.
- Hata riskini (yanlış kullanıcı/permission) azaltmak ve audit izlenebilirliğini artırmak.
- FE Access UI ve backend permission-service için ortak bir bulk-assign kontratı oluşturmak.

-------------------------------------------------------------------------------
## 2. KAPSAM
-------------------------------------------------------------------------------

Dahil:
- Yeni REST API uçları:
  - `POST /api/v1/permissions/bulk-assign`
  - `POST /api/v1/permissions/bulk-revoke`
- Input modeli (MVP):
  - Target türü: user / role / group
  - Target listesi: ID veya external key listesi
  - Permission set: permission id veya policy id listesi
  - Operation metadata: reason, requested_by, correlationId vb.
- Output modeli:
  - Toplam başarılı/başarısız kayıt sayısı
  - Hata detayları (validasyon, bulunamayan kullanıcı/permission)
  - `bulk_operation_id` ile audit log ve UI’da izlenebilirlik
- Access UI entegrasyonu:
  - Basit bir bulk-assign ekranı veya mevcut grid’lerde “bulk action” davranışları

-------------------------------------------------------------------------------
## 3. KULLANICI SENARYOLARI
-------------------------------------------------------------------------------

- Senaryo 1: Operasyon kullanıcısı 100 kullanıcıya aynı permission set’ini tek işlemde atar.
- Senaryo 2: Operasyon kullanıcısı toplu revoke yapar ve “başarılı/başarısız” özetini görür.
- Senaryo 3: Denetçi, `bulk_operation_id` üzerinden hangi kullanıcıların etkilendiğini görür.

-------------------------------------------------------------------------------
## 4. DAVRANIŞ / GEREKSİNİMLER
-------------------------------------------------------------------------------

Fonksiyonel:
- Request validation: target listesi boş olamaz; permission set boş olamaz.
- Idempotency: aynı payload tekrarlandığında double-assign oluşmaz (idempotent davranış).
- Partial success: bazı target’lar başarısızsa sonuçta detaylı hata listesi dönülür.
- Audit: her bulk işlem tekil `bulk_operation_id` ile audit log’a düşer; actor + reason kaydedilir.

Non-functional (business-level):
- Performans: bir toplu işlemde en az 100 kullanıcı için P95 yanıt süresi ≤ 1 sn (makul batch boyutu).
- Güvenilirlik: retry/backoff stratejisi ve rate limit davranışı tanımlı olmalı.

-------------------------------------------------------------------------------
## 5. NON-GOALS (KAPSAM DIŞI)
-------------------------------------------------------------------------------

- Tam kapsamlı workflow engine veya onay/approval süreçleri (ayrı PRD).
- Permission modelinin temelden değiştirilmesi (mevcut model üzerine inşa edilir).

-------------------------------------------------------------------------------
## 6. ACCEPTANCE KRİTERLERİ ÖZETİ
-------------------------------------------------------------------------------

- Bulk-assign ve bulk-revoke uçları PRD’de tanımlanan input/output kontratına uygun çalışır.
- Audit log’larda her bulk işlem tekil bir `bulk_operation_id` ile izlenebilir.
- Access UI, yeni API’yi kullanarak bulk assign akışını destekler.

-------------------------------------------------------------------------------
## 7. RİSKLER / BAĞIMLILIKLAR
-------------------------------------------------------------------------------

Bağımlılıklar:
- PB-0003 – Access Permission Bulk-Assign API v2 Problem Brief.
- Mevcut permission-service REST/DTO v1 dokümanları (STORY-0032 / AC-0032).
- Permission registry v1 Story zinciri (STORY-0019 / AC-0019 / TP-0101).

Riskler:
- Büyük batch’ler için performans ve resource kullanımı; gerekirse job/polling modeli düşünülmelidir.
- UI tarafında yeterli geri bildirim verilmezse “işlem bitti mi?” karmaşası yaşanabilir.

-------------------------------------------------------------------------------
## 8. ÖZET
-------------------------------------------------------------------------------

- Bu PRD, Access permission bulk-assign API v2 için ürün gereksinimlerini tanımlar.
- Teknik tasarım, story/acceptance ve test planları bu dokümana dayanır.

-------------------------------------------------------------------------------
## 9. LİNKLER / SONRAKİ ADIMLAR
-------------------------------------------------------------------------------

- PB: `docs/01-product/PROBLEM-BRIEFS/PB-0003-access-permission-bulk-assign.md`
- Story: `docs/03-delivery/STORIES/STORY-0042-access-permission-bulk-assign-api-v2.md`
- Acceptance: `docs/03-delivery/ACCEPTANCE/AC-0042-access-permission-bulk-assign-api-v2.md`
- Test Plan: `docs/03-delivery/TEST-PLANS/TP-0042-access-permission-bulk-assign-api-v2.md`
