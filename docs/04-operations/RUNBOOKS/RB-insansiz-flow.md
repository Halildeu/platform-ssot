# RB-insansiz-flow – İnsansız Akış (PR Bot → ci-gate → log-digest → Local Autopilot → Merge Bot → Deploy → Validate → Rollback)

ID: RB-insansiz-flow  
Service: github-actions  
Status: Draft  
Owner: @team/platform

-------------------------------------------------------------------------------
1. AMAÇ
-------------------------------------------------------------------------------

- İnsan müdahalesi olmadan (insansız) PR akışını deterministik hale getirmek:
  - Push → PR oluştur/güncelle (PR Bot)
  - Tek required check: `ci-gate`
  - FAIL → otomatik failure digest (log-digest) + local autopilot (lokalde fix)
  - PASS → label gate ile otomatik squash merge (PR Merge Bot)
  - Merge → main deploy (web/backend) + post-deploy validate
  - Validate FAIL → rollback + incident kaydı
  - Sonuç: PR Conversation’da marker’lı tek comment’lerle izlenebilirlik

-------------------------------------------------------------------------------
2. KAPSAM
-------------------------------------------------------------------------------

- Repo: `Halildeu/platform-ssot`
- Branch scope:
  - `docs/**`, `fix/**` → `merge_policy=bot_squash` (insansız merge adayı)
  - `wip/**` → draft (merge kapalı)
  - `ops/**` → default `merge_policy=none` (merge kapalı)
- SSOT kaynakları:
  - Flow: `docs/03-delivery/PROJECT-FLOW.tsv` (+ render: `docs/03-delivery/PROJECT-FLOW.md`)
  - ID rezervasyonu: `docs/03-delivery/ID-REGISTRY.tsv`
    - Kural: Yeni STORY başlamadan önce ilgili `STORY/AC/TP` NUM (XXXX) bu registry’de rezerve edilir.
  - Delivery zinciri: `docs/03-delivery/STORIES/`, `docs/03-delivery/ACCEPTANCE/`, `docs/03-delivery/TEST-PLANS/`
  - PR bot kuralları: `docs/04-operations/PR-BOT-RULES.json`
  - Runbook’lar: bu doküman + `RB-pr-bot` + `RB-log-digest`
- Kapsam dışı:
  - Fork repo’larda otomasyon (güvenlik nedeniyle çalışmaz).
  - Branch rules “required reviews” gibi manuel onay gerektiren policy’ler (insansız merge’i bloklar).
  - Prod deploy hedeflerinin detayları (hook/ssh/runner) secrets ile yönetilir.
    - `DEPLOY_ENABLED=true` iken gerekli deploy/validate parametreleri eksikse workflow FAIL eder (silent PASS yok).
    - `DEPLOY_ENABLED!=true` ise deploy/validate job’ları **skip** olur.

-------------------------------------------------------------------------------
3. BAŞLATMA / DURDURMA
-------------------------------------------------------------------------------

- Doğal akış (otomatik):
  1) Branch’e push yapılır.
  2) PR Bot:
     - PR yoksa `main`’e PR açar; varsa günceller.
     - `<!-- pr-bot:rules -->` marker comment’ini upsert eder (spam yok).
     - (merge adayı ise) `pr-bot/ready-to-merge` label’ını best-effort ekler.
  3) `ci-gate`:
     - PR’da always-run çalışır ve tek required check sinyali olarak kullanılır.
  4) FAIL ise:
     - log-digest workflow’u tetiklenir ve `<!-- log-digest:v1 -->` comment’ini upsert eder.
     - Local autopilot devreye alınır: `scripts/ci_pull_logs.sh` → `scripts/autopilot_local.sh`.
       - Varsayılan: sadece required check’leri izler (`ci-gate`).
       - Opsiyonel (any-fail): `AUTOPILOT_ANY_FAIL=1` ile **herhangi bir failing check** fix döngüsünü tetikler.
       - Codex dispatcher (önerilen): `AUTOPILOT_FIX_CMD="bash scripts/codex_fix_runner.sh"` (allowlist + limit guardrails).
     - Local Ops Start/Stop (tek komut, UI yok):
       - Start: `bash scripts/ops/local_ops_start.sh`
       - Status: `bash scripts/ops/local_ops_status.sh`
       - Stop: `bash scripts/ops/local_ops_stop.sh`
  5) PASS ise:
     - PR Merge Bot workflow’u tetiklenir, label gate + checks yeşil ise squash merge dener.
     - `<!-- pr-merge:result -->` comment’i sonucu yazar (merged/noop + reason + run link).
  6) Merge sonrası (push main):
     - Web değiştiyse: `deploy-web` çalışır (**DEPLOY_ENABLED=true** ise; aksi halde job skip).
     - Backend değiştiyse: `deploy-backend` çalışır (**DEPLOY_ENABLED=true** ise; aksi halde job skip).
  7) Deploy sonrası:
     - `post-deploy-validate` çalışır (**DEPLOY_ENABLED=true** ise; aksi halde job skip).
     - FAIL ise `rollback` tetiklenir ve `<!-- incident:v1 -->` comment’i basar.

  - Durdurma / kill switch:
  - Workflow disable:
    - `.github/workflows/pr-bot.yml`
    - `.github/workflows/ci-gate.yml`
    - `.github/workflows/log-digest.yml`
    - `.github/workflows/auto-fix.yml` (local SSOT policy nedeniyle disabled)
    - `.github/workflows/pr-merge.yml`
    - `.github/workflows/deploy-web.yml`
    - `.github/workflows/deploy-backend.yml`
    - `.github/workflows/post-deploy-validate.yml`
    - `.github/workflows/rollback.yml`
  - Merge’i kapat (SSOT): `docs/04-operations/PR-BOT-RULES.json` içinde ilgili `match` için `merge_policy=none`.
  - Secrets kill switch (önerilen):
    - `DEPLOY_ENABLED` (true/false)
    - `ROLLBACK_ENABLED` (true/false)
    - Kaynak: Vault KV v2 (SSOT) → GitHub Secrets (Actions) sync: `.github/workflows/vault-secrets-sync.yml` (`mode=killswitch`).
    - Değer formatı: string `"true"` / `"false"` (hardening uyumu).
  - Parametre zorunluluğu (hardening):
    - `DEPLOY_ENABLED=true` iken:
      - Web deploy için `WEB_DEPLOY_HOOK_URL` zorunludur (yoksa `deploy-web` FAIL).
      - Post-deploy validate için `WEB_SMOKE_URL` ve `BACKEND_HEALTH_URLS` zorunludur (yoksa `post-deploy-validate` FAIL).
    - `ROLLBACK_ENABLED=true` iken:
      - `WEB_ROLLBACK_HOOK_URL` ve `BACKEND_ROLLBACK_HOOK_URL` zorunludur (yoksa `rollback` FAIL).

