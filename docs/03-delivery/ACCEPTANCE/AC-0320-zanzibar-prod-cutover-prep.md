# AC-0320 – Zanzibar Prod Cutover Hazırlığı Acceptance

ID: AC-0320  
Story: STORY-0320-zanzibar-prod-cutover-prep  
Status: Planned  
Owner: @halil

> **Not (2026-04-17 docs drift-fix):** Implementation 3/3 PR merged
> (#446 P1.10 + #447 P1.8 + #449 P1.9). **Senaryo 2 (prod KMS path),
> Senaryo 5 (recovery key escrow drill), Senaryo 6 (break-glass KMS failure)
> manuel operatör rehearsal bekliyor** — master plan Rev 27 Open Item OI-04
> altında izleniyor. Bu top-level Status alanı yeni semantik öneri değil,
> sadece okuyucuya mevcut açık çerçeveyi işaret eder.

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- P1.10 Vault KMS auto-unseal, P1.8 canonical service-token path ve
  P1.9 NO_SCOPE UI modal refactor iş paketlerinin tek umbrella altında
  kabul kriterlerini belirlemek.

-------------------------------------------------------------------------------
## 2. KAPSAM
-------------------------------------------------------------------------------

- Vault seal template'leri ve deploy wiring (P1.10)
- auth-service mint policy + user-service non-local JWT converter +
  canary script token split (P1.8)
- `useExplainPermission` scope extension + modal UI + backend payload
  accept (P1.9)

-------------------------------------------------------------------------------
## 3. GIVEN / WHEN / THEN SENARYOLARI
-------------------------------------------------------------------------------

- [ ] Senaryo 1 — P1.10 Staging regression guard (Shamir preserve):  
  - Given: Staging'de `VAULT_SEAL_MODE` env set edilmemiş (default `shamir`).  
    When: `deploy/ubuntu/deploy-backend.sh` tetiklenir ve Vault container
    başlatılır.  
    Then: `vault-unseal` sidecar çalışır (disabled placeholder merge
    edildiğinden seal stanza yok → Shamir); `vault status` `sealed=false`
    döner, prod-readiness runbook §3 adımları hâlâ uygulanabilir durumda.

- [ ] Senaryo 2 — P1.10 Prod KMS path (dokümantasyon + şema):  
  - Given: Bir operatör `RB-vault-kms-autounseal.md` §3.1–3.4'ten AWS KMS
    rehearsal yapar.  
    When: `VAULT_SEAL_FILE=./devops/vault/vault-seal-awskms.hcl`,
    `VAULT_SEAL_MODE=awskms`, `VAULT_AWSKMS_SEAL_KEY_ID=...`,
    `AWS_REGION=...` set edilerek Vault restart edilir.  
    Then: Vault self-unseal olur, `vault status -format=json | jq .seal_type`
    `awskms` döner, `sealed=false`.

- [ ] Senaryo 3 — P1.8 Canonical service-token acquisition:  
  - Given: auth-service mint allowlist güncellendi ve user-service non-local
    SecurityConfig service JWT converter aktif.  
    When: `zanzibar-canary-setup.mjs` canonical path'le çalıştırılır
    (`--use-hybrid-b=false`).  
    Then: KC admin, user-service internal ve permission-service role admin
    çağrıları ayrı token tipleriyle başarılı olur; manual Hybrid B seed
    adımı gerek kalmaz.

- [ ] Senaryo 4 — P1.9 NO_SCOPE reason modal:  
  - Given: Kullanıcı bir company scope'u içinde module erişimi olan ama
    project scope'u için tanımsız bir role ile login.  
    When: `/admin/purchase-orders` (project scope'a bağlı) → `/unauthorized`
    redirect → "Neden erişemiyorum?" → `ExplainPermissionModal` scope picker
    ile project seçilir.  
    Then: `POST /v1/authz/explain` payload `scopeType=project, scopeRefId=<id>`
    döner, `reason=NO_SCOPE`, modal badge ve açıklama `NO_SCOPE` göstergesi.

- [ ] Senaryo 5 — P1.10 Recovery key escrow drill:  
  - Given: Prod Vault fresh init (KMS seal mode) tamamlandı;
    **5 recovery share** generate edildi, **threshold 3** (KMS seal altında
    unseal share fiilen kullanılmaz, recovery share `generate-root` akışı
    için aktiftir — `-key-shares=1 -key-threshold=1 -recovery-shares=5
    -recovery-threshold=3`).  
    When: Operatör iki escrow lokasyonuna dağıtır (ör. 1Password Team
    Platform vault + fiziksel printed safe); split pattern 3 share @
    1Password, 2 share @ fiziksel safe.  
    Then: `vault operator generate-root -init` + 3 holder'ın recovery
    key sequential girişi + `-decode` OTP ile yeni root token üretilir;
    root token critical op (policy read, audit list) + revoke-self ile
    sonlandırılır; audit kaydı `docs/04-operations/DRILLS/vault-drill-YYYY-QN.md`.
    Quarterly cadence zorunlu.

- [ ] Senaryo 6 — P1.10 Break-glass KMS access failure:  
  - Given: Prod Vault KMS seal aktif (tek-seal tasarım); operatör KMS
    IAM revoke simülasyonu yapar (staging rehearsal — role-based prod
    ile simetrik olması için `detach-role-policy` tercih edilir).  
    When: Vault container restart edilir.  
    Then: `sealed=true` kalır. **KRİTİK:** Recovery keys KMS seal altında
    "manual unseal" için geçerli DEĞİLDİR (recovery share sadece
    `generate-root` akışı için); primary recovery path IAM/key restore'dur.
    Runbook §5.1 ilk 45 dakika decision tree: incident ack (0-5 dk) →
    severity + restore path seçimi (5-15 dk) → IAM restore + key re-enable
    (15-30 dk) → post-restore smoke (30-45 dk) → fresh-init contingency
    (45+ dk, eski seal erişilemez durumunda). Decision authority: Platform
    Eng Lead (incident commander) + Security Lead (IAM/policy rollback
    şahidi). Communication template runbook §5.1'de.
    self-unseal olur.

-------------------------------------------------------------------------------
## 4. NOTLAR / KISITLAR
-------------------------------------------------------------------------------

- Test plan detay: **TP-0320** (`docs/03-delivery/TEST-PLANS/TP-0320-zanzibar-prod-cutover-prep.md`).
- **P1.10 real cloud KMS rehearsal otomasyon kapsamı dışı** — staging'de manuel operatör adımı gerekli (RB-vault-kms-autounseal §8). CI otomasyonu HCL syntax + compose config + doc template strictness ile sınırlı.
- **Staging default Shamir preserve** — `VAULT_SEAL_MODE` set edilmedikçe `vault-unseal` sidecar çalışır. P1.10 regression guard (Senaryo 1) kritik.
- **P1.8 user-service non-local profile** breaking risk — mevcut `conntest/local/dev` profile dışında yeni JWT converter path. Integration test + staging smoke post-deploy zorunlu.
- **P1.9 scope picker optional field** — backend payload `scopeType/scopeRefId` empty durumunda global scope varsayar (backward compat).
- **Umbrella contract feature_id retarget** — eski `integration-profile` → `zanzibar-prod-cutover-prep`. `STORY-0316` `source_refs`'de prior ref olarak korunur (izlenebilirlik).

-------------------------------------------------------------------------------
## 5. ÖZET
-------------------------------------------------------------------------------

- 6 senaryo P1.10/P1.8/P1.9 kapsamını doğrular.
- Staging/Shamir regresyon guard kritik (Senaryo 1) — prod KMS path
  test edildikten sonra bile local/staging akış kırılmamalı.
- Real cloud KMS rehearsal `TP-0320`'de staging manual test olarak
  işaretli, CI otomasyonu değil.

-------------------------------------------------------------------------------
## 6. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Story: `docs/03-delivery/STORIES/STORY-0320-zanzibar-prod-cutover-prep.md`
- Runbook: `docs/04-operations/RUNBOOKS/RB-vault-kms-autounseal.md`
- Test plan: `docs/03-delivery/TEST-PLANS/TP-0320-zanzibar-prod-cutover-prep.md`
