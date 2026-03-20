#!/usr/bin/env python3
from __future__ import annotations

from ui_library_checks import (
    ROOT,
    ensure_dict,
    ensure_exists,
    ensure_list,
    fail,
    load_json_with_authorities,
    load_text,
    ok,
)


SCRIPT = "check_ui_library_foundation_contracts"
PUBLIC_SURFACE_FILE = "web/packages/ui-kit/src/index.ts"
INTERNAL_BARREL_FILE = "web/packages/ui-kit/src/catalog/design-lab-internals.ts"
INTERNAL_MODULE_EXPORTS = {
    "./components/LibraryDocsPrimitives",
    "./components/LibraryProductTree",
    "./components/LibraryQueryProvider",
}
ALLOWED_INTERNAL_IMPORT_CONSUMERS = {
    "web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx",
    "web/apps/mfe-shell/src/pages/admin/design-lab/showcase/DesignLabShowcaseContent.tsx",
    "web/apps/mfe-shell/src/pages/admin/design-lab/showcase/preview-components/pagination/paginationInternals.ts",
}
INTERNAL_IMPORT_MARKER = "src/catalog/design-lab-internals"


def find_internal_import_consumers() -> list[str]:
    consumers: list[str] = []
    web_root = ROOT / "web"
    for path in web_root.rglob("*"):
        if not path.is_file():
            continue
        if path.suffix not in {".ts", ".tsx", ".js", ".jsx"}:
            continue
        if any(part in {"node_modules", "dist", "build"} for part in path.parts):
            continue
        relative_path = path.relative_to(ROOT).as_posix()
        content = path.read_text(encoding="utf-8", errors="ignore")
        if INTERNAL_IMPORT_MARKER in content:
            consumers.append(relative_path)
    return sorted(consumers)


def main() -> int:
    required = [
        "web/packages/ui-kit/src/catalog/component-manifest.v1.json",
        "web/packages/ui-kit/src/catalog/component-registry.v1.json",
        "web/packages/ui-kit/src/catalog/component-api-catalog.v1.json",
        "web/apps/mfe-shell/src/pages/admin/design-lab.index.json",
        "web/apps/mfe-shell/src/pages/admin/design-lab.taxonomy.v1.json",
        PUBLIC_SURFACE_FILE,
        INTERNAL_BARREL_FILE,
    ]
    missing = ensure_exists(*required)
    if missing:
        return fail(SCRIPT, [f"missing-file:{path}" for path in missing])

    manifest = load_json_with_authorities(required[0])
    registry = load_json_with_authorities(required[1])
    api_catalog = load_json_with_authorities(required[2])
    index = load_json_with_authorities(required[3])
    taxonomy = load_json_with_authorities(required[4])
    public_surface = load_text(PUBLIC_SURFACE_FILE)
    diagnostics = ensure_dict(manifest.get("diagnostics"))
    problems: list[str] = []

    if len(ensure_list(manifest.get("items"))) == 0:
        problems.append("empty-manifest-items")
    if len(ensure_list(registry.get("items"))) == 0:
        problems.append("empty-registry-items")
    if len(ensure_list(api_catalog.get("items"))) == 0:
        problems.append("empty-api-catalog-items")
    if len(ensure_list(index.get("items"))) == 0:
        problems.append("empty-designlab-items")
    if len(ensure_list(taxonomy.get("groups"))) == 0:
        problems.append("empty-taxonomy-groups")
    if len(ensure_list(manifest.get("items"))) != len(ensure_list(registry.get("items"))):
        problems.append("manifest-registry-count-drift")
    if len(ensure_list(manifest.get("items"))) != len(ensure_list(index.get("items"))):
        problems.append("manifest-index-count-drift")

    runtime_export_count = diagnostics.get("runtimeExportCount")
    registry_item_count = diagnostics.get("registryItemCount")
    runtime_exports_without_registry = sorted(
        str(item).strip()
        for item in ensure_list(diagnostics.get("runtimeExportsWithoutRegistry"))
        if str(item).strip()
    )
    if runtime_export_count != registry_item_count:
        problems.append(
            f"runtime-registry-count-drift:{runtime_export_count}:{registry_item_count}"
        )
    if runtime_exports_without_registry:
        problems.append(
            "runtime-exports-without-registry:" + ",".join(runtime_exports_without_registry)
        )

    for module_path in sorted(INTERNAL_MODULE_EXPORTS):
        if module_path in public_surface:
            problems.append(f"public-surface-reexports-internal-module:{module_path}")

    internal_consumers = find_internal_import_consumers()
    unexpected_consumers = [
        path
        for path in internal_consumers
        if path not in ALLOWED_INTERNAL_IMPORT_CONSUMERS
    ]
    if unexpected_consumers:
        problems.extend(
            f"unexpected-design-lab-internal-import:{path}" for path in unexpected_consumers
        )

    if problems:
        return fail(SCRIPT, problems)
    return ok(
        SCRIPT,
        "manifest=%d registry=%d api=%d index=%d runtime=%d internalConsumers=%d"
        % (
            len(ensure_list(manifest.get("items"))),
            len(ensure_list(registry.get("items"))),
            len(ensure_list(api_catalog.get("items"))),
            len(ensure_list(index.get("items"))),
            int(runtime_export_count or 0),
            len(internal_consumers),
        ),
    )


if __name__ == "__main__":
    raise SystemExit(main())