-------------------------------------------------------------------------------
3.1 LOCAL SSOT POLICY (MANDATORY)
-------------------------------------------------------------------------------

- Fix/patch yalnızca **local** ortamda üretilir (Codex).
- GitHub Actions hiçbir koşulda fix commit’i üretmez.
- CI fail durumunda kullanılacak tek mekanizma:
  - `scripts/ci_pull_logs.sh`
  - `scripts/autopilot_local.sh`
- Merge otomatik (Merge Bot) kalır.
- `log-digest` sadece teşhis (digest) yazar.

### Genel İş Yapış (SSOT)
- Önce deterministik scriptler: kontrol/rapor/gate/queue/tracker (tekrar üretilebilir sonuç).
- Yetmezse Codex: yalnız allowlist + limitler içinde düzenleme/implementasyon.
- Her fix localde yapılır: local validate → commit → push. (GitHub-side auto-fix yok.)
- needs-human (token/permission/infra/approval): Codex yalnız teşhis/kanıt üretir, otomatik fix yapmaz.

### Auto Merge Conflict Resolve (Local)
- `mergeable_state=dirty` = PR branch’i `main` ile conflict’te (CI kırılabilir / merge mümkün değil).
- Opsiyonel: `AUTOPILOT_AUTO_CONFLICT=1` → `scripts/resolve_merge_conflicts.py` otomatik çözüm dener.
- Allowlist dışı conflict (örn. `web/**`, `backend/**`) → otomatik çözülmez → **needs-human** (manuel çözüm).
- Kural seti (v0.1): `docs/**, scripts/**` (ours), `.github/workflows/**` (theirs), `.gitignore` (union).

- Örnek token export (değer loglanmaz):
  - `export GH_TOKEN="$(vault kv get -field=GH_SECRETS_SYNC_TOKEN 'secret/stage/ops/github')"`
  - Not: gerçek Vault path kurumunuzdaki SSOT’a göre değişebilir.

-------------------------------------------------------------------------------
4. GÖZLEMLEME / LOG / METRİKLER
-------------------------------------------------------------------------------

- Operasyonel kanıtlar (PR Conversation):
  - `<!-- pr-bot:rules -->`: PR Bot çalıştı + rule/template uygulandı.
  - `<!-- log-digest:v1 -->`: FAIL için “ilk hata bloğu” çıkarıldı (comment upsert, spam yok).
  - `<!-- pr-merge:result -->`: Merge Bot sonucu (merged/noop + reason).
  - `<!-- incident:v1 -->`: Deploy/validate sonrası rollback/incident kaydı (best-effort).
- Ek kanıtlar:
  - PR checks: `ci-gate` (required check).
  - GitHub Actions “Step Summary” (PR Bot / PR Merge Bot).
- Minimum metrikler (manuel gözlem):
  - `ci-gate` success rate
  - “time-to-merge”: `ci-gate` PASS → squash merge

-------------------------------------------------------------------------------
5. ARIZA DURUMLARI VE ADIMLAR
-------------------------------------------------------------------------------

Edge-case tablosu (v0.1):

