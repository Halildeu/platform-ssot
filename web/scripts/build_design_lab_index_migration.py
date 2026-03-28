from __future__ import annotations

from collections import defaultdict
from pathlib import Path
import re


def percent(part: int, total: int) -> int:
    return int(round((part / total) * 100)) if total else 0


def read_text_if_exists(path: Path) -> str:
    try:
        return path.read_text(encoding="utf-8")
    except FileNotFoundError:
        return ""


def load_optional_json(path: Path) -> dict:
    if not path.is_file():
        return {}
    import json

    try:
        payload = json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return {}
    return payload if isinstance(payload, dict) else {}


def to_kebab_case(name: str) -> str:
    normalized = re.sub(r"([a-z0-9])([A-Z])", r"\1-\2", name)
    normalized = re.sub(r"([A-Z]+)([A-Z][a-z])", r"\1-\2", normalized)
    return re.sub(r"[^a-z0-9]+", "-", normalized.lower()).strip("-")


def load_prototype_spec_entry(
    *,
    repo_root: Path,
    prototype_source_dir: str,
    component_name: str,
) -> dict:
    prototype_root = repo_root / prototype_source_dir
    slug = to_kebab_case(component_name)
    legacy_slug = re.sub(r"[^a-z0-9]+", "", component_name.lower()).strip("-")
    filenames = [
        f"{slug}.prototype.v1.json",
        f"{legacy_slug}.prototype.v1.json",
    ]
    seen: set[str] = set()
    for filename in filenames:
        if not filename or filename in seen:
            continue
        seen.add(filename)
        prototype_spec_path = prototype_root / filename
        spec = load_optional_json(prototype_spec_path)
        if not spec:
            continue
        prototype_source_path = prototype_spec_path.with_name(
            prototype_spec_path.name.replace(".v1.json", ".ts")
        )
        enriched = dict(spec)
        enriched["_path"] = prototype_spec_path.relative_to(repo_root).as_posix()
        if not enriched.get("sourcePath") and prototype_source_path.is_file():
            enriched["sourcePath"] = prototype_source_path.relative_to(repo_root).as_posix()
        return enriched
    return {}


def normalize_owner_handles(raw: object) -> list[str]:
    if isinstance(raw, str):
        raw = [raw]
    if not isinstance(raw, list):
        return []
    normalized = sorted({str(item).strip() for item in raw if str(item).strip()})
    return normalized


def read_codeowners_default_owners(codeowners_path: Path) -> list[str]:
    for raw_line in read_text_if_exists(codeowners_path).splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#"):
            continue
        parts = [part.strip() for part in line.split() if part.strip()]
        if not parts or parts[0] != "*":
            continue
        owners = [part for part in parts[1:] if part.startswith("@")]
        if owners:
            return sorted(set(owners))
    return []


def build_upgrade_checklist_tasks(
    *,
    component_name: str,
    class_id: str,
    migration_track: str,
    consumer_apps: list[str],
) -> list[str]:
    tasks = [
        f"`{component_name}` icin `{migration_track}` track'i altinda package veya remote surface degisikliklerini dogrula.",
        "Design Lab preview, Storybook harness ve latest release manifest sinyallerini birlikte kontrol et.",
    ]
    if class_id == "major-cross-app-review":
        tasks.extend(
            [
                "Tum etkilenen consumer app sahiplerini release review turuna dahil et.",
                "Semver major guidance ve rollout notunu release notes/changelog artefact'ina yansit.",
            ]
        )
    elif class_id == "minor-beta-external-review":
        tasks.extend(
            [
                "Beta consumer kullanimini release notes icinde risk notu olarak isaretle.",
                "Checklist evidence'inda beta surface onayini ayri satir olarak tut.",
            ]
        )
    elif class_id == "minor-single-app-review":
        target_app = consumer_apps[0] if consumer_apps else "consumer-app"
        tasks.extend(
            [
                f"`{target_app}` icin smoke/regression onayini checklist'e ekle.",
                "Semver minor guidance'i release notes ve rollout ozeti ile birlikte yayimla.",
            ]
        )
    else:
        tasks.append("Surface henuz Design Lab disina cikmadiysa patch-safe backlog olarak izle.")
    return tasks[:4]

def infer_upgrade_recipe_automation(
    *,
    component_name: str,
    class_id: str,
    target_files: list[str],
) -> dict:
    strategy_map = {
        "Empty": "empty-state-prop-audit",
        "ReportFilterPanel": "filter-panel-slot-audit",
        "Select": "select-options-prop-audit",
        "Tag": "tag-tone-access-audit",
        "Text": "typography-prop-audit",
        "ThemePreviewCard": "theme-preview-card-audit",
    }
    strategy_id = strategy_map.get(component_name, "component-prop-audit")
    return {
        "mode": "dry-run-audit",
        "status": "candidate",
        "strategyId": strategy_id,
        "auditScript": "audit:ui-library-upgrade-recipes",
        "candidateScriptPath": "web/scripts/ops/audit-ui-library-upgrade-recipes.mjs",
        "targetFileCount": len(target_files),
        "autoApplyReady": False,
        "confidence": "medium" if class_id == "minor-single-app-review" else "low",
    }

def build_upgrade_recipe_steps(
    *,
    component_name: str,
    consumer_app: str,
    target_files: list[str],
    api_focus_props: list[str],
    regression_focus: list[str],
) -> list[str]:
    first_target = target_files[0] if target_files else f"web/apps/{consumer_app}/**"
    focus_prop_text = ", ".join(api_focus_props[:4]) if api_focus_props else "public props"
    regression_text = ", ".join(regression_focus[:2]) if regression_focus else "UI regression cues"
    return [
        f"`{consumer_app}` icinde once `{first_target}` dosyasindaki `{component_name}` import ve JSX kullanimini incele.",
        f"`{component_name}` icin ozellikle `{focus_prop_text}` alanlarinda backward-compat review yap.",
        f"Preview/regression turunda `{regression_text}` sinyallerini Storybook ve Design Lab ile capraz kontrol et.",
        "Dry-run audit sonucunu checklist ve release notes evidence alanina bagla; otomatik write uygulama oncesi ayri onay ister.",
    ]

def infer_codemod_candidate_profile(component_name: str) -> dict:
    profile_map = {
        "Empty": {
            "strategyId": "empty-state-prop-codemod-candidate",
            "transformKind": "jsx-prop-normalization",
            "riskLevel": "low",
            "confidence": "medium",
            "requiredSignals": ["description", "access"],
            "optionalSignals": ["accessReason", "className"],
            "riskReasons": [
                "Empty tek dosyada kullaniliyor ve public prop seti dar.",
                "Description/access kombinasyonu gorunur oldugu icin dry-run tespiti yuksek sinyal uretir.",
            ],
            "blockers": [
                "Approved fallback listesi owner review disinda degisirse rewrite reddedilir.",
            ],
        },
        "ReportFilterPanel": {
            "strategyId": "report-filter-panel-codemod-candidate",
            "transformKind": "slot-prop-review",
            "riskLevel": "high",
            "confidence": "medium",
            "requiredSignals": ["submitLabel", "resetLabel", "onSubmit", "onReset"],
            "optionalSignals": ["loading", "children"],
            "riskReasons": [
                "Children slot ve handler ciftleri manuel davranis review'u gerektiriyor.",
                "Yanlis rewrite submit/reset akisini sessizce bozabilir.",
            ],
            "blockers": [
                "Children slot davranisi otomatik transform icin henuz guvenli degil.",
                "Handler ciftleri icin semantic assertion katmani gerekli.",
            ],
        },
        "Select": {
            "strategyId": "select-options-codemod-candidate",
            "transformKind": "options-prop-normalization",
            "riskLevel": "medium",
            "confidence": "medium",
            "requiredSignals": ["options", "placeholder"],
            "optionalSignals": ["access", "accessReason", "onChange"],
            "riskReasons": [
                "Options ve access davranisi birlikte degisirse etkileşim akisi etkilenir.",
                "Controlled selection callback'leri manuel smoke ister.",
            ],
            "blockers": [
                "Event payload rewrite'i icin ayrik test harness gerekiyor.",
            ],
        },
        "Tag": {
            "strategyId": "tag-tone-codemod-candidate",
            "transformKind": "tone-access-normalization",
            "riskLevel": "low",
            "confidence": "medium",
            "requiredSignals": ["tone", "access"],
            "optionalSignals": ["accessReason", "className"],
            "riskReasons": [
                "Tag kullanimi tek dosyada ve JSX izi net.",
                "Tone/access prop'lari regex ile kolay ayristiriliyor.",
            ],
            "blockers": [
                "Semantic tone map degisirse manuel renk review'u gerekir.",
            ],
        },
        "Text": {
            "strategyId": "text-typography-codemod-candidate",
            "transformKind": "typography-prop-normalization",
            "riskLevel": "medium",
            "confidence": "medium",
            "requiredSignals": ["variant", "preset"],
            "optionalSignals": ["truncate", "clampLines", "wrap", "align", "tabularNums"],
            "riskReasons": [
                "Birden fazla hedef dosyada typography semantic'i korunmali.",
                "Clamp/truncate davranisi layout regressions uretebilir.",
            ],
            "blockers": [
                "Typography rewrite'i icin visual diff olmadan auto-apply acilmamali.",
            ],
        },
        "ThemePreviewCard": {
            "strategyId": "theme-preview-card-codemod-candidate",
            "transformKind": "selection-state-normalization",
            "riskLevel": "low",
            "confidence": "medium",
            "requiredSignals": ["selected"],
            "optionalSignals": ["className"],
            "riskReasons": [
                "Selected state kullanimi net ve hedef dosya sayisi dusuk.",
                "Preview card state'i Storybook ve Design Lab ile hizali izleniyor.",
            ],
            "blockers": [
                "Theme gallery etkileşimi icin owner onayi olmadan auto-apply acilmaz.",
            ],
        },
    }
    return profile_map.get(
        component_name,
        {
            "strategyId": "component-codemod-candidate",
            "transformKind": "jsx-prop-normalization",
            "riskLevel": "medium",
            "confidence": "low",
            "requiredSignals": [],
            "optionalSignals": [],
            "riskReasons": ["Component icin generic codemod candidate profili kullanildi."],
            "blockers": ["Component'e ozel rewrite strategy tanimlanmadi."],
        },
    )

