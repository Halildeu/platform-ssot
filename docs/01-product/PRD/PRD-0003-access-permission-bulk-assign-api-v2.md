# PRD-0003 – Access Permission Bulk-Assign API v2

ID: PRD-0003-access-permission-bulk-assign-api-v2

-------------------------------------------------------------------------------
1. TANIM
-------------------------------------------------------------------------------

Access/permission yönetiminde, aynı permission set’ini çok sayıda kullanıcıya
veya role’e hızlı, güvenli ve izlenebilir şekilde atamak için yeni bir
“bulk-assign API v2” tanımlanır. Amaç, manuel tek tek atamaları azaltmak ve
operasyon ekiplerinin toplu işlemlerini standart bir yol üzerinden
gerçekleştirmesini sağlamaktır.

-------------------------------------------------------------------------------
2. AMAÇ
-------------------------------------------------------------------------------

- Operasyon ekipleri için permission bulk-assign işlemlerini hızlandırmak.  
- Hata riskini (yanlış kullanıcı/permission) azaltmak ve audit izlenebilirliğini
  artırmak.  
- FE Access UI ve backend permission-service için ortak bir bulk-assign
  kontratı oluşturmak.

-------------------------------------------------------------------------------
3. KAPSAM
-------------------------------------------------------------------------------

Dahil:
- Yeni REST API uçları (örnek):
  - `POST /api/v1/permissions/bulk-assign`
  - `POST /api/v1/permissions/bulk-revoke`
- Input modeli:
  - Target türü: user / role / group.  
  - Target listesi: ID veya external key listesi.  
  - Permission set’i: permission id veya policy id listesi.  
  - Operation metadata: “reason”, “requested_by”, “correlationId” vb.
- Çıktı modeli:
  - Toplam başarılı/başarısız kayıt sayısı.  
  - Hata detayları (validasyon, bulunamayan kullanıcı/permission).  
  - `bulk_operation_id` ile audit log ve UI’da izlenebilirlik.
- Access UI entegrasyonu:
  - Basit bir bulk-assign ekranı veya mevcut grid’lerde “bulk action”
    davranışları.

Hariç:
- Tam kapsamlı workflow engine veya onay/approval süreçleri (ayrı PRD).  
- Permission modelinin temelden değiştirilmesi (mevcut model üzerine
  inşa edilir).

-------------------------------------------------------------------------------
4. ACCEPTANCE KRİTERLERİ (ÖZET)
-------------------------------------------------------------------------------

- Bulk-assign ve bulk-revoke uçları PRD’de tanımlanan input/output
  kontratına uygun olarak çalışır.  
- Bir toplu işlemde en az 100 kullanıcı için permission set’i başarıyla
  atanabilir; P95 yanıt süresi ≤ 1 sn içinde kalır (makul batch boyutu).  
- Audit log’larda her bulk işlem tekil bir `bulk_operation_id` ile
  görülebilir ve hangi kullanıcı/permission set’inin etkilendiği izlenebilir.  
- FE Access UI, yeni API’yi kullanarak “bulk assign” akışını destekler.

-------------------------------------------------------------------------------
5. BAĞIMLILIKLAR / İLİŞKİLER
-------------------------------------------------------------------------------

- PB-0003 – Access Permission Bulk-Assign API v2 Problem Brief.  
- Mevcut permission-service REST/DTO v1 dokümanları (STORY-0032 / AC-0032).  
- Permission registry v1 Story zinciri (STORY-0019 / AC-0019 / TP-0101).  

-------------------------------------------------------------------------------
6. RİSKLER / BAĞIMLILIKLAR
-------------------------------------------------------------------------------

- Büyük batch’ler için performans ve resource kullanımı; gerekirse
  arka planda job/polling modeli düşünülmelidir.  
- FE tarafında kullanıcıya yeterli geri bildirim verilmezse “işlem bitti mi?”
  karmaşası yaşanabilir.

-------------------------------------------------------------------------------
7. ÖZET
-------------------------------------------------------------------------------

Bu PRD, Access permission bulk-assign API v2 için ürün gereksinimlerini
tanımlar; teknik tasarım, Story/Acceptance ve test planları bu dokümana
dayanacaktır.

