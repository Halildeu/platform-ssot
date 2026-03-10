# TEST-PLAN – Governance Migration Check

ID: TP-0029  
Story: STORY-0029-governance-migration-check
Status: Done  
Owner: @team/platform-arch

Not: Aşağıdaki başlıklar ve sıralama **zorunludur**. Yeni bir Test Plan
yazılırken bu H2 başlıkları ve numaraları bire bir korunmalı; agent sadece
bu başlıkların altını doldurabilir.

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- Governance migration kontrol script’inin AC-0029’da tanımlanan senaryolara
  göre doğru çalıştığını doğrulamak.

-------------------------------------------------------------------------------
## 2. KAPSAM
-------------------------------------------------------------------------------

- Legacy governance dokümanları:  
  - `backend/docs/legacy/root/05-governance/FEATURE_REQUESTS.md`  
  - `backend/docs/legacy/root/05-governance/PROJECT_FLOW.md`  
- Yeni sistem: `docs/03-delivery/PROJECT-FLOW.md` ve ilişkili STORY/AC/TP
  dokümanları.

-------------------------------------------------------------------------------
## 3. STRATEJİ
-------------------------------------------------------------------------------

- Legacy dokümanlarda “taşınmamış” governance maddeleri içeren bir durum
  ile script’i çalıştırmak ve beklenen öneri listesini doğrulamak.  
- Taşındığı bilinen maddeler için script’in bunları tekrar önermemesini
  kontrol etmek.  
- Gerekirse küçük örnek legacy maddeleri ekleyip script’in tepkisini
  gözlemlemek.

-------------------------------------------------------------------------------
## 4. TEST SENARYOLARI ÖZETİ
-------------------------------------------------------------------------------

- [x] Taşınmamış governance maddeleri için öneri listesi.  
- [x] Zaten taşınmış maddelerin tekrar önerilmemesi.  
- [x] Boş veya tamamen taşınmış backlog durumunda “eksik governance yok”
  çıktısı.

-------------------------------------------------------------------------------
## 5. ÇEVRE VE ARAÇLAR
-------------------------------------------------------------------------------

- Python 3 çalışma ortamı.  
- `scripts/check_governance_migration.py` (veya eşdeğer governance kontrol
  script’i).  
- Legacy ve yeni governance dokümanları.

-------------------------------------------------------------------------------
## 6. RİSKLER / ÖNCELİKLER
-------------------------------------------------------------------------------

- Legacy doküman formatındaki değişiklikler script’in parsing mantığını
  bozabilir; bu nedenle script esnek ama kontrollü yazılmalıdır.  
- Yanlış eşleşmeler (false positive/negative), governance önceliklendirme
  kararlarını olumsuz etkileyebilir.

-------------------------------------------------------------------------------
## 7. ÖZET
-------------------------------------------------------------------------------

- Bu test planı, governance migration script’inin legacy backlog ile yeni
  Story sistemi arasındaki ilişkiyi doğru okuyup eksik maddeleri güvenilir
  şekilde raporlayabildiğini doğrular.
- 2026-03-09 doğrulamasında script beklenen davranışı üretmiş ve mevcut repo
  durumu için `eksik governance yok` sonucu vermiştir.

-------------------------------------------------------------------------------
## 8. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Story: docs/03-delivery/STORIES/STORY-0029-governance-migration-check.md  
- Acceptance: docs/03-delivery/ACCEPTANCE/AC-0029-governance-migration-check.md  
