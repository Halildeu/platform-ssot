# Doküman Numaralandırma Standardı (Yeni Sistem – 2025)

Bu standart, tüm doküman türleri için ID formatını SIFIRDAN belirler.
Eski numaralar taşınmaz, karışık ID kullanımı yasaktır.

-------------------------------------------------------------------------------
1. PROBLEM BRIEF (PB)
-------------------------------------------------------------------------------
Format: PB-0001-<kısa-konu>.md  
Sayaç: 0001 → 0002 → 0003 …  
Örnek: PB-0001-login-issue.md

-------------------------------------------------------------------------------
2. PRODUCT REQUIREMENT DOCUMENT (PRD)
-------------------------------------------------------------------------------
Format: PRD-0001-<feature>.md  
Sayaç: 0001 → 0002 → 0003 …  
Örnek: PRD-0002-user-profile.md

-------------------------------------------------------------------------------
3. STORY
-------------------------------------------------------------------------------
Format: STORY-0001-<konu>.md  
Sayaç: 0001 → 0002 → …  
Örnek: STORY-0007-add-user.md

-------------------------------------------------------------------------------
4. ACCEPTANCE
-------------------------------------------------------------------------------
Format: AC-0001-<konu>.md  
Sayaç: STORY ID ile eşleşir  
Örnek: AC-0007-add-user.md

-------------------------------------------------------------------------------
5. TEST PLAN
-------------------------------------------------------------------------------
Format: TP-0001-<konu>.md  
Sayaç: STORY ID ile eşleşir (Story-linked TP)  
Örnek: TP-0007-add-user.md

-------------------------------------------------------------------------------
6. ADR (Architecture Decision Record)
-------------------------------------------------------------------------------
Format: ADR-0001-<karar>.md  
Sayaç SERVİS BAZLIDIR (global değil)  
Örnek: ADR-0003-token-strategy.md

-------------------------------------------------------------------------------
7. TECH-DESIGN
-------------------------------------------------------------------------------
Format: TECH-DESIGN-<servis>-<konu>.md  
ID ALMAZ  
Örnek: TECH-DESIGN-reporting-grid-api.md

-------------------------------------------------------------------------------
8. DATA-MODEL
-------------------------------------------------------------------------------
Format: DATA-MODEL-<servis>-<model>.md  
ID ALMAZ  
Örnek: DATA-MODEL-user-service-user.md

-------------------------------------------------------------------------------
9. RUNBOOK
-------------------------------------------------------------------------------
Format: RB-<servis>.md  
ID: RB-<servis> → servis başına 1 runbook  
Örnek: RB-user-service.md

-------------------------------------------------------------------------------
10. Kurallar (Değişmez)
-------------------------------------------------------------------------------
- Eski ID’ler taşınmaz; her tür için sayaç sıfırdan başlar.
- Doküman türleri ayrı kalır (STORY ≠ AC ≠ TP) ama Delivery zincirinde sayı eşleşir:
  - `STORY-0007` ↔ `AC-0007` ↔ `TP-0007`
- ID dosya içine yazıldıktan sonra değiştirilemez.
- ID çakışması yasaktır; kontrol AGENTS.md ve Codex tarafından yapılır.
- Tüm dokümanlar bu standarda uymak zorundadır.
- Runbook’larda ID, servis adı üzerinden verilir (`ID: RB-<servis>`); bir servisin sadece bir aktif runbook’u olabilir.

-------------------------------------------------------------------------------
11. ID HAVUZLARI VE KLASÖR EŞLEŞİMİ
-------------------------------------------------------------------------------

Aşağıdaki tablo, her ID türünün hangi klasörde kullanıldığını özetler:

- PB-XXXX  → `docs/01-product/PROBLEM-BRIEFS/PB-*.md`
- PRD-XXXX → `docs/01-product/PRD/PRD-*.md`
- STORY-XXXX → `docs/03-delivery/STORIES/STORY-*.md`
- AC-XXXX    → `docs/03-delivery/ACCEPTANCE/AC-*.md`
- TP-XXXX    → `docs/03-delivery/TEST-PLANS/TP-*.md`
- ADR-XXXX   → `docs/02-architecture/services/<servis>/ADR/ADR-*.md` (servis bazlı sayaç)
- TECH-DESIGN (ID yok) → `docs/02-architecture/services/<servis>/TECH-DESIGN-*.md`
- DATA-MODEL  (ID yok) → `docs/02-architecture/services/<servis>/DATA-MODEL-*.md`
- RB-<servis> → `docs/04-operations/RUNBOOKS/RB-*.md`

-------------------------------------------------------------------------------
12. YENİ ID ÜRETİM AKIŞI (AGENT İÇİN)
-------------------------------------------------------------------------------

