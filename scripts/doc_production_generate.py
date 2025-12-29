#!/usr/bin/env python3
"""
DOCS-PRODUCTION generator (v0.1)

Amaç:
- Direct-Gen doküman üretim akışında "pack" üretimini hızlandırmak:
  - BM pack
  - BENCH pack
  - TRACE pack
  - Delivery pack (PB/PRD/SPEC/STORY/AC/TP skeleton)
- Çıktılar non-TBD starter content üretir (content-policy gate’leri ile uyumlu).

Usage (example):
  python3 scripts/doc_production_generate.py bm-pack --topic ETHICS --slug ethics --bm 0007 --title "Etik Programı"
  python3 scripts/doc_production_generate.py e2e-pack --topic ETHICS --delivery-slug ethics-speakup-and-case-management-mvp --bm 0001 --bench 0001 --trace 0001 --pb 0004 --prd 0004 --spec 0013 --story 0306
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
TRACE_ROOT = Path("docs/03-delivery/TRACES")
RUNBOOK_ROOT = Path("docs/04-operations/RUNBOOKS")
GUIDES_ROOT = Path("docs/03-delivery/guides")
INTERFACE_CONTRACT_ROOT = Path("docs/03-delivery/INTERFACE-CONTRACTS")
DATA_CARD_ROOT = Path("docs/05-ml-ai/DATA-CARDS")
MODEL_CARD_ROOT = Path("docs/05-ml-ai/MODEL-CARDS")
SERVICES_ROOT = Path("docs/02-architecture/services")
PB_ROOT = Path("docs/01-product/PROBLEM-BRIEFS")
PRD_ROOT = Path("docs/01-product/PRD")
SPEC_ROOT = Path("docs/03-delivery/SPECS")
STORY_ROOT = Path("docs/03-delivery/STORIES")
AC_ROOT = Path("docs/03-delivery/ACCEPTANCE")
TP_ROOT = Path("docs/03-delivery/TEST-PLANS")
DEFAULT_VERSION = "v0.1"
TEMPLATES_ROOT = Path("docs/99-templates")

RE_BM_ITEM_ID = re.compile(r"\bBM-(?P<bm>\d{4})-(?P<doc>CORE|CTRL|MET)-(?P<typ>DEC|GRD|KPI|RSK|ASM|VAL)-(?P<seq>\d{3})\b")

TRACE_ALLOWED_TARGET_TYPES = {
    "PB",
    "PRD",
    "PLATFORM_SPEC",
    "SPEC",
    "ADR",
    "TECH-DESIGN",
    "GUIDE",
    "INTERFACE-CONTRACT",
    "STORY",
    "AC",
    "TP",
    "RB",
    "DATA-CARD",
    "MODEL-CARD",
    "OBS",
}
TRACE_ALLOWED_MAPPING_QUALITY = {"coarse", "refined"}

SEP = "-------------------------------------------------------------------------------"


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


def norm_risk_level(s: str) -> str:
    s = s.strip().lower()
    if s not in {"low", "medium", "high"}:
        raise ValueError("Risk_Level must be one of: low|medium|high")
    return s


def topic_slug_from_folder(topic: str) -> str:
    # Best-effort normalization: ETHICS -> ethics, MY_TOPIC -> my-topic
    return topic.strip().lower().replace("_", "-")


def ensure_owner(owner: str) -> str:
    owner = owner.strip()
    if not owner:
        raise ValueError("Owner is required (e.g. @team/platform)")
    return owner


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


def get_str(seed: dict[str, Any], key: str) -> str | None:
    val = seed.get(key)
    if val is None:
        return None
    if not isinstance(val, str) or not val.strip():
        raise ValueError(f"seed.{key} must be non-empty string")
    return val.strip()


def read_story_downstream_tokens(path: Path) -> list[str]:
    if not path.exists():
        return []
    lines = path.read_text(encoding="utf-8", errors="ignore").splitlines()[:25]
    for line in lines:
        if line.strip().startswith("Downstream:"):
            raw = line.split(":", 1)[1]
            tokens = [t.strip() for t in re.split(r"[,\s]+", raw) if t.strip()]
            return tokens
    return []


def load_template_text(template_filename: str) -> str:
    path = TEMPLATES_ROOT / template_filename
    if not path.exists():
        raise FileNotFoundError(path)
    return path.read_text(encoding="utf-8", errors="ignore")


def next_guide_num() -> str:
    rx = re.compile(r"^GUIDE-(?P<num>\d{4})-", re.IGNORECASE)
    nums: list[int] = []
    if GUIDES_ROOT.exists():
        for p in GUIDES_ROOT.rglob("GUIDE-*.md"):
            if not p.is_file():
                continue
            m = rx.match(p.name)
            if m:
                nums.append(int(m.group("num")))
    nxt = (max(nums) + 1) if nums else 1
    if nxt > 9999:
        raise ValueError("GUIDE id overflow (max=9999)")
    return f"{nxt:04d}"


def next_adr_num() -> str:
    rx = re.compile(r"^ADR-(?P<num>\d{4})-", re.IGNORECASE)
    nums: list[int] = []
    if SERVICES_ROOT.exists():
        for p in SERVICES_ROOT.glob("*/ADR/ADR-*.md"):
            if not p.is_file():
                continue
            m = rx.match(p.name)
            if m:
                nums.append(int(m.group("num")))
    nxt = (max(nums) + 1) if nums else 1
    if nxt > 9999:
        raise ValueError("ADR id overflow (max=9999)")
    return f"{nxt:04d}"


RE_PRD_DELIVERY_ITEMS_SSOT = re.compile(r"```json\s*(?P<body>.*?)\s*```", re.IGNORECASE | re.DOTALL)
RE_PRD_PB_META = re.compile(r"(?mi)^Problem Brief:\s*(?P<pb>PB-\d{4})\b")
RE_PRD_TITLE = re.compile(r"(?m)^#\s*PRD-\d{4}\s*[–-]\s*(?P<title>.+?)\s*$")
RE_PRD_FILENAME_SLUG = re.compile(
    r"^PRD-(?P<num>\d{4})-(?P<slug>[a-z0-9]+(?:-[a-z0-9]+)*)\.md$", re.IGNORECASE
)


def parse_prd_title(prd_text: str) -> str | None:
    m = RE_PRD_TITLE.search(prd_text)
    if not m:
        return None
    return m.group("title").strip()


def parse_prd_pb_id(prd_text: str) -> str | None:
    m = RE_PRD_PB_META.search(prd_text)
    if not m:
        return None
    return m.group("pb").upper()


def slug_from_prd_filename(prd_path: Path) -> str | None:
    m = RE_PRD_FILENAME_SLUG.match(prd_path.name)
    if not m:
        return None
    return norm_slug(m.group("slug"))


def extract_prd_delivery_items_ssot(prd_text: str) -> dict[str, Any] | None:
    for m in RE_PRD_DELIVERY_ITEMS_SSOT.finditer(prd_text):
        body = m.group("body").strip()
        if not body.startswith("{"):
            continue
        try:
            data = json.loads(body)
        except Exception:
            continue
        if isinstance(data, dict) and data.get("ssot") == "PRD_DELIVERY_ITEMS_V1":
            return data
    return None


def normalize_optional_doc_token(raw: str) -> str:
    s = raw.strip()
    if not s:
        raise ValueError("empty optional_docs token")
    return s.upper().replace("_", "-")


def load_prd_delivery_items_or_die(prd_path: Path) -> list[dict[str, Any]]:
    prd_text = prd_path.read_text(encoding="utf-8", errors="ignore")
    data = extract_prd_delivery_items_ssot(prd_text)
    if not data:
        raise ValueError("PRD_DELIVERY_ITEMS_V1 JSON block not found (see PRD.template.md section 10)")
    items = data.get("delivery_items")
    if not isinstance(items, list):
        raise ValueError("delivery_items must be a list")

    normalized: list[dict[str, Any]] = []
    seen_ids: set[str] = set()
    seen_slugs: set[str] = set()

    for it in items:
        if not isinstance(it, dict):
            raise ValueError("each delivery_item must be an object")
        item_id = str(it.get("id", "")).strip()
        title = str(it.get("title", "")).strip()
        slug = str(it.get("slug", "")).strip()
        if not item_id or not title or not slug:
            raise ValueError("delivery_item requires: id, title, slug")
        slug = norm_slug(slug)
        if item_id in seen_ids:
            raise ValueError(f"duplicate delivery_item.id: {item_id}")
        if slug in seen_slugs:
            raise ValueError(f"duplicate delivery_item.slug: {slug}")
        seen_ids.add(item_id)
        seen_slugs.add(slug)

        split_by = str(it.get("split_by") or "none").strip().lower()
        if split_by not in {"none", "stream"}:
            raise ValueError(f"{item_id}: split_by must be none|stream")

        streams_raw = it.get("streams") or []
        if not isinstance(streams_raw, list):
            raise ValueError(f"{item_id}: streams must be a list")
        streams: list[str] = []
        for s in streams_raw:
            if not isinstance(s, str) or not s.strip():
                raise ValueError(f"{item_id}: streams must contain non-empty strings")
            streams.append(norm_slug(s))
        if split_by == "stream" and not streams:
            raise ValueError(f"{item_id}: split_by=stream requires non-empty streams")

        services_raw = it.get("services") or []
        if not isinstance(services_raw, list):
            raise ValueError(f"{item_id}: services must be a list")
        services: list[str] = []
        for s in services_raw:
            if not isinstance(s, str) or not s.strip():
                raise ValueError(f"{item_id}: services must contain non-empty strings")
            services.append(norm_slug(s))

        spec_raw = it.get("spec")
        spec_num: str | None = None
        if spec_raw:
            s = str(spec_raw).strip().upper()
            if s.startswith("SPEC-"):
                s = s.split("-", 1)[1]
            spec_num = norm_num4(s)

        risk_raw = it.get("risk_level")
        risk_level: str | None = None
        if risk_raw:
            risk_level = norm_risk_level(str(risk_raw))

        optional_raw = it.get("optional_docs") or []
        if not isinstance(optional_raw, list):
            raise ValueError(f"{item_id}: optional_docs must be a list")
        optional_docs = [normalize_optional_doc_token(str(x)) for x in optional_raw if str(x).strip()]

        story_id_raw = it.get("story_id")
        story_id: str | None = None
        if story_id_raw:
            story_id = norm_num4(str(story_id_raw).strip().replace("STORY-", "").replace("STORY_", ""))

        story_ids_raw = it.get("story_ids")
        story_ids: dict[str, str] | None = None
        if story_ids_raw is not None:
            if not isinstance(story_ids_raw, dict):
                raise ValueError(f"{item_id}: story_ids must be an object (stream->id)")
            story_ids = {}
            for k, v in story_ids_raw.items():
                if not isinstance(k, str) or not k.strip():
                    raise ValueError(f"{item_id}: story_ids keys must be non-empty strings")
                if not isinstance(v, str) or not v.strip():
                    raise ValueError(f"{item_id}: story_ids values must be non-empty strings")
                story_ids[norm_slug(k)] = norm_num4(v.strip().replace("STORY-", ""))

        normalized.append(
            {
                "id": item_id,
                "title": title,
                "slug": slug,
                "split_by": split_by,
                "streams": streams,
                "services": services,
                "spec": spec_num,
                "risk_level": risk_level,
                "optional_docs": optional_docs,
                "story_id": story_id,
                "story_ids": story_ids,
            }
        )

    return normalized


def plan_auto_optional_docs(
    *,
    seed: dict[str, Any],
    story_signals_path: Path,
    delivery_slug: str,
    title: str,
    owner: str,
    spec_link_path: Path,
    trace_path: Path | None,
    include_runbook_link: bool,
    runbook_path: Path | None,
) -> tuple[list[str], list[tuple[Path, str]]]:
    """
    Auto-optional plan:
    - signals: seed.optional.generate + STORY Downstream tokens
    - outputs: downstream_extra tokens (for STORY meta) + optional docs to write
    """
    downstream_extra: list[str] = []
    optional_writes: list[tuple[Path, str]] = []

    try:
        tokens = get_list(seed, "optional.generate") + read_story_downstream_tokens(story_signals_path)
        service = get_str(seed, "optional.service")
    except Exception as e:
        raise ValueError(f"optional signals invalid: {e}") from e

    svc_rx = re.compile(r"^(?:svc|service)=(?P<svc>[a-z0-9]+(?:-[a-z0-9]+)*)$", re.IGNORECASE)
    cleaned: list[str] = []
    for tok in tokens:
        t = tok.strip()
        if not t:
            continue
        m = svc_rx.match(t)
        if m:
            service = service or m.group("svc")
            continue
        cleaned.append(t)

    try:
        service_slug = norm_slug(service) if service else ""
    except Exception as e:
        raise ValueError(f"optional.service invalid: {e}") from e

    if service_slug:
        downstream_extra.append(f"svc={service_slug}")

    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    adr_rx = re.compile(
        r"^(?P<id>ADR-\d{4})(?:-(?P<slug>[A-Za-z0-9-]+))?$",
        re.IGNORECASE,
    )
    guide_rx = re.compile(
        r"^(?P<id>GUIDE-\d{4})(?:-(?P<slug>[A-Za-z0-9-]+))?$",
        re.IGNORECASE,
    )
    typed_slug_rx = re.compile(
        r"^(?P<typ>TECH-DESIGN|TECH_DESIGN|INTERFACE-CONTRACT|INTERFACE_CONTRACT|DATA-CARD|MODEL-CARD)\s*=\s*(?P<slug>[A-Za-z0-9-]+)$",
        re.IGNORECASE,
    )

    adr_stems: list[str] = []
    guide_stems: list[str] = []
    tech_design_slugs: list[str] = []
    interface_contract_slugs: list[str] = []
    data_card_slugs: list[str] = []
    model_card_slugs: list[str] = []

    wants_tech_design_default = False
    wants_interface_contract_default = False
    wants_data_card_default = False
    wants_model_card_default = False
    wants_guide_auto = False
    wants_adr_auto = False

    for tok in cleaned:
        m = typed_slug_rx.match(tok)
        if m:
            typ = m.group("typ").strip().upper().replace("_", "-")
            slug_raw = m.group("slug").strip()
            try:
                slug_norm = norm_slug(slug_raw)
            except Exception as e:
                raise ValueError(f"{typ} slug invalid: {tok}: {e}") from e
            typed_token = f"{typ}={slug_norm}"
            if typ == "TECH-DESIGN":
                tech_design_slugs.append(slug_norm)
                downstream_extra.append(typed_token)
            elif typ == "INTERFACE-CONTRACT":
                interface_contract_slugs.append(slug_norm)
                downstream_extra.append(typed_token)
            elif typ == "DATA-CARD":
                data_card_slugs.append(slug_norm)
                downstream_extra.append(typed_token)
            elif typ == "MODEL-CARD":
                model_card_slugs.append(slug_norm)
                downstream_extra.append(typed_token)
            continue

        m = adr_rx.match(tok)
        if m:
            adr_id = m.group("id").upper()
            suffix = m.group("slug")
            if suffix:
                try:
                    suffix = norm_slug(suffix)
                except Exception as e:
                    raise ValueError(f"ADR slug invalid: {tok}: {e}") from e
                stem = f"{adr_id}-{suffix}"
            else:
                stem = f"{adr_id}-{delivery_slug}"
            adr_stems.append(stem)
            downstream_extra.append(adr_id)
            continue

        m = guide_rx.match(tok)
        if m:
            guide_id = m.group("id").upper()
            suffix = m.group("slug")
            if suffix:
                try:
                    suffix = norm_slug(suffix)
                except Exception as e:
                    raise ValueError(f"GUIDE slug invalid: {tok}: {e}") from e
                stem = f"{guide_id}-{suffix}"
            else:
                stem = f"{guide_id}-{delivery_slug}"
            guide_stems.append(stem)
            downstream_extra.append(guide_id)
            continue

        up = tok.strip().upper()
        if up == "ADR":
            wants_adr_auto = True
            continue
        if up in {"TECH-DESIGN", "TECH_DESIGN"}:
            wants_tech_design_default = True
            downstream_extra.append("TECH-DESIGN")
            continue
        if up == "GUIDE":
            wants_guide_auto = True
            continue
        if up in {"INTERFACE-CONTRACT", "INTERFACE_CONTRACT"}:
            wants_interface_contract_default = True
            downstream_extra.append("INTERFACE-CONTRACT")
            continue
        if up == "DATA-CARD":
            wants_data_card_default = True
            downstream_extra.append("DATA-CARD")
            continue
        if up == "MODEL-CARD":
            wants_model_card_default = True
            downstream_extra.append("MODEL-CARD")
            continue

    if wants_guide_auto and not guide_stems:
        guide_dir = GUIDES_ROOT / delivery_slug
        existing_guides = sorted([p for p in guide_dir.glob("GUIDE-*.md") if p.is_file()])
        if existing_guides:
            stem = existing_guides[0].stem
            guide_stems.append(stem)
            m = re.match(r"^(GUIDE-\d{4})", stem, re.IGNORECASE)
            if m:
                downstream_extra.append(m.group(1).upper())
        else:
            new_num = next_guide_num()
            guide_id = f"GUIDE-{new_num}"
            guide_stems.append(f"{guide_id}-{delivery_slug}")
            downstream_extra.append(guide_id)

    if wants_adr_auto and not adr_stems:
        new_num = next_adr_num()
        adr_id = f"ADR-{new_num}"
        adr_stems.append(f"{adr_id}-{delivery_slug}")
        downstream_extra.append(adr_id)

    tech_design_targets = set(tech_design_slugs)
    if wants_tech_design_default:
        tech_design_targets.add(delivery_slug)

    interface_contract_targets = set(interface_contract_slugs)
    if wants_interface_contract_default:
        interface_contract_targets.add(delivery_slug)

    data_card_targets = set(data_card_slugs)
    if wants_data_card_default:
        data_card_targets.add(delivery_slug)

    model_card_targets = set(model_card_slugs)
    if wants_model_card_default:
        model_card_targets.add(delivery_slug)

    # ADR / TECH-DESIGN are service-scoped; require explicit service.
    if (adr_stems or tech_design_targets) and not service_slug:
        raise ValueError("auto-optional requested ADR/TECH-DESIGN but optional.service is missing")

    runbook_path_s = runbook_path.as_posix() if runbook_path else ""

    if adr_stems:
        adr_links = [f"SPEC: `{spec_link_path.as_posix()}`", f"STORY: `{story_signals_path.as_posix()}`"]
        if trace_path:
            adr_links.append(f"TRACE: `{trace_path.as_posix()}`")
        if include_runbook_link and runbook_path_s:
            adr_links.append(f"RUNBOOK: `{runbook_path_s}`")
        for stem in sorted(set(adr_stems)):
            adr_id = stem.split("-", 2)[0] + "-" + stem.split("-", 2)[1]
            adr_doc = render_adr_doc(
                adr_id=adr_id,
                title=title,
                owner=owner,
                date=today,
                links=adr_links,
            )
            adr_path = SERVICES_ROOT / service_slug / "ADR" / f"{stem}.md"
            optional_writes.append((adr_path, adr_doc))

    if tech_design_targets:
        for td_slug in sorted(tech_design_targets):
            td_doc = render_tech_design_doc(title=title)
            td_path = SERVICES_ROOT / service_slug / f"TECH-DESIGN-{td_slug}.md"
            optional_writes.append((td_path, td_doc))

    if guide_stems:
        for stem in sorted(set(guide_stems)):
            guide_id = stem.split("-", 2)[0] + "-" + stem.split("-", 2)[1]
            guide_doc = render_guide_doc(guide_id=guide_id, title=title)
            guide_path = GUIDES_ROOT / delivery_slug / f"{stem}.md"
            optional_writes.append((guide_path, guide_doc))

    if interface_contract_targets:
        for ic_slug in sorted(interface_contract_targets):
            ic_id = f"IC-{ic_slug}"
            ic_doc = render_interface_contract_doc(title=title, ic_id=ic_id)
            ic_path = INTERFACE_CONTRACT_ROOT / f"INTERFACE-CONTRACT-{ic_slug}.md"
            optional_writes.append((ic_path, ic_doc))

    if data_card_targets:
        for dc_slug in sorted(data_card_targets):
            dc_doc = render_data_card_doc(title=title)
            dc_path = DATA_CARD_ROOT / f"DATA-CARD-{dc_slug}.md"
            optional_writes.append((dc_path, dc_doc))

    if model_card_targets:
        for mc_slug in sorted(model_card_targets):
            mc_doc = render_model_card_doc(title=title)
            mc_path = MODEL_CARD_ROOT / f"MODEL-CARD-{mc_slug}.md"
            optional_writes.append((mc_path, mc_doc))

    return downstream_extra, optional_writes


def find_existing_doc_by_id(*, root: Path, doc_id: str, preferred_slug: str = "", ext: str) -> Path | None:
    candidates = sorted([p for p in root.glob(f"{doc_id}-*.{ext}") if p.is_file()])
    if not candidates:
        return None
    if preferred_slug:
        preferred = root / f"{doc_id}-{preferred_slug}.{ext}"
        if preferred in candidates:
            return preferred
        by_contains = [p for p in candidates if preferred_slug in p.name]
        if by_contains:
            return by_contains[0]
    return candidates[0]


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


@dataclass(frozen=True)
class TraceMapping:
    target_type: str
    target_id: str
    mapping_quality: str
    notes: str


def sanitize_tsv_field(s: str) -> str:
    return str(s).replace("\t", " ").replace("\n", " ").strip()


def extract_bm_item_ids_for_pack(topic: str, bm_num: str) -> list[str]:
    topic_dir = BM_ROOT / topic
    if not topic_dir.exists():
        raise FileNotFoundError(topic_dir)

    items: set[str] = set()
    for p in sorted(topic_dir.glob(f"BM-{bm_num}-*.md")):
        if not p.is_file():
            continue
        txt = p.read_text(encoding="utf-8", errors="ignore")
        for m in RE_BM_ITEM_ID.finditer(txt):
            if m.group("bm") == bm_num:
                items.add(m.group(0))
    return sorted(items)


def extract_bm_item_ids_from_text(text: str, bm_num: str) -> set[str]:
    items: set[str] = set()
    for m in RE_BM_ITEM_ID.finditer(text):
        if m.group("bm") == bm_num:
            items.add(m.group(0))
    return items


def load_trace_overrides(seed: dict[str, Any]) -> dict[str, list[TraceMapping]]:
    raw = seed.get("trace.overrides")
    if raw is None:
        return {}
    if not isinstance(raw, dict):
        raise ValueError("seed.trace.overrides must be an object (BM_ITEM_ID -> list[mapping])")

    out: dict[str, list[TraceMapping]] = {}
    for bm_item_id, mappings in raw.items():
        if not isinstance(bm_item_id, str) or not bm_item_id.strip():
            raise ValueError("seed.trace.overrides keys must be non-empty strings (BM_ITEM_ID)")
        if not isinstance(mappings, list) or not mappings:
            raise ValueError(f"seed.trace.overrides[{bm_item_id}] must be a non-empty list")

        row_list: list[TraceMapping] = []
        for i, m in enumerate(mappings, start=1):
            if not isinstance(m, dict):
                raise ValueError(f"seed.trace.overrides[{bm_item_id}][{i}] must be an object")
            target_type = sanitize_tsv_field(m.get("target_type", "")).upper()
            target_id = sanitize_tsv_field(m.get("target_id", ""))
            mapping_quality = sanitize_tsv_field(m.get("mapping_quality", "")).lower()
            notes = sanitize_tsv_field(m.get("notes", ""))

            if target_type not in TRACE_ALLOWED_TARGET_TYPES:
                raise ValueError(f"seed.trace.overrides[{bm_item_id}][{i}].target_type invalid: {target_type!r}")
            if not target_id:
                raise ValueError(f"seed.trace.overrides[{bm_item_id}][{i}].target_id empty")
            if mapping_quality not in TRACE_ALLOWED_MAPPING_QUALITY:
                raise ValueError(f"seed.trace.overrides[{bm_item_id}][{i}].mapping_quality invalid: {mapping_quality!r}")
            if not notes:
                raise ValueError(f"seed.trace.overrides[{bm_item_id}][{i}].notes empty")

            row_list.append(
                TraceMapping(
                    target_type=target_type,
                    target_id=target_id,
                    mapping_quality=mapping_quality,
                    notes=notes,
                )
            )

        out[bm_item_id.strip()] = row_list
    return out


def cmd_trace_pack(args: argparse.Namespace) -> int:
    try:
        topic = norm_topic_folder(args.topic)
        slug = norm_slug(args.slug)
        trace_num = norm_num4(args.trace)
        bm_num = norm_num4(args.bm)
    except Exception as e:
        return die(str(e))

    default_target_type = sanitize_tsv_field(args.default_target_type).upper()
    default_target_id = sanitize_tsv_field(args.default_target_id)
    default_mapping_quality = sanitize_tsv_field(args.mapping_quality).lower() or "coarse"
    notes_base = sanitize_tsv_field(args.notes)

    if default_target_type not in TRACE_ALLOWED_TARGET_TYPES:
        return die(f"default_target_type must be one of {sorted(TRACE_ALLOWED_TARGET_TYPES)}")
    if not default_target_id:
        return die("default_target_id is required")
    if default_mapping_quality not in TRACE_ALLOWED_MAPPING_QUALITY:
        return die(f"mapping_quality must be one of {sorted(TRACE_ALLOWED_MAPPING_QUALITY)}")

    try:
        seed = load_seed(Path(args.seed)) if args.seed else {}
    except Exception as e:
        return die(f"seed load failed: {e}")

    try:
        overrides = load_trace_overrides(seed)
    except Exception as e:
        return die(f"trace overrides invalid: {e}")

    try:
        bm_items = extract_bm_item_ids_for_pack(topic, bm_num)
    except Exception as e:
        return die(f"BM pack read failed: {e}")
    if not bm_items:
        return die(f"no BM_ITEM_ID found for BM-{bm_num} under {BM_ROOT / topic}")

    out_path = TRACE_ROOT / f"TRACE-{trace_num}-{slug}-bm-to-delivery.tsv"

    header = "BM_ITEM_ID\tBM_SECTION\tTARGET_TYPE\tTARGET_ID\tmapping_quality\tNOTES"
    rows: list[tuple[str, str, str, str, str, str]] = []

    for bm_item_id in bm_items:
        mm = RE_BM_ITEM_ID.search(bm_item_id)
        if not mm:
            return die(f"internal error: cannot parse BM_ITEM_ID: {bm_item_id}")
        bm_section = mm.group("doc")

        if bm_item_id in overrides:
            for m in overrides[bm_item_id]:
                rows.append((bm_item_id, bm_section, m.target_type, m.target_id, m.mapping_quality, m.notes))
            continue

        if not notes_base:
            notes = (
                f"mapping_quality: {default_mapping_quality}; generated: trace-pack; "
                f"default {default_target_type}/{default_target_id}"
            )
        else:
            notes = notes_base

        rows.append((bm_item_id, bm_section, default_target_type, default_target_id, default_mapping_quality, notes))

    rows.sort(key=lambda r: (r[0], r[2], r[3]))
    content = header + "\n" + "\n".join("\t".join(r) for r in rows) + "\n"
    write_file(out_path, content, dry_run=args.dry_run, overwrite=args.overwrite)

    print("[doc_production_generate] PASS")
    return 0


def render_runbook_doc(
    *,
    runbook_id: str,
    title: str,
    service: str,
    owner: str,
    story_path: str | None,
    ac_path: str | None,
    tp_path: str | None,
    spec_path: str | None,
    trace_path: str | None,
) -> str:
    lines: list[str] = []
    lines.append(f"# {runbook_id} – {title} (Runbook)")
    lines.append("")
    lines.append(f"ID: {runbook_id}  ")
    lines.append(f"Service: {service}  ")
    lines.append("Status: Draft  ")
    lines.append(f"Owner: {owner}")
    lines.append("")
    lines.append(SEP)
    lines.append("1. AMAÇ")
    lines.append(SEP)
    lines.append("")
    lines.append("- Servisin nasıl işletileceğini tarif etmek.")
    lines.append("")
    lines.append(SEP)
    lines.append("2. KAPSAM")
    lines.append(SEP)
    lines.append("")
    lines.append(f"- Bu runbook `{service}` için başlangıç setidir.")
    lines.append("- Ortamlar: stage/prod (ops policy ile).")
    lines.append("")
    lines.append(SEP)
    lines.append("3. BAŞLATMA / DURDURMA")
    lines.append(SEP)
    lines.append("")
    lines.append("- Başlatma: deploy workflow ile (Release/Deploy runbook’ları).")
    lines.append("- Durdurma: rollback veya bakım modu (policy ile).")
    lines.append("")
    lines.append(SEP)
    lines.append("4. GÖZLEMLEME / LOG / METRİKLER")
    lines.append(SEP)
    lines.append("")
    lines.append("- Log index: `logs-<servis>-*` (örn. `logs-ethics-*`).")
    lines.append("- Dashboard: `service-overview/<servis>` (örn. Grafana).")
    lines.append("- Temel metrikler: error_rate, p95_latency, availability, queue_depth (varsa).")
    lines.append("")
    lines.append(SEP)
    lines.append("5. ARIZA DURUMLARI VE ADIMLAR")
    lines.append(SEP)
    lines.append("")
    lines.append("- [ ] Arıza senaryosu 1: artan error_rate → son deploy SHA + log korelasyonu + rollback kararı.")
    lines.append("- [ ] Arıza senaryosu 2: queue/backlog büyüyor → consumer health + retry/dlq + throttling kontrolü.")
    lines.append("")
    lines.append(SEP)
    lines.append("6. ÖZET")
    lines.append(SEP)
    lines.append("")
    lines.append("- Kritik not: değişiklikler PR + doc-qa gate ile taşınır; doğrudan main’e yazılmaz.")
    lines.append("")
    lines.append(SEP)
    lines.append("7. LİNKLER (İSTEĞE BAĞLI)")
    lines.append(SEP)
    lines.append("")
    if spec_path:
        lines.append(f"- SPEC: `{spec_path}`")
    if story_path:
        lines.append(f"- STORY: `{story_path}`")
    if ac_path:
        lines.append(f"- ACCEPTANCE: `{ac_path}`")
    if tp_path:
        lines.append(f"- TEST PLAN: `{tp_path}`")
    if trace_path:
        lines.append(f"- TRACE: `{trace_path}`")
    lines.append("- TECH-DESIGN: `docs/02-architecture/services/<servis>/TECH-DESIGN-*.md`")
    lines.append("- SLO/SLA: `docs/04-operations/SLO-SLA.md`")
    lines.append("")
    return "\n".join(lines) + "\n"


def render_adr_doc(
    *,
    adr_id: str,
    title: str,
    owner: str,
    date: str,
    links: list[str] | None,
) -> str:
    txt = load_template_text("ADR.template.md")
    txt = re.sub(r"(?m)^#\s+ADR-XXXX:\s+.*$", f"# {adr_id}: {title}", txt, count=1)
    txt = re.sub(r"(?m)^ID:\s+ADR-XXXX\s*$", f"ID: {adr_id}  ", txt, count=1)
    txt = re.sub(r"(?m)^Owner:\s+.*$", f"Owner: {owner}", txt, count=1)
    txt = re.sub(r"(?m)^Date:\s+.*$", f"Date: {date}  ", txt, count=1)
    if links:
        bullets = "\n".join([f"- {x}" for x in links])
        txt = re.sub(
            r"(?m)^-\s+İlgili\s+SPEC\s+/\s+STORY\s+/\s+RUNBOOK\s+/\s+referanslar\s*$",
            bullets,
            txt,
            count=1,
        )
    return txt.rstrip() + "\n"


def render_tech_design_doc(*, title: str) -> str:
    txt = load_template_text("TECH-DESIGN.template.md")
    txt = re.sub(r"(?m)^#\s+TECH-DESIGN\s+–\s+.*$", f"# TECH-DESIGN – {title}", txt, count=1)
    return txt.rstrip() + "\n"


def render_guide_doc(*, guide_id: str, title: str) -> str:
    # Template headings are the contract; we keep them and add minimal bullets.
    tmpl = load_template_text("GUIDE.template.md")
    headings = [ln.strip() for ln in tmpl.splitlines() if re.match(r"^\s*\d+\.\s+", ln)]

    out: list[str] = []
    out.append(f"# {guide_id}: {title}")
    out.append("")
    for h in headings:
        out.append(h)
        out.append("")
        out.append("- (kısa açıklama)")
        out.append("")
    return "\n".join(out).rstrip() + "\n"


def render_interface_contract_doc(*, title: str, ic_id: str) -> str:
    txt = load_template_text("INTERFACE-CONTRACT.template.md")
    txt = re.sub(r"(?m)^#\s+INTERFACE-CONTRACT\s+–\s+.*$", f"# INTERFACE-CONTRACT – {title}", txt, count=1)
    txt = re.sub(r"(?m)^ID:\s+.*$", f"ID: {ic_id}", txt, count=1)
    return txt.rstrip() + "\n"


def render_data_card_doc(*, title: str) -> str:
    txt = load_template_text("DATA-CARD.template.md")
    txt = re.sub(r"(?m)^#\s+DATA-CARD\s+–\s+.*$", f"# DATA-CARD – {title}", txt, count=1)
    return txt.rstrip() + "\n"


def render_model_card_doc(*, title: str) -> str:
    txt = load_template_text("MODEL-CARD.template.md")
    txt = re.sub(r"(?m)^#\s+MODEL-CARD\s+–\s+.*$", f"# MODEL-CARD – {title}", txt, count=1)
    return txt.rstrip() + "\n"


def cmd_e2e_pack(args: argparse.Namespace) -> int:
    try:
        topic = norm_topic_folder(args.topic)
        topic_slug = norm_slug(args.topic_slug) if args.topic_slug else topic_slug_from_folder(topic)
        delivery_slug = norm_slug(args.delivery_slug)
        bm_num = norm_num4(args.bm)
        bench_num = norm_num4(args.bench)
        trace_num = norm_num4(args.trace)
        pb_num = norm_num4(args.pb)
        prd_num = norm_num4(args.prd)
        spec_num = norm_num4(args.spec)
        story_num = norm_num4(args.story)
        risk_level = norm_risk_level(args.risk_level)
        owner = ensure_owner(args.owner)
    except Exception as e:
        return die(str(e))

    title = (args.title or delivery_slug.replace("-", " ").title()).strip()
    epic = (args.epic or "DOCS-PRODUCTION").strip() or "DOCS-PRODUCTION"
    version = (args.version or DEFAULT_VERSION).strip()

    trace_slug = norm_slug(args.trace_slug) if args.trace_slug else topic_slug

    # Seed (shared for bm/bench/trace packs)
    try:
        seed = load_seed(Path(args.seed)) if args.seed else {}
    except Exception as e:
        return die(f"seed load failed: {e}")

    # BM pack
    bm_seed = build_seed(title, topic_slug, seed)
    bm_out_dir = BM_ROOT / topic

    def pick_bm_part_path(*, token: str, default_filename: str) -> Path:
        if bm_out_dir.exists():
            existing = sorted(
                [
                    p
                    for p in bm_out_dir.glob(f"BM-{bm_num}-{topic_slug}-*.md")
                    if p.is_file() and token in p.name.casefold()
                ]
            )
            if existing:
                return existing[0]
        return bm_out_dir / default_filename

    bm_core_path = pick_bm_part_path(
        token="core",
        default_filename=f"BM-{bm_num}-{topic_slug}-core-operating-model.md",
    )
    bm_ctrl_path = pick_bm_part_path(
        token="controls",
        default_filename=f"BM-{bm_num}-{topic_slug}-controls-compliance-risk.md",
    )
    bm_met_path = pick_bm_part_path(
        token="metrics",
        default_filename=f"BM-{bm_num}-{topic_slug}-metrics-improvement.md",
    )

    bm_core = render_bm_doc(
        bm_num=bm_num,
        topic_title=title,
        section_title="Core İşletim Modeli",
        doc_code="CORE",
        version=version,
        scope_lines=["Konu kapsamı ve core işletim modeli", "Minimum domain akışı ve state/flow"],
        operating_model_lines=["Intake → triage → karar/aksiyon → kapanış", "Sürekli iyileştirme: trend → backlog"],
        decisions=bm_seed.core_dec,
        guardrails=bm_seed.core_grd,
        assumptions=bm_seed.core_asm,
        validations=bm_seed.core_val,
        risks=bm_seed.core_rsk,
        links=None,
    )
    bm_ctrl = render_bm_doc(
        bm_num=bm_num,
        topic_title=title,
        section_title="Controls (Uyum, Risk, Denetim)",
        doc_code="CTRL",
        version=version,
        scope_lines=["Yetki sınırları, audit, evidence, export/bildirim kontrolleri", "Permission boundary (need-to-know)"],
        operating_model_lines=["Kontroller domain akışında gating olarak çalışır", "Kritik aksiyonlar ayrı yetki + audit ile korunur"],
        decisions=bm_seed.ctrl_dec,
        guardrails=bm_seed.ctrl_grd,
        assumptions=bm_seed.ctrl_asm,
        validations=bm_seed.ctrl_val,
        risks=bm_seed.ctrl_rsk,
        links=[f"BM Core: `{bm_core_path.as_posix()}`"],
    )
    bm_met = render_bm_doc(
        bm_num=bm_num,
        topic_title=title,
        section_title="Metrics & Improvement",
        doc_code="MET",
        version=version,
        scope_lines=["Minimum KPI/KRI seti", "Trend ve raporlama sinyalleri"],
        operating_model_lines=["Haftalık KPI review", "Aylık trend review", "Çeyreklik program review (drift kontrolü)"],
        decisions=bm_seed.met_dec,
        guardrails=bm_seed.met_grd,
        assumptions=bm_seed.met_asm,
        validations=bm_seed.met_val,
        risks=bm_seed.met_rsk,
        kpis=bm_seed.met_kpi,
        links=[f"BM Core: `{bm_core_path.as_posix()}`"],
    )

    # BENCH pack
    bench_version = version.strip().lstrip("v")
    bench_out_dir = BENCH_ROOT / topic

    def pick_bench_part_path(*, token: str, default_filename: str) -> Path:
        if bench_out_dir.exists():
            existing = sorted(
                [
                    p
                    for p in bench_out_dir.glob(f"BENCH-{bench_num}-{topic_slug}-*.md")
                    if p.is_file() and token in p.name.casefold()
                ]
            )
            if existing:
                return existing[0]
        return bench_out_dir / default_filename

    bench_matrix_path = pick_bench_part_path(
        token="capability",
        default_filename=f"BENCH-{bench_num}-{topic_slug}-capability-matrix.md",
    )
    bench_gaps_path = pick_bench_part_path(
        token="gaps",
        default_filename=f"BENCH-{bench_num}-{topic_slug}-gaps-trends-ai.md",
    )

    bm_dir_for_links = (BM_ROOT / topic).as_posix() + "/"
    bench_seed = build_bench_seed(title, seed=seed, bm_topic_dir=bm_dir_for_links)
    bench_matrix_doc = render_bench_matrix_doc(
        bench_num=bench_num,
        title=title,
        version=bench_version,
        gaps_doc_path=bench_gaps_path.as_posix(),
        bm_dir=bm_dir_for_links,
        seed=bench_seed,
    )
    bench_gaps_doc = render_bench_gaps_doc(
        bench_num=bench_num,
        title=title,
        version=bench_version,
        matrix_doc_path=bench_matrix_path.as_posix(),
        bm_dir=bm_dir_for_links,
        seed=bench_seed,
    )

    # TRACE pack (BM items: prefer disk if not overwriting, else generated BM docs)
    bm_items: set[str] = set()
    if not args.overwrite:
        try:
            bm_items |= set(extract_bm_item_ids_for_pack(topic, bm_num))
        except Exception:
            bm_items = set()
    if not bm_items:
        bm_items |= extract_bm_item_ids_from_text(bm_core, bm_num)
        bm_items |= extract_bm_item_ids_from_text(bm_ctrl, bm_num)
        bm_items |= extract_bm_item_ids_from_text(bm_met, bm_num)
    if not bm_items:
        return die(f"no BM_ITEM_ID found for BM-{bm_num} (topic={topic})")

    default_target_type = sanitize_tsv_field(args.default_target_type).upper()
    default_target_id = sanitize_tsv_field(args.default_target_id) if args.default_target_id else f"PRD-{prd_num}"
    default_mapping_quality = sanitize_tsv_field(args.mapping_quality).lower() or "coarse"
    notes_base = sanitize_tsv_field(args.notes)

    if default_target_type not in TRACE_ALLOWED_TARGET_TYPES:
        return die(f"default_target_type must be one of {sorted(TRACE_ALLOWED_TARGET_TYPES)}")
    if not default_target_id:
        return die("default_target_id is required")
    if default_mapping_quality not in TRACE_ALLOWED_MAPPING_QUALITY:
        return die(f"mapping_quality must be one of {sorted(TRACE_ALLOWED_MAPPING_QUALITY)}")

    try:
        overrides = load_trace_overrides(seed)
    except Exception as e:
        return die(f"trace overrides invalid: {e}")

    preferred_trace_path = TRACE_ROOT / f"TRACE-{trace_num}-{trace_slug}-bm-to-delivery.tsv"
    trace_candidates = sorted(
        [p for p in TRACE_ROOT.glob(f"TRACE-{trace_num}-*-bm-to-delivery.tsv") if p.is_file()]
    )
    trace_path = preferred_trace_path if preferred_trace_path in trace_candidates else (trace_candidates[0] if trace_candidates else preferred_trace_path)

    header = "BM_ITEM_ID\tBM_SECTION\tTARGET_TYPE\tTARGET_ID\tmapping_quality\tNOTES"
    rows: list[tuple[str, str, str, str, str, str]] = []

    for bm_item_id in sorted(bm_items):
        mm = RE_BM_ITEM_ID.search(bm_item_id)
        if not mm:
            return die(f"internal error: cannot parse BM_ITEM_ID: {bm_item_id}")
        bm_section = mm.group("doc")

        if bm_item_id in overrides:
            for m in overrides[bm_item_id]:
                rows.append((bm_item_id, bm_section, m.target_type, m.target_id, m.mapping_quality, m.notes))
            continue

        if not notes_base:
            notes = (
                f"mapping_quality: {default_mapping_quality}; generated: e2e-pack; "
                f"default {default_target_type}/{default_target_id}"
            )
        else:
            notes = notes_base

        rows.append((bm_item_id, bm_section, default_target_type, default_target_id, default_mapping_quality, notes))

    rows.sort(key=lambda r: (r[0], r[2], r[3]))
    trace_doc = header + "\n" + "\n".join("\t".join(r) for r in rows) + "\n"

    # Delivery pack (PB/PRD/SPEC/STORY/AC/TP)
    pb_id = f"PB-{pb_num}"
    prd_id = f"PRD-{prd_num}"
    spec_id = f"SPEC-{spec_num}"
    story_id = f"STORY-{story_num}"
    ac_id = f"AC-{story_num}"
    tp_id = f"TP-{story_num}"

    pb_path_p = find_existing_doc_by_id(root=PB_ROOT, doc_id=pb_id, preferred_slug=delivery_slug, ext="md") or (PB_ROOT / f"{pb_id}-{delivery_slug}.md")
    prd_path_p = find_existing_doc_by_id(root=PRD_ROOT, doc_id=prd_id, preferred_slug=delivery_slug, ext="md") or (PRD_ROOT / f"{prd_id}-{delivery_slug}.md")
    spec_path_p = find_existing_doc_by_id(root=SPEC_ROOT, doc_id=spec_id, preferred_slug=delivery_slug, ext="md") or (SPEC_ROOT / f"{spec_id}-{delivery_slug}.md")
    story_path_p = find_existing_doc_by_id(root=STORY_ROOT, doc_id=story_id, preferred_slug=delivery_slug, ext="md") or (STORY_ROOT / f"{story_id}-{delivery_slug}.md")
    ac_path_p = find_existing_doc_by_id(root=AC_ROOT, doc_id=ac_id, preferred_slug=delivery_slug, ext="md") or (AC_ROOT / f"{ac_id}-{delivery_slug}.md")
    tp_path_p = find_existing_doc_by_id(root=TP_ROOT, doc_id=tp_id, preferred_slug=delivery_slug, ext="md") or (TP_ROOT / f"{tp_id}-{delivery_slug}.md")

    pb_path = pb_path_p.as_posix()
    prd_path = prd_path_p.as_posix()
    spec_path = spec_path_p.as_posix()
    story_path = story_path_p.as_posix()
    ac_path = ac_path_p.as_posix()
    tp_path = tp_path_p.as_posix()

    # Auto-optional docs (signals: STORY Downstream + seed.optional.generate)
    downstream_extra: list[str] = []
    optional_writes: list[tuple[Path, str]] = []
    if args.include_auto_optional:
        story_signals_path = (
            find_existing_doc_by_id(root=STORY_ROOT, doc_id=story_id, preferred_slug=delivery_slug, ext="md")
            or Path(story_path)
        )
        spec_link_path = (
            find_existing_doc_by_id(root=SPEC_ROOT, doc_id=spec_id, preferred_slug=delivery_slug, ext="md")
            or Path(spec_path)
        )

        runbook_path_p = RUNBOOK_ROOT / f"RB-{delivery_slug}.md"
        include_runbook_link = args.include_runbook and (not args.only_auto_optional or runbook_path_p.exists())
        try:
            downstream_extra, optional_writes = plan_auto_optional_docs(
                seed=seed,
                story_signals_path=story_signals_path,
                delivery_slug=delivery_slug,
                title=title,
                owner=owner,
                spec_link_path=spec_link_path,
                trace_path=trace_path,
                include_runbook_link=include_runbook_link,
                runbook_path=runbook_path_p,
            )
        except Exception as e:
            return die(str(e))

    if args.only_auto_optional:
        if not args.include_auto_optional:
            print("[doc_production_generate] NOTE: only-auto-optional: auto-optional disabled; nothing to do")
        for p, doc in optional_writes:
            write_file(p, doc, dry_run=args.dry_run, overwrite=args.overwrite)
        print("[doc_production_generate] PASS")
        return 0

    bm_topic_dir = (BM_ROOT / topic).as_posix() + "/"
    bench_topic_dir = (BENCH_ROOT / topic).as_posix() + "/"

    pb_doc = render_pb_doc(
        pb_id=pb_id,
        title=title,
        owner=owner,
        prd_path=prd_path,
        trace_path=trace_path.as_posix(),
        bm_topic_dir=bm_topic_dir,
        bench_topic_dir=bench_topic_dir,
    )
    prd_doc = render_prd_doc(
        prd_id=prd_id,
        title=title,
        owner=owner,
        pb_id=pb_id,
        pb_path=pb_path,
        trace_path=trace_path.as_posix(),
        bm_topic_dir=bm_topic_dir,
        bench_topic_dir=bench_topic_dir,
        spec_path=spec_path,
    )
    spec_doc = render_spec_doc(
        spec_id=spec_id,
        title=title,
        owner=owner,
        pb_id=pb_id,
        prd_id=prd_id,
        bm_num=bm_num,
        bench_num=bench_num,
        trace_path=trace_path.as_posix(),
        pb_path=pb_path,
        prd_path=prd_path,
        bm_topic_dir=bm_topic_dir,
        bench_topic_dir=bench_topic_dir,
    )
    story_doc = render_story_doc(
        story_id=story_id,
        slug=delivery_slug,
        title=title,
        owner=owner,
        epic=epic,
        risk_level=risk_level,
        pb_id=pb_id,
        prd_id=prd_id,
        spec_id=spec_id,
        story_path=story_path,
        ac_path=ac_path,
        tp_path=tp_path,
        prd_path=prd_path,
        spec_path=spec_path,
        downstream_extra=downstream_extra,
    )
    ac_doc = render_acceptance_doc(
        ac_id=ac_id,
        title=title,
        owner=owner,
        story_id=f"{story_id}-{delivery_slug}",
        story_path=story_path,
        tp_path=tp_path,
    )
    tp_doc = render_test_plan_doc(
        tp_id=tp_id,
        title=title,
        owner=owner,
        story_id=f"{story_id}-{delivery_slug}",
        story_path=story_path,
        ac_path=ac_path,
    )

    # Runbook (default: enabled; name derived from delivery slug)
    if args.include_runbook:
        runbook_id = f"RB-{delivery_slug}"
        runbook_path = (RUNBOOK_ROOT / f"{runbook_id}.md").as_posix()
        runbook_doc = render_runbook_doc(
            runbook_id=runbook_id,
            title=title,
            service=delivery_slug,
            owner=owner,
            story_path=story_path,
            ac_path=ac_path,
            tp_path=tp_path,
            spec_path=spec_path,
            trace_path=trace_path.as_posix(),
        )
        write_file(Path(runbook_path), runbook_doc, dry_run=args.dry_run, overwrite=args.overwrite)

    # Write files
    write_file(bm_core_path, bm_core, dry_run=args.dry_run, overwrite=args.overwrite)
    write_file(bm_ctrl_path, bm_ctrl, dry_run=args.dry_run, overwrite=args.overwrite)
    write_file(bm_met_path, bm_met, dry_run=args.dry_run, overwrite=args.overwrite)

    write_file(bench_matrix_path, bench_matrix_doc, dry_run=args.dry_run, overwrite=args.overwrite)
    write_file(bench_gaps_path, bench_gaps_doc, dry_run=args.dry_run, overwrite=args.overwrite)

    write_file(trace_path, trace_doc, dry_run=args.dry_run, overwrite=args.overwrite)

    write_file(Path(pb_path), pb_doc, dry_run=args.dry_run, overwrite=args.overwrite)
    write_file(Path(prd_path), prd_doc, dry_run=args.dry_run, overwrite=args.overwrite)
    write_file(Path(spec_path), spec_doc, dry_run=args.dry_run, overwrite=args.overwrite)
    write_file(Path(story_path), story_doc, dry_run=args.dry_run, overwrite=args.overwrite)
    write_file(Path(ac_path), ac_doc, dry_run=args.dry_run, overwrite=args.overwrite)
    write_file(Path(tp_path), tp_doc, dry_run=args.dry_run, overwrite=args.overwrite)

    for p, doc in optional_writes:
        write_file(p, doc, dry_run=args.dry_run, overwrite=args.overwrite)

    print("[doc_production_generate] PASS")
    return 0


def render_pb_doc(
    *,
    pb_id: str,
    title: str,
    owner: str,
    prd_path: str | None,
    trace_path: str | None,
    bm_topic_dir: str | None,
    bench_topic_dir: str | None,
) -> str:
    lines: list[str] = []
    lines.append(f"# {pb_id} – {title}")
    lines.append("")
    lines.append(f"ID: {pb_id}  ")
    lines.append("Status: Draft  ")
    lines.append(f"Owner: {owner}")
    lines.append("")

    lines.append(SEP)
    lines.append("1. AMAÇ")
    lines.append(SEP)
    lines.append("")
    lines.append("- Kısa problem tanımı ve iş etkisi.")
    lines.append("")

    lines.append(SEP)
    lines.append("2. KAPSAM")
    lines.append(SEP)
    lines.append("")
    lines.append("- Hangi ürün/süreç/ekran veya servis etkilenecek?")
    lines.append("")

    lines.append(SEP)
    lines.append("3. SORUN TANIMI")
    lines.append(SEP)
    lines.append("")
    lines.append("- Mevcut durum")
    lines.append("- Problemin belirtileri")
    lines.append("- Kimler etkileniyor?")
    lines.append("")

    lines.append(SEP)
    lines.append("4. HEDEF VE BAŞARI KRİTERLERİ")
    lines.append(SEP)
    lines.append("")
    lines.append("- Ölçülebilir hedefler (metrikler).")
    lines.append("")

    lines.append(SEP)
    lines.append("5. VARSAYIMLAR / RİSKLER")
    lines.append(SEP)
    lines.append("")
    lines.append("- Bilinen varsayımlar")
    lines.append("- Öne çıkan riskler")
    lines.append("")

    lines.append(SEP)
    lines.append("6. ÖZET")
    lines.append(SEP)
    lines.append("")
    lines.append("- 2–3 madde ile problemin özeti.")
    lines.append("")

    lines.append(SEP)
    lines.append("7. LİNKLER / SONRAKİ ADIMLAR")
    lines.append(SEP)
    lines.append("")
    if prd_path:
        lines.append(f"- PRD: `{prd_path}`")
    if bm_topic_dir:
        lines.append(f"- BM Pack: `{bm_topic_dir}`")
    if bench_topic_dir:
        lines.append(f"- BENCH Pack: `{bench_topic_dir}`")
    if trace_path:
        lines.append(f"- TRACE: `{trace_path}`")
    lines.append("")
    return "\n".join(lines) + "\n"


def render_prd_doc(
    *,
    prd_id: str,
    title: str,
    owner: str,
    pb_id: str | None,
    pb_path: str | None,
    trace_path: str | None,
    bm_topic_dir: str | None,
    bench_topic_dir: str | None,
    spec_path: str | None,
) -> str:
    lines: list[str] = []
    lines.append(f"# {prd_id} – {title}")
    lines.append("")
    lines.append(f"ID: {prd_id}  ")
    lines.append("Status: Draft  ")
    lines.append(f"Owner: {owner}  ")
    if pb_id:
        lines.append(f"Problem Brief: {pb_id}")
    lines.append("")

    lines.append(SEP)
    lines.append("## 1. AMAÇ")
    lines.append(SEP)
    lines.append("")
    lines.append("- Feature/ürünün amacı ve iş hedefi.")
    lines.append("")

    lines.append(SEP)
    lines.append("## 2. KAPSAM")
    lines.append(SEP)
    lines.append("")
    lines.append("- Dahil olan akışlar, kullanıcı tipleri, servisler.")
    lines.append("")

    lines.append(SEP)
    lines.append("## 3. KULLANICI SENARYOLARI")
    lines.append(SEP)
    lines.append("")
    lines.append("- Senaryo 1")
    lines.append("- Senaryo 2")
    lines.append("")

    lines.append(SEP)
    lines.append("## 4. DAVRANIŞ / GEREKSİNİMLER")
    lines.append(SEP)
    lines.append("")
    lines.append("- Fonksiyonel gereksinimler")
    lines.append("- Non-functional gereksinimler")
    lines.append("")

    lines.append(SEP)
    lines.append("## 5. NON-GOALS (KAPSAM DIŞI)")
    lines.append(SEP)
    lines.append("")
    lines.append("- Bu release’te özellikle yapılmayacaklar.")
    lines.append("")

    lines.append(SEP)
    lines.append("## 6. ACCEPTANCE KRİTERLERİ ÖZETİ")
    lines.append(SEP)
    lines.append("")
    lines.append("- PRD ile uyumlu yüksek seviye kriterler.")
    lines.append("")

    lines.append(SEP)
    lines.append("## 7. RİSKLER / BAĞIMLILIKLAR")
    lines.append(SEP)
    lines.append("")
    lines.append("- Diğer sistemlere/ekiplere bağımlılıklar, riskler.")
    lines.append("")

    lines.append(SEP)
    lines.append("## 8. ÖZET")
    lines.append(SEP)
    lines.append("")
    lines.append("- Feature’ın 2–3 maddelik özeti.")
    lines.append("")

    lines.append(SEP)
    lines.append("## 9. LİNKLER / SONRAKİ ADIMLAR")
    lines.append(SEP)
    lines.append("")
    if pb_path:
        lines.append(f"- PB: `{pb_path}`")
    if bm_topic_dir:
        lines.append(f"- BM Pack: `{bm_topic_dir}`")
    if bench_topic_dir:
        lines.append(f"- BENCH Pack: `{bench_topic_dir}`")
    if trace_path:
        lines.append(f"- TRACE: `{trace_path}`")
    if spec_path:
        lines.append(f"- Delivery SPEC: `{spec_path}`")
    lines.append("")

    lines.append(SEP)
    lines.append("## 10. DELIVERY ITEMS (SSOT)")
    lines.append(SEP)
    lines.append("")
    lines.append("- Ürün odaklı delivery breakdown için deterministik SSOT JSON’u.")
    lines.append("- Default: 1 delivery_item → 1 STORY (vertical). split_by=stream verilirse streams başına STORY üretilir.")
    lines.append("")
    lines.append("```json")
    lines.append(json.dumps({"ssot": "PRD_DELIVERY_ITEMS_V1", "delivery_items": []}, ensure_ascii=False, indent=2))
    lines.append("```")
    lines.append("")
    return "\n".join(lines) + "\n"


def render_spec_doc(
    *,
    spec_id: str,
    title: str,
    owner: str,
    pb_id: str | None,
    prd_id: str | None,
    bm_num: str | None,
    bench_num: str | None,
    trace_path: str | None,
    pb_path: str | None,
    prd_path: str | None,
    bm_topic_dir: str | None,
    bench_topic_dir: str | None,
) -> str:
    lines: list[str] = []
    lines.append(f"# {spec_id}: {title}")
    lines.append("")
    lines.append(f"ID: {spec_id}  ")
    lines.append("Status: Draft  ")
    lines.append(f"Owner: {owner}")
    lines.append("")

    lines.append(SEP)
    lines.append("## 1. AMAÇ")
    lines.append(SEP)
    lines.append("")
    lines.append("- Bu SPEC’in SSOT olarak tanımladığı konu (1–3 madde).")
    lines.append("")

    lines.append(SEP)
    lines.append("## 2. KAPSAM")
    lines.append(SEP)
    lines.append("")
    lines.append("- In-scope: hangi alt akışlar/entitiler/kontrat yüzeyi.")
    lines.append("- Out-of-scope: (varsa) özellikle yapılmayacaklar / dışarıda bırakılanlar.")
    lines.append("")

    lines.append(SEP)
    lines.append("## 3. KONTRAT (SSOT)")
    lines.append(SEP)
    lines.append("")
    lines.append("### Kaynaklar / Trace (varsa)")
    lines.append("")
    if pb_id:
        lines.append(f"- PB: `{pb_id}`")
    if prd_id:
        lines.append(f"- PRD: `{prd_id}`")
    if bm_num:
        lines.append(f"- BM: `BM-{bm_num}`")
    if bench_num:
        lines.append(f"- BENCH: `BENCH-{bench_num}`")
    if trace_path:
        lines.append(f"- TRACE: `{trace_path}`")
    lines.append("")
    lines.append("### Platform Dependencies (None dahil)")
    lines.append("")
    lines.append("- Platform capability kataloğu (SSOT): `docs/03-delivery/SPECS/SPEC-0014-platform-capabilities-catalog-v1.md`")
    lines.append("- Bu kontratın kullandığı capability listesi burada tutulur (None dahil).")
    lines.append("")
    lines.append("### Domain / Policy Kontratı (MVP)")
    lines.append("")
    lines.append("- Domain sınırları, minimum entity alanları, state/flow, policy knobs.")
    lines.append("")

    lines.append(SEP)
    lines.append("## 4. GOVERNANCE (DEĞİŞİKLİK POLİTİKASI)")
    lines.append(SEP)
    lines.append("")
    lines.append("- Breaking kontrat değişiklikleri yeni SPEC versiyonu ile yapılır.")
    lines.append("")

    lines.append(SEP)
    lines.append("## 5. LİNKLER")
    lines.append(SEP)
    lines.append("")
    if pb_path:
        lines.append(f"- PB: `{pb_path}`")
    if prd_path:
        lines.append(f"- PRD: `{prd_path}`")
    if bm_topic_dir:
        lines.append(f"- BM Pack: `{bm_topic_dir}`")
    if bench_topic_dir:
        lines.append(f"- BENCH Pack: `{bench_topic_dir}`")
    if trace_path:
        lines.append(f"- TRACE: `{trace_path}`")
    lines.append("")
    return "\n".join(lines) + "\n"


def render_story_doc(
    *,
    story_id: str,
    slug: str,
    title: str,
    owner: str,
    epic: str,
    risk_level: str,
    pb_id: str | None,
    prd_id: str | None,
    spec_id: str | None,
    story_path: str,
    ac_path: str,
    tp_path: str,
    prd_path: str | None,
    spec_path: str | None,
    downstream_extra: list[str] | None = None,
) -> str:
    lines: list[str] = []
    lines.append(f"# {story_id} – {title}")
    lines.append("")
    lines.append(f"ID: {story_id}-{slug}  ")
    lines.append(f"Epic: {epic}  ")
    lines.append("Status: Planned  ")
    lines.append(f"Owner: {owner}  ")
    lines.append(f"Risk_Level: {risk_level}  ")
    ups: list[str] = []
    if pb_id:
        ups.append(pb_id)
    if prd_id:
        ups.append(prd_id)
    if spec_id:
        ups.append(spec_id)
    if ups:
        lines.append(f"Upstream: {', '.join(ups)}  ")
    story_num = story_id.split("-", 1)[1]
    downstream = [f"AC-{story_num}", f"TP-{story_num}"]
    seen = {x.casefold() for x in downstream}
    for x in downstream_extra or []:
        tok = str(x).strip()
        if not tok:
            continue
        if tok.casefold() in seen:
            continue
        downstream.append(tok)
        seen.add(tok.casefold())
    lines.append(f"Downstream: {', '.join(downstream)}")
    lines.append("")

    lines.append(SEP)
    lines.append("## 1. AMAÇ")
    lines.append(SEP)
    lines.append("")
    lines.append("- İş hedefi ve beklenen çıktılar.")
    lines.append("")

    lines.append(SEP)
    lines.append("## 2. TANIM")
    lines.append(SEP)
    lines.append("")
    lines.append("- Kısa story tanımı (rol/istek/fayda):")
    lines.append("  - Bir <rol> olarak, <istek> istiyorum; böylece <fayda>.")
    lines.append("")

    lines.append(SEP)
    lines.append("## 3. KAPSAM VE SINIRLAR")
    lines.append(SEP)
    lines.append("")
    lines.append("- Neler dahil, neler kapsam dışı?")
    lines.append("")

    lines.append(SEP)
    lines.append("## 4. ACCEPTANCE KRİTERLERİ")
    lines.append(SEP)
    lines.append("")
    lines.append("- [ ] Given ..., When ..., Then ...")
    lines.append("- [ ] Given ..., When ..., Then ...")
    lines.append("")

    lines.append(SEP)
    lines.append("## 5. BAĞIMLILIKLAR")
    lines.append(SEP)
    lines.append("")
    lines.append("- Related PRD, SPEC, Tech-Design ve diğer story’ler (varsa).")
    lines.append("")

    lines.append(SEP)
    lines.append("## 6. ÖZET")
    lines.append(SEP)
    lines.append("")
    lines.append("- Story’nin 2–3 maddelik özeti.")
    lines.append("")

    lines.append(SEP)
    lines.append("## 7. LİNKLER (İSTEĞE BAĞLI)")
    lines.append(SEP)
    lines.append("")
    lines.append(f"- Story: `{story_path}`")
    lines.append(f"- Acceptance: `{ac_path}`")
    lines.append(f"- Test Plan: `{tp_path}`")
    if prd_path:
        lines.append(f"- PRD: `{prd_path}`")
    if spec_path:
        lines.append(f"- SPEC: `{spec_path}`")
    lines.append("")
    return "\n".join(lines) + "\n"


def render_acceptance_doc(
    *,
    ac_id: str,
    title: str,
    owner: str,
    story_id: str,
    story_path: str,
    tp_path: str,
) -> str:
    lines: list[str] = []
    lines.append(f"# {ac_id} – {title}")
    lines.append("")
    lines.append(f"ID: {ac_id}  ")
    lines.append(f"Story: {story_id}  ")
    lines.append("Status: Planned  ")
    lines.append(f"Owner: {owner}")
    lines.append("")

    lines.append(SEP)
    lines.append("## 1. AMAÇ")
    lines.append(SEP)
    lines.append("")
    lines.append("- Test edilebilir kabul kriterlerini tanımlamak.")
    lines.append("")

    lines.append(SEP)
    lines.append("## 2. KAPSAM")
    lines.append(SEP)
    lines.append("")
    lines.append("- Hangi story/PRD maddeleri için geçerli?")
    lines.append("")

    lines.append(SEP)
    lines.append("## 3. GIVEN / WHEN / THEN SENARYOLARI")
    lines.append(SEP)
    lines.append("")
    lines.append("### Ortak")
    lines.append("")
    lines.append("- [ ] Senaryo 1 – Given ..., When ..., Then ...")
    lines.append("")

    lines.append(SEP)
    lines.append("## 4. NOTLAR / KISITLAR")
    lines.append(SEP)
    lines.append("")
    lines.append("- Özellikle belirtilmesi gereken durumlar.")
    lines.append("")

    lines.append(SEP)
    lines.append("## 5. ÖZET")
    lines.append(SEP)
    lines.append("")
    lines.append("- En kritik kabul kriterlerinin özeti.")
    lines.append("")

    lines.append(SEP)
    lines.append("## 6. LİNKLER (İSTEĞE BAĞLI)")
    lines.append(SEP)
    lines.append("")
    lines.append(f"- Story: `{story_path}`")
    lines.append(f"- Test Plan: `{tp_path}`")
    lines.append("")
    return "\n".join(lines) + "\n"


def render_test_plan_doc(
    *,
    tp_id: str,
    title: str,
    owner: str,
    story_id: str,
    story_path: str,
    ac_path: str,
) -> str:
    lines: list[str] = []
    lines.append(f"# {tp_id} – {title}")
    lines.append("")
    lines.append(f"ID: {tp_id}  ")
    lines.append(f"Story: {story_id}  ")
    lines.append("Status: Planned  ")
    lines.append(f"Owner: {owner}")
    lines.append("")

    lines.append(SEP)
    lines.append("## 1. AMAÇ")
    lines.append(SEP)
    lines.append("")
    lines.append("- Test stratejisi ve kapsamı.")
    lines.append("")

    lines.append(SEP)
    lines.append("## 2. KAPSAM")
    lines.append(SEP)
    lines.append("")
    lines.append("- Dahil test tipleri (unit, integration, e2e, perf).")
    lines.append("")

    lines.append(SEP)
    lines.append("## 3. STRATEJİ")
    lines.append(SEP)
    lines.append("")
    lines.append("- Neyi nasıl test ediyoruz?")
    lines.append("")

    lines.append(SEP)
    lines.append("## 4. TEST SENARYOLARI ÖZETİ")
    lines.append(SEP)
    lines.append("")
    lines.append("- [ ] Senaryo grubu 1 – ...")
    lines.append("- [ ] Senaryo grubu 2 – ...")
    lines.append("")

    # Additional sections (optional for subset contract)
    lines.append(SEP)
    lines.append("## 5. ÇEVRE VE ARAÇLAR")
    lines.append(SEP)
    lines.append("")
    lines.append("- Ortamlar, tool’lar, veri setleri.")
    lines.append("")

    lines.append(SEP)
    lines.append("## 6. RİSKLER / ÖNCELİKLER")
    lines.append(SEP)
    lines.append("")
    lines.append("- En kritik risk ve öncelikler.")
    lines.append("")

    lines.append(SEP)
    lines.append("## 7. ÖZET")
    lines.append(SEP)
    lines.append("")
    lines.append("- Test planının kısa özeti.")
    lines.append("")

    lines.append(SEP)
    lines.append("## 8. LİNKLER (İSTEĞE BAĞLI)")
    lines.append(SEP)
    lines.append("")
    lines.append(f"- Story: `{story_path}`")
    lines.append(f"- Acceptance: `{ac_path}`")
    lines.append("")

    lines.append("## Doğrulama (Doc-QA)")
    lines.append("- `python3 scripts/run_doc_qa_execution_log_local.py --out-dir .autopilot-tmp/execution-log`")
    lines.append("- Beklenen: PASS (`.autopilot-tmp/execution-log/execution-log.md`)")
    lines.append("")

    return "\n".join(lines) + "\n"


def cmd_delivery_pack(args: argparse.Namespace) -> int:
    try:
        topic = norm_topic_folder(args.topic)
        slug = norm_slug(args.slug)
        pb_num = norm_num4(args.pb)
        prd_num = norm_num4(args.prd)
        spec_num = norm_num4(args.spec)
        story_num = norm_num4(args.story)
        risk_level = norm_risk_level(args.risk_level)
        owner = ensure_owner(args.owner)
    except Exception as e:
        return die(str(e))

    title = (args.title or slug.replace("-", " ").title()).strip()
    epic = (args.epic or "DOCS-PRODUCTION").strip() or "DOCS-PRODUCTION"

    bm_num = norm_num4(args.bm) if args.bm else None
    bench_num = norm_num4(args.bench) if args.bench else None
    trace_num = norm_num4(args.trace) if args.trace else None
    trace_slug = norm_slug(args.trace_slug) if args.trace_slug else topic_slug_from_folder(topic)

    pb_id = f"PB-{pb_num}"
    prd_id = f"PRD-{prd_num}"
    spec_id = f"SPEC-{spec_num}"
    story_id = f"STORY-{story_num}"
    ac_id = f"AC-{story_num}"
    tp_id = f"TP-{story_num}"

    pb_path = (PB_ROOT / f"{pb_id}-{slug}.md").as_posix()
    prd_path = (PRD_ROOT / f"{prd_id}-{slug}.md").as_posix()
    spec_path = (SPEC_ROOT / f"{spec_id}-{slug}.md").as_posix()
    story_path = (STORY_ROOT / f"{story_id}-{slug}.md").as_posix()
    ac_path = (AC_ROOT / f"{ac_id}-{slug}.md").as_posix()
    tp_path = (TP_ROOT / f"{tp_id}-{slug}.md").as_posix()

    trace_path = (
        (TRACE_ROOT / f"TRACE-{trace_num}-{trace_slug}-bm-to-delivery.tsv").as_posix() if trace_num else None
    )
    bm_topic_dir = (BM_ROOT / topic).as_posix() + "/" if (BM_ROOT / topic).exists() else f"docs/01-product/BUSINESS-MASTERS/{topic}/"
    bench_topic_dir = (BENCH_ROOT / topic).as_posix() + "/" if (BENCH_ROOT / topic).exists() else f"docs/01-product/BENCHMARKS/{topic}/"

    pb_doc = render_pb_doc(
        pb_id=pb_id,
        title=title,
        owner=owner,
        prd_path=prd_path,
        trace_path=trace_path,
        bm_topic_dir=bm_topic_dir,
        bench_topic_dir=bench_topic_dir,
    )
    prd_doc = render_prd_doc(
        prd_id=prd_id,
        title=title,
        owner=owner,
        pb_id=pb_id,
        pb_path=pb_path,
        trace_path=trace_path,
        bm_topic_dir=bm_topic_dir,
        bench_topic_dir=bench_topic_dir,
        spec_path=spec_path,
    )
    spec_doc = render_spec_doc(
        spec_id=spec_id,
        title=title,
        owner=owner,
        pb_id=pb_id,
        prd_id=prd_id,
        bm_num=bm_num,
        bench_num=bench_num,
        trace_path=trace_path,
        pb_path=pb_path,
        prd_path=prd_path,
        bm_topic_dir=bm_topic_dir,
        bench_topic_dir=bench_topic_dir,
    )
    story_doc = render_story_doc(
        story_id=story_id,
        slug=slug,
        title=title,
        owner=owner,
        epic=epic,
        risk_level=risk_level,
        pb_id=pb_id,
        prd_id=prd_id,
        spec_id=spec_id,
        story_path=story_path,
        ac_path=ac_path,
        tp_path=tp_path,
        prd_path=prd_path,
        spec_path=spec_path,
    )
    ac_doc = render_acceptance_doc(
        ac_id=ac_id,
        title=title,
        owner=owner,
        story_id=f"{story_id}-{slug}",
        story_path=story_path,
        tp_path=tp_path,
    )
    tp_doc = render_test_plan_doc(
        tp_id=tp_id,
        title=title,
        owner=owner,
        story_id=f"{story_id}-{slug}",
        story_path=story_path,
        ac_path=ac_path,
    )

    write_file(Path(pb_path), pb_doc, dry_run=args.dry_run, overwrite=args.overwrite)
    write_file(Path(prd_path), prd_doc, dry_run=args.dry_run, overwrite=args.overwrite)
    write_file(Path(spec_path), spec_doc, dry_run=args.dry_run, overwrite=args.overwrite)
    write_file(Path(story_path), story_doc, dry_run=args.dry_run, overwrite=args.overwrite)
    write_file(Path(ac_path), ac_doc, dry_run=args.dry_run, overwrite=args.overwrite)
    write_file(Path(tp_path), tp_doc, dry_run=args.dry_run, overwrite=args.overwrite)

    print("[doc_production_generate] PASS")
    return 0


def cmd_delivery_items_pack(args: argparse.Namespace) -> int:
    """
    Product-oriented STORY production from PRD SSOT (section 10 JSON).

    Rules:
    - Default: 1 delivery_item -> 1 STORY (vertical)
    - split_by=stream => streams başına STORY
    """
    try:
        prd_num = norm_num4(args.prd)
        default_spec_num = norm_num4(args.spec)
        risk_level_default = norm_risk_level(args.risk_level)
        owner = ensure_owner(args.owner)
    except Exception as e:
        return die(str(e))

    if args.overwrite:
        print(
            "[doc_production_generate] WARN: delivery-items-pack is non-destructive; "
            "--overwrite is ignored (existing docs are never overwritten)."
        )

    prd_id = f"PRD-{prd_num}"
    prd_path_p = find_existing_doc_by_id(root=PRD_ROOT, doc_id=prd_id, preferred_slug="", ext="md")
    if not prd_path_p:
        return die(f"PRD doc not found for {prd_id} under {PRD_ROOT}")

    prd_text = prd_path_p.read_text(encoding="utf-8", errors="ignore")
    prd_slug = slug_from_prd_filename(prd_path_p)
    if not prd_slug:
        return die(f"cannot derive PRD slug from filename: {prd_path_p}")

    title_base = (args.title or parse_prd_title(prd_text) or prd_slug.replace("-", " ").title()).strip()
    epic = (args.epic or "DOCS-PRODUCTION").strip() or "DOCS-PRODUCTION"

    pb_id = f"PB-{norm_num4(args.pb)}" if args.pb else (parse_prd_pb_id(prd_text) or "")
    if not pb_id:
        return die(f"PB id not provided and not found in PRD meta (Problem Brief:) for {prd_path_p}")
    pb_num = pb_id.split("-", 1)[1]

    pb_path_p = find_existing_doc_by_id(root=PB_ROOT, doc_id=pb_id, preferred_slug=prd_slug, ext="md") or (
        PB_ROOT / f"{pb_id}-{prd_slug}.md"
    )

    def spec_id(num4: str) -> str:
        return f"SPEC-{num4}"

    default_spec_id = spec_id(default_spec_num)
    default_spec_path_p = find_existing_doc_by_id(
        root=SPEC_ROOT, doc_id=default_spec_id, preferred_slug=prd_slug, ext="md"
    ) or (SPEC_ROOT / f"{default_spec_id}-{prd_slug}.md")

    # Ensure PB/SPEC exist (to keep chain consistent for new stories).
    pb_doc = render_pb_doc(
        pb_id=pb_id,
        title=title_base,
        owner=owner,
        prd_path=prd_path_p.as_posix(),
        trace_path=None,
        bm_topic_dir=None,
        bench_topic_dir=None,
    )
    write_file(pb_path_p, pb_doc, dry_run=args.dry_run, overwrite=False)

    default_spec_doc = render_spec_doc(
        spec_id=default_spec_id,
        title=title_base,
        owner=owner,
        pb_id=pb_id,
        prd_id=prd_id,
        bm_num=None,
        bench_num=None,
        trace_path=None,
        pb_path=pb_path_p.as_posix(),
        prd_path=prd_path_p.as_posix(),
        bm_topic_dir=None,
        bench_topic_dir=None,
    )
    write_file(default_spec_path_p, default_spec_doc, dry_run=args.dry_run, overwrite=False)

    # Load delivery items SSOT from PRD.
    try:
        items = load_prd_delivery_items_or_die(prd_path_p)
    except Exception as e:
        return die(str(e))

    if not items:
        print("[doc_production_generate] WARN: PRD delivery_items empty; nothing to generate")
        print("[doc_production_generate] PASS")
        return 0

    # Next IDs (deterministic for one run; avoids duplicates even in dry-run).
    existing_nums: set[int] = set()
    reserved_nums: set[int] = set()
    rx = re.compile(r"^(?:STORY|AC|TP)-(?P<num>\d{4})\b", re.IGNORECASE)
    for base, prefix in [(STORY_ROOT, "STORY"), (AC_ROOT, "AC"), (TP_ROOT, "TP")]:
        if not base.exists():
            continue
        for p in base.glob(f"{prefix}-*.md"):
            m = rx.match(p.name)
            if m:
                existing_nums.add(int(m.group("num")))

    story_cursor = int(args.story_start) if args.story_start else (max(existing_nums) + 1 if existing_nums else 1)
    if story_cursor < 1 or story_cursor > 9999:
        return die("story_start out of range (1..9999)")

    guide_cursor = int(next_guide_num())
    adr_cursor = int(next_adr_num())

    def alloc_story_num(preferred: str | None = None) -> str:
        nonlocal story_cursor
        if preferred:
            n = int(preferred)
            if n in reserved_nums:
                raise ValueError(f"duplicate STORY id in delivery_items: {n:04d}")
            reserved_nums.add(n)
            return f"{n:04d}"
        while story_cursor in existing_nums or story_cursor in reserved_nums:
            story_cursor += 1
        if story_cursor > 9999:
            raise ValueError("STORY id overflow (max=9999)")
        n = story_cursor
        reserved_nums.add(n)
        story_cursor += 1
        return f"{n:04d}"

    def alloc_guide_id() -> str:
        nonlocal guide_cursor
        if guide_cursor < 1 or guide_cursor > 9999:
            raise ValueError("GUIDE id overflow (max=9999)")
        out = f"GUIDE-{guide_cursor:04d}"
        guide_cursor += 1
        return out

    def alloc_adr_id() -> str:
        nonlocal adr_cursor
        if adr_cursor < 1 or adr_cursor > 9999:
            raise ValueError("ADR id overflow (max=9999)")
        out = f"ADR-{adr_cursor:04d}"
        adr_cursor += 1
        return out

    for it in items:
        item_id = it["id"]
        item_title = it["title"]
        item_slug = it["slug"]
        split_by = it["split_by"]
        streams: list[str] = it["streams"]
        services: list[str] = it["services"]
        item_spec_num = it["spec"] or default_spec_num
        item_risk = it["risk_level"] or risk_level_default

        item_spec_id = spec_id(item_spec_num)
        item_spec_path_p = find_existing_doc_by_id(
            root=SPEC_ROOT, doc_id=item_spec_id, preferred_slug=prd_slug, ext="md"
        ) or (SPEC_ROOT / f"{item_spec_id}-{prd_slug}.md")

        if item_spec_id != default_spec_id and not item_spec_path_p.exists():
            item_spec_doc = render_spec_doc(
                spec_id=item_spec_id,
                title=title_base,
                owner=owner,
                pb_id=pb_id,
                prd_id=prd_id,
                bm_num=None,
                bench_num=None,
                trace_path=None,
                pb_path=pb_path_p.as_posix(),
                prd_path=prd_path_p.as_posix(),
                bm_topic_dir=None,
                bench_topic_dir=None,
            )
            write_file(item_spec_path_p, item_spec_doc, dry_run=args.dry_run, overwrite=args.overwrite)

        # Determine stories for this item.
        plans: list[tuple[str | None, str]] = []
        if split_by == "stream":
            for s in streams:
                plans.append((s, f"{item_slug}-{s}"))
        else:
            plans.append((None, item_slug))

        for stream, story_slug in plans:
            story_num = None
            if split_by == "stream" and it.get("story_ids"):
                story_num = it["story_ids"].get(stream or "")
            if split_by != "stream" and it.get("story_id"):
                story_num = it["story_id"]
            try:
                story_num = alloc_story_num(story_num)
            except Exception as e:
                return die(f"{item_id}: story id allocation failed: {e}")

            story_id = f"STORY-{story_num}"
            ac_id = f"AC-{story_num}"
            tp_id = f"TP-{story_num}"

            story_path_p = find_existing_doc_by_id(
                root=STORY_ROOT, doc_id=story_id, preferred_slug=story_slug, ext="md"
            ) or (STORY_ROOT / f"{story_id}-{story_slug}.md")
            m = re.match(
                r"^STORY-(?:\d{4})-(?P<slug>[a-z0-9]+(?:-[a-z0-9]+)*)\.md$",
                story_path_p.name,
                re.IGNORECASE,
            )
            if m:
                try:
                    story_slug = norm_slug(m.group("slug"))
                except Exception:
                    pass

            ac_path_p = find_existing_doc_by_id(
                root=AC_ROOT, doc_id=ac_id, preferred_slug=story_slug, ext="md"
            ) or (AC_ROOT / f"{ac_id}-{story_slug}.md")
            tp_path_p = find_existing_doc_by_id(
                root=TP_ROOT, doc_id=tp_id, preferred_slug=story_slug, ext="md"
            ) or (TP_ROOT / f"{tp_id}-{story_slug}.md")

            # Build optional signals (deterministic; allocate IDs if needed).
            tokens: list[str] = []
            for raw in it["optional_docs"]:
                tok = normalize_optional_doc_token(raw)
                if tok == "ADR":
                    tokens.append(alloc_adr_id())
                    continue
                if tok == "GUIDE":
                    tokens.append(alloc_guide_id())
                    continue
                tokens.append(tok)

            # Auto-optional plan (signals: PRD optional_docs + existing STORY Downstream).
            seed_local: dict[str, Any] = {}
            if services:
                seed_local["optional.service"] = services[0]
            if tokens:
                seed_local["optional.generate"] = tokens

            include_runbook_link = False
            try:
                downstream_extra, optional_writes = plan_auto_optional_docs(
                    seed=seed_local,
                    story_signals_path=story_path_p,
                    delivery_slug=story_slug,
                    title=title_base,
                    owner=owner,
                    spec_link_path=item_spec_path_p,
                    trace_path=None,
                    include_runbook_link=include_runbook_link,
                    runbook_path=None,
                )
            except Exception as e:
                return die(f"{item_id}: auto-optional plan failed: {e}")

            story_title = item_title if not stream else f"{item_title} ({stream})"
            story_doc = render_story_doc(
                story_id=story_id,
                slug=story_slug,
                title=story_title,
                owner=owner,
                epic=epic,
                risk_level=item_risk,
                pb_id=pb_id,
                prd_id=prd_id,
                spec_id=item_spec_id,
                story_path=story_path_p.as_posix(),
                ac_path=ac_path_p.as_posix(),
                tp_path=tp_path_p.as_posix(),
                prd_path=prd_path_p.as_posix(),
                spec_path=item_spec_path_p.as_posix(),
                downstream_extra=downstream_extra,
            )
            ac_doc = render_acceptance_doc(
                ac_id=ac_id,
                title=story_title,
                owner=owner,
                story_id=f"{story_id}-{story_slug}",
                story_path=story_path_p.as_posix(),
                tp_path=tp_path_p.as_posix(),
            )
            tp_doc = render_test_plan_doc(
                tp_id=tp_id,
                title=story_title,
                owner=owner,
                story_id=f"{story_id}-{story_slug}",
                story_path=story_path_p.as_posix(),
                ac_path=ac_path_p.as_posix(),
            )

            write_file(story_path_p, story_doc, dry_run=args.dry_run, overwrite=False)
            write_file(ac_path_p, ac_doc, dry_run=args.dry_run, overwrite=False)
            write_file(tp_path_p, tp_doc, dry_run=args.dry_run, overwrite=False)
            for p, doc in optional_writes:
                write_file(p, doc, dry_run=args.dry_run, overwrite=False)

    print("[doc_production_generate] PASS")
    return 0


def build_parser() -> argparse.ArgumentParser:
    ap = argparse.ArgumentParser(prog="doc_production_generate")
    sub = ap.add_subparsers(dest="cmd", required=True)

    p_e2e = sub.add_parser("e2e-pack", help="Generate full chain (BM+BENCH+TRACE+Delivery, optional Runbook)")
    p_e2e.add_argument("--topic", required=True, help="Topic folder (UPPERCASE), e.g. ETHICS")
    p_e2e.add_argument(
        "--topic-slug",
        default="",
        help="Topic slug (kebab-case, optional). Default: topic lowercased (ETHICS -> ethics).",
    )
    p_e2e.add_argument(
        "--delivery-slug",
        "--slug",
        dest="delivery_slug",
        required=True,
        help="Delivery slug (kebab-case), e.g. ethics-case-mailbox-mvp",
    )
    p_e2e.add_argument("--title", default="", help="Human title (optional)")
    p_e2e.add_argument("--version", default=DEFAULT_VERSION, help=f"Version label (default: {DEFAULT_VERSION})")
    p_e2e.add_argument("--seed", default="", help="Optional seed json file (advanced)")
    p_e2e.add_argument("--bm", required=True, help="BM number (4 digits), e.g. 0001")
    p_e2e.add_argument("--bench", required=True, help="BENCH number (4 digits), e.g. 0001")
    p_e2e.add_argument("--trace", required=True, help="TRACE number (4 digits), e.g. 0001")
    p_e2e.add_argument("--pb", required=True, help="PB number (4 digits), e.g. 0004")
    p_e2e.add_argument("--prd", required=True, help="PRD number (4 digits), e.g. 0004")
    p_e2e.add_argument("--spec", required=True, help="SPEC number (4 digits), e.g. 0013")
    p_e2e.add_argument("--story", required=True, help="STORY/AC/TP number (4 digits), e.g. 0306")
    p_e2e.add_argument(
        "--trace-slug",
        default="",
        help="TRACE slug (kebab-case, optional). Default: topic slug.",
    )
    p_e2e.add_argument("--default-target-type", default="PRD", help="Default TARGET_TYPE for TRACE rows (default: PRD)")
    p_e2e.add_argument(
        "--default-target-id",
        default="",
        help="Default TARGET_ID for TRACE rows (default: PRD-<prd>).",
    )
    p_e2e.add_argument("--mapping-quality", default="coarse", help="mapping_quality (coarse|refined, default: coarse)")
    p_e2e.add_argument("--notes", default="", help="Optional NOTES for TRACE rows (if empty, a default note is generated)")
    p_e2e.add_argument("--owner", default="@team/platform", help="Owner value (default: @team/platform)")
    p_e2e.add_argument("--epic", default="DOCS-PRODUCTION", help="Epic label (default: DOCS-PRODUCTION)")
    p_e2e.add_argument("--risk-level", default="medium", help="Risk_Level (low|medium|high, default: medium)")
    p_e2e.add_argument(
        "--no-runbook",
        dest="include_runbook",
        action="store_false",
        default=True,
        help="Do not generate RB-<delivery-slug>.md (default: generate)",
    )
    p_e2e.add_argument(
        "--no-auto-optional",
        dest="include_auto_optional",
        action="store_false",
        default=True,
        help="Do not auto-generate optional docs based on STORY Downstream / seed (default: enabled)",
    )
    p_e2e.add_argument(
        "--only-auto-optional",
        dest="only_auto_optional",
        action="store_true",
        default=False,
        help="Only generate auto-optional docs (skip BM/BENCH/TRACE/Delivery/Runbook writes).",
    )
    p_e2e.add_argument("--overwrite", action="store_true", help="Overwrite existing files")
    p_e2e.add_argument("--dry-run", action="store_true", help="Do not write; only print planned outputs")

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

    p_trace = sub.add_parser("trace-pack", help="Generate TRACE pack doc (BM -> delivery mapping TSV)")
    p_trace.add_argument("--topic", required=True, help="Topic folder (UPPERCASE), e.g. ETHICS")
    p_trace.add_argument("--slug", required=True, help="Topic slug (kebab-case), e.g. ethics")
    p_trace.add_argument("--trace", required=True, help="TRACE number (4 digits), e.g. 0001")
    p_trace.add_argument("--bm", required=True, help="BM pack number to cover (4 digits), e.g. 0001")
    p_trace.add_argument("--default-target-type", required=True, help="Default TARGET_TYPE (e.g. PRD)")
    p_trace.add_argument("--default-target-id", required=True, help="Default TARGET_ID (e.g. PRD-0004)")
    p_trace.add_argument("--mapping-quality", default="coarse", help="mapping_quality (coarse|refined)")
    p_trace.add_argument("--notes", default="", help="Optional NOTES (if empty, a default note is generated)")
    p_trace.add_argument("--seed", default="", help="Optional seed json file (advanced; supports trace.overrides)")
    p_trace.add_argument("--overwrite", action="store_true", help="Overwrite existing files")
    p_trace.add_argument("--dry-run", action="store_true", help="Do not write; only print planned outputs")

    p_del = sub.add_parser("delivery-pack", help="Generate Delivery pack docs (PB/PRD/SPEC/STORY/AC/TP skeleton)")
    p_del.add_argument("--topic", required=True, help="Topic folder (UPPERCASE), e.g. ETHICS")
    p_del.add_argument("--slug", required=True, help="Delivery slug (kebab-case), e.g. ethics-case-mailbox-mvp")
    p_del.add_argument("--title", default="", help="Human title (optional)")
    p_del.add_argument("--pb", required=True, help="PB number (4 digits), e.g. 0004")
    p_del.add_argument("--prd", required=True, help="PRD number (4 digits), e.g. 0004")
    p_del.add_argument("--spec", required=True, help="SPEC number (4 digits), e.g. 0013")
    p_del.add_argument("--story", required=True, help="STORY/AC/TP number (4 digits), e.g. 0306")
    p_del.add_argument("--bm", default="", help="BM number (4 digits, optional) for references")
    p_del.add_argument("--bench", default="", help="BENCH number (4 digits, optional) for references")
    p_del.add_argument("--trace", default="", help="TRACE number (4 digits, optional) for references")
    p_del.add_argument(
        "--trace-slug",
        default="",
        help="TRACE slug (kebab-case, optional). Default: topic folder lowercased (ETHICS -> ethics).",
    )
    p_del.add_argument("--owner", default="@team/platform", help="Owner value (default: @team/platform)")
    p_del.add_argument("--epic", default="DOCS-PRODUCTION", help="Epic label (default: DOCS-PRODUCTION)")
    p_del.add_argument("--risk-level", default="medium", help="Risk_Level (low|medium|high, default: medium)")
    p_del.add_argument("--overwrite", action="store_true", help="Overwrite existing files")
    p_del.add_argument("--dry-run", action="store_true", help="Do not write; only print planned outputs")

    p_items = sub.add_parser(
        "delivery-items-pack",
        help="Generate STORY/AC/TP (+optional) from PRD delivery_items SSOT (product-oriented)",
    )
    p_items.add_argument("--prd", required=True, help="PRD number (4 digits), e.g. 0004")
    p_items.add_argument("--spec", required=True, help="Default SPEC number (4 digits), e.g. 0013")
    p_items.add_argument("--pb", default="", help="PB number (4 digits, optional; if empty, parse from PRD meta)")
    p_items.add_argument("--title", default="", help="Title override (optional; default: PRD title)")
    p_items.add_argument("--owner", default="@team/platform", help="Owner value (default: @team/platform)")
    p_items.add_argument("--epic", default="DOCS-PRODUCTION", help="Epic label (default: DOCS-PRODUCTION)")
    p_items.add_argument("--risk-level", default="medium", help="Default Risk_Level (low|medium|high, default: medium)")
    p_items.add_argument("--story-start", default="", help="Optional STORY start number (4 digits), e.g. 0310")
    p_items.add_argument("--overwrite", action="store_true", help="Overwrite existing files")
    p_items.add_argument("--dry-run", action="store_true", help="Do not write; only print planned outputs")

    return ap


def main(argv: list[str] | None = None) -> int:
    ap = build_parser()
    args = ap.parse_args(argv)

    if args.cmd == "e2e-pack":
        return cmd_e2e_pack(args)
    if args.cmd == "bm-pack":
        return cmd_bm_pack(args)
    if args.cmd == "bench-pack":
        return cmd_bench_pack(args)
    if args.cmd == "trace-pack":
        return cmd_trace_pack(args)
    if args.cmd == "delivery-pack":
        return cmd_delivery_pack(args)
    if args.cmd == "delivery-items-pack":
        return cmd_delivery_items_pack(args)
    return die(f"unknown cmd: {args.cmd}")


if __name__ == "__main__":
    raise SystemExit(main())