| Durum | Belirti | Beklenen comment | Tek satır aksiyon |
|---|---|---|---|
| Missing label | `<!-- pr-merge:result -->` → `noop (missing ready label)` | pr-merge result comment | `pr-bot/ready-to-merge` label ekle → `ci-gate` rerun |
| Behind / out-of-date | `noop (mergeable_state=behind)` veya PR “Update branch” uyarısı | pr-merge result comment | PR → Update branch → `ci-gate` rerun |
| Cancelled run | log-digest comment içinde “run cancelled” notu | log-digest comment | İlgili check’i rerun et; asıl FAIL run linkinden doğrula |
| Local policy | Auto-fix workflow disabled | (comment yok) | Local autopilot kullan |
| Deploy disabled | Deploy job’ları skip | (comment yok) | `DEPLOY_ENABLED=true` ayarla |
| Validate FAIL | rollback workflow tetiklenir | `<!-- incident:v1 -->` | Hedef URL/secrets kontrol et; ardından deploy/validate rerun |

- [ ] Arıza senaryosu 1 – Ready label eksik:
  - Given: PR `merge_policy=bot_squash` kapsamında ama label yok.  
    When: PR Merge Bot `noop (missing ready label)` döner.  
    Then:
    - PR Bot’un `issues: write` permission’ını kontrol et.
    - Gerekirse label’ı manuel ekle ve `ci-gate` rerun et.

- [ ] Arıza senaryosu 2 – PR behind/out-of-date:
  - Given: PR açık ama `mergeable_state=behind`.  
    When: PR Merge Bot merge denemez (noop).  
    Then: PR’da “Update branch” yap ve `ci-gate` rerun et.

- [ ] Arıza senaryosu 3 – Cancelled run / log download yok:
  - Given: workflow_run `cancelled`.  
    When: log-digest “logs not downloaded” notu basar.  
    Then: İlgili check’i rerun et; yeni FAIL run üzerinden digest üretilecektir.

- [ ] Arıza senaryosu 4 – Checks not green:
  - Given: `ci-gate` PASS değil veya başka check-run’lar kırmızı.  
    When: PR Merge Bot `noop (checks not green)` döner.  
    Then: Kırmızı check’i düzelt; PR’da `ci-gate` rerun et.

- [ ] Arıza senaryosu 5 – Local autopilot:
  - Given: `ci-gate` FAIL var.  
    When: Local autopilot çalıştırılmadı.  
    Then:
    - `log-digest` comment’inden “ilk hata bloğu”nu al.
    - `scripts/ci_pull_logs.sh` ile `FAILURE.md` üret.
      - v0.1: PR head SHA için **tüm failing workflow run** loglarını indirir ve tek digest üretir.
    - `scripts/autopilot_local.sh` ile fix döngüsünü sürdür.
      - opsiyonel: `AUTOPILOT_ANY_FAIL=1` (ci-gate dışı fail’leri de fix döngüsüne dahil eder).

-------------------------------------------------------------------------------
6. ÖZET
-------------------------------------------------------------------------------

- Tek required check: `ci-gate`.
- FAIL görünürlüğü: `<!-- log-digest:v1 -->` + local autopilot (lokalde fix).
- PASS + label gate: Merge Bot squash merge; sonuç `<!-- pr-merge:result -->`.
- Merge sonrası: deploy → validate → rollback (kill-switch ile; incident marker: `<!-- incident:v1 -->`).

-------------------------------------------------------------------------------
7. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- SSOT: docs/04-operations/PR-BOT-RULES.json
- Runbook: docs/04-operations/RUNBOOKS/RB-pr-bot.md
- Runbook: docs/04-operations/RUNBOOKS/RB-log-digest.md
- Workflow: .github/workflows/pr-bot.yml
- Workflow: .github/workflows/ci-gate.yml
- Workflow: .github/workflows/pr-merge.yml
- Workflow: .github/workflows/log-digest.yml
- Workflow: .github/workflows/auto-fix.yml
- Workflow: .github/workflows/deploy-web.yml
- Workflow: .github/workflows/deploy-backend.yml
- Workflow: .github/workflows/post-deploy-validate.yml
- Workflow: .github/workflows/rollback.yml
- Script: scripts/ci_pull_logs.sh
- Script: scripts/autopilot_local.sh
- Script: scripts/codex_fix_runner.sh
- Script: scripts/pr_tracker_tsv.py
- Script: scripts/autopilot_queue.py
- Script: scripts/autopilot_orchestrator.py
- STORY: docs/03-delivery/STORIES/STORY-0302-release-deploy-e2e-v0-1.md
- ACCEPTANCE: docs/03-delivery/ACCEPTANCE/AC-0302-release-deploy-e2e-v0-1.md
- STORY: docs/03-delivery/STORIES/STORY-0303-autopilot-auto-fix-deploy-rollback-v0-1.md
- ACCEPTANCE: docs/03-delivery/ACCEPTANCE/AC-0303-autopilot-auto-fix-deploy-rollback-v0-1.md
- TEST-PLAN: docs/03-delivery/TEST-PLANS/TP-0303-autopilot-auto-fix-deploy-rollback-v0-1.md
- Related: docs/03-delivery/STORIES/STORY-0304-autopilot-auto-fix-deploy-rollback-v0-1.md
