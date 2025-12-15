#!/usr/bin/env python3
"""
Theme Contract v0.1 tutarlılık kontrolü.

Kontroller:
- web/design-tokens/figma.tokens.json içinde meta.themeContract var mı?
- Contract şeması (version/defaultMode/allowedModes/modes/aliases/coerce) tutarlı mı?
- allowedModes ve defaultMode, token'larda gerçekten var olan theme mode key'leri ile uyumlu mu?
- Generated contract (web/design-tokens/generated/theme-contract.json) meta ile aynı mı?
- Repo'da "serban-" mapping kopyası kaldı mı? (istisna: design-tokens, generated, tests)

Kullanım:
  python3 scripts/check_theme_contract_consistency.py
"""

from __future__ import annotations

from pathlib import Path
import json
import os
import sys
from typing import Any, Dict, Iterable, List, Set, Tuple


ROOT = Path(__file__).resolve().parents[1]
TOKENS_PATH = ROOT / "web/design-tokens/figma.tokens.json"
GENERATED_CONTRACT_PATH = ROOT / "web/design-tokens/generated/theme-contract.json"


def read_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def as_str(value: Any) -> str | None:
    return value if isinstance(value, str) and value.strip() else None


def normalize_json(value: Any) -> str:
    return json.dumps(value, sort_keys=True, ensure_ascii=False)


def extract_theme_modes_from_tokens(tokens: Dict[str, Any]) -> Set[str]:
    modes = (
        tokens.get("semantic", {})
        .get("color", {})
        .get("surface", {})
        .get("default", {})
        .get("bg", {})
        .get("modes", {})
    )
    if not isinstance(modes, dict):
        return set()
    return {k for k in modes.keys() if isinstance(k, str) and k.strip()}


def validate_contract(contract: Dict[str, Any], token_theme_modes: Set[str]) -> List[str]:
    errors: List[str] = []

    version = as_str(contract.get("version"))
    if not version:
        errors.append("themeContract.version zorunlu ve non-empty olmalı.")

    default_mode = as_str(contract.get("defaultMode"))
    if not default_mode:
        errors.append("themeContract.defaultMode zorunlu ve non-empty olmalı.")

    allowed_modes_raw = contract.get("allowedModes")
    if not isinstance(allowed_modes_raw, list) or not allowed_modes_raw:
        errors.append("themeContract.allowedModes zorunlu ve non-empty list olmalı.")
        allowed_modes: List[str] = []
    else:
        allowed_modes = [m for m in allowed_modes_raw if isinstance(m, str) and m.strip()]
        if len(allowed_modes) != len(allowed_modes_raw):
            errors.append("themeContract.allowedModes yalnız string değerlerden oluşmalı.")
        if len(set(allowed_modes)) != len(allowed_modes):
            errors.append("themeContract.allowedModes içinde duplicate değer var.")

    if default_mode and allowed_modes and default_mode not in allowed_modes:
        errors.append("themeContract.defaultMode allowedModes içinde olmalı.")

    if token_theme_modes and allowed_modes:
        unknown = sorted(set(allowed_modes) - token_theme_modes)
        if unknown:
            errors.append(
                "themeContract.allowedModes token theme mode key'leri ile uyumlu değil: "
                + ", ".join(unknown)
            )

    modes = contract.get("modes")
    if not isinstance(modes, dict) or not modes:
        errors.append("themeContract.modes zorunlu ve non-empty object olmalı.")
        modes = {}

    for mode_key in allowed_modes:
        entry = modes.get(mode_key)
        if not isinstance(entry, dict):
            errors.append(f"themeContract.modes[{mode_key!r}] object olmalı.")
            continue
        appearance = as_str(entry.get("appearance"))
        if appearance not in {"light", "dark", "high-contrast"}:
            errors.append(f"themeContract.modes[{mode_key!r}].appearance geçersiz: {entry.get('appearance')!r}")

    aliases = contract.get("aliases")
    if not isinstance(aliases, dict) or not aliases:
        errors.append("themeContract.aliases zorunlu ve non-empty object olmalı.")
        aliases = {}

    appearance_aliases = aliases.get("appearance")
    if not isinstance(appearance_aliases, dict) or not appearance_aliases:
        errors.append("themeContract.aliases.appearance zorunlu ve non-empty object olmalı.")
        appearance_aliases = {}

    for alias_key, mode_key in appearance_aliases.items():
        if not isinstance(alias_key, str) or not alias_key.strip():
            errors.append("themeContract.aliases.appearance key string olmalı.")
            continue
        if not isinstance(mode_key, str) or not mode_key.strip():
            errors.append(f"themeContract.aliases.appearance[{alias_key!r}] string modeKey olmalı.")
            continue
        if allowed_modes and mode_key not in allowed_modes:
            errors.append(f"themeContract.aliases.appearance[{alias_key!r}] allowedModes dışına çıkıyor: {mode_key!r}")

    density_aliases = aliases.get("density")
    if density_aliases is not None and not isinstance(density_aliases, dict):
        errors.append("themeContract.aliases.density varsa object olmalı.")
        density_aliases = None
    if isinstance(density_aliases, dict):
        for alias_key, mode_key in density_aliases.items():
            if not isinstance(alias_key, str) or not alias_key.strip():
                errors.append("themeContract.aliases.density key string olmalı.")
                continue
            if not isinstance(mode_key, str) or not mode_key.strip():
                errors.append(f"themeContract.aliases.density[{alias_key!r}] string modeKey olmalı.")
                continue
            if allowed_modes and mode_key not in allowed_modes:
                errors.append(f"themeContract.aliases.density[{alias_key!r}] allowedModes dışına çıkıyor: {mode_key!r}")

    coerce = contract.get("coerce")
    if not isinstance(coerce, list):
        errors.append("themeContract.coerce zorunlu ve list olmalı (boş olabilir).")
        coerce = []

    for idx, rule in enumerate(coerce):
        if not isinstance(rule, dict):
            errors.append(f"themeContract.coerce[{idx}] object olmalı.")
            continue
        when = rule.get("when")
        mode_key = rule.get("mode")
        if not isinstance(when, dict) or not when:
            errors.append(f"themeContract.coerce[{idx}].when non-empty object olmalı.")
        else:
            for k, v in when.items():
                if k not in {"appearance", "density"}:
                    errors.append(f"themeContract.coerce[{idx}].when unsupported key: {k!r}")
                if not isinstance(v, str) or not v.strip():
                    errors.append(f"themeContract.coerce[{idx}].when[{k!r}] string olmalı.")
        if not isinstance(mode_key, str) or not mode_key.strip():
            errors.append(f"themeContract.coerce[{idx}].mode string olmalı.")
        elif allowed_modes and mode_key not in allowed_modes:
            errors.append(f"themeContract.coerce[{idx}].mode allowedModes dışına çıkıyor: {mode_key!r}")

    return errors


