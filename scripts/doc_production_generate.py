#!/usr/bin/env python3
"""
DOCS-PRODUCTION generator (v0.1)

Amaç:
- Direct-Gen doküman üretim akışında "BM pack" üretimini hızlandırmak.
- Çıktılar non-TBD starter content üretir (bm-content-policy ile uyumlu).

Usage (example):
  python3 scripts/doc_production_generate.py bm-pack --topic ETHICS --slug ethics --bm 0007 --title "Etik Programı"
"""

from __future__ import annotations

import argparse
from datetime import datetime, timezone
import json
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Any


BM_ROOT = Path("docs/01-product/BUSINESS-MASTERS")
BENCH_ROOT = Path("docs/01-product/BENCHMARKS")
DEFAULT_VERSION = "v0.1"


def die(msg: str) -> int:
    print(f"[doc_production_generate] FAIL: {msg}")
    return 1


def norm_slug(s: str) -> str:
    s = s.strip().lower()
    if not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", s):
        raise ValueError("slug must be kebab-case (a-z0-9 and '-')")
    return s


def norm_topic_folder(s: str) -> str:
    s = s.strip()
    if not re.fullmatch(r"[A-Z0-9_]+", s):
        raise ValueError("topic must be UPPERCASE (A-Z0-9_)")
    return s


def norm_num4(s: str) -> str:
    s = s.strip()
    if not re.fullmatch(r"\d{4}", s):
        raise ValueError("number must be 4 digits (e.g. 0001)")
    return s


def ensure_parent(path: Path, dry_run: bool) -> None:
    if dry_run:
        return
    path.parent.mkdir(parents=True, exist_ok=True)


def write_file(path: Path, content: str, *, dry_run: bool, overwrite: bool) -> None:
    if path.exists() and not overwrite:
        print(f"[doc_production_generate] SKIP: exists: {path}")
        return

    ensure_parent(path, dry_run=dry_run)
    if dry_run:
        print(f"[doc_production_generate] DRY_RUN: would write: {path} (bytes={len(content.encode('utf-8'))})")
        return

    path.write_text(content, encoding="utf-8")
    print(f"[doc_production_generate] WROTE: {path}")


def load_seed(path: Path | None) -> dict[str, Any]:
    if not path:
        return {}
    if not path.exists():
        raise FileNotFoundError(path)
    data = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(data, dict):
        raise ValueError("seed json must be an object")
    return data


def get_list(seed: dict[str, Any], key: str) -> list[str]:
    val = seed.get(key)
    if val is None:
        return []
    if not isinstance(val, list) or any((not isinstance(x, str) or not x.strip()) for x in val):
        raise ValueError(f"seed.{key} must be non-empty strings list")
    return [x.strip() for x in val]


@dataclass(frozen=True)
class PackSeed:
    core_dec: list[str]
    core_grd: list[str]
    core_asm: list[str]
    core_val: list[str]
    core_rsk: list[str]

    ctrl_dec: list[str]
    ctrl_grd: list[str]
    ctrl_asm: list[str]
    ctrl_val: list[str]
    ctrl_rsk: list[str]

    met_kpi: list[str]
    met_dec: list[str]
    met_grd: list[str]
    met_asm: list[str]
    met_val: list[str]
    met_rsk: list[str]


