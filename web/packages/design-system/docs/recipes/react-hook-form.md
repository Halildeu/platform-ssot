# react-hook-form Integration

## Recommended: Connected Components (New)

The simplest way to build validated forms. Connected components auto-bind to
form context — no `register()`, no `Controller`, no manual error wiring.

### Standalone Mode (no react-hook-form needed)

```bash
npm install zod
```

```tsx
import { useForm, ConnectedInput, ConnectedSelect, createZodValidator } from '@mfe/design-system/form';
import { Button } from '@mfe/design-system';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1, 'Ad zorunludur'),
  department: z.string().min(1, 'Departman seçiniz'),
});

export function ContactForm() {
  const form = useForm({
    defaultValues: { name: '', department: '' },
    validator: createZodValidator(schema),
  });

  return (
    <form.FormProvider>
      <form onSubmit={form.handleSubmit(console.log)} className="flex flex-col gap-4">
        <ConnectedInput name="name" label="Ad Soyad" required />
        <ConnectedSelect
          name="department"
          label="Departman"
          options={[
            { value: 'eng', label: 'Engineering' },
            { value: 'design', label: 'Design' },
          ]}
        />
        <Button type="submit" variant="primary">Kaydet</Button>
      </form>
    </form.FormProvider>
  );
}
```

### With react-hook-form (advanced forms)

```bash
npm install react-hook-form zod
```

```tsx
import { useForm } from 'react-hook-form';
import { RHFFormProvider, zodResolver, ConnectedInput } from '@mfe/design-system/form';
import { Button } from '@mfe/design-system';
import { z } from 'zod';

const schema = z.object({ name: z.string().min(2), role: z.enum(['admin', 'editor']) });
type FormValues = z.infer<typeof schema>;

export function RHFForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', role: 'editor' },
  });

  return (
    <RHFFormProvider rhfForm={form}>
      <form onSubmit={form.handleSubmit(console.log)} className="flex flex-col gap-4">
        <ConnectedInput name="name" label="Name" required />
        <Button type="submit" variant="primary">Save</Button>
      </form>
    </RHFFormProvider>
  );
}
```

---

## Legacy: Manual Integration

> The patterns below still work and are useful for migration. For new forms,
> prefer Connected Components above.

## Setup

```bash
npm install react-hook-form
```

## Basic Form

`Input` and `Select` work directly with `register()` because they forward refs to
native `<input>` / `<select>` elements.

```tsx
import { useForm } from "react-hook-form";
import { Input, Select, Checkbox, Button } from "@mfe/design-system";

interface ContactForm {
  name: string;
  email: string;
  department: string;
  terms: boolean;
}

export function ContactFormExample() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactForm>();

  const onSubmit = (data: ContactForm) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input
        label="Name"
        error={errors.name?.message}
        required
        {...register("name", { required: "Name is required" })}
      />

      <Input
        label="Email"
        type="email"
        error={errors.email?.message}
        required
        {...register("email", {
          required: "Email is required",
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Invalid email address",
          },
        })}
      />

      <Select
        options={[
          { value: "eng", label: "Engineering" },
          { value: "design", label: "Design" },
          { value: "product", label: "Product" },
        ]}
        placeholder="Select department"
        error={!!errors.department}
        {...register("department", { required: "Department is required" })}
      />

      <Checkbox
        label="I agree to the terms"
        error={!!errors.terms}
        {...register("terms", { required: true })}
      />

      <Button type="submit" variant="primary">
        Submit
      </Button>
    </form>
  );
}
```

## With Controller (for custom components)

`Switch`, `RadioGroup`, and components with non-standard value APIs need
`Controller` because they don't use native `onChange` / `value` conventions.

### Switch

```tsx
import { Controller, useForm } from "react-hook-form";
import { Switch } from "@mfe/design-system";

function NotificationSettings() {
  const { control, handleSubmit } = useForm({
    defaultValues: { emailNotifs: false, pushNotifs: true },
  });

  return (
    <form onSubmit={handleSubmit(console.log)} className="flex flex-col gap-4">
      <Controller
        name="emailNotifs"
        control={control}
        render={({ field }) => (
          <Switch
            label="Email notifications"
            description="Receive email digests"
            checked={field.value}
            onCheckedChange={(checked) => field.onChange(checked)}
          />
        )}
      />

      <Controller
        name="pushNotifs"
        control={control}
        render={({ field }) => (
          <Switch
            label="Push notifications"
            checked={field.value}
            onCheckedChange={(checked) => field.onChange(checked)}
          />
        )}
      />
    </form>
  );
}
```

