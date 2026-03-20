# Zod Schema Validation

## Setup

```bash
npm install zod @hookform/resolvers react-hook-form
```

## Schema Definition

```ts
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;
// => { email: string; password: string; rememberMe?: boolean }
```

## Integration with react-hook-form + design-system

```tsx
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input, Checkbox, Button } from "@mfe/design-system";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  const onSubmit = async (data: LoginFormValues) => {
    await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input
        label="Email"
        type="email"
        error={errors.email?.message}
        required
        {...register("email")}
      />

      <Input
        label="Password"
        type="password"
        error={errors.password?.message}
        required
        {...register("password")}
      />

      <Checkbox label="Remember me" {...register("rememberMe")} />

      <Button type="submit" variant="primary" loading={isSubmitting}>
        Sign in
      </Button>
    </form>
  );
}
```

## Error Mapping

Zod errors are mapped automatically by `zodResolver`. Each field error becomes
a `{ message: string; type: string }` object in `formState.errors`.

| Component  | How to pass errors                          |
|-----------|---------------------------------------------|
| `Input`   | `error={errors.fieldName?.message}`          |
| `Select`  | `error={errors.fieldName?.message ?? !!errors.fieldName}` |
| `Checkbox`| `error={!!errors.fieldName}`                 |
| `Radio`   | `error={!!errors.fieldName}`                 |

For `FormField`, pass the message to the wrapper:

```tsx
import { FormField, Input } from "@mfe/design-system";

<FormField label="Email" error={errors.email?.message} required>
  <Input {...register("email")} />
</FormField>
```

### Custom error mapping utility

```ts
import type { FieldErrors } from "react-hook-form";

/** Extract first error message from nested RHF errors */
export function fieldError(
  errors: FieldErrors,
  name: string,
): string | undefined {
  const parts = name.split(".");
  let current: unknown = errors;
  for (const part of parts) {
    if (current == null || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return (current as { message?: string })?.message;
}

// Usage:
// <Input error={fieldError(errors, "address.city")} />
```

## Common Schemas

### Login form

```ts
const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "At least 8 characters"),
});
```

### Registration form

```tsx
import { z } from "zod";

const registrationSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "At least 8 characters")
      .regex(/[A-Z]/, "Must contain an uppercase letter")
      .regex(/[0-9]/, "Must contain a number"),
    confirmPassword: z.string(),
    role: z.enum(["admin", "editor", "viewer"], {
      errorMap: () => ({ message: "Select a role" }),
    }),
    terms: z.literal(true, {
      errorMap: () => ({ message: "You must accept the terms" }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegistrationValues = z.infer<typeof registrationSchema>;
```

Full form using this schema:

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Select, Checkbox, Button } from "@mfe/design-system";

export function RegistrationForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationValues>({
    resolver: zodResolver(registrationSchema),
  });

  return (
    <form onSubmit={handleSubmit(console.log)} className="flex flex-col gap-4">
      <Input
        label="Full name"
        error={errors.name?.message}
        required
        {...register("name")}
      />
      <Input
        label="Email"
        type="email"
        error={errors.email?.message}
        required
        {...register("email")}
      />
      <Input
        label="Password"
        type="password"
        error={errors.password?.message}
        required
        {...register("password")}
      />
      <Input
        label="Confirm password"
        type="password"
        error={errors.confirmPassword?.message}
        required
        {...register("confirmPassword")}
      />
      <Select
        options={[
          { value: "admin", label: "Admin" },
          { value: "editor", label: "Editor" },
          { value: "viewer", label: "Viewer" },
        ]}
        placeholder="Select a role"
        error={errors.role?.message ?? !!errors.role}
        {...register("role")}
      />
      <Checkbox
        label="I accept the terms and conditions"
        error={!!errors.terms}
        {...register("terms")}
      />
      <Button type="submit" variant="primary" loading={isSubmitting}>
        Create account
      </Button>
    </form>
  );
}
```

### Settings form

```ts
const settingsSchema = z.object({
  displayName: z.string().min(1, "Display name is required").max(50),
  bio: z.string().max(280, "Bio must be 280 characters or less").optional(),
  theme: z.enum(["light", "dark", "system"]),
  emailNotifications: z.boolean(),
  language: z.string().min(1, "Select a language"),
});
```

### Conditional validation with discriminated unions

```ts
const contactSchema = z.discriminatedUnion("contactMethod", [
  z.object({
    contactMethod: z.literal("email"),
    email: z.string().email("Invalid email"),
  }),
  z.object({
    contactMethod: z.literal("phone"),
    phone: z.string().regex(/^\+?[1-9]\d{7,14}$/, "Invalid phone number"),
  }),
]);
```

### Array fields

```ts
const teamSchema = z.object({
  teamName: z.string().min(1, "Team name is required"),
  members: z
    .array(
      z.object({
        name: z.string().min(1, "Member name is required"),
        role: z.enum(["lead", "member"]),
      }),
    )
    .min(1, "At least one member is required"),
});
```
