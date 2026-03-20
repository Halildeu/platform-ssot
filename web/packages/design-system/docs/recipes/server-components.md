# React Server Components

> How to use the design system with Next.js App Router and React Server Components.

---

## Import decision tree

```
Can you import it in a Server Component?
  |
  +-- Types, tokens (CSS), cn() utility --> YES, safe in RSC
  |
  +-- Any React component (Button, Input, etc.) --> NO, needs "use client"
  |
  +-- ThemeProvider, DesignSystemProvider, useTheme() --> NO, needs "use client"
  |
  +-- Theme controller (setAppearance, etc.) --> NO, browser API required
```

| Export category | Safe in RSC | Notes |
|-----------------|:-----------:|-------|
| TypeScript types (`ButtonProps`, `ThemeAxes`, etc.) | Yes | Types are erased at build time |
| CSS file (`dist/styles.css`) | Yes | Import in `layout.tsx` |
| `cn()` utility | Yes | Pure function (`clsx` + `tailwind-merge`) |
| All components | No | Use hooks internally (`useState`, `useId`, etc.) |
| Providers (`ThemeProvider`, `DesignSystemProvider`) | No | Use `useState`, `useEffect`, `localStorage` |
| `useTheme()` | No | React context hook |

For a complete per-component breakdown, see [CLIENT-ONLY-COMPONENTS.md](../CLIENT-ONLY-COMPONENTS.md) and [SSR-RSC-BOUNDARY.md](../SSR-RSC-BOUNDARY.md).

---

## Next.js App Router setup

### 1. Provider wrapper (client boundary)

```tsx
// app/providers.tsx
"use client";

import { DesignSystemProvider } from "@mfe/design-system";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <DesignSystemProvider
      defaultTheme={{ appearance: "light", density: "comfortable" }}
      locale="en"
    >
      {children}
    </DesignSystemProvider>
  );
}
```

### 2. Root layout (stays Server Component)

```tsx
// app/layout.tsx
import "@mfe/design-system/dist/styles.css";
import { Providers } from "./providers";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

### 3. Pages stay as Server Components

```tsx
// app/dashboard/page.tsx  (Server Component -- no "use client")
import { getMetrics } from "@/lib/data";
import { MetricsPanel } from "./metrics-panel";

export default async function DashboardPage() {
  const metrics = await getMetrics();

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold text-[var(--text-primary)]">Dashboard</h1>
      <MetricsPanel data={metrics} />
    </main>
  );
}
```

---

## Server/client split pattern

Push the `"use client"` boundary as low as possible. Fetch data in Server Components, render interactive UI in Client Components.

```tsx
// app/users/page.tsx  (Server Component)
import { getUsers } from "@/lib/data";
import { UserTable } from "./user-table";

export default async function UsersPage() {
  const users = await getUsers();
  return <UserTable users={users} />;
}
```

```tsx
// app/users/user-table.tsx
"use client";

import { Input, Button, TableSimple } from "@mfe/design-system";
import { useState } from "react";

interface User {
  id: string;
  name: string;
  role: string;
}

export function UserTable({ users }: { users: User[] }) {
  const [search, setSearch] = useState("");
  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="flex flex-col gap-4">
      <Input
        label="Search users"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <TableSimple
        columns={[
          { key: "name", title: "Name" },
          { key: "role", title: "Role" },
        ]}
        dataSource={filtered}
      />
    </div>
  );
}
```

---

## Key rules

1. **Never mark `page.tsx` or `layout.tsx` as `"use client"`** unless the entire page is interactive. Keep them as Server Components for server-side data fetching and streaming.
2. **Create small client boundary components** that wrap only the interactive parts.
3. **Token CSS variables work everywhere** -- `var(--surface-default)` in Tailwind arbitrary values or inline styles works in both server-rendered and client-rendered HTML.
4. **TypeScript types can always be imported** from `@mfe/design-system` without adding a client boundary.

---

## Related Docs

- [SSR-RSC-BOUNDARY.md](../SSR-RSC-BOUNDARY.md) -- Full SSR/RSC boundary decision and strategy
- [CLIENT-ONLY-COMPONENTS.md](../CLIENT-ONLY-COMPONENTS.md) -- Per-component client-only audit
- [nextjs.md](./nextjs.md) -- Detailed Next.js integration recipe with forms and navigation
