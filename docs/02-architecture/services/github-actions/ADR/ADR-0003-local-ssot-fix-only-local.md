# ADR-0003 – Local SSOT: Fix Only Local

ID: ADR-0003  
Status: Proposed  
Tarih: 2025-12-22  
Sahip: @team/platform

## Context

Repo’da otomasyon (PR bot, ci-gate, log-digest, merge-bot) ile hedeflenen akış “insansız + kalite kapısı”dır.
Ancak CI FAIL durumunda otomatik olarak commit/PR üreten yaklaşımlar:
- SSOT’un dağılmasına (farklı yerlerde farklı “gerçek”) ve iz sürme zorluğuna,
- Token/permission kaynaklı nondeterministic davranışlara,
- “Kim, neyi, neden değiştirdi?” sorusunun zayıflamasına,
neden olabilmektedir.

Bu nedenle fix üretimi için tek bir SSOT tanımı ve tek bir operasyonel pratik gerekir.

## Decision

1) SSOT = local repo çalışma kopyasıdır  
- Düzeltme/patch yalnızca localde üretilir.
- GitHub Actions hiçbir koşulda fix commit/branch/PR üretmez.

2) GitHub = doğrulama + raporlama katmanıdır  
- `ci-gate` tek required check sinyali üretir.
- `log-digest` yalnız teşhis (ilk hata bloğu) yazar.
- `pr-merge` yalnız merge koşullarını sağlıyorsa squash merge eder.

3) Local fix döngüsü standardı  
- Akış: push → CI watch → log pull → local fix (Codex) → push → PASS
- Scriptler:
  - `scripts/ci_pull_logs.sh` (FAILURE.md üretir)
  - `scripts/autopilot_local.sh` (watch → fix → push döngüsü)

4) Token SSOT (Vault)  
- Vault KV v2 path: `secret/<env>/ops/github`
- Fields:
  - `GH_SECRETS_SYNC_TOKEN`: Vault→GitHub Secrets sync (write)
  - `GH_LOCAL_AUTOPILOT_TOKEN`: local CI watcher + PR comment/label (read/write)
- KV v2 güncelleme kuralı: tek field değişimi için `vault kv patch`; `vault kv put` tüm secret’i overwrite eder.

## Consequences

Artılar:
- Fix üretimi tek yerde olur (local), denetlenebilirlik artar.
- CI katmanı deterministik kalır (doğrulama/raporlama).
- Token/permission problemleri “fix üretimi”ni etkilemez; yalnız raporlamayı etkiler.

Eksiler/Riskler:
- Localde fix üretemeyen durumlarda akış durur (insan müdahalesi gerekir).
- Local toolchain (gh/vault/codex) kurulumu ve erişimi gerektirir.

Mitigasyon:
- Runbook ile net operasyon adımları ve stop koşulları tanımlanır.
- “Local SSOT Policy (Mandatory)” bölümü ile istisnalar ve token modeli standartlaştırılır.

## Linkler

- Runbook: docs/04-operations/RUNBOOKS/RB-insansiz-flow.md  
- Runbook: docs/04-operations/RUNBOOKS/RB-pr-bot.md  
- Runbook: docs/04-operations/RUNBOOKS/RB-log-digest.md  
- Script: scripts/autopilot_local.sh  
- Script: scripts/ci_pull_logs.sh  
