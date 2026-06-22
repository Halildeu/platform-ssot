# CLAUDE.md — STOP. THIS REPO IS DEPRECATED.

> **Halildeu/platform-ssot is DEPRECATED, audit-only, and scheduled for archive.**
> Faz 19 split-repo authority transfer completed **2026-04-25**. Active development moved to **`platform-backend`** + **`platform-web`** + **`platform-k8s-gitops`**. **Do not commit code to this repo. Do not open PRs. Read-only audit is fine.**

See `AGENTS.md` for the full deprecation rationale, GHCR 403 evidence, the canonical-repo mapping table, and the in-flight ssot → canonical PR migration list.

@AGENTS.md

---

> Below: legacy guidance preserved for read-only context. **Do not act on it** — it describes a build/deploy pipeline that no longer ships images for this repo.

## Claude Code-Specific (AGENTS.md'de olmayan)

### Build & Run
- Install: `pip install -e ".[dev]"`
- Cockpit UI: `python3 extensions/PRJ-UI-COCKPIT-LITE/server.py --port 8787`
- Cockpit API: `python3 -m src.ops.manage cockpit-serve --workspace-root .cache/ws_customer_default --port 8790`

### Worktree Conventions
- Branch naming: `claude/<worktree-name>`
- Always work in worktree for non-trivial changes
- Run validation before commit (schema + standards + tests)

### Code Conventions (Claude-only ek)
- Imports: use `src.shared.utils` (load_json, write_json_atomic, now_iso8601, hash_string)
- New files < 800 lines (script-budget enforced)
- Python: type hints, docstrings for public functions
- Error handling: fail-closed, always produce structured error output

### Language
- User communicates in Turkish; respond in Turkish for conversation
- Code, comments, variable names: English
- Docs: Turkish or English based on existing file language

### Path-Specific Rules
See `.claude/rules/` for detailed conventions per directory.
