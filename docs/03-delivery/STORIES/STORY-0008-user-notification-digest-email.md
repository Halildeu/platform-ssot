# STORY-0008 – User Notification Digest E-mail

ID: STORY-0008-user-notification-digest-email  
Epic: API-NOTIFICATION  
Status: Planned  
Owner: @team/backend  
Upstream: PRD-0002-user-notification-digest-email  
Downstream: AC-0008, TP-0008

## 1. AMAÇ

User notification digest (günlük/haftalık özet e‑mail) için uçtan uca çözümü
tasarlamak ve uygulamak; kullanıcıların daha az ama daha anlamlı e‑mail almasını
sağlamak.

## 2. TANIM

- Kullanıcı olarak, önemli bildirimlerimin günlük veya haftalık özetini almak istiyorum; böylece gelen kutum daha düzenli olurken önemli olayları kaçırmam.
- Ürün/ops ekibi olarak, digest davranışının konfigüre edilebilir ve gözlemlenebilir olmasını istiyoruz; böylece kullanıcıları spamlemeden etkileşimi optimize edebiliriz.

## 3. KAPSAM VE SINIRLAR

Dahil:
- Digest frekansı ve içerik tercihlerini yönetmek için gerekli API ve
  data modeli.
- Günlük/haftalık digest job/pipeline tasarımı ve temel implementation.
- Digest e‑mail template’inin iskeleti (başlıklar, linkler).

Hariç (NON-GOALS):
- Tam notification sistemi redesign’ı.
- İlk fazda push/SMS digest desteği.

## 4. ACCEPTANCE KRİTERLERİ

- [ ] Kullanıcı digest frekansını (yok/günlük/haftalık) UI üzerinden
  güncelleyebilir; değişiklikler backend’de saklanır.  
- [ ] Günlük/haftalık job’lar, kullanıcıların tercihine göre doğru zamanda
  digest üretip email sağlayıcıya iletir.  
- [ ] Digest içeriğindeki linkler, kullanıcıyı doğru ekrana taşır.  

## 5. BAĞIMLILIKLAR

- PB-0002 – User Notification Digest E-mail  
- PRD-0002 – User Notification Digest E-mail  
- AC-0008 – User Notification Digest E-mail Acceptance  
- TP-0008 – User Notification Digest E-mail Test Planı  
- API dokümanı: `docs/03-delivery/api/notification-digest.api.md`  

## 6. ÖZET

- Digest email özelliği, mevcut notification sisteminin üzerine ek yeni bir
  katman olarak tasarlanacaktır.
- Başarı, AC-0008’deki kabul kriterleri ve TP-0008’deki test senaryolarının
  başarıyla geçmesiyle ölçülecektir.

## 7. LİNKLER (İSTEĞE BAĞLI)

- PB: `docs/01-product/PROBLEM-BRIEFS/PB-0002-user-notification-digest-email.md`  
- PRD: `docs/01-product/PRD/PRD-0002-user-notification-digest-email.md`  
- Acceptance: `docs/03-delivery/ACCEPTANCE/AC-0008-user-notification-digest-email.md`  
- Test Plan: `docs/03-delivery/TEST-PLANS/TP-0008-user-notification-digest-email.md`  
- API Sözleşmesi: `docs/03-delivery/api/notification-digest.api.md`  