def build_seed(topic_title: str, slug: str, seed: dict[str, Any]) -> PackSeed:
    core_dec = get_list(seed, "core.dec") or [
        f"{topic_title} kapsamında anonim/kimlikli kullanım politikası net olacak mı? (Evet; policy ile yönetilir.)",
        "Need-to-know görünürlük sınırları zorunlu mu? (Evet.)",
        "Audit trail + evidence sürümleme zorunlu mu? (Evet.)",
    ]
    core_grd = get_list(seed, "core.grd") or [
        "Yetkisiz kullanıcı detay göremez; yalnız özet sinyal alır.",
        "Kritik aksiyonlar audit trail’e düşer (actor + before/after).",
        "Delil/ekler silinmez; yalnız yeni sürüm eklenir.",
        "SLA ve escalation semantiği tek SSOT üzerinden yönetilir.",
        "Her durum değişimi izlenebilir (reason + actor).",
        "Kritik kararlar idempotent çalışır (tekrar çalıştırma güvenli).",
    ]
    core_asm = get_list(seed, "core.asm") or [
        "Temel rol grupları (intake/triage/owner/auditor) tanımlanabilir.",
        "Kritik olaylarda manuel override gereksinimi vardır (policy ile).",
    ]
    core_val = get_list(seed, "core.val") or [
        "E2E: intake→triage→assign→close akışı 10 senaryo ile doğrulanır.",
        "Audit: kritik aksiyonların log’ları örneklemle kontrol edilir.",
    ]
    core_rsk = get_list(seed, "core.rsk") or [
        "Yanlış yönlendirme → triage policy + feedback loop",
        "Yetki drift → role registry + periyodik gözden geçirme",
        "SLA yanlış hesap → tek semantik + regression senaryoları",
        "Delil kaybı → immutability + sürümleme",
        "PII sızıntısı → redaksiyon/maskeleme + export kontrolü",
        "Bildirim spam’i → rate-limit + digest",
        "Tek metrik optimizasyonu → kalite/risk metrikleriyle denge",
        "İdempotency eksikliği → idempotency key + dedup",
        "Politika kural çatışması → precedence + test seti",
        "Geriye dönük değişiklik → audit + gerekçe zorunluluğu",
    ]

    ctrl_dec = get_list(seed, "ctrl.dec") or [
        "RBAC/permission boundary zorunlu mu? (Evet.)",
        "Export/rapor çıktılarında maskeleme/redaksiyon uygulanacak mı? (Evet.)",
        "Retention/legal hold policy ile yönetilecek mi? (Evet.)",
    ]
    ctrl_grd = get_list(seed, "ctrl.grd") or [
        "Kritik alan değişiklikleri audit trail’e düşer.",
        "Görüntüleme (view) loglanır (need-to-know kanıtı).",
        "Serbest metin bildirim yok; template + allowlist zorunludur.",
        "Export/rapor çıktıları permission boundary’yi aşamaz.",
        "Evidence/attachment silinmez; sürümlenir.",
        "Kritik aksiyonlar ayrı yetki ile korunur (approval/policy).",
    ]
    ctrl_asm = get_list(seed, "ctrl.asm") or [
        "Rol/organizasyon modeli tanımlı veya tanımlanabilir olacak.",
        "Audit saklama süresi policy ile onaylanabilir olacak.",
    ]
    ctrl_val = get_list(seed, "ctrl.val") or [
        "RBAC testleri: yetkisiz görüntüleme/değişiklik denemeleri.",
        "Evidence sürümleme + view log doğrulaması.",
    ]
    ctrl_rsk = get_list(seed, "ctrl.rsk") or [
        "PII sızıntısı (export/bildirim) → allowlist + redaksiyon",
        "Retention belirsizliği → policy SSOT + rollout planı",
        "Yetki drift → policy test seti + audit örneklemi",
        "Kontrol bypass → server-side guardrail’ler",
        "Log kaçırma → zorunlu audit hook",
        "Gizli alan sızıntısı → field-level allowlist",
        "Yanlış yetki ataması → approval + review",
        "Oversharing → need-to-know boundary testleri",
        "Report leak → export watermark + access policy",
        "Silme hatası → soft-delete + retention",
    ]

    met_kpi = get_list(seed, "met.kpi") or [
        f"{slug} intake hacmi (kategori bazlı)",
        "Triage süresi (p50/p95)",
        "Kapanış süresi (p50/p95)",
        "Reopen oranı",
        "SLA breach oranı (takvim semantiği dahil)",
        "Audit coverage oranı (kritik aksiyonlar)",
        "Evidence tamlık oranı",
        "Bildirim teslim başarısızlık oranı (kanal bazlı)",
    ]
    met_dec = get_list(seed, "met.dec") or [
        "KPI seti yalnız hız değil; kalite + risk sinyalleriyle dengeli tutulacak mı? (Evet.)",
    ]
    met_grd = get_list(seed, "met.grd") or [
        "Tek metrik optimize edilmez; kalite/risk ile birlikte izlenir.",
        "Metrikler suçlama için değil; iyileştirme döngüsü için kullanılır.",
        "KPI hesap semantiği versiyonlanır ve değişiklikler not edilir.",
    ]
    met_asm = get_list(seed, "met.asm") or [
        "KPI ölçüm kaynakları (audit/evidence/work item) erişilebilir olacak.",
        "KPI hesaplama semantiği release notlarıyla değiştirilecek.",
    ]
    met_val = get_list(seed, "met.val") or [
        "Pilot KPI hesapları örneklem ile doğrulanır.",
        "Trend raporları duplicate/yanlış sınıflandırma senaryolarıyla kontrol edilir.",
    ]
    met_rsk = get_list(seed, "met.rsk") or [
        "Ölçüm drift → KPI sözleşmesi + regression dataset",
        "Veri eksikliği → kalite sinyali + reconcile raporu",
        "Yanlış teşvik (yalnız hız) → kalite/risk metrikleriyle denge",
        "Yanlış sınıflandırma → training/label kalite kontrolü",
        "KPI gaming → anomaly detector + audit örneklemi",
        "Zaman semantiği hatası → takvim policy SSOT",
        "Gecikmeli veri → watermark + backfill",
        "Metric spam → dashboard governance",
        "KPI değişiklik çatışması → version + owner",
        "Trend yanlış yorum → commentary + context zorunluluğu",
    ]

    return PackSeed(
        core_dec=core_dec,
        core_grd=core_grd,
        core_asm=core_asm,
        core_val=core_val,
        core_rsk=core_rsk,
        ctrl_dec=ctrl_dec,
        ctrl_grd=ctrl_grd,
        ctrl_asm=ctrl_asm,
        ctrl_val=ctrl_val,
        ctrl_rsk=ctrl_rsk,
        met_kpi=met_kpi,
        met_dec=met_dec,
        met_grd=met_grd,
        met_asm=met_asm,
        met_val=met_val,
        met_rsk=met_rsk,
    )


