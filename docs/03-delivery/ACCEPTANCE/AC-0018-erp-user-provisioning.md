# AC-0018 – ERP User Provisioning Acceptance

ID: AC-0018  
Story: STORY-0018-erp-user-provisioning  
Status: Planned  
Owner: @team/backend

## 1. AMAÇ

- ERP user provisioning akışının temel gereksinimlerini doğrulamak.

## 2. KAPSAM

- ERP → Keycloak + user-service senkronizasyonu.

## 3. GIVEN / WHEN / THEN SENARYOLARI

- [ ] Senaryo 1 – Periyodik senkronizasyon:  
  Given: ERP’de yeni veya güncellenmiş kullanıcılar vardır.  
    When: Senkronizasyon job’u çalıştırılır.  
    Then: İlgili kullanıcılar Keycloak + user-service tarafında güncel
    hale gelir.

## 4. NOTLAR / KISITLAR

- Detaylı senaryolar TP-0018’de listelenecektir.

## 5. ÖZET

- ERP user provisioning akışı temel fonksiyonlarını sağladığında kabul edilir.

## 6. LİNKLER (İSTEĞE BAĞLI)

- Story: docs/03-delivery/STORIES/STORY-0018-erp-user-provisioning.md  

