#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import re
from pathlib import Path
from typing import Any, Optional, Set, TypedDict


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
INTERNAL_DOCS_EXPORTS: Set[str] = {
    "LibraryDocsSection",
    "LibraryDetailLabel",
    "LibraryDetailTabs",
    "LibraryMetadataPanel",
    "LibraryMetricCard",
    "LibraryOutlinePanel",
    "LibraryPreviewPanel",
    "LibraryProductTree",
    "LibraryQueryProvider",
    "LibrarySectionBadge",
    "LibraryShowcaseCard",
    "LibraryStatsPanel",
}


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
    availability: str
    lifecycle: str
    taxonomyGroupId: str
    taxonomySubgroup: str
    demoMode: str
    description: str
    sectionIds: list[str]
    qualityGates: list[str]
    tags: list[str]
    uxPrimaryThemeId: str
    uxPrimarySubthemeId: str
    roadmapWaveId: str
    acceptanceContractId: str


class ComponentRegistryItem(TypedDict, total=False):
    name: str
    kind: str
    availability: str
    lifecycle: str
    group: str
    subgroup: str
    taxonomyGroupId: str
    taxonomySubgroup: str
    demoMode: str
    description: str
    sectionIds: list[str]
    qualityGates: list[str]
    tags: list[str]
    uxPrimaryThemeId: str
    uxPrimarySubthemeId: str
    roadmapWaveId: str
    acceptanceContractId: str


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


def split_csv_values(raw: str) -> list[str]:
    return [part.strip() for part in raw.split(",") if part.strip()]


def parse_release_note_entries(text: str) -> list[dict[str, Any]]:
    entries: list[dict[str, Any]] = []
    current: dict[str, Any] | None = None
    in_entries = False
    in_evidence = False

    for raw_line in text.splitlines():
        line = raw_line.rstrip()
        stripped = line.strip()
        if stripped == "## Entries":
            in_entries = True
            current = None
            in_evidence = False
            continue
        if not in_entries:
            continue
        if stripped.startswith("- version:"):
            if current:
                entries.append(current)
            current = {
                "version": stripped.split(":", 1)[1].strip(),
                "date": "",
                "changed_components": "",
                "lifecycle_changes": "",
                "breaking_changes": "",
                "migration_notes": "",
                "evidence_refs": [],
            }
            in_evidence = False
            continue
        if current is None or not stripped:
            continue
        if stripped.startswith("date:"):
            current["date"] = stripped.split(":", 1)[1].strip()
        elif stripped.startswith("changed_components:"):
            current["changed_components"] = stripped.split(":", 1)[1].strip()
        elif stripped.startswith("lifecycle_changes:"):
            current["lifecycle_changes"] = stripped.split(":", 1)[1].strip()
        elif stripped.startswith("breaking_changes:"):
            current["breaking_changes"] = stripped.split(":", 1)[1].strip()
        elif stripped.startswith("migration_notes:"):
            current["migration_notes"] = stripped.split(":", 1)[1].strip()
        elif stripped.startswith("evidence_refs:"):
            in_evidence = True
        elif in_evidence and stripped.startswith("- "):
            current["evidence_refs"].append(stripped[2:].strip())

    if current:
        entries.append(current)
    return entries


