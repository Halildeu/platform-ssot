#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import os
import re
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional, Set, TypedDict
from zoneinfo import ZoneInfo


TR_TZ = ZoneInfo("Europe/Istanbul")


def now_tr() -> datetime:
    return datetime.now(TR_TZ)


def format_ts(dt: datetime) -> str:
    return dt.isoformat(timespec="seconds")


def format_ts_utc(dt: datetime) -> str:
    return dt.astimezone(timezone.utc).isoformat(timespec="seconds")


def resolve_module_path(from_path: Path, module_path: str) -> Optional[Path]:
    if not module_path.startswith("."):
        return None

    candidate_base = (from_path.parent / module_path).resolve()
    candidates = [
        candidate_base.with_suffix(".ts"),
        candidate_base.with_suffix(".tsx"),
        candidate_base.with_suffix(".js"),
        candidate_base.with_suffix(".jsx"),
        candidate_base / "index.ts",
        candidate_base / "index.tsx",
        candidate_base / "index.js",
        candidate_base / "index.jsx",
    ]

    for candidate in candidates:
        if candidate.is_file():
            return candidate

    return None


EXPORT_VALUE_RE = re.compile(
    r"export\s+(?:const|function|class)\s+([A-Za-z_][A-Za-z0-9_]*)",
    flags=re.MULTILINE,
)
EXPORT_STAR_FROM_RE = re.compile(
    r"export\s+\*\s+from\s+['\"]([^'\"]+)['\"]",
    flags=re.MULTILINE,
)
EXPORT_NAMED_FROM_RE = re.compile(
    r"export\s+{([^}]+)}\s+from\s+['\"]([^'\"]+)['\"]",
    flags=re.MULTILINE | re.DOTALL,
)
EXPORT_NAMED_RE = re.compile(
    r"export\s+{([^}]+)}\s*;",
    flags=re.MULTILINE | re.DOTALL,
)


def parse_named_exports(spec: str) -> Set[str]:
    names: Set[str] = set()
    for raw_part in spec.split(","):
        part = raw_part.strip()
        if not part:
            continue
        if part.startswith("type "):
            continue
        if part.startswith("typeof "):
            continue
        part = re.sub(r"^(type|interface)\s+", "", part).strip()
        if not part:
            continue
        if " as " in part:
            original, alias = [segment.strip() for segment in part.split(" as ", 1)]
            if original:
                names.add(original)
            if alias:
                names.add(alias)
        else:
            names.add(part)
    return names


def collect_runtime_exports(entry_file: Path, visited: Set[Path]) -> Set[str]:
    if entry_file in visited:
        return set()
    visited.add(entry_file)

    try:
        content = entry_file.read_text(encoding="utf-8")
    except Exception:
        return set()

    exports: Set[str] = set(EXPORT_VALUE_RE.findall(content))

    for match in EXPORT_NAMED_FROM_RE.finditer(content):
        exports |= parse_named_exports(match.group(1))

    for match in EXPORT_NAMED_RE.finditer(content):
        exports |= parse_named_exports(match.group(1))

    for match in EXPORT_STAR_FROM_RE.finditer(content):
        target = resolve_module_path(entry_file, match.group(1))
        if target is None:
            continue
        exports |= collect_runtime_exports(target, visited)

    return exports


IMPORT_FROM_UI_KIT_RE = re.compile(
    r"import\s+(?:type\s+)?{([^}]+)}\s+from\s+['\"]mfe-ui-kit['\"]",
    flags=re.MULTILINE | re.DOTALL,
)


def collect_ui_kit_import_usage(
    web_root: Path, exported_names: Set[str]
) -> dict[str, Set[str]]:
    apps_root = web_root / "apps"
    usage: dict[str, Set[str]] = {}

    for file_path in apps_root.rglob("*"):
        if not file_path.is_file():
            continue
        if file_path.suffix not in {".ts", ".tsx", ".js", ".jsx"}:
            continue
        if any(part in {"node_modules", "dist", "build"} for part in file_path.parts):
            continue

        try:
            content = file_path.read_text(encoding="utf-8", errors="ignore")
        except Exception:
            continue

        for match in IMPORT_FROM_UI_KIT_RE.finditer(content):
            spec = match.group(1)
            for raw_part in spec.split(","):
                part = raw_part.strip()
                if not part:
                    continue
                part = part.split("//", 1)[0].strip()
                if part.startswith("type "):
                    part = part[len("type ") :].strip()
                if not part:
                    continue

                if " as " in part:
                    name, _alias = [segment.strip() for segment in part.split(" as ", 1)]
                else:
                    name = part

                if name not in exported_names:
                    continue

                relative_to_repo = file_path.relative_to(web_root.parent).as_posix()
                usage.setdefault(name, set()).add(relative_to_repo)

    return usage


