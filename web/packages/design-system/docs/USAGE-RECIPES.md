# Usage Recipes

## Form with Validation

Use `error` (boolean or string) on form field components to show validation state.

```tsx
import { Input, Select, Textarea } from '@mfe/design-system';

function ContactForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});

  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="Name"
        required
        error={errors.name}
        onChange={(e) => setValue('name', e.target.value)}
      />

      <Input
        label="Email"
        type="email"
        error={errors.email}
        description="We will not share your email."
      />

      <Select
        size="md"
        error={errors.category}
        onChange={(value) => setValue('category', value)}
      >
        <Select.Option value="support">Support</Select.Option>
        <Select.Option value="sales">Sales</Select.Option>
      </Select>

      <Textarea
        label="Message"
        error={errors.message}
        required
      />
    </form>
  );
}
```

## Modal with Form

Combine `Modal` with form elements. Use `footer` for action buttons.

```tsx
import { Modal, Input, Button } from '@mfe/design-system';

function CreateUserModal({ open, onClose }) {
  const [name, setName] = useState('');

  const handleSubmit = () => {
    createUser({ name });
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Create User"
      size="md"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit}>Create</Button>
        </>
      }
    >
      <Input
        label="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
    </Modal>
  );
}
```

## Data Table with SearchFilterListing

`SearchFilterListing` composes PageHeader, FilterBar, SummaryStrip, and results into a single layout.

```tsx
import { SearchFilterListing } from '@mfe/design-system';

function UsersPage() {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<ActiveFilter[]>([]);

  return (
    <SearchFilterListing
      title="Users"
      description="Manage team members"
      actions={<Button variant="primary">Add User</Button>}
      filters={
        <Input
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      }
      activeFilters={filters}
      onClearAllFilters={() => setFilters([])}
      summaryItems={[
        { label: 'Total', value: 142 },
        { label: 'Active', value: 128 },
      ]}
      totalCount={142}
      loading={isLoading}
      items={users.map((u) => (
        <UserRow key={u.id} user={u} />
      ))}
      emptyStateLabel="No users found"
      sortOptions={[
        { key: 'name', label: 'Name' },
        { key: 'created', label: 'Date Created' },
      ]}
      activeSort={{ key: 'name', direction: 'asc' }}
      onSortChange={(key, direction) => setSort({ key, direction })}
    />
  );
}
```

## Theme Customization

### Setup

Wrap your app in `ThemeProvider`. It reads/writes to localStorage and applies data attributes to `<html>`.

```tsx
import { ThemeProvider } from '@mfe/design-system/providers';

function App() {
  return (
    <ThemeProvider defaultAxes={{ appearance: 'light', density: 'comfortable' }}>
      <MyApp />
    </ThemeProvider>
  );
}
```

### Reading and updating theme

```tsx
import { useTheme } from '@mfe/design-system/providers';

function ThemeToggle() {
  const { axes, setAppearance, setDensity, update } = useTheme();

  return (
    <>
      <button onClick={() => setAppearance(axes.appearance === 'dark' ? 'light' : 'dark')}>
        Toggle dark mode
      </button>
      <button onClick={() => setDensity(axes.density === 'compact' ? 'comfortable' : 'compact')}>
        Toggle density
      </button>
    </>
  );
}
```

### Available theme axes

| Axis | Type | Default |
|------|------|---------|
| `appearance` | `'light' \| 'dark' \| 'high-contrast'` | `'light'` |
| `density` | `'comfortable' \| 'compact'` | `'comfortable'` |
| `radius` | `'rounded' \| 'sharp'` | `'rounded'` |
| `elevation` | `'raised' \| 'flat'` | `'raised'` |
| `motion` | `'standard' \| 'reduced'` | `'standard'` |
| `accent` | `string` | `'light'` |
| `surfaceTone` | `string` | `'soft-1'` |
| `tableSurfaceTone` | `'soft' \| 'normal' \| 'strong'` | `'normal'` |

## Access Control

Components accept `access` and `accessReason` props to control interactivity.

```tsx
import { Input, Button } from '@mfe/design-system';

// Full access (default)
<Input access="full" />

// Read-only -- visible, not editable, cursor-default, opacity-70
<Input access="readonly" accessReason="You do not have edit permissions" />

// Disabled -- visible, not interactive, cursor-not-allowed, opacity-50
<Button access="disabled" accessReason="Feature not available">Submit</Button>

// Hidden -- invisible, removed from layout
<Button access="hidden">Admin Action</Button>
```

### Access levels

| Level | Visual | Interactive | Use case |
|-------|--------|-------------|----------|
| `full` | Normal | Yes | Default state |
| `readonly` | Dimmed (70%) | No (events blocked) | View-only permissions |
| `disabled` | Dimmed (50%) | No (pointer-events: none) | Feature unavailable |
| `hidden` | Invisible | No | No permission to see |

### Programmatic access resolution

> **Note:** The imports below come from an **unstable** entry point. They are not covered by semver guarantees and may change in any minor/patch release.

```tsx
import { resolveAccessState, shouldBlockInteraction } from '@mfe/design-system/unstable/interaction-core';

const { state, isHidden, isReadonly, isDisabled } = resolveAccessState('readonly');
const blocked = shouldBlockInteraction(state); // true
```

## Portal Customization

> **Note:** The imports below come from an **unstable** entry point. They are not covered by semver guarantees and may change in any minor/patch release.

### Render overlay into a custom container

```tsx
import { Portal } from '@mfe/design-system/unstable/overlay-engine';

<Portal container={document.getElementById('sidebar-portal')}>
  <Tooltip content="Help text">...</Tooltip>
</Portal>
```

### Disable portals for testing

```tsx
import { PortalProvider } from '@mfe/design-system/unstable/overlay-engine';

// In test setup
<PortalProvider enabled={false}>
  <ComponentUnderTest />
</PortalProvider>
```

## Slot Customization

### Render a button as a link

```tsx
<Button
  slots={{ root: 'a' }}
  slotProps={{ root: { href: '/dashboard' } }}
>
  Go to Dashboard
</Button>
```

### Add test IDs to sub-elements

```tsx
<Button
  slotProps={{
    root: { 'data-testid': 'submit-btn' },
    label: { 'data-testid': 'submit-label' },
    startIcon: { 'data-testid': 'submit-icon' },
  }}
>
  Submit
</Button>
```

### Custom className on slots (merged, not replaced)

```tsx
<Button
  slotProps={{
    root: { className: 'w-full rounded-none' },
  }}
>
  Full Width
</Button>
// Result className: "btn btn-primary w-full rounded-none"
```
