# Admin Reference App

Settings panel and user management using @mfe/design-system + @mfe/platform-capabilities.

## Components Used

- **Tabs** — settings categories (General, Security, Notifications, Integrations)
- **Switch, FormBuilder** — settings forms
- **DataGrid** — user list with role management
- **Avatar, Badge** — user profile cards
- **usePermission** — RBAC-based visibility controls

## Quick Start

```bash
npx @mfe/create-app my-admin --template admin
cd my-admin
pnpm dev
```

## First-Value Time Target

Under 15 minutes from `create-app` to a working admin panel with mock users.

## Features Demonstrated

- Tabbed settings interface with form persistence
- User list with search, filter, role assignment
- Invite flow with email validation
- RBAC-controlled UI sections
- Audit log viewer
- SSO configuration panel
