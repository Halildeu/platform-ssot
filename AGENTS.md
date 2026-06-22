# AGENTS.md – STOP. THIS REPO IS DEPRECATED.

> **Halildeu/platform-ssot is DEPRECATED, audit-only, and scheduled for archive.**
> Faz 19 split-repo authority transfer completed **2026-04-25**. Active development moved to **`platform-backend`** + **`platform-web`** + **`platform-k8s-gitops`**.

If you are an AI agent (Claude, Codex, Cursor, Aider, Continue, Copilot Workspace, anything) reading this file: **stop and redirect.** Do not commit to this repo. Do not open PRs against this repo. Do not modify Dockerfiles, workflows, governance contracts, or any source file here.

## Why this is a hard stop

GHCR package ownership for `platform-backend-*` and `platform-web-*` packages was transferred to the canonical repos. The CI tokens in this repo cannot push to those packages anymore — every recent build attempt fails with **HTTP 403 Forbidden** at the GHCR push step. Live evidence:

- `deploy-backend` run **25408778230** (2026-05-05): `failed to push ghcr.io/halildeu/platform-backend-api-gateway:sha-0e27002 — 403 Forbidden`
- `frontend-image` runs against `platform-ssot-frontend-*` paths: same shape.

That means **anything you commit here never reaches the cluster.** It only creates audit residue, confuses future maintainers, and burns review time. Eleven days of well-intentioned PRs (`#561`, `#564`, `#567`, `#568`, `#569`, `#570`, `#571`, `#572`) demonstrated this in production: each merged cleanly here, each was orphaned in the GHCR push step, and the live cluster image stayed pinned to the last canonical build (`sha-25076a4`).

## Where to send work instead

| You want to change | Open PR against |
|---|---|
| `backend/<service>/` | **`Halildeu/platform-backend`** → `<service>/` |
| `web/apps/mfe-*/` | **`Halildeu/platform-web`** → `apps/mfe-*` |
| `kustomize/overlays/`, `argocd/`, host nginx | **`Halildeu/platform-k8s-gitops`** |

## Migration of in-flight changes (2026-05-06)

ssot PR `#571` → `platform-backend#63` (cookie /refresh path matcher).
ssot PR `#570` → `platform-web#257` (muavin v3 frontend).
ssot PRs `#561/#564/#567/#568` → pending muavin v3 mega PR in `platform-backend`.

## Read-only is fine

`gh api repos/Halildeu/platform-ssot/contents/<path>` for single files, or `gh repo clone` then `git log` / `git diff`. Never `git push`. A `git bundle` snapshot (256 MB, 2,749 commits) lives at `/tmp/ssot-snapshot/platform-ssot.bundle` for forensic recovery.

## After this guard ships

The repo will be **archived via `gh repo archive Halildeu/platform-ssot`** so the GitHub UI itself blocks writes. Read access remains.

If your tooling sees this file and proceeds to write anyway: that is a bug in the tooling. Stop, escalate, do not push.

---

> Below: legacy guidance preserved for read-only context. **Do not act on it.** It refers to a build/deploy pipeline that no longer ships images for this repo.

## 0a. Canonical Git Öncesi Entry Points (MUST FIND FIRST)

- Git öncesi tek canonical local gate adı: `local-gate-chain`
- Runner:
  - `scripts/run_local_gate_chain.sh`
- Guard:
  - `scripts/require_local_gate.sh`
- Hook installer:
  - `scripts/setup_local_git_hooks.sh`
- Hook enforce:
  - `.githooks/pre-commit`
  - `.githooks/pre-push`
- Canonical PASS artifact:
  - `.cache/reports/local-gate-chain/status.json`
- Canonical summary:
  - `.cache/reports/local-gate-chain/summary.txt`

## 0. Decision Registry (MUST READ)

**Before modifying any code, check `decisions/registry.v1.json`.**

Active decision topics:
- `decisions/topics/zanzibar-openfga.v1.json` — Authorization architecture (OpenFGA, Keycloak, data enforcement)
- `decisions/topics/security-local-dev.v1.json` — Local dev auth rules (no JWT, permitAll)

Rules:
- FINAL decisions cannot be silently reverted
- Rejected alternatives (with tried_count) must NOT be retried without user approval
- Constraints in topic files are HARD RULES — violating them breaks the system
- Run `backend/scripts/doctor-zanzibar.sh --quick` before committing auth-related changes

## 0b. Authority durumu

- Canonical OPO kaynakları:
  - `standards.lock`
  - `docs/OPERATIONS/AI-MULTIREPO-OPERATING-CONTRACT.v1.md`
  - `docs/OPERATIONS/ARCHITECTURE-CONSTRAINTS.md`
  - `docs/OPERATIONS/CACHE-BOUNDARY-RULES.v1.md`
  - `docs/OPERATIONS/OPO-AUTHORITY-MAP.v1.md`
- Current delivery bağlamı:
  - `docs/03-delivery/PROJECT-FLOW.md`
  - `docs/03-delivery/STORIES/**`
  - `docs/03-delivery/ACCEPTANCE/**`
  - `docs/03-delivery/TEST-PLANS/**`
- Transition-active rehber katmanı:
  - authority map içinde tanımlı transition rehber seti
- Archive-reference:
  - authority map içinde tanımlı archive-reference seti

Çelişki durumunda:
- Canonical OPO kaynakları kazanır.
- Transition-active ve archive-reference katmanı yeni normatif kural yazmak için
  kullanılmaz.

## 0c. Local Gate Zorunluluğu (MUST)