class DesignLabGroupsSubgroup(TypedDict):
    id: str
    label: str


class DesignLabGroupsGroup(TypedDict):
    id: str
    label: str
    subgroups: list[DesignLabGroupsSubgroup]


class DesignLabGroupsFallback(TypedDict):
    group: str
    subgroup: str


class DesignLabGroups(TypedDict):
    version: int
    fallback: DesignLabGroupsFallback
    groups: list[DesignLabGroupsGroup]


class DesignLabOverrideEntry(TypedDict, total=False):
    group: str
    subgroup: str
    tags: list[str]


class DesignLabOverrides(TypedDict):
    version: int
    overrides: dict[str, DesignLabOverrideEntry]


class DesignLabIndexItem(TypedDict, total=False):
    name: str
    kind: str
    importStatement: str
    whereUsed: list[str]
    group: str
    subgroup: str
    tags: list[str]


def classify_kind(name: str) -> str:
    if re.match(r"^[A-Z0-9_]+$", name) and "_" in name:
        return "const"
    if re.match(r"^use[A-Z0-9_]", name):
        return "hook"
    if re.match(r"^[A-Z][A-Za-z0-9]*$", name):
        return "component"
    return "function"


def load_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def merge_curated_metadata(existing: dict, generated: dict) -> dict:
    # Curated release, recipe and preset metadata should survive repeated index
    # regeneration. Generated summary/adoption fields stay canonical here.
    preserved = {
        key: value
        for key, value in existing.items()
        if key
        not in {
            "generatedAt",
            "generatedAtUtc",
            "items",
            "source",
            "summary",
            "adoption",
            "migration",
            "visualRegression",
        }
    }
    merged = {
        **preserved,
        **generated,
    }
    existing_source = existing.get("source")
    generated_source = generated.get("source")
    if isinstance(existing_source, dict) and isinstance(generated_source, dict):
        merged["source"] = {
            **existing_source,
            **generated_source,
        }
    release = merged.get("release")
    adoption = generated.get("adoption")
    if isinstance(release, dict) and isinstance(adoption, dict):
        surface_summary = adoption.get("surfaceSummary")
        api_coverage = adoption.get("apiCoverage")
        if isinstance(surface_summary, dict) and isinstance(api_coverage, dict):
            release["registrySummary"] = {
                "stable": int(surface_summary.get("stableExports") or 0),
                "beta": int(surface_summary.get("betaExports") or 0),
                "apiCatalogItems": int(api_coverage.get("documentedExports") or 0),
            }
    return merged