Yeni doküman açarken:

1. **Türü belirle**  
   - Story mi, Acceptance mı, Test Plan mı, ADR mi?  
   - İş tipine göre doğru klasörü `DOCS-PROJECT-LAYOUT.md` üzerinden bul.  
   - Gerekirse 11. bölümdeki “ID Havuzları ve Klasör Eşleşimi” tablosuna bak.
   - Not: Acceptance ve Test Plan ID’si, ilgili STORY ID ile aynı sayıyı kullanır
     (örn. `STORY-0037` → `AC-0037` + `TP-0037`).

2. **Mevcut ID’leri tara**  
   - İlgili klasördeki dosya adlarını incele (`STORY-0001-*.md`, `STORY-0002-*.md`...).  

3. **Bir sonraki ID’yi seç**  
   - En büyük numarayı bul, +1 yap:  
     - Örn: `STORY-0001`, `STORY-0002` varsa sıradaki `STORY-0003` olur.

4. **ID registry rezervasyonu yap (SSOT)**  
   - Yeni STORY başlamadan önce `docs/03-delivery/ID-REGISTRY.tsv` içinde ilgili NUM (XXXX) rezerve edilmelidir.  
   - Bu registry, aynı NUM’un farklı branch’lerde çakışmasını önlemek için kullanılır.  

5. **Slug belirle**  
   - Konuya göre kısa ve açıklayıcı bir slug kullan:  
     - Örn: `STORY-0003-backend-keycloak-jwt-hardening.md`

6. **Çakışma kontrolü yap**  
   - `rg "STORY-0003" docs` gibi bir arama ile aynı ID’nin başka dosyada
     kullanılmadığını doğrula.

7. **ID’yi dosya içine yaz**  
   - Dokümanın ilk satırlarında `ID: STORY-0003` vb. alanıyla ID’yi sabitle.  
   - Bu alan yazıldıktan sonra ID değiştirilemez; yalnızca slug gerektiğinde
     düzeltilebilir.

-------------------------------------------------------------------------------
13. ÇAKIŞMA VE MİGRASYON KURALLARI
-------------------------------------------------------------------------------

- Aynı ID iki dosyada bulunursa:
  - Hangisinin aktif doküman olduğu belirlenir (yeni sistemdeki `docs/` altı
    tercih edilir).  
  - Diğer dosya archive-reference alana taşınır veya dosya içinde
    “legacy / migrated” notu ile işaretlenir.
- Eski ID formatlarından (örn. `QLTY-...`, `E01-S01-...`) yeni formata geçerken:
  - Eski dosya archive-reference alanda saklanır.  
  - Yeni ID ile `docs/` altında özet bir doküman oluşturulur ve içerikte
    legacy ID referans olarak belirtilir.

-------------------------------------------------------------------------------
14. AGENT İÇİN KULLANIM SIRASI
-------------------------------------------------------------------------------

Yeni bir doküman üretirken agent şu sıralamayı izlemelidir:

1. `NUMARALANDIRMA-STANDARDI.md` → Doğru ID türü ve formatı.  
2. `DOCS-PROJECT-LAYOUT.md` → Doğru klasör ve yerleşim.  
3. İlgili alan transition rehberi → İş tipine göre davranış (DOCS/WEB/BE/DATA/AI).  
4. `docs/99-templates/*.template.md` → Doğru şablon.

Bu adımlar tamamlanmadan yeni bir doküman adı/ID’si seçilmemelidir.

-------------------------------------------------------------------------------
15. ÖRNEK SENARYOLAR
-------------------------------------------------------------------------------

**Örnek 1 – Yeni Story Açma**
- Amaç: Backend dokümanlarını taşımak.  
- Adımlar:
  - Tür: Story → `STORY-XXXX`.  
  - Klasör: `docs/03-delivery/STORIES/`.  
  - Mevcut ID’ler: `STORY-0001`, `STORY-0002` → yeni ID: `STORY-0003`.  
  - Dosya adı: `docs/03-delivery/STORIES/STORY-0003-api-docs-refactor.md`.

**Örnek 2 – Yeni ADR Açma (auth-service)**
- Amaç: Auth-service için JWT rotation kararı.  
- Adımlar:
  - Tür: ADR → `ADR-XXXX`.  
  - Klasör: `docs/02-architecture/services/auth-service/ADR/`.  
  - Mevcut ID’ler: `ADR-0001`, `ADR-0002` → yeni ID: `ADR-0003`.  
  - Dosya adı: `docs/02-architecture/services/auth-service/ADR/ADR-0003-jwt-rotation-strategy.md`.
