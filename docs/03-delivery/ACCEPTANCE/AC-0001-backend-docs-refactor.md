# AC-0001 – Backend Dokümanları Refaktör Acceptance

ID: AC-0001  
Story: STORY-0001-backend-docs-refactor  
Status: Done  
Owner: Halil K.

## 1. AMAÇ

- Backend dokümantasyonunun yeni `docs/` mimarisi ile uyumlu olduğunu ve
  `backend/docs` yapısının yalnızca legacy arşiv olarak kullanılabildiğini
  test edilebilir kriterlerle doğrulamak.

## 2. KAPSAM

- Yeni doküman mimarisi (transition handbook, 01–05, 99-templates).
- `backend/docs` altındaki tüm .md dosyalarının envanteri ve mapping tabloları.
- Örnek zincir: STORY-0001, AC-0001, ADR-0001, TP-0001/0002, RB-*.
- Legacy backend/docs içeriğinin archive-reference backend docs alanında arşivlenmesi.

## 3. GIVEN / WHEN / THEN SENARYOLARI

### Genel Kriterler

- [x] Given: Yeni doküman mimarisi (transition handbook, 01–05, 99-templates) tanımlıdır.  
      When: Geliştirici veya agent backend ile ilgili rehber doküman arar.  
      Then: Gerekli tüm rehberler (layout, stil, mimari, süreç) sadece `docs/` altında bulunur;
      `backend/docs` altı günlük kullanım için gerekli değildir.

### Teknik Kriterler

- [x] Given: `backend/docs` altındaki tüm .md dokümanlar dizin yapısına göre kategorilere ayrılmıştır.  
      When: Migration TECH-DESIGN dokümanı incelenir (`TECH-DESIGN-backend-docs-migration.md`).  
      Then: Tüm klasörler (00-handbook, 01-architecture, 02-security, 03-delivery, 04-operations, 05-governance, agents, observability) için mapping tabloları ve hedef kategoriler (handbook/TECH-DESIGN/DATA-MODEL/ADR/STORY/ACCEPTANCE/TEST-PLANS/RUNBOOKS/MONITORING/legacy) tanımlanmıştır.

- [x] Given: Gerekli yeni dokümanlar `docs/` altında oluşturulmuştur.  
      When: Ana doc tipleri (STORY/ACCEPTANCE/ADR/TECH-DESIGN/TEST-PLAN/RUNBOOK) kontrol edilir.  
      Then: En az bir örnek zincir (STORY-0001, AC-0001, ADR-0001, TP-0001/0002, RB-*) ve migration TECH-DESIGN dokümanı NUMARALANDIRMA-STANDARDI.md ile uyumludur.

- [x] Given: Yeni docs yapısı.  
      When: Eski frontend layout / stil doküman adları için tarama yapılır (örn. grep ile).  
      Then: Yeni `docs/` hiyerarşisi altında bu eski isimlere doğrudan referans kalmaz; sadece archive-reference backend docs alanında görülebilir.

### RUNBOOKS İlerleme Durumu

- [x] Vault, MFE Access, Keycloak ve feature flag yönetimi için RB-* runbook'ları `docs/04-operations/RUNBOOKS/` altında oluşturuldu; ayrıntılı adımlar legacy runbook dosyalarına referans veriyor.
- [x] Legacy runbook arşivi korunmakta ve RB-* dokümanlarından gerektiği yerde archive-reference link verilmektedir.

### Operasyonel Kriterler

- [x] Given: Geliştirici backend dokümantasyonuna erişmek istiyor.  
      When: `docs/02-architecture/services` altına bakar.  
      Then: İlgili servisin TECH-DESIGN ve ADR dokümanlarını (ör. `user-service`, `backend-docs`) bulur;
      eski `backend/docs` içine girmek zorunda kalmaz.

- [x] Given: Eski backend docs tamamen silinmemiştir.  
      When: `backend/docs/` altına bakılır.  
      Then: Sadece `backend/docs/README.md` ve archive-reference backend docs alanında arşiv içerikleri bulunur ve
      README'de “yeni dokümantasyon docs/ altında” notu yer alır.

## 4. NOTLAR / KISITLAR

- Bu acceptance yalnız doküman yapısını kapsar; uygulama kodu değişiklikleri bu kapsamda değildir.
- Legacy dokümanlar silinmez, yalnızca archive-reference backend docs alanında arşivlenir.

## 5. ÖZET

- Yeni `docs/` hiyerarşisi backend dokümantasyonu için tek giriş noktasıdır.
- `backend/docs` yalnızca README + legacy içeriklerle arşiv rolü görür; mapping ve örnek doküman zinciri tamamlanmıştır.

## 6. LİNKLER (İSTEĞE BAĞLI)

- Story: docs/03-delivery/STORIES/STORY-0001-backend-docs-refactor.md  