def render_bm_doc(
    *,
    bm_num: str,
    topic_title: str,
    section_title: str,
    doc_code: str,
    version: str,
    scope_lines: list[str],
    operating_model_lines: list[str],
    decisions: list[str],
    guardrails: list[str],
    assumptions: list[str],
    validations: list[str],
    risks: list[str],
    kpis: list[str] | None = None,
    links: list[str] | None = None,
) -> str:
    def item(prefix_type: str, idx: int, text: str) -> str:
        return f"- BM-{bm_num}-{doc_code}-{prefix_type}-{idx:03d}: {text}"

    lines: list[str] = []
    lines.append(f"# BM-{bm_num}: {topic_title} — {section_title} ({version})")
    lines.append("")

    lines.append("-------------------------------------------------------------------------------")
    lines.append("1. AMAÇ")
    lines.append("-------------------------------------------------------------------------------")
    lines.append("")
    lines.append(f"{topic_title} için işletilebilir karar/guardrail/ölçüm sözleşmesini üretmek.")
    lines.append("")

    lines.append("-------------------------------------------------------------------------------")
    lines.append("2. KAPSAM")
    lines.append("-------------------------------------------------------------------------------")
    lines.append("")
    for x in scope_lines:
        lines.append(f"- {x}")
    lines.append("")

    if kpis:
        lines.append("KPI/KRI Seti (Minimum):")
        for i, k in enumerate(kpis, start=1):
            lines.append(item("KPI", i, k))
        lines.append("")

    lines.append("-------------------------------------------------------------------------------")
    lines.append("3. KAPSAM DIŞI")
    lines.append("-------------------------------------------------------------------------------")
    lines.append("")
    lines.append("- Tek seferlik ad-hoc çözümler ve elle takip süreçleri.")
    lines.append("- Domain dışı entegrasyon detayları (delivery fazına bırakılır).")
    lines.append("")

    lines.append("-------------------------------------------------------------------------------")
    lines.append("4. İŞLETİM MODELİ")
    lines.append("-------------------------------------------------------------------------------")
    lines.append("")
    for x in operating_model_lines:
        lines.append(f"- {x}")
    lines.append("")

    lines.append("-------------------------------------------------------------------------------")
    lines.append("5. KARAR NOKTALARI (ID'Lİ)")
    lines.append("-------------------------------------------------------------------------------")
    lines.append("")
    for i, x in enumerate(decisions, start=1):
        lines.append(item("DEC", i, x))
    lines.append("")

    lines.append("-------------------------------------------------------------------------------")
    lines.append("6. GUARDRAIL'LER (ID'Lİ)")
    lines.append("-------------------------------------------------------------------------------")
    lines.append("")
    for i, x in enumerate(guardrails, start=1):
        lines.append(item("GRD", i, x))
    lines.append("")

    lines.append("-------------------------------------------------------------------------------")
    lines.append("7. VARSAYIMLAR (ID'Lİ)")
    lines.append("-------------------------------------------------------------------------------")
    lines.append("")
    for i, x in enumerate(assumptions, start=1):
        lines.append(item("ASM", i, x))
    lines.append("")

    lines.append("-------------------------------------------------------------------------------")
    lines.append("8. DOĞRULAMA PLANI (ID'Lİ)")
    lines.append("-------------------------------------------------------------------------------")
    lines.append("")
    for i, x in enumerate(validations, start=1):
        lines.append(item("VAL", i, x))
    lines.append("")

    lines.append("-------------------------------------------------------------------------------")
    lines.append("9. TOP 10 SÜRPRİZ ÖNLEYİCİ (ID'Lİ)")
    lines.append("-------------------------------------------------------------------------------")
    lines.append("")
    for i, x in enumerate(risks, start=1):
        lines.append(item("RSK", i, x))
    lines.append("")

    lines.append("-------------------------------------------------------------------------------")
    lines.append("10. LİNKLER")
    lines.append("-------------------------------------------------------------------------------")
    lines.append("")
    if links:
        for x in links:
            lines.append(f"- {x}")
    else:
        lines.append("- (bu pack, ilgili PB/PRD/SPEC/TRACE setiyle bağlanmalıdır)")
    lines.append("")

    return "\n".join(lines)


