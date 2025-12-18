# STORY-0048 – UI Kit P2 Expansion v1 (Ant/Material-Level NAV/FORM/DATA/OVERLAY)

ID: STORY-0048-ui-kit-p2-expansion-v1  
Epic: QLTY-UIKIT-P2  
Status: Planned  
Owner: @team/frontend  
Upstream: SPEC-0008, STORY-0047, docs/00-handbook/DYNAMIC-AXES-CONTRACT-v1.md, Design Lab taxonomy SSOT (`web/apps/mfe-shell/src/pages/admin/design-lab.groups.json`)  
Downstream: AC-0048, TP-0048

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- UI Kit’i P2 seviyesinde genişletmek (NAV/FORM/DATA/OVERLAY) ve Ant/Material’a yakın bir “component completeness” çizgisine yaklaşmak.  
- “Tek zincir” kalite kontratlarını bozmadan genişlemek:
  - Demo + Spec olmadan “stable” yok (SPEC-0008).  
  - Dynamic Axes Contract v1 uyumu zorunlu (ui-kit strict, shell strict hedefi).  
  - Design Lab taxonomy görünürlüğü: boş gruplar/subgroup’lar (0 count) görünür kalır.  

-------------------------------------------------------------------------------
## 2. TANIM
-------------------------------------------------------------------------------

Bu Story, P2 genişleme kapsamını ve koşullarını **SSOT backlog + doküman zinciri** olarak kilitler ve uygulama ilerlemesini autopilot/track üzerinden görünür kılar.

SSOT / Kanıt:
- Backlog SSOT: `web/scripts/ui-kit-backlog.yml`  
- Autopilot çıktıları (commit edilmez):  
  - Summary: `web/test-results/ops/ui-kit-factory-summary.md`  
  - Ledger: `web/test-results/ops/ui-kit-factory-ledger.jsonl`  
  - State: `web/test-results/ops/ui-kit-factory-state.json`  

-------------------------------------------------------------------------------
## 3. KAPSAM VE SINIRLAR
-------------------------------------------------------------------------------

### P2 Paketleri (SSOT Backlog)

P2 backlog SSOT:
- `web/scripts/ui-kit-backlog.yml` (track: `P2`)

Paketler (P2 v1):

- P2-NAV:
  - Tabs
  - Breadcrumb
  - Pagination
  - Steps
  - AnchorToc
- P2-FORM:
  - TextInput
  - TextArea
  - Checkbox
  - Radio
  - Switch
  - Slider
  - DatePicker
  - TimePicker
  - Upload
- P2-DATA:
  - List
  - Tree
  - TreeTable
  - Descriptions
  - JsonViewer
  - TableSimple
- P2-OVERLAY:
  - Popover
  - ContextMenu
  - CommandPalette
  - TourCoachmarks (planned-only)

-------------------------------------------------------------------------------
### Prensipler (kontrollü genişleme)
-------------------------------------------------------------------------------

- Önce primitives, sonra composite:
  - Primitives (Input/Checkbox/Popover/Tabs) stabilize olmadan composite büyütülmez.  
- Strict gate açık:
  - UI-kit scope: strict (HARD FAIL)  
  - Shell scope: P2 sonrası strict hedefi (grace yok varsayımıyla planlanır).  
- i18n gate v1.1:
  - usage → dict: strict FAIL (`python3 scripts/check_i18n_key_usage.py`)  
  - hardcoded (ui-kit prod): strict FAIL (`python3 scripts/check_i18n_hardcoded_strings.py --scope ui-kit-prod`)  
  - hardcoded (ui-kit demo): strict FAIL (`python3 scripts/check_i18n_hardcoded_strings.py --scope ui-kit-demo`)  
  - hardcoded (shell): rapor/burn-down (`web/test-results/ops/i18n-hardcode-burndown.md`)  
  - hardcoded (shell top10): `web/test-results/ops/i18n-hardcode-top10.md`  
- “Stable” tanımı değişmez:
  - `*.spec.tsx` + `*.demo.tsx` zorunlu (SPEC-0008).  
  - `*.test.tsx` stable sayılmaz.  
- Design Lab görünürlüğü:
  - Taxonomy SSOT’undan gelen tüm grup/subgroup isimleri 0 count olsa bile görünürdür.  

-------------------------------------------------------------------------------
### Sprint planı (v1)
-------------------------------------------------------------------------------

Sprint 1 (NAV + Overlay başlangıç):
- NAV: Tabs, Breadcrumb, Pagination, Steps, AnchorToc  
- OVERLAY: Popover, CommandPalette  

Sprint X: Autopilot progress (kanıt):
- Summary: `web/test-results/ops/ui-kit-factory-summary.md`  
- Progress SSOT: Summary tablosu (Track P2)  
- Beklenen: `Completed: true`, `Remaining: 0`  
- Kapanış: `Completed: true` (2025-12-18) — kanıt: `web/test-results/ops/ui-kit-factory-summary.md`  
- Not: TourCoachmarks v1 “planned-only” olabilir (Spec/Demo/Export/DesignLab üretimi zorunlu değil).  

Sprint 2 (FORM):
- TextInput, TextArea, Checkbox, Radio, Switch, Slider  
- DatePicker, TimePicker, Upload  

Sprint 3 (DATA):
- List, Tree, TreeTable  
- Descriptions, JsonViewer, TableSimple  

Sprint 4 (kalan + polish):
- ContextMenu  
- TourCoachmarks (planned-only → plan/kontrat, implementasyon opsiyonel)  
- Demo çeşitlendirme + drift gate sıkılaştırma (Design Lab index).  

-------------------------------------------------------------------------------
## 4. ACCEPTANCE KRİTERLERİ
-------------------------------------------------------------------------------

Detaylı Given/When/Then senaryoları AC-0048 dokümanında yer alacaktır.

-------------------------------------------------------------------------------
## 5. BAĞIMLILIKLAR
-------------------------------------------------------------------------------

- Factory standardı: `docs/03-delivery/SPECS/SPEC-0008-ui-kit-component-test-factory-v1.md`  
- Factory autopilot: `scripts/run_ui_kit_factory.py`  
- Dynamic Axes SSOT: `docs/00-handbook/DYNAMIC-AXES-CONTRACT-v1.md`  
- Design Lab taxonomy SSOT: `web/apps/mfe-shell/src/pages/admin/design-lab.groups.json`  
- Design Lab index: `web/apps/mfe-shell/src/pages/admin/design-lab.index.json` + `npm -C web run designlab:index`  

-------------------------------------------------------------------------------
## 6. ÖZET
-------------------------------------------------------------------------------

- P2 backlog SSOT: `web/scripts/ui-kit-backlog.yml` (track: `P2`)  
- Stable kapısı değişmez: `*.spec.tsx` + `*.demo.tsx` + Dynamic Axes uyumu  
- Plan: NAV/FORM/DATA/OVERLAY paketleri sprint’lere bölünür; drift gate (Design Lab index) ile kilitlenir

-------------------------------------------------------------------------------
## 7. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Acceptance: `docs/03-delivery/ACCEPTANCE/AC-0048-ui-kit-p2-expansion-v1.md`  
- Test Plan: `docs/03-delivery/TEST-PLANS/TP-0048-ui-kit-p2-expansion-v1.md`  
- Upstream:
  - `docs/03-delivery/STORIES/STORY-0047-ui-kit-component-test-factory-v1.md`  
  - `docs/03-delivery/SPECS/SPEC-0008-ui-kit-component-test-factory-v1.md`  
  - `docs/00-handbook/DYNAMIC-AXES-CONTRACT-v1.md`  
