# PROJECT-FLOW  
**Amaç:** Tüm Story'lerin, Epic'lerin, ADR/SPEC/Acceptance durumlarının ve genel roadmap'in tek bakışta izlenebilmesini sağlamak.  
**Tür:** Operasyonel pano (canlı olarak güncellenir)

---

## 1. EPIC DURUM PANOSU (Üst Seviye Yol Haritası)

```text
EPIC ID   Başlık               Durum           Başlangıç   Bitiş (Tahmini)   Sahip     Not
--------  -------------------  --------------  ----------  ----------------  --------  ----------------------------------------------
EPIC-01   Kullanıcı Yönetimi   ⏳ Pending      2025-01-10  2025-03-01        Halil K.  Login rate limit + profil foto planned
EPIC-02   Raporlama Sistemi    🟦 Design       2025-02-01  TBD               Sezar     SPEC bekleniyor
EPIC-03   Mobil MFE Çerçevesi  🟩 Done         2024-11-01  2025-01-15        Halil K.  Yayında
```

**Durum ikonları:**  
🟦 Design • 🔄 In Progress • ⏳ Pending • 🟩 Done • ❌ Blocked

---

## 2. STORY DURUM TABLOSU

Bu tablo sprint/hafta bazlı Story ilerlemesini gösterir.

Not: İş seçimi ve “sıradaki iş” kararı için `Öncelik` sütunu kullanılır.
Yüksek sayı daha önceliklidir (DESC).