@dataclass(frozen=True)
class BenchMatrixRow:
    area: str
    capability: str
    evidence_type: str
    source: str
    date: str
    note: str


@dataclass(frozen=True)
class BenchSeed:
    matrix_dimensions: dict[str, list[str]]
    matrix_rows: list[BenchMatrixRow]
    trends: list[str]
    gaps: list[str]
    ai_suitable: list[str]
    ai_risky: list[str]
    ai_controls: list[str]


def load_bench_rows(seed: dict[str, Any], *, default_date: str, default_source: str) -> list[BenchMatrixRow]:
    raw = seed.get("bench.matrix_rows")
    if raw is None:
        return []
    if not isinstance(raw, list):
        raise ValueError("seed.bench.matrix_rows must be a list")
    out: list[BenchMatrixRow] = []
    for i, row in enumerate(raw, start=1):
        if not isinstance(row, dict):
            raise ValueError(f"seed.bench.matrix_rows[{i}] must be an object")
        area = str(row.get("area", "")).strip()
        capability = str(row.get("capability", "")).strip()
        evidence_type = str(row.get("evidence_type", "doc")).strip()
        source = str(row.get("source", default_source)).strip()
        date = str(row.get("date", default_date)).strip()
        note = str(row.get("note", "")).strip()
        if not (area and capability and evidence_type and source and date and note):
            raise ValueError(f"seed.bench.matrix_rows[{i}] fields must be non-empty: area/capability/evidence_type/source/date/note")
        out.append(
            BenchMatrixRow(
                area=area,
                capability=capability,
                evidence_type=evidence_type,
                source=source,
                date=date,
                note=note,
            )
        )
    return out


