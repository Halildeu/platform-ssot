# Licensing Framework

> Status: **Final** | Last updated: 2026-03-21

---

## License Structure

| Package / Layer | License | Distribution |
|----------------|---------|-------------|
| **Core design-system** | MIT | Published to npm (public) |
| **X Suite packages** | Internal / Proprietary | Not published to npm |
| **Blocks package** | Internal / Proprietary | Not published to npm |
| **AG Grid Enterprise** | AG Grid Enterprise License | Per-developer, managed separately |
| **AG Charts Enterprise** | AG Charts Enterprise License | Per-developer, managed separately |

---

## Package Details

### Core Design System (MIT)

- **License**: [MIT License](https://opensource.org/licenses/MIT)
- **Scope**: Foundational UI components, tokens, hooks, utilities
- **Distribution**: Public npm registry
- **Contribution**: Open to external contributions under MIT terms
- **Includes**: Button, Input, Select, Modal, Tabs, Layout primitives, theme tokens, utility hooks

### X Suite Packages (Internal)

- **License**: Internal / Proprietary (not open source)
- **Scope**: Advanced enterprise components built on AG Grid and AG Charts
- **Distribution**: Internal registry only, not published to public npm
- **Packages**:
  - `x-data-grid` — Advanced data grid with server-side features, export, pivoting
  - `x-charts` — Chart components with advanced chart types
  - `x-scheduler` — Calendar/scheduling component
  - `x-kanban` — Drag-and-drop kanban board
  - `x-editor` — Rich text editor (Tiptap-based)
  - `x-form-builder` — Form designer and renderer

### Blocks Package (Internal)

- **License**: Internal / Proprietary (not open source)
- **Scope**: Pre-composed application patterns and page-level building blocks
- **Distribution**: Internal registry only

---

## Third-Party License Management

### AG Grid / AG Charts

- **License type**: Commercial Enterprise License
- **Model**: Per-developer seat
- **Responsibility**: Each consuming organization manages its own AG Grid/Charts license directly with AG Grid Ltd
- **Our packages**: Declare AG Grid/Charts as **peer dependencies** (not bundled, not sublicensed)
- **Compliance**: Organizations must hold valid licenses for all developers using X Suite components that depend on AG Grid/Charts

### Dependency License Compliance

- **Tooling**: `license-checker` integrated into CI pipeline
- **Audit**: All direct and transitive dependency licenses verified on every release
- **SBOM**: Software Bill of Materials available on request (CycloneDX format)
- **Allowed licenses**: MIT, Apache-2.0, BSD-2-Clause, BSD-3-Clause, ISC, 0BSD, CC0-1.0
- **Restricted**: No **GPL**, **LGPL**, **AGPL**, or **SSPL** dependencies allowed in the core design-system or any published package
- **Review process**: Any new dependency with a non-standard license must be approved by the architecture team before merge

### License Checker CI Gate

```bash
# Runs in CI on every PR
npx license-checker --production --failOn "GPL-2.0;GPL-3.0;LGPL-2.1;LGPL-3.0;AGPL-3.0;SSPL-1.0"
```

- Blocks merge if any production dependency uses a restricted license
- Dev dependencies are audited but do not block (they are not distributed)

---

## License File Requirements

Every published package must include:

1. `LICENSE` file at the package root (MIT text for core, proprietary notice for internal)
2. `license` field in `package.json` set to `"MIT"` or `"SEE LICENSE IN LICENSE"`
3. Copyright header in source files (recommended, not enforced by CI)

---

## Future Considerations

- **CLA (Contributor License Agreement)**: To be evaluated if external contributions grow
- **License scanning dashboard**: Automated dashboard for real-time license compliance visibility
- **SBOM automation**: Automated CycloneDX SBOM generation as part of the release pipeline
