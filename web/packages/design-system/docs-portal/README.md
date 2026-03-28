# @mfe/design-system — Documentation Portal

Public documentation site for the design system. Built with [Astro Starlight](https://starlight.astro.build/).

## Setup

```bash
cd docs-portal
npm install
npm run dev      # http://localhost:4321
npm run build    # Static output → dist/
```

## Structure

```
docs-portal/
├── astro.config.mjs      # Starlight config (sidebar, search, i18n)
├── src/
│   ├── content/
│   │   └── docs/          # MDX documentation pages
│   │       ├── getting-started/
│   │       ├── components/     # Auto-generated from API reference
│   │       ├── patterns/
│   │       ├── tokens/
│   │       ├── guides/
│   │       └── migration/
│   └── components/         # Custom Starlight components (playground, wizard)
├── public/                 # Static assets
└── package.json
```

## Features (Planned)

- [x] Starlight base config
- [ ] Auto-generated API reference from TypeDoc
- [ ] Interactive component playground (StackBlitz embed)
- [ ] Component selection wizard
- [ ] Semantic search (Orama)
- [ ] Versioned docs (v1.x / v2.x)
- [ ] TR + EN i18n support
- [ ] Lighthouse Performance ≥ 95, Accessibility = 100

## Deployment

Static build → GitHub Pages or Cloudflare Pages.