```text
Story ID    Öncelik  Başlık                                                             Epic                     ADR                                         SPEC                                                                                                    Acceptance                                  Durum      Son Güncelleme  Sahip                M_STORY  M_AC  M_TP  L_LAST  L_NEXT
----------  -------  -----------------------------------------------------------------  -----------------------  ------------------------------------------  ------------------------------------------------------------------------------------------------------  ------------------------------------------  ---------  --------------  -------------------  -------  ----  ----  ------  ------
STORY-0001  0001     Backend Docs Refactor                                              EPIC-BACKEND-DOCS        ✓ (ADR-0001)                                —                                                                                                       ✓ (AC-0001)                                 🟩 Done     2025-01-XX      Halil K.             M1       M1    M1    L1      —
STORY-0002  0002     Backend Keycloak JWT Hardening                                     QLTY-Security-Hardening  (ADR-legacy)                                SPEC-QLTY-BE-KEYCLOAK-JWT-01                                                                            ✓ (AC-0002)                                 🟩 Done     2025-01-XX      @team/backend        M1       M1    M1    L0      —
STORY-0003  0003     API Docs Refactor (users/auth/permission/audit)                    QLTY-API-Docs            (ADR-legacy)                                —                                                                                                       ✓ (AC-0003)                                 🟩 Done     2025-01-XX      @team/backend        M1       M1    M1    L0      —
STORY-0004  0004     API OpenAPI Refactor                                               API                      —                                           —                                                                                                       ✓ (AC-0004)                                 🟩 Done     2025-01-XX      @team/backend        M1       M1    M1    L0      —
STORY-0005  0005     Monitoring Docs Refactor                                           OPS                      —                                           —                                                                                                       ✓ (AC-0005)                                 🟩 Done     2025-01-XX      @team/ops            M1       M1    M1    L0      —
STORY-0006  0006     Release Notes Doc Standardization                                  OPS                      —                                           —                                                                                                       ✓ (AC-0006)                                 🟩 Done     2025-01-XX      @team/delivery       M1       M1    M1    L0      —
STORY-0007  0007     User Notification Preferences API                                  API                      —                                           —                                                                                                       ✓ (AC-0007)                                 🟩 Done     2025-12-12      @team/backend        M1       M1    M1    L0      —
STORY-0008  0008     User Notification Digest E-mail                                    API-NOTIFICATION         —                                           —                                                                                                       AC-0008                                     ⏳ Pending  2025-01-XX      @team/backend        M1       M1    M1    L0      —
STORY-0009  0009     FE SPA Login Standardization                                       QLTY-FE-LOGIN            (SPEC-legacy)                               QLTY-FE-SPA-LOGIN-01                                                                                    AC-0009                                     ⏳ Pending  2025-01-XX      @team/frontend       M1       M1    M1    L0      —
STORY-0010  0010     API v1 Standardization                                             QLTY-API-V1              (SPEC-legacy)                               QLTY-API-V1-STANDARDIZATION-01                                                                          AC-0010                                     ⏳ Pending  2025-01-XX      @team/platform-arch  M1       M1    M1    L0      —
STORY-0011  0011     Release Safety & DR Guardrails                                     OPS-RELEASE-SAFETY       (SPEC-legacy)                               E05-S01                                                                                                 AC-0011                                     ⏳ Pending  2025-01-XX      @team/ops            M1       M1    M1    L0      —
STORY-0012  0012     Telemetry & Observability Correlation                              OBS-TELEMETRY            (SPEC-legacy)                               E06-S01                                                                                                 AC-0012                                     ⏳ Pending  2025-01-XX      @team/observability  M1       M1    M1    L0      —
STORY-0013  0013     Globalization & Accessibility v1.0                                 UX-GLOBAL-A11Y           (SPEC-legacy)                               E07-S01                                                                                                 AC-0013                                     ⏳ Pending  2025-01-XX      @team/frontend       M1       M1    M1    L0      —
STORY-0014  0014     Quality Handbook & Style Guide Rollout                             QLTY-HANDBOOK            (SPEC-legacy)                               QLTY-01-S1, QLTY-01-S1-, QLTY-01-S2, QLTY-01-S2-, QLTY-01-S3, QLTY-01-S3-API-, QLTY-01-S4, QLTY-01-S4-  AC-0014                                     ⏳ Pending  2025-01-XX      @team/platform-arch  M1       M1    M1    L0      —
STORY-0015  0015     Shell Persistent Left Navigation                                   UX-SHELL-NAV             —                                           FR-008                                                                                                  AC-0015                                     ⏳ Pending  2025-01-XX      @team/frontend       M1       M1    M1    L0      —
STORY-0016  0016     Robot Task Management Console                                      OPS-ROBOTICS             —                                           FR-010                                                                                                  AC-0016                                     ⏳ Pending  2025-01-XX      @team/ops            M1       M1    M1    L0      —
STORY-0017  0017     Dashboard Builder v1.0                                             BI-SELF-SERVICE          —                                           FR-011                                                                                                  AC-0017                                     ⏳ Pending  2025-01-XX      @team/bi             M1       M1    M1    L0      —
STORY-0018  0018     ERP User Provisioning                                              QLTY-ERP-PROVISIONING    —                                           FR-012                                                                                                  AC-0018                                     ⏳ Pending  2025-01-XX      @team/backend        M1       M1    M1    L0      —
STORY-0019  0019     Permission Registry v1.0                                           QLTY-AUTHZ-SCOPE         (SPEC-legacy)                               QLTY-BE-AUTHZ-SCOPE-01                                                                                  AC-0019                                     ⏳ Pending  2025-01-XX      @team/backend        M1       M1    M1    L0      —
STORY-0020  9999     Theme Accent & Focus Standardization                               E03-THEME-SYSTEM         —                                           E03-S01-S01, E03-S01-S01.1, E03-S01-S01-, E03-S01-S01-1-                                                AC-0020                                     ⏳ Pending  2025-01-XX      @team/frontend       M1       M1    M1    L1      —
STORY-0021  9998     Header Navigation & Overflow                                       E03-THEME-SYSTEM         —                                           E03-S04                                                                                                 AC-0021                                     ⏳ Pending  2025-01-XX      @team/frontend       M1       M1    M1    L1      —
STORY-0022  9997     Theme Personalization v1.0                                         E03-THEME-SYSTEM         —                                           E03-S05                                                                                                 AC-0022                                     ⏳ Pending  2025-01-XX      @team/frontend       M1       M1    M1    L0      —
STORY-0023  0023     AuthZ Company Scope Filter                                         QLTY-AUTHZ-SCOPE         —                                           QLTY-BE-AUTHZ-SCOPE-03                                                                                  AC-0023                                     ⏳ Pending  2025-01-XX      @team/backend        M1       M1    M1    L0      —
STORY-0024  0024     AuthZ Project Scope Filter                                         QLTY-AUTHZ-SCOPE         —                                           QLTY-BE-AUTHZ-SCOPE-03-PROJECT                                                                          AC-0024                                     ⏳ Pending  2025-01-XX      @team/backend        M1       M1    M1    L0      —
STORY-0025  0025     FE Version Pinning & MF Audit                                      QLTY-FE-VERSIONS         —                                           QLTY-FE-VERSIONS-01, QLTY-FE-VERSIONS-01-                                                               AC-0025                                     ⏳ Pending  2025-01-XX      @team/frontend       M1       M1    M1    L0      —
STORY-0026  0026     Doc QA & Template Automation                                       QLTY-DOC-QA              —                                           DOCS-WORKFLOW / NUMARALANDIRMA                                                                          AC-0026                                     🟩 Done     2025-01-XX      @team/platform-arch  M1       M1    M1    L0      —
STORY-0027  0027     STORY / AC / TP ↔ PROJECT-FLOW Consistency                         QLTY-DOC-QA              —                                           DOCS-PROJECT-LAYOUT / PROJECT-FLOW                                                                      AC-0027                                     ⏳ Pending  2025-01-XX      @team/platform-arch  M1       M1    M1    L0      —
STORY-0028  0028     API Docs STYLE-API-001 Compliance                                  QLTY-DOC-QA              —                                           STYLE-API-001                                                                                           AC-0028                                     ⏳ Pending  2025-01-XX      @team/backend        M1       M1    M1    L0      —
STORY-0029  0029     Governance Migration Check                                         QLTY-DOC-QA              —                                           Legacy Governance Docs                                                                                  AC-0029                                     ⏳ Pending  2025-01-XX      @team/platform-arch  M1       M1    M1    L0      —
STORY-0030  0030     Agent Docs Contract Check                                          QLTY-DOC-QA              —                                           AGENT-CODEX / CONTEXT TEST GUIDE                                                                        AC-0030                                     ⏳ Pending  2025-01-XX      @team/platform-arch  M1       M1    M1    L0      —
STORY-0031  0031     End-to-end Doc Chain Consistency                                   QLTY-DOC-QA              —                                           DOCS-WORKFLOW / DOCS-LAYOUT / ID                                                                        AC-0031                                     ⏳ Pending  2025-01-XX      @team/platform-arch  M1       M1    M1    L0      —
STORY-0032  0032     User REST/DTO v1 Migration                                         QLTY-REST-USER           (SPEC-legacy)                               QLTY-REST-USER-01                                                                                       AC-0032                                     🟩 Done     2025-01-XX      @team/backend        M1       M1    M1    L0      —
STORY-0033  0033     Auth REST/DTO v1 Migration                                         QLTY-REST-AUTH           (SPEC-legacy)                               QLTY-REST-AUTH-01                                                                                       AC-0033                                     🟩 Done     2025-01-XX      @team/backend        M1       M1    M1    L0      —
STORY-0034  0034     FE Keycloak / OIDC Integration                                     QLTY-FE-KEYCLOAK         (SPEC-legacy)                               QLTY-FE-KEYCLOAK-01, QLTY-FE-KEYCLOAK-01-                                                               AC-0034                                     🟩 Done     2025-01-XX      @team/frontend       M1       M1    M1    L0      —
STORY-0035  0035     MF Router Shared & Version Pin                                     QLTY-MF-ROUTER           (SPEC-legacy)                               QLTY-MF-ROUTER-01, QLTY-MF-ROUTER-01-                                                                   AC-0035                                     🟩 Done     2025-01-XX      @team/frontend       M1       M1    M1    L0      —
STORY-0036  0036     FE Shell Auth Centralization                                       QLTY-FE-SHELL-AUTH       (SPEC-legacy)                               QLTY-FE-SHELL-AUTH-01                                                                                   AC-0036                                     ⏳ Pending  2025-01-XX      @team/frontend       M1       M1    M1    L0      —
STORY-0037  9996     Theme & Layout System v1.0 (Docs Migration)                        E03-THEME-SYSTEM         (SPEC-legacy)                               E03-S01                                                                                                 AC-0037                                     🟩 Done     2025-01-XX      @team/frontend       M1       M1    M1    L0      —
STORY-0038  9995     Theme Runtime Integration (Docs Migration)                         E03-THEME-SYSTEM         (SPEC-legacy)                               E03-S02                                                                                                 AC-0038                                     🟩 Done     2025-01-XX      @team/frontend       M1       M1    M1    L0      —
STORY-0039  9994     Theme Overlay & Grid Surface Tone (Docs Migration)                 E03-THEME-SYSTEM         (SPEC-legacy)                               E03-S03                                                                                                 AC-0039                                     🟩 Done     2025-01-XX      @team/frontend       M1       M1    M1    L0      —
STORY-0040  0040     FE Shared HTTP Standard (Docs Migration)                           QLTY-FE-SHARED-HTTP      (SPEC-legacy)                               QLTY-FE-SHARED-HTTP-01, QLTY-FE-GATEWAY-ROUTING, QLTY-FE-V1-ENDPOINT-NORMALIZATION                      AC-0040                                     ⏳ Pending  2025-01-XX      @team/frontend       M1       M1    M1    L0      —
STORY-0041  0041     FE Docs Refactor                                                   QLTY-FE-DOCS             —                                           WEB-PROJECT-LAYOUT / WEB-ARCH                                                                           AC-0041                                     🟩 Done     2025-01-XX      @team/frontend       M1       M1    M1    L0      —
STORY-0042  0042     Access Permission Bulk-Assign API v2                               QLTY-BE-AUTHZ-SCOPE      —                                           QLTY-BE-AUTHZ-SCOPE-01, QLTY-BE-AUTHZ-SCOPE-03                                                          AC-0042                                     ⏳ Pending  2025-01-XX      @team/backend        M1       M1    M1    L0      —
STORY-0043  0043     MF UI Kit Model Unification (Docs Migration)                       QLTY-MF-UIKIT            (SPEC-legacy)                               QLTY-MF-UIKIT-01, QLTY-MF-UIKIT-01-                                                                     AC-0043                                     ⏳ Pending  2025-01-XX      @team/frontend       M1       M1    M1    L0      —
STORY-0044  9993     Theme SSOT Single-Chain v1                                         QLTY-THEME-SSOT          ✓ (ADR-0002)                                —                                                                                                       AC-0044                                     🟩 Done     2025-12-15      @team/frontend       M3       M3    M3    L3      —
STORY-0045  0045     Invoice Approval v1 (AI Suggestions + Deterministic Decision)      EPIC-APPROVAL-SYSTEM     ✓ (ADR-0003, ADR-0004, ADR-0005, ADR-0006)  SPEC-0001, SPEC-0002, SPEC-0003, SPEC-0004                                                              ✓ (AC-0045)                                 ⏳ Pending  2025-12-16      @team/platform       M1       M1    M1    L1      —
STORY-0046  0046     AI-Native Component Standard v1 (Intent + UI Contract)             EPIC-UI-PLATFORM-AI      ✓ (ADR-0007)                                SPEC-0005, SPEC-0006, SPEC-0007                                                                         ✓ (AC-0046)                                 ⏳ Pending  2025-12-16      @team/platform       M1       M1    M1    L0      L1
STORY-0047  0047     UI Kit Component Test Factory v1 (Docs + Gates)                    QLTY-UIKIT-FACTORY       —                                           SPEC-0008                                                                                               ✓ (AC-0047)                                 ⏳ Pending  2025-12-16      @team/frontend       M1       M1    M1    L0      L1
STORY-0048  0048     UI Kit P2 Expansion v1 (NAV/FORM/DATA/OVERLAY)                     QLTY-UIKIT-P2            —                                           SPEC-0008                                                                                               ✓ (AC-0048)                                 🟩 Done     2025-12-18      @team/frontend       M3       M3    M3    L2      —
STORY-0050  0050     i18n Locale Propagation Fix v1 (Stale UI)                          UX-GLOBAL-A11Y           —                                           —                                                                                                       ✓ (AC-0050)                                 🟩 Done     2025-12-20      @team/frontend       M1       M1    M1    L3      —
STORY-0101  0101     Login API Rate Limiting                                            EPIC-01                  EPIC-01                                     ✓                                                                                                       ✓                                  AC-0101  ⏳ Pending  2025-01-18      Halil K.             M1       M1    M1    L0      —
STORY-0102  0102     User Profile Photo Upload                                          EPIC-01                  —                                           ✓                                                                                                       🔧 (AC-0102)                                 ⏳ Pending  2025-01-17      Halil K.             M1       M1    M1    L0      —
STORY-0201  0201     Budget Report Grid V2                                              EPIC-02                  ✓                                           🔧 Taslak                                                                                                AC-0201                                     🟦 Design   2025-01-22      Sezar                M1       M1    M1    L0      —
STORY-0301  0301     Mobil Offline Queue                                                EPIC-03                  ✓                                           ✓                                                                                                       ✓ (AC-0301)                                 🟩 Done     2025-01-05      Halil K.             M1       M1    M1    L0      —
STORY-0302  0302     Release & Deploy E2E v0.1 (Canlıya Alma ve Son Kullanıcıya Sunum)  OPS-RELEASE-E2E          —                                           —                                                                                                       ✓ (AC-0302)                                 ⏳ Pending  2025-12-20      @team/platform       M1       M1    M1    L0      —
STORY-0303  0303     Autopilot Auto-Fix + Deploy + Rollback v0.1                        OPS-RELEASE-E2E          —                                           —                                                                                                       ✓ (AC-0303)                                 ⏳ Pending  2025-12-21      @team/platform       M1       M1    M1    L0      —
STORY-0304  0304     Autopilot Auto-Fix + Deploy + Rollback v0.1 (0304)                 OPS-RELEASE-E2E          —                                           —                                                                                                       ✓ (AC-0304)                                 ⏳ Pending  2025-12-21      @team/platform       M1       M1    M1    L0      —
STORY-0305  0305     M3 Direct-Gen Üretim Sistemi v1                                    DOCS-PRODUCTION          —                                           SPEC-0012                                                                                               ✓ (AC-0305)                                 🟩 Done     2025-12-27      @team/platform       M3       M3    M3    L1      —
STORY-0306  0306     Ethics: Intake & Case Mailbox (MVP)                                ETHICS-MVP               —                                           SPEC-0013                                                                                               ✓ (AC-0306)                                 🟦 Design   2025-12-25      TBD                  M1       M1    M1    L0      L1
STORY-0307  0307     Ethics: COI & Access Boundary (MVP)                                ETHICS-MVP               ✓ (ADR-0003)                                SPEC-0013                                                                                               ✓ (AC-0307)                                 🟦 Design   2025-12-25      TBD                  M1       M1    M1    L0      L1
STORY-0308  0308     Ethics: Audit Trail & Evidence Handling (MVP)                      ETHICS-MVP               ✓ (ADR-0004)                                SPEC-0013                                                                                               ✓ (AC-0308)                                 🟦 Design   2025-12-25      TBD                  M1       M1    M1    L0      L1
STORY-0309  0309     Ethics: Triage Routing Policy (MVP)                                ETHICS-MVP               —                                           SPEC-0013                                                                                               ✓ (AC-0309)                                 🟦 Design   2025-12-25      TBD                  M1       M1    M1    L0      L1
STORY-0310  0310     Ethics: SLA & Escalation Rules (MVP)                               ETHICS-MVP               ✓ (ADR-0005)                                SPEC-0013                                                                                               ✓ (AC-0310)                                 🟦 Design   2025-12-25      TBD                  M1       M1    M1    L0      L1
STORY-0311  0311     Ethics: Retaliation Check-in & Protection (MVP)                    ETHICS-MVP               —                                           SPEC-0013                                                                                               ✓ (AC-0311)                                 🟦 Design   2025-12-25      TBD                  M1       M1    M1    L0      L1
STORY-0312  0312     Ethics: Closure Quality Score (MVP)                                ETHICS-MVP               —                                           SPEC-0013                                                                                               ✓ (AC-0312)                                 🟦 Design   2025-12-25      TBD                  M1       M1    M1    L0      L1
STORY-0313  0313     NC: Intake & Evidence (MVP)                                        NC-MVP                   —                                           SPEC-0015                                                                                               ✓ (AC-0313)                                 🟦 Design   2025-12-25      TBD                  M1       M1    M1    L0      L1
STORY-0314  0314     NC: CAPA Workflow (MVP)                                            NC-MVP                   —                                           SPEC-0015                                                                                               ✓ (AC-0314)                                 🟦 Design   2025-12-25      TBD                  M1       M1    M1    L0      L1
STORY-0315  0315     Fleet: Operations Management (MVP)                                 FLEET-MVP                ✓ (ADR-0001)                                SPEC-0016                                                                                               ✓ (AC-0315)                                 🟦 Design   2025-12-25      TBD                  M1       M1    M1    L0      L1
``` 

