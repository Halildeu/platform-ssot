# TP-0022 – Theme Personalization v1.0 Test Planı

ID: TP-0022  
Story: STORY-0022-theme-personalization-v1
Status: Planned  
Owner: @team/frontend

-------------------------------------------------------------------------------
1. AMAÇ
-------------------------------------------------------------------------------

- Theme personalization v1.0 senaryolarının AC-0022 ile uyumlu olduğunu
  doğrulamak.

-------------------------------------------------------------------------------
2. KAPSAM
-------------------------------------------------------------------------------

- Kullanıcı tema seçimi ve kalıcılık.  
- Kullanıcı kişisel tema override’ları (registry whitelist).  
- Admin global tema override’ları (registry).  
- Runtime’da override → CSS var uygulaması.

-------------------------------------------------------------------------------
3. STRATEJİ
-------------------------------------------------------------------------------

- UI (manual/e2e) ile kullanıcı tema seçimi ve kişiselleştirme akışını doğrulama.  
- API smoke ile registry ve whitelist davranışını doğrulama.  
- Runtime smoke ile override’ların CSS var’lara yansımasını doğrulama.

-------------------------------------------------------------------------------
4. TEST SENARYOLARI ÖZETİ
-------------------------------------------------------------------------------

- [ ] Registry smoke: `GET /api/v1/theme-registry` beklenen alanları döner (örn. `surface.default.bg`, `text.primary`, `border.default`, `accent.primary`, `overlay.bg`).  
- [ ] Kullanıcı tema seçimi kalıcılık: tema seç → sayfa yenile → aynı tema uygulanır.  
- [ ] Kullanıcı kişisel tema oluşturma: global temadan “Kopyala” → kişisel tema listesinde görünür (max 3 limiti).  
- [ ] Kullanıcı kişisel tema override: “Kişisel tema renkleri” ekranı → color picker ile değer değiştir → kaydet → UI güncellenir.  
- [ ] Admin global tema override: `/admin/themes` → color picker ile override güncelle → kaydet → tema seçilince UI güncellenir.  
- [ ] Whitelist enforcement: kullanıcı `ADMIN_ONLY` veya unknown key ile update dener → API reddeder (4xx) ve kayıt yapılmaz.

-------------------------------------------------------------------------------
5. ÇEVRE VE ARAÇLAR
-------------------------------------------------------------------------------

- Web: `http://localhost:3000`  
  - Admin editor: `/admin/themes`  
  - Runtime panel: üst bardaki “Görünüm”  
- API: `GET /api/v1/theme-registry`, `PUT /api/v1/themes/{id}`, `PUT /api/v1/themes/global/{id}`, `GET /api/v1/me/theme/resolved`

-------------------------------------------------------------------------------
6. RİSKLER / ÖNCELİKLER
-------------------------------------------------------------------------------

- Farklı tenant ve kullanıcı kombinasyonlarında beklenmeyen tema sonuçları.

-------------------------------------------------------------------------------
7. ÖZET
-------------------------------------------------------------------------------

- Bu test planı theme personalization v1.0 davranışının temel senaryolarını
  doğrular.

-------------------------------------------------------------------------------
8. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Story: docs/03-delivery/STORIES/STORY-0022-theme-personalization-v1.md  
- Acceptance: docs/03-delivery/ACCEPTANCE/AC-0022-theme-personalization-v1.md  
