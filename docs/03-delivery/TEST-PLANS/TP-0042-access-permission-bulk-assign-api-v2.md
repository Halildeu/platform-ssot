# TP-0042 – Access Permission Bulk-Assign API v2 Test Planı

ID: TP-0042  
Story: STORY-0042-access-permission-bulk-assign-api-v2
Status: Planned  
Owner: @team/backend

-------------------------------------------------------------------------------
1. AMAÇ
-------------------------------------------------------------------------------

- Access permission bulk-assign API v2 uçlarının (assign/revoke) PRD-0003 ve
  AC-0042 gereksinimlerini fonksiyonel, negatif ve performans açısından
  karşıladığını doğrulamak.

-------------------------------------------------------------------------------
2. KAPSAM
-------------------------------------------------------------------------------

- `POST /api/v1/permissions/bulk-assign`
- `POST /api/v1/permissions/bulk-revoke`
- İlgili audit log ve `bulk_operation_id` alanları.

-------------------------------------------------------------------------------
3. STRATEJİ
-------------------------------------------------------------------------------

- Fonksiyonel testler:
  - Geçerli target ve permission set’leri için başarılı bulk-assign/bulk-revoke.
  - İdempotent tekrar çağrılarının doğrulanması.
- Negatif testler:
  - Geçersiz target ID’leri, geçersiz permission ID’leri.
  - Eksik zorunlu alanlar, boş listeler.
- Güvenlik:
  - Yetkisiz veya yetersiz yetkili çağıran için 401/403 davranışı.
- Performans:
  - Tipik batch hacimleri (ör. 100–500 kayıt) için P95 yanıt süresi ölçümleri.

-------------------------------------------------------------------------------
4. TEST SENARYOLARI ÖZETİ
-------------------------------------------------------------------------------

- [ ] Mutlu akış – geçerli target/permission listesi ile başarılı bulk-assign.  
- [ ] Mutlu akış – daha önce atanmış kayıtlar için bulk-revoke.  
- [ ] İdempotent tekrar çağrısı – aynı payload ile ikinci çağrıda ek değişiklik yapılmaması.  
- [ ] Geçersiz kullanıcı/role ID’leri ile hata senaryoları (400).  
- [ ] Geçersiz permission ID’leri ile hata senaryoları (400).  
- [ ] Yetkisiz/yetersiz yetkili çağıran için 401/403 doğrulaması.  
- [ ] Tipik batch hacmi için P95 latency ölçümü.  

-------------------------------------------------------------------------------
5. ÇEVRE VE ARAÇLAR
-------------------------------------------------------------------------------

- Ortamlar:
  - Test ve stage ortamları (ör. `test`, `stage`) – permission registry v1 ve
    user/auth servisleriyle entegre.  
- Araçlar:
  - HTTP istemcileri (curl, Postman, Insomnia).  
  - Log ve monitoring panelleri (Grafana, Kibana vb.).  
  - Gerekirse basit load/perf script’leri (k6, Locust gibi).  

-------------------------------------------------------------------------------
6. RİSKLER / ÖNCELİKLER
-------------------------------------------------------------------------------

- En kritik riskler:
  - Yanlış bulk işlemlerinin geniş kullanıcı grubunu etkilemesi.  
  - Büyük batch’lerde performans ve kaynak kullanımı problemleri.  
- Öncelikli senaryolar:
  - Mutlu akış bulk-assign/bulk-revoke.  
  - İdempotent davranış ve audit izlenebilirliği.  

-------------------------------------------------------------------------------
7. ÖZET
-------------------------------------------------------------------------------

- Bu test planı, bulk-assign API v2’nin fonksiyonel doğruluk, hata
  senaryoları, güvenlik ve temel performans gereksinimlerini kapsar.  
- Test sonuçları, AC-0042 kabul kriterlerinin karşılandığını göstermek için
  kullanılacaktır.  

-------------------------------------------------------------------------------
8. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Story: docs/03-delivery/STORIES/STORY-0042-access-permission-bulk-assign-api-v2.md  
- Acceptance: docs/03-delivery/ACCEPTANCE/AC-0042-access-permission-bulk-assign-api-v2.md  
- PRD: docs/01-product/PRD/PRD-0003-access-permission-bulk-assign-api-v2.md  