def build_codemod_candidate_steps(
    *,
    component_name: str,
    consumer_app: str,
    transform_kind: str,
    risk_level: str,
    required_signals: list[str],
    target_files: list[str],
) -> list[str]:
    first_target = target_files[0] if target_files else f"web/apps/{consumer_app}/**"
    signal_text = ", ".join(required_signals[:3]) if required_signals else "component sinyalleri"
    return [
        f"`{component_name}` icin `{consumer_app}` hedefinde `{transform_kind}` candidate'i dry-run olarak planlandi.",
        f"Ilk eslesme turunda `{first_target}` dosyasinda `{signal_text}` sinyallerini ve import/JSX kullanimini dogrula.",
        f"Risk seviyesi `{risk_level}` oldugu icin rewrite karari release owner review'u ile birlikte alinmali.",
        "Auto-apply kapali kalir; candidate artefact yalniz dry-run ve rollout hazirlik kaniti uretir.",
    ]

def build_codemod_candidate(
    *,
    component_name: str,
    consumer_app: str,
    class_id: str,
    semver: str,
    owner_handles: list[str],
    target_files: list[str],
    api_focus_props: list[str],
    preview_focus: list[str],
    regression_focus: list[str],
    manual_checklist_ref: str,
    upgrade_recipe_ref: str,
    codemod_contract: dict,
    prototype_contract: dict,
    dry_run_contract: dict,
    apply_contract: dict,
    manual_review_contract: dict,
    prototype_spec: dict,
) -> dict:
    profile = infer_codemod_candidate_profile(component_name)
    required_signals = [str(signal).strip() for signal in profile.get("requiredSignals", []) if str(signal).strip()]
    optional_signals = [str(signal).strip() for signal in profile.get("optionalSignals", []) if str(signal).strip()]
    transform_kind = str(profile.get("transformKind") or "jsx-prop-normalization")
    risk_level = str(profile.get("riskLevel") or "medium")
    prototype_slug = to_kebab_case(component_name)
    prototype_dir = str(prototype_contract.get("source_dir") or "web/scripts/codemods/ui-library/prototypes").strip()
    candidate_id = str(
        prototype_spec.get("candidateId") or f"{component_name.lower()}-{consumer_app}-codemod"
    ).strip()
    prototype_path = str(
        prototype_spec.get("_path") or f"{prototype_dir}/{prototype_slug}.prototype.v1.json"
    ).strip()
    prototype_source_path = str(prototype_spec.get("sourcePath") or f"{prototype_dir}/{prototype_slug}.prototype.ts").strip()
    rewrite_preview = prototype_spec.get("rewritePreview") if isinstance(prototype_spec.get("rewritePreview"), dict) else {}
    match_strategy = prototype_spec.get("matchStrategy") if isinstance(prototype_spec.get("matchStrategy"), dict) else {}
    manual_validation = prototype_spec.get("manualValidation") if isinstance(prototype_spec.get("manualValidation"), dict) else {}
    rollback_plan = [
        str(entry).strip()
        for entry in prototype_spec.get("rollbackPlan", [])
        if str(entry).strip()
    ][:4]
    prototype_notes = [
        str(entry).strip()
        for entry in prototype_spec.get("notes", [])
        if str(entry).strip()
    ][:4]
    dry_run_focus_components = {
        str(entry).strip()
        for entry in dry_run_contract.get("focus_components", [])
        if str(entry).strip()
    }
    apply_focus_components = {
        str(entry).strip()
        for entry in apply_contract.get("focus_components", [])
        if str(entry).strip()
    }
    manual_review_focus_components = {
        str(entry).strip()
        for entry in manual_review_contract.get("focus_components", [])
        if str(entry).strip()
    }
    dry_run_included = component_name in dry_run_focus_components
    apply_executor_included = component_name in apply_focus_components
    manual_review_included = component_name in manual_review_focus_components
    return {
        "candidateId": candidate_id,
        "component": component_name,
        "consumerApp": consumer_app,
        "classId": class_id,
        "semver": semver,
        "ownerHandles": owner_handles,
        "transformEngine": str(codemod_contract.get("transform_engine") or "ts-morph-candidate"),
        "transformKind": transform_kind,
        "strategyId": str(profile.get("strategyId") or "component-codemod-candidate"),
        "riskLevel": risk_level,
        "riskReasons": [str(entry).strip() for entry in profile.get("riskReasons", []) if str(entry).strip()][:3],
        "blockers": [str(entry).strip() for entry in profile.get("blockers", []) if str(entry).strip()][:3],
        "targetFiles": target_files,
        "estimatedTouchPoints": max(len(target_files), 1),
        "dryRunCommand": str(
            dry_run_contract.get("run_script") or "run:ui-library-codemod-dry-run"
        ) if dry_run_included else str(codemod_contract.get("audit_script") or "audit:ui-library-codemod-candidates"),
        "candidateScriptPath": "web/scripts/ops/run-ui-library-codemod-dry-run.mjs" if dry_run_included else "web/scripts/ops/audit-ui-library-codemod-candidates.mjs",
        "dryRunIncluded": dry_run_included,
        "applyExecutorIncluded": apply_executor_included,
        "applyExecutorCommand": str(
            apply_contract.get("run_script") or "run:ui-library-codemod-apply"
        ) if apply_executor_included else "",
        "manualReviewIncluded": manual_review_included,
        "manualReviewCommand": str(
            manual_review_contract.get("run_script") or "run:ui-library-codemod-manual-review"
        ) if manual_review_included else "",
        "dryRunScope": {
            "targetFileCount": len(target_files),
            "requiredAnySignals": required_signals,
            "optionalSignals": optional_signals,
            "minRequiredMatches": 1 if required_signals else 0,
            "ownerMapped": bool(owner_handles),
        },
        "matchSelectors": [
            f"import {{ {component_name} }} from '@mfe/design-system'",
            f"<{component_name}",
        ],
        "apiFocusProps": api_focus_props[:5],
        "previewFocus": preview_focus[:3],
        "regressionFocus": regression_focus[:3],
        "steps": build_codemod_candidate_steps(
            component_name=component_name,
            consumer_app=consumer_app,
            transform_kind=transform_kind,
            risk_level=risk_level,
            required_signals=required_signals,
            target_files=target_files,
        ),
        "manualChecklistRef": manual_checklist_ref,
        "upgradeRecipeRef": upgrade_recipe_ref,
        "applyReady": False,
        "confidence": str(profile.get("confidence") or "low"),
        "prototypePath": prototype_path,
        "prototypeSourcePath": prototype_source_path,
        "prototypeStatus": "ready" if prototype_spec else "missing",
        "prototypeReviewMode": str(prototype_spec.get("reviewMode") or "missing"),
        "rewriteRule": str(prototype_spec.get("rewriteRule") or "").strip(),
        "rewritePreview": {
            "kind": str(rewrite_preview.get("kind") or "illustrative"),
            "before": str(rewrite_preview.get("before") or "").strip(),
            "after": str(rewrite_preview.get("after") or "").strip(),
        },
        "matchStrategy": {
            "requiredSelectors": [
                str(entry).strip()
                for entry in match_strategy.get("requiredSelectors", [])
                if str(entry).strip()
            ][:4],
            "dryRunSignals": [
                str(entry).strip()
                for entry in match_strategy.get("dryRunSignals", [])
                if str(entry).strip()
            ][:6],
            "astTargets": [
                str(entry).strip()
                for entry in match_strategy.get("astTargets", [])
                if str(entry).strip()
            ][:6],
            "stopConditions": [
                str(entry).strip()
                for entry in match_strategy.get("stopConditions", [])
                if str(entry).strip()
            ][:4],
        },
        "manualValidation": {
            "storybook": [
                str(entry).strip()
                for entry in manual_validation.get("storybook", [])
                if str(entry).strip()
            ][:4],
            "designLab": [
                str(entry).strip()
                for entry in manual_validation.get("designLab", [])
                if str(entry).strip()
            ][:4],
            "smoke": [
                str(entry).strip()
                for entry in manual_validation.get("smoke", [])
                if str(entry).strip()
            ][:4],
        },
        "rollbackPlan": rollback_plan,
        "prototypeNotes": prototype_notes,
        "evidenceRefs": [
            prototype_path,
            prototype_source_path,
            *target_files[:4],
            "web/test-results/releases/ui-library/latest/ui-library-upgrade-recipes.v1.json",
            "web/test-results/releases/ui-library/latest/ui-library-release-manifest.v1.json",
        ],
    }

def build_codemod_prototype_summary_item(candidate: dict) -> dict:
    return {
        "candidateId": str(candidate.get("candidateId") or "").strip(),
        "component": str(candidate.get("component") or "").strip(),
        "consumerApp": str(candidate.get("consumerApp") or "").strip(),
        "transformKind": str(candidate.get("transformKind") or "").strip(),
        "riskLevel": str(candidate.get("riskLevel") or "").strip(),
        "prototypeStatus": str(candidate.get("prototypeStatus") or "missing").strip(),
        "prototypeReviewMode": str(candidate.get("prototypeReviewMode") or "missing").strip(),
        "prototypePath": str(candidate.get("prototypePath") or "").strip(),
        "prototypeSourcePath": str(candidate.get("prototypeSourcePath") or "").strip(),
        "rewriteRule": str(candidate.get("rewriteRule") or "").strip(),
    }