def sync_release_metadata(index: dict, manifest: dict, web_root: Path) -> dict:
    release = index.get("release")
    summary = manifest.get("summary")
    adoption = manifest.get("adoption")
    migration = manifest.get("migration")
    visual_regression = manifest.get("visualRegression")
    if not isinstance(release, dict) or not isinstance(summary, dict) or not isinstance(adoption, dict):
        return index

    surface_summary = adoption.get("surfaceSummary")
    api_coverage = adoption.get("apiCoverage")
    release_readiness = adoption.get("releaseReadiness")
    latest_release = release.get("latestRelease")
    if not isinstance(surface_summary, dict) or not isinstance(api_coverage, dict):
        return index

    contract_path = web_root.parent / str(release.get("contractPath") or "").strip()
    if contract_path.is_file():
        try:
            contract = load_json(contract_path)
            required_scripts = contract.get("required_scripts")
            if isinstance(required_scripts, list):
                release["requiredScripts"] = [str(item).strip() for item in required_scripts if str(item).strip()]
        except Exception:
            pass

    release["registrySummary"] = {
        "stable": int(surface_summary.get("stableExports") or 0),
        "beta": int(surface_summary.get("betaExports") or 0),
        "apiCatalogItems": int(api_coverage.get("documentedExports") or 0),
    }

    if not isinstance(latest_release, dict):
        return index

    visual_summary = visual_regression.get("summary") if isinstance(visual_regression, dict) else {}
    catalog_metrics = {
        "exported": int(summary.get("exported") or 0),
        "planned": int(summary.get("planned") or 0),
        "stable": int(surface_summary.get("stableExports") or 0),
        "beta": int(surface_summary.get("betaExports") or 0),
        "liveDemo": int(summary.get("liveDemo") or 0),
        "apiCatalogItems": int(api_coverage.get("documentedExports") or 0),
        "apiCoveragePercent": int(api_coverage.get("coveragePercent") or 0),
        "wideAdoptionReady": int(
            release_readiness.get("wideAdoptionReady") if isinstance(release_readiness, dict) else 0
        ),
        "requiredVisualHarnesses": int(
            visual_summary.get("requiredHarnessPresentCount") if isinstance(visual_summary, dict) else 0
        ),
        "storyCoveredComponents": int(
            visual_summary.get("storybookCoveredComponents") if isinstance(visual_summary, dict) else 0
        ),
    }
    if isinstance(migration, dict):
        migration_summary = migration.get("summary")
        if isinstance(migration_summary, dict):
            catalog_metrics["adoptedOutsideLab"] = int(migration_summary.get("adoptedOutsideLabComponents") or 0)
            catalog_metrics["consumerAppsCount"] = int(migration_summary.get("consumerAppsCount") or 0)
            catalog_metrics["adoptedStoryCoveragePercent"] = int(
                migration_summary.get("adoptedStoryCoveragePercent") or 0
            )
            catalog_metrics["singleAppBlastRadiusCount"] = int(
                migration_summary.get("singleAppBlastRadiusCount") or 0
            )
            catalog_metrics["crossAppReviewComponents"] = int(
                migration_summary.get("crossAppReviewComponents") or 0
            )
            catalog_metrics["manualReviewRequiredComponents"] = int(
                migration_summary.get("manualReviewRequiredComponents") or 0
            )
        upgrade_recipes = migration.get("upgradeRecipes")
        if isinstance(upgrade_recipes, dict):
            recipe_summary = upgrade_recipes.get("summary")
            if isinstance(recipe_summary, dict):
                catalog_metrics["upgradeRecipes"] = int(recipe_summary.get("totalRecipes") or 0)
                catalog_metrics["codemodCandidateCount"] = int(recipe_summary.get("codemodCandidateCount") or 0)
    latest_release["catalogMetrics"] = catalog_metrics
    latest_release["lifecycleChanges"] = (
        "exported=%d, planned=%d; stable=%d, beta=%d; apiCatalog=%d/%d; "
        "liveDemo=%d; visualHarness=%d; storyCovered=%d; wideAdoptionReady=%d; adopted=%d across %d apps; "
        "singleApp=%d; crossApp=%d; manualReview=%d; recipes=%d; codemodCandidates=%d"
        % (
            catalog_metrics["exported"],
            catalog_metrics["planned"],
            catalog_metrics["stable"],
            catalog_metrics["beta"],
            catalog_metrics["apiCatalogItems"],
            max(catalog_metrics["exported"], 1),
            catalog_metrics["liveDemo"],
            catalog_metrics["requiredVisualHarnesses"],
            catalog_metrics["storyCoveredComponents"],
            catalog_metrics["wideAdoptionReady"],
            int(catalog_metrics.get("adoptedOutsideLab") or 0),
            int(catalog_metrics.get("consumerAppsCount") or 0),
            int(catalog_metrics.get("singleAppBlastRadiusCount") or 0),
            int(catalog_metrics.get("crossAppReviewComponents") or 0),
            int(catalog_metrics.get("manualReviewRequiredComponents") or 0),
            int(catalog_metrics.get("upgradeRecipes") or 0),
            int(catalog_metrics.get("codemodCandidateCount") or 0),
        )
    )
    return index


def build_groups_lookup(groups: DesignLabGroups) -> set[tuple[str, str]]:
    valid_pairs: set[tuple[str, str]] = set()
    for group in groups["groups"]:
        for subgroup in group.get("subgroups", []):
            valid_pairs.add((group["id"], subgroup["id"]))
    return valid_pairs


def resolve_group_for_origin(origin: str) -> tuple[str, str] | None:
    origin_map: dict[str, tuple[str, str]] = {
        "./components/Button": ("actions", "buttons"),
        "./components/Badge": ("feedback", "badges"),
        "./components/Tooltip": ("feedback", "tooltips"),
        "./components/Select": ("forms", "select"),
        "./components/Dropdown": ("forms", "dropdown"),
        "./components/Modal": ("overlays", "modal"),
        "./components/Tag": ("feedback", "tags"),
        "./components/Empty": ("empty-states", "empty"),
        "./components/Text": ("content", "text"),
        "./components/theme/ThemePreviewCard": ("theme", "preview"),
        "./layout/PageLayout": ("layout", "page"),
        "./layout/FilterBar": ("layout", "filters"),
        "./layout/ReportFilterPanel": ("layout", "filters"),
        "./layout/DetailDrawer": ("overlays", "drawers"),
        "./layout/FormDrawer": ("overlays", "drawers"),
        "./layout/AgGridServer": ("data-grid", "ag-grid-server"),
        "./components/entity-grid": ("data-grid", "entity-grid"),
        "./lib/grid-variants": ("data-grid", "variants"),
        "./runtime/theme-controller": ("theme", "runtime"),
        "./runtime/theme-contract": ("theme", "runtime"),
        "./runtime/access-controller": ("runtime", "access"),
        "./lib/auth/token-resolver": ("runtime", "auth"),
    }
    return origin_map.get(origin)


