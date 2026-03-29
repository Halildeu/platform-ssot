import type { ExampleEntry } from './types';

export const examples: Record<string, ExampleEntry[]> = {
  Button: [
    {
      id: "btn-basic",
      title: "Basic Button",
      description: "Simple button with default props.",
      category: "basic",
      code: `import { Button } from '@mfe/design-system';

export function Example() {
  return <Button>Click me</Button>;
}`,
      previewProps: {},
    },
    {
      id: "btn-variants",
      title: "Button Variants",
      description: "All available visual variants side by side.",
      category: "basic",
      code: `import { Button } from '@mfe/design-system';

export function Example() {
  return (
    <div className="flex gap-3">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
    </div>
  );
}`,
      previewProps: { variant: "primary" },
      multiVariantAxis: "variant",
      tags: ["variant", "primary", "secondary", "ghost"],
    },
    {
      id: "btn-sizes",
      title: "Size Scale",
      description: "Button across all available sizes.",
      category: "basic",
      code: `import { Button } from '@mfe/design-system';

export function Example() {
  return (
    <div className="flex items-center gap-3">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  );
}`,
      previewProps: { size: "md" },
      multiVariantAxis: "size",
      tags: ["size", "responsive"],
    },
    {
      id: "btn-disabled",
      title: "Disabled State",
      description: "Disabled button prevents user interaction and shows a visual cue.",
      category: "form",
      code: `import { Button } from '@mfe/design-system';

export function Example() {
  return <Button disabled>Cannot click</Button>;
}`,
      previewProps: { disabled: true },
      tags: ["disabled", "state"],
    },
    {
      id: "btn-loading",
      title: "Loading State",
      description: "Button with a loading spinner for async operations.",
      category: "form",
      code: `import { Button } from '@mfe/design-system';

export function Example() {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    await saveData();
    setLoading(false);
  };

  return (
    <Button loading={loading} onClick={handleClick}>
      Save Changes
    </Button>
  );
}`,
      previewProps: { loading: true },
      tags: ["loading", "async", "state"],
    },
    {
      id: "btn-with-icon",
      title: "Button with Icon",
      description: "Combine icons with text for clearer actions.",
      category: "layout",
      code: `import { Button } from '@mfe/design-system';
import { Plus, Download, Trash2 } from 'lucide-react';

export function Example() {
  return (
    <div className="flex gap-3">
      <Button><Plus className="h-4 w-4 mr-1" /> Add Item</Button>
      <Button variant="secondary"><Download className="h-4 w-4 mr-1" /> Export</Button>
      <Button variant="ghost"><Trash2 className="h-4 w-4 mr-1" /> Delete</Button>
    </div>
  );
}`,
      previewProps: {},
      tags: ["icon", "lucide"],
    },
    {
      id: "btn-form-submit",
      title: "Form Submit Pattern",
      description: "Button as form submit with validation feedback.",
      category: "patterns",
      code: `import { Button } from '@mfe/design-system';

export function ContactForm() {
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const validation = validate(formData);
    if (!validation.ok) {
      setErrors(validation.errors);
      return;
    }
    setSubmitting(true);
    await api.submit(formData);
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <Button type="submit" loading={submitting} disabled={submitting}>
        Submit
      </Button>
    </form>
  );
}`,
      previewProps: {},
      tags: ["form", "submit", "validation", "pattern"],
    },
    {
      id: "btn-confirmation",
      title: "Confirmation Dialog Pattern",
      description: "Primary + Ghost button pair for confirm/cancel flows.",
      category: "patterns",
      code: `import { Button } from '@mfe/design-system';

export function ConfirmDialog({ onConfirm, onCancel }) {
  return (
    <div className="flex justify-end gap-2 pt-4 border-t">
      <Button variant="ghost" onClick={onCancel}>
        Cancel
      </Button>
      <Button variant="primary" onClick={onConfirm}>
        Confirm Delete
      </Button>
    </div>
  );
}`,
      previewProps: {},
      tags: ["dialog", "confirm", "cancel", "pattern"],
    },
  ],
  Input: [
    {
      id: "input-basic",
      title: "Basic Input",
      description: "Simple text input with placeholder.",
      category: "basic",
      code: `import { Input } from '@mfe/design-system';

export function Example() {
  return <Input placeholder="Enter your name" />;
}`,
      previewProps: { placeholder: "Enter your name" },
    },
    {
      id: "input-with-label",
      title: "Input with Label",
      description: "Labeled input for form accessibility.",
      category: "form",
      code: `import { Input } from '@mfe/design-system';

export function Example() {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor="email" className="text-sm font-medium">
        Email Address
      </label>
      <Input id="email" type="email" placeholder="you@example.com" />
    </div>
  );
}`,
      previewProps: { placeholder: "you@example.com" },
      tags: ["label", "accessibility", "form"],
    },
    {
      id: "input-validation",
      title: "Validation States",
      description: "Input with error and success visual feedback.",
      category: "form",
      code: `import { Input } from '@mfe/design-system';

export function Example() {
  const [value, setValue] = useState('');
  const hasError = value.length > 0 && !value.includes('@');

  return (
    <Input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="you@example.com"
      error={hasError}
      helperText={hasError ? 'Please enter a valid email' : undefined}
    />
  );
}`,
      previewProps: { error: true, placeholder: "Invalid email" },
      tags: ["error", "validation", "state"],
    },
  ],
  Select: [
    {
      id: "select-basic",
      title: "Basic Select",
      description: "Simple dropdown selection.",
      category: "basic",
      code: `import { Select } from '@mfe/design-system';

export function Example() {
  return (
    <Select placeholder="Choose a fruit">
      <Select.Option value="apple">Apple</Select.Option>
      <Select.Option value="banana">Banana</Select.Option>
      <Select.Option value="orange">Orange</Select.Option>
    </Select>
  );
}`,
      previewProps: {},
    },
  ],
  Alert: [
    {
      id: "alert-basic",
      title: "Alert Variants",
      description: "All severity levels for contextual feedback.",
      category: "basic",
      code: `import { Alert } from '@mfe/design-system';

export function Example() {
  return (
    <div className="flex flex-col gap-3">
      <Alert severity="info">This is an informational message.</Alert>
      <Alert severity="success">Operation completed successfully!</Alert>
      <Alert severity="warning">Please review before continuing.</Alert>
      <Alert severity="error">Something went wrong. Try again.</Alert>
    </div>
  );
}`,
      previewProps: { severity: "info" },
      multiVariantAxis: "severity",
      tags: ["severity", "info", "success", "warning", "error"],
    },
    {
      id: "alert-dismissible",
      title: "Dismissible Alert",
      description: "Alert with a close button for user-dismissable messages.",
      category: "advanced",
      code: `import { Alert } from '@mfe/design-system';
import { useState } from 'react';

export function Example() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <Alert severity="info" onClose={() => setVisible(false)}>
      You can dismiss this notification.
    </Alert>
  );
}`,
      previewProps: {},
      tags: ["dismiss", "close", "interactive"],
    },
  ],
  Checkbox: [
    {
      id: "checkbox-basic",
      title: "Basic Checkbox",
      description: "Simple checkbox with label.",
      category: "basic",
      code: `import { Checkbox } from '@mfe/design-system';

export function Example() {
  return <Checkbox label="I agree to the terms" />;
}`,
      previewProps: { label: "I agree to the terms" },
    },
    {
      id: "checkbox-group",
      title: "Checkbox Group Pattern",
      description: "Multiple checkboxes for multi-select scenarios.",
      category: "patterns",
      code: `import { Checkbox } from '@mfe/design-system';

export function Example() {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (value: string) =>
    setSelected((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );

  return (
    <div className="flex flex-col gap-2">
      {['Email', 'SMS', 'Push'].map((opt) => (
        <Checkbox
          key={opt}
          label={opt}
          checked={selected.includes(opt)}
          onChange={() => toggle(opt)}
        />
      ))}
    </div>
  );
}`,
      previewProps: {},
      tags: ["group", "multi-select", "pattern"],
    },
  ],
  Modal: [
    {
      id: "modal-basic",
      title: "Basic Modal",
      description: "Simple modal dialog with title, content, and actions.",
      category: "basic",
      code: `import { Modal, Button } from '@mfe/design-system';
import { useState } from 'react';

export function Example() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Modal</Button>
      <Modal open={open} onClose={() => setOpen(false)} title="Confirm Action">
        <p>Are you sure you want to proceed?</p>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={() => setOpen(false)}>Confirm</Button>
        </div>
      </Modal>
    </>
  );
}`,
      previewProps: {},
      tags: ["dialog", "overlay", "confirm"],
    },
  ],
  Pagination: [
    {
      id: "pagination-basic",
      title: "Basic Pagination",
      description: "Page navigation with controlled current page.",
      category: "basic",
      code: `import { Pagination } from '@mfe/design-system';
import { useState } from 'react';

export function Example() {
  const [page, setPage] = useState(1);

  return (
    <Pagination
      currentPage={page}
      totalPages={10}
      onPageChange={setPage}
    />
  );
}`,
      previewProps: { currentPage: 1, totalPages: 10 },
      tags: ["navigation", "page"],
    },
    {
      id: "pagination-table",
      title: "Table Pagination Pattern",
      description: "Pagination combined with a data table for paged content.",
      category: "patterns",
      code: `import { Pagination } from '@mfe/design-system';
import { useState, useMemo } from 'react';

const PAGE_SIZE = 10;

export function DataTable({ data }) {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(data.length / PAGE_SIZE);
  const pageData = useMemo(
    () => data.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [data, page]
  );

  return (
    <div>
      <table>{/* render pageData rows */}</table>
      <div className="mt-4 flex justify-center">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}`,
      previewProps: {},
      tags: ["table", "data", "paged", "pattern"],
    },
  ],
  Toast: [
    {
      id: "toast-basic",
      title: "Toast Notifications",
      description: "Temporary messages that auto-dismiss.",
      category: "basic",
      code: `import { Toast, Button } from '@mfe/design-system';
import { useState } from 'react';

export function Example() {
  const [show, setShow] = useState(false);

  return (
    <>
      <Button onClick={() => setShow(true)}>Show Toast</Button>
      {show && (
        <Toast
          message="Changes saved successfully"
          severity="success"
          onClose={() => setShow(false)}
        />
      )}
    </>
  );
}`,
      previewProps: {},
      tags: ["notification", "feedback", "auto-dismiss"],
    },
  ],};