def build_bench_seed(topic_title: str, *, seed: dict[str, Any], bm_topic_dir: str) -> BenchSeed:
    default_date = datetime.now(timezone.utc).strftime("%Y-%m")
    default_source = bm_topic_dir

    matrix_dimensions: dict[str, list[str]] = {
        "Intake": [
            "Çok kanallı giriş (web/e-posta/telefon)",
            "Anonimlik + iki yönlü güvenli iletişim",
            "Çok dil desteği",
        ],
        "Workflow": [
            "Triage + yönlendirme",
            "SLA/eskalasyon semantiği",
            "Rol bazlı görünürlük (need-to-know)",
        ],
        "Evidence & Audit": [
            "Delil/ek yönetimi + sürümleme",
            "Audit trail (who-did-what + actor)",
            "Görüntüleme logu (need-to-know kanıtı)",
        ],
        "Reporting": [
            "Trend/tekrar/kapanış kalitesi raporları",
            "Export/raporlama (policy kontrollü)",
        ],
        "Integrations": [
            "CSV/API import/export",
            "Idempotency/retry ve veri tutarlılığı",
        ],
        "AI (Governance)": [
            "Özetleme/sınıflandırma/benzer kayıt asistanı",
            "PII redaksiyon (kontrollü)",
            "İzinli/yasaklı kullanım sınırları (policy)",
        ],
    }

    rows = load_bench_rows(seed, default_date=default_date, default_source=default_source)
    if not rows:
        rows = [
            BenchMatrixRow("Intake", "Çok kanallı giriş", "doc", default_source, default_date, "Baseline kriter seti (repo içi SSOT)."),
            BenchMatrixRow("Intake", "Anonim + iki yönlü güvenli iletişim", "doc", default_source, default_date, "Baseline kriter seti (repo içi SSOT)."),
            BenchMatrixRow("Workflow", "Triage routing policy", "doc", default_source, default_date, "Baseline kriter seti (repo içi SSOT)."),
            BenchMatrixRow("Workflow", "SLA/eskalasyon semantiği", "doc", default_source, default_date, "Baseline kriter seti (repo içi SSOT)."),
            BenchMatrixRow("Evidence & Audit", "Evidence sürümleme/immutability", "doc", default_source, default_date, "Baseline kriter seti (repo içi SSOT)."),
            BenchMatrixRow("Evidence & Audit", "Audit trail derinliği", "doc", default_source, default_date, "Baseline kriter seti (repo içi SSOT)."),
            BenchMatrixRow("Reporting", "Trend/gap raporlama", "doc", default_source, default_date, "Baseline kriter seti (repo içi SSOT)."),
            BenchMatrixRow("Reporting", "Export policy + redaksiyon", "doc", default_source, default_date, "Baseline kriter seti (repo içi SSOT)."),
            BenchMatrixRow("Integrations", "CSV/API import/export", "doc", default_source, default_date, "Baseline kriter seti (repo içi SSOT)."),
            BenchMatrixRow("AI (Governance)", "AI asistan rolü + guardrail", "doc", default_source, default_date, "Baseline kriter seti (repo içi SSOT)."),
        ]

    trends = get_list(seed, "bench.trends") or [
        "“Feature listesi” → “işletilebilir sistem” (policy + audit + evidence) beklentisi",
        "Hız metrikleri → kalite ve risk sinyalleri ile dengeleme",
        "Platformlaşma: ortak yeteneklerin (SLA/Audit/Evidence/Reporting) ürünleşmesi",
    ]
    gaps = get_list(seed, "bench.gaps") or [
        "Permission boundary/need-to-know uygulamasının yüzeysel kalması",
        "Evidence/attachment disiplininin zayıf olması",
        "SLA semantiğinin belirsiz olması (iş günü/tatil/timezone)",
    ]
    ai_suitable = get_list(seed, "bench.ai_suitable") or [
        "Özetleme, kategori önerisi, benzer kayıt eşleştirme",
        "PII redaksiyon (kontrollü)",
        "Çok dilli destek (çeviri) – policy ile",
    ]
    ai_risky = get_list(seed, "bench.ai_risky") or [
        "İnsan onayı olmadan karar/aksiyon üretimi",
        "Suçlama/niyet okuma ve yaptırım önerisi",
    ]
    ai_controls = get_list(seed, "bench.ai_controls") or [
        "Human-in-the-loop zorunlu (otomatik karar yok).",
        "Veri sınıfı sınırı: allowlist dışında veri AI’ye gitmez.",
        "Audit: AI önerileri loglanır (model/version + input sınıfı).",
        "Redaksiyon: PII maskesi / güvenli özetleme.",
    ]

    return BenchSeed(
        matrix_dimensions=matrix_dimensions,
        matrix_rows=rows,
        trends=trends,
        gaps=gaps,
        ai_suitable=ai_suitable,
        ai_risky=ai_risky,
        ai_controls=ai_controls,
    )


