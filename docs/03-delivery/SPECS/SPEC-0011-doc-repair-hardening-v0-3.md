# SPEC-0011 – Doc-Repair Hardening v0.3

ID: SPEC-0011  
Status: Draft  
Owner: Halil K.

## 1. AMAÇ

Plan/Apply çıktılarının deterministikliğini ve aksiyonlanabilirliğini artırmak.

## 2. KAPSAM

- Plan/Apply rapor formatları ve güvenli otomasyon guardrail’leri.

## 3. KONTRAT (SSOT)

### Değişiklikler

1) Plan parser: summary.md içindeki “## Blocked Reasons” bölümünü kanonik kaynak kabul eder.  
2) Apply report: SKIP durumlarında internal neden kodu üretir.  
3) `API_DOC_MISSING` (verify-only): ilgili `*.api.md` dosyası mevcutsa STORY LİNKLER’e ekler; yoksa SKIP/REPORT.

### Guardrails

- Allowlist: `docs/**`
- doc-qa PASS zorunlu

## 4. GOVERNANCE (DEĞİŞİKLİK POLİTİKASI)

- Hardening kural değişiklikleri yeni SPEC versiyonu ile yapılır.

## 5. LİNKLER

- Plan generator: `scripts/doc_repair_plan.py`
- Apply engine: `scripts/doc_repair_apply.py`
- Reason map (SSOT): `docs/03-delivery/SPECS/doc-repair-reason-map.v0.1.json`