Açıklamalar:  
- ADR/SPEC/Acceptance sütunları: **✓** = var, **—** = gerek yok, **🔧** = hazırlanıyor  
- `M_STORY/M_AC/M_TP`: olgunluk sinyalleri (M1/M2/M3). Otomasyon `maxAllowedM=min(...)` üzerinden seviye sınırını hesaplar.  
- `L_LAST/L_NEXT`: `docflow_next autopilot` PASS olduğunda güncellenen “son seviye / bir sonraki seviye” görünümü.  
- “Durum”: Story’nin gerçek zamanlı state’i  
- Bu tablo Sprint Planning yerine geçmez ama **tek kaynak** görünüm sağlar.

### Legacy Governance ID Alias Notları

Legacy `backend/docs/legacy/root/05-governance/PROJECT_FLOW.md` içindeki bazı ID’ler
yeni sistemde birden fazla Story veya rehber tarafından kapsandığı için, tek bir
Story satırına yazılmak yerine aşağıdaki alias notlarıyla temsil edilir:

- E01-S05                     → STORY-0009-fe-spa-login-standardization (FE SPA Login & Register)  
- E01-S10                     → STORY-0036-fe-shell-auth-centralization (Auth & BroadcastChannel full MFE sync)  
- E01-S90                     → STORY-0009 / STORY-0036 (Identity support & küçük iyileştirmeler)  
- E02-S01, E02-S01-AG-, E02-S02 → web grid standartları (AG Grid deneyim bütçeleri + Grid mimarisi); şu an için web/docs mimari rehberleri ve STORY-0201 Budget Report Grid V2 ile temsil edilir.  
- E03-S01-S01-, E03-S01-S01-1- → STORY-0020-theme-accent-and-focus (accent/focus varyantları)  
- E04-S01                     → Manifest & Sözleşme Platformu v1.0 – RUNBOOKS/RB-mfe-access.md ve releases/2025-11-Access-MVP.md ile kapsanır.  
- E08-S01                     → STORY-0019-permission-registry-v1 (Permission Registry v1.0)  
- QLTY-01-S1-                 → STORY-0014-quality-handbook-rollout (Backend STYLE-BE-001 yaygınlaştırma)  
- QLTY-01-S2-                 → STORY-0014-quality-handbook-rollout (Frontend stil rehberi yaygınlaştırma)  
- QLTY-01-S3-API-             → STORY-0014-quality-handbook-rollout (API STYLE-API-001 adoption)  
- QLTY-01-S4-                 → STORY-0014-quality-handbook-rollout (Quality Handbook & PR checklist)  
- QLTY-BE-AUTHZ-SCOPE-01-AUTHZ-SCOPED-PERMISSIONS → STORY-0019-permission-registry-v1 / STORY-0023 / STORY-0024 (permission-service scope’lu yetkilendirme spec’i)  
- QLTY-BE-AUTHZ-SCOPE-02      → STORY-0023-authz-company-scope-filter / STORY-0024-authz-project-scope-filter (scope’lu authz’nin access/audit/user servislerine yaygınlaştırılması)  
- QLTY-BE-CORE-DATA-01        → STORY-0018-erp-user-provisioning (company master data ile ilişkili core-data-service iş akışları)  
- QLTY-FE-KEYCLOAK-01-        → STORY-0034-fe-keycloak-oidc (Frontend Keycloak/OIDC entegrasyonu alias ID’si)  
- QLTY-FE-VERSIONS-01-        → STORY-0025-fe-version-pinning-and-mf-audit (FE version pinning & MF audit alias ID’si)  
- QLTY-MF-ROUTER-01-          → STORY-0035-mf-router-shared-version-pin (MF router shared & version pin alias ID’si)  
- QLTY-MF-UIKIT-01-           → STORY-0043-mf-uikit-model (MF UI Kit model alias ID’si)  

