# AC-0042 – Access Permission Bulk-Assign API v2 Acceptance

ID: AC-0042  
Story: STORY-0042-access-permission-bulk-assign-api-v2  
Status: Planned  
Owner: @team/backend

## 1. AMAÇ

- Access permission bulk-assign API v2’nin PRD-0003 gereksinimlerini ve
  STORY-0042 kapsamını karşıladığını test edilebilir Given/When/Then
  senaryolarıyla doğrulamak.

## 2. KAPSAM

- `POST /api/v1/permissions/bulk-assign`
- `POST /api/v1/permissions/bulk-revoke`
- Audit log ve `bulk_operation_id` ile ilişkilendirme.
- Permission registry v1 ve User/Auth REST/DTO v1 ile entegrasyon davranışı.

## 3. GIVEN / WHEN / THEN SENARYOLARI

- [ ] Senaryo 1 – Başarılı bulk-assign:
  - Given: Geçerli JWT ile yetkili bir ops kullanıcısı ve var olan user/role
    ID’lerinden oluşan bir target listesi vardır.  
    When: `POST /api/v1/permissions/bulk-assign` uçuna geçerli bir istek
    gönderilir.  
    Then: API 200 OK döner, response içindeki özet alanlarda toplam
    başarılı/başarısız kayıt sayıları listelenir ve en az 100 kayıt için
    atama başarıyla gerçekleşir.  

- [ ] Senaryo 2 – Başarılı bulk-revoke:
  - Given: Daha önce bulk-assign ile atanmış permission set’leri vardır.  
    When: `POST /api/v1/permissions/bulk-revoke` uçuna geçerli bir istek
    gönderilir.  
    Then: API 200 OK döner ve ilgili kullanıcı/rollerden söz konusu
    permission set’i kaldırılır; audit logları güncellenir.  

- [ ] Senaryo 3 – İdempotent davranış:
  - Given: Aynı payload ile daha önce başarılı bir bulk-assign işlemi
    gerçekleştirilmiştir.  
    When: Aynı payload ile tekrar bulk-assign isteği yapılır.  
    Then: API idempotent davranır; ikinci istekte ek atama yapılmaz ve
    response içinde bu durum açıkça belirtilir.  

- [ ] Senaryo 4 – Geçersiz kayıtlar:
  - Given: Target listesinde bulunmayan kullanıcı/role ID’leri veya geçersiz
    permission ID’leri vardır.  
    When: `bulk-assign` veya `bulk-revoke` uçlarına istek yapılır.  
    Then: API 400 BAD REQUEST döner, ErrorResponse içinde hangi kayıtların
    sorunlu olduğu alan bazında açıklanır.  

- [ ] Senaryo 5 – Performans ve P95 hedefi:
  - Given: Test/stage ortamında tipik bir batch (ör. 100–500 kayıt) için
    bulk-assign senaryosu kurgulanmıştır.  
    When: Bu batch için API çağrıları tekrarlanır.  
    Then: Ölçülen P95 yanıt süreleri PRD-0003’te belirtilen hedeflerin
    içinde kalır.  

- [ ] Senaryo 6 – Audit ve izlenebilirlik:
  - Given: En az bir başarılı bulk-assign veya bulk-revoke işlemi
    gerçekleştirilmiştir.  
    When: Audit log veya ilgili raporlama araçları üzerinden
    `bulk_operation_id` ile arama yapılır.  
    Then: İlgili tüm target ve permission değişiklikleri bu ID üzerinden
    eksiksiz izlenebilir.  

## 4. NOTLAR / KISITLAR

- Büyük batch’ler için performans testi sadece test/stage ortamlarında
  yapılmalıdır; prod ortamında kontrollü rollout uygulanır.
- Permission modelinin yapısal değişiklikleri bu Story kapsamı dışındadır;
  mevcut registry v1 modeli esas alınmalıdır.

## 5. ÖZET

- Bulk-assign API v2, yüksek hacimli permission atama/kaldırma işlemlerini
  güvenli, izlenebilir ve idempotent şekilde desteklemelidir.
- Hem fonksiyonel doğruluk hem de performans ve audit gereksinimleri bu
  dokümandaki senaryolar üzerinden doğrulanacaktır.

## 6. LİNKLER (İSTEĞE BAĞLI)

- Story: docs/03-delivery/STORIES/STORY-0042-access-permission-bulk-assign-api-v2.md  
- Test Plan: docs/03-delivery/TEST-PLANS/TP-0042-access-permission-bulk-assign-api-v2.md  
- PRD: docs/01-product/PRD/PRD-0003-access-permission-bulk-assign-api-v2.md  