### RadioGroup

```tsx
import { Controller, useForm } from "react-hook-form";
import { Radio, RadioGroup } from "@mfe/design-system";

function PriorityPicker() {
  const { control, handleSubmit } = useForm({
    defaultValues: { priority: "medium" },
  });

  return (
    <form onSubmit={handleSubmit(console.log)}>
      <Controller
        name="priority"
        control={control}
        rules={{ required: "Select a priority" }}
        render={({ field }) => (
          <RadioGroup
            name="priority"
            value={field.value}
            onChange={(value) => field.onChange(value)}
            direction="vertical"
          >
            <Radio value="low" label="Low" />
            <Radio value="medium" label="Medium" />
            <Radio value="high" label="High" />
          </RadioGroup>
        )}
      />
    </form>
  );
}
```

## Error Handling

Design-system components accept error state in two patterns:

| Component  | Prop        | Type                  | Notes                                       |
|-----------|-------------|----------------------|---------------------------------------------|
| `Input`   | `error`     | `React.ReactNode`    | Pass string to render inline error message  |
| `Select`  | `error`     | `boolean \| string`  | Boolean toggles visual state                |
| `Checkbox`| `error`     | `boolean`            | Toggles error border                        |
| `Radio`   | `error`     | `boolean`            | Toggles error border                        |

Map RHF errors to the correct shape:

```tsx
// Input — pass the message string directly
<Input
  label="Email"
  error={errors.email?.message}
  {...register("email", { required: "Email is required" })}
/>

// Select — pass boolean or message
<Select
  error={errors.department ? errors.department.message ?? true : false}
  {...register("department", { required: "Pick a department" })}
  options={departmentOptions}
/>

// Checkbox — boolean only
<Checkbox
  label="Accept terms"
  error={!!errors.terms}
  {...register("terms", { required: true })}
/>
```

### With FormField wrapper

`FormField` adds label, help text, and error display for any child:

```tsx
import { FormField, Input } from "@mfe/design-system";

<FormField
  label="Username"
  required
  error={errors.username?.message}
  help="Must be 3-20 characters"
>
  <Input {...register("username", { required: "Username is required" })} />
</FormField>
```

## TypeScript

### Typed form with zodResolver

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input, Select, Button } from "@mfe/design-system";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  role: z.enum(["admin", "editor", "viewer"]),
});

type FormValues = z.infer<typeof schema>;

function TypedForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", role: "viewer" },
  });

  return (
    <form onSubmit={handleSubmit(console.log)} className="flex flex-col gap-4">
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
        Save
      </Button>
    </form>
  );
}
```

## Common Patterns

### Dynamic fields with useFieldArray

```tsx
import { useForm, useFieldArray } from "react-hook-form";
import { Input, Button } from "@mfe/design-system";

interface TagsForm {
  tags: { value: string }[];
}

function DynamicTagsForm() {
  const { register, control, handleSubmit, formState: { errors } } =
    useForm<TagsForm>({
      defaultValues: { tags: [{ value: "" }] },
    });

  const { fields, append, remove } = useFieldArray({ control, name: "tags" });

  return (
    <form onSubmit={handleSubmit(console.log)} className="flex flex-col gap-3">
      {fields.map((field, index) => (
        <div key={field.id} className="flex items-end gap-2">
          <Input
            label={index === 0 ? "Tags" : undefined}
            error={errors.tags?.[index]?.value?.message}
            {...register(`tags.${index}.value`, { required: "Tag is required" })}
          />
          <Button
            variant="ghost"
            size="sm"
            type="button"
            onClick={() => remove(index)}
          >
            Remove
          </Button>
        </div>
      ))}
      <Button
        variant="outline"
        size="sm"
        type="button"
        onClick={() => append({ value: "" })}
      >
        Add tag
      </Button>
    </form>
  );
}
```

### Form with loading state

```tsx
function AsyncForm() {
  const { register, handleSubmit, formState: { isSubmitting } } =
    useForm<{ title: string }>();

  const onSubmit = async (data: { title: string }) => {
    await fetch("/api/items", {
      method: "POST",
      body: JSON.stringify(data),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input
        label="Title"
        loading={isSubmitting}
        {...register("title", { required: "Title is required" })}
      />
      <Button type="submit" variant="primary" loading={isSubmitting}>
        Create
      </Button>
    </form>
  );
}
```
