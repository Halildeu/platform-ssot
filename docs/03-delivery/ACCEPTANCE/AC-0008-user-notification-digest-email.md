# AC-0008 – User Notification Digest E-mail Acceptance

ID: AC-0008  
Story: STORY-0008-user-notification-digest-email  
Status: Planned  
Owner: @team/backend

## 1. AMAÇ

- User notification digest e‑mail özelliğinin işlevsel ve davranışsal
  açıdan PRD-0002 gereksinimlerini karşıladığını test edilebilir kriterlerle
  doğrulamak.

## 2. KAPSAM

- Kullanıcının digest frekans tercihini yönetmesi.
- Günlük/haftalık job/pipeline davranışı.
- Digest e‑mail içeriği ve linklerin doğruluğu.

## 3. GIVEN / WHEN / THEN SENARYOLARI

- [ ] Senaryo 1 – Digest frekans tercihi:
  - Given: Kullanıcının notification digest için henüz tercihi yoktur.  
    When: Kullanıcı digest frekansını günlük veya haftalık olarak seçer ve
    kaydeder.  
    Then: Tercih bilgisi backend’de saklanır ve bir sonraki job çalıştırıldığında
    dikkate alınır.

- [ ] Senaryo 2 – Günlük digest gönderimi:
  - Given: Kullanıcı günlük digest için opt‑in olmuştur ve gün içinde uygun
    bildirimler oluşmuştur.  
    When: Günlük digest job’u çalıştırılır.  
    Then: Kullanıcıya, yalnız o güne ait önemli bildirimleri özetleyen tek bir
    digest e‑mail gönderilir.

- [ ] Senaryo 3 – Haftalık digest gönderimi:
  - Given: Kullanıcı haftalık digest için opt‑in olmuştur.  
    When: Haftalık digest job’u belirlenen günde çalıştırılır.  
    Then: Kullanıcıya, hafta boyunca biriken önemli bildirimleri içeren bir
    digest e‑mail gönderilir.

## 4. NOTLAR / KISITLAR

- Detaylı performans ve edge case senaryoları TP-0008 test planında
  listelenecektir.

## 5. ÖZET

- Kullanıcı digest frekansını yönetebilir, sistem de günlük/haftalık özetleri
  doğru zamanda iletebilir.
- Detaylı senaryolar TP-0008 test planında doğrulanacaktır.

## 6. LİNKLER (İSTEĞE BAĞLI)

- Story: docs/03-delivery/STORIES/STORY-0008-user-notification-digest-email.md  
- Test Plan: docs/03-delivery/TEST-PLANS/TP-0008-user-notification-digest-email.md  