def extract_consumer_app_id(relative_path: str) -> str | None:
    parts = [segment for segment in relative_path.split("/") if segment]
    if len(parts) >= 3 and parts[0] == "web" and parts[1] == "apps":
        return parts[2]
    return None

def build_catalog_summary(manifest_items: list[dict]) -> dict[str, int]:
    index_items = [
        item.get("indexItem")
        for item in manifest_items
        if isinstance(item, dict) and isinstance(item.get("indexItem"), dict)
    ]
    total = len(index_items)
    return {
        "total": total,
        "exported": sum(1 for item in index_items if item.get("availability") == "exported"),
        "planned": sum(1 for item in index_items if item.get("availability") == "planned"),
        "liveDemo": sum(1 for item in index_items if item.get("demoMode") == "live"),
        "inspector": sum(1 for item in index_items if item.get("demoMode") == "inspector"),
    }

def build_adoption_summary(manifest_items: list[dict], diagnostics: dict) -> dict:
    index_items = [
        item.get("indexItem")
        for item in manifest_items
        if isinstance(item, dict) and isinstance(item.get("indexItem"), dict)
    ]
    documented_items = [
        item for item in manifest_items if isinstance(item, dict) and isinstance(item.get("apiItem"), dict)
    ]
    total = len(index_items)
    documented_count = len(documented_items)
    undocumented_items = [
        item
        for item in manifest_items
        if isinstance(item, dict)
        and isinstance(item.get("indexItem"), dict)
        and not isinstance(item.get("apiItem"), dict)
    ]
    stable_documented = [
        item
        for item in manifest_items
        if isinstance(item, dict)
        and isinstance(item.get("indexItem"), dict)
        and item["indexItem"].get("lifecycle") == "stable"
        and isinstance(item.get("apiItem"), dict)
    ]
    stable_undocumented = [
        str(item["indexItem"].get("name") or "").strip()
        for item in undocumented_items
        if item["indexItem"].get("lifecycle") == "stable"
    ]
    beta_undocumented = [
        str(item["indexItem"].get("name") or "").strip()
        for item in undocumented_items
        if item["indexItem"].get("lifecycle") == "beta"
    ]
    used_undocumented = [
        str(item["indexItem"].get("name") or "").strip()
        for item in undocumented_items
        if item["indexItem"].get("whereUsed")
    ]

    return {
        "contractId": "ui-library-adoption-enforcement-contract-v1",
        "contractPath": "docs/02-architecture/context/ui-library-adoption-enforcement.contract.v1.json",
        "previewRoute": "/admin/design-lab",
        "packageImport": "import { Button } from '@mfe/design-system';",
        "moduleFederation": {
            "remoteName": "mfe_ui_kit",
            "exposes": ["./library", "./Button"],
        },
        "surfaceSummary": {
            "publicExports": total,
            "stableExports": sum(1 for item in index_items if item.get("lifecycle") == "stable"),
            "betaExports": sum(1 for item in index_items if item.get("lifecycle") == "beta"),
            "liveDemoExports": sum(1 for item in index_items if item.get("demoMode") == "live"),
            "consumedByAppsExports": sum(1 for item in index_items if item.get("whereUsed")),
        },
        "apiCoverage": {
            "documentedExports": documented_count,
            "undocumentedExports": max(total - documented_count, 0),
            "coveragePercent": percent(documented_count, total),
            "liveDemoDocumentedExports": sum(
                1 for item in documented_items if item["indexItem"].get("demoMode") == "live"
            ),
        },
        "releaseReadiness": {
            "wideAdoptionReady": len(stable_documented),
            "stableUndocumented": len(stable_undocumented),
            "betaDocumented": sum(
                1 for item in documented_items if item["indexItem"].get("lifecycle") == "beta"
            ),
            "betaUndocumented": len(beta_undocumented),
        },
        "internalSurfaceProtection": {
            "status": (
                "protected"
                if len(diagnostics.get("runtimeExportsWithoutRegistry", [])) == 0
                else "drifted"
            ),
            "privateEntryPath": "packages/design-system/src/catalog/design-lab-internals.ts",
            "allowedConsumers": [
                "apps/mfe-shell/src/pages/admin/DesignLabPage.tsx",
                "apps/mfe-shell/src/pages/admin/design-lab/showcase/DesignLabShowcaseContent.tsx",
                "apps/mfe-shell/src/pages/admin/design-lab/showcase/preview-components/pagination/paginationInternals.ts",
            ],
            "runtimeExportsWithoutRegistry": len(diagnostics.get("runtimeExportsWithoutRegistry", [])),
        },
        "priorityBacklog": {
            "usedUndocumented": sorted(name for name in used_undocumented if name)[:8],
            "stableUndocumented": sorted(name for name in stable_undocumented if name)[:8],
            "betaUndocumented": sorted(name for name in beta_undocumented if name)[:8],
        },
        "consumerRules": [
            "Yeni ekranlar once recipe ailesi ile cozulur; page-level custom UI son tercihtir.",
            "Public tuketim yalniz '@mfe/design-system' package import veya resmi module federation expose yuzeyi ile yapilir.",
            "Release-ready yuzey stable lifecycle ve API katalog dokumani ile birlikte dusunulur.",
            "Design Lab ic primitifleri public surface yerine private barrel altinda tutulur.",
        ],
        "evidenceRefs": [
            "packages/design-system/src/catalog/component-manifest.v1.json",
            "packages/design-system/src/index.ts",
            "docs/02-architecture/context/ui-library-adoption-enforcement.contract.v1.json",
        ],
    }

