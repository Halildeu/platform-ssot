# FE-DOCS-MIGRATION-GUIDE – Web Doküman Envanteri ve Mapping

Bu rehber, `web/docs/**` altındaki mevcut web frontend dokümanlarını
envanterleyip yeni `docs/` mimarisi ile ilişkilendirir.

Amaç: İnsanlar ve AI agent’lar için **kanonik dokümanların her zaman `docs/`**
altında olması; `web/docs/**` yalnız detay / örnek / tarihçe niteliğinde
referans olarak kullanılmalıdır.

-------------------------------------------------------------------------------
## 1. LEGACY WEB DOKÜMAN ENVANTERİ (ÖZET TABLO)
-------------------------------------------------------------------------------

| Legacy Yol                                                           | Kategori            | Yeni Kanonik Doküman(lar)                                            | Not                                                                 |
|----------------------------------------------------------------------|---------------------|-----------------------------------------------------------------------|----------------------------------------------------------------------|
| `web/docs/architecture/frontend/frontend-project-layout.md`          | Mimari üst bakış    | `docs/00-handbook/WEB-PROJECT-LAYOUT.md`, `docs/02-architecture/clients/WEB-ARCH.md` | Legacy layout detayı; yeni sistemde layout + mimari özet bu iki dokümandadır. |
| `web/docs/01-architecture/01-shell/01-frontend-architecture.md`      | Shell mimarisi      | `docs/02-architecture/clients/WEB-ARCH.md`                           | Shell, MF host yapısı ve app/package rolleri WEB-ARCH içinde özetlenir. |
| `web/docs/01-architecture/01-shell/02-module-federation-map.md`     | MF topolojisi       | `docs/02-architecture/clients/WEB-ARCH.md`, STORY-0025/0035          | MF router + version pinning kararları WEB-ARCH ve ilgili Story’lerde tutulur. |
| `web/docs/01-architecture/01-shell/03-audit-event-feed.md`          | Audit MFE akışı     | `docs/02-architecture/SYSTEM-OVERVIEW.md`, WEB-ARCH, STORY-0011      | Audit event feed mimari konumu sistem overview + release safety Story ile ilişkilidir. |
| `web/docs/01-architecture/02-ui-kit/02-ag-grid-theme.md`            | UI Kit + grid tema  | WEB-ARCH (Theme & UX), STORY-0020, STORY-0037                        | Tema ve grid görünümü tema/story zincirleriyle belgelenir; bu dosya detaydır. |
| `web/docs/architecture/frontend/grid-template-roadmap.md`           | Grid roadmap        | WEB-ARCH, STORY-0020/0021/0022, E02 governance IDs                   | Grid & layout kararlarının roadmap’i; yeni sistemde EPIC/Story ve WEB-ARCH’e referans verilir. |
| `web/docs/ag-grid-ssrm-export-strategy.md`                          | SSRM & export       | WEB-ARCH (TEST & Grid bölümü), ilgili TP (rapor/grid Story’leri)     | Grid performans ve export stratejisi test planları ve guide’lara özetlenir. |
| `web/docs/theme/theme-tokens.stories.mdx`                           | Theme tokens örnek  | WEB-ARCH (Theme bölümü), STORY-0037/0038/0039                        | Tokens kaynağı ve kullanım modeli tema Story’lerinde kanonik; bu dosya Storybook örneğidir. |
| `web/docs/mf-check.md`                                              | MF health check     | WEB-ARCH (Routing & MF Router), STORY-0025/0035                      | MF check süreçleri yeni sistemde routing/version pin Story’leri ile bağlanır. |
| `web/docs/mf-troubleshooting.md`                                    | MF sorun giderme    | WEB-ARCH, RUNBOOKS (RB-mfe-access, RB-keycloak vb.)                  | Operasyonel troubleshooting runbook’larla birlikte okunur. |
| `web/docs/02-security/01-auth/01-frontend-vault-integration.md`     | FE Vault entegrasyonu | WEB-ARCH (Auth & Security), `docs/04-operations/RUNBOOKS/RB-vault.md` | FE’nin Vault ile entegrasyonu; kanonik runbook RB-vault, bu dosya FE perspektifidir. |
| `web/docs/03-deploy/01-ci/01-security-guardrails.md`                | CI security guardrails | `web/docs/ci/security-guardrails.md`, `docs/03-delivery/guides/releases/README.md` | Security guardrail prensipleri; ileride `docs/03-delivery/guides/SECURITY-GUARDRAILS-FE.md` ile özetlenebilir. |
| `web/docs/ci/security-guardrails.md`                                | CI security guardrails (genel) | WEB-ARCH (Auth & Security), releases rehberleri                     | CI pipeline güvenlik kontrolleri; şu an için web/docs altında detaylıdır. |
| `web/docs/examples/routes/shell-routes.tsx`                         | Route örnek kodu    | WEB-ARCH (Routing), STORY-0025/0035                                  | Örnek kod; asıl kararlar routing Story’leri ve WEB-ARCH’tedir. |
| `web/docs/tests/README.md`                                          | Test stratejisi özet | WEB-ARCH (Test stratejisi), TP-0101 vb.                              | Test stratejisi kanonik olarak test planları ve WEB-ARCH’te; bu dosya tarihçedir. |
| `web/docs/tests/cypress/README.md`                                  | Cypress setup       | WEB-ARCH (Test stratejisi), ilgili TP’ler                            | Cypress yapılandırma detayı; TP ve WEB-ARCH test bölümüyle uyumlu olmalıdır. |
| `web/docs/tests/cypress/users-audit-toast.cy.md`                    | Audit toast e2e     | TP-0101 (FE SPA Login), diğer ilgili TP’ler                          | Belirli bir e2e senaryo; test planları ve STORY kabul kriterleri kanoniktir. |
| `web/docs/tests/cypress/users-ssrm-single-fetch.cy.ts`              | Users SSRM e2e      | Grid/SSRM ile ilgili TP’ler (rapor/grid), WEB-ARCH                   | Grid performans testleri; bu dosya uygulama örneğidir. |
| `web/docs/tests/mfe-users/usersgrid-ssrm-attach.spec.tsx`           | usersgrid attach    | Aynı                                                                       |                                                                      |
| `web/docs/tests/mfe-users/userspage-ssrm-fetch.spec.tsx`            | userspage fetch     | Aynı                                                                       |                                                                      |
| `web/docs/tests/ssrm-single-fetch.spec.tsx`                         | Genel SSRM test     | Aynı                                                                       |                                                                      |
| `web/docs/tests/variant-manager-e2e.md`                             | Variant manager e2e | TP-0101, diğer FE test planları, WEB-ARCH                              | Kritik e2e örneği; kanonik senaryolar TP ve AC dokümanlarında tutulur. |

