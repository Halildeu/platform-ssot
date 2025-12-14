Amaç: Kullanıcı güncellemesi sonrası `auditId` toast ve deep‑link doğrulaması

Önkoşullar
- Shell `/admin/users` rotasında `UsersPage` yüklüyor.
- Backend çalışır durumda, `PUT /api/users/{id}` yanıtında `auditId` döner.

Adımlar
1. `/admin/users` sayfasını aç.
2. Grid’den ilk satırın “Düzenle”/toggle aksiyonuna tıkla (enabled alanını değiştirir).
3. Sağ üstte toast görünmeli: “İşlem kaydedildi • AuditId: <id>”.
4. Toast içindeki “Audit’te aç” linkine tıkla.
5. Yönlendirme `/admin/audit?event=<id>` olmalı ve Audit sayfasında ilgili kayıt vurgulanmalı.

Ek
- Network’te `PUT /api/users/{id}` yanıt gövdesinde `auditId` alanı bulunmalı.
- Hata halinde toast görünmemeli, UI uygun hata mesajı göstermeli (opsiyonel).

