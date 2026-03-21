# First Contribution Guide

Welcome! This guide walks you through making your first contribution to the
monorepo, from setup to merged PR.

## Prerequisites

| Tool   | Version | Install                          |
|--------|---------|----------------------------------|
| Node   | 22.x    | `nvm install 22` or `fnm use 22` |
| pnpm   | 10.x    | `corepack enable && corepack prepare pnpm@latest --activate` |
| Git    | 2.40+   | System package manager           |

## Clone and Setup

```bash
git clone git@github.com:Halildeu/web.git
cd web
nvm use                   # picks up .nvmrc → Node 22
pnpm install              # installs all workspace dependencies
pnpm build:design-system  # builds the shared design-system
pnpm dev:shell            # starts the shell on localhost:3000
```

That's it -- five commands from zero to a running local environment.

## Pick a Good First Issue

1. Go to the repository's **Issues** tab on GitHub.
2. Filter by the `good first issue` label.
3. Pick one that interests you and leave a comment saying you'll work on it.
4. If no good-first-issues exist, ask in `#frontend-platform` for suggestions.

## Make Your Change

1. Create a feature branch from `main`:
   ```bash
   git checkout -b feat/your-change-description
   ```

2. Make your edits. Follow existing patterns in the codebase:
   - Components go in `packages/design-system/src/components/`
   - x-suite features go in `packages/x-*/src/`
   - Tests live next to the source file: `ComponentName.test.tsx`

3. Write or update tests for your change.

4. Use [Conventional Commits](https://www.conventionalcommits.org/) for your
   commit messages:
   ```
   feat(design-system): add Tooltip arrow placement prop
   fix(x-data-grid): prevent column resize on mobile tap
   docs: update troubleshooting guide with port conflict
   ```

## Run Tests Locally

```bash
# Run unit tests for the package you changed
pnpm --filter @mfe/design-system test

# Run the full lint suite
pnpm lint

# Type-check
pnpm typecheck

# Run Storybook to visually verify (if you changed a component)
pnpm storybook
```

Fix any failures before pushing. CI will run the same checks.

## Create a Pull Request

```bash
git push -u origin feat/your-change-description
```

Then open a PR on GitHub. The PR template will guide you through:

- **Title**: Use the same conventional commit prefix (`feat:`, `fix:`, etc.)
- **Description**: Explain what changed and why.
- **Screenshots**: Include before/after if visual changes are involved.
- **Testing**: Describe how you verified the change works.

## What Happens After Your PR

1. **CI runs automatically**: lint, typecheck, unit tests, Chromatic visual
   regression, and bundle size checks.
2. **Code review**: A maintainer reviews your PR. They may request changes --
   this is normal and part of the process.
3. **Address feedback**: Push additional commits to the same branch. Avoid
   force-pushing so reviewers can see incremental changes.
4. **Merge**: Once approved and CI is green, a maintainer merges using squash
   merge. Your commit appears on `main`.
5. **Release**: release-please automatically creates a release PR that batches
   merged changes. When that PR merges, packages are published to npm.

## Tips

- Keep PRs small and focused -- one logical change per PR.
- If your change is large, open a draft PR early to get directional feedback.
- Run `pnpm build:design-system` after pulling `main` to avoid stale dist errors.
- Check the [Troubleshooting](/troubleshooting) page if you hit setup issues.
