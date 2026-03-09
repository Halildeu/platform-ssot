#!/usr/bin/env python3
from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
DESIGN_LAB_INDEX_PATH = ROOT / "web/apps/mfe-shell/src/pages/admin/design-lab.index.json"
API_CATALOG_PATH = ROOT / "web/packages/ui-kit/src/catalog/component-api-catalog.v1.json"
DOC_ROOT = ROOT / "web/packages/ui-kit/src/catalog/component-docs"
ENTRIES_DIR = DOC_ROOT / "entries"
INDEX_FILE = DOC_ROOT / "index.ts"


def _load_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def _safe_name(value: str) -> str:
    safe = re.sub(r"[^A-Za-z0-9_]+", "_", value.strip())
    safe = re.sub(r"_+", "_", safe).strip("_")
    if not safe:
        raise ValueError(f"INVALID_COMPONENT_NAME:{value!r}")
    return safe


def _ts_literal(value: Any) -> str:
    return json.dumps(value, ensure_ascii=False, indent=2, sort_keys=False)


def main() -> int:
    design_lab_index = _load_json(DESIGN_LAB_INDEX_PATH)
    api_catalog = _load_json(API_CATALOG_PATH)

    items = design_lab_index.get("items")
    api_items = api_catalog.get("items")
    if not isinstance(items, list) or not isinstance(api_items, list):
        raise SystemExit("design-lab index or api catalog has invalid shape")

    api_map = {}
    for api_item in api_items:
        if isinstance(api_item, dict):
            name = str(api_item.get("name") or "").strip()
            if name:
                api_map[name] = api_item

    ENTRIES_DIR.mkdir(parents=True, exist_ok=True)
    generated_files: list[tuple[str, str]] = []

    for raw_item in items:
        if not isinstance(raw_item, dict):
            continue
        name = str(raw_item.get("name") or "").strip()
        if not name:
            continue

        safe_name = _safe_name(name)
        rel_import = f"./entries/{safe_name}.doc"
        generated_files.append((name, rel_import))

        api_item = api_map.get(name)
        target = ENTRIES_DIR / f"{safe_name}.doc.ts"
        target.write_text(
            "\n".join(
                [
                    "import type { DesignLabComponentDocEntry } from '../types';",
                    "",
                    "const entry: DesignLabComponentDocEntry = {",
                    f"  name: {json.dumps(name, ensure_ascii=False)},",
                    f"  indexItem: {_ts_literal(raw_item)},",
                    f"  apiItem: {_ts_literal(api_item) if api_item is not None else 'null'},",
                    "};",
                    "",
                    "export default entry;",
                    "",
                ]
            ),
            encoding="utf-8",
        )

    imports: list[str] = []
    entries: list[str] = []
    for idx, (name, rel_import) in enumerate(generated_files, start=1):
        symbol = f"entry{idx}"
        imports.append(f"import {symbol} from {json.dumps(rel_import)};")
        entries.append(symbol)

    api_meta = {
        "version": api_catalog.get("version"),
        "subject_id": api_catalog.get("subject_id"),
        "wave_id": api_catalog.get("wave_id"),
    }

    INDEX_FILE.write_text(
        "\n".join(
            [
                "import type { DesignLabApiCatalogMeta, DesignLabComponentDocEntry } from './types';",
                *imports,
                "",
                f"export const designLabComponentDocEntries: DesignLabComponentDocEntry[] = [{', '.join(entries)}];",
                "",
                "export const designLabIndexItems = designLabComponentDocEntries.map((entry) => entry.indexItem);",
                "export const designLabApiItems = designLabComponentDocEntries.flatMap((entry) => (entry.apiItem ? [entry.apiItem] : []));",
                "export const designLabComponentDocMap = new Map(",
                "  designLabComponentDocEntries.map((entry) => [entry.name, entry] as const),",
                ");",
                f"export const designLabApiCatalogMeta: DesignLabApiCatalogMeta = {_ts_literal(api_meta)};",
                "",
            ]
        ),
        encoding="utf-8",
    )

    print(
        json.dumps(
            {
                "status": "OK",
                "generated_entries": len(generated_files),
                "entries_dir": str(ENTRIES_DIR),
                "index_file": str(INDEX_FILE),
            },
            ensure_ascii=False,
            sort_keys=True,
        )
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
