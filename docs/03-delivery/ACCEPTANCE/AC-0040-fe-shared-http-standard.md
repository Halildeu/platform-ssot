# AC-0040 – FE Shared HTTP Standard Acceptance

ID: AC-0040  
Story: STORY-0040-fe-shared-http-standard  
Status: Planned  
Owner: @team/frontend

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- Shared HTTP standardının yeni doküman zincirinde QLTY-FE-SHARED-HTTP-01
  için belirlenen kararları temsil ettiğini doğrulamak.

-------------------------------------------------------------------------------
## 2. KAPSAM
-------------------------------------------------------------------------------

- `@mfe/shared-http` paketinin varlığı ve konumu.  
- MFE’lerin HTTP çağrı adetleri için shared layer kullanımı.  
- BaseURL, auth header, traceId ve 401 davranışı ile ilgili governance
  kararları.

-------------------------------------------------------------------------------
## 3. GIVEN / WHEN / THEN SENARYOLARI
-------------------------------------------------------------------------------

- [ ] Senaryo 1 – Shared HTTP Paket’i:  
  - Given: FE kod tabanında HTTP çağrıları yapılmaktadır.  
    When: HTTP client import’ları incelenir.  
    Then: Tüm production çağrıları `@mfe/shared-http` üzerinden
    yapılmaktadır.

- [ ] Senaryo 2 – Gateway & v1 Path:  
  - Given: Shared HTTP paketi gateway’e bağlanacak şekilde konfigüre
    edilmiştir.  
    When: BaseURL ve path kullanımını tanımlayan dokümanlar incelenir.  
    Then: `/api/v1/**` pattern’i ve gateway baseURL standardı net
    olarak belirtilmiştir.

-------------------------------------------------------------------------------
## 4. NOTLAR / KISITLAR
-------------------------------------------------------------------------------

- Teknik test ve lint detayları TP-0040 içinde ele alınacaktır; bu
  doküman governance checklist’ine odaklanır.

-------------------------------------------------------------------------------
## 5. ÖZET
-------------------------------------------------------------------------------

- FE Shared HTTP standardı yeni doküman mimarisine taşınmış ve kabul
  kriterleri AC-0040 altında tanımlanmıştır.

-------------------------------------------------------------------------------
## 6. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Story: docs/03-delivery/STORIES/STORY-0040-fe-shared-http-standard.md  
- Test Plan: docs/03-delivery/TEST-PLANS/TP-0040-fe-shared-http-standard.md  
