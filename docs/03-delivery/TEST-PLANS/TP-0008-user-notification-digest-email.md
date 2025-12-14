# TP-0008 – User Notification Digest E-mail Test Planı

ID: TP-0008  
Story: STORY-0008-user-notification-digest-email
Status: Planned  
Owner: @team/backend

-------------------------------------------------------------------------------
1. AMAÇ
-------------------------------------------------------------------------------

- User notification digest e‑mail özelliğinin PRD-0002 ve AC-0008 ile
  uyumlu olduğunu doğrulamak.

-------------------------------------------------------------------------------
2. KAPSAM
-------------------------------------------------------------------------------

- Digest frekans tercihi yönetimi (yok/günlük/haftalık).
- Günlük/haftalık job davranışı.
- Digest e‑mail içeriği ve linklerin doğruluğu.

-------------------------------------------------------------------------------
3. STRATEJİ
-------------------------------------------------------------------------------

- Fonksiyonel testler:
  - Digest frekans tercihlerini değiştirme ve etkilerini gözlemleme.
  - Günlük/haftalık job çalıştırma ve e‑mail gönderimini doğrulama.
- Negatif testler:
  - Geçersiz frekans değerleri, boş içerik durumları.
- Performans:
  - Örnek hacimle digest generation süresini ve e‑mail kuyruğunu gözlemleme.

-------------------------------------------------------------------------------
4. TEST SENARYOLARI ÖZETİ
-------------------------------------------------------------------------------

- [ ] Digest frekans tercihi (günlük/haftalık) mutlu akışı.  
- [ ] Günlük digest job’unun doğru kullanıcılar için e‑mail üretmesi.  
- [ ] Haftalık digest job’unun doğru kullanıcılar için e‑mail üretmesi.  
- [ ] Tercihini devre dışı bırakan kullanıcıya digest gönderilmemesi.  

-------------------------------------------------------------------------------
5. ÇEVRE VE ARAÇLAR
-------------------------------------------------------------------------------

- Ortamlar:
  - Test/stage ortamları; ilgili job/pipeline konfigürasyonları.
- Araçlar:
  - HTTP istemcileri (curl, Postman, Insomnia).
  - Log ve monitoring panelleri (Grafana, Kibana).
  - E‑mail test inbox veya sandbox ortamı.

-------------------------------------------------------------------------------
6. RİSKLER / ÖNCELİKLER
-------------------------------------------------------------------------------

- En kritik riskler:
  - Yanlış segment veya içerikle yanlış kullanıcılara digest gitmesi.
  - Performans sorunları nedeniyle digest’lerin geç gönderilmesi.
- Öncelikli senaryolar:
  - Digest frekans yönetimi ve temel job akışları.

-------------------------------------------------------------------------------
7. ÖZET
-------------------------------------------------------------------------------

- Bu test planı, notification digest e‑mail özelliğinin fonksiyonel ve
  temel performans gereksinimlerini doğrulamayı hedefler.

-------------------------------------------------------------------------------
8. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Story: docs/03-delivery/STORIES/STORY-0008-user-notification-digest-email.md  
- Acceptance: docs/03-delivery/ACCEPTANCE/AC-0008-user-notification-digest-email.md  
- PRD: docs/01-product/PRD/PRD-0002-user-notification-digest-email.md  