def build_release_metadata(
    web_root: Path,
    *,
    registry_entries: list[ComponentRegistryItem],
    api_catalog_item_count: int,
) -> dict[str, Any]:
    repo_root = web_root.parent
    package_json_path = web_root / "packages" / "ui-kit" / "package.json"
    contract_path = repo_root / "docs" / "02-architecture" / "context" / "ui-library-package-release.contract.v1.json"
    release_notes_path = repo_root / "docs" / "04-operations" / "RELEASE-NOTES" / "RELEASE-NOTES-ui-library.md"

    package_json = load_json(package_json_path)
    contract = load_json(contract_path)
    release_entries = parse_release_note_entries(release_notes_path.read_text(encoding="utf-8"))
    latest_entry = release_entries[0] if release_entries else None

    targets: list[dict[str, Any]] = []
    for raw_target in contract.get("distribution_targets", []):
        artifact_paths = raw_target.get("artifact_paths", [])
        present_count = 0
        normalized_paths: list[str] = []
        for rel_path in artifact_paths:
            rel_path_str = str(rel_path)
            normalized_paths.append(rel_path_str)
            if (repo_root / rel_path_str).is_file():
                present_count += 1
        targets.append(
            {
                "targetId": str(raw_target.get("target_id") or ""),
                "channel": str(raw_target.get("channel") or ""),
                "buildCommand": str(raw_target.get("build_command") or ""),
                "artifactCount": len(normalized_paths),
                "artifactPresentCount": present_count,
                "artifacts": normalized_paths,
            }
        )

    stable_count = sum(1 for entry in registry_entries if str(entry.get("lifecycle") or "") == "stable")
    beta_count = sum(1 for entry in registry_entries if str(entry.get("lifecycle") or "") == "beta")

    latest_release = {
        "version": str(latest_entry.get("version") or "") if latest_entry else "",
        "date": str(latest_entry.get("date") or "") if latest_entry else "",
        "changedComponents": split_csv_values(str(latest_entry.get("changed_components") or "")) if latest_entry else [],
        "lifecycleChanges": str(latest_entry.get("lifecycle_changes") or "") if latest_entry else "",
        "breakingChanges": str(latest_entry.get("breaking_changes") or "") if latest_entry else "",
        "migrationNotes": str(latest_entry.get("migration_notes") or "") if latest_entry else "",
        "evidenceRefs": list(latest_entry.get("evidence_refs") or []) if latest_entry else [],
    }

    return {
        "packageName": str(package_json.get("name") or ""),
        "packageVersion": str(package_json.get("version") or ""),
        "packageJsonPath": package_json_path.relative_to(repo_root).as_posix(),
        "contractId": str(contract.get("contract_id") or ""),
        "contractPath": contract_path.relative_to(repo_root).as_posix(),
        "releaseNotesPath": release_notes_path.relative_to(repo_root).as_posix(),
        "versionScheme": str(contract.get("versioning_strategy", {}).get("scheme") or ""),
        "requiredScripts": [str(value) for value in contract.get("required_scripts", []) if str(value).strip()],
        "stableReleaseRequires": [
            str(value)
            for value in contract.get("changelog_policy", {}).get("stable_release_requires", [])
            if str(value).strip()
        ],
        "distributionTargets": targets,
        "latestRelease": latest_release,
        "registrySummary": {
            "stable": stable_count,
            "beta": beta_count,
            "apiCatalogItems": api_catalog_item_count,
        },
    }


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


