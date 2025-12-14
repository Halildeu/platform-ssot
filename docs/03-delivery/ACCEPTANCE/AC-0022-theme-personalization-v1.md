# AC-0022 – Theme Personalization v1.0 Acceptance

ID: AC-0022  
Story: STORY-0022-theme-personalization-v1  
Status: Planned  
Owner: @team/frontend

## 1. AMAÇ

- Theme personalization v1.0 kapsamında kullanıcı/tenant tema tercihleri
  için tanımlanan gereksinimlerin karşılandığını doğrulamak.

## 2. KAPSAM

- Kullanıcı bazlı tema seçimi ve kalıcılık (profil teması).  
- Kullanıcı bazlı kişisel tema override’ları (whitelist / registry).  
- Admin bazlı global tema override’ları (registry).

## 3. GIVEN / WHEN / THEN SENARYOLARI

- [ ] Senaryo 1 – Kullanıcı tema seçimi kalıcıdır:  
  Given: Kullanıcı “Profil teması (backend)” alanında en az 1 tema görür.  
    When: Bir tema seçer.  
    Then: Tema seçimi kalıcı olarak saklanır ve sonraki oturumlarda uygulanır.

- [ ] Senaryo 2 – Kullanıcı kişisel tema renklerini düzenler (USER_ALLOWED):  
  Given: Kullanıcı bir global temadan “Kopyala” ile kişisel tema oluşturmuştur.  
    When: “Kişisel tema renkleri” ekranından `surface/text/border/accent/overlay` gruplarındaki alanlarda renk seçer ve kaydeder.  
    Then: Override’lar saklanır ve UI’da ilgili CSS var’lar güncellenir.

- [ ] Senaryo 3 – Whitelist enforcement (ADMIN_ONLY / unknown key):  
  Given: Kullanıcı kişisel tema güncellemesi yapar.  
    When: Registry’de olmayan bir anahtar veya `ADMIN_ONLY` alanı update etmeyi dener.  
    Then: API isteği reddedilir ve kayıt yapılmaz.

- [ ] Senaryo 4 – Admin global tema override’ı yönetir:  
  Given: THEME_ADMIN yetkisine sahip kullanıcı `/admin/themes` sayfasını açmıştır.  
    When: Registry tabanlı color picker ile bir global temanın override’larını günceller ve kaydeder.  
    Then: Override’lar saklanır ve ilgili tema seçildiğinde UI’da uygulanır.

## 4. NOTLAR / KISITLAR

- Detaylı test senaryoları `TP-0022` içinde listelenir.

## 5. ÖZET

- Theme personalization v1.0, bu acceptance kriterleri sağlandığında
  tamamlanmış sayılacaktır.

## 6. LİNKLER (İSTEĞE BAĞLI)

- Story: docs/03-delivery/STORIES/STORY-0022-theme-personalization-v1.md  
