# MANAGED-REPO-CONTEXT-CONSUMPTION (v1)

Amac: `dev` icindeki delivery sistemini bozmadan, agent'larin ve ozellikle Codex'in
hangi baglami hangi sirayla tuketecegini normatif olmayan ama current-context
seviyesinde netlestirmek.

Bu dokuman:
- mevcut `backend + web + lane + standards.lock` omurgasini degistirmez,
- yeni `mobile + ai + data` yuzeylerini ayni repo icinde yonetmek icin baglam
  tuketim zinciri tanimlar,
- core SSOT yazimi acilana kadar managed repo icinde gecici bir execution mirror
  modeli kurar.

## 1. Temel ilke

- `autonomous-orchestrator` control-plane kaynagidir.
- `dev` execution-plane kaynagidir.
- Kalici governance kurallari execution repo tarafinda uydurulmaz; core'dan
  tuketilir.
- Execution repo, delivery baglamini ve implementasyon sinirlarini tasir.

## 2. Authority sirası

`dev` icinde agent'lar asagidaki sirayi izler:

1. `standards.lock`
2. `docs/OPERATIONS/AI-MULTIREPO-OPERATING-CONTRACT.v1.md`
3. `docs/OPERATIONS/OPO-AUTHORITY-MAP.v1.md`
4. `docs/OPERATIONS/ARCHITECTURE-CONSTRAINTS.md`
5. `docs/OPERATIONS/CACHE-BOUNDARY-RULES.v1.md`
6. `docs/OPERATIONS/CODING-STANDARDS.md`
7. `tenant/TENANT-DEFAULT/{context,stakeholders,scope,criteria}.v1.md`
8. `tenant/TENANT-DEFAULT/decision-bundle.v1.json`
9. `extensions/PRJ-PM-SUITE/contract/feature_execution_contract.v1.json`
10. session baglami / gecici sohbet kararlari
11. `AGENTS.md`, `AGENT-CODEX.*.md`, `docs/00-handbook/**`

Kurallar:
- Ustteki sira alttakini override eder.
- Session baglami kalici security, policy veya ownership kuralini degistiremez.
- Rehber dokumanlar normatif karar kaynagi degildir.

## 3. Managed-repo execution mirror modeli

Core SSOT icindeki `tenant decision bundle` henuz resmi olarak acik degilse:

- `tenant/TENANT-DEFAULT/decision-bundle.v1.json` execution mirror olarak
  kullanilir.
- Bu dosya `dev` icindeki delivery ve platform kurulumunu hizalamak icindir.
- Core SSOT'ta ayni artefact olustugunda kaynak onu olur; `dev` icindeki kopya
  sync ile guncellenir veya mirror olarak korunur.

Mirror kurallari:
- Governance kuralini degil, execution tercihini ve platform baglamini tasir.
- Core'daki canonical policy ile celisemez.
- Feature contract'in yerini alamaz; yalniz ortak zemin saglar.

## 4. Hangi durumda hangi dosya kullanilir

### Platform seviyesi soru
- Ornek: repo stratejisi, core/execution ayrimi, sync akisi
- Kaynak: `standards.lock` + operating contract + authority map

### Tenant / uzun omurlu karar
- Ornek: tek managed repo mu, mobile ayni repo mu, fail-closed prensibi ne
- Kaynak: tenant context quartet + `decision-bundle.v1.json`

### Feature seviyesi delivery
- Ornek: hangi path'ler etkilenir, hangi lane kosacak, hangi moduller degisecek
- Kaynak: `feature_execution_contract.v1.json`

### Oturum ici gecici yonlendirme
- Ornek: bu turda once mobile iskeletini ilerlet, bu raporu kisa yaz
- Kaynak: session context / user chat

## 5. Fail-closed davranis

Asagidaki durumlarda agent conservative calisir:

- tenant context eksikse
- `decision-bundle` ve feature contract birlikte belirsizse
- is birden fazla plane'i etkiliyor ama ortak contract yoksa
- session karari ile authority zinciri celisiyorsa

Bu durumda:
- mevcut delivery sistemi degistirilmez
- genis capli refactor yapilmaz
- once baglam ve contract netlestirilir

## 6. Codex icin pratik okuma sirasi

`[BE]`, `[WEB]`, `[MOB]`, `[AI]`, `[DATA]` fark etmeksizin ilk okuma:

1. authority zinciri
2. tenant context
3. decision bundle
4. feature execution contract
5. ilgili plane'in rehber dokumanlari

Bu siradan once plane-ozel dosyaya dalinmaz.

## 7. Bu dokuman neyi degistirmez

- mevcut lane sirasini degistirmez
- mevcut backend veya web runtime'ini degistirmez
- sync edilen core standartlarin yerine gecmez
- yeni repo acma veya delivery scope patlatma zorunlulugu getirmez

## 8. Done

Bu model aktif sayilmak icin:
- tenant context quartet mevcut olmali,
- `decision-bundle.v1.json` execution mirror olarak bulunmali,
- feature calismalari `feature_execution_contract` ile sinirlanmali,
- yeni plane eklemeleri mevcut delivery sistemini bozmadan yapilmali.