def render_bench_matrix_doc(*, bench_num: str, title: str, version: str, gaps_doc_path: str, bm_dir: str, seed: BenchSeed) -> str:
    lines: list[str] = []
    lines.append(f"# BENCH-{bench_num}: {title} — Capability Matrix (v{version})")
    lines.append("")
    lines.append("-------------------------------------------------------------------------------")
    lines.append("1. AMAÇ")
    lines.append("-------------------------------------------------------------------------------")
    lines.append("")
    lines.append("Çözümleri “kanıtlanabilir kapabilite” kriterleriyle kıyaslamak için SSOT üretmek.")
    lines.append("")
    lines.append("-------------------------------------------------------------------------------")
    lines.append("2. KAPSAM")
    lines.append("-------------------------------------------------------------------------------")
    lines.append("")
    lines.append("- Bu doküman BENCH pack’in “capability matrix + kanıt standardı” SSOT’udur.")
    lines.append("- Trend/gap/AI analizi BENCH pack’in ikinci dokümanında tutulur.")
    lines.append("")
    lines.append("-------------------------------------------------------------------------------")
    lines.append("3. CAPABILITY MATRIX (KANIT STANDARDI)")
    lines.append("-------------------------------------------------------------------------------")
    lines.append("")
    lines.append("Matrix Boyutları (Kriter Seti):")
    lines.append("")
    for dim, items in seed.matrix_dimensions.items():
        lines.append(f"### {dim}")
        for x in items:
            lines.append(f"- {x}")
        lines.append("")
    lines.append("Kanıt Standardı (Zorunlu):")
    lines.append("- Kanıt Türü: `doc` / `demo` / `referans` / `sertifika` / `whitepaper` / `kontrat`")
    lines.append("- Kaynak: link veya repo içi referans")
    lines.append("- Tarih: `YYYY-MM` (örn. 2025-12)")
    lines.append("- Not: kısa gözlem")
    lines.append("")
    lines.append("Matrix (Başlangıç Seti):")
    lines.append("")
    lines.append("| Alan | Kapabilite | Kanıt Türü | Kaynak | Tarih | Not |")
    lines.append("|---|---|---|---|---|---|")
    for r in seed.matrix_rows:
        lines.append(f"| {r.area} | {r.capability} | {r.evidence_type} | {r.source} | {r.date} | {r.note} |")
    lines.append("")
    lines.append("-------------------------------------------------------------------------------")
    lines.append("4. TRENDLER")
    lines.append("-------------------------------------------------------------------------------")
    lines.append("")
    lines.append("Bu bölüm BENCH pack’in ikinci dokümanında tutulur:")
    lines.append(f"- `{gaps_doc_path}`")
    lines.append("")
    lines.append("-------------------------------------------------------------------------------")
    lines.append("5. BOŞLUKLAR (GAPS)")
    lines.append("-------------------------------------------------------------------------------")
    lines.append("")
    lines.append("Bu bölüm BENCH pack’in ikinci dokümanında tutulur:")
    lines.append(f"- `{gaps_doc_path}`")
    lines.append("")
    lines.append("-------------------------------------------------------------------------------")
    lines.append("6. AI YAPILABİLİRLİK + RİSK KONTROLLERİ")
    lines.append("-------------------------------------------------------------------------------")
    lines.append("")
    lines.append("Bu bölüm BENCH pack’in ikinci dokümanında tutulur:")
    lines.append(f"- `{gaps_doc_path}`")
    lines.append("")
    lines.append("-------------------------------------------------------------------------------")
    lines.append("7. LİNKLER / KAYNAKLAR")
    lines.append("-------------------------------------------------------------------------------")
    lines.append("")
    lines.append(f"- BENCH Pack (2. doküman): `{gaps_doc_path}`")
    lines.append(f"- BM Pack: `{bm_dir}`")
    lines.append("- PRD: (ilgili PRD bu topic için bağlanmalıdır)")
    lines.append("")
    return "\n".join(lines)


def render_bench_gaps_doc(*, bench_num: str, title: str, version: str, matrix_doc_path: str, bm_dir: str, seed: BenchSeed) -> str:
    lines: list[str] = []
    lines.append(f"# BENCH-{bench_num}: {title} — Trendler, Boşluklar, AI Yapılabilirlik (v{version})")
    lines.append("")
    lines.append("-------------------------------------------------------------------------------")
    lines.append("1. AMAÇ")
    lines.append("-------------------------------------------------------------------------------")
    lines.append("")
    lines.append("Sektör trendlerini, tipik boşlukları ve AI’nin “asistan rolü” olarak nerede değer üretebileceğini çıkarmak.")
    lines.append("")
    lines.append("-------------------------------------------------------------------------------")
    lines.append("2. KAPSAM")
    lines.append("-------------------------------------------------------------------------------")
    lines.append("")
    lines.append("- Bu doküman BENCH pack’in “trend/gap/AI” kısmıdır.")
    lines.append("- Capability matrix + kanıt standardı ayrı dokümanda tutulur.")
    lines.append("")
    lines.append("-------------------------------------------------------------------------------")
    lines.append("3. CAPABILITY MATRIX (KANIT STANDARDI)")
    lines.append("-------------------------------------------------------------------------------")
    lines.append("")
    lines.append("Capability matrix ve kanıt standardı burada SSOT’tur:")
    lines.append(f"- `{matrix_doc_path}`")
    lines.append("")
    lines.append("-------------------------------------------------------------------------------")
    lines.append("4. TRENDLER")
    lines.append("-------------------------------------------------------------------------------")
    lines.append("")
    for x in seed.trends:
        lines.append(f"- {x}")
    lines.append("")
    lines.append("-------------------------------------------------------------------------------")
    lines.append("5. BOŞLUKLAR (GAPS)")
    lines.append("-------------------------------------------------------------------------------")
    lines.append("")
    for x in seed.gaps:
        lines.append(f"- {x}")
    lines.append("")
    lines.append("-------------------------------------------------------------------------------")
    lines.append("6. AI YAPILABİLİRLİK + RİSK KONTROLLERİ")
    lines.append("-------------------------------------------------------------------------------")
    lines.append("")
    lines.append("AI Yapılabilirlik (Asistan Rolü):")
    lines.append("")
    lines.append("Uygun:")
    for x in seed.ai_suitable:
        lines.append(f"- {x}")
    lines.append("")
    lines.append("Riskli / Yasak:")
    for x in seed.ai_risky:
        lines.append(f"- {x}")
    lines.append("")
    lines.append("Guardrail Önerileri (Minimum):")
    for x in seed.ai_controls:
        lines.append(f"- {x}")
    lines.append("")
    lines.append("-------------------------------------------------------------------------------")
    lines.append("7. LİNKLER / KAYNAKLAR")
    lines.append("-------------------------------------------------------------------------------")
    lines.append("")
    lines.append(f"- BENCH Pack (matrix): `{matrix_doc_path}`")
    lines.append(f"- BM Pack: `{bm_dir}`")
    lines.append("- PRD: (ilgili PRD bu topic için bağlanmalıdır)")
    lines.append("")
    return "\n".join(lines)


