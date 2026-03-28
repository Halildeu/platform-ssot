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
from build_design_lab_index_migration import build_adoption_summary, build_catalog_summary, build_migration_summary
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


IMPORT_FROM_DESIGN_SYSTEM_RE = re.compile(
    r"import\s+(?:type\s+)?{([^}]+)}\s+from\s+['\"]@mfe/design-system['\"]",
    flags=re.MULTILINE | re.DOTALL,
)


def collect_design_system_import_usage(
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

        for match in IMPORT_FROM_DESIGN_SYSTEM_RE.finditer(content):
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


CURATED_INDEX_KEYS = (
    "version",
    "release",
    "themePresets",
    "recipes",
)

INDEX_GENERATED_META_KEYS = (
    "generatedAt",
    "generatedAtUtc",
    "summary",
    "adoption",
    "migration",
    "visualRegression",
    "source",
)

MANIFEST_GENERATED_META_KEYS = (
    "version",
    "subject_id",
    "generatedAt",
    "generatedAtUtc",
    "source",
    "apiCatalogMeta",
    "summary",
    "diagnostics",
    "adoption",
    "migration",
    "visualRegression",
)

MANIFEST_CORE_KEYS = (
    "version",
    "subject_id",
    "source",
    "apiCatalogMeta",
)

INDEX_CORE_KEYS = (
    "version",
    "release",
    "themePresets",
    "recipes",
    "source",
)


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


def ensure_dict(value: object) -> dict:
    return value if isinstance(value, dict) else {}


def load_json_with_authorities(path: Path) -> dict:
    payload = load_json(path)
    if not isinstance(payload, dict):
        raise SystemExit(f"[designlab:index] invalid json object: {path}")

    source = payload.get("source")
    if not isinstance(source, dict):
        return payload

    web_root = next((parent for parent in path.parents if parent.name == "web"), None)
    repo_root = web_root.parent if web_root is not None else path.parent

    def resolve_authority_path(relative_path: str) -> Path:
        primary = repo_root / relative_path
        if primary.is_file():
            return primary
        if web_root is not None:
            secondary = web_root / relative_path
            if secondary.is_file():
                return secondary
        return primary

    generated_meta_authority = str(source.get("generatedMetaAuthority") or "").strip()
    if generated_meta_authority:
        generated_meta_path = resolve_authority_path(generated_meta_authority)
        if generated_meta_path.is_file():
            generated_payload = load_json(generated_meta_path)
            if isinstance(generated_payload, dict):
                for key, value in generated_payload.items():
                    if key == "source" and isinstance(value, dict):
                        payload["source"] = {
                            **value,
                            **ensure_dict(payload.get("source")),
                        }
                    elif key not in payload:
                        payload[key] = value

    def decode_items_payload(value: object) -> list[dict]:
        if isinstance(value, list):
            return [item for item in value if isinstance(item, dict)]
        if isinstance(value, dict) and isinstance(value.get("items"), list):
            return [item for item in value["items"] if isinstance(item, dict)]
        return []

    items_authority_value = source.get("itemsAuthority")
    if items_authority_value and "items" not in payload:
        item_specs = (
            [entry for entry in items_authority_value if isinstance(entry, str) and entry.strip()]
            if isinstance(items_authority_value, list)
            else [items_authority_value] if isinstance(items_authority_value, str) and items_authority_value.strip() else []
        )
        merged_items: list[dict] = []
        for item_spec in item_specs:
            items_path = resolve_authority_path(item_spec)
            if items_path.is_file():
                merged_items.extend(decode_items_payload(load_json(items_path)))
        payload["items"] = merged_items

    return payload


def build_shard_paths(base_path: Path, count: int, shard_size: int = 20) -> list[Path]:
    name = base_path.name
    suffix = ".json"
    prefix = name[:-len(suffix)] if name.endswith(suffix) else name
    if prefix.endswith(".v1"):
        prefix = prefix[:-3]
        suffix = ".v1.json"
    shard_count = max(1, (count + shard_size - 1) // shard_size)
    return [
        base_path.with_name(f"{prefix}.part-{index:02d}{suffix}")
        for index in range(1, shard_count + 1)
    ]


def write_item_shards(base_path: Path, items: list[dict], web_root: Path, shard_size: int = 20) -> list[str]:
    shard_paths = build_shard_paths(base_path, len(items), shard_size=shard_size)
    for existing in base_path.parent.glob(f"{base_path.name.split('.v1.json')[0]}.part-*{'.v1.json' if base_path.name.endswith('.v1.json') else base_path.suffix}"):
        existing.unlink(missing_ok=True)
    base_path.unlink(missing_ok=True)
    relative_paths: list[str] = []
    for index, shard_path in enumerate(shard_paths):
        shard_items = items[index * shard_size : (index + 1) * shard_size]
        shard_path.parent.mkdir(parents=True, exist_ok=True)
        shard_path.write_text(
            json.dumps({"items": shard_items}, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
        relative_paths.append(shard_path.relative_to(web_root).as_posix())
    return relative_paths


def extract_curated_metadata(payload: dict) -> dict:
    return {
        key: value
        for key, value in payload.items()
        if key in CURATED_INDEX_KEYS
    }


def extract_index_generated_metadata(payload: dict) -> dict:
    return {
        key: value
        for key, value in payload.items()
        if key in INDEX_GENERATED_META_KEYS
    }


def extract_manifest_generated_metadata(payload: dict) -> dict:
    return {
        key: value
        for key, value in payload.items()
        if key in MANIFEST_GENERATED_META_KEYS
    }


def extract_manifest_core(payload: dict) -> dict:
    return {
        key: value
        for key, value in payload.items()
        if key in MANIFEST_CORE_KEYS
    }


def extract_index_core(payload: dict) -> dict:
    return {
        key: value
        for key, value in payload.items()
        if key in INDEX_CORE_KEYS
    }


def load_curated_metadata(curated_path: Path, legacy_index_path: Path) -> dict:
    if curated_path.is_file():
        return extract_curated_metadata(load_json(curated_path))
    if legacy_index_path.is_file():
        return extract_curated_metadata(load_json(legacy_index_path))
    return {"version": 1}


def merge_curated_metadata(existing: dict, generated: dict) -> dict:
    # Curated release, recipe and preset metadata ayrı authority dosyasından
    # okunur; generated summary/adoption alanları burada canonical kalır.
    preserved = extract_curated_metadata(existing)
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
        codemod_candidates = migration.get("codemodCandidates")
        if isinstance(codemod_candidates, dict):
            apply_executor = codemod_candidates.get("applyExecutor")
            apply_executor_summary = apply_executor.get("summary") if isinstance(apply_executor, dict) else {}
            manual_review = codemod_candidates.get("manualReview")
            manual_review_summary = manual_review.get("summary") if isinstance(manual_review, dict) else {}
            prototypes = codemod_candidates.get("prototypes")
            prototype_summary = prototypes.get("summary") if isinstance(prototypes, dict) else {}
            if isinstance(apply_executor_summary, dict):
                catalog_metrics["codemodApplyCount"] = int(apply_executor_summary.get("focusCount") or 0)
            if isinstance(manual_review_summary, dict):
                catalog_metrics["codemodManualReviewCount"] = int(manual_review_summary.get("focusCount") or 0)
            if isinstance(prototype_summary, dict):
                catalog_metrics["codemodPrototypeCount"] = int(prototype_summary.get("prototypeCount") or 0)
    latest_release["catalogMetrics"] = catalog_metrics
    latest_release["lifecycleChanges"] = (
        "exported=%d, planned=%d; stable=%d, beta=%d; apiCatalog=%d/%d; "
        "liveDemo=%d; visualHarness=%d; storyCovered=%d; wideAdoptionReady=%d; adopted=%d across %d apps; "
        "singleApp=%d; crossApp=%d; manualReview=%d; recipes=%d; codemodCandidates=%d; codemodApply=%d; codemodManualReview=%d; codemodPrototypes=%d"
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
            int(catalog_metrics.get("codemodApplyCount") or 0),
            int(catalog_metrics.get("codemodManualReviewCount") or 0),
            int(catalog_metrics.get("codemodPrototypeCount") or 0),
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
        "./components/EmptyState": ("empty-states", "empty"),
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


def to_kebab_case(name: str) -> str:
    first_pass = re.sub(r"(.)([A-Z][a-z]+)", r"\1-\2", name)
    return re.sub(r"([a-z0-9])([A-Z])", r"\1-\2", first_pass).replace("_", "-").lower()


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

def build_component_manifest(web_root: Path) -> dict:
    design_system_index = web_root / "packages" / "design-system" / "src" / "index.ts"
    if not design_system_index.is_file():
        raise SystemExit(f"[designlab:index] design-system index not found: {design_system_index}")

    registry_path = web_root / "packages" / "design-system" / "src" / "catalog" / "component-registry.v1.json"
    api_catalog_path = web_root / "packages" / "design-system" / "src" / "catalog" / "component-api-catalog.v1.json"
    if not registry_path.is_file():
        raise SystemExit(f"[designlab:index] registry not found: {registry_path}")
    if not api_catalog_path.is_file():
        raise SystemExit(f"[designlab:index] api catalog not found: {api_catalog_path}")

    registry = load_json(registry_path)
    registry_items = registry.get("items")
    if not isinstance(registry_items, list):
        raise SystemExit("[designlab:index] registry items missing or invalid")

    api_catalog = load_json_with_authorities(api_catalog_path)
    api_items = api_catalog.get("items")
    if not isinstance(api_items, list):
        raise SystemExit("[designlab:index] api catalog items missing or invalid")

    exported_names = collect_runtime_exports(design_system_index, visited=set())
    usage = collect_design_system_import_usage(web_root=web_root, exported_names=exported_names)
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
            "importStatement": f"import {{ {name} }} from '@mfe/design-system';",
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
            "package": "@mfe/design-system",
            "index": "packages/design-system/src/index.ts",
            "registry": "packages/design-system/src/catalog/component-registry.v1.json",
            "apiCatalog": "packages/design-system/src/catalog/component-api-catalog.v1.json",
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
        import_snippet = f"import {{ {item_name} }} from '@mfe/design-system';"
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
            "package": "@mfe/design-system",
            "index": "packages/design-system/src/index.ts",
            "registry": "packages/design-system/src/catalog/component-registry.v1.json",
            "apiCatalog": "packages/design-system/src/catalog/component-api-catalog.v1.json",
            "manifest": "packages/design-system/src/catalog/component-manifest.v1.json",
            "curatedAuthority": "apps/mfe-shell/src/pages/admin/design-lab.curated.v1.json",
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
        default="packages/design-system/src/catalog/component-manifest.v1.json",
        help="Manifest output JSON path, relative to web/.",
    )
    parser.add_argument(
        "--manifest-items-output",
        default="packages/design-system/src/catalog/component-manifest.items.v1.json",
        help="Manifest items authority JSON path, relative to web/.",
    )
    parser.add_argument(
        "--api-catalog-output",
        default="packages/design-system/src/catalog/component-api-catalog.v1.json",
        help="API catalog output JSON path, relative to web/.",
    )
    parser.add_argument(
        "--api-catalog-items-output",
        default="packages/design-system/src/catalog/component-api-catalog.items.v1.json",
        help="API catalog items authority JSON path, relative to web/.",
    )
    parser.add_argument(
        "--curated-input",
        default="apps/mfe-shell/src/pages/admin/design-lab.curated.v1.json",
        help="Curated release/recipe/preset authority JSON path, relative to web/.",
    )
    parser.add_argument(
        "--generated-meta-output",
        default="apps/mfe-shell/src/pages/admin/design-lab.generated-meta.v1.json",
        help="Generated Design Lab summary/adoption authority JSON path, relative to web/.",
    )
    parser.add_argument(
        "--manifest-generated-meta-output",
        default="packages/design-system/src/catalog/component-manifest.generated-meta.v1.json",
        help="Generated component manifest authority JSON path, relative to web/.",
    )
    parser.add_argument(
        "--index-items-output",
        default="apps/mfe-shell/src/pages/admin/design-lab.items.v1.json",
        help="Generated Design Lab items authority JSON path, relative to web/.",
    )
    args = parser.parse_args(argv)

    script_path = Path(__file__).resolve()
    web_root = script_path.parents[1]
    output_path = (web_root / args.output).resolve()
    manifest_output_path = (web_root / args.manifest_output).resolve()
    manifest_items_output_path = (web_root / args.manifest_items_output).resolve()
    api_catalog_output_path = (web_root / args.api_catalog_output).resolve()
    api_catalog_items_output_path = (web_root / args.api_catalog_items_output).resolve()
    curated_input_path = (web_root / args.curated_input).resolve()
    generated_meta_output_path = (web_root / args.generated_meta_output).resolve()
    manifest_generated_meta_output_path = (web_root / args.manifest_generated_meta_output).resolve()
    index_items_output_path = (web_root / args.index_items_output).resolve()

    manifest = build_component_manifest(web_root)
    index = build_design_lab_index_from_manifest(manifest)
    curated = load_curated_metadata(curated_input_path, output_path)
    index = merge_curated_metadata(curated, index)
    index = sync_release_metadata(index, manifest, web_root)

    manifest_item_authorities = write_item_shards(
        manifest_items_output_path,
        [item for item in manifest.get("items", []) if isinstance(item, dict)],
        web_root,
    )
    index_item_authorities = write_item_shards(
        index_items_output_path,
        [item for item in index.get("items", []) if isinstance(item, dict)],
        web_root,
    )
    api_catalog_items = [
        item.get("apiItem")
        for item in manifest.get("items", [])
        if isinstance(item, dict) and isinstance(item.get("apiItem"), dict)
    ]
    api_catalog_item_authorities = write_item_shards(
        api_catalog_items_output_path,
        [item for item in api_catalog_items if isinstance(item, dict)],
        web_root,
    )

    manifest_generated_meta = extract_manifest_generated_metadata(manifest)
    manifest_generated_meta["source"] = {
        **(manifest_generated_meta.get("source") or {}),
        "generatedMetaAuthority": manifest_generated_meta_output_path.relative_to(web_root).as_posix(),
        "itemsAuthority": manifest_item_authorities,
    }
    manifest_output = extract_manifest_core(manifest)
    manifest_output["source"] = {
        **(manifest_output.get("source") or {}),
        "generatedMetaAuthority": manifest_generated_meta_output_path.relative_to(web_root).as_posix(),
        "itemsAuthority": manifest_item_authorities,
    }

    index_generated_meta = extract_index_generated_metadata(index)
    index_generated_meta["source"] = {
        **(index_generated_meta.get("source") or {}),
        "generatedMetaAuthority": generated_meta_output_path.relative_to(web_root).as_posix(),
        "itemsAuthority": index_item_authorities,
    }
    index_output = extract_index_core(index)
    index_output["source"] = {
        **(index_output.get("source") or {}),
        "generatedMetaAuthority": generated_meta_output_path.relative_to(web_root).as_posix(),
        "itemsAuthority": index_item_authorities,
    }

    api_catalog_output = {
        "version": manifest.get("apiCatalogMeta", {}).get("version"),
        "subject_id": manifest.get("apiCatalogMeta", {}).get("subject_id"),
        "wave_id": manifest.get("apiCatalogMeta", {}).get("wave_id"),
        "source": {
            "itemsAuthority": api_catalog_item_authorities,
        },
    }

    manifest_output_path.parent.mkdir(parents=True, exist_ok=True)
    manifest_output_path.write_text(
        json.dumps(manifest_output, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    manifest_generated_meta_output_path.parent.mkdir(parents=True, exist_ok=True)
    manifest_generated_meta_output_path.write_text(
        json.dumps(manifest_generated_meta, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    api_catalog_output_path.parent.mkdir(parents=True, exist_ok=True)
    api_catalog_output_path.write_text(
        json.dumps(api_catalog_output, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(index_output, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    generated_meta_output_path.parent.mkdir(parents=True, exist_ok=True)
    generated_meta_output_path.write_text(
        json.dumps(index_generated_meta, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )

    print(f"[designlab:index] wrote: {output_path.relative_to(web_root).as_posix()}")
    print(f"[designlab:index] wrote manifest: {manifest_output_path.relative_to(web_root).as_posix()}")
    print(f"[designlab:index] wrote manifest items shards: {manifest_item_authorities}")
    print(f"[designlab:index] wrote api catalog: {api_catalog_output_path.relative_to(web_root).as_posix()}")
    print(f"[designlab:index] wrote api catalog items shards: {api_catalog_item_authorities}")
    print(
        "[designlab:index] wrote manifest generated meta: "
        f"{manifest_generated_meta_output_path.relative_to(web_root).as_posix()}"
    )
    print(f"[designlab:index] wrote index items shards: {index_item_authorities}")
    print(
        "[designlab:index] wrote index generated meta: "
        f"{generated_meta_output_path.relative_to(web_root).as_posix()}"
    )
    print(f"[designlab:index] curated authority: {curated_input_path.relative_to(web_root).as_posix()}")
    print(f"[designlab:index] items: {len(index.get('items', []))}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
