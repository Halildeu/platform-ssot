# TP-0010 – API v1 Standardization Test Planı

ID: TP-0010  
Story: STORY-0010-api-v1-standardization
Status: Planned  
Owner: @team/platform-arch

-------------------------------------------------------------------------------
1. AMAÇ
-------------------------------------------------------------------------------

- API v1 standardizasyonunun (path, zarf, hata modeli) PRD/Story ve
  AC-0010’daki gereksinimlere uygun olduğunu doğrulamak.

-------------------------------------------------------------------------------
2. KAPSAM
-------------------------------------------------------------------------------

- users, variants, permissions, auth servisleri için v1 endpoint’ler.
- PagedResult zarfı ve `ErrorResponse` hata modeli.

-------------------------------------------------------------------------------
3. STRATEJİ
-------------------------------------------------------------------------------

- Fonksiyonel testler:
  - `/api/v1/**` path’lerinin çalıştığını ve legacy path’lerin deprecated
    olduğunu doğrulamak.
  - PagedResult zarfı ve hata modeli çıktılarının doğrulanması.
- Negatif testler:
  - Geçersiz query parametreleri (whitelist dışı sort/search/advancedFilter).
- Doküman doğrulama:
  - STYLE-API-001 ve API dokümanlarının güncelliğini kontrol etmek.

-------------------------------------------------------------------------------
4. TEST SENARYOLARI ÖZETİ
-------------------------------------------------------------------------------

- [ ] `/api/v1/users` v1 path ve PagedResult zarfı.  
- [ ] `/api/v1/auth/**` v1 path ve ErrorResponse çıktıları.  
- [ ] Legacy `/api/users/**` ve `/api/auth/**` path’lerinin deprecated
  olarak işaretlenmesi.  
- [ ] Whitelist dışı query parametrelerinin reddedilmesi veya yok sayılması.  

-------------------------------------------------------------------------------
5. ÇEVRE VE ARAÇLAR
-------------------------------------------------------------------------------

- Ortamlar:
  - Test/stage/prod profilleri; ilgili servis konfigürasyonları.
- Araçlar:
  - HTTP istemcileri (curl/Postman/Insomnia).
  - Log ve monitoring panelleri.

-------------------------------------------------------------------------------
6. RİSKLER / ÖNCELİKLER
-------------------------------------------------------------------------------

- En kritik riskler:
  - Legacy path’lerin istemciler tarafından hâlâ kullanılıyor olması.
  - V1’e geçişte backward compatibility sorunları.
- Öncelikli senaryolar:
  - Ana CRUD uçlarının v1 üzerinden çalışması.
  - PagedResult ve ErrorResponse davranışlarının düzgün olması.

-------------------------------------------------------------------------------
7. ÖZET
-------------------------------------------------------------------------------

- Bu test planı, API v1 standardının ana servislerde tutarlı ve güvenilir
  şekilde uygulandığını doğrulamayı hedefler.

-------------------------------------------------------------------------------
8. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Story: docs/03-delivery/STORIES/STORY-0010-api-v1-standardization.md  
- Acceptance: docs/03-delivery/ACCEPTANCE/AC-0010-api-v1-standardization.md  

