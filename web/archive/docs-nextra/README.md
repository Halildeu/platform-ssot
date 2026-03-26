# @mfe/docs

Public-facing documentation portal for @mfe/design-system and the Enterprise X Suite.

Built with [Nextra 3](https://nextra.site/) on Next.js 14, exported as static HTML.

## Development

```bash
pnpm install
pnpm dev        # http://localhost:3100
```

## Build

```bash
pnpm build      # Static export to out/
```

## Structure

```
pages/
  index.mdx              # Landing page
  getting-started.mdx    # Installation & quick start
  x-suite/               # X Suite package docs
  blocks/                # Blocks & App Kits
  migration/             # Migration guides
```
