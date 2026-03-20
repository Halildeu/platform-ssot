# OPO Authority Map v1

Bu doküman, taşeron repoda OPO ve dokümantasyon yönetimi için hangi
kaynakların **canonical**, hangilerinin **transition-active**, hangilerinin ise
yalnızca **archive-reference** olduğunu tanımlar.

Amaç:
- Eski ve yeni yönetim katmanlarının birbirine karışmasını engellemek.
- Agent, workflow ve doküman değişikliklerinde hangi kaynağın kazanacağını
  açık hale getirmek.
- Yeni normatif kuralların yanlışlıkla legacy veya transition dokümanlara
  yazılmasını önlemek.

-------------------------------------------------------------------------------
## 1. CANONICAL OPO KAYNAKLARI (NORMATİF)
-------------------------------------------------------------------------------

Aşağıdaki dosyalar bu repoda OPO / managed-standards yönetimi için canonical
kaynak kabul edilir:

- `standards.lock`
- `docs/OPERATIONS/AI-MULTIREPO-OPERATING-CONTRACT.v1.md`
- `docs/OPERATIONS/ARCHITECTURE-CONSTRAINTS.md`
- `docs/OPERATIONS/CACHE-BOUNDARY-RULES.v1.md`
- `docs/OPERATIONS/CODING-STANDARDS.md`

Kurallar:
- Yeni normatif OPO kuralı önce bu katmanda tanımlanır.
- Sync / verify / gate davranışı için son karar `standards.lock` ve operating
  contract üzerinden verilir.
- Transition veya archive katmanı canonical katmanı override edemez.

-------------------------------------------------------------------------------
## 2. CURRENT DELIVERY KAYNAKLARI (CANONICAL CONTEXT)
-------------------------------------------------------------------------------

Aşağıdaki dokümanlar feature/delivery bağlamı için current kabul edilir:

- `docs/03-delivery/PROJECT-FLOW.md`
- `docs/03-delivery/STORIES/**`
- `docs/03-delivery/ACCEPTANCE/**`
- `docs/03-delivery/TEST-PLANS/**`
- `docs/04-operations/RUNBOOKS/**`
- `docs/OPERATIONS/MANAGED-REPO-CONTEXT-CONSUMPTION.v1.md`
- `docs/OPERATIONS/MULTI-PLANE-EXECUTION-MODEL.v1.md`
- `tenant/TENANT-DEFAULT/decision-bundle.v1.json`

Not:
- Bu grup delivery gerçekliğini taşır; ancak OPO governance kaynağı değildir.
- OPO düzeyinde conflict olursa `CANONICAL OPO KAYNAKLARI` kazanır.
- `tenant/TENANT-DEFAULT/decision-bundle.v1.json` core SSOT açılana kadar
  execution mirror olarak yorumlanır; canonical governance policy yerine geçmez.

-------------------------------------------------------------------------------
## 3. TRANSITION-ACTIVE KAYNAKLAR (REHBER / REDIRECT KATMANI)
-------------------------------------------------------------------------------

Aşağıdaki set halen repo içinde kullanılmaktadır; ancak canonical authority
değildir:

- `AGENTS.md`
- `AGENT-CODEX.*.md`
- `docs/00-handbook/**`
- `.github/workflows/doc-qa.yml`
- `scripts/check_governance_migration.py`
- `docs/04-operations/RUNBOOKS/RB-insansiz-flow.md`
- `docs/04-operations/RUNBOOKS/RB-codex-canonical-flow-v0.1.md`

Bu katmanın rolü:
- Domain ve tarihsel işleyiş rehberi sağlamak
- Yeni modele geçişte redirect ve compatibility yüzeyi olmak
- Canonical kaynaklara giden bağlantıları taşımak

Bu katman için zorunlu kurallar:
- Yeni normatif OPO kuralı eklenmez.
- Mevcut içerik güncellenirken bu doküman üzerindeki redirect notu korunur.
- Çelişki halinde canonical katman kazanır.

-------------------------------------------------------------------------------
## 4. ARCHIVE-REFERENCE KAYNAKLARI (READ-ONLY)
-------------------------------------------------------------------------------

Aşağıdaki alanlar yalnız referans / tarihçe / migration izi için tutulur:

- `backend/docs/legacy/**`
- `docs/ARCHIVE/**`

Kurallar:
- Yeni karar veya güncel çalışma kuralı bu alanlara yazılmaz.
- Bu alanlardan alınan bilgi, current delivery veya canonical dokümanlara
  taşınmadan normatif kabul edilmez.

-------------------------------------------------------------------------------
## 5. ÖNCELİK SIRASI (CONFLICT RESOLUTION)
-------------------------------------------------------------------------------

Conflict durumunda aşağıdaki sıra kullanılır:

1. `CANONICAL OPO KAYNAKLARI`
2. `CURRENT DELIVERY KAYNAKLARI`
3. `TRANSITION-ACTIVE KAYNAKLAR`
4. `ARCHIVE-REFERENCE KAYNAKLARI`

Yorum:
- `AGENTS.md` ve `AGENT-CODEX.*` yalnızca yönlendirme / domain rehberi sağlar.
- `backend/docs/legacy/**` hiçbir durumda doğrudan authority değildir.

-------------------------------------------------------------------------------
## 6. GEÇİŞ KURALLARI
-------------------------------------------------------------------------------

- Eski authority dosyaları silinmeden önce inbound referansları azaltılır.
- Transition-active dosyaların üst kısmında redirect / non-canonical notu
  bulunur.
- Yeni kontrol / gate / doğrulama script’leri mümkünse canonical katmana
  referans verir.
- Ana repo current baseline farkları, authority cleanup tamamlandıktan sonra
  managed sync ile kapatılır.

-------------------------------------------------------------------------------
## 7. ÖZET
-------------------------------------------------------------------------------

- OPO yönetimi için normatif kaynaklar `standards.lock` ve
  `docs/OPERATIONS/*` katmanıdır.
- `AGENT-CODEX.*` ve `docs/00-handbook/**` artık transition-active rehber
  katmanıdır.
- Managed repo execution baglami icin `MANAGED-REPO-CONTEXT-CONSUMPTION`,
  `MULTI-PLANE-EXECUTION-MODEL` ve `tenant/.../decision-bundle.v1.json`
  current-context katmaninda okunur.
- `backend/docs/legacy/**` ve `docs/ARCHIVE/**` read-only archive-reference
  alanıdır.
