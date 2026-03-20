# Next.js App Router Integration

## Installation

```bash
npm install @mfe/design-system
```

## DesignSystemProvider Setup (layout.tsx)

`DesignSystemProvider` (which wraps `ThemeProvider` + `LocaleProvider`) uses
browser APIs (`localStorage`, `document.documentElement`) and must run as a
Client Component.

Create a client-boundary wrapper:

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

Then use it in the root layout (which stays a Server Component):

```tsx
// app/layout.tsx
import { Providers } from "./providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

### Using ThemeProvider directly

If you only need theming without locale/direction support:

```tsx
"use client";

import { ThemeProvider } from "@mfe/design-system";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultAxes={{ appearance: "light" }}>
      {children}
    </ThemeProvider>
  );
}
```

### Reading theme in Client Components

```tsx
"use client";

import { useTheme } from "@mfe/design-system";

export function ThemeToggle() {
  const { axes, setAppearance } = useTheme();

  return (
    <button
      onClick={() =>
        setAppearance(axes.appearance === "dark" ? "light" : "dark")
      }
    >
      {axes.appearance === "dark" ? "Light mode" : "Dark mode"}
    </button>
  );
}
```

## "use client" Usage

### Components that require "use client"

All interactive design-system components must render inside a Client Component
boundary because they use hooks (`useState`, `useId`, `useRef`, `useContext`).

```tsx
// app/dashboard/settings-form.tsx
"use client";

import { Input, Select, Switch, Button } from "@mfe/design-system";

export function SettingsForm() {
  // ... form logic with hooks
  return (
    <form>
      <Input label="Display name" />
      <Select options={[...]} />
      <Switch label="Dark mode" />
      <Button type="submit" variant="primary">Save</Button>
    </form>
  );
}
```

Then import from a Server Component page:

```tsx
// app/dashboard/page.tsx  (Server Component)
import { SettingsForm } from "./settings-form";

export default function DashboardPage() {
  return (
    <main>
      <h1>Settings</h1>
      <SettingsForm />
    </main>
  );
}
```

### Why not mark page.tsx as "use client"?

Keep pages as Server Components so you can:
- Fetch data on the server (`async` page functions)
- Reduce client JS bundle size
- Stream HTML with React Server Components

Only mark the interactive leaf components as Client Components.

## Server Components

### Safe in Server Components (no hooks, no browser APIs)

These exports are plain data/types and can be imported anywhere:

| Export                  | Safe in SC | Notes                            |
|------------------------|:----------:|----------------------------------|
| Design tokens (CSS)    | Yes        | Import CSS in layout.tsx         |
| TypeScript types       | Yes        | `InputProps`, `ButtonProps`, etc. |
| `cn()` utility         | Yes        | Just `clsx` + `tailwind-merge`   |
| Theme type definitions | Yes        | `ThemeAxes`, `ThemeAppearance`   |

### Require Client Component boundary

| Export                   | Notes                                  |
|--------------------------|----------------------------------------|
| All primitives           | Use hooks internally                   |
| All components           | Use hooks internally                   |
| `ThemeProvider`          | Uses `useState`, `useEffect`, `localStorage` |
| `DesignSystemProvider`   | Wraps `ThemeProvider`                  |
| `useTheme()`             | React context hook                     |

### Pattern: Server data + Client form

```tsx
// app/users/[id]/edit/page.tsx  (Server Component)
import { getUser } from "@/lib/data";
import { EditUserForm } from "./edit-user-form";

export default async function EditUserPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await getUser(params.id);

  return (
    <main>
      <h1>Edit User</h1>
      <EditUserForm user={user} />
    </main>
  );
}
```

```tsx
// app/users/[id]/edit/edit-user-form.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input, Select, Button } from "@mfe/design-system";

const schema = z.object({
  name: z.string().min(1),
  role: z.enum(["admin", "editor", "viewer"]),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  user: { name: string; role: string };
}

export function EditUserForm({ user }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: user.name, role: user.role as FormValues["role"] },
  });

  const onSubmit = async (data: FormValues) => {
    await fetch(`/api/users/${user.name}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input
        label="Name"
        error={errors.name?.message}
        required
        {...register("name")}
      />
      <Select
        options={[
          { value: "admin", label: "Admin" },
          { value: "editor", label: "Editor" },
          { value: "viewer", label: "Viewer" },
        ]}
        error={!!errors.role}
        {...register("role")}
      />
      <Button type="submit" variant="primary" loading={isSubmitting}>
        Save changes
      </Button>
    </form>
  );
}
```

## Common Patterns

### Dashboard layout with navigation

```tsx
// app/dashboard/layout.tsx  (Server Component)
import { DashboardNav } from "./dashboard-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <DashboardNav />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
```

```tsx
// app/dashboard/dashboard-nav.tsx
"use client";

import { Tabs } from "@mfe/design-system";
import { usePathname, useRouter } from "next/navigation";

export function DashboardNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav className="w-64 border-r p-4">
      <Tabs
        items={[
          { key: "overview", label: "Overview" },
          { key: "settings", label: "Settings" },
          { key: "team", label: "Team" },
        ]}
        activeKey={pathname.split("/").pop() ?? "overview"}
        onChange={(key) => router.push(`/dashboard/${key}`)}
      />
    </nav>
  );
}
```

### CSS token import

Import the design-system CSS in your root layout so tokens are available globally:

```tsx
// app/layout.tsx
import "@mfe/design-system/dist/styles.css"; // if published as built CSS
// or import from source if using Tailwind in the same build pipeline
```

### Server Actions with design-system forms

```tsx
// app/feedback/page.tsx
import { FeedbackForm } from "./feedback-form";
import { submitFeedback } from "./actions";

export default function FeedbackPage() {
  return <FeedbackForm onSubmit={submitFeedback} />;
}
```

```tsx
// app/feedback/actions.ts
"use server";

export async function submitFeedback(formData: {
  message: string;
  rating: string;
}) {
  // Server-side logic
}
```

```tsx
// app/feedback/feedback-form.tsx
"use client";

import { useForm } from "react-hook-form";
import { Input, Select, Button } from "@mfe/design-system";

interface Props {
  onSubmit: (data: { message: string; rating: string }) => Promise<void>;
}

export function FeedbackForm({ onSubmit }: Props) {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<{
    message: string;
    rating: string;
  }>();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input label="Message" required {...register("message")} />
      <Select
        options={[
          { value: "great", label: "Great" },
          { value: "okay", label: "Okay" },
          { value: "poor", label: "Poor" },
        ]}
        placeholder="Rate your experience"
        {...register("rating")}
      />
      <Button type="submit" variant="primary" loading={isSubmitting}>
        Send feedback
      </Button>
    </form>
  );
}
```
