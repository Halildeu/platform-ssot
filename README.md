# platform-ssot — DEPRECATED

> **⚠️ Bu repo deprecated.** 2026-04-25 itibarıyla aktif geliştirme **platform-backend** ve **platform-web** repolarında devam ediyor. Faz 19 split-repo authority transfer **tamamlandı**.

## Migration mapping

| Eski (`platform-ssot`) | Yeni |
|---|---|
| `backend/` (8 Java mikroservis + Zanzibar plane) | [platform-backend](https://github.com/Halildeu/platform-backend) |
| `web/` (mfe-shell + 9 MFE + design-system) | [platform-web](https://github.com/Halildeu/platform-web) |
| `deploy/` (Docker Compose) | [platform-k8s-gitops](https://github.com/Halildeu/platform-k8s-gitops) (Kustomize + Helm) |
| Flyway migrations | platform-backend `<service>/src/main/resources/db/migration/` |
| Tiltfile (inner-loop dev) | platform-backend (canonical) + platform-k8s-gitops `bootstrap/k3d-dev.yaml` |

## Bu repo ne durumda?

- **Read-only**: branch protection main branch lock (admin-only push)
- **Issue tracker**: yeni issue eklenmiyor (kapatma plan)
- **History**: Git history korundu (referans + blame için)
- **Hard archive**: 4 PR triage tamamlandıktan sonra (1 hafta plan)

## Açık PR'lar (15 adet — port veya kapat)

### Triage edilecek (4 PR)

Bu PR'lar yeni repolara port edilebilir:

- [ ] [#541](https://github.com/Halildeu/platform-ssot/pull/541) `[codex] fix(shell): restore browser runtime error capture` → platform-web
- [ ] [#540](https://github.com/Halildeu/platform-ssot/pull/540) `[codex] fix(web): align variants fetch path with gateway public route` → platform-web
- [ ] [#536](https://github.com/Halildeu/platform-ssot/pull/536) `fix(permission-service): harden authz lookup and seed variant perms` → platform-backend
- [ ] [#507](https://github.com/Halildeu/platform-ssot/pull/507) `feat(test): proactive console + network error crawler (QLTY-PROACTIVE-01)` → platform-web

### Obsolete (5 user + 6 dependabot — kapatılacak)

- #548, #545, #539 — compose deploy/CI fix'leri (compose retire edildi Faz 18)
- #530, #529 — dependabot /web (web migrate edildi)
- 6 dependabot eski (354, 353, 245, 243, 242, 239) — bağımlılık güncellemeleri (yeni repolarda dependabot zaten var)

## Faz 19 closure

Repo split + cutover **2026-04-25 17:25 UTC** tamamlandı (Faz 19.MSSQL.A-Q delta tablosu PR #129 + #131 + #133).

Detay: [platform-k8s-gitops PLAN.md Faz 19](https://github.com/Halildeu/platform-k8s-gitops/blob/main/PLAN.md)

## İletişim

Sorular için [platform-k8s-gitops issue tracker](https://github.com/Halildeu/platform-k8s-gitops/issues).

---

**Son commit (Faz 18 closure)**: 2026-04-24 18:05 UTC `010c1b9` (Faz 18.9 observability retirement)
