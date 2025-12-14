# STORY-0007 – User Notification Preferences API

ID: STORY-0007-user-notification-preferences-api  
Epic: API-NOTIFICATION  
Status: Done  
Owner: @team/backend  
Upstream: PRD-0001-user-notification-preferences-api  
Downstream: AC-0007, TP-0007

## 1. AMAÇ

User notification preferences için tek ve tutarlı bir API seti tasarlamak ve
uygulamak; son kullanıcı profil ekranı ve admin panelinin aynı sözleşme
üzerinden güvenilir şekilde çalışmasını sağlamak.

## 2. TANIM

- Giriş yapmış bir kullanıcı olarak, bildirim tercihlerini görüntülemek ve güncellemek istiyorum; böylece yalnızca önemsediğim mesajları alırım.
- Admin/support temsilcisi olarak, bir kullanıcının mevcut bildirim tercihlerini görüntülemek istiyorum; böylece bildirimlerle ilgili şikâyetlerinde destek olabilirim.

## 3. KAPSAM VE SINIRLAR

Dahil:
- Kullanıcının kendi notification preferences bilgilerini okuma/güncelleme
  uçları (GET/PATCH).
- İleride admin paneli için diğer kullanıcıların tercihlerini görüntüleme
  uçları (role‑based access ile).
- API dokümantasyonu (`docs/03-delivery/api/notification-preferences.api.md`)
  ve gerekirse OpenAPI şemaları için iskelet.

Hariç (NON-GOALS):
- Bildirim içerik/şablon yönetimi.
- Üçüncü parti provider (e‑posta/SMS gateway) detayları.

## 4. ACCEPTANCE KRİTERLERİ

- [x] Kullanıcı tercihlerini görüntüleyebilmelidir:  
  Given geçerli JWT ile giriş yapmış bir kullanıcı vardır, When notification
  preferences ekranına girerse, Then API mevcut tercihlerini başarıyla
  döndürmelidir.  
- [x] Kullanıcı tercihlerini güvenle güncelleyebilmelidir:  
  Given kullanıcı bazı bildirim türlerini açmak/kapatmak ister, When Kaydet
  tuşuna basarsa, Then API 200 döndürür ve yeni tercihler veri katmanında
  kalıcı hale gelir.  
- [x] Yetkisiz erişim engellenmelidir:  
  Given kimliği doğrulanmamış veya yetkisiz bir istek yapılır, When notification
  preferences uçlarına erişim denenirse, Then API 401/403 döndürür.  

Detaylı Given/When/Then senaryoları AC-0007 dokümanında yer alır.

## 5. BAĞIMLILIKLAR

- PB-0001 – User Notification Preferences Performance  
- PRD-0001 – User Notification Preferences API  
- AC-0007 – User Notification Preferences API Acceptance  
- TP-0007 – User Notification Preferences API Test Planı  
- API dokümanı: `docs/03-delivery/api/notification-preferences.api.md`  
- Kullanıcı kimlik/doğrulama sistemi (JWT / user-service)

## 6. ÖZET

- User notification preferences için yeni bir v1 API seti tasarlanacak ve
  uygulanacaktır.
- Son kullanıcı ve admin, bu API’ler üzerinden tercihleri güvenilir şekilde
  görüntüleyip (ve gerekiyorsa güncelleyip) çalışabilecektir.
- Başarı, AC-0007’deki kabul kriterleri ve TP-0007’daki test senaryolarının
  başarıyla geçmesiyle ölçülecektir.

## 7. LİNKLER (İSTEĞE BAĞLI)

- PB: `docs/01-product/PROBLEM-BRIEFS/PB-0001-user-notification-preferences.md`  
- PRD: `docs/01-product/PRD/PRD-0001-user-notification-preferences-api.md`  
- Acceptance: `docs/03-delivery/ACCEPTANCE/AC-0007-user-notification-preferences-api.md`  
- Test Plan: `docs/03-delivery/TEST-PLANS/TP-0007-user-notification-preferences-api.md`  
- API Sözleşmesi: `docs/03-delivery/api/notification-preferences.api.md`  