def resolve_group_for_item(
    *,
    name: str,
    origin: str | None,
    groups: DesignLabGroups,
    overrides: DesignLabOverrides,
    valid_pairs: set[tuple[str, str]],
) -> tuple[str, str, list[str]]:
    tags: list[str] = []
    override_entry = overrides.get("overrides", {}).get(name)
    if override_entry:
        group = override_entry.get("group")
        subgroup = override_entry.get("subgroup")
        tags.extend(override_entry.get("tags", []))
        if group and subgroup:
            if (group, subgroup) not in valid_pairs:
                raise SystemExit(
                    f"[designlab:index] invalid override group/subgroup for {name}: {group}/{subgroup}"
                )
            return group, subgroup, tags

    if origin:
        resolved = resolve_group_for_origin(origin)
        if resolved and resolved in valid_pairs:
            return resolved[0], resolved[1], tags

    fallback = groups["fallback"]
    group = fallback["group"]
    subgroup = fallback["subgroup"]
    if (group, subgroup) not in valid_pairs:
        raise SystemExit(f"[designlab:index] invalid fallback group/subgroup: {group}/{subgroup}")
    tags.append("unclassified")
    return group, subgroup, tags


def percent(part: int, total: int) -> int:
    if total <= 0:
        return 0
    return round((part / total) * 100)


def relative_to_repo(path: Path, web_root: Path) -> str:
    return path.relative_to(web_root.parent).as_posix()


def read_text_if_exists(path: Path) -> str:
    try:
        return path.read_text(encoding="utf-8", errors="ignore")
    except Exception:
        return ""


def load_optional_json(path: Path) -> dict:
    if not path.is_file():
        return {}
    try:
        return load_json(path)
    except Exception:
        return {}


def normalize_owner_handles(raw: object) -> list[str]:
    if isinstance(raw, str):
        owner = raw.strip()
        return [owner] if owner else []
    if not isinstance(raw, list):
        return []
    normalized = sorted(
        {
            str(item).strip()
            for item in raw
            if str(item).strip()
        }
    )
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


def collect_component_file_mentions(
    web_root: Path,
    component_names: set[str],
    source_paths: list[Path],
) -> dict[str, list[str]]:
    coverage: dict[str, set[str]] = {name: set() for name in component_names}
    for source_path in source_paths:
        content = read_text_if_exists(source_path)
        if not content:
            continue
        relative_path = relative_to_repo(source_path, web_root)
        for name in component_names:
            pattern = rf"(?<![A-Za-z0-9_]){re.escape(name)}(?![A-Za-z0-9_])"
            if re.search(pattern, content):
                coverage.setdefault(name, set()).add(relative_path)
    return {
        name: sorted(paths)
        for name, paths in coverage.items()
        if paths
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
        "packageImport": "import { Button } from 'mfe-ui-kit';",
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
            "privateEntryPath": "packages/ui-kit/src/catalog/design-lab-internals.ts",
            "allowedConsumers": ["apps/mfe-shell/src/pages/admin/DesignLabPage.tsx"],
            "runtimeExportsWithoutRegistry": len(diagnostics.get("runtimeExportsWithoutRegistry", [])),
        },
        "priorityBacklog": {
            "usedUndocumented": sorted(name for name in used_undocumented if name)[:8],
            "stableUndocumented": sorted(name for name in stable_undocumented if name)[:8],
            "betaUndocumented": sorted(name for name in beta_undocumented if name)[:8],
        },
        "consumerRules": [
            "Yeni ekranlar once recipe ailesi ile cozulur; page-level custom UI son tercihtir.",
            "Public tuketim yalniz 'mfe-ui-kit' package import veya resmi module federation expose yuzeyi ile yapilir.",
            "Release-ready yuzey stable lifecycle ve API katalog dokumani ile birlikte dusunulur.",
            "Design Lab ic primitifleri public surface yerine private barrel altinda tutulur.",
        ],
        "evidenceRefs": [
            "packages/ui-kit/src/catalog/component-manifest.v1.json",
            "packages/ui-kit/src/index.ts",
            "docs/02-architecture/context/ui-library-adoption-enforcement.contract.v1.json",
        ],
    }


