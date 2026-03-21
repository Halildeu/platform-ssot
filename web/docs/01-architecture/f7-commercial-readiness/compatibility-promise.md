# Compatibility Promise

> Status: **Final** | Last updated: 2026-03-21

---

## Browser Support

| Browser | Minimum Version | Testing Target |
|---------|----------------|---------------|
| **Chrome** | 90+ | Latest 2 versions |
| **Firefox** | 90+ | Latest 2 versions |
| **Safari** | 15+ | Latest 2 versions |
| **Edge** | 90+ | Latest 2 versions |

### Mobile

| Browser | Minimum Version |
|---------|----------------|
| iOS Safari | 15+ |
| Chrome Android | 90+ |

### Notes

- Testing is automated against the **latest 2 versions** of each browser via Playwright
- Older versions within the minimum range receive best-effort support (bugs accepted, not actively tested)
- IE 11 is **not supported**

---

## Framework Compatibility

### React

| Version | Support Level |
|---------|-------------|
| **18.x** | Fully supported (peer dependency range) |
| **19.x** | Fully supported (peer dependency range) |
| 17.x | Not supported |

- Peer dependency declared as `"react": "^18.0.0 \|\| ^19.0.0"`
- Server Components: compatible (all components use `"use client"` directive where needed)
- Concurrent Mode: compatible and tested

### TypeScript

| Version | Support Level |
|---------|-------------|
| **5.x** | Fully supported |
| 4.x | Not supported |

- All packages ship `.d.ts` type declarations
- Strict mode (`strict: true`) compatible
- Module resolution: `bundler` and `node16` supported

### Node.js (SSR / Build)

| Version | Support Level |
|---------|-------------|
| **22.x** | Fully supported (active LTS) |
| **20.x** | Fully supported (maintenance LTS) |
| 18.x | Not supported |

- Required for SSR rendering, build tooling, and development server
- ESM and CJS dual-publish for all packages

---

## Peer Dependency Matrix

| Dependency | Supported Range | Lock Strategy | Update Policy |
|-----------|----------------|--------------|--------------|
| **AG Grid** | 34.x | Locked to major | Updated in our major releases only |
| **AG Charts** | 12.x | Locked to major | Updated in our major releases only |
| **React** | 18.x, 19.x | Peer dep range | New React majors added in minor release |
| **TypeScript** | 5.x | Minimum version | New TS majors evaluated within 1 month |

### AG Grid / AG Charts

- AG Grid Enterprise license is **per-developer** and managed separately by the consuming organization
- Our packages declare AG Grid/Charts as peer dependencies; they are not bundled
- Minor and patch updates within the locked major are the consumer's responsibility
- Major version bumps (e.g., AG Grid 35.x) will only be adopted in our next major release with a migration guide

---

## Build Tool Compatibility

| Tool | Tested Versions |
|------|----------------|
| **Vite** | 5.x, 6.x |
| **webpack** | 5.x |
| **Next.js** | 14.x, 15.x |
| **Turbopack** | Experimental support |

- Packages are distributed as ES modules with CJS fallback
- Tree-shaking verified with Vite and webpack
- CSS modules and Tailwind CSS v4 compatible

---

## Compatibility Testing

- **CI matrix**: every PR tested against minimum and latest supported versions
- **Browser matrix**: Playwright tests on Chrome, Firefox, Safari (latest 2)
- **Quarterly audit**: full compatibility matrix verified before each major/LTS release
- **Regression suite**: visual regression tests for cross-browser rendering consistency