def cmd_bm_pack(args: argparse.Namespace) -> int:
    try:
        topic = norm_topic_folder(args.topic)
        slug = norm_slug(args.slug)
        bm_num = norm_num4(args.bm)
    except Exception as e:
        return die(str(e))

    title = (args.title or slug.replace("-", " ").title()).strip()
    version = (args.version or DEFAULT_VERSION).strip()

    try:
        seed = load_seed(Path(args.seed)) if args.seed else {}
    except Exception as e:
        return die(f"seed load failed: {e}")

    pack = build_seed(title, slug, seed)
    out_dir = BM_ROOT / topic

    core_path = out_dir / f"BM-{bm_num}-{slug}-core-operating-model.md"
    ctrl_path = out_dir / f"BM-{bm_num}-{slug}-controls-compliance-risk.md"
    met_path = out_dir / f"BM-{bm_num}-{slug}-metrics-improvement.md"

    core = render_bm_doc(
        bm_num=bm_num,
        topic_title=title,
        section_title="Core İşletim Modeli",
        doc_code="CORE",
        version=version,
        scope_lines=["Konu kapsamı ve core işletim modeli", "Minimum domain akışı ve state/flow"],
        operating_model_lines=["Intake → triage → karar/aksiyon → kapanış", "Sürekli iyileştirme: trend → backlog"],
        decisions=pack.core_dec,
        guardrails=pack.core_grd,
        assumptions=pack.core_asm,
        validations=pack.core_val,
        risks=pack.core_rsk,
        links=None,
    )

    ctrl = render_bm_doc(
        bm_num=bm_num,
        topic_title=title,
        section_title="Controls (Uyum, Risk, Denetim)",
        doc_code="CTRL",
        version=version,
        scope_lines=["Yetki sınırları, audit, evidence, export/bildirim kontrolleri", "Permission boundary (need-to-know)"],
        operating_model_lines=["Kontroller domain akışında gating olarak çalışır", "Kritik aksiyonlar ayrı yetki + audit ile korunur"],
        decisions=pack.ctrl_dec,
        guardrails=pack.ctrl_grd,
        assumptions=pack.ctrl_asm,
        validations=pack.ctrl_val,
        risks=pack.ctrl_rsk,
        links=[f"BM Core: `{core_path.as_posix()}`"],
    )

    met = render_bm_doc(
        bm_num=bm_num,
        topic_title=title,
        section_title="Metrics & Improvement",
        doc_code="MET",
        version=version,
        scope_lines=["Minimum KPI/KRI seti", "Trend ve raporlama sinyalleri"],
        operating_model_lines=["Haftalık KPI review", "Aylık trend review", "Çeyreklik program review (drift kontrolü)"],
        decisions=pack.met_dec,
        guardrails=pack.met_grd,
        assumptions=pack.met_asm,
        validations=pack.met_val,
        risks=pack.met_rsk,
        kpis=pack.met_kpi,
        links=[f"BM Core: `{core_path.as_posix()}`"],
    )

    write_file(core_path, core, dry_run=args.dry_run, overwrite=args.overwrite)
    write_file(ctrl_path, ctrl, dry_run=args.dry_run, overwrite=args.overwrite)
    write_file(met_path, met, dry_run=args.dry_run, overwrite=args.overwrite)

    print("[doc_production_generate] PASS")
    return 0