def iter_web_source_files() -> Iterable[Path]:
    web_root = ROOT / "web"
    if not web_root.exists():
        return []

    allowed_ext = {".ts", ".tsx", ".js", ".jsx", ".mjs", ".css", ".scss", ".md"}
    skip_dirs = {"node_modules", "dist", "build", "coverage", "test-results", ".git", ".next"}

    for dirpath, dirnames, filenames in os.walk(web_root):
        dirnames[:] = [d for d in dirnames if d not in skip_dirs]
        for name in filenames:
            p = Path(dirpath) / name
            if p.suffix not in allowed_ext:
                continue

            rel = p.relative_to(ROOT)
            if str(rel).startswith("web/design-tokens/"):
                continue
            if str(rel).startswith("web/tests/"):
                continue
            if str(rel).endswith("web/apps/mfe-shell/src/styles/theme.css"):
                continue

            yield p


def find_serban_mapping_copies() -> List[str]:
    hits: List[str] = []
    for path in iter_web_source_files():
        try:
            text = path.read_text(encoding="utf-8")
        except UnicodeDecodeError:
            continue

        if "serban-" not in text:
            continue

        for idx, line in enumerate(text.splitlines(), start=1):
            if "serban-" in line:
                rel = path.relative_to(ROOT)
                hits.append(f"{rel}:{idx}")
                if len(hits) >= 50:
                    return hits
    return hits


def main() -> int:
    if not TOKENS_PATH.exists():
        print(f"[check_theme_contract_consistency] FAIL: tokens bulunamadı: {TOKENS_PATH}")
        return 1

    tokens = read_json(TOKENS_PATH)
    meta = tokens.get("meta") if isinstance(tokens, dict) else None
    contract = meta.get("themeContract") if isinstance(meta, dict) else None
    if not isinstance(contract, dict):
        print("[check_theme_contract_consistency] FAIL: meta.themeContract yok veya object değil.")
        return 1

    token_theme_modes = extract_theme_modes_from_tokens(tokens)
    errors = validate_contract(contract, token_theme_modes)

    if not GENERATED_CONTRACT_PATH.exists():
        errors.append(f"generated contract yok: {GENERATED_CONTRACT_PATH.relative_to(ROOT)} (tokens:build çalıştırın)")
    else:
        generated = read_json(GENERATED_CONTRACT_PATH)
        if normalize_json(generated) != normalize_json(contract):
            errors.append(
                "generated contract meta ile aynı değil (drift). tokens:build çalıştırın."
            )

    serban_hits = find_serban_mapping_copies()
    if serban_hits:
        errors.append("serban-* mapping kopyası bulundu (ilk 10): " + ", ".join(serban_hits[:10]))

    if errors:
        print("[check_theme_contract_consistency] FAIL:")
        for e in errors:
            print(f"- {e}")
        return 1

    print("[check_theme_contract_consistency] OK ✅")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