def build_visual_regression_summary(web_root: Path, manifest_items: list[dict]) -> tuple[dict, dict[str, set[str]]]:
    story_root = web_root / "stories"
    docs_root = web_root / "docs"
    story_files = sorted(story_root.glob("*.stories.ts")) + sorted(story_root.glob("*.stories.tsx"))
    mdx_docs = sorted(story_root.glob("*.mdx")) + sorted(docs_root.rglob("*.stories.mdx"))
    required_harness_paths = [
        "web/stories/Button.stories.ts",
        "web/stories/AccessModals.stories.tsx",
        "web/stories/DataLiveDemoFoundations.stories.tsx",
        "web/stories/GridSurfaceFoundations.stories.tsx",
        "web/stories/InteractiveLiveDemoFoundations.stories.tsx",
        "web/stories/LiveDemoFoundations.stories.tsx",
        "web/stories/PageLayoutReporting.stories.tsx",
        "web/stories/ReportingLayout.stories.tsx",
        "web/stories/RuntimeThemeMatrix.stories.tsx",
        "web/stories/StableSurfacePatterns.stories.tsx",
        "web/stories/ThemePresetFoundations.stories.tsx",
        "web/stories/UiKitReleaseMatrix.stories.tsx",
        "web/stories/UtilityLiveDemoFoundations.stories.tsx",
        "web/docs/theme/theme-tokens.stories.mdx",
    ]
    required_harnesses = []
    for relative_path in required_harness_paths:
        required_harnesses.append(
            {
                "path": relative_path,
                "present": (web_root.parent / relative_path).is_file(),
            }
        )

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
    component_names = {
        str(item.get("name") or "").strip()
        for item in component_items
        if str(item.get("name") or "").strip()
    }
    story_mentions = collect_component_file_mentions(web_root, component_names, story_files)
    mdx_mentions = collect_component_file_mentions(web_root, component_names, mdx_docs)
    story_covered_names = set(story_mentions.keys())
    mdx_covered_names = set(mdx_mentions.keys())
    combined_covered_names = story_covered_names | mdx_covered_names
    stable_component_names = {
        str(item.get("name") or "").strip()
        for item in component_items
        if item.get("lifecycle") == "stable"
    }
    live_demo_component_names = {
        str(item.get("name") or "").strip()
        for item in component_items
        if item.get("demoMode") == "live"
    }
    adopted_outside_lab_names: set[str] = set()
    design_lab_path = "web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx"
    for item in component_items:
        name = str(item.get("name") or "").strip()
        where_used = [str(entry).strip() for entry in item.get("whereUsed", []) if str(entry).strip()]
        external_usage = [entry for entry in where_used if entry != design_lab_path]
        if external_usage:
            adopted_outside_lab_names.add(name)

    review_contract_path = web_root.parent / "docs/02-architecture/context/ui-library-visual-review.contract.v1.json"
    review_contract = load_optional_json(review_contract_path)
    review_secret_env_var = str(review_contract.get("secret_env_var") or "CHROMATIC_PROJECT_TOKEN").strip()
    review_secret_ready = bool(review_secret_env_var and os.environ.get(review_secret_env_var))
    review_mode = (
        str(review_contract.get("review_mode_when_secret_present") or "hosted_review")
        if review_secret_ready
        else str(review_contract.get("review_mode_when_secret_missing") or "artifact_only")
    )

    visual_regression = {
        "contractId": "ui-library-visual-regression-contract-v1",
        "storybook": {
            "configPath": "web/.storybook/main.ts",
            "previewPath": "web/.storybook/preview.ts",
            "buildConfigPath": "web/storybook.config.mjs",
            "buildCommand": "npm -C web run build-storybook",
            "chromaticCommand": "npm -C web run chromatic",
            "chromaticTriggerPath": "web/stories/_chromatic-trigger.ts",
            "staticOutputPath": "web/storybook-static/index.html",
            "performanceHints": "disabled-for-docs-build",
            "performanceBudgetOwner": "app-and-package-bundle-gates",
        },
        "reviewChannel": {
            "provider": str(review_contract.get("provider") or "chromatic"),
            "configured": bool(review_contract),
            "contractPath": relative_to_repo(review_contract_path, web_root),
            "reviewScript": str(review_contract.get("review_script") or "chromatic"),
            "storybookBuildScript": str(review_contract.get("storybook_build_script") or "build-storybook"),
            "secretEnvVar": review_secret_env_var,
            "secretReady": review_secret_ready,
            "reviewMode": review_mode,
            "fallbackMode": str(review_contract.get("review_mode_when_secret_missing") or "artifact_only"),
            "staticArtifactPath": str(review_contract.get("storybook_static_path") or "web/storybook-static/index.html"),
            "chromaticTriggerPath": str(review_contract.get("chromatic_trigger_path") or "web/stories/_chromatic-trigger.ts"),
        },
        "summary": {
            "designLabLiveDemoExports": sum(
                1 for item in index_items if item.get("demoMode") == "live"
            ),
            "storybookStoryFiles": len(story_files),
            "mdxDocFiles": len(mdx_docs),
            "requiredHarnessCount": len(required_harnesses),
            "requiredHarnessPresentCount": sum(1 for harness in required_harnesses if harness["present"]),
            "visualizableComponents": len(component_names),
            "storybookCoveredComponents": len(story_covered_names),
            "mdxCoveredComponents": len(mdx_covered_names),
            "combinedCoveredComponents": len(combined_covered_names),
            "storyCoveragePercent": percent(len(story_covered_names), len(component_names)),
            "releaseReadyComponents": len(stable_component_names),
            "releaseReadyStoryCoveredComponents": len(stable_component_names & story_covered_names),
            "releaseReadyCoveragePercent": percent(
                len(stable_component_names & story_covered_names),
                len(stable_component_names),
            ),
            "adoptedOutsideLabComponents": len(adopted_outside_lab_names),
            "adoptedStoryCoveredComponents": len(adopted_outside_lab_names & story_covered_names),
            "adoptedCoveragePercent": percent(
                len(adopted_outside_lab_names & story_covered_names),
                len(adopted_outside_lab_names),
            ),
        },
        "requiredHarnesses": required_harnesses,
        "coverageBacklog": {
            "stableWithoutStory": sorted(stable_component_names - story_covered_names)[:8],
            "adoptedWithoutStory": sorted(adopted_outside_lab_names - story_covered_names)[:8],
            "liveDemoWithoutStory": sorted(live_demo_component_names - story_covered_names)[:8],
        },
        "rules": [
            "Release-grade UI surface, Design Lab live demo ve Storybook harness birlikte izlenir.",
            "Storybook build, release gate icinde artifact uretebilmeli; chromatic script'i tanimli kalmalidir.",
            "Hosted review secret'i yoksa artifact-only visual review fallback'i acik olmalidir.",
            "Core visual harness dosyalari eksikse release visual contract FAIL olmalidir.",
            "Stable ve dis tuketilen component yuzeyi icin story coverage, release preview kalitesinin parcasi olarak izlenir.",
        ],
        "evidenceRefs": [
            relative_to_repo(review_contract_path, web_root),
            "web/.storybook/main.ts",
            "web/.storybook/preview.ts",
            "web/storybook.config.mjs",
            "web/stories/_chromatic-trigger.ts",
            *[relative_to_repo(path, web_root) for path in story_files],
            *[relative_to_repo(path, web_root) for path in mdx_docs],
        ],
    }
    coverage_state = {
        "storyCoveredNames": story_covered_names,
        "mdxCoveredNames": mdx_covered_names,
        "combinedCoveredNames": combined_covered_names,
    }
    return visual_regression, coverage_state


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

    upgrade_contract_path = Path(__file__).resolve().parents[2] / "docs/02-architecture/context/ui-library-consumer-upgrade.contract.v1.json"
    upgrade_contract = load_optional_json(upgrade_contract_path)
    owner_contract_path = Path(__file__).resolve().parents[2] / "docs/02-architecture/context/ui-library-consumer-owner-registry.v1.json"
    owner_contract = load_optional_json(owner_contract_path)
    recipes_contract_path = Path(__file__).resolve().parents[2] / "docs/02-architecture/context/ui-library-consumer-upgrade-recipes.contract.v1.json"
    recipes_contract = load_optional_json(recipes_contract_path)
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
                "codemodReady": False,
            }
        )
        if str(entry.get("classId") or "").strip() == "minor-single-app-review":
            manifest_entry = manifest_by_name.get(component_name, {})
            index_item = manifest_entry.get("indexItem") if isinstance(manifest_entry, dict) else {}
            api_item = manifest_entry.get("apiItem") if isinstance(manifest_entry, dict) else {}
            target_files = [
                str(path).strip()
                for path in ensure_list(index_item.get("whereUsed") if isinstance(index_item, dict) else [])
                if str(path).strip() != design_lab_path
            ]
            target_app = (
                str(consumer_apps_for_component[0].get("appId") or "").strip()
                if consumer_apps_for_component
                else "consumer-app"
            )
            api_props = [
                str(prop.get("name") or "").strip()
                for prop in ensure_list(api_item.get("props") if isinstance(api_item, dict) else [])
                if isinstance(prop, dict) and str(prop.get("name") or "").strip()
            ]
            preview_focus = [
                str(item).strip()
                for item in ensure_list(api_item.get("previewFocus") if isinstance(api_item, dict) else [])
                if str(item).strip()
            ][:3]
            regression_focus = [
                str(item).strip()
                for item in ensure_list(api_item.get("regressionFocus") if isinstance(api_item, dict) else [])
                if str(item).strip()
            ][:3]
            upgrade_recipe_items.append(
                {
                    "recipeId": f"{component_name.lower()}-{target_app}-upgrade",
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
                    "manualChecklistRef": f"{component_name.lower()}-{str(entry.get('classId') or '').strip()}",
                    "evidenceRefs": [
                        *target_files[:4],
                        "web/test-results/releases/ui-library/latest/ui-library-upgrade-checklist.v1.json",
                        "web/test-results/releases/ui-library/latest/ui-library-release-manifest.v1.json",
                    ],
                }
            )

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
            "codemodReadyComponents": 0,
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
                "codemodReadyComponents": 0,
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
            "candidateMode": str(recipes_contract.get("candidate_mode") or "dry-run-audit"),
            "auditScript": str(recipes_contract.get("audit_script") or "audit:ui-library-upgrade-recipes"),
            "summary": {
                "totalRecipes": len(upgrade_recipe_items),
                "singleAppRecipes": len(upgrade_recipe_items),
                "codemodCandidateCount": len(upgrade_recipe_items),
                "dryRunReadyCandidates": len(upgrade_recipe_items),
                "manualOnlyRecipes": 0,
            },
            "items": sorted(
                upgrade_recipe_items,
                key=lambda item: str(item.get("component") or ""),
            )[:16],
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
            "packages/ui-kit/src/catalog/component-manifest.v1.json",
            "web/apps/mfe-shell/src/pages/admin/design-lab.index.json",
            "web/test-results/releases/ui-library/latest/ui-library-release-manifest.v1.json",
        ],
    }


