# AC-0002 – Backend Keycloak JWT Sertleştirme Acceptance

ID: AC-0002  
Story: STORY-0002-backend-keycloak-jwt-hardening  
Status: Done  
Owner: @team/backend

## 1. AMAÇ

- Tüm backend servislerinin prod/test profillerinde yalnız Keycloak RS256 JWT doğruladığını,
  legacy token mekanizmalarının yalnız dev/local profillerinde kaldığını ve
  güvenlik zincirinin ilgili dokümanlar ile uyumlu olduğunu doğrulamak.

## 2. KAPSAM

- Keycloak JWT stratejisinin TECH-DESIGN + ADR dokümanlarıyla hizası.
- Prod/test ve dev/local profillerinde security config davranışı.
- Güvenlik smoke test pipeline’ı, RB-keycloak ve governance zinciri.

## 3. GIVEN / WHEN / THEN SENARYOLARI

### Genel Kriterler

- [x] Given: Tüm backend servisleri için Keycloak JWT stratejisi TECH-DESIGN + ADR dokümanlarında tanımlıdır.  
      When: Geliştirici veya agent güvenlik mimarisine bakar.  
      Then: İlgili servislerin security config’leri docs/02-architecture/services/** altında
      belgelenmiş ve sadece Keycloak RS256 JWT doğruladıkları görülür.

### Teknik Kriterler

- [x] Given: Prod/test profillerinde backend servisleri için security config’ler güncellenmiştir.  
      When: Geçerli Keycloak JWT ile istek gönderilir.  
      Then: `/api/**` uçları 200 döner; geçersiz/legacy token ile 401/403 döner ve log’da
      legacy token kullanımı uygun şekilde etiketlenir.

- [x] Given: Dev/local profillerinde permitAll ve legacy token filtreleri gereği kadar korunmuştur.  
      When: Dev ortamında legacy token veya permitAll senaryoları test edilir.  
      Then: Prod/test’e sızmadan yalnız dev/local’de çalıştığı gözlemlenir.

- [x] Given: Güvenlik smoke test pipeline’ı çalıştırılır.  
      When: `mvn -pl <service> test` ve tanımlı curl zinciri çalıştırılır.  
      Then: Acceptance senaryolarındaki başarılı ve hatalı JWT akışları doğrulanır.

### Operasyonel Kriterler

- [x] Given: RB-keycloak ve ilgili Vault/Keycloak runbook’ları günceldir.  
      When: Runbook üzerinden incident veya bakım adımlarına bakılır.  
      Then: Yeni JWT sertleştirme kararları ve rollback adımları net şekilde yer alır.

- [x] Given: Governance zinciri güncellenmiştir.  
      When: Eski governance story/spec/acceptance dokümanlarına bakılır.  
      Then: QLTY-BE-KEYCLOAK-JWT-01 story’si docs/03-delivery/STORIES/STORY-0002-* ve
      docs/03-delivery/ACCEPTANCE/AC-0002-* ile ilişkilendirilmiş, backend/docs/legacy altında
      arşiv olarak tutulmaktadır.

## 4. NOTLAR / KISITLAR

- Yanlış profile anotasyonu prod ortamında `permitAll` davranışına neden olabilir.
- Legacy client’ların yeni JWT zorunluluğuna geçişi sırasında rollout dikkatle planlanmalıdır.

## 5. ÖZET

- Prod/test için JWT doğrulama zinciri tekilleştirilmiş, dev/local profillerinde kontrollü esneklik bırakılmıştır.
- Dokümantasyon, runbook ve governance zinciri Keycloak hardening kararıyla tutarlı hale gelmiştir.

## 6. LİNKLER (İSTEĞE BAĞLI)

- Legacy Story: backend/docs/legacy/root/05-governance/02-stories/QLTY-BE-KEYCLOAK-JWT-01.md  
- Legacy Acceptance: backend/docs/legacy/root/05-governance/07-acceptance/QLTY-BE-KEYCLOAK-JWT-01.acceptance.md  
- Story: docs/03-delivery/STORIES/STORY-0002-backend-keycloak-jwt-hardening.md  
- Test Plan: docs/03-delivery/TEST-PLANS/TP-0002-backend-keycloak-jwt-hardening.md  
- Runbook: docs/04-operations/RUNBOOKS/RB-keycloak.md  
