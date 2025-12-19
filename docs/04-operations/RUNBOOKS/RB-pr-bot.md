# RB-pr-bot – PR Bot (Auto PR + Comment Upsert)

ID: RB-pr-bot  
Service: github-actions-pr-bot  
Status: Draft  
Owner: @team/platform

-------------------------------------------------------------------------------
1. AMAÇ
-------------------------------------------------------------------------------

- `fix/**` ve `wip/**` branch push’larında PR yoksa `main`’e PR açmak.
- PR üzerinde tek bir marker comment’ini idempotent şekilde upsert etmek.
- `wip/**` için PR’ı Draft yapmak (mümkünse).
- Rule `auto_merge=true` ise PR için auto-merge enable etmek (best-effort).

-------------------------------------------------------------------------------
2. KAPSAM
-------------------------------------------------------------------------------

- Trigger scope:
  - push: `fix/**`, `wip/**`, `docs/**`, `ops/**`
  - manuel: `workflow_dispatch`
- SSOT:
  - Kurallar: `docs/04-operations/PR-BOT-RULES.json`
  - Template’ler: `docs/04-operations/pr-bot-templates/*.md`
  - Marker: `<!-- pr-bot:rules -->`
- Kapsam dışı:
  - Fork repo’larda otomasyon (güvenlik nedeniyle koşmaz).
  - PAT zorunluluğu (yalnız org/repo policy `GITHUB_TOKEN write` kısıtlıysa opsiyonel fallback).

-------------------------------------------------------------------------------
3. BAŞLATMA / DURDURMA
-------------------------------------------------------------------------------

- Başlatma (otomatik):
  - `fix/**` veya `wip/**` branch’ine push → workflow tetiklenir.
- Başlatma (manuel):
  - GitHub Actions → “PR Bot” → Run workflow.
- Durdurma / devre dışı bırakma:
  - `.github/workflows/pr-bot.yml` workflow’u disable et veya branch filter’ını kaldır.

-------------------------------------------------------------------------------
4. GÖZLEMLEME / LOG / METRİKLER
-------------------------------------------------------------------------------

- Gözlem:
  - GitHub Actions run logs.
  - Job “Step Summary” içinde PR URL ve yapılan aksiyonlar (create/update/noop).
- Kritik sinyaller:
  - 401/403: auth/permission sorunu (token veya org policy).
  - 4xx/5xx: GitHub API hata dönüşleri (rate limit, permission, invalid payload).

-------------------------------------------------------------------------------
5. ARIZA DURUMLARI VE ADIMLAR
-------------------------------------------------------------------------------

- [ ] Arıza senaryosu 1 – 401/403 (token/permission):
  - Given: Workflow koşuyor ama PR create/comment API’si 401/403 dönüyor.  
    When: `GITHUB_TOKEN` write izinleri repo/org policy ile kısıtlı.  
    Then:
    - Repo Settings → Actions → “Workflow permissions” kontrol et (read-only olabilir).
    - Gerekirse `secrets.GH_PR_BOT_TOKEN` (fine-grained) tanımla ve scope’u minimum tut.

- [ ] Arıza senaryosu 2 – Duplicate comment:
  - Given: PR’da birden fazla bot yorumu oluşuyor.  
    When: Marker satırı comment body’de yok veya değişmiş.  
    Then:
    - `PR-BOT-RULES.json` içindeki `comment_marker` sabit kalsın.
    - Template’lerde marker yazma; marker yalnız bot tarafından prepend edilmeli.

- [ ] Arıza senaryosu 3 – Draft set edilemiyor:
  - Given: `wip/**` için PR draft olmalı.  
    When: GraphQL mutation yetkisi yok veya API hata dönüyor.  
    Then:
    - Draft dönüşümü “best-effort” olarak kalır; comment upsert devam eder.
    - Gerekirse PR’a “draft” niyetini belirten bir label/comment eklenir (fallback).

- [ ] Arıza senaryosu 4 – Auto-merge enable edilemiyor:
  - Given: Rule `auto_merge=true` ve PR draft değil.  
    When: Repo ayarında “Allow auto-merge” kapalı veya permission yetersiz.  
    Then:
    - Repo Settings → Pull Requests → “Allow auto-merge” açık mı kontrol et.
    - Permission/policy kısıtında `GH_PR_BOT_TOKEN` fallback’i değerlendir.

-------------------------------------------------------------------------------
6. ÖZET
-------------------------------------------------------------------------------

- Güvenlik modeli: Primary `GITHUB_TOKEN`, policy kısıtında opsiyonel `GH_PR_BOT_TOKEN`.
- SSOT dosyası ve template’ler değiştiğinde, bot davranışı deterministik olarak güncellenir.

-------------------------------------------------------------------------------
7. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Workflow: .github/workflows/pr-bot.yml
- SSOT: docs/04-operations/PR-BOT-RULES.json
- Templates: docs/04-operations/pr-bot-templates/
- SLO/SLA: docs/04-operations/SLO-SLA.md
