# STORY-0050 – PR Bot Automation v0.1 (Auto PR + Comment Upsert)

ID: STORY-0050-pr-bot-automation-v0-1  
Epic: OPS  
Status: Planned  
Owner: @team/ops  
Upstream: docs/00-handbook/DOCS-WORKFLOW.md, docs/00-handbook/DEV-GUIDE.md, docs/99-templates/RUNBOOK.template.md  
Downstream: AC-0050, TP-0050

## 1. AMAÇ

- `fix/**` ve `wip/**` branch push’larında PR açma + marker comment upsert işini otomatikleştirmek.
- Docflow zincirinin (next → QA → chain check) “elle komut/yorum” ihtiyacı olmadan akmasını sağlamak.

## 2. TANIM

- Bir platform geliştiricisi olarak, branch push’larıyla otomatik PR ve tekil (idempotent) yorum güncellemesi istiyorum; böylece review süreci standart ve tekrarlanabilir olsun.

## 3. KAPSAM VE SINIRLAR

Dahil:
- GitHub Actions workflow: `.github/workflows/pr-bot.yml`
- PR bot script’i: `scripts/pr_bot.py` (stdlib + argparse)
- SSOT kural seti: `docs/04-operations/PR-BOT-RULES.json`
- Yorum şablonları: `docs/04-operations/pr-bot-templates/*.md`
- Runbook: `docs/04-operations/RUNBOOKS/RB-pr-bot.md`
- Güvenlik modeli:
  - Primary: `GITHUB_TOKEN` (minimum permissions)
  - Fallback (opsiyonel): `secrets.GH_PR_BOT_TOKEN` (fine-grained)
- İdempotency:
  - Tek marker comment (`<!-- pr-bot:rules -->`) üzerinden upsert
- `wip/**` için Draft policy (best-effort)

Hariç:
- Repo secret güncelleme/sync (vault-secrets-sync kapsam dışı)
- Merge otomasyonu / auto-approve

## 4. ACCEPTANCE KRİTERLERİ

Detaylı Given/When/Then senaryoları AC-0050 dokümanındadır.

## 5. BAĞIMLILIKLAR

- Repo/Org “workflow permissions” politikası (`GITHUB_TOKEN` write kısıtı ihtimali)
- Mevcut doc QA script seti ve SSOT yaklaşımı (`docflow_next`, `check_*`)

## 6. ÖZET

- `fix/**`/`wip/**` push → PR create + marker comment upsert
- Kurallar SSOT: `PR-BOT-RULES.json`, yorum içerikleri template’ler üzerinden
- Draft policy: `wip/**` için best-effort

## 7. LİNKLER (İSTEĞE BAĞLI)

- Acceptance: `docs/03-delivery/ACCEPTANCE/AC-0050-pr-bot-automation-v0-1.md`  
- Test Plan: `docs/03-delivery/TEST-PLANS/TP-0050-pr-bot-automation-v0-1.md`

