# RB-insansiz-flow – İnsansız PR Akışı (PR Bot → ci-gate → log-digest → Merge Bot)

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
  - FAIL → otomatik failure digest (log-digest)
  - PASS → label gate ile otomatik squash merge (PR Merge Bot)
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
  - Delivery zinciri: `docs/03-delivery/STORIES/`, `docs/03-delivery/ACCEPTANCE/`, `docs/03-delivery/TEST-PLANS/`
  - PR bot kuralları: `docs/04-operations/PR-BOT-RULES.json`
  - Runbook’lar: bu doküman + `RB-pr-bot` + `RB-log-digest`
- Kapsam dışı:
  - Fork repo’larda otomasyon (güvenlik nedeniyle çalışmaz).
  - Branch rules “required reviews” gibi manuel onay gerektiren policy’ler (insansız merge’i bloklar).

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
  5) PASS ise:
     - PR Merge Bot workflow’u tetiklenir, label gate + checks yeşil ise squash merge dener.
     - `<!-- pr-merge:result -->` comment’i sonucu yazar (merged/noop + reason + run link).

- Durdurma / kill switch:
  - Workflow disable:
    - `.github/workflows/pr-bot.yml`
    - `.github/workflows/ci-gate.yml`
    - `.github/workflows/log-digest.yml`
    - `.github/workflows/pr-merge.yml`
  - Merge’i kapat (SSOT): `docs/04-operations/PR-BOT-RULES.json` içinde ilgili `match` için `merge_policy=none`.

-------------------------------------------------------------------------------
4. GÖZLEMLEME / LOG / METRİKLER
-------------------------------------------------------------------------------

- Operasyonel kanıtlar (PR Conversation):
  - `<!-- pr-bot:rules -->`: PR Bot çalıştı + rule/template uygulandı.
  - `<!-- log-digest:v1 -->`: FAIL için “ilk hata bloğu” çıkarıldı (comment upsert, spam yok).
  - `<!-- pr-merge:result -->`: Merge Bot sonucu (merged/noop + reason).
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

-------------------------------------------------------------------------------
6. ÖZET
-------------------------------------------------------------------------------

- Tek required check: `ci-gate`.
- FAIL görünürlüğü: `<!-- log-digest:v1 -->`.
- PASS + label gate: Merge Bot squash merge; sonuç `<!-- pr-merge:result -->`.

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
- STORY: docs/03-delivery/STORIES/STORY-0302-release-deploy-e2e-v0-1.md
- ACCEPTANCE: docs/03-delivery/ACCEPTANCE/AC-0302-release-deploy-e2e-v0-1.md