def build_component_manifest(web_root: Path) -> dict:
    ui_kit_index = web_root / "packages" / "ui-kit" / "src" / "index.ts"
    if not ui_kit_index.is_file():
        raise SystemExit(f"[designlab:index] ui-kit index not found: {ui_kit_index}")

    registry_path = web_root / "packages" / "ui-kit" / "src" / "catalog" / "component-registry.v1.json"
    api_catalog_path = web_root / "packages" / "ui-kit" / "src" / "catalog" / "component-api-catalog.v1.json"
    if not registry_path.is_file():
        raise SystemExit(f"[designlab:index] registry not found: {registry_path}")
    if not api_catalog_path.is_file():
        raise SystemExit(f"[designlab:index] api catalog not found: {api_catalog_path}")

    registry = load_json(registry_path)
    registry_items = registry.get("items")
    if not isinstance(registry_items, list):
        raise SystemExit("[designlab:index] registry items missing or invalid")

    api_catalog = load_json(api_catalog_path)
    api_items = api_catalog.get("items")
    if not isinstance(api_items, list):
        raise SystemExit("[designlab:index] api catalog items missing or invalid")

    exported_names = collect_runtime_exports(ui_kit_index, visited=set())
    usage = collect_ui_kit_import_usage(web_root=web_root, exported_names=exported_names)
    api_map = {
        str(item.get("name") or "").strip(): item
        for item in api_items
        if isinstance(item, dict) and str(item.get("name") or "").strip()
    }

    manifest_items: list[dict] = []
    registry_names: Set[str] = set()
    missing_runtime_exports: list[str] = []
    for raw_item in registry_items:
        if not isinstance(raw_item, dict):
            continue
        name = str(raw_item.get("name") or "").strip()
        if not name:
            continue

        registry_names.add(name)
        if raw_item.get("availability") == "exported" and name not in exported_names:
            missing_runtime_exports.append(name)

        index_item = {
            **raw_item,
            "importStatement": f"import {{ {name} }} from 'mfe-ui-kit';",
            "whereUsed": sorted(usage.get(name, set())),
        }
        manifest_items.append(
            {
                "name": name,
                "indexItem": index_item,
                "apiItem": api_map.get(name),
            }
        )

    if missing_runtime_exports:
        raise SystemExit(
            "[designlab:index] registry exported entries missing from runtime surface: "
            + ", ".join(sorted(missing_runtime_exports))
        )

    timestamp_tr = now_tr()
    diagnostics = {
        "registryItemCount": len(registry_names),
        "runtimeExportCount": len(exported_names),
        "runtimeExportsWithoutRegistry": sorted(exported_names - registry_names),
    }
    visual_regression, coverage_state = build_visual_regression_summary(web_root, manifest_items)
    migration = build_migration_summary(manifest_items, coverage_state)
    return {
        "version": "1.0",
        "subject_id": "ui_kutuphane_sistemi",
        "generatedAt": format_ts(timestamp_tr),
        "generatedAtUtc": format_ts_utc(timestamp_tr),
        "source": {
            "package": "mfe-ui-kit",
            "index": "packages/ui-kit/src/index.ts",
            "registry": "packages/ui-kit/src/catalog/component-registry.v1.json",
            "apiCatalog": "packages/ui-kit/src/catalog/component-api-catalog.v1.json",
        },
        "apiCatalogMeta": {
            "version": api_catalog.get("version"),
            "subject_id": api_catalog.get("subject_id"),
            "wave_id": api_catalog.get("wave_id"),
        },
        "summary": build_catalog_summary(manifest_items),
        "diagnostics": diagnostics,
        "adoption": build_adoption_summary(manifest_items, diagnostics),
        "migration": migration,
        "visualRegression": visual_regression,
        "items": sorted(manifest_items, key=lambda item: item["name"]),
    }


