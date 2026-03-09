# Maintainability Guardrails (Script Budget) — v0.1

Amaç: Taşeron repo içinde takip edilen tum metin ve kod dosyalarinin kontrolsuz buyuyup bakim maliyetini patlatmasini onlemek.
Bu guardrail'ler **soft/hard** limitlerle calisir ve lane + enforcement zincirinde deterministik olarak olculur.

## SSOT
- Konfigürasyon: `ci/script_budget.v1.json`
- Şema: `schemas/script-budget.schema.json`
- Checker: `ci/check_script_budget.py`
- Rapor (default): `.cache/script_budget/report.json`

## Kurallar (soft/hard)

**Genel takip edilen metin dosyasi limitleri**
- soft=1200
- hard=2000

**Kapsam**
- `git ls-files` ile takip edilen tum UTF-8 metin dosyalari bu guard icine girer.
- Kod, JSON, YAML, Markdown, CSS, HTML, TS/TSX/JS, Java ve diger metin tabanli dosyalar ayni genel limite tabidir.
- Binary dosyalar ve `.cache/`, `node_modules/`, `target/`, `dist/` gibi turetilmis alanlar kapsam disidir.

**Legacy / grandfathering**
- Halihazirda hard limiti asmıs buyuk dosyalar `ci/script_budget.v1.json` icinde `grandfathered_files` ile yonetilir.
- Bu repo'da grandfathered dosyalar `no_growth_only` modunda tutulur.
- Yani bu legacy dosyalar bugunku satir sayisini koruyabilir ama artik buyuyemez.

**Fonksiyon satır limitleri**
- soft=120
- hard=400

Not: Ilk rollout'ta buyuk legacy `main()` ve checker fonksiyonlari yuzunden fonksiyon guard daha genis headroom ile acilir.
Hedef, once yeni buyumeyi durdurmak; sonra bu fonksiyonlari parcalayip esigi asagi cekmektir.

## Lane Bağı
- Enforcement precheck: `gate-enforcement-check.yml`
- Module delivery precheck: `module-delivery-lanes.yml`
- Frontend contract lane: `ci/module_delivery_lanes.v1.json -> lanes.contract.command`

Bu repo'da yeni lane tanimlanmaz; script budget guard mevcut `contract` lane ve enforcement precheck hattina baglanir.

## Davranış
- Soft limit aşımı: **WARN** (checker `WARN` raporu üretir, exit code 0)
- Hard limit aşımı: **FAIL** (checker exit code 1 ile lane/enforcement zincirini bloklar)

## Lokal kullanım

```bash
python3 ci/check_script_budget.py --out .cache/script_budget/report.json
```

## Refactor politikası
- Buyuk dosya uzerinde yeni buyume gerekiyorsa once parcalara ayirma plani cikar.
- No-growth dosyalarda limit yukseltmek istisnadir; bilincli karar ve config degisikligi gerektirir.
- Amac metrik toplamak degil, repo buyumesini disipline etmektir.