def build_design_lab_index(web_root: Path) -> dict:
    ui_kit_index = web_root / "packages" / "ui-kit" / "src" / "index.ts"
    if not ui_kit_index.is_file():
        raise SystemExit(f"[designlab:index] ui-kit index not found: {ui_kit_index}")

    content = ui_kit_index.read_text(encoding="utf-8")
    export_targets = [
        match.group(1)
        for match in EXPORT_STAR_FROM_RE.finditer(content)
        if match.group(1).startswith(".")
    ]

    groups_path = (
        web_root / "apps" / "mfe-shell" / "src" / "pages" / "admin" / "design-lab.groups.json"
    )
    if not groups_path.is_file():
        raise SystemExit(f"[designlab:index] groups SSOT not found: {groups_path}")
    groups = load_json(groups_path)
    valid_pairs = build_groups_lookup(groups)

    overrides_path = (
        web_root / "apps" / "mfe-shell" / "src" / "pages" / "admin" / "design-lab.overrides.json"
    )
    overrides = load_json(overrides_path) if overrides_path.is_file() else {"version": 1, "overrides": {}}
    registry_path = web_root / "packages" / "ui-kit" / "src" / "catalog" / "component-registry.v1.json"
    if not registry_path.is_file():
        raise SystemExit(f"[designlab:index] component registry not found: {registry_path}")
    registry_obj = load_json(registry_path)
    registry_entries = registry_obj.get("items") if isinstance(registry_obj.get("items"), list) else []
    if not registry_entries:
        raise SystemExit("[designlab:index] component registry is empty")
    api_catalog_path = web_root / "packages" / "ui-kit" / "src" / "catalog" / "component-api-catalog.v1.json"
    api_catalog_obj = load_json(api_catalog_path)
    api_catalog_items = api_catalog_obj.get("items") if isinstance(api_catalog_obj.get("items"), list) else []

    registry_by_name: dict[str, ComponentRegistryItem] = {}
    for idx, raw_entry in enumerate(registry_entries):
        if not isinstance(raw_entry, dict):
            raise SystemExit(f"[designlab:index] invalid registry entry at index {idx}")
        name = str(raw_entry.get("name") or "").strip()
        if not name:
            raise SystemExit(f"[designlab:index] registry entry missing name at index {idx}")
        if name in registry_by_name:
            raise SystemExit(f"[designlab:index] duplicate registry entry: {name}")
        group = str(raw_entry.get("group") or "").strip()
        subgroup = str(raw_entry.get("subgroup") or "").strip()
        if not group or not subgroup or (group, subgroup) not in valid_pairs:
            raise SystemExit(f"[designlab:index] invalid registry group/subgroup for {name}: {group}/{subgroup}")
        registry_by_name[name] = raw_entry

    exported_names: Set[str] = set()
    origin_by_name: dict[str, str] = {}
    for module_path in export_targets:
        module_file = resolve_module_path(ui_kit_index, module_path)
        if module_file is None:
            continue
        names = collect_runtime_exports(module_file, visited=set())
        exported_names |= names
        for name in names:
            origin_by_name.setdefault(name, module_path)

    catalog_exported_names = {name for name in exported_names if name not in INTERNAL_DOCS_EXPORTS}
    usage = collect_ui_kit_import_usage(web_root=web_root, exported_names=catalog_exported_names)

    missing_registry = sorted(name for name in catalog_exported_names if name not in registry_by_name)
    if missing_registry:
        raise SystemExit(f"[designlab:index] exported names missing from registry: {', '.join(missing_registry)}")

    exported_but_not_real = sorted(
        name
        for name, entry in registry_by_name.items()
        if str(entry.get("availability") or "").strip() == "exported" and name not in catalog_exported_names
    )
    if exported_but_not_real:
        raise SystemExit(
            "[designlab:index] registry marks exported but runtime export missing: "
            + ", ".join(exported_but_not_real)
        )

    items: list[DesignLabIndexItem] = []
    for name in sorted(registry_by_name):
        registry_entry = registry_by_name[name]
        availability = str(registry_entry.get("availability") or "planned").strip()
        files = sorted(usage.get(name, set()))
        kind = str(registry_entry.get("kind") or "").strip() or classify_kind(name)
        group = str(registry_entry.get("group") or "").strip()
        subgroup = str(registry_entry.get("subgroup") or "").strip()
        tags = [str(tag).strip() for tag in registry_entry.get("tags", []) if str(tag).strip()] if isinstance(registry_entry.get("tags"), list) else []
        override_entry = overrides.get("overrides", {}).get(name)
        override_tags = []
        if isinstance(override_entry, dict) and isinstance(override_entry.get("tags"), list):
            override_tags = [str(tag).strip() for tag in override_entry.get("tags", []) if str(tag).strip()]
        tags = sorted(set(tags + override_tags))
        import_snippet = f"import {{ {name} }} from 'mfe-ui-kit';" if availability == "exported" else ""

        items.append(
            {
                "name": name,
                "kind": kind,
                "importStatement": import_snippet,
                "whereUsed": files,
                "group": group,
                "subgroup": subgroup,
                "tags": tags,
                "availability": availability,
                "lifecycle": str(registry_entry.get("lifecycle") or "planned"),
                "taxonomyGroupId": str(registry_entry.get("taxonomyGroupId") or ""),
                "taxonomySubgroup": str(registry_entry.get("taxonomySubgroup") or ""),
                "demoMode": str(registry_entry.get("demoMode") or "inspector"),
                "description": str(registry_entry.get("description") or ""),
                "sectionIds": [str(value).strip() for value in registry_entry.get("sectionIds", []) if str(value).strip()]
                if isinstance(registry_entry.get("sectionIds"), list)
                else [],
                "qualityGates": [str(value).strip() for value in registry_entry.get("qualityGates", []) if str(value).strip()]
                if isinstance(registry_entry.get("qualityGates"), list)
                else [],
                "uxPrimaryThemeId": str(registry_entry.get("uxPrimaryThemeId") or ""),
                "uxPrimarySubthemeId": str(registry_entry.get("uxPrimarySubthemeId") or ""),
                "roadmapWaveId": str(registry_entry.get("roadmapWaveId") or ""),
                "acceptanceContractId": str(registry_entry.get("acceptanceContractId") or ""),
            }
        )

    exported_count = sum(1 for item in items if item.get("availability") == "exported")
    planned_count = sum(1 for item in items if item.get("availability") == "planned")
    summary = {
        "total": len(items),
        "exported": exported_count,
        "planned": planned_count,
        "liveDemo": sum(1 for item in items if item.get("demoMode") == "live"),
        "inspector": sum(1 for item in items if item.get("demoMode") == "inspector"),
    }
    return {
        "version": 1,
        "source": {
            "package": "mfe-ui-kit",
            "index": "packages/ui-kit/src/index.ts",
            "registry": "packages/ui-kit/src/catalog/component-registry.v1.json",
            "groups": "apps/mfe-shell/src/pages/admin/design-lab.groups.json",
            "overrides": "apps/mfe-shell/src/pages/admin/design-lab.overrides.json",
        },
        "summary": summary,
        "release": build_release_metadata(
            web_root,
            registry_entries=registry_entries,
            api_catalog_item_count=len(api_catalog_items),
        ),
        "items": items,
    }


def main(argv: Optional[list[str]] = None) -> int:
    parser = argparse.ArgumentParser(description="Build Design Lab usage index (MVP).")
    parser.add_argument(
        "--output",
        default="apps/mfe-shell/src/pages/admin/design-lab.index.json",
        help="Output JSON path, relative to web/.",
    )
    args = parser.parse_args(argv)

    script_path = Path(__file__).resolve()
    web_root = script_path.parents[1]
    output_path = (web_root / args.output).resolve()

    index = build_design_lab_index(web_root)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(index, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    print(f"[designlab:index] wrote: {output_path.relative_to(web_root).as_posix()}")
    print(f"[designlab:index] items: {len(index.get('items', []))}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
