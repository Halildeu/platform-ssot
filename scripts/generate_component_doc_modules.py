#!/usr/bin/env python3
from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
MANIFEST_PATH = ROOT / "web/packages/ui-kit/src/catalog/component-manifest.v1.json"
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
    manifest = _load_json(MANIFEST_PATH)
    items = manifest.get("items")
    if not isinstance(items, list):
        raise SystemExit("component manifest has invalid shape")

    ENTRIES_DIR.mkdir(parents=True, exist_ok=True)
    generated_files: list[tuple[str, str]] = []

    for raw_item in items:
        if not isinstance(raw_item, dict):
            continue
        name = str(raw_item.get("name") or "").strip()
        index_item = raw_item.get("indexItem")
        api_item = raw_item.get("apiItem")
        if not name:
            continue
        if not isinstance(index_item, dict):
            raise SystemExit(f"component manifest indexItem missing for {name}")

        safe_name = _safe_name(name)
        rel_import = f"./entries/{safe_name}.doc"
        generated_files.append((name, rel_import))
        target = ENTRIES_DIR / f"{safe_name}.doc.ts"
        target.write_text(
            "\n".join(
                [
                    "import type { DesignLabComponentDocEntry } from '../types';",
                    "",
                    "const entry: DesignLabComponentDocEntry = {",
                    f"  name: {json.dumps(name, ensure_ascii=False)},",
                    f"  indexItem: {_ts_literal(index_item)},",
                    f"  apiItem: {_ts_literal(api_item) if isinstance(api_item, dict) else 'null'},",
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

    api_meta = manifest.get("apiCatalogMeta") or {}

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
