# CODEX-CONTEXT-TEST-GUIDE – Codex Doküman Kullanımı Test Rehberi

Bu rehber, `TP-0005 – Codex Doküman/Context Kullanımı Test Planı`na göre
Codex’in doküman mimarisini parça parça okuyup doğru davranıp davranmadığını
elle test etmek için örnek prompt ve beklenen çıktı iskeletlerini içerir.

-------------------------------------------------------------------------------
1. AMAÇ
-------------------------------------------------------------------------------

- Kullanıcıya, her test senaryosu için:
  - Hangi dokümanları açıp prompt’a referans vereceğini,
  - Codex’e nasıl soru soracağını,
  - Cevapta hangi yapıyı/göstergeleri araması gerektiğini
  kısaca göstermek.

-------------------------------------------------------------------------------
2. [DOC] SENARYOSU – YENİ GUIDE DOKÜMANI
-------------------------------------------------------------------------------

- İlgili test planı: `TP-0005` madde 4.1

**Önerilen prompt (özet):**

> Aktif dosyalar:  
> - `AGENT-CODEX.docs.md`  
> - `DOCS-PROJECT-LAYOUT.md`  
> - `STYLE-DOCS-001.md`  
> - `NUMARALANDIRMA-STANDARDI.md`  
>  
> İsteğim:  
> Yeni bir “X-GUIDE” dokümanı tasarla (örn. doküman workflow rehberi) ve  
> uygun yerde yeni bir `.md` dosyası olarak ekle.  
> Kendin plan çıkar, doküman taslağını yaz ve uygulama adımlarında dosya yolu
> + dosya adını belirt.

**Beklenen çıktı iskeleti:**

- Keşif Özeti:
  - Hangi dokümanları okuyacağı, hangi klasöre yazacağı (örn.
    `docs/03-delivery/guides/`).
- Tasarım:
  - GUIDE dokümanının bölümleri (Amaç, Kapsam, Adımlar, Referanslar).
- Uygulama Adımları:
  - Örn. `docs/03-delivery/guides/NEW-GUIDE-NAME.md` dosyasını oluştur, içeriği
    şu taslağa göre yaz.

-------------------------------------------------------------------------------
3. [BE] SENARYOSU – STORY ZİNCİRİ DURUM ANALİZİ
-------------------------------------------------------------------------------

- İlgili test planı: `TP-0005` madde 4.2

**Önerilen prompt (özet):**

> Aktif dosyalar:  
> - `AGENT-CODEX.backend.md`  
> - `BACKEND-PROJECT-LAYOUT.md`  
> - `STORY-0002-backend-keycloak-jwt-hardening.md`  
> - `AC-0002-backend-keycloak-jwt-hardening.md`  
> - `TP-0002-backend-keycloak-jwt.md`  
> - `PROJECT-FLOW.md`  
>  
> İsteğim:  
> STORY-0002 için şu an hangi aşamadayız, sıradaki en mantıklı adım nedir?  
> Kendi planını çıkar ve sadece dokümanlara bakarak durumu yorumla.

**Beklenen çıktı iskeleti:**

- Keşif Özeti:
  - STORY-0002 status, AC-0002/TP-0002 durumu, PROJECT-FLOW satırı.
- Tasarım:
  - Acceptance’ta henüz `[ ]` olan maddelere göre sıradaki adımların listesi.
- Uygulama Adımları:
  - Örn. “`docs/03-delivery/TEST-PLANS/TP-0002-backend-keycloak-jwt.md` içindeki
    şu senaryoları kapsayacak ek test case’ler yazılacak” gibi dosya yolu + iş.

-------------------------------------------------------------------------------
4. [WEB] SENARYOSU – FRONTEND REHBER KULLANIMI
-------------------------------------------------------------------------------

- İlgili test planı: `TP-0005` madde 4.3

**Önerilen prompt (özet):**

> Aktif dosyalar:  
> - `AGENT-CODEX.web.md`  
> - `WEB-PROJECT-LAYOUT.md`  
> - `STYLE-WEB-001.md`  
> - `web/docs/architecture/frontend/frontend-project-layout.md`  
>  
> İsteğim:  
> Frontend monorepo’da yeni bir feature için dosya yerleşimi ve temel kod
> iskeleti öner. Sadece dokümanlara bakarak dosya/klasör yollarını ve temel
> bileşenleri söyle.

**Beklenen çıktı iskeleti:**

- Keşif Özeti:
  - `web/docs/architecture/frontend/frontend-project-layout.md`’den çıkarılan
    ana dizin yapısı.
- Tasarım:
  - Önerilen feature için hangi `web/apps/**` veya `web/packages/**` altında
    çalışılacağı.
- Uygulama Adımları:
  - Örn. “`web/apps/admin/users/` altında X dosyalarını ekle, şu component
    iskeletlerini oluştur” gibi path’ler **yalnız örnek** olmalıdır; gerçek
    app/package adı ve klasör yapısı her zaman `WEB-PROJECT-LAYOUT.md` ve
    `frontend-project-layout.md` içinden okunarak teyit edilmelidir.

-------------------------------------------------------------------------------
5. [OPS] SENARYOSU – RUNBOOK + MONITORING + RELEASE NOTES
-------------------------------------------------------------------------------

- İlgili test planı: `TP-0005` madde 4.4

**Önerilen prompt (özet):**

> Aktif dosyalar:  
> - `docs/04-operations/RUNBOOKS/RB-vault.md`  
> - `docs/04-operations/MONITORING/MONITORING-backend-services.md`  
> - `docs/04-operations/SLO-SLA.md`  
> - `docs/04-operations/RELEASE-NOTES/RELEASE-NOTES-example.md`  
>  
> İsteğim:  
> Küçük bir Vault bakım işi için yeni STORY ve ACCEPTANCE taslağı çıkar.  
> SLO-SLA, MONITORING ve RB-vault dokümanlarındaki bilgileri kullan.

**Beklenen çıktı iskeleti:**

- Keşif Özeti:
  - Vault ile ilgili metrikler, SLO’lar, runbook adımları.
- Tasarım:
  - STORY-00XX ve AC-00XX için kısa kapsam ve başarı kriterleri.
- Uygulama Adımları:
  - Örn.  
    - `docs/03-delivery/STORIES/STORY-00XX-vault-maintenance.md` oluştur.  
    - `docs/03-delivery/ACCEPTANCE/AC-00XX-vault-maintenance.md` oluştur.  
    - Gerekirse PROJECT-FLOW’a satır ekle.
