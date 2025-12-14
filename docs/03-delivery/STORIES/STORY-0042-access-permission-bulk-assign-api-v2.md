# STORY-0042 – Access Permission Bulk-Assign API v2

ID: STORY-0042-access-permission-bulk-assign-api-v2  
Epic: QLTY-BE-AUTHZ-SCOPE  
Status: Planned  
Owner: @team/backend  
Upstream: PB-0003-access-permission-bulk-assign, PRD-0003-access-permission-bulk-assign-api-v2  
Downstream: AC-0042, TP-0042

-------------------------------------------------------------------------------
1. AMAÇ
-------------------------------------------------------------------------------

- Access/permission yönetiminde, büyük hacimli kullanıcı veya rol gruplarına
  aynı permission set’ini güvenli, izlenebilir ve geri alınabilir şekilde
  atayabilen “bulk-assign API v2” özelliğini hayata geçirmek.
- Manuel ve dağınık permission atamalarını tek bir backend API kontratı ve
  buna bağlı UI akışı üzerinden standartlaştırmak.

-------------------------------------------------------------------------------
2. TANIM
-------------------------------------------------------------------------------

- Ops mühendisi olarak, tek bir toplu işlemle çok sayıda kullanıcı/role için permission set’i atamak veya geri almak istiyorum; böylece aynı aksiyonu yüzlerce kez tekrarlamak zorunda kalmam.
- Güvenlik/uyum sorumlusu olarak, her toplu permission işleminin `bulk_operation_id` ile kayıt altına alınmasını istiyorum; böylece kime hangi iznin neden verildiğini her zaman açıklayabilirim.

-------------------------------------------------------------------------------
3. KAPSAM VE SINIRLAR
-------------------------------------------------------------------------------

Dahil:
- Yeni REST uçları:
  - `POST /api/v1/permissions/bulk-assign`
  - `POST /api/v1/permissions/bulk-revoke`
- Input modeli:
  - Target türü: `user` / `role` / `group`
  - Target listesi: ID veya external key listesi
  - Permission set’i: permission id / policy id listesi
  - Operation metadata: `reason`, `requestedBy`, `correlationId`
- Çıktı modeli:
  - Toplam başarılı / başarısız kayıt sayısı
  - Hata detayları (geçersiz target, geçersiz permission, validation hataları)
  - `bulk_operation_id` ile audit korelasyonu
- Access UI tarafında temel bir “bulk assign / bulk revoke” akışı.

Hariç:
- Onay/approval workflow’ları (ayrı PRD/Story konusu).
- Permission modelinin temelden değiştirilmesi; mevcut permission registry v1
  üzerine inşa edilir.

-------------------------------------------------------------------------------
4. ACCEPTANCE KRİTERLERİ
-------------------------------------------------------------------------------

- [ ] Given geçerli bir yetkili çağıran (ops rolü) ve geçerli bir target listesi
      vardır, When `bulk-assign` uçlarına istek yapılır, Then en az 100 kullanıcı
      için permission set’i başarıyla atanır ve sonuç DTO’su başarı/başarısız
      adetlerini döndürür.  
- [ ] Given daha önce yapılmış bir bulk-assign işlemi vardır, When aynı payload
      ile işlem tekrarlanır, Then sistem idempotent davranır (çift atama
      yapılmaz; audit log’lar tutarlıdır).  
- [ ] Given geçersiz target veya permission içeren bir istek vardır, When
      `bulk-assign` veya `bulk-revoke` çalıştırılır, Then istek 400 ile döner
      ve ErrorResponse içinde hangi kayıtların sorunlu olduğu açıkça belirtilir.  
- [ ] Given API prod ortamında yayındadır, When tipik bir batch (ör. 100–500
      kullanıcı) için bulk-assign çalıştırılır, Then P95 yanıt süresi PRD-0003’te
      tanımlanan hedefler içinde kalır.  
- [ ] Given audit veya incident review yapılmaktadır, When belirli bir
      `bulk_operation_id` üzerinden kayıtlar incelenir, Then ilgili tüm target
      ve permission değişiklikleri bu ID üzerinden takip edilebilir.  

Detaylı Given/When/Then senaryoları AC-0042 dokümanında yer alacaktır.

-------------------------------------------------------------------------------
5. BAĞIMLILIKLAR
-------------------------------------------------------------------------------

- PB-0003 – Access Permission Bulk-Assign API v2  
- PRD-0003 – Access Permission Bulk-Assign API v2  
- STORY-0019 / AC-0019 / TP-0042 – Permission Registry v1.0  
- STORY-0032 / AC-0032 / TP-0042 – User REST/DTO v1  
- STORY-0033 / AC-0033 / TP-0042 – Auth REST/DTO v1  
- API dokümanı: `docs/03-delivery/api/access-permission-bulk-assign.api.md`  

-------------------------------------------------------------------------------
6. ÖZET
-------------------------------------------------------------------------------

- Access permission bulk-assign işlemleri için merkezi ve izlenebilir bir API
  v2 sözleşmesi tasarlanacak ve uygulanacaktır.
- Operasyon ekipleri çok sayıda kullanıcı/role için permission set’lerini tek
  bir bulk işlemle yönetebilecek, audit ve güvenlik izlenebilirliği artacaktır.
- Başarı, AC-0042 kabul kriterleri ve TP-0042 test senaryolarının geçmesiyle
  ölçülecektir.

-------------------------------------------------------------------------------
7. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- PB: `docs/01-product/PROBLEM-BRIEFS/PB-0003-access-permission-bulk-assign.md`  
- PRD: `docs/01-product/PRD/PRD-0003-access-permission-bulk-assign-api-v2.md`  
- Acceptance: `docs/03-delivery/ACCEPTANCE/AC-0042-access-permission-bulk-assign-api-v2.md`  
- Test Plan: `docs/03-delivery/TEST-PLANS/TP-0042-access-permission-bulk-assign-api-v2.md`  
- API Sözleşmesi: `docs/03-delivery/api/access-permission-bulk-assign.api.md`  