def build_migration_summary(manifest_items: list[dict], coverage_state: dict[str, set[str]]) -> dict:
    manifest_by_name: dict[str, dict] = {
        str(item.get("name") or "").strip(): item
        for item in manifest_items
        if isinstance(item, dict) and str(item.get("name") or "").strip()
    }
    index_items = [
        item.get("indexItem")
        for item in manifest_items
        if isinstance(item, dict) and isinstance(item.get("indexItem"), dict)
    ]
    component_items = [
        item
        for item in index_items
        if item.get("kind") == "component" and str(item.get("name") or "").strip()
    ]
    story_covered_names = coverage_state.get("storyCoveredNames", set())
    design_lab_path = "web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx"
    app_components: dict[str, set[str]] = defaultdict(set)
    component_external_apps: dict[str, list[str]] = {}
    adopted_outside_lab_names: set[str] = set()
    stable_adopted_names: set[str] = set()
    beta_adopted_names: set[str] = set()
    stable_only_design_lab: list[str] = []
    beta_used_outside_lab: list[str] = []
    adopted_without_story: list[str] = []
    single_app_blast_radius: list[str] = []
    cross_app_review: list[str] = []
    change_class_items: list[dict] = []
    upgrade_checklist_items: list[dict] = []
    upgrade_recipe_items: list[dict] = []
    codemod_candidate_items: list[dict] = []

    upgrade_contract_path = Path(__file__).resolve().parents[2] / "docs/02-architecture/context/ui-library-consumer-upgrade.contract.v1.json"
    upgrade_contract = load_optional_json(upgrade_contract_path)
    owner_contract_path = Path(__file__).resolve().parents[2] / "docs/02-architecture/context/ui-library-consumer-owner-registry.v1.json"
    owner_contract = load_optional_json(owner_contract_path)
    recipes_contract_path = Path(__file__).resolve().parents[2] / "docs/02-architecture/context/ui-library-consumer-upgrade-recipes.contract.v1.json"
    recipes_contract = load_optional_json(recipes_contract_path)
    codemod_contract_path = Path(__file__).resolve().parents[2] / "docs/02-architecture/context/ui-library-consumer-codemod-candidates.contract.v1.json"
    codemod_contract = load_optional_json(codemod_contract_path)
    prototype_contract_path = Path(__file__).resolve().parents[2] / "docs/02-architecture/context/ui-library-consumer-codemod-prototypes.contract.v1.json"
    prototype_contract = load_optional_json(prototype_contract_path)
    dry_run_contract_path = Path(__file__).resolve().parents[2] / "docs/02-architecture/context/ui-library-consumer-codemod-dry-run.contract.v1.json"
    dry_run_contract = load_optional_json(dry_run_contract_path)
    apply_preview_contract_path = Path(__file__).resolve().parents[2] / "docs/02-architecture/context/ui-library-consumer-codemod-apply-preview.contract.v1.json"
    apply_preview_contract = load_optional_json(apply_preview_contract_path)
    apply_contract_path = Path(__file__).resolve().parents[2] / "docs/02-architecture/context/ui-library-consumer-codemod-apply.contract.v1.json"
    apply_contract = load_optional_json(apply_contract_path)
    manual_review_contract_path = Path(__file__).resolve().parents[2] / "docs/02-architecture/context/ui-library-consumer-codemod-manual-review.contract.v1.json"
    manual_review_contract = load_optional_json(manual_review_contract_path)
    manual_decision_contract_path = Path(__file__).resolve().parents[2] / "docs/02-architecture/context/ui-library-consumer-codemod-manual-decision.contract.v1.json"
    manual_decision_contract = load_optional_json(manual_decision_contract_path)
    apply_preview_audit_relative = str(
        apply_preview_contract.get("audit_artifact_path")
        or "web/test-results/releases/ui-library/latest/ui-library-codemod-apply-preview.audit.v1.json"
    ).strip()
    apply_preview_audit = load_optional_json(Path(__file__).resolve().parents[2] / apply_preview_audit_relative)
    apply_audit_relative = str(
        apply_contract.get("audit_artifact_path")
        or "web/test-results/releases/ui-library/latest/ui-library-codemod-apply.audit.v1.json"
    ).strip()
    apply_audit = load_optional_json(Path(__file__).resolve().parents[2] / apply_audit_relative)
    manual_review_audit_relative = str(
        manual_review_contract.get("audit_artifact_path")
        or "web/test-results/releases/ui-library/latest/ui-library-codemod-manual-review.audit.v1.json"
    ).strip()
    manual_review_audit = load_optional_json(Path(__file__).resolve().parents[2] / manual_review_audit_relative)
    manual_decision_artifact_relative = str(
        manual_decision_contract.get("artifact_path")
        or "web/test-results/releases/ui-library/latest/ui-library-codemod-manual-review-decisions.v1.json"
    ).strip()
    manual_decision_artifact = load_optional_json(Path(__file__).resolve().parents[2] / manual_decision_artifact_relative)
    manual_decision_audit_relative = str(
        manual_decision_contract.get("audit_artifact_path")
        or "web/test-results/releases/ui-library/latest/ui-library-codemod-manual-review-decisions.audit.v1.json"
    ).strip()
    manual_decision_audit = load_optional_json(Path(__file__).resolve().parents[2] / manual_decision_audit_relative)
    repo_root = Path(__file__).resolve().parents[2]
    prototype_source_dir = str(prototype_contract.get("source_dir") or "web/scripts/codemods/ui-library/prototypes").strip()
    dry_run_focus_components = {
        str(entry).strip()
        for entry in dry_run_contract.get("focus_components", [])
        if str(entry).strip()
    }
    apply_preview_focus_components = {
        str(entry).strip()
        for entry in apply_preview_contract.get("focus_components", [])
        if str(entry).strip()
    }
    apply_focus_components = {
        str(entry).strip()
        for entry in apply_contract.get("focus_components", [])
        if str(entry).strip()
    }
    manual_review_focus_components = {
        str(entry).strip()
        for entry in manual_review_contract.get("focus_components", [])
        if str(entry).strip()
    }
    manual_decision_plan = [
        entry for entry in manual_decision_contract.get("decision_plan", []) if isinstance(entry, dict)
    ]
    manual_decision_focus_components = {
        str(entry.get("component") or "").strip()
        for entry in manual_decision_plan
        if str(entry.get("component") or "").strip()
    }
    manual_decision_items_payload = (
        manual_decision_artifact.get("codemodManualReviewDecisions")
        if isinstance(manual_decision_artifact.get("codemodManualReviewDecisions"), dict)
        else {}
    )
    manual_decision_items = (
        manual_decision_items_payload.get("items")
        if isinstance(manual_decision_items_payload.get("items"), list)
        else []
    )
    manual_decision_items_by_component = {
        str(entry.get("component") or "").strip(): entry
        for entry in manual_decision_items
        if isinstance(entry, dict) and str(entry.get("component") or "").strip()
    }
    all_codemod_focus_components = {
        *[
            str(entry).strip()
            for entry in codemod_contract.get("focus_components", [])
            if str(entry).strip()
        ],
        *[
            str(entry).strip()
            for entry in prototype_contract.get("focus_components", [])
            if str(entry).strip()
        ],
        *dry_run_focus_components,
        *apply_preview_focus_components,
        *apply_focus_components,
        *manual_review_focus_components,
        *manual_decision_focus_components,
    }
    prototype_specs_by_component: dict[str, dict] = {}
    for component_name in sorted(all_codemod_focus_components):
        component_key = str(component_name or "").strip()
        if not component_key:
            continue
        prototype_specs_by_component[component_key] = load_prototype_spec_entry(
            repo_root=repo_root,
            prototype_source_dir=prototype_source_dir,
            component_name=component_key,
        )
    codeowners_relative = str(owner_contract.get("codeowners_path") or ".github/CODEOWNERS").strip()
    codeowners_path = Path(__file__).resolve().parents[2] / codeowners_relative
    default_owner_handles = normalize_owner_handles(owner_contract.get("default_owner_handles"))
    default_owner_source = "owner-registry-default" if default_owner_handles else "codeowners-default"
    if not default_owner_handles:
        default_owner_handles = read_codeowners_default_owners(codeowners_path)
    owner_overrides: dict[str, dict[str, object]] = {}
    for entry in owner_contract.get("app_owner_overrides", []):
        if not isinstance(entry, dict):
            continue
        app_id = str(entry.get("app_id") or "").strip()
        owners = normalize_owner_handles(entry.get("owners"))
        if not app_id or not owners:
            continue
        owner_overrides[app_id] = {
            "owners": owners,
            "source": str(entry.get("source") or "owner-registry-override"),
        }
    playbook_tracks = [
        track
        for track in upgrade_contract.get("playbook_tracks", [])
        if isinstance(track, dict)
    ]

    def resolve_app_owners(app_id: str) -> tuple[list[str], str]:
        override = owner_overrides.get(app_id)
        if isinstance(override, dict):
            owners = normalize_owner_handles(override.get("owners"))
            if owners:
                return owners, str(override.get("source") or "owner-registry-override")
        if default_owner_handles:
            return default_owner_handles, default_owner_source
        return [], "unowned"

    for item in component_items:
        name = str(item.get("name") or "").strip()
        lifecycle = str(item.get("lifecycle") or "").strip()
        where_used = [str(entry).strip() for entry in item.get("whereUsed", []) if str(entry).strip()]
        external_usage = [entry for entry in where_used if entry != design_lab_path]
        external_apps = sorted(
            {
                app_id
                for app_id in (extract_consumer_app_id(entry) for entry in external_usage)
                if app_id
            }
        )
        component_external_apps[name] = external_apps
        if external_apps:
            adopted_outside_lab_names.add(name)
            if lifecycle == "stable":
                stable_adopted_names.add(name)
            elif lifecycle == "beta":
                beta_adopted_names.add(name)
                beta_used_outside_lab.append(name)
            if name not in story_covered_names:
                adopted_without_story.append(name)
            if len(external_apps) == 1:
                single_app_blast_radius.append(name)
                change_class_items.append(
                    {
                        "name": name,
                        "lifecycle": lifecycle,
                        "consumerApps": external_apps,
                        "consumerAppCount": len(external_apps),
                        "classId": "minor-single-app-review" if lifecycle != "beta" else "minor-beta-external-review",
                        "semver": "minor",
                        "migrationTrack": "package-import-review",
                    }
                )
            else:
                cross_app_review.append(name)
                change_class_items.append(
                    {
                        "name": name,
                        "lifecycle": lifecycle,
                        "consumerApps": external_apps,
                        "consumerAppCount": len(external_apps),
                        "classId": "major-cross-app-review",
                        "semver": "major",
                        "migrationTrack": "consumer-rollout-review",
                    }
                )
            for app_id in external_apps:
                app_components[app_id].add(name)
        elif lifecycle == "stable":
            stable_only_design_lab.append(name)
            change_class_items.append(
                {
                    "name": name,
                    "lifecycle": lifecycle,
                    "consumerApps": [],
                    "consumerAppCount": 0,
                    "classId": "patch-safe-lab-only",
                    "semver": "patch",
                    "migrationTrack": "theme-runtime-review" if "Theme" in name else "module-federation-review",
                }
            )

    severity_rank = {
        "major-cross-app-review": 3,
        "minor-beta-external-review": 2,
        "minor-single-app-review": 1,
        "patch-safe-lab-only": 0,
    }
    consumer_apps = [
        {
            "appId": app_id,
            "componentCount": len(component_names),
            "components": sorted(component_names)[:8],
            "singleAppComponents": sorted(
                name for name in component_names if len(component_external_apps.get(name, [])) == 1
            )[:8],
            "sharedComponents": sorted(
                name for name in component_names if len(component_external_apps.get(name, [])) > 1
            )[:8],
            "highestChangeClass": max(
                (
                    next(
                        (
                            item["classId"]
                            for item in change_class_items
                            if item["name"] == name
                        ),
                        "patch-safe-lab-only",
                    )
                    for name in component_names
                ),
                key=lambda class_id: severity_rank.get(class_id, -1),
                default="patch-safe-lab-only",
            ),
            "ownerHandles": resolve_app_owners(app_id)[0],
            "ownerSource": resolve_app_owners(app_id)[1],
        }
        for app_id, component_names in sorted(
            app_components.items(),
            key=lambda entry: (-len(entry[1]), entry[0]),
        )
    ]
    owner_mapped_apps_count = sum(1 for app in consumer_apps if app.get("ownerHandles"))
    change_class_counts = defaultdict(int)
    for entry in change_class_items:
        class_id = str(entry.get("classId") or "").strip()
        if class_id:
            change_class_counts[class_id] += 1

    for entry in change_class_items:
        component_name = str(entry.get("name") or "").strip()
        consumer_apps_for_component = [
            app
            for app in consumer_apps
            if component_name in app.get("components", [])
        ]
        owner_handles = sorted(
            {
                owner
                for app in consumer_apps_for_component
                for owner in app.get("ownerHandles", [])
            }
        )
        entry["ownerHandles"] = owner_handles
        if int(entry.get("consumerAppCount") or 0) <= 0:
            continue
        upgrade_checklist_items.append(
            {
                "checklistId": f"{component_name.lower()}-{str(entry.get('classId') or '').strip()}",
                "component": component_name,
                "classId": str(entry.get("classId") or "").strip(),
                "semver": str(entry.get("semver") or "").strip(),
                "migrationTrack": str(entry.get("migrationTrack") or "").strip(),
                "ownerHandles": owner_handles,
                "consumerApps": [
                    {
                        "appId": str(app.get("appId") or "").strip(),
                        "ownerHandles": app.get("ownerHandles", []),
                        "ownerSource": str(app.get("ownerSource") or "").strip(),
                    }
                    for app in consumer_apps_for_component
                ],
                "tasks": build_upgrade_checklist_tasks(
                    component_name=component_name,
                    class_id=str(entry.get("classId") or "").strip(),
                    migration_track=str(entry.get("migrationTrack") or "").strip(),
                    consumer_apps=[str(app.get("appId") or "").strip() for app in consumer_apps_for_component],
                ),
                "evidenceRefs": [
                    "web/apps/mfe-shell/src/pages/admin/design-lab.index.json",
                    "web/test-results/releases/ui-library/latest/ui-library-release-manifest.v1.json",
                    "web/test-results/releases/ui-library/latest/ui-library-consumer-impact.v1.json",
                ],
                "codemodReady": str(entry.get("classId") or "").strip() == "minor-single-app-review",
            }
        )
        if str(entry.get("classId") or "").strip() == "minor-single-app-review":
            manifest_entry = manifest_by_name.get(component_name, {})
            index_item = manifest_entry.get("indexItem") if isinstance(manifest_entry, dict) else {}
            api_item = manifest_entry.get("apiItem") if isinstance(manifest_entry, dict) else {}
            where_used_entries = index_item.get("whereUsed") if isinstance(index_item, dict) else []
            api_props_entries = api_item.get("props") if isinstance(api_item, dict) else []
            preview_focus_entries = api_item.get("previewFocus") if isinstance(api_item, dict) else []
            regression_focus_entries = api_item.get("regressionFocus") if isinstance(api_item, dict) else []
            target_files = [
                str(path).strip()
                for path in (where_used_entries if isinstance(where_used_entries, list) else [])
                if str(path).strip() != design_lab_path
            ]
            target_app = (
                str(consumer_apps_for_component[0].get("appId") or "").strip()
                if consumer_apps_for_component
                else "consumer-app"
            )
            api_props = [
                str(prop.get("name") or "").strip()
                for prop in (api_props_entries if isinstance(api_props_entries, list) else [])
                if isinstance(prop, dict) and str(prop.get("name") or "").strip()
            ]
            preview_focus = [
                str(item).strip()
                for item in (preview_focus_entries if isinstance(preview_focus_entries, list) else [])
                if str(item).strip()
            ][:3]
            regression_focus = [
                str(item).strip()
                for item in (regression_focus_entries if isinstance(regression_focus_entries, list) else [])
                if str(item).strip()
            ][:3]
            recipe_id = f"{component_name.lower()}-{target_app}-upgrade"
            manual_checklist_ref = f"{component_name.lower()}-{str(entry.get('classId') or '').strip()}"
            upgrade_recipe_items.append(
                {
                    "recipeId": recipe_id,
                    "component": component_name,
                    "consumerApp": target_app,
                    "classId": str(entry.get("classId") or "").strip(),
                    "semver": str(entry.get("semver") or "").strip(),
                    "ownerHandles": owner_handles,
                    "targetFiles": target_files,
                    "importStatement": str(index_item.get("importStatement") or "").strip() if isinstance(index_item, dict) else "",
                    "apiFocusProps": api_props[:5],
                    "previewFocus": preview_focus,
                    "regressionFocus": regression_focus,
                    "automation": infer_upgrade_recipe_automation(
                        component_name=component_name,
                        class_id=str(entry.get("classId") or "").strip(),
                        target_files=target_files,
                    ),
                    "steps": build_upgrade_recipe_steps(
                        component_name=component_name,
                        consumer_app=target_app,
                        target_files=target_files,
                        api_focus_props=api_props,
                        regression_focus=regression_focus,
                    ),
                    "manualChecklistRef": manual_checklist_ref,
                    "evidenceRefs": [
                        *target_files[:4],
                        "web/test-results/releases/ui-library/latest/ui-library-upgrade-checklist.v1.json",
                        "web/test-results/releases/ui-library/latest/ui-library-release-manifest.v1.json",
                    ],
                }
            )
            codemod_candidate_items.append(
                build_codemod_candidate(
                    component_name=component_name,
                    consumer_app=target_app,
                    class_id=str(entry.get("classId") or "").strip(),
                    semver=str(entry.get("semver") or "").strip(),
                    owner_handles=owner_handles,
                    target_files=target_files,
                    api_focus_props=api_props,
                    preview_focus=preview_focus,
                    regression_focus=regression_focus,
                    manual_checklist_ref=manual_checklist_ref,
                    upgrade_recipe_ref=recipe_id,
                    codemod_contract=codemod_contract,
                    prototype_contract=prototype_contract,
                    dry_run_contract=dry_run_contract,
                    apply_contract=apply_contract,
                    manual_review_contract=manual_review_contract,
                    prototype_spec=prototype_specs_by_component.get(component_name, {}),
                )
            )

    existing_codemod_components = {
        str(item.get("component") or "").strip()
        for item in codemod_candidate_items
        if str(item.get("component") or "").strip()
    }
    for component_name in sorted(all_codemod_focus_components - existing_codemod_components):
        manifest_entry = manifest_by_name.get(component_name, {})
        index_item = manifest_entry.get("indexItem") if isinstance(manifest_entry, dict) else {}
        api_item = manifest_entry.get("apiItem") if isinstance(manifest_entry, dict) else {}
        where_used_entries = index_item.get("whereUsed") if isinstance(index_item, dict) else []
        target_files = [
            str(path).strip()
            for path in (where_used_entries if isinstance(where_used_entries, list) else [])
            if str(path).strip() and str(path).strip() != design_lab_path
        ]
        if not target_files:
            continue
        external_apps = component_external_apps.get(component_name, [])
        if len(external_apps) > 1:
            class_id = "major-cross-app-review"
            semver = "major"
            target_app = external_apps[0]
        elif len(external_apps) == 1:
            class_id = "minor-single-app-review"
            semver = "minor"
            target_app = external_apps[0]
        else:
            class_id = "patch-safe-lab-only"
            semver = "patch"
            target_app = "consumer-app"
        consumer_apps_for_component = [
            app
            for app in consumer_apps
            if component_name in app.get("components", [])
        ]
        owner_handles = sorted(
            {
                owner
                for app in consumer_apps_for_component
                for owner in app.get("ownerHandles", [])
            }
        )
        api_props_entries = api_item.get("props") if isinstance(api_item, dict) else []
        preview_focus_entries = api_item.get("previewFocus") if isinstance(api_item, dict) else []
        regression_focus_entries = api_item.get("regressionFocus") if isinstance(api_item, dict) else []
        api_props = [
            str(prop.get("name") or "").strip()
            for prop in (api_props_entries if isinstance(api_props_entries, list) else [])
            if isinstance(prop, dict) and str(prop.get("name") or "").strip()
        ]
        preview_focus = [
            str(item).strip()
            for item in (preview_focus_entries if isinstance(preview_focus_entries, list) else [])
            if str(item).strip()
        ][:3]
        regression_focus = [
            str(item).strip()
            for item in (regression_focus_entries if isinstance(regression_focus_entries, list) else [])
            if str(item).strip()
        ][:3]
        manual_checklist_ref = next(
            (
                str(item.get("checklistId") or "").strip()
                for item in upgrade_checklist_items
                if str(item.get("component") or "").strip() == component_name
            ),
            f"{component_name.lower()}-{class_id}",
        )
        upgrade_recipe_ref = next(
            (
                str(item.get("recipeId") or "").strip()
                for item in upgrade_recipe_items
                if str(item.get("component") or "").strip() == component_name
            ),
            f"{component_name.lower()}-{target_app}-upgrade",
        )
        codemod_candidate_items.append(
            build_codemod_candidate(
                component_name=component_name,
                consumer_app=target_app,
                class_id=class_id,
                semver=semver,
                owner_handles=owner_handles,
                target_files=target_files,
                api_focus_props=api_props,
                preview_focus=preview_focus,
                regression_focus=regression_focus,
                manual_checklist_ref=manual_checklist_ref,
                upgrade_recipe_ref=upgrade_recipe_ref,
                codemod_contract=codemod_contract,
                prototype_contract=prototype_contract,
                dry_run_contract=dry_run_contract,
                apply_contract=apply_contract,
                manual_review_contract=manual_review_contract,
                prototype_spec=prototype_specs_by_component.get(component_name, {}),
            )
        )

    manual_decision_plan_by_component = {
        str(entry.get("component") or "").strip(): entry
        for entry in manual_decision_plan
        if isinstance(entry, dict) and str(entry.get("component") or "").strip()
    }
    for item in codemod_candidate_items:
        component_name = str(item.get("component") or "").strip()
        plan_entry = manual_decision_plan_by_component.get(component_name, {})
        decision_entry = manual_decision_items_by_component.get(component_name, {})
        if plan_entry:
            item["manualReviewDecisionIncluded"] = True
            item["manualReviewDecisionCommand"] = str(
                manual_decision_contract.get("run_script") or "run:ui-library-codemod-manual-review-decisions"
            )
            item["manualReviewDecisionState"] = str(
                decision_entry.get("selectedDecision") or plan_entry.get("decision") or ""
            ).strip()
            item["manualReviewDecisionRationale"] = str(
                decision_entry.get("rationale") or plan_entry.get("rationale") or ""
            ).strip()
            item["manualReviewDecisionNextStep"] = str(
                decision_entry.get("nextStep") or plan_entry.get("next_step") or ""
            ).strip()

    if int(change_class_counts.get("major-cross-app-review") or 0) > 0:
        recommended_bump = "major"
        semver_reason = "Cross-app review gerektiren stable surface mevcut."
    elif int(change_class_counts.get("minor-single-app-review") or 0) > 0 or int(
        change_class_counts.get("minor-beta-external-review") or 0
    ) > 0:
        recommended_bump = "minor"
        semver_reason = "Tekil consumer veya beta external review gerektiren surface mevcut."
    else:
        recommended_bump = "patch"
        semver_reason = "Public consumer etkisi olmayan veya lab-only patch-safe surface baskin."

    return {
        "contractId": "ui-library-consumer-impact-contract-v1",
        "upgradeContractPath": "docs/02-architecture/context/ui-library-consumer-upgrade.contract.v1.json",
        "artifactPath": "web/test-results/releases/ui-library/latest/ui-library-consumer-impact.v1.json",
        "summary": {
            "adoptedOutsideLabComponents": len(adopted_outside_lab_names),
            "stableAdoptedComponents": len(stable_adopted_names),
            "betaAdoptedComponents": len(beta_adopted_names),
            "consumerAppsCount": len(consumer_apps),
            "adoptedStoryCoveredComponents": len(adopted_outside_lab_names & story_covered_names),
            "adoptedStoryCoveragePercent": percent(
                len(adopted_outside_lab_names & story_covered_names),
                len(adopted_outside_lab_names),
            ),
            "stableOnlyInDesignLab": len(stable_only_design_lab),
            "singleAppBlastRadiusCount": len(single_app_blast_radius),
            "crossAppReviewComponents": len(cross_app_review),
            "manualReviewRequiredComponents": len(adopted_outside_lab_names),
            "codemodReadyComponents": len(codemod_candidate_items),
            "ownerMappedAppsCount": owner_mapped_apps_count,
        },
        "ownerResolution": {
            "contractId": str(owner_contract.get("contract_id") or "ui-library-consumer-owner-registry-v1"),
            "contractPath": "docs/02-architecture/context/ui-library-consumer-owner-registry.v1.json",
            "codeownersPath": codeowners_relative or ".github/CODEOWNERS",
            "defaultOwnerHandles": default_owner_handles,
            "ownerMappedAppsCount": owner_mapped_apps_count,
            "unownedAppsCount": max(len(consumer_apps) - owner_mapped_apps_count, 0),
            "source": default_owner_source if default_owner_handles else "unowned",
            "rules": [
                "Consumer app owner cozumlemesi explicit override yoksa CODEOWNERS fallback'i ile tamamlanir.",
                "Owner bos kalan app sayisi sifir olmadan manual rollout checklist temiz sayilmaz.",
            ],
        },
        "upgradePlaybook": {
            "contractId": str(upgrade_contract.get("contract_id") or "ui-library-consumer-upgrade-contract-v1"),
            "contractPath": "docs/02-architecture/context/ui-library-consumer-upgrade.contract.v1.json",
            "defaultStrategy": str(upgrade_contract.get("default_strategy") or "manual-checklist"),
            "codemodSupport": str(upgrade_contract.get("codemod_support") or "planned"),
            "tracks": playbook_tracks,
            "summary": {
                "trackCount": len(playbook_tracks),
                "singleAppBlastRadiusCount": len(single_app_blast_radius),
                "crossAppReviewComponents": len(cross_app_review),
                "manualChecklistComponents": len(adopted_outside_lab_names),
                "codemodReadyComponents": len(codemod_candidate_items),
            },
        },
        "upgradeChecklist": {
            "artifactPath": "web/test-results/releases/ui-library/latest/ui-library-upgrade-checklist.v1.json",
            "generatedStrategy": str(upgrade_contract.get("default_strategy") or "manual-checklist"),
            "summary": {
                "totalItems": len(upgrade_checklist_items),
                "singleAppItems": int(change_class_counts.get("minor-single-app-review") or 0),
                "crossAppItems": int(change_class_counts.get("major-cross-app-review") or 0),
                "ownerMappedAppsCount": owner_mapped_apps_count,
            },
            "items": sorted(
                upgrade_checklist_items,
                key=lambda item: (-severity_rank.get(str(item.get("classId") or ""), -1), str(item.get("component") or "")),
            )[:16],
        },
        "upgradeRecipes": {
            "contractId": str(recipes_contract.get("contract_id") or "ui-library-consumer-upgrade-recipes-contract-v1"),
            "contractPath": "docs/02-architecture/context/ui-library-consumer-upgrade-recipes.contract.v1.json",
            "artifactPath": "web/test-results/releases/ui-library/latest/ui-library-upgrade-recipes.v1.json",
            "auditArtifactPath": str(
                recipes_contract.get("audit_artifact_path")
                or "web/test-results/releases/ui-library/latest/ui-library-upgrade-recipes.audit.v1.json"
            ),
            "candidateMode": str(recipes_contract.get("candidate_mode") or "dry-run-audit"),
            "auditScript": str(recipes_contract.get("audit_script") or "audit:ui-library-upgrade-recipes"),
            "summary": {
                "totalRecipes": len(upgrade_recipe_items),
                "singleAppRecipes": len(upgrade_recipe_items),
                "codemodCandidateCount": len(codemod_candidate_items),
                "dryRunReadyCandidates": len(upgrade_recipe_items),
                "manualOnlyRecipes": 0,
            },
            "items": sorted(
                upgrade_recipe_items,
                key=lambda item: str(item.get("component") or ""),
            ),
            "rules": [
                "Single-app backlog icin recipe satiri component, owner ve target file ile birlikte uretilir.",
                "Dry-run audit candidate'i recipe artefact'inin parcasi olarak release manifest'e baglanir.",
                "Actual write/codemod uygulamasi bu fazda otomatik yapilmaz; recipe ve audit sonucu onay girdisi uretir.",
            ],
            "evidenceRefs": [
                "docs/02-architecture/context/ui-library-consumer-upgrade-recipes.contract.v1.json",
                "web/test-results/releases/ui-library/latest/ui-library-upgrade-checklist.v1.json",
                "web/test-results/releases/ui-library/latest/ui-library-release-manifest.v1.json",
            ],
        },
        "codemodCandidates": {
            "contractId": str(codemod_contract.get("contract_id") or "ui-library-consumer-codemod-candidates-contract-v1"),
            "contractPath": "docs/02-architecture/context/ui-library-consumer-codemod-candidates.contract.v1.json",
            "artifactPath": str(
                codemod_contract.get("artifact_path")
                or "web/test-results/releases/ui-library/latest/ui-library-codemod-candidates.v1.json"
            ),
            "auditArtifactPath": str(
                codemod_contract.get("audit_artifact_path")
                or "web/test-results/releases/ui-library/latest/ui-library-codemod-candidates.audit.v1.json"
            ),
            "auditScript": str(codemod_contract.get("audit_script") or "audit:ui-library-codemod-candidates"),
            "transformEngine": str(codemod_contract.get("transform_engine") or "ts-morph-candidate"),
            "applyPolicy": str(codemod_contract.get("apply_policy") or "manual-approval-required"),
            "summary": {
                "totalCandidates": len(codemod_candidate_items),
                "dryRunReadyCandidates": len(codemod_candidate_items),
                "applyExecutorReadyCandidates": sum(1 for item in codemod_candidate_items if bool(item.get("applyExecutorIncluded"))),
                "manualReviewFirstCandidates": sum(1 for item in codemod_candidate_items if bool(item.get("manualReviewIncluded"))),
                "autoApplyReadyCandidates": sum(
                    1 for item in codemod_candidate_items if bool(item.get("applyReady"))
                ),
                "lowRiskCount": sum(1 for item in codemod_candidate_items if str(item.get("riskLevel") or "") == "low"),
                "mediumRiskCount": sum(
                    1 for item in codemod_candidate_items if str(item.get("riskLevel") or "") == "medium"
                ),
                "highRiskCount": sum(1 for item in codemod_candidate_items if str(item.get("riskLevel") or "") == "high"),
            },
            "dryRun": {
                "contractId": str(
                    dry_run_contract.get("contract_id")
                    or "ui-library-consumer-codemod-dry-run-contract-v1"
                ),
                "contractPath": "docs/02-architecture/context/ui-library-consumer-codemod-dry-run.contract.v1.json",
                "artifactPath": str(
                    dry_run_contract.get("artifact_path")
                    or "web/test-results/releases/ui-library/latest/ui-library-codemod-dry-run.v1.json"
                ),
                "auditArtifactPath": str(
                    dry_run_contract.get("audit_artifact_path")
                    or "web/test-results/releases/ui-library/latest/ui-library-codemod-dry-run.audit.v1.json"
                ),
                "runScript": str(dry_run_contract.get("run_script") or "run:ui-library-codemod-dry-run"),
                "auditScript": str(dry_run_contract.get("audit_script") or "audit:ui-library-codemod-dry-run"),
                "executionMode": str(dry_run_contract.get("execution_mode") or "illustrative-dry-run"),
                "summary": {
                    "focusCount": len(dry_run_focus_components),
                    "lowRiskFocusCount": sum(
                        1
                        for item in codemod_candidate_items
                        if bool(item.get("dryRunIncluded")) and str(item.get("riskLevel") or "") == "low"
                    ),
                    "prototypeReadyFocusCount": sum(
                        1
                        for item in codemod_candidate_items
                        if bool(item.get("dryRunIncluded")) and str(item.get("prototypeStatus") or "") == "ready"
                    ),
                    "activeCandidateCount": sum(1 for item in codemod_candidate_items if bool(item.get("dryRunIncluded"))),
                },
                "focusComponents": sorted(dry_run_focus_components),
                "rules": [
                    *[
                        str(rule).strip()
                        for rule in dry_run_contract.get("rules", [])
                        if str(rule).strip()
                    ][:4],
                ],
                "evidenceRefs": [
                    "docs/02-architecture/context/ui-library-consumer-codemod-dry-run.contract.v1.json",
                    "web/test-results/releases/ui-library/latest/ui-library-codemod-candidates.v1.json",
                    "web/test-results/releases/ui-library/latest/ui-library-codemod-dry-run.v1.json",
                    "web/test-results/releases/ui-library/latest/ui-library-release-manifest.v1.json",
                ],
                "applyPreview": {
                    "contractId": str(
                        apply_preview_contract.get("contract_id")
                        or "ui-library-consumer-codemod-apply-preview-contract-v1"
                    ),
                    "contractPath": "docs/02-architecture/context/ui-library-consumer-codemod-apply-preview.contract.v1.json",
                    "artifactPath": str(
                        apply_preview_contract.get("artifact_path")
                        or "web/test-results/releases/ui-library/latest/ui-library-codemod-apply-preview.v1.json"
                    ),
                    "auditArtifactPath": str(
                        apply_preview_contract.get("audit_artifact_path")
                        or "web/test-results/releases/ui-library/latest/ui-library-codemod-apply-preview.audit.v1.json"
                    ),
                    "runScript": str(
                        apply_preview_contract.get("run_script") or "run:ui-library-codemod-apply-preview"
                    ),
                    "auditScript": str(
                        apply_preview_contract.get("audit_script") or "audit:ui-library-codemod-apply-preview"
                    ),
                    "defaultWriteMode": str(
                        apply_preview_contract.get("default_write_mode") or "preview_only"
                    ),
                    "allowWriteFlag": str(apply_preview_contract.get("allow_write_flag") or "--write"),
                    "summary": {
                        "focusCount": len(apply_preview_focus_components),
                        "exactEligibleCandidateCount": int(
                            apply_preview_audit.get("exactEligibleCandidateCount") or 0
                        ),
                        "noopReadyCandidateCount": int(
                            apply_preview_audit.get("noopReadyCandidateCount") or 0
                        ),
                        "writeEnabledByDefault": False,
                    },
                    "focusComponents": sorted(apply_preview_focus_components),
                    "rules": [
                        *[
                            str(rule).strip()
                            for rule in apply_preview_contract.get("rules", [])
                            if str(rule).strip()
                        ][:4],
                    ],
                    "evidenceRefs": [
                        "docs/02-architecture/context/ui-library-consumer-codemod-apply-preview.contract.v1.json",
                        "web/test-results/releases/ui-library/latest/ui-library-codemod-dry-run.v1.json",
                        "web/test-results/releases/ui-library/latest/ui-library-codemod-apply-preview.v1.json",
                        "web/test-results/releases/ui-library/latest/ui-library-release-manifest.v1.json",
                    ],
                },
            },
            "applyExecutor": {
                "contractId": str(
                    apply_contract.get("contract_id")
                    or "ui-library-consumer-codemod-apply-contract-v1"
                ),
                "contractPath": "docs/02-architecture/context/ui-library-consumer-codemod-apply.contract.v1.json",
                "artifactPath": str(
                    apply_contract.get("artifact_path")
                    or "web/test-results/releases/ui-library/latest/ui-library-codemod-apply.v1.json"
                ),
                "auditArtifactPath": str(
                    apply_contract.get("audit_artifact_path")
                    or "web/test-results/releases/ui-library/latest/ui-library-codemod-apply.audit.v1.json"
                ),
                "runScript": str(
                    apply_contract.get("run_script") or "run:ui-library-codemod-apply"
                ),
                "auditScript": str(
                    apply_contract.get("audit_script") or "audit:ui-library-codemod-apply"
                ),
                "defaultWriteMode": str(
                    apply_contract.get("default_write_mode") or "write_requires_flag"
                ),
                "allowWriteFlag": str(apply_contract.get("allow_write_flag") or "--write"),
                "summary": {
                    "focusCount": len(apply_focus_components),
                    "readyToApplyCandidateCount": int(
                        apply_audit.get("readyToApplyCandidateCount") or 0
                    ),
                    "noopReadyCandidateCount": int(
                        apply_audit.get("noopReadyCandidateCount") or 0
                    ),
                    "writeEnabledByDefault": False,
                },
                "focusComponents": sorted(apply_focus_components),
                "rules": [
                    *[
                        str(rule).strip()
                        for rule in apply_contract.get("rules", [])
                        if str(rule).strip()
                    ][:4],
                ],
                "evidenceRefs": [
                    "docs/02-architecture/context/ui-library-consumer-codemod-apply.contract.v1.json",
                    "web/test-results/releases/ui-library/latest/ui-library-codemod-apply-preview.v1.json",
                    "web/test-results/releases/ui-library/latest/ui-library-codemod-apply.v1.json",
                    "web/test-results/releases/ui-library/latest/ui-library-release-manifest.v1.json",
                ],
            },
            "manualReview": {
                "contractId": str(
                    manual_review_contract.get("contract_id")
                    or "ui-library-consumer-codemod-manual-review-contract-v1"
                ),
                "contractPath": "docs/02-architecture/context/ui-library-consumer-codemod-manual-review.contract.v1.json",
                "artifactPath": str(
                    manual_review_contract.get("artifact_path")
                    or "web/test-results/releases/ui-library/latest/ui-library-codemod-manual-review.v1.json"
                ),
                "auditArtifactPath": str(
                    manual_review_contract.get("audit_artifact_path")
                    or "web/test-results/releases/ui-library/latest/ui-library-codemod-manual-review.audit.v1.json"
                ),
                "runScript": str(
                    manual_review_contract.get("run_script") or "run:ui-library-codemod-manual-review"
                ),
                "auditScript": str(
                    manual_review_contract.get("audit_script") or "audit:ui-library-codemod-manual-review"
                ),
                "reviewMode": str(
                    manual_review_contract.get("review_mode") or "manual-review-only"
                ),
                "reviewWriteEnabled": bool(manual_review_contract.get("review_write_enabled")),
                "approvalModel": str(
                    manual_review_contract.get("approval_model") or "single-owner-direct-approval"
                ),
                "decisionStateDefault": str(
                    manual_review_contract.get("decision_state_default") or "owner_review_pending"
                ),
                "summary": {
                    "focusCount": len(manual_review_focus_components),
                    "mediumRiskFocusCount": sum(
                        1
                        for item in codemod_candidate_items
                        if bool(item.get("manualReviewIncluded")) and str(item.get("riskLevel") or "") == "medium"
                    ),
                    "highRiskFocusCount": sum(
                        1
                        for item in codemod_candidate_items
                        if bool(item.get("manualReviewIncluded")) and str(item.get("riskLevel") or "") == "high"
                    ),
                    "readyPacketCount": int(manual_review_audit.get("passCount") or 0),
                    "readyForDecisionCount": int(manual_review_audit.get("readyForDecisionCount") or 0),
                    "pendingDecisionCount": int(manual_review_audit.get("pendingDecisionCount") or 0),
                    "singleOwnerApprovalCount": int(manual_review_audit.get("singleOwnerApprovalCount") or 0),
                    "generatedChecklistItemCount": int(manual_review_audit.get("generatedChecklistItemCount") or 0),
                },
                "focusComponents": sorted(manual_review_focus_components),
                "decisions": {
                    "contractId": str(
                        manual_decision_contract.get("contract_id")
                        or "ui-library-consumer-codemod-manual-decision-contract-v1"
                    ),
                    "contractPath": "docs/02-architecture/context/ui-library-consumer-codemod-manual-decision.contract.v1.json",
                    "artifactPath": str(
                        manual_decision_contract.get("artifact_path")
                        or "web/test-results/releases/ui-library/latest/ui-library-codemod-manual-review-decisions.v1.json"
                    ),
                    "auditArtifactPath": str(
                        manual_decision_contract.get("audit_artifact_path")
                        or "web/test-results/releases/ui-library/latest/ui-library-codemod-manual-review-decisions.audit.v1.json"
                    ),
                    "runScript": str(
                        manual_decision_contract.get("run_script") or "run:ui-library-codemod-manual-review-decisions"
                    ),
                    "auditScript": str(
                        manual_decision_contract.get("audit_script") or "audit:ui-library-codemod-manual-review-decisions"
                    ),
                    "decisionMode": str(
                        manual_decision_contract.get("decision_mode") or "single-owner-direct-approval"
                    ),
                    "allowedDecisions": [
                        str(entry).strip()
                        for entry in manual_decision_contract.get("allowed_decisions", [])
                        if str(entry).strip()
                    ],
                    "summary": {
                        "focusCount": len(manual_decision_focus_components),
                        "recordedDecisionCount": int(
                            manual_decision_audit.get("passCount")
                            or sum(
                                1
                                for entry in manual_decision_plan
                                if str(entry.get("decision") or "").strip()
                            )
                        ),
                        "approvedForApplyPreviewCount": sum(
                            1
                            for entry in manual_decision_plan
                            if str(entry.get("decision") or "").strip() == "approved_for_apply_preview"
                        ),
                        "deferredUntilVisualReviewCount": sum(
                            1
                            for entry in manual_decision_plan
                            if str(entry.get("decision") or "").strip() == "deferred_until_visual_review"
                        ),
                        "reviewOnlyManualRefactorCount": sum(
                            1
                            for entry in manual_decision_plan
                            if str(entry.get("decision") or "").strip() == "review_only_manual_refactor"
                        ),
                        "rejectedForAutoApplyCount": sum(
                            1
                            for entry in manual_decision_plan
                            if str(entry.get("decision") or "").strip() == "rejected_for_auto_apply"
                        ),
                        "pendingDecisionCount": int(manual_decision_audit.get("pendingDecisionCount") or 0),
                    },
                    "focusComponents": sorted(manual_decision_focus_components),
                    "rules": [
                        *[
                            str(rule).strip()
                            for rule in manual_decision_contract.get("rules", [])
                            if str(rule).strip()
                        ][:4],
                    ],
                    "evidenceRefs": [
                        "docs/02-architecture/context/ui-library-consumer-codemod-manual-decision.contract.v1.json",
                        "web/test-results/releases/ui-library/latest/ui-library-codemod-manual-review.v1.json",
                        "web/test-results/releases/ui-library/latest/ui-library-codemod-manual-review-decisions.v1.json",
                        "web/test-results/releases/ui-library/latest/ui-library-release-manifest.v1.json",
                    ],
                    "latestAudit": {
                        "generatedAt": manual_decision_audit.get("generatedAt"),
                        "candidateCount": int(manual_decision_audit.get("candidateCount") or 0),
                        "passCount": int(manual_decision_audit.get("passCount") or 0),
                        "failCount": int(manual_decision_audit.get("failCount") or 0),
                        "approvedForApplyPreviewCount": int(
                            manual_decision_audit.get("approvedForApplyPreviewCount") or 0
                        ),
                        "deferredUntilVisualReviewCount": int(
                            manual_decision_audit.get("deferredUntilVisualReviewCount") or 0
                        ),
                        "reviewOnlyManualRefactorCount": int(
                            manual_decision_audit.get("reviewOnlyManualRefactorCount") or 0
                        ),
                        "rejectedForAutoApplyCount": int(
                            manual_decision_audit.get("rejectedForAutoApplyCount") or 0
                        ),
                        "pendingDecisionCount": int(manual_decision_audit.get("pendingDecisionCount") or 0),
                    },
                },
                "rules": [
                    *[
                        str(rule).strip()
                        for rule in manual_review_contract.get("rules", [])
                        if str(rule).strip()
                    ][:4],
                ],
                "evidenceRefs": [
                    "docs/02-architecture/context/ui-library-consumer-codemod-manual-review.contract.v1.json",
                    "web/test-results/releases/ui-library/latest/ui-library-codemod-candidates.v1.json",
                    "web/test-results/releases/ui-library/latest/ui-library-codemod-manual-review.v1.json",
                    "web/test-results/releases/ui-library/latest/ui-library-release-manifest.v1.json",
                ],
            },
            "items": sorted(
                codemod_candidate_items,
                key=lambda item: (str(item.get("riskLevel") or ""), str(item.get("component") or "")),
            ),
            "rules": [
                *[
                    str(rule).strip()
                    for rule in codemod_contract.get("rules", [])
                    if str(rule).strip()
                ][:4],
            ],
            "prototypes": {
                "contractId": str(
                    prototype_contract.get("contract_id")
                    or "ui-library-consumer-codemod-prototypes-contract-v1"
                ),
                "contractPath": "docs/02-architecture/context/ui-library-consumer-codemod-prototypes.contract.v1.json",
                "sourceDir": prototype_source_dir,
                "artifactPath": str(
                    prototype_contract.get("artifact_path")
                    or "web/test-results/releases/ui-library/latest/ui-library-codemod-prototypes.v1.json"
                ),
                "auditArtifactPath": str(
                    prototype_contract.get("audit_artifact_path")
                    or "web/test-results/releases/ui-library/latest/ui-library-codemod-prototypes.audit.v1.json"
                ),
                "auditScript": str(prototype_contract.get("audit_script") or "audit:ui-library-codemod-prototypes"),
                "focusComponents": sorted(
                    {
                        str(entry).strip()
                        for entry in prototype_contract.get("focus_components", [])
                        if str(entry).strip()
                    }
                ),
                "summary": {
                    "focusCount": len(
                        {
                            str(entry).strip()
                            for entry in prototype_contract.get("focus_components", [])
                            if str(entry).strip()
                        }
                    ),
                    "prototypeCount": sum(
                        1
                        for item in codemod_candidate_items
                        if str(item.get("component") or "").strip()
                        in {
                            str(entry).strip()
                            for entry in prototype_contract.get("focus_components", [])
                            if str(entry).strip()
                        }
                    ),
                    "readyCount": sum(
                        1
                        for item in codemod_candidate_items
                        if str(item.get("component") or "").strip()
                        in {
                            str(entry).strip()
                            for entry in prototype_contract.get("focus_components", [])
                            if str(entry).strip()
                        }
                        and str(item.get("prototypeStatus") or "") == "ready"
                    ),
                    "missingCount": max(
                        len(
                            {
                                str(entry).strip()
                                for entry in prototype_contract.get("focus_components", [])
                                if str(entry).strip()
                            }
                        )
                        - sum(
                            1
                            for item in codemod_candidate_items
                            if str(item.get("component") or "").strip()
                            in {
                                str(entry).strip()
                                for entry in prototype_contract.get("focus_components", [])
                                if str(entry).strip()
                            }
                            and str(item.get("prototypeStatus") or "") == "ready"
                        ),
                        0,
                    ),
                    "illustrativePreviewCount": sum(
                        1
                        for item in codemod_candidate_items
                        if str(item.get("component") or "").strip()
                        in {
                            str(entry).strip()
                            for entry in prototype_contract.get("focus_components", [])
                            if str(entry).strip()
                        }
                        and str(item.get("prototypeReviewMode") or "") == "illustrative-dry-run"
                    ),
                },
                "items": [
                    build_codemod_prototype_summary_item(item)
                    for item in sorted(
                        codemod_candidate_items,
                        key=lambda item: (str(item.get("riskLevel") or ""), str(item.get("component") or "")),
                    )
                    if str(item.get("component") or "").strip()
                    in {
                        str(entry).strip()
                        for entry in prototype_contract.get("focus_components", [])
                        if str(entry).strip()
                    }
                ],
                "rules": [
                    *[
                        str(rule).strip()
                        for rule in prototype_contract.get("rules", [])
                        if str(rule).strip()
                    ][:4],
                ],
                "evidenceRefs": [
                    "docs/02-architecture/context/ui-library-consumer-codemod-prototypes.contract.v1.json",
                    "web/test-results/releases/ui-library/latest/ui-library-codemod-candidates.v1.json",
                    "web/test-results/releases/ui-library/latest/ui-library-release-manifest.v1.json",
                ],
            },
            "evidenceRefs": [
                "docs/02-architecture/context/ui-library-consumer-codemod-candidates.contract.v1.json",
                "docs/02-architecture/context/ui-library-consumer-codemod-prototypes.contract.v1.json",
                "web/test-results/releases/ui-library/latest/ui-library-upgrade-recipes.v1.json",
                "web/test-results/releases/ui-library/latest/ui-library-release-manifest.v1.json",
            ],
        },
        "semverGuidance": {
            "recommendedBump": recommended_bump,
            "reason": semver_reason,
            "releaseNotesLabel": f"{recommended_bump}-review",
            "summary": {
                "patchSafeLabOnly": int(change_class_counts.get("patch-safe-lab-only") or 0),
                "minorSingleAppReview": int(change_class_counts.get("minor-single-app-review") or 0),
                "minorBetaExternalReview": int(change_class_counts.get("minor-beta-external-review") or 0),
                "majorCrossAppReview": int(change_class_counts.get("major-cross-app-review") or 0),
            },
            "majorComponents": sorted(name for name in cross_app_review if name)[:8],
            "minorComponents": sorted({*single_app_blast_radius, *beta_used_outside_lab})[:8],
            "patchCandidates": sorted(name for name in stable_only_design_lab if name)[:8],
        },
        "changeClasses": {
            "summary": {
                "patchSafeLabOnly": int(change_class_counts.get("patch-safe-lab-only") or 0),
                "minorSingleAppReview": int(change_class_counts.get("minor-single-app-review") or 0),
                "minorBetaExternalReview": int(change_class_counts.get("minor-beta-external-review") or 0),
                "majorCrossAppReview": int(change_class_counts.get("major-cross-app-review") or 0),
                "manualReviewRequired": len(adopted_outside_lab_names),
            },
            "components": sorted(
                change_class_items,
                key=lambda item: (-severity_rank.get(str(item.get("classId") or ""), -1), str(item.get("name") or "")),
            )[:16],
        },
        "consumerApps": consumer_apps,
        "priorityBacklog": {
            "betaUsedOutsideLab": sorted(name for name in beta_used_outside_lab if name)[:8],
            "adoptedWithoutStory": sorted(name for name in adopted_without_story if name)[:8],
            "stableOnlyInDesignLab": sorted(name for name in stable_only_design_lab if name)[:8],
            "singleAppBlastRadius": sorted(name for name in single_app_blast_radius if name)[:8],
        },
        "rules": [
            "Public surface degisiklikleri, Design Lab disi tuketici uygulama etkisi ile birlikte okunur.",
            "Stable ama yalniz Design Lab icinde kalan componentler, genis rollout oncesi adoption backlog adayi sayilir.",
            "Dis uygulamalarda kullanilan beta surface, release cockpit'te gorunur tutulur.",
            "Adopted componentler icin visual story coverage, rollout guveninin parcasi kabul edilir.",
            "Single-app blast radius backlog'u upgrade playbook icinde gorunur tutulur.",
            "Owner registry ve CODEOWNERS fallback bilgisi, consumer impact artefact'i ile ayni release turunda tasinir.",
        ],
        "evidenceRefs": [
            "docs/02-architecture/context/ui-library-consumer-upgrade.contract.v1.json",
            "docs/02-architecture/context/ui-library-consumer-owner-registry.v1.json",
            "docs/04-operations/RUNBOOKS/RB-ui-library-consumer-upgrade.md",
            ".github/CODEOWNERS",
            "packages/design-system/src/catalog/component-manifest.v1.json",
            "web/apps/mfe-shell/src/pages/admin/design-lab.index.json",
            "web/test-results/releases/ui-library/latest/ui-library-release-manifest.v1.json",
        ],
    }