def build_design_lab_index_from_manifest(manifest: dict) -> dict:
    items: list[DesignLabIndexItem] = []
    for item in manifest.get("items", []):
        if not isinstance(item, dict):
            continue
        index_item = item.get("indexItem")
        if not isinstance(index_item, dict):
            continue
        item_name = str(index_item.get("name") or "").strip()
        import_snippet = f"import {{ {item_name} }} from 'mfe-ui-kit';"
        items.append(
            {
                **index_item,
                "name": item_name,
                "importStatement": index_item.get("importStatement", import_snippet),
                "whereUsed": index_item.get("whereUsed", []),
            }
        )

    timestamp_tr = now_tr()
    return {
        "version": 1,
        "generatedAt": format_ts(timestamp_tr),
        "generatedAtUtc": format_ts_utc(timestamp_tr),
        "summary": manifest.get("summary"),
        "adoption": manifest.get("adoption"),
        "migration": manifest.get("migration"),
        "visualRegression": manifest.get("visualRegression"),
        "source": {
            "package": "mfe-ui-kit",
            "index": "packages/ui-kit/src/index.ts",
            "registry": "packages/ui-kit/src/catalog/component-registry.v1.json",
            "apiCatalog": "packages/ui-kit/src/catalog/component-api-catalog.v1.json",
            "manifest": "packages/ui-kit/src/catalog/component-manifest.v1.json",
        },
        "items": items,
    }


