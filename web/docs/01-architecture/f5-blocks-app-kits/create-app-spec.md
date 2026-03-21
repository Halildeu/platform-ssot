# create-app CLI Specification

## Usage
```bash
npx @mfe/create-app my-app
npx @mfe/create-app my-app --template dashboard
npx @mfe/create-app my-app --template crud
npx @mfe/create-app my-app --template admin
```

## Templates

### `dashboard` (default)
- KPIDashboardBlock + ChartGridBlock
- Theme integration (light/dark)
- Navigation sidebar
- Mock data

### `crud`
- CrudPageTemplate with DataListBlock + DetailViewBlock + CreateEditFormBlock
- Sample entity (Contacts)
- Search + pagination
- Mock API service

### `admin`
- SettingsPageTemplate + UserManagementBlock
- Role-based access control skeleton
- Profile settings section

## Generated Structure
```
my-app/
├── package.json
├── tsconfig.json
├── vite.config.ts
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── pages/
│   │   ├── DashboardPage.tsx
│   │   ├── ListPage.tsx
│   │   └── SettingsPage.tsx
│   ├── services/
│   │   └── api.ts (mock)
│   └── theme/
│       └── tokens.css
├── public/
│   └── index.html
└── README.md
```

## Dependencies
```json
{
  "dependencies": {
    "@mfe/design-system": "latest",
    "@mfe/blocks": "latest",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "react-router-dom": "^6.0.0"
  }
}
```

## Implementation Status
- [ ] CLI package scaffold
- [ ] Template generator
- [ ] Interactive prompts (inquirer)
- [ ] Post-install setup script

## Note
CLI implementation is v2 scope. This spec defines the contract for when implementation begins.
