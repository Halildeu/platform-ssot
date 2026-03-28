# Access Control Recipes

> How to disable, restrict, or hide UI elements based on permissions.

---

## Access levels

Every interactive component accepts the `access` prop with these values:

| Level | Behavior |
|-------|----------|
| `"full"` | Default. Fully interactive. |
| `"readonly"` | Visible but non-interactive. `opacity-70`, `cursor-default`. |
| `"disabled"` | Visible but blocked. `opacity-50`, `pointer-events-none`. |
| `"hidden"` | Rendered but invisible (`visibility: hidden`). Preserves layout. |

---

## Disable a form based on permissions

```tsx
"use client";

import { Input, Select, Button } from "@mfe/design-system";
import type { AccessLevel } from "@mfe/design-system";

interface Props {
  canEdit: boolean;
}

export function ProfileForm({ canEdit }: Props) {
  const access: AccessLevel = canEdit ? "full" : "readonly";

  return (
    <form className="flex flex-col gap-4">
      <Input
        label="Display name"
        access={access}
        accessReason={!canEdit ? "You need Editor role to modify this field" : undefined}
      />
      <Select
        options={[
          { value: "en", label: "English" },
          { value: "tr", label: "Turkish" },
        ]}
        access={access}
        accessReason={!canEdit ? "You need Editor role to change language" : undefined}
      />
      <Button
        type="submit"
        variant="primary"
        access={access}
        accessReason={!canEdit ? "Insufficient permissions to save" : undefined}
      >
        Save changes
      </Button>
    </form>
  );
}
```

When `access="readonly"`, inputs become non-interactive and hovering the button shows the `accessReason` as a native tooltip via the `title` attribute.

---

## Hide UI elements for unauthorized users

```tsx
import { Button, IconButton } from "@mfe/design-system";
import type { AccessLevel } from "@mfe/design-system";

function ActionBar({ userRole }: { userRole: string }) {
  const deleteAccess: AccessLevel = userRole === "admin" ? "full" : "hidden";
  const editAccess: AccessLevel = ["admin", "editor"].includes(userRole) ? "full" : "disabled";

  return (
    <div className="flex gap-2">
      <Button variant="primary" access={editAccess} accessReason="Editors only">
        Edit
      </Button>
      <Button variant="danger" access={deleteAccess} accessReason="Admins only">
        Delete
      </Button>
    </div>
  );
}
```

`access="hidden"` keeps the element in the DOM (with `visibility: hidden`) so layout does not shift. If you want to remove it from the DOM entirely, use conditional rendering instead.

---

## Show access reason tooltips

The `accessReason` prop sets the `title` attribute on the component root, providing a native tooltip that explains why the action is restricted:

```tsx
<Button
  access="disabled"
  accessReason="Your trial has expired. Upgrade to continue."
>
  Export Report
</Button>
```

For richer tooltip content, wrap with a `Tooltip` component:

```tsx
import { Button, Tooltip } from "@mfe/design-system";

<Tooltip content="Your trial has expired. Contact sales to upgrade.">
  <Button access="disabled">Export Report</Button>
</Tooltip>
```

---

## Integration with auth context

Create a hook that maps your auth state to access levels:

```tsx
"use client";

import { createContext, useContext } from "react";
import type { AccessLevel } from "@mfe/design-system";

type Permission = "read" | "write" | "admin";

const AuthContext = createContext<{ permissions: Permission[] }>({
  permissions: ["read"],
});

export function useAccessLevel(required: Permission): AccessLevel {
  const { permissions } = useContext(AuthContext);

  if (permissions.includes(required)) return "full";
  if (permissions.includes("read")) return "readonly";
  return "disabled";
}
```

Usage in a component:

```tsx
"use client";

import { Button, Input } from "@mfe/design-system";
import { useAccessLevel } from "@/hooks/useAccessLevel";

export function OrderForm() {
  const writeAccess = useAccessLevel("write");
  const adminAccess = useAccessLevel("admin");

  return (
    <form className="flex flex-col gap-4">
      <Input label="Order notes" access={writeAccess} />
      <Button variant="primary" access={writeAccess}>Submit</Button>
      <Button variant="danger" access={adminAccess} accessReason="Admin only">
        Cancel Order
      </Button>
    </form>
  );
}
```

---

## Related Docs

- [COMPONENT-CONTRACT.md](../COMPONENT-CONTRACT.md) -- Base props including `AccessControlledProps`
- [DO-DONT-GUIDELINES.md](../DO-DONT-GUIDELINES.md) -- Accessibility guidelines for disabled states