> Not: Yukarıdaki tablo, **kanonik bilginin artık `docs/` ağacında bulunduğunu**,
> `web/docs/**` altındaki dosyaların ise detay/örnek/legacy rolünde kaldığını
> açıkça gösterir.

-------------------------------------------------------------------------------
## 2. KULLANIM REHBERİ
-------------------------------------------------------------------------------

- Yeni bir FE işi üzerinde çalışırken:
  - Önce `WEB-PROJECT-LAYOUT.md`, `STYLE-WEB-001.md` ve `WEB-ARCH.md`
    okunur.  
  - Gerekirse bu rehberdeki tabloya bakılarak ilgili legacy `web/docs/**`
    dosyaları bulunur.  
  - Kanonik kararlar her zaman `docs/` altındaki STORY/AC/TP/ADR/RUNBOOK
    dokümanlarında güncellenir; `web/docs/**` güncellenmesi zorunlu değildir.

-------------------------------------------------------------------------------
## 3. UYGULAMA ADIMLARI (FE DOCS REFACTOR İÇİN)
-------------------------------------------------------------------------------

- STORY-0041 / AC-0041 / TP-0101 zinciri için:
  - Bu rehberi güncel ve eksiksiz tut.  
  - Yeni bir `web/docs/**` dokümanı eklendiğinde:
    - Kategorisini belirle (mimari / security / test / örnek).  
    - Gerekirse yeni kanonik `docs/` dokümanı oluştur (guide, runbook, STORY).  
    - Bu tabloya satır ekleyerek legacy → yeni mapping’i kaydet.  