def main(argv: Optional[list[str]] = None) -> int:
    parser = argparse.ArgumentParser(description="Build Design Lab usage index (MVP).")
    parser.add_argument(
        "--output",
        default="apps/mfe-shell/src/pages/admin/design-lab.index.json",
        help="Output JSON path, relative to web/.",
    )
    parser.add_argument(
        "--manifest-output",
        default="packages/ui-kit/src/catalog/component-manifest.v1.json",
        help="Manifest output JSON path, relative to web/.",
    )
    args = parser.parse_args(argv)

    script_path = Path(__file__).resolve()
    web_root = script_path.parents[1]
    output_path = (web_root / args.output).resolve()
    manifest_output_path = (web_root / args.manifest_output).resolve()

    manifest = build_component_manifest(web_root)
    index = build_design_lab_index_from_manifest(manifest)
    if output_path.is_file():
        existing = load_json(output_path)
        index = merge_curated_metadata(existing, index)
    index = sync_release_metadata(index, manifest, web_root)

    manifest_output_path.parent.mkdir(parents=True, exist_ok=True)
    manifest_output_path.write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(index, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    print(f"[designlab:index] wrote: {output_path.relative_to(web_root).as_posix()}")
    print(f"[designlab:index] wrote manifest: {manifest_output_path.relative_to(web_root).as_posix()}")
    print(f"[designlab:index] items: {len(index.get('items', []))}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