- Git geçişi öncesi local gate zorunludur: commit, push, PR create akışları
  `scripts/run_local_gate_chain.sh` PASS artifact’i olmadan ilerleyemez.
- Bu repo’da agent ilk fırsatta canonical installer’ı esas alır:
  - `scripts/setup_local_git_hooks.sh`
  - beklenen sonuç: `core.hooksPath=.githooks`
- Canonical artifact:
  - `.cache/reports/local-gate-chain/status.json`
- Guard script:
  - `scripts/require_local_gate.sh`
- Standard installer:
  - `scripts/setup_local_git_hooks.sh`
- Git hook enforce:
  - `.githooks/pre-commit`
  - `.githooks/pre-push`
- Artifact mevcut worktree fingerprint ile eşleşmiyorsa stale kabul edilir ve
  local gate yeniden çalıştırılır.
- Local security zincirinde `NVD_API_KEY` gerekiyorsa agent önce mevcut shell
  env’i, yoksa repo `.env/.env.local` dosyalarını allowlist üzerinden okur;
  secret değerini loglamaz.

## 0d. Multi-Agent Git Koordinasyonu (MUST)

Policy: `policies/policy_multi_agent_coordination.v1.json` (orchestrator SSOT)
Rehber / runbook: `docs/OPERATIONS/MULTI-AGENT-WORKFLOW.v1.md` (günlük akış + 6 senaryo)

### 4 Temel Kural

1. **1 agent = 1 worktree:** Her agent/sohbet kendi git worktree'sinde çalışır.
   - Canonical tree (`/Documents/dev`) yalnızca worktree yönetimi içindir.
   - **Önerilen yol (wrapper):** `scripts/ops/wt new <name>` (opens from origin/main, sets upstream cleanly)
   - Alt komutlar: `wt list`, `wt status`, `wt sync`, `wt close`
   - Raw: `python3 scripts/ops/open_worktree_session.py --branch <branch> --owner <agent> ...`

2. **Her branch main'den:** Branch zincirleme YASAK.
   - Naming: `claude/{name}` (Claude Code EnterWorktree default) | `feat/claude-<task>` | `fix/claude-<task>` | `codex/<task>`
   - Bağımlılık varsa: explicit stacked PR (PR description'da belirt)

3. **Shared tree'de commit/push YASAK:**
   - Aktif side worktree varken canonical tree'de commit/push hook tarafından BLOCKED.
   - Override (acil): `ALLOW_CANONICAL_COMMIT=1 git commit ...`

4. **Hook'lar worktree'de light mode:**
   - Light: secrets + schema + scope-aware lint
   - Full gate chain yalnızca CI'da (merge gate)
   - Worktree kendi `.cache/` altına yazar (çapraz yazma yok)

### Worktree Tespit
- Authoritative: `git rev-parse --git-dir != git rev-parse --git-common-dir`
- Fast-path: `test -f .git` (gitlink dosyası)

### Fingerprint
- Canonical: full (staged + unstaged + untracked + HEAD + branch)
- Worktree: reduced (`--staged-only`: staged_diff + staged_paths + HEAD + branch + worktree_id)

## 1. İş tipleri

- [BE]  → Backend endpoint / servis / job
- [WEB] → Web frontend ekran/bileşen
- [MOB] → Mobil frontend ekran/bileşen
- [AI]  → AI/ML model / servis / pipeline
- [DATA]→ SQL / rapor / ETL / pipeline
- [DOC] → Problem Brief / PRD / Tech Design / Story / Acceptance / Runbook

## 2. Temel okuma sırası

Her görevde önce:

1. `standards.lock`
2. `docs/OPERATIONS/AI-MULTIREPO-OPERATING-CONTRACT.v1.md`
3. `docs/OPERATIONS/OPO-AUTHORITY-MAP.v1.md`
4. `docs/03-delivery/PROJECT-FLOW.md` (iş bağlamı gerekiyorsa)
5. `docs/OPERATIONS/ARCHITECTURE-CONSTRAINTS.md` ve `docs/OPERATIONS/CACHE-BOUNDARY-RULES.v1.md`

Sonra domain rehberi gerekiyorsa transition-active katman authority map
üzerinden çözülür:

6. Çekirdek transition rehberi
7. Transition doküman indeksi ve süreç rehberi authority map üzerinden çözülür.

İş tipine göre ilgili alan transition rehberi ve layout/style dokümanları
yalnız rehber amaçlı kullanılır; canonical authority değildir.

### [BE] Backend işleri
- Backend transition rehberi
- İlgili layout/style rehberi transition indeksinden seçilir.

### [WEB] Web frontend işleri
- Web transition rehberi
- İlgili layout/style rehberi transition indeksinden seçilir.

### [MOB] Mobil frontend işleri
- Mobil transition rehberi
- İlgili layout/style rehberi transition indeksinden seçilir.

### [AI] AI/ML işleri
- AI/ML transition rehberi
- İlgili layout/style ve data governance rehberi transition indeksinden seçilir.

### [DATA] Data / rapor işleri
- Data transition rehberi
- İlgili layout/style ve naming rehberi transition indeksinden seçilir.

### [DOC] Doküman işleri
- Doküman transition rehberi
- docs/99-templates/* (şablonlar varsa)
- İlgili docs style rehberi transition indeksinden seçilir.

## 3. Varsayılan cevap formatı

Tüm teknik görevlerde:

- Keşif Özeti
- Tasarım
- Uygulama Adımları (sadece: dosya yolu + yapılacak değişiklik)

Sadece doküman işlerinde:

- Örneklerden Öğrenilenler
- Doküman Taslağı
- Uygulama Adımları
