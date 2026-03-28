# Architecture Overview

## System Diagram

```
+-------------------------------------------------------------------+
|                          Shell (Host)                              |
|  +-------------------------------------------------------------+  |
|  |  Keycloak SSO  |  Router  |  Module Federation Runtime      |  |
|  +-------------------------------------------------------------+  |
|         |                |                    |                    |
|    Auth Token       Route Match          Remote Load              |
|         |                |                    |                    |
|  +------v------+  +------v------+  +---------v---------+         |
|  |   MFE: CRM  |  | MFE: ERP   |  | MFE: Accounting   |  ...   |
|  +------+------+  +------+------+  +---------+---------+         |
|         |                |                    |                    |
|  +------v----------------v--------------------v---------+         |
|  |                 @mfe/design-system                    |         |
|  |  Tokens | Components | Layouts | Theme Provider      |         |
|  +------+----------------+--------------------+---------+         |
|         |                |                    |                    |
|  +------v------+  +------v------+  +---------v---------+         |
|  | x-data-grid |  |  x-charts   |  |  x-scheduler      |         |
|  | x-kanban    |  |  x-editor   |  |  x-form-builder   |         |
|  +------+------+  +------+------+  +---------+---------+         |
|         |                |                    |                    |
|  +------v----------------v--------------------v---------+         |
|  |                    Blocks                             |         |
|  |  Prebuilt page sections composed from x-suite + DS   |         |
|  +------------------------------------------------------+         |
+-------------------------------------------------------------------+
```

## Module Federation Architecture

The platform uses Webpack Module Federation to compose independent micro-frontends
at runtime. Each MFE is built and deployed independently while sharing a common
dependency layer.

**Host (Shell)**
- Provides the application chrome: top nav, sidebar, auth context
- Loads MFE remotes on demand via dynamic `import()`
- Shares `react`, `react-dom`, and `@mfe/design-system` as singleton dependencies

**Remotes (MFEs)**
- Self-contained applications exposing one or more routes
- Consume shared design-system tokens and components
- Communicate with the shell via a lightweight event bus

**Shared Libraries**
- `@mfe/design-system` is marked as a singleton shared module
- Version mismatches fall back to the host's version to prevent duplicate React trees

## Package Dependency Graph

```
create-app
  (scaffolds new MFEs or packages)

blocks
  └── @mfe/design-system
  └── x-data-grid
  └── x-charts
  └── x-scheduler
  └── x-kanban
  └── x-editor
  └── x-form-builder

x-data-grid    ──┐
x-charts       ──┤
x-scheduler    ──┼── @mfe/design-system (tokens + base components)
x-kanban       ──┤
x-editor       ──┤
x-form-builder ──┘

@mfe/design-system
  └── design-tokens (JSON / CSS custom properties)
```

Key rules:
- `design-system` has **zero** dependencies on x-suite or blocks
- x-suite packages depend only on `design-system`, never on each other
- `blocks` composes x-suite and design-system into higher-level page sections
- MFEs consume any combination of the above

## Data Flow

```
Browser
  │
  ├── GET shell.example.com
  │     └── Shell loads, checks session
  │
  ├── Redirect to Keycloak (if unauthenticated)
  │     └── User logs in, receives JWT
  │
  ├── Shell receives token, stores in auth context
  │     └── Keycloak handles login only; authorization via permission-service
  │
  ├── Shell resolves route → loads MFE remote
  │     └── MFE renders, attaches Bearer token to API calls
  │
  └── MFE → Backend service (REST / GraphQL)
        └── permission-service validates token claims per request
```

Authorization is **not** embedded in Keycloak roles. The permission-service owns
all authorization logic: role-to-permission mapping, resource scoping, and
row-level access. Keycloak is the identity provider only.

## Design Lab

The Design Lab is the internal component development and quality environment:

```
+--------------------+     +------------------+     +----------------+
|  Component Catalog |---->|   Quality Tab    |---->|  Live Preview  |
|  (Storybook)       |     |  - a11y audit    |     |  - iframe      |
|  - all variants    |     |  - unit coverage |     |  - theme swap  |
|  - arg controls    |     |  - bundle size   |     |  - viewport    |
+--------------------+     +------------------+     +----------------+
```

- **Component Catalog**: Storybook-based, auto-discovered stories for every
  exported component in design-system and x-suite
- **Quality Tab**: Per-component quality metrics -- accessibility score,
  test coverage percentage, bundle size delta
- **Live Preview**: Isolated iframe rendering with theme switching and
  responsive viewport controls for visual QA