---

## 3. BLOKLU / RİSKLİ STORY’LER (Early Warning)

```text
Story ID   Blokaj                                  Etki     Çözüm İçin Gereken
---------- --------------------------------------- -------- --------------------
STORY-0202 Reporting servisinde yeni endpoint yok  Orta     TECH-DESIGN güncellemesi
STORY-0401 Mobil kamera izinleri (iOS) belirsiz    Yüksek   ADR-004 Security Decision
```

Bu bölüm “yangın alarmı”dır. Agent ve ekipler önce buraya bakar.

---

## 4. DÖNEMSEL ROADMAP (3 Aylık Rotating Window)

### Ocak → Şubat → Mart 2025
- EPIC-01: User Management  
  - STORY-0101 → Ocak  
  - STORY-0102 → Ocak/Şubat  
- EPIC-02: Reporting  
  - STORY-0201 → Şubat  
  - STORY-0202 → Mart  

### Nisan → Mayıs → Haziran 2025
- EPIC-04: Audit MFE  
- EPIC-05: Data Sync Engine

Bu roadmap değiştikçe sadece bu blok güncellenir.

---

## 5. ADR / SPEC / ACCEPTANCE DURUM MATRİSİ

```text
Belge Türü   Tamamlanan  Eksik  Not
-----------  ----------  -----  ----------------------------------------------
ADR          12          2      Security ile ilgili 1 ADR bekliyor
SPEC         9           3      Reporting SPEC revizyon bekliyor
Acceptance   15          1      Mobil profil update Acceptance eksik
```