def cmd_bench_pack(args: argparse.Namespace) -> int:
    try:
        topic = norm_topic_folder(args.topic)
        slug = norm_slug(args.slug)
        bench_num = norm_num4(args.bench)
    except Exception as e:
        return die(str(e))

    title = (args.title or slug.replace("-", " ").title()).strip()
    version = (args.version or DEFAULT_VERSION).strip().lstrip("v")

    try:
        seed = load_seed(Path(args.seed)) if args.seed else {}
    except Exception as e:
        return die(f"seed load failed: {e}")

    out_dir = BENCH_ROOT / topic
    matrix_path = out_dir / f"BENCH-{bench_num}-{slug}-capability-matrix.md"
    gaps_path = out_dir / f"BENCH-{bench_num}-{slug}-gaps-trends-ai.md"

    bm_dir = f"docs/01-product/BUSINESS-MASTERS/{topic}/"
    bench_seed = build_bench_seed(title, seed=seed, bm_topic_dir=bm_dir)

    matrix_doc = render_bench_matrix_doc(
        bench_num=bench_num,
        title=title,
        version=version,
        gaps_doc_path=gaps_path.as_posix(),
        bm_dir=bm_dir,
        seed=bench_seed,
    )
    gaps_doc = render_bench_gaps_doc(
        bench_num=bench_num,
        title=title,
        version=version,
        matrix_doc_path=matrix_path.as_posix(),
        bm_dir=bm_dir,
        seed=bench_seed,
    )

    write_file(matrix_path, matrix_doc, dry_run=args.dry_run, overwrite=args.overwrite)
    write_file(gaps_path, gaps_doc, dry_run=args.dry_run, overwrite=args.overwrite)

    print("[doc_production_generate] PASS")
    return 0


def build_parser() -> argparse.ArgumentParser:
    ap = argparse.ArgumentParser(prog="doc_production_generate")
    sub = ap.add_subparsers(dest="cmd", required=True)

    p_bm = sub.add_parser("bm-pack", help="Generate BM pack docs (CORE/CTRL/MET)")
    p_bm.add_argument("--topic", required=True, help="Topic folder (UPPERCASE), e.g. ETHICS")
    p_bm.add_argument("--slug", required=True, help="Topic slug (kebab-case), e.g. ethics")
    p_bm.add_argument("--bm", required=True, help="BM number (4 digits), e.g. 0001")
    p_bm.add_argument("--title", default="", help="Human title (optional), e.g. Etik Programı")
    p_bm.add_argument("--version", default=DEFAULT_VERSION, help=f"Version label (default: {DEFAULT_VERSION})")
    p_bm.add_argument("--seed", default="", help="Optional seed json file to override lists (advanced)")
    p_bm.add_argument("--overwrite", action="store_true", help="Overwrite existing files")
    p_bm.add_argument("--dry-run", action="store_true", help="Do not write; only print planned outputs")

    p_bench = sub.add_parser("bench-pack", help="Generate BENCH pack docs (matrix + gaps/trends/ai)")
    p_bench.add_argument("--topic", required=True, help="Topic folder (UPPERCASE), e.g. ETHICS")
    p_bench.add_argument("--slug", required=True, help="Topic slug (kebab-case), e.g. ethics")
    p_bench.add_argument("--bench", required=True, help="BENCH number (4 digits), e.g. 0001")
    p_bench.add_argument("--title", default="", help="Human title (optional), e.g. Etik Sistemleri")
    p_bench.add_argument("--version", default=DEFAULT_VERSION, help=f"Version label (default: {DEFAULT_VERSION})")
    p_bench.add_argument("--seed", default="", help="Optional seed json file to override lists (advanced)")
    p_bench.add_argument("--overwrite", action="store_true", help="Overwrite existing files")
    p_bench.add_argument("--dry-run", action="store_true", help="Do not write; only print planned outputs")

    return ap


def main(argv: list[str] | None = None) -> int:
    ap = build_parser()
    args = ap.parse_args(argv)

    if args.cmd == "bm-pack":
        return cmd_bm_pack(args)
    if args.cmd == "bench-pack":
        return cmd_bench_pack(args)
    return die(f"unknown cmd: {args.cmd}")


if __name__ == "__main__":
    raise SystemExit(main())