Bu tablo sürecin sağlığını ölçen KPI gibidir.

---

## 6. CODEx / AI Agent Uyum Notları

- Tüm Story’ler ilgili AGENT-CODEX dosyasıyla eşleşmelidir.  
- Acceptance kriteri olmayan Story’ler **In Progress** yapılamaz.  
- SPEC yoksa **Build** aşamasına geçilmez.  
- ADR “Proposed” durumundaysa geliştirme başlamaz.

Bu bölüm, DEV-GUIDE.md ile PROJECT-FLOW.md arasındaki operasyonel “checklist”tir.

---

## 7. GEÇMİŞ KAYITLAR (Opsiyonel)

```text
Tarih       Olay                   Not
----------  ---------------------- ------------------------------
2025-01-04  EPIC-03 tamamlandı     Mobil MFE iskeleti yayında
2024-12-20  ADR-011 kabul edildi   Login throttling aktif edildi
```

İsteğe bağlı “audit trail” alanı.

---

## 8. ÖZET (Sadece insan okuması için)

- EPIC bazlı roadmap görünür  
- STORY/ADR/SPEC/Acceptance uyumu tek tabloda takip edilebilir  
- Blokaj ve riskler önden belirir  
- Agent için gerekli bilgiler tablolu formatta okunabilir  
- DEV-GUIDE sürecinin operasyonel karşılığıdır
