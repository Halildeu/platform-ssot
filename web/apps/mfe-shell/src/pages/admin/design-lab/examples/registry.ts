/* ------------------------------------------------------------------ */
/*  Example Registry — Curated code examples for Design Lab             */
/*                                                                     */
/*  Each entry: title, description, category, code, and optional       */
/*  prop overrides for live preview.                                   */
/*  Categories: Basic, Form, Layout, Advanced, Patterns                */
/* ------------------------------------------------------------------ */

export type ExampleCategory = "basic" | "form" | "layout" | "advanced" | "patterns";

export type ExampleEntry = {
  id: string;
  title: string;
  description: string;
  category: ExampleCategory;
  code: string;
  /** prop values to render a live preview */
  previewProps?: Record<string, unknown>;
  /** if true, show multi-variant preview using a specific axis */
  multiVariantAxis?: string;
  /** tags for search/filter */
  tags?: string[];
};

export const EXAMPLE_CATEGORY_META: Record<ExampleCategory, { label: string; emoji: string; color: string }> = {
  basic: { label: "Basic", emoji: "🟢", color: "bg-emerald-100 text-emerald-700" },
  form: { label: "Form", emoji: "📝", color: "bg-blue-100 text-blue-700" },
  layout: { label: "Layout", emoji: "📐", color: "bg-amber-100 text-amber-700" },
  advanced: { label: "Advanced", emoji: "⚡", color: "bg-purple-100 text-purple-700" },
  patterns: { label: "Patterns", emoji: "🧩", color: "bg-rose-100 text-rose-700" },
};

/* ---- Curated examples per component ---- */

const _registry: Record<string, ExampleEntry[]> = {
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
  ],
  SearchFilterListing: [
    {
      id: "sfl-basic",
      title: "Temel Kullanim",
      description: "Baslik, filtre, ozet kartlari ve sonuc listesiyle temel SearchFilterListing kullanimi.",
      category: "basic",
      code: `import { useState } from 'react';
import { SearchFilterListing, TextInput, Select } from '@mfe/design-system';

export function PolitikaListesi() {
  const [query, setQuery] = useState('');
  const [durum, setDurum] = useState('all');

  return (
    <SearchFilterListing
      eyebrow="Envanter"
      title="Politika Listesi"
      description="Tum politikalari arayip filtreleyebilirsiniz."
      filters={
        <>
          <TextInput label="Arama" value={query} onValueChange={setQuery} size="sm" />
          <Select
            label="Durum"
            size="sm"
            value={durum}
            onValueChange={setDurum}
            options={[
              { label: 'Tumunu goster', value: 'all' },
              { label: 'Aktif', value: 'active' },
              { label: 'Pasif', value: 'inactive' },
            ]}
          />
        </>
      }
      onReset={() => { setQuery(''); setDurum('all'); }}
      summaryItems={[
        { key: 'total', label: 'Toplam', value: '24', tone: 'info' },
        { key: 'active', label: 'Aktif', value: '18', tone: 'success' },
        { key: 'inactive', label: 'Pasif', value: '6', tone: 'warning' },
      ]}
      items={[
        <div key="1" className="flex justify-between p-3 border rounded-lg">
          <span className="font-medium">policy_autonomy.v1</span>
          <span className="text-xs text-green-600">Aktif</span>
        </div>,
        <div key="2" className="flex justify-between p-3 border rounded-lg">
          <span className="font-medium">policy_secrets.v1</span>
          <span className="text-xs text-green-600">Aktif</span>
        </div>,
        <div key="3" className="flex justify-between p-3 border rounded-lg">
          <span className="font-medium">policy_network.v2</span>
          <span className="text-xs text-yellow-600">Pasif</span>
        </div>,
      ]}
    />
  );
}`,
      tags: ["listing", "filtre", "arama", "recipe", "temel"],
    },
    {
      id: "sfl-active-filters",
      title: "Aktif Filtre Chip'leri",
      description: "activeFilters ve onClearAllFilters ile uygulanmis filtrelerin chip olarak gosterimi ve yonetimi.",
      category: "form",
      code: `import { useState } from 'react';
import { SearchFilterListing, TextInput, Select, type ActiveFilter } from '@mfe/design-system';

export function AktifFiltreler() {
  const [query, setQuery] = useState('sunucu');
  const [filters, setFilters] = useState<ActiveFilter[]>([
    { key: 'durum', label: 'Durum', value: 'Aktif', onRemove: () => removeFilter('durum') },
    { key: 'tip', label: 'Tip', value: 'Uretim', onRemove: () => removeFilter('tip') },
    { key: 'bolge', label: 'Bolge', value: 'eu-west-1', onRemove: () => removeFilter('bolge') },
  ]);

  const removeFilter = (key: string) => {
    setFilters((prev) => prev.filter((f) => f.key !== key));
  };

  const clearAllFilters = () => {
    setFilters([]);
    setQuery('');
  };

  return (
    <SearchFilterListing
      title="Sunucu Envanteri"
      description="Aktif filtreleri chip olarak gorup tek tek veya topluca kaldirabilirsiniz."
      filters={
        <TextInput label="Arama" value={query} onValueChange={setQuery} size="sm" />
      }
      activeFilters={filters}
      onClearAllFilters={clearAllFilters}
      summaryItems={[
        { key: 'total', label: 'Toplam', value: '142', tone: 'info' },
        { key: 'filtered', label: 'Filtrelenen', value: '23', tone: 'success' },
      ]}
      items={[
        <div key="1" className="flex justify-between p-3 border rounded-lg">
          <span className="font-medium">srv-prod-web-01</span>
          <span className="text-xs text-green-600">Aktif</span>
        </div>,
        <div key="2" className="flex justify-between p-3 border rounded-lg">
          <span className="font-medium">srv-prod-api-03</span>
          <span className="text-xs text-green-600">Aktif</span>
        </div>,
      ]}
    />
  );
}`,
      tags: ["active-filters", "chip", "filtre", "temizle"],
    },
    {
      id: "sfl-sortable",
      title: "Siralanabilir Liste",
      description: "sortOptions, activeSort, onSortChange ve totalCount ile siralanabilir sonuc listesi.",
      category: "advanced",
      code: `import { useState } from 'react';
import {
  SearchFilterListing,
  TextInput,
  type SortOption,
  type SortState,
} from '@mfe/design-system';

const sortOptions: SortOption[] = [
  { key: 'name', label: 'Ada gore' },
  { key: 'date', label: 'Tarihe gore' },
  { key: 'priority', label: 'Oncelik' },
];

export function SiralanabilirListe() {
  const [sort, setSort] = useState<SortState>({ key: 'date', direction: 'desc' });

  const handleSortChange = (key: string, direction: 'asc' | 'desc') => {
    setSort({ key, direction });
  };

  return (
    <SearchFilterListing
      title="Gorev Listesi"
      description="Gorevleri farkli kriterlere gore siralayabilirsiniz."
      filters={<TextInput label="Gorev ara" value="" size="sm" />}
      sortOptions={sortOptions}
      activeSort={sort}
      onSortChange={handleSortChange}
      totalCount={47}
      listTitle="Gorevler"
      items={[
        <div key="1" className="flex justify-between p-3 border rounded-lg">
          <div>
            <div className="font-medium">Veritabani migrasyonu</div>
            <div className="text-xs text-gray-500">2024-12-15 — Yuksek oncelik</div>
          </div>
        </div>,
        <div key="2" className="flex justify-between p-3 border rounded-lg">
          <div>
            <div className="font-medium">API dokumantasyonu</div>
            <div className="text-xs text-gray-500">2024-12-14 — Orta oncelik</div>
          </div>
        </div>,
        <div key="3" className="flex justify-between p-3 border rounded-lg">
          <div>
            <div className="font-medium">Performans testi</div>
            <div className="text-xs text-gray-500">2024-12-13 — Dusuk oncelik</div>
          </div>
        </div>,
      ]}
    />
  );
}`,
      tags: ["sort", "siralama", "totalCount", "sonuc"],
    },
    {
      id: "sfl-selectable",
      title: "Coklu Secim ve Toplu Aksiyon",
      description: "selectable, selectedKeys, onSelectionChange ve batchActions ile coklu secim ve toplu islem yapabilme.",
      category: "advanced",
      code: `import { useState } from 'react';
import { SearchFilterListing, TextInput, Button } from '@mfe/design-system';

interface Kullanici {
  id: string;
  ad: string;
  email: string;
  rol: string;
}

const kullanicilar: Kullanici[] = [
  { id: '1', ad: 'Ahmet Yilmaz', email: 'ahmet@ornek.com', rol: 'Yonetici' },
  { id: '2', ad: 'Elif Demir', email: 'elif@ornek.com', rol: 'Gelistirici' },
  { id: '3', ad: 'Mehmet Kaya', email: 'mehmet@ornek.com', rol: 'Tasarimci' },
  { id: '4', ad: 'Zeynep Arslan', email: 'zeynep@ornek.com', rol: 'Gelistirici' },
];

export function KullaniciYonetimi() {
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>(['1', '3']);

  return (
    <SearchFilterListing
      title="Kullanici Yonetimi"
      description="Birden fazla kullaniciyi secerek toplu islem yapabilirsiniz."
      filters={<TextInput label="Kullanici ara" value="" size="sm" />}
      selectable
      selectedKeys={selectedKeys}
      onSelectionChange={setSelectedKeys}
      batchActions={
        <>
          <Button size="sm" variant="outline">Rol Degistir</Button>
          <Button size="sm" variant="destructive">Hesaplari Sil</Button>
        </>
      }
      totalCount={kullanicilar.length}
      items={kullanicilar.map((k) => (
        <div key={k.id} className="flex items-center justify-between p-3 border rounded-lg">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={selectedKeys.includes(k.id)}
              onChange={(e) => {
                setSelectedKeys((prev) =>
                  e.target.checked
                    ? [...prev, k.id]
                    : prev.filter((key) => key !== k.id)
                );
              }}
              className="h-4 w-4 rounded-sm border-gray-300"
            />
            <div>
              <div className="font-medium">{k.ad}</div>
              <div className="text-xs text-gray-500">{k.email}</div>
            </div>
          </div>
          <span className="rounded-full bg-gray-100 px-2 py-1 text-xs">{k.rol}</span>
        </div>
      ))}
    />
  );
}`,
      tags: ["selectable", "batch", "toplu", "secim", "aksiyon"],
    },
    {
      id: "sfl-loading",
      title: "Yukleniyor Durumu",
      description: "loading=true ile iskelet (skeleton) placeholder gosterimi. Veri yuklenirken kullaniciya gorsel geri bildirim saglar.",
      category: "basic",
      code: `import { SearchFilterListing } from '@mfe/design-system';

export function YukleniyorDurumu() {
  return (
    <SearchFilterListing
      title="Siparis Listesi"
      description="Siparisler yukleniyor..."
      loading={true}
      summaryItems={[
        { key: 'total', label: 'Toplam', value: '0', tone: 'info' },
        { key: 'pending', label: 'Bekleyen', value: '0', tone: 'warning' },
        { key: 'completed', label: 'Tamamlanan', value: '0', tone: 'success' },
      ]}
      items={[]}
    />
  );
}`,
      tags: ["loading", "skeleton", "yukleniyor", "placeholder"],
    },
    {
      id: "sfl-compact",
      title: "Kompakt Mod",
      description: "size='compact' ile daha yogun bilgi gosterimi. Tum ozellikler kompakt modda calisir.",
      category: "layout",
      code: `import { useState } from 'react';
import {
  SearchFilterListing,
  TextInput,
  Select,
  type ActiveFilter,
  type SortOption,
  type SortState,
} from '@mfe/design-system';

const sortOptions: SortOption[] = [
  { key: 'name', label: 'Ad' },
  { key: 'updated', label: 'Guncelleme' },
];

export function KompaktListe() {
  const [sort, setSort] = useState<SortState>({ key: 'updated', direction: 'desc' });
  const [filters, setFilters] = useState<ActiveFilter[]>([
    { key: 'tip', label: 'Tip', value: 'API', onRemove: () => setFilters((f) => f.filter((x) => x.key !== 'tip')) },
  ]);

  return (
    <SearchFilterListing
      size="compact"
      title="Servis Katalogu"
      description="Kompakt gorunumde daha fazla icerik goruntulenir."
      filters={
        <>
          <TextInput label="Servis ara" value="" size="sm" />
          <Select
            label="Ortam"
            size="sm"
            value="prod"
            options={[
              { label: 'Uretim', value: 'prod' },
              { label: 'Test', value: 'staging' },
            ]}
          />
        </>
      }
      activeFilters={filters}
      onClearAllFilters={() => setFilters([])}
      sortOptions={sortOptions}
      activeSort={sort}
      onSortChange={(key, dir) => setSort({ key, direction: dir })}
      totalCount={86}
      summaryItems={[
        { key: 'running', label: 'Calisan', value: '72', tone: 'success' },
        { key: 'degraded', label: 'Dusuk', value: '8', tone: 'warning' },
        { key: 'down', label: 'Kapali', value: '6', tone: 'danger' },
      ]}
      items={[
        <div key="1" className="flex justify-between p-2 border rounded-sm text-sm">
          <span>auth-service</span><span className="text-green-600 text-xs">Calisiyor</span>
        </div>,
        <div key="2" className="flex justify-between p-2 border rounded-sm text-sm">
          <span>payment-gateway</span><span className="text-green-600 text-xs">Calisiyor</span>
        </div>,
        <div key="3" className="flex justify-between p-2 border rounded-sm text-sm">
          <span>notification-svc</span><span className="text-yellow-600 text-xs">Dusuk</span>
        </div>,
      ]}
    />
  );
}`,
      tags: ["compact", "kompakt", "yogun", "layout", "size"],
    },
    {
      id: "sfl-toolbar",
      title: "Toolbar ve Yeniden Yukleme",
      description: "toolbar ile ozel butonlar ve onReload ile yeniden yukleme islevselliginin kullanimi.",
      category: "layout",
      code: `import { useState, useCallback } from 'react';
import { SearchFilterListing, TextInput, Button } from '@mfe/design-system';

export function ToolbarOrnegi() {
  const [lastReload, setLastReload] = useState<string>(new Date().toLocaleTimeString('tr-TR'));

  const handleReload = useCallback(() => {
    setLastReload(new Date().toLocaleTimeString('tr-TR'));
    // Veriyi yeniden yukle
  }, []);

  return (
    <SearchFilterListing
      eyebrow="Izleme"
      title="Canli Log Akisi"
      description={\`Son yenileme: \${lastReload}\`}
      filters={
        <TextInput label="Log ara" value="" size="sm" placeholder="Filtre girin..." />
      }
      onReload={handleReload}
      toolbar={
        <>
          <Button size="sm" variant="outline">Disa Aktar</Button>
          <Button size="sm" variant="outline">Ayarlar</Button>
        </>
      }
      totalCount={1284}
      listTitle="Log Kayitlari"
      items={[
        <div key="1" className="flex gap-3 p-3 border rounded-lg font-mono text-sm">
          <span className="text-gray-400">12:04:22</span>
          <span className="text-green-600">[INFO]</span>
          <span>Kullanici giris yapti — user_id=4821</span>
        </div>,
        <div key="2" className="flex gap-3 p-3 border rounded-lg font-mono text-sm">
          <span className="text-gray-400">12:04:19</span>
          <span className="text-yellow-600">[WARN]</span>
          <span>Yuksek bellek kullanimi — %87 esik</span>
        </div>,
        <div key="3" className="flex gap-3 p-3 border rounded-lg font-mono text-sm">
          <span className="text-gray-400">12:04:15</span>
          <span className="text-red-600">[ERROR]</span>
          <span>Veritabani baglanti zaman asimi — pool=primary</span>
        </div>,
      ]}
    />
  );
}`,
      tags: ["toolbar", "reload", "yeniden-yukleme", "buton", "layout"],
    },
    {
      id: "sfl-empty-filtered",
      title: "Filtrelenmis Bos Durum",
      description: "Aktif filtreler varken sonuc bulunamadiginda gosterilen ozel bos durum mesaji ve filtre temizleme aksiyonu.",
      category: "patterns",
      code: `import { useState } from 'react';
import { SearchFilterListing, TextInput, Select, type ActiveFilter } from '@mfe/design-system';

export function FiltreliBosDurum() {
  const [filters, setFilters] = useState<ActiveFilter[]>([
    { key: 'kategori', label: 'Kategori', value: 'Arsivlenmis', onRemove: () => removeFilter('kategori') },
    { key: 'tarih', label: 'Tarih', value: 'Son 7 gun', onRemove: () => removeFilter('tarih') },
  ]);

  const removeFilter = (key: string) => {
    setFilters((prev) => prev.filter((f) => f.key !== key));
  };

  const clearAll = () => setFilters([]);

  return (
    <SearchFilterListing
      title="Bildirim Gecmisi"
      description="Gecmis bildirimleri filtreleyerek inceleyebilirsiniz."
      filters={
        <>
          <TextInput label="Arama" value="mevcut-olmayan-kayit" size="sm" />
          <Select
            label="Kategori"
            size="sm"
            value="archived"
            options={[
              { label: 'Tumu', value: 'all' },
              { label: 'Arsivlenmis', value: 'archived' },
              { label: 'Okunmamis', value: 'unread' },
            ]}
          />
        </>
      }
      activeFilters={filters}
      onClearAllFilters={clearAll}
      items={[]}
      emptyStateLabel="Bu filtre kombinasyonu icin sonuc bulunamadi."
    />
  );
}`,
      tags: ["empty", "bos", "filtre", "contextual", "pattern"],
    },
  ],
  Avatar: [
    {
      id: "avatar-basic",
      title: "Temel Kullanim",
      description: "Gorsel, baş harfler veya varsayilan ikon ile temel avatar kullanimi.",
      category: "basic",
      code: `import { Avatar } from '@mfe/design-system';

export function Example() {
  return (
    <div className="flex items-center gap-3">
      <Avatar src="https://i.pravatar.cc/150?u=1" alt="Kullanici" />
      <Avatar initials="HK" />
      <Avatar />
    </div>
  );
}`,
      tags: ["avatar", "profil", "kullanici"],
    },
    {
      id: "avatar-sizes",
      title: "Boyut Olcekleri",
      description: "xs'ten 2xl'ye kadar tum avatar boyutlari.",
      category: "basic",
      code: `import { Avatar } from '@mfe/design-system';

export function Example() {
  return (
    <div className="flex items-end gap-3">
      <Avatar initials="HK" size="xs" />
      <Avatar initials="HK" size="sm" />
      <Avatar initials="HK" size="md" />
      <Avatar initials="HK" size="lg" />
      <Avatar initials="HK" size="xl" />
      <Avatar initials="HK" size="2xl" />
    </div>
  );
}`,
      previewProps: { size: "md" },
      multiVariantAxis: "size",
      tags: ["boyut", "size", "responsive"],
    },
    {
      id: "avatar-shapes",
      title: "Sekil Varyantlari",
      description: "Daire ve kare seklinde avatar gorunumleri.",
      category: "basic",
      code: `import { Avatar } from '@mfe/design-system';

export function Example() {
  return (
    <div className="flex items-center gap-3">
      <Avatar initials="AY" shape="circle" />
      <Avatar initials="TK" shape="square" />
    </div>
  );
}`,
      tags: ["sekil", "daire", "kare", "shape"],
    },
    {
      id: "avatar-fallback",
      title: "Yedek Gosterim Sirasi",
      description: "Gorsel yuklenemediginde bas harflere, ikon veya varsayilana dusme davranisi.",
      category: "advanced",
      code: `import { Avatar } from '@mfe/design-system';
import { Bot } from 'lucide-react';

export function Example() {
  return (
    <div className="flex items-center gap-3">
      <Avatar src="https://invalid-url.jpg" initials="HK" />
      <Avatar icon={<Bot />} />
      <Avatar />
    </div>
  );
}`,
      tags: ["fallback", "yedek", "hata"],
    },
  ],
  Badge: [
    {
      id: "badge-basic",
      title: "Temel Kullanim",
      description: "Farkli durum varyantlari ile temel badge kullanimi.",
      category: "basic",
      code: `import { Badge } from '@mfe/design-system';

export function Example() {
  return (
    <div className="flex items-center gap-2">
      <Badge>Varsayilan</Badge>
      <Badge variant="primary">Birincil</Badge>
      <Badge variant="success">Basarili</Badge>
      <Badge variant="warning">Uyari</Badge>
      <Badge variant="error">Hata</Badge>
      <Badge variant="info">Bilgi</Badge>
    </div>
  );
}`,
      previewProps: { variant: "primary" },
      multiVariantAxis: "variant",
      tags: ["badge", "durum", "etiket"],
    },
    {
      id: "badge-sizes",
      title: "Boyut Secenekleri",
      description: "Kucuk, orta ve buyuk badge boyutlari.",
      category: "basic",
      code: `import { Badge } from '@mfe/design-system';

export function Example() {
  return (
    <div className="flex items-center gap-2">
      <Badge size="sm" variant="primary">Kucuk</Badge>
      <Badge size="md" variant="primary">Orta</Badge>
      <Badge size="lg" variant="primary">Buyuk</Badge>
    </div>
  );
}`,
      previewProps: { size: "md" },
      multiVariantAxis: "size",
      tags: ["boyut", "size"],
    },
    {
      id: "badge-dot",
      title: "Nokta Gosterge",
      description: "Metin olmadan durum belirten dot badge kullanimi.",
      category: "advanced",
      code: `import { Badge } from '@mfe/design-system';

export function Example() {
  return (
    <div className="flex items-center gap-3">
      <span className="flex items-center gap-1.5">
        <Badge dot variant="success" /> Aktif
      </span>
      <span className="flex items-center gap-1.5">
        <Badge dot variant="warning" /> Beklemede
      </span>
      <span className="flex items-center gap-1.5">
        <Badge dot variant="error" /> Devre Disi
      </span>
    </div>
  );
}`,
      tags: ["dot", "nokta", "durum", "status"],
    },
  ],
  Tag: [
    {
      id: "tag-basic",
      title: "Temel Kullanim",
      description: "Farkli renk varyantlari ile temel tag kullanimi.",
      category: "basic",
      code: `import { Tag } from '@mfe/design-system';

export function Example() {
  return (
    <div className="flex flex-wrap gap-2">
      <Tag>Varsayilan</Tag>
      <Tag variant="primary">Birincil</Tag>
      <Tag variant="success">Basarili</Tag>
      <Tag variant="warning">Uyari</Tag>
      <Tag variant="error">Hata</Tag>
    </div>
  );
}`,
      tags: ["tag", "etiket", "label"],
    },
    {
      id: "tag-closable",
      title: "Kapatilabilir Etiketler",
      description: "Kullanicinin kaldirabilecegi kapatma butonlu etiketler.",
      category: "form",
      code: `import { Tag } from '@mfe/design-system';
import { useState } from 'react';

export function Example() {
  const [tags, setTags] = useState(['React', 'TypeScript', 'Tailwind']);

  const removeTag = (tag: string) =>
    setTags((prev) => prev.filter((t) => t !== tag));

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Tag key={tag} closable onClose={() => removeTag(tag)} variant="primary">
          {tag}
        </Tag>
      ))}
    </div>
  );
}`,
      tags: ["closable", "kapatilabilir", "kaldir", "filtre"],
    },
    {
      id: "tag-with-icon",
      title: "Ikonlu Etiket",
      description: "Sol tarafinda ikon bulunan etiket kullanimi.",
      category: "layout",
      code: `import { Tag } from '@mfe/design-system';
import { Shield, Zap, Globe } from 'lucide-react';

export function Example() {
  return (
    <div className="flex flex-wrap gap-2">
      <Tag icon={<Shield />} variant="success">Guvenli</Tag>
      <Tag icon={<Zap />} variant="warning">Performans</Tag>
      <Tag icon={<Globe />} variant="info">Genel</Tag>
    </div>
  );
}`,
      tags: ["ikon", "icon", "lucide"],
    },
  ],
  Radio: [
    {
      id: "radio-basic",
      title: "Temel Kullanim",
      description: "RadioGroup ile kontrol edilen temel radio button grubu.",
      category: "basic",
      code: `import { Radio, RadioGroup } from '@mfe/design-system';
import { useState } from 'react';

export function Example() {
  const [value, setValue] = useState('email');

  return (
    <RadioGroup name="iletisim" value={value} onChange={setValue}>
      <Radio value="email" label="E-posta" />
      <Radio value="sms" label="SMS" />
      <Radio value="push" label="Push Bildirim" />
    </RadioGroup>
  );
}`,
      tags: ["radio", "secim", "form"],
    },
    {
      id: "radio-with-description",
      title: "Aciklamali Radio",
      description: "Her secenegin altinda aciklama metni bulunan radio grubu.",
      category: "form",
      code: `import { Radio, RadioGroup } from '@mfe/design-system';
import { useState } from 'react';

export function Example() {
  const [plan, setPlan] = useState('starter');

  return (
    <RadioGroup name="plan" value={plan} onChange={setPlan}>
      <Radio
        value="starter"
        label="Baslangic"
        description="5 kullanici, 10 GB depolama"
      />
      <Radio
        value="pro"
        label="Profesyonel"
        description="25 kullanici, 100 GB depolama"
      />
      <Radio
        value="enterprise"
        label="Kurumsal"
        description="Sinirsiz kullanici ve depolama"
      />
    </RadioGroup>
  );
}`,
      tags: ["aciklama", "description", "plan", "form"],
    },
    {
      id: "radio-horizontal",
      title: "Yatay Yerlesim",
      description: "Yatay yonde siralanan radio button grubu.",
      category: "layout",
      code: `import { Radio, RadioGroup } from '@mfe/design-system';
import { useState } from 'react';

export function Example() {
  const [size, setSize] = useState('md');

  return (
    <RadioGroup name="boyut" value={size} onChange={setSize} direction="horizontal">
      <Radio value="sm" label="Kucuk" />
      <Radio value="md" label="Orta" />
      <Radio value="lg" label="Buyuk" />
    </RadioGroup>
  );
}`,
      tags: ["yatay", "horizontal", "layout"],
    },
  ],
  Switch: [
    {
      id: "switch-basic",
      title: "Temel Kullanim",
      description: "Acik/kapali durumu gosteren temel switch bileseni.",
      category: "basic",
      code: `import { Switch } from '@mfe/design-system';
import { useState } from 'react';

export function Example() {
  const [enabled, setEnabled] = useState(false);

  return (
    <Switch
      label="Bildirimleri etkinlestir"
      checked={enabled}
      onCheckedChange={setEnabled}
    />
  );
}`,
      tags: ["switch", "toggle", "acik-kapali"],
    },
    {
      id: "switch-with-description",
      title: "Aciklamali Switch",
      description: "Etiket ve altinda aciklama metni bulunan switch.",
      category: "form",
      code: `import { Switch } from '@mfe/design-system';
import { useState } from 'react';

export function Example() {
  const [darkMode, setDarkMode] = useState(false);
  const [analytics, setAnalytics] = useState(true);

  return (
    <div className="flex flex-col gap-4">
      <Switch
        label="Karanlik Mod"
        description="Arayuz renklerini koyu temaya cevirir."
        checked={darkMode}
        onCheckedChange={setDarkMode}
      />
      <Switch
        label="Analitik Verileri"
        description="Kullanim verilerini anonim olarak toplar."
        checked={analytics}
        onCheckedChange={setAnalytics}
      />
    </div>
  );
}`,
      tags: ["aciklama", "description", "ayarlar", "form"],
    },
    {
      id: "switch-sizes",
      title: "Boyut Secenekleri",
      description: "Kucuk, orta ve buyuk switch boyutlari.",
      category: "basic",
      code: `import { Switch } from '@mfe/design-system';

export function Example() {
  return (
    <div className="flex flex-col gap-3">
      <Switch label="Kucuk" switchSize="sm" checked />
      <Switch label="Orta" switchSize="md" checked />
      <Switch label="Buyuk" switchSize="lg" checked />
    </div>
  );
}`,
      previewProps: { switchSize: "md" },
      multiVariantAxis: "switchSize",
      tags: ["boyut", "size"],
    },
  ],
  Divider: [
    {
      id: "divider-basic",
      title: "Temel Kullanim",
      description: "Icerik bloklari arasinda yatay ayirici cizgi.",
      category: "basic",
      code: `import { Divider } from '@mfe/design-system';

export function Example() {
  return (
    <div className="flex flex-col gap-4">
      <p>Birinci bolum icerigi</p>
      <Divider />
      <p>Ikinci bolum icerigi</p>
    </div>
  );
}`,
      tags: ["divider", "ayirici", "cizgi"],
    },
    {
      id: "divider-with-label",
      title: "Etiketli Ayirici",
      description: "Ortasinda metin etiketi bulunan ayirici cizgi.",
      category: "layout",
      code: `import { Divider } from '@mfe/design-system';

export function Example() {
  return (
    <div className="flex flex-col gap-4">
      <p>Kayit formu</p>
      <Divider label="veya" />
      <button>Google ile devam et</button>
    </div>
  );
}`,
      tags: ["etiket", "label", "veya", "or"],
    },
    {
      id: "divider-vertical",
      title: "Dikey Ayirici",
      description: "Yan yana elemanlari ayirmak icin dikey cizgi.",
      category: "layout",
      code: `import { Divider } from '@mfe/design-system';

export function Example() {
  return (
    <div className="flex items-center h-8 gap-0">
      <span className="text-sm">Ana Sayfa</span>
      <Divider orientation="vertical" spacing="md" />
      <span className="text-sm">Hakkimizda</span>
      <Divider orientation="vertical" spacing="md" />
      <span className="text-sm">Iletisim</span>
    </div>
  );
}`,
      tags: ["dikey", "vertical", "navigasyon"],
    },
  ],
  Tooltip: [
    {
      id: "tooltip-basic",
      title: "Temel Kullanim",
      description: "Bir elemanin uzerine gelindiginde bilgi gosteren tooltip.",
      category: "basic",
      code: `import { Tooltip, Button } from '@mfe/design-system';

export function Example() {
  return (
    <Tooltip content="Bu islemi geri alamazsiniz">
      <Button variant="ghost">Sil</Button>
    </Tooltip>
  );
}`,
      tags: ["tooltip", "ipucu", "hover"],
    },
    {
      id: "tooltip-placements",
      title: "Konum Secenekleri",
      description: "Tooltiplerin ust, alt, sol ve sag konumlarda gosterimi.",
      category: "basic",
      code: `import { Tooltip, Button } from '@mfe/design-system';

export function Example() {
  return (
    <div className="flex items-center gap-4 p-8">
      <Tooltip content="Ust" placement="top">
        <Button variant="ghost">Ust</Button>
      </Tooltip>
      <Tooltip content="Alt" placement="bottom">
        <Button variant="ghost">Alt</Button>
      </Tooltip>
      <Tooltip content="Sol" placement="left">
        <Button variant="ghost">Sol</Button>
      </Tooltip>
      <Tooltip content="Sag" placement="right">
        <Button variant="ghost">Sag</Button>
      </Tooltip>
    </div>
  );
}`,
      tags: ["konum", "placement", "yon"],
    },
    {
      id: "tooltip-advanced",
      title: "Gecikme ve Ok Isaretli",
      description: "Ozel gecikme suresi ve ok isareti ile tooltip.",
      category: "advanced",
      code: `import { Tooltip } from '@mfe/design-system';
import { Info } from 'lucide-react';

export function Example() {
  return (
    <Tooltip
      content="Detayli bilgi icin dokumantasyona bakiniz."
      placement="right"
      showArrow
      openDelay={500}
    >
      <Info className="h-4 w-4 text-[var(--text-secondary)] cursor-help" />
    </Tooltip>
  );
}`,
      tags: ["ok", "arrow", "gecikme", "delay"],
    },
  ],
  Text: [
    {
      id: "text-basic",
      title: "Temel Kullanim",
      description: "Farkli boyut ve renk varyantlari ile metin bileseni.",
      category: "basic",
      code: `import { Text } from '@mfe/design-system';

export function Example() {
  return (
    <div className="flex flex-col gap-2">
      <Text as="h2" size="2xl" weight="bold">Baslik Metni</Text>
      <Text variant="secondary">Ikincil aciklama metni burada yer alir.</Text>
      <Text variant="muted" size="sm">Soluk yardimci metin.</Text>
    </div>
  );
}`,
      tags: ["text", "metin", "tipografi"],
    },
    {
      id: "text-variants",
      title: "Renk Varyantlari",
      description: "Durum belirten farkli renk varyantlarinda metin.",
      category: "basic",
      code: `import { Text } from '@mfe/design-system';

export function Example() {
  return (
    <div className="flex flex-col gap-1">
      <Text variant="default">Varsayilan metin</Text>
      <Text variant="secondary">Ikincil metin</Text>
      <Text variant="success">Basarili islem mesaji</Text>
      <Text variant="warning">Uyari mesaji</Text>
      <Text variant="error">Hata mesaji</Text>
      <Text variant="info">Bilgilendirme mesaji</Text>
    </div>
  );
}`,
      previewProps: { variant: "default" },
      multiVariantAxis: "variant",
      tags: ["renk", "varyant", "durum"],
    },
    {
      id: "text-truncate",
      title: "Metin Kisaltma",
      description: "Uzun metinleri tek satir veya belirli satir sayisinda kisaltma.",
      category: "advanced",
      code: `import { Text } from '@mfe/design-system';

export function Example() {
  const longText = "Bu cok uzun bir metin ornegi olup tasma durumunda nasil kisaltildigini gosterir.";

  return (
    <div className="flex flex-col gap-3 max-w-xs">
      <Text truncate>{longText}</Text>
      <Text lineClamp={2} as="p">
        {longText} {longText}
      </Text>
    </div>
  );
}`,
      tags: ["truncate", "kisaltma", "line-clamp", "overflow"],
    },
    {
      id: "text-polymorphic",
      title: "Polimorfik Kullanim",
      description: "Farkli HTML elementleri olarak render edilen text bileseni.",
      category: "advanced",
      code: `import { Text } from '@mfe/design-system';

export function Example() {
  return (
    <div className="flex flex-col gap-2">
      <Text as="h1" size="3xl" weight="bold">Ana Baslik</Text>
      <Text as="p" size="base">Paragraf icerigi</Text>
      <Text as="code" mono size="sm" variant="secondary">
        const x = 42;
      </Text>
      <Text as="blockquote" variant="muted" size="sm">
        Alinti metin ornegi
      </Text>
    </div>
  );
}`,
      tags: ["polimorfik", "as", "html", "element"],
    },
  ],
  Dropdown: [
    {
      id: "dropdown-basic",
      title: "Temel Kullanim",
      description: "Basit menu ogelerinden olusan temel dropdown.",
      category: "basic",
      code: `import { Dropdown, Button } from '@mfe/design-system';

export function Example() {
  return (
    <Dropdown
      items={[
        { key: 'edit', label: 'Duzenle', onClick: () => console.log('duzenle') },
        { key: 'copy', label: 'Kopyala', onClick: () => console.log('kopyala') },
        { key: 'delete', label: 'Sil', danger: true, onClick: () => console.log('sil') },
      ]}
    >
      <Button variant="secondary">Islemler</Button>
    </Dropdown>
  );
}`,
      tags: ["dropdown", "menu", "islem"],
    },
    {
      id: "dropdown-with-icons",
      title: "Ikonlu Menu",
      description: "Her oge icin ikon ve aciklama iceren zengin dropdown.",
      category: "layout",
      code: `import { Dropdown, Button } from '@mfe/design-system';
import { Edit, Copy, Trash2, Download } from 'lucide-react';

export function Example() {
  return (
    <Dropdown
      items={[
        { key: 'edit', label: 'Duzenle', icon: <Edit />, description: 'Kaydi duzenle' },
        { key: 'copy', label: 'Kopyala', icon: <Copy />, description: 'Panoya kopyala' },
        { type: 'separator' },
        { key: 'export', label: 'Disa Aktar', icon: <Download /> },
        { key: 'delete', label: 'Sil', icon: <Trash2 />, danger: true },
      ]}
    >
      <Button variant="secondary">Detayli Menu</Button>
    </Dropdown>
  );
}`,
      tags: ["ikon", "icon", "separator", "aciklama"],
    },
    {
      id: "dropdown-grouped",
      title: "Gruplu Menu",
      description: "Etiket ve ayiricilarla bolumlendirilmis dropdown menusu.",
      category: "advanced",
      code: `import { Dropdown, IconButton } from '@mfe/design-system';
import { MoreVertical, Settings, Users, LogOut } from 'lucide-react';

export function Example() {
  return (
    <Dropdown
      placement="bottom-end"
      items={[
        { type: 'label', label: 'Hesap' },
        { key: 'settings', label: 'Ayarlar', icon: <Settings /> },
        { key: 'team', label: 'Takim Yonetimi', icon: <Users /> },
        { type: 'separator' },
        { key: 'logout', label: 'Cikis Yap', icon: <LogOut />, danger: true },
      ]}
    >
      <IconButton icon={<MoreVertical />} label="Daha fazla" variant="ghost" />
    </Dropdown>
  );
}`,
      tags: ["grup", "label", "ayirici", "placement"],
    },
  ],
  IconButton: [
    {
      id: "iconbutton-basic",
      title: "Temel Kullanim",
      description: "Farkli varyantlarda temel ikon buton kullanimi.",
      category: "basic",
      code: `import { IconButton } from '@mfe/design-system';
import { Plus, Settings, Trash2, Download } from 'lucide-react';

export function Example() {
  return (
    <div className="flex items-center gap-2">
      <IconButton icon={<Plus />} label="Ekle" variant="primary" />
      <IconButton icon={<Settings />} label="Ayarlar" variant="secondary" />
      <IconButton icon={<Download />} label="Indir" variant="outline" />
      <IconButton icon={<Trash2 />} label="Sil" variant="danger" />
    </div>
  );
}`,
      previewProps: { variant: "ghost" },
      multiVariantAxis: "variant",
      tags: ["iconbutton", "ikon", "varyant"],
    },
    {
      id: "iconbutton-sizes",
      title: "Boyut Secenekleri",
      description: "xs'ten lg'ye kadar tum ikon buton boyutlari.",
      category: "basic",
      code: `import { IconButton } from '@mfe/design-system';
import { Bell } from 'lucide-react';

export function Example() {
  return (
    <div className="flex items-end gap-2">
      <IconButton icon={<Bell />} label="Bildirim" size="xs" variant="outline" />
      <IconButton icon={<Bell />} label="Bildirim" size="sm" variant="outline" />
      <IconButton icon={<Bell />} label="Bildirim" size="md" variant="outline" />
      <IconButton icon={<Bell />} label="Bildirim" size="lg" variant="outline" />
    </div>
  );
}`,
      previewProps: { size: "md" },
      multiVariantAxis: "size",
      tags: ["boyut", "size"],
    },
    {
      id: "iconbutton-rounded",
      title: "Yuvarlak ve Yukleniyor",
      description: "Pill seklinde yuvarlak ikon buton ve yukleniyor durumu.",
      category: "advanced",
      code: `import { IconButton } from '@mfe/design-system';
import { Heart, Share2, Bookmark } from 'lucide-react';

export function Example() {
  return (
    <div className="flex items-center gap-2">
      <IconButton icon={<Heart />} label="Begeni" variant="primary" rounded-sm />
      <IconButton icon={<Share2 />} label="Paylas" variant="secondary" rounded-sm />
      <IconButton icon={<Bookmark />} label="Kaydediliyor" variant="outline" rounded-sm loading />
    </div>
  );
}`,
      tags: ["rounded", "pill", "loading", "yukleniyor"],
    },
  ],
  Popover: [
    {
      id: "popover-basic",
      title: "Temel Kullanim",
      description: "Tiklandiginda bilgi gosterilen temel popover.",
      category: "basic",
      code: `import { Popover, Button } from '@mfe/design-system';

export function Example() {
  return (
    <Popover
      trigger={<Button variant="secondary">Detaylar</Button>}
      title="Politika Detayi"
      content="Bu politika, otonom ajanlar icin guvenli calisma sinirlarini belirler."
    />
  );
}`,
      tags: ["popover", "bilgi", "overlay"],
    },
    {
      id: "popover-hover",
      title: "Hover Tetikleme",
      description: "Fare ile uzerine gelindiginde acilan popover.",
      category: "basic",
      code: `import { Popover } from '@mfe/design-system';
import { Info } from 'lucide-react';

export function Example() {
  return (
    <Popover
      trigger={<Info className="h-4 w-4 text-[var(--text-secondary)] cursor-help" />}
      content="Ek bilgi icin dokumantasyona basvurun."
      triggerMode="hover"
      side="right"
    />
  );
}`,
      tags: ["hover", "tetikleme", "bilgi"],
    },
    {
      id: "popover-placement",
      title: "Konum Secenekleri",
      description: "Farkli yon ve hizalama secenekleri ile popover.",
      category: "advanced",
      code: `import { Popover, Button } from '@mfe/design-system';

export function Example() {
  return (
    <div className="flex items-center gap-4 p-12">
      <Popover
        trigger={<Button variant="ghost" size="sm">Ust</Button>}
        content="Ustte gosterilen popover"
        side="top"
        align="center"
      />
      <Popover
        trigger={<Button variant="ghost" size="sm">Sag</Button>}
        content="Sagda gosterilen popover"
        side="right"
        align="start"
      />
      <Popover
        trigger={<Button variant="ghost" size="sm">Alt</Button>}
        content="Altta gosterilen popover"
        side="bottom"
        align="end"
      />
    </div>
  );
}`,
      tags: ["side", "align", "konum", "yon"],
    },
    {
      id: "popover-controlled",
      title: "Kontrollü Popover",
      description: "Dis state ile acilip kapanan kontrollü popover.",
      category: "form",
      code: `import { Popover, Button } from '@mfe/design-system';
import { useState } from 'react';

export function Example() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center gap-3">
      <Popover
        trigger={<Button variant="secondary">Filtre</Button>}
        title="Filtre Secenekleri"
        content={
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" /> Aktif
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" /> Beklemede
            </label>
          </div>
        }
        open={open}
        onOpenChange={setOpen}
        showArrow={false}
      />
    </div>
  );
}`,
      tags: ["controlled", "kontrollü", "filtre", "form"],
    },
  ],
  Skeleton: [
    {
      id: "skeleton-basic",
      title: "Temel Kullanim",
      description: "Farkli boyut ve sekillerde temel skeleton yer tutucu.",
      category: "basic",
      code: `import { Skeleton } from '@mfe/design-system';

export function Example() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton width="60%" height={20} />
      <Skeleton width="100%" height={14} />
      <Skeleton width="80%" height={14} />
    </div>
  );
}`,
      tags: ["skeleton", "placeholder", "yer-tutucu"],
    },
    {
      id: "skeleton-lines",
      title: "Coklu Satir",
      description: "Paragraf icerigini temsil eden coklu satir skeleton.",
      category: "basic",
      code: `import { Skeleton } from '@mfe/design-system';

export function Example() {
  return <Skeleton lines={4} height={14} />;
}`,
      tags: ["lines", "satir", "paragraf"],
    },
    {
      id: "skeleton-card",
      title: "Kart Yukleme Durumu",
      description: "Bir kart bileseninin yukleme durumunu gosteren skeleton deseni.",
      category: "patterns",
      code: `import { Skeleton, Card } from '@mfe/design-system';

export function Example() {
  return (
    <Card padding="md" variant="elevated">
      <div className="flex items-center gap-3">
        <Skeleton circle height={40} />
        <div className="flex flex-col flex-1 gap-2">
          <Skeleton width="50%" height={16} />
          <Skeleton width="30%" height={12} />
        </div>
      </div>
      <div className="mt-4">
        <Skeleton lines={3} height={14} />
      </div>
    </Card>
  );
}`,
      tags: ["kart", "card", "yukleme", "pattern"],
    },
  ],
  Spinner: [
    {
      id: "spinner-basic",
      title: "Temel Kullanim",
      description: "Farkli boyutlarda temel yukleme gostergesi.",
      category: "basic",
      code: `import { Spinner } from '@mfe/design-system';

export function Example() {
  return (
    <div className="flex items-center gap-4">
      <Spinner size="xs" />
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
      <Spinner size="xl" />
    </div>
  );
}`,
      previewProps: { size: "md" },
      multiVariantAxis: "size",
      tags: ["spinner", "yukleme", "boyut"],
    },
    {
      id: "spinner-block",
      title: "Blok Modu",
      description: "Etiketli ve ortalanmis tam genislik yukleme gostergesi.",
      category: "layout",
      code: `import { Spinner } from '@mfe/design-system';

export function Example() {
  return <Spinner mode="block" label="Veriler yukleniyor..." size="lg" />;
}`,
      tags: ["block", "etiket", "ortalanmis"],
    },
    {
      id: "spinner-inline",
      title: "Satir Ici Kullanim",
      description: "Metin veya buton icinde satir ici yukleme gostergesi.",
      category: "patterns",
      code: `import { Spinner, Button } from '@mfe/design-system';

export function Example() {
  return (
    <div className="flex flex-col gap-3">
      <p className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
        <Spinner size="sm" /> Kayit aliniyor...
      </p>
      <Button disabled>
        <Spinner size="xs" className="mr-2" /> Isleniyor
      </Button>
    </div>
  );
}`,
      tags: ["inline", "satir-ici", "buton", "metin"],
    },
  ],
  Card: [
    {
      id: "card-basic",
      title: "Temel Kullanim",
      description: "Farkli gorunum varyantlarinda temel kart bileseni.",
      category: "basic",
      code: `import { Card } from '@mfe/design-system';

export function Example() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Card variant="elevated">Yukseltiimis kart icerigi</Card>
      <Card variant="outlined">Cerceveli kart icerigi</Card>
      <Card variant="filled">Dolgulu kart icerigi</Card>
      <Card variant="ghost">Hayalet kart icerigi</Card>
    </div>
  );
}`,
      previewProps: { variant: "elevated" },
      multiVariantAxis: "variant",
      tags: ["card", "kart", "varyant"],
    },
    {
      id: "card-with-header",
      title: "Baslik ve Alt Bilgi",
      description: "CardHeader, CardBody ve CardFooter alt bilesenleriyle yapilandirilmis kart.",
      category: "layout",
      code: `import { Card, CardHeader, CardBody, CardFooter } from '@mfe/design-system';
import { Button, Badge } from '@mfe/design-system';

export function Example() {
  return (
    <Card variant="elevated" padding="md">
      <CardHeader
        title="Politika Durumu"
        subtitle="Son guncelleme: 2 saat once"
        action={<Badge variant="success">Aktif</Badge>}
      />
      <CardBody>
        <p className="text-sm text-[var(--text-secondary)]">
          Otonom ajanlarin guvenlik politikasi basariyla uygulanmaktadir.
        </p>
      </CardBody>
      <CardFooter>
        <Button size="sm" variant="ghost">Detaylar</Button>
        <Button size="sm" variant="primary">Guncelle</Button>
      </CardFooter>
    </Card>
  );
}`,
      tags: ["header", "footer", "body", "yapilandirilmis"],
    },
    {
      id: "card-hoverable",
      title: "Tiklanabilir Kart",
      description: "Hover efektli ve tiklanabilir interaktif kart.",
      category: "advanced",
      code: `import { Card, CardHeader } from '@mfe/design-system';
import { Shield, Zap, Globe } from 'lucide-react';

export function Example() {
  const cards = [
    { icon: <Shield />, title: 'Guvenlik', desc: 'Erisim politikalari' },
    { icon: <Zap />, title: 'Performans', desc: 'Hiz metrikleri' },
    { icon: <Globe />, title: 'Erisim', desc: 'Genel ayarlar' },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {cards.map((c) => (
        <Card key={c.title} variant="outlined" padding="md" hoverable onClick={() => console.log(c.title)}>
          <div className="flex items-center gap-2 mb-2 text-[var(--action-primary)]">
            {c.icon}
          </div>
          <CardHeader title={c.title} subtitle={c.desc} />
        </Card>
      ))}
    </div>
  );
}`,
      tags: ["hoverable", "tiklanabilir", "interaktif", "grid"],
    },
    {
      id: "card-padding",
      title: "Dolgu Secenekleri",
      description: "Farkli dolgu boyutlari ile kart gorunumleri.",
      category: "basic",
      code: `import { Card } from '@mfe/design-system';

export function Example() {
  return (
    <div className="flex flex-col gap-3">
      <Card padding="none" variant="outlined">padding=none</Card>
      <Card padding="sm" variant="outlined">padding=sm</Card>
      <Card padding="md" variant="outlined">padding=md</Card>
      <Card padding="lg" variant="outlined">padding=lg</Card>
    </div>
  );
}`,
      previewProps: { padding: "md" },
      multiVariantAxis: "padding",
      tags: ["padding", "dolgu", "boyut"],
    },
  ],
  Breadcrumb: [
    {
      id: "breadcrumb-basic",
      title: "Temel Kullanim",
      description: "Sayfa hiyerarsisini gosteren temel breadcrumb navigasyonu.",
      category: "basic",
      code: `import { Breadcrumb } from '@mfe/design-system';

export function Example() {
  return (
    <Breadcrumb
      items={[
        { label: 'Ana Sayfa', onClick: () => console.log('ana sayfa') },
        { label: 'Yonetim', onClick: () => console.log('yonetim') },
        { label: 'Politikalar' },
      ]}
    />
  );
}`,
      tags: ["breadcrumb", "navigasyon", "hiyerarsi"],
    },
    {
      id: "breadcrumb-with-icons",
      title: "Ikonlu Breadcrumb",
      description: "Her oge icin ikon iceren breadcrumb navigasyonu.",
      category: "layout",
      code: `import { Breadcrumb } from '@mfe/design-system';
import { Home, Settings, Shield } from 'lucide-react';

export function Example() {
  return (
    <Breadcrumb
      items={[
        { label: 'Ana Sayfa', icon: <Home />, onClick: () => {} },
        { label: 'Ayarlar', icon: <Settings />, onClick: () => {} },
        { label: 'Guvenlik', icon: <Shield /> },
      ]}
    />
  );
}`,
      tags: ["ikon", "icon", "navigasyon"],
    },
    {
      id: "breadcrumb-collapsed",
      title: "Daraltilmis Breadcrumb",
      description: "maxItems ile uzun yollarda otomatik daraltma.",
      category: "advanced",
      code: `import { Breadcrumb } from '@mfe/design-system';

export function Example() {
  return (
    <Breadcrumb
      maxItems={3}
      items={[
        { label: 'Ana Sayfa', onClick: () => {} },
        { label: 'Yonetim', onClick: () => {} },
        { label: 'Politikalar', onClick: () => {} },
        { label: 'Guvenlik', onClick: () => {} },
        { label: 'Erisim Kontrol' },
      ]}
    />
  );
}`,
      tags: ["daraltma", "collapse", "maxItems", "uzun-yol"],
    },
  ],
  Accordion: [
    {
      id: "accordion-basic",
      title: "Temel Kullanim",
      description: "Acilip kapanabilen bolumleriyle temel accordion bileseni.",
      category: "basic",
      code: `import { Accordion } from '@mfe/design-system';

export function Example() {
  return (
    <Accordion
      items={[
        { value: 'item-1', title: 'Hesap Ayarlari', content: 'Kullanici adi, e-posta ve sifre ayarlarinizi yonetebilirsiniz.' },
        { value: 'item-2', title: 'Bildirim Tercihleri', content: 'E-posta, SMS ve push bildirim tercihlerinizi ayarlayin.' },
        { value: 'item-3', title: 'Gizlilik ve Guvenlik', content: 'Iki faktorlu dogrulama ve oturum yonetimi.' },
      ]}
    />
  );
}`,
      tags: ["accordion", "akordiyon", "acilir-kapanir"],
    },
    {
      id: "accordion-single",
      title: "Tekli Secim Modu",
      description: "Ayni anda yalnizca bir bolumun acik oldugu accordion.",
      category: "basic",
      code: `import { Accordion } from '@mfe/design-system';

export function Example() {
  return (
    <Accordion
      selectionMode="single"
      items={[
        { value: 'faq-1', title: 'Nasil baslayabilirim?', content: 'Kayit olduktan sonra kontrol panelinden ilk projenizi olusturabilirsiniz.' },
        { value: 'faq-2', title: 'Ucretlendirme nasil yapilir?', content: 'Aylik veya yillik abonelik planlari mevcuttur.' },
        { value: 'faq-3', title: 'Destek nasil alabilirim?', content: 'Canli sohbet ve e-posta destegi 7/24 mevcuttur.' },
      ]}
    />
  );
}`,
      tags: ["single", "tekli", "faq", "sss"],
    },
    {
      id: "accordion-ghost",
      title: "Hayalet ve Kompakt",
      description: "Cercevesiz, kompakt gorunumde ghost accordion.",
      category: "advanced",
      code: `import { Accordion } from '@mfe/design-system';

export function Example() {
  return (
    <Accordion
      ghost
      bordered={false}
      size="sm"
      disableGutters
      expandIconPosition="end"
      items={[
        { value: 'sec-1', title: 'Genel Bakis', content: 'Sistem durumu ve ozet bilgiler.' },
        { value: 'sec-2', title: 'Detaylar', content: 'Teknik konfigürasyon ayarlari.' },
        { value: 'sec-3', title: 'Loglar', content: 'Son islem kayitlari.' },
      ]}
    />
  );
}`,
      tags: ["ghost", "hayalet", "kompakt", "cercevesiz"],
    },
    {
      id: "accordion-with-description",
      title: "Aciklamali Bolumler",
      description: "Baslik altinda aciklama ve sag tarafta ekstra icerik.",
      category: "layout",
      code: `import { Accordion } from '@mfe/design-system';
import { Badge } from '@mfe/design-system';

export function Example() {
  return (
    <Accordion
      items={[
        {
          value: 'policy-1',
          title: 'Otonom Ajan Politikasi',
          description: 'Ajanlarin calisma sinirlarini ve izinlerini tanimlar.',
          extra: <Badge variant="success" size="sm">Aktif</Badge>,
          content: 'Politika detaylari ve kurallar burada yer alir.',
        },
        {
          value: 'policy-2',
          title: 'Veri Erisim Politikasi',
          description: 'Hassas verilere erisim izinlerini duzenler.',
          extra: <Badge variant="warning" size="sm">Incelemede</Badge>,
          content: 'Erisim kurallari ve kisitlamalar.',
        },
      ]}
    />
  );
}`,
      tags: ["description", "aciklama", "extra", "badge"],
    },
  ],
  DatePicker: [
    {
      id: "datepicker-basic",
      title: "Temel Tarih Secimi",
      description: "Etiket ve aciklama ile standart tarih secici.",
      category: "form",
      code: `import { DatePicker } from '@mfe/design-system';

export function Example() {
  return (
    <DatePicker
      label="Dogum Tarihi"
      description="Gun/Ay/Yil formatinda giriniz."
    />
  );
}`,
      previewProps: { label: "Dogum Tarihi", description: "Gun/Ay/Yil formatinda giriniz." },
      tags: ["tarih", "date", "form", "label"],
    },
    {
      id: "datepicker-min-max",
      title: "Tarih Araligi Kisitlama",
      description: "min ve max ile gecerli tarih araligi sinirlandirmasi.",
      category: "form",
      code: `import { DatePicker } from '@mfe/design-system';

export function Example() {
  return (
    <DatePicker
      label="Randevu Tarihi"
      min="2026-01-01"
      max="2026-12-31"
      hint="2026 yili icinde bir tarih seciniz."
    />
  );
}`,
      previewProps: { label: "Randevu Tarihi", min: "2026-01-01", max: "2026-12-31" },
      tags: ["min", "max", "aralik", "kisitlama"],
    },
    {
      id: "datepicker-validation",
      title: "Hata Durumu",
      description: "Gecersiz tarih seciminde hata mesaji gosterimi.",
      category: "form",
      code: `import { DatePicker } from '@mfe/design-system';
import { useState } from 'react';

export function Example() {
  const [value, setValue] = useState('');
  const hasError = value && new Date(value) < new Date();

  return (
    <DatePicker
      label="Bitis Tarihi"
      value={value}
      onValueChange={(v) => setValue(v)}
      error={hasError ? 'Gecmis bir tarih secilemez.' : undefined}
      invalid={!!hasError}
    />
  );
}`,
      previewProps: { label: "Bitis Tarihi", error: "Gecmis bir tarih secilemez.", invalid: true },
      tags: ["hata", "validation", "error", "gecersiz"],
    },
  ],
  Steps: [
    {
      id: "steps-basic",
      title: "Temel Adim Gostergesi",
      description: "Yatay cok adimli is akisi gostergesi.",
      category: "basic",
      code: `import { Steps } from '@mfe/design-system';

export function Example() {
  return (
    <Steps
      current={1}
      items={[
        { key: 'bilgi', title: 'Kisisel Bilgiler' },
        { key: 'adres', title: 'Adres Bilgileri' },
        { key: 'onay', title: 'Onay' },
      ]}
    />
  );
}`,
      previewProps: {},
      tags: ["adim", "steps", "wizard", "ilerleme"],
    },
    {
      id: "steps-vertical",
      title: "Dikey Adimlar",
      description: "Aciklama satirlariyla dikey adim gostergesi.",
      category: "layout",
      code: `import { Steps } from '@mfe/design-system';

export function Example() {
  return (
    <Steps
      direction="vertical"
      current={2}
      items={[
        { key: 'kayit', title: 'Kayit', description: 'Hesap olusturuldu.' },
        { key: 'dogrulama', title: 'E-posta Dogrulama', description: 'E-posta adresi onaylandi.' },
        { key: 'profil', title: 'Profil Tamamlama', description: 'Bilgilerinizi girin.' },
        { key: 'basla', title: 'Kullanima Basla' },
      ]}
    />
  );
}`,
      previewProps: {},
      tags: ["dikey", "vertical", "aciklama", "description"],
    },
    {
      id: "steps-error",
      title: "Hata Durumlu Adim",
      description: "Aktif adimda hata durumu gosterimi.",
      category: "advanced",
      code: `import { Steps } from '@mfe/design-system';

export function Example() {
  return (
    <Steps
      current={1}
      status="error"
      items={[
        { key: 'yukle', title: 'Dosya Yukle' },
        { key: 'isle', title: 'Isleme', description: 'Dosya formati gecersiz.' },
        { key: 'tamamla', title: 'Tamamla' },
      ]}
    />
  );
}`,
      previewProps: {},
      tags: ["hata", "error", "durum", "status"],
    },
    {
      id: "steps-dot",
      title: "Nokta Stili",
      description: "Numaralar yerine minimalist nokta gostergesi.",
      category: "basic",
      code: `import { Steps } from '@mfe/design-system';

export function Example() {
  return (
    <Steps
      dot
      current={2}
      items={[
        { key: 's1', title: 'Basvuru' },
        { key: 's2', title: 'Degerlendirme' },
        { key: 's3', title: 'Mulakat' },
        { key: 's4', title: 'Teklif' },
      ]}
    />
  );
}`,
      previewProps: {},
      tags: ["dot", "nokta", "minimalist"],
    },
  ],
  List: [
    {
      id: "list-basic",
      title: "Temel Liste",
      description: "Baslik, aciklama ve meta bilgisiyle basit liste gorunumu.",
      category: "basic",
      code: `import { List } from '@mfe/design-system';

export function Example() {
  return (
    <List
      title="Son Islemler"
      items={[
        { key: '1', title: 'Fatura #2024-001', description: 'Aylik abonelik odemesi', meta: '250 TL' },
        { key: '2', title: 'Fatura #2024-002', description: 'Ek kullanici lisansi', meta: '75 TL' },
        { key: '3', title: 'Fatura #2024-003', description: 'Depolama yukseltmesi', meta: '120 TL' },
      ]}
    />
  );
}`,
      previewProps: {},
      tags: ["liste", "list", "temel", "meta"],
    },
    {
      id: "list-interactive",
      title: "Secim Yapilabilen Liste",
      description: "Tiklanabilir ogeler ve secili durum gosterimi.",
      category: "advanced",
      code: `import { List } from '@mfe/design-system';
import { useState } from 'react';

export function Example() {
  const [selected, setSelected] = useState<React.Key>('proje-1');

  return (
    <List
      title="Projeler"
      selectedKey={selected}
      onItemSelect={(key) => setSelected(key)}
      items={[
        { key: 'proje-1', title: 'Cockpit Dashboard', description: 'Ana yonetim paneli', badges: ['Aktif'] },
        { key: 'proje-2', title: 'Otonom Orkestrator', description: 'Ajan yonetim sistemi', badges: ['Gelistirme'] },
        { key: 'proje-3', title: 'Veri Isleme Hatti', description: 'ETL pipeline servisi', badges: ['Planlandi'] },
      ]}
    />
  );
}`,
      previewProps: {},
      tags: ["secim", "interactive", "selected", "badge"],
    },
    {
      id: "list-tones",
      title: "Duruma Gore Renk Tonlari",
      description: "Bilgi, basari, uyari ve tehlike tonlariyla oge vurgulama.",
      category: "layout",
      code: `import { List } from '@mfe/design-system';

export function Example() {
  return (
    <List
      title="Sistem Bildirimleri"
      items={[
        { key: 'n1', title: 'Yedekleme Tamamlandi', description: 'Veritabani yedegi basariyla alindi.', tone: 'success' },
        { key: 'n2', title: 'Disk Alani Uyarisi', description: 'Kalan alan %15 altina dustu.', tone: 'warning' },
        { key: 'n3', title: 'Servis Hatasi', description: 'API gateway yanit vermiyor.', tone: 'danger' },
        { key: 'n4', title: 'Guncelleme Mevcut', description: 'v2.4.1 surumu yayinlandi.', tone: 'info' },
      ]}
    />
  );
}`,
      previewProps: {},
      tags: ["ton", "tone", "renk", "durum", "bildirim"],
    },
  ],
  Combobox: [
    {
      id: "combobox-basic",
      title: "Temel Combobox",
      description: "Arama yapilabilir tekli secim bileseni.",
      category: "form",
      code: `import { Combobox } from '@mfe/design-system';

export function Example() {
  return (
    <Combobox
      label="Sehir Seciniz"
      placeholder="Aramak icin yazin..."
      options={[
        { label: 'Istanbul', value: 'ist' },
        { label: 'Ankara', value: 'ank' },
        { label: 'Izmir', value: 'izm' },
        { label: 'Bursa', value: 'brs' },
        { label: 'Antalya', value: 'ant' },
      ]}
    />
  );
}`,
      previewProps: { label: "Sehir Seciniz", placeholder: "Aramak icin yazin..." },
      tags: ["combobox", "arama", "secim", "sehir"],
    },
    {
      id: "combobox-grouped",
      title: "Gruplu Secenekler",
      description: "Kategorilere ayrilmis secenek gruplari.",
      category: "advanced",
      code: `import { Combobox } from '@mfe/design-system';

export function Example() {
  return (
    <Combobox
      label="Departman Secimi"
      placeholder="Departman arayin..."
      options={[
        {
          label: 'Muhendislik',
          options: [
            { label: 'Frontend', value: 'fe' },
            { label: 'Backend', value: 'be' },
            { label: 'DevOps', value: 'devops' },
          ],
        },
        {
          label: 'Urun',
          options: [
            { label: 'Urun Yonetimi', value: 'pm' },
            { label: 'Tasarim', value: 'design' },
          ],
        },
      ]}
    />
  );
}`,
      previewProps: { label: "Departman Secimi", placeholder: "Departman arayin..." },
      tags: ["grup", "group", "kategori", "departman"],
    },
    {
      id: "combobox-multi",
      title: "Coklu Secim (Etiketler)",
      description: "Birden fazla deger secip etiket olarak gosterme.",
      category: "form",
      code: `import { Combobox } from '@mfe/design-system';

export function Example() {
  return (
    <Combobox
      label="Yetenekler"
      placeholder="Yetenek ekleyin..."
      selectionMode="tags"
      freeSolo
      options={[
        { label: 'React', value: 'react' },
        { label: 'TypeScript', value: 'ts' },
        { label: 'Node.js', value: 'node' },
        { label: 'PostgreSQL', value: 'pg' },
        { label: 'Docker', value: 'docker' },
      ]}
    />
  );
}`,
      previewProps: { label: "Yetenekler", placeholder: "Yetenek ekleyin...", selectionMode: "tags" },
      tags: ["coklu", "multi", "etiket", "tags", "freeSolo"],
    },
  ],
  CommandPalette: [
    {
      id: "cmdpalette-basic",
      title: "Temel Komut Paleti",
      description: "Cmd+K stilinde arama ve komut calistirma paneli.",
      category: "advanced",
      code: `import { CommandPalette } from '@mfe/design-system';
import { useState } from 'react';

export function Example() {
  const [open, setOpen] = useState(true);

  return (
    <CommandPalette
      open={open}
      onClose={() => setOpen(false)}
      onSelect={(id) => console.log('Secildi:', id)}
      items={[
        { id: 'dashboard', title: 'Dashboard', description: 'Ana kontrol paneline git', group: 'Navigasyon', shortcut: 'G D' },
        { id: 'settings', title: 'Ayarlar', description: 'Sistem ayarlarini yonet', group: 'Navigasyon', shortcut: 'G S' },
        { id: 'new-policy', title: 'Yeni Politika Olustur', description: 'Otonom ajan politikasi tanimla', group: 'Islemler' },
        { id: 'deploy', title: 'Deploy Baslat', description: 'Production ortamina dagitim', group: 'Islemler', shortcut: 'Ctrl+D' },
      ]}
    />
  );
}`,
      previewProps: {},
      tags: ["komut", "command", "palette", "arama", "cmd-k"],
    },
    {
      id: "cmdpalette-with-badges",
      title: "Rozetli Komutlar",
      description: "Devre disi komutlar ve rozetlerle zenginlestirilmis palet.",
      category: "advanced",
      code: `import { CommandPalette } from '@mfe/design-system';
import { Badge } from '@mfe/design-system';
import { useState } from 'react';

export function Example() {
  const [open, setOpen] = useState(true);

  return (
    <CommandPalette
      open={open}
      onClose={() => setOpen(false)}
      onSelect={(id) => console.log('Calistirildi:', id)}
      items={[
        { id: 'ai-suggest', title: 'AI Oneri Al', group: 'AI', badge: <Badge variant="info">Beta</Badge> },
        { id: 'ai-review', title: 'Kod Incelemesi', group: 'AI', badge: <Badge variant="success">Hazir</Badge> },
        { id: 'ai-generate', title: 'Test Uret', group: 'AI', badge: <Badge variant="warning">Deneysel</Badge>, disabled: true },
        { id: 'export', title: 'Rapor Indir', group: 'Genel', shortcut: 'Ctrl+E' },
      ]}
    />
  );
}`,
      previewProps: {},
      tags: ["badge", "rozet", "disabled", "devre-disi", "ai"],
    },
  ],
  TreeTable: [
    {
      id: "treetable-basic",
      title: "Temel Agac Tablo",
      description: "Hiyerarsik veri yapisi icin acilir-kapanir satirli tablo.",
      category: "layout",
      code: `import { TreeTable } from '@mfe/design-system';

export function Example() {
  return (
    <TreeTable
      title="Organizasyon Yapisi"
      treeColumnLabel="Birim"
      columns={[
        { key: 'calisan', label: 'Calisan Sayisi', accessor: 'calisan' },
        { key: 'butce', label: 'Butce', accessor: 'butce', emphasis: true },
      ]}
      nodes={[
        {
          key: 'muhendislik',
          label: 'Muhendislik',
          children: [
            { key: 'fe', label: 'Frontend', data: { calisan: '12', butce: '450K TL' } },
            { key: 'be', label: 'Backend', data: { calisan: '8', butce: '380K TL' } },
            { key: 'devops', label: 'DevOps', data: { calisan: '5', butce: '290K TL' } },
          ],
        },
        {
          key: 'urun',
          label: 'Urun',
          children: [
            { key: 'pm', label: 'Urun Yonetimi', data: { calisan: '4', butce: '220K TL' } },
            { key: 'design', label: 'Tasarim', data: { calisan: '6', butce: '310K TL' } },
          ],
        },
      ]}
      defaultExpandedKeys={['muhendislik']}
    />
  );
}`,
      previewProps: {},
      tags: ["agac", "tree", "tablo", "hiyerarsi", "organizasyon"],
    },
    {
      id: "treetable-badges",
      title: "Rozetli ve Tonlu Satirlar",
      description: "Duruma gore renklendirilmis satirlar ve rozetler.",
      category: "advanced",
      code: `import { TreeTable } from '@mfe/design-system';

export function Example() {
  return (
    <TreeTable
      title="Servis Durumu"
      treeColumnLabel="Servis"
      columns={[
        { key: 'uptime', label: 'Uptime', accessor: 'uptime' },
        { key: 'latency', label: 'Gecikme', accessor: 'latency' },
      ]}
      nodes={[
        {
          key: 'api',
          label: 'API Gateway',
          badges: ['Kritik'],
          tone: 'success',
          data: { uptime: '%99.98', latency: '12ms' },
          children: [
            { key: 'auth', label: 'Auth Service', tone: 'success', data: { uptime: '%99.99', latency: '8ms' } },
            { key: 'rate', label: 'Rate Limiter', tone: 'warning', badges: ['Yavas'], data: { uptime: '%99.5', latency: '45ms' } },
          ],
        },
        {
          key: 'db',
          label: 'Veritabani Cluster',
          tone: 'danger',
          badges: ['Inceleniyor'],
          data: { uptime: '%98.2', latency: '120ms' },
          children: [
            { key: 'primary', label: 'Primary', tone: 'success', data: { uptime: '%99.9', latency: '5ms' } },
            { key: 'replica', label: 'Replica-2', tone: 'danger', badges: ['Baglanti Hatasi'], data: { uptime: '%91.0', latency: '350ms' } },
          ],
        },
      ]}
      defaultExpandedKeys={['api', 'db']}
    />
  );
}`,
      previewProps: {},
      tags: ["rozet", "badge", "ton", "tone", "servis", "durum"],
    },
    {
      id: "treetable-selectable",
      title: "Secim Yapilabilen Agac",
      description: "Dugum secimi ve compact gorunum destegi.",
      category: "advanced",
      code: `import { TreeTable } from '@mfe/design-system';
import { useState } from 'react';

export function Example() {
  const [selected, setSelected] = useState<React.Key | null>('dosya-1');

  return (
    <TreeTable
      title="Dosya Gezgini"
      treeColumnLabel="Dosya / Klasor"
      density="compact"
      selectedKey={selected}
      onNodeSelect={(key) => setSelected(key)}
      columns={[
        { key: 'boyut', label: 'Boyut', accessor: 'boyut', align: 'right' },
        { key: 'degistirilme', label: 'Son Degisiklik', accessor: 'degistirilme' },
      ]}
      nodes={[
        {
          key: 'src',
          label: 'src',
          children: [
            { key: 'dosya-1', label: 'index.ts', data: { boyut: '2.4 KB', degistirilme: '2 saat once' } },
            { key: 'dosya-2', label: 'App.tsx', data: { boyut: '5.1 KB', degistirilme: 'Dun' } },
          ],
        },
        {
          key: 'public',
          label: 'public',
          children: [
            { key: 'dosya-3', label: 'favicon.ico', data: { boyut: '1.2 KB', degistirilme: '3 gun once' } },
          ],
        },
      ]}
      defaultExpandedKeys={['src', 'public']}
    />
  );
}`,
      previewProps: {},
      tags: ["secim", "selectable", "compact", "dosya", "gezgin"],
    },
  ],
  Descriptions: [
    {
      id: "desc-basic",
      title: "Temel Bilgi Karti",
      description: "Anahtar-deger ciftleriyle yapilandirilmis veri gosterimi.",
      category: "basic",
      code: `import { Descriptions } from '@mfe/design-system';

export function Example() {
  return (
    <Descriptions
      title="Musteri Bilgileri"
      columns={2}
      bordered
      items={[
        { key: 'ad', label: 'Ad Soyad', value: 'Mehmet Yilmaz' },
        { key: 'email', label: 'E-posta', value: 'mehmet@ornek.com' },
        { key: 'telefon', label: 'Telefon', value: '+90 532 123 4567' },
        { key: 'konum', label: 'Konum', value: 'Istanbul, Turkiye' },
      ]}
    />
  );
}`,
      previewProps: {},
      tags: ["bilgi", "anahtar-deger", "kart", "musteri"],
    },
    {
      id: "desc-toned",
      title: "Tonlu Degerler",
      description: "Durum bilgisiyle renk vurgulanan onemli satirlar.",
      category: "layout",
      code: `import { Descriptions } from '@mfe/design-system';

export function Example() {
  return (
    <Descriptions
      title="Sunucu Durumu"
      description="Uretim ortami ozet bilgileri."
      columns={3}
      bordered
      items={[
        { key: 'cpu', label: 'CPU Kullanimi', value: '%42', tone: 'success' },
        { key: 'ram', label: 'Bellek', value: '%78', tone: 'warning' },
        { key: 'disk', label: 'Disk', value: '%92', tone: 'danger', helper: 'Acil temizlik gerekli' },
        { key: 'uptime', label: 'Uptime', value: '45 gun', tone: 'info' },
        { key: 'versiyon', label: 'Versiyon', value: 'v3.2.1' },
        { key: 'ortam', label: 'Ortam', value: 'Production' },
      ]}
    />
  );
}`,
      previewProps: {},
      tags: ["ton", "tone", "durum", "sunucu", "helper"],
    },
    {
      id: "desc-span",
      title: "Satirlararasi Yayilma",
      description: "span ozelligi ile birden fazla sutuna yayilan degerler.",
      category: "layout",
      code: `import { Descriptions } from '@mfe/design-system';

export function Example() {
  return (
    <Descriptions
      title="Siparis Detayi"
      columns={3}
      bordered
      items={[
        { key: 'no', label: 'Siparis No', value: '#ORD-2026-00142' },
        { key: 'tarih', label: 'Siparis Tarihi', value: '15 Mart 2026' },
        { key: 'durum', label: 'Durum', value: 'Kargoya Verildi', tone: 'success' },
        { key: 'adres', label: 'Teslimat Adresi', value: 'Kadikoy, Istanbul - Turkiye', span: 2 },
        { key: 'tutar', label: 'Toplam Tutar', value: '1.250,00 TL', tone: 'info' },
      ]}
    />
  );
}`,
      previewProps: {},
      tags: ["span", "yayilma", "siparis", "detay"],
    },
  ],
  Slider: [
    {
      id: "slider-basic",
      title: "Temel Slider",
      description: "Etiket ve deger gosterimli standart aralik kaydirici.",
      category: "form",
      code: `import { Slider } from '@mfe/design-system';

export function Example() {
  return (
    <Slider
      label="Ses Seviyesi"
      defaultValue={60}
      min={0}
      max={100}
    />
  );
}`,
      previewProps: { label: "Ses Seviyesi", defaultValue: 60, min: 0, max: 100 },
      tags: ["slider", "aralik", "kaydirici", "ses"],
    },
    {
      id: "slider-formatted",
      title: "Formatli Deger",
      description: "valueFormatter ile ozel deger bicimlendirmesi.",
      category: "form",
      code: `import { Slider } from '@mfe/design-system';

export function Example() {
  return (
    <Slider
      label="Butce Limiti"
      defaultValue={5000}
      min={1000}
      max={50000}
      step={500}
      minLabel="1.000 TL"
      maxLabel="50.000 TL"
      valueFormatter={(v) => \`\${v.toLocaleString('tr-TR')} TL\`}
    />
  );
}`,
      previewProps: { label: "Butce Limiti", defaultValue: 5000, min: 1000, max: 50000, step: 500 },
      tags: ["format", "para", "butce", "valueFormatter"],
    },
    {
      id: "slider-validation",
      title: "Hata Durumu",
      description: "Gecersiz deger icin hata mesaji gosterimi.",
      category: "form",
      code: `import { Slider } from '@mfe/design-system';
import { useState } from 'react';

export function Example() {
  const [value, setValue] = useState(95);
  const hasError = value > 80;

  return (
    <Slider
      label="CPU Esik Degeri"
      value={value}
      onValueChange={(v) => setValue(v)}
      min={0}
      max={100}
      error={hasError ? 'Esik degeri %80 uzerinde olmamalidir.' : undefined}
      invalid={hasError}
      valueFormatter={(v) => \`%\${v}\`}
    />
  );
}`,
      previewProps: { label: "CPU Esik Degeri", error: "Esik degeri %80 uzerinde olmamalidir.", invalid: true },
      tags: ["hata", "error", "validation", "esik"],
    },
  ],
  PageHeader: [
    {
      id: "page-header-basic",
      title: "Temel Sayfa Basligi",
      description: "Baslik, alt baslik ve aksiyonlar iceren standart sayfa basligi.",
      category: "basic",
      code: `import { PageHeader } from '@mfe/design-system';
import { Button } from '@mfe/design-system';
import { Plus } from 'lucide-react';

export function Example() {
  return (
    <PageHeader
      title="Musteri Listesi"
      subtitle="Tum kayitli musterileri goruntuleyin ve yonetin."
      actions={
        <Button variant="primary">
          <Plus className="h-4 w-4 mr-1" /> Yeni Musteri
        </Button>
      }
    />
  );
}`,
      previewProps: {},
      tags: ["baslik", "header", "sayfa"],
    },
    {
      id: "page-header-breadcrumb",
      title: "Breadcrumb ile Sayfa Basligi",
      description: "Breadcrumb navigasyonu, etiketler ve avatar iceren zengin baslik.",
      category: "layout",
      code: `import { PageHeader } from '@mfe/design-system';
import { Badge } from '@mfe/design-system';
import { Button } from '@mfe/design-system';
import { Settings, Download } from 'lucide-react';

export function Example() {
  return (
    <PageHeader
      breadcrumb={
        <nav className="text-sm text-gray-500">
          <a href="/admin">Yonetim</a> / <a href="/admin/projeler">Projeler</a> / Detay
        </nav>
      }
      title="Kampanya Yonetimi"
      subtitle="2024 Q4 hedefleri icin aktif kampanya detaylari."
      tags={<Badge variant="success">Aktif</Badge>}
      actions={
        <div className="flex gap-2">
          <Button variant="secondary"><Download className="h-4 w-4 mr-1" /> Rapor</Button>
          <Button variant="ghost"><Settings className="h-4 w-4" /></Button>
        </div>
      }
      sticky
    />
  );
}`,
      previewProps: {},
      tags: ["breadcrumb", "sticky", "badge", "navigasyon"],
    },
    {
      id: "page-header-with-footer",
      title: "Footer Alani ile Sayfa Basligi",
      description: "Baslik altinda tab navigasyonu veya ek bilgi alani iceren baslik.",
      category: "patterns",
      code: `import { PageHeader } from '@mfe/design-system';
import { Tabs } from '@mfe/design-system';

export function Example() {
  return (
    <PageHeader
      title="Siparis Yonetimi"
      subtitle="Siparisleri takip edin ve durum guncellemelerini yapin."
      footer={
        <Tabs defaultValue="bekleyen">
          <Tabs.List>
            <Tabs.Tab value="bekleyen">Bekleyen</Tabs.Tab>
            <Tabs.Tab value="onaylanan">Onaylanan</Tabs.Tab>
            <Tabs.Tab value="tamamlanan">Tamamlanan</Tabs.Tab>
          </Tabs.List>
        </Tabs>
      }
    />
  );
}`,
      previewProps: {},
      tags: ["footer", "tabs", "navigasyon"],
    },
  ],
  PageLayout: [
    {
      id: "page-layout-basic",
      title: "Temel Sayfa Yerlesimi",
      description: "Baslik, icerik ve footer iceren standart sayfa iskeleti.",
      category: "layout",
      code: `import { PageLayout } from '@mfe/design-system';
import { Button } from '@mfe/design-system';

export function Example() {
  return (
    <PageLayout
      title="Envanter Yonetimi"
      description="Depo stoklarini takip edin ve yonetin."
      breadcrumbItems={[
        { title: 'Ana Sayfa', path: '/' },
        { title: 'Envanter' },
      ]}
      actions={<Button variant="primary">Urun Ekle</Button>}
      footer={
        <div className="flex justify-end">
          <span className="text-sm text-gray-500">Toplam 1.284 kayit</span>
        </div>
      }
    >
      <div className="rounded-lg border p-8 text-center text-gray-400">
        Tablo icerigi buraya gelir
      </div>
    </PageLayout>
  );
}`,
      previewProps: {},
      tags: ["layout", "yerlesim", "iskelet", "breadcrumb"],
    },
    {
      id: "page-layout-detail-sidebar",
      title: "Detay Panelli Yerlesim",
      description: "Yan detay paneli ile iki kolonlu sayfa yapisi.",
      category: "patterns",
      code: `import { PageLayout, createPageLayoutPreset } from '@mfe/design-system';
import { Button } from '@mfe/design-system';

export function Example() {
  const preset = createPageLayoutPreset({ preset: 'detail-sidebar' });

  return (
    <PageLayout
      {...preset}
      title="Musteri Detayi"
      actions={<Button variant="secondary">Duzenle</Button>}
      detail={
        <div className="flex flex-col gap-4">
          <div className="rounded-lg border p-4">
            <h3 className="font-medium mb-2">Iletisim Bilgileri</h3>
            <p className="text-sm text-gray-500">email@ornek.com</p>
            <p className="text-sm text-gray-500">+90 555 123 4567</p>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="font-medium mb-2">Son Islemler</h3>
            <p className="text-sm text-gray-500">3 aktif siparis</p>
          </div>
        </div>
      }
    >
      <div className="rounded-lg border p-8 text-center text-gray-400">
        Ana icerik alani
      </div>
    </PageLayout>
  );
}`,
      previewProps: {},
      tags: ["detail", "sidebar", "iki-kolon", "preset"],
    },
  ],
  FilterBar: [
    {
      id: "filter-bar-basic",
      title: "Temel Filtre Cubugu",
      description: "Arama, filtre kontrolleri ve aksiyonlar iceren filtre cubugu.",
      category: "form",
      code: `import { FilterBar } from '@mfe/design-system';
import { Input, Select, Button } from '@mfe/design-system';
import { Search, RotateCcw } from 'lucide-react';

export function Example() {
  return (
    <FilterBar
      search={
        <Input
          placeholder="Ara..."
          prefix={<Search className="h-4 w-4" />}
          className="w-64"
        />
      }
      actions={
        <Button variant="ghost" size="sm">
          <RotateCcw className="h-4 w-4 mr-1" /> Sifirla
        </Button>
      }
    >
      <Select placeholder="Durum" options={[
        { value: 'active', label: 'Aktif' },
        { value: 'passive', label: 'Pasif' },
      ]} />
      <Select placeholder="Kategori" options={[
        { value: 'urun', label: 'Urun' },
        { value: 'hizmet', label: 'Hizmet' },
      ]} />
    </FilterBar>
  );
}`,
      previewProps: {},
      tags: ["filtre", "arama", "filter", "search"],
    },
    {
      id: "filter-bar-advanced",
      title: "Gelismis Filtreler",
      description: "Acilir gelismis filtre paneli ve aktif filtre sayaci iceren filtre cubugu.",
      category: "advanced",
      code: `import { FilterBar } from '@mfe/design-system';
import { Input, Select, DatePicker, Button } from '@mfe/design-system';

export function Example() {
  return (
    <FilterBar
      search={<Input placeholder="Siparis no veya musteri adi..." className="w-72" />}
      activeCount={3}
      moreLabel="Gelismis Filtreler"
      moreFilters={
        <>
          <DatePicker label="Baslangic" />
          <DatePicker label="Bitis" />
          <Select placeholder="Bolge" options={[
            { value: 'istanbul', label: 'Istanbul' },
            { value: 'ankara', label: 'Ankara' },
            { value: 'izmir', label: 'Izmir' },
          ]} />
        </>
      }
      actions={<Button variant="primary" size="sm">Filtrele</Button>}
    >
      <Select placeholder="Siparis Durumu" options={[
        { value: 'bekleyen', label: 'Bekleyen' },
        { value: 'kargoda', label: 'Kargoda' },
        { value: 'teslim', label: 'Teslim Edildi' },
      ]} />
    </FilterBar>
  );
}`,
      previewProps: { activeCount: 3 },
      tags: ["gelismis", "advanced", "tarih", "filtre"],
    },
    {
      id: "filter-bar-compact",
      title: "Kompakt Filtre Cubugu",
      description: "Dar alanlarda kullanilmak uzere azaltilmis bosluklu kompakt mod.",
      category: "layout",
      code: `import { FilterBar } from '@mfe/design-system';
import { Input, Select } from '@mfe/design-system';

export function Example() {
  return (
    <FilterBar compact>
      <Input placeholder="Hizli ara..." size="sm" className="w-48" />
      <Select placeholder="Tip" size="sm" options={[
        { value: 'all', label: 'Tumunu Goster' },
        { value: 'alert', label: 'Uyarilar' },
        { value: 'error', label: 'Hatalar' },
      ]} />
    </FilterBar>
  );
}`,
      previewProps: { compact: true },
      tags: ["kompakt", "compact", "dar"],
    },
  ],
  SummaryStrip: [
    {
      id: "summary-strip-basic",
      title: "Temel Metrik Seridi",
      description: "KPI degerleri gosteren yatay metrik karti seridi.",
      category: "basic",
      code: `import { SummaryStrip } from '@mfe/design-system';

export function Example() {
  return (
    <SummaryStrip
      items={[
        { key: 'gelir', label: 'Toplam Gelir', value: '₺1.284.500' },
        { key: 'siparis', label: 'Siparis Sayisi', value: '3.842' },
        { key: 'musteri', label: 'Aktif Musteri', value: '1.205' },
        { key: 'iade', label: 'Iade Orani', value: '%2.4' },
      ]}
    />
  );
}`,
      previewProps: {},
      tags: ["metrik", "kpi", "istatistik"],
    },
    {
      id: "summary-strip-tones",
      title: "Tonlu Metrik Kartlari",
      description: "Durum tonlari, ikon ve trend bilgisi iceren zengin metrik seridi.",
      category: "advanced",
      code: `import { SummaryStrip } from '@mfe/design-system';
import { TrendingUp, TrendingDown, Users, ShoppingCart } from 'lucide-react';

export function Example() {
  return (
    <SummaryStrip
      title="Aylik Performans"
      description="Son 30 gunluk ozet veriler."
      columns={3}
      items={[
        {
          key: 'gelir',
          label: 'Aylik Gelir',
          value: '₺842.300',
          tone: 'success',
          icon: <TrendingUp />,
          trend: <span className="text-green-600">+12.5%</span>,
          note: 'Gecen aya gore artis',
        },
        {
          key: 'siparis',
          label: 'Toplam Siparis',
          value: '1.523',
          tone: 'info',
          icon: <ShoppingCart />,
          trend: <span className="text-blue-600">+8.2%</span>,
        },
        {
          key: 'musteri',
          label: 'Yeni Musteri',
          value: '287',
          tone: 'warning',
          icon: <Users />,
          trend: <span className="text-amber-600">-3.1%</span>,
          note: 'Hedefin altinda',
        },
      ]}
    />
  );
}`,
      previewProps: {},
      tags: ["tone", "trend", "icon", "performans"],
    },
  ],
  DetailDrawer: [
    {
      id: "detail-drawer-basic",
      title: "Temel Detay Cekmecesi",
      description: "Baslik, bolumler ve footer iceren salt-okunur detay paneli.",
      category: "basic",
      code: `import { DetailDrawer } from '@mfe/design-system';
import { Button } from '@mfe/design-system';
import { useState } from 'react';

export function Example() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Detay Gor</Button>
      <DetailDrawer
        open={open}
        onClose={() => setOpen(false)}
        title="Siparis #ORD-2024-1847"
        subtitle="12 Aralik 2024 tarihli siparis detaylari"
        sections={[
          {
            key: 'musteri',
            title: 'Musteri Bilgileri',
            content: (
              <div className="flex flex-col gap-2 text-sm">
                <p><strong>Ad:</strong> Ahmet Yilmaz</p>
                <p><strong>Email:</strong> ahmet@ornek.com</p>
                <p><strong>Telefon:</strong> +90 555 123 4567</p>
              </div>
            ),
          },
          {
            key: 'urunler',
            title: 'Siparis Kalemleri',
            content: (
              <div className="flex flex-col gap-1 text-sm">
                <p>MacBook Pro 14" x1 — ₺84.999</p>
                <p>USB-C Hub x2 — ₺1.598</p>
              </div>
            ),
          },
        ]}
        footer={
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setOpen(false)}>Kapat</Button>
            <Button variant="primary">Siparisi Onayla</Button>
          </div>
        }
      />
    </>
  );
}`,
      previewProps: { open: true },
      tags: ["drawer", "cekmece", "detay", "panel"],
    },
    {
      id: "detail-drawer-with-tags",
      title: "Etiketli Detay Cekmecesi",
      description: "Baslik yaninda durum etiketleri ve aksiyon butonlari iceren detay cekmecesi.",
      category: "patterns",
      code: `import { DetailDrawer } from '@mfe/design-system';
import { Button, Badge } from '@mfe/design-system';
import { Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';

export function Example() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Musteri Detayi</Button>
      <DetailDrawer
        open={open}
        onClose={() => setOpen(false)}
        title="Mehmet Ozturk"
        subtitle="Premium uye — 2 yildir aktif"
        tags={
          <>
            <Badge variant="success">Aktif</Badge>
            <Badge variant="info">Premium</Badge>
          </>
        }
        actions={
          <>
            <Button variant="ghost" size="sm"><Edit className="h-4 w-4" /></Button>
            <Button variant="ghost" size="sm"><Trash2 className="h-4 w-4" /></Button>
          </>
        }
        size="xl"
      >
        <div className="flex flex-col p-6 gap-4">
          <p className="text-sm text-gray-600">
            Musteri hesap detaylari ve gecmis islem ozeti burada goruntulenir.
          </p>
        </div>
      </DetailDrawer>
    </>
  );
}`,
      previewProps: { open: true, size: "xl" },
      tags: ["etiket", "badge", "aksiyon", "musteri"],
    },
  ],
  FormDrawer: [
    {
      id: "form-drawer-basic",
      title: "Temel Form Cekmecesi",
      description: "Yeni kayit olusturmak icin yan panel formu.",
      category: "form",
      code: `import { FormDrawer } from '@mfe/design-system';
import { Button, Input, Select } from '@mfe/design-system';
import { useState } from 'react';

export function Example() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Yeni Musteri Ekle</Button>
      <FormDrawer
        open={open}
        onClose={() => setOpen(false)}
        title="Yeni Musteri"
        subtitle="Musteri bilgilerini girerek kayit olusturun."
        footer={
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setOpen(false)}>Iptal</Button>
            <Button variant="primary">Kaydet</Button>
          </div>
        }
      >
        <div className="flex flex-col gap-4">
          <Input label="Ad Soyad" placeholder="Ahmet Yilmaz" />
          <Input label="E-posta" placeholder="ahmet@ornek.com" type="email" />
          <Input label="Telefon" placeholder="+90 555 000 0000" />
          <Select
            label="Musteri Tipi"
            placeholder="Secin"
            options={[
              { value: 'bireysel', label: 'Bireysel' },
              { value: 'kurumsal', label: 'Kurumsal' },
            ]}
          />
        </div>
      </FormDrawer>
    </>
  );
}`,
      previewProps: { open: true },
      tags: ["form", "cekmece", "olustur", "create"],
    },
    {
      id: "form-drawer-loading",
      title: "Yukleme Durumlu Form Cekmecesi",
      description: "Kayit islemi sirasinda yukleme gostergesi iceren form cekmecesi.",
      category: "advanced",
      code: `import { FormDrawer } from '@mfe/design-system';
import { Button, Input, Textarea } from '@mfe/design-system';
import { useState } from 'react';

export function Example() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 2000));
    setLoading(false);
    setOpen(false);
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>Destek Talebi Olustur</Button>
      <FormDrawer
        open={open}
        onClose={() => setOpen(false)}
        title="Yeni Destek Talebi"
        loading={loading}
        placement="right"
        size="lg"
        footer={
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setOpen(false)} disabled={loading}>
              Iptal
            </Button>
            <Button variant="primary" onClick={handleSubmit} loading={loading}>
              Gonder
            </Button>
          </div>
        }
      >
        <div className="flex flex-col gap-4">
          <Input label="Konu" placeholder="Sorunuzu kisaca tanimlayiniz" />
          <Textarea label="Aciklama" placeholder="Detayli bilgi giriniz..." rows={5} />
        </div>
      </FormDrawer>
    </>
  );
}`,
      previewProps: { open: true, loading: true },
      tags: ["loading", "yukleme", "async", "destek"],
    },
  ],
  DetailSummary: [
    {
      id: "detail-summary-basic",
      title: "Temel Detay Ozeti",
      description: "Baslik, metrikler, varlık ozeti ve detay alanlarini bir araya getiren tam detay sayfasi.",
      category: "patterns",
      code: `import { DetailSummary } from '@mfe/design-system';

export function Example() {
  return (
    <DetailSummary
      eyebrow="Siparisler / #ORD-2024-1847"
      title="Siparis Detayi"
      description="12 Aralik 2024 tarihli musteri siparisi."
      actions={<button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">Duzenle</button>}
      summaryItems={[
        { key: 'toplam', label: 'Toplam Tutar', value: '₺86.597' },
        { key: 'kalem', label: 'Kalem Sayisi', value: '3' },
        { key: 'durum', label: 'Siparis Durumu', value: 'Hazirlaniyor' },
        { key: 'tarih', label: 'Siparis Tarihi', value: '12.12.2024' },
      ]}
      entity={{
        title: 'Ahmet Yilmaz',
        subtitle: 'Premium musteri — Istanbul',
        items: [
          { label: 'E-posta', value: 'ahmet@ornek.com' },
          { label: 'Telefon', value: '+90 555 123 4567' },
        ],
      }}
      detailItems={[
        { label: 'Odeme Yontemi', value: 'Kredi Karti' },
        { label: 'Kargo Firmasi', value: 'Yurtici Kargo' },
        { label: 'Fatura Durumu', value: 'Kesildi' },
        { label: 'Teslimat Adresi', value: 'Kadikoy, Istanbul' },
      ]}
    />
  );
}`,
      previewProps: {},
      tags: ["detay", "ozet", "siparis", "varlık"],
    },
    {
      id: "detail-summary-with-json",
      title: "JSON Goruntuleyicili Detay Ozeti",
      description: "Debug ve denetim icin JSON payload iceren detay ozeti.",
      category: "advanced",
      code: `import { DetailSummary } from '@mfe/design-system';

export function Example() {
  return (
    <DetailSummary
      eyebrow="API Loglari / req-8842"
      title="API Istek Detayi"
      description="Gelen webhook istek verisi ve islem sonucu."
      entity={{
        title: 'POST /api/webhooks/payment',
        subtitle: 'Basarili — 200 OK — 145ms',
        items: [
          { label: 'Kaynak', value: 'Stripe' },
          { label: 'Olay Tipi', value: 'payment_intent.succeeded' },
        ],
      }}
      detailItems={[
        { label: 'Istek ID', value: 'req-8842' },
        { label: 'Zaman Damgasi', value: '2024-12-12T14:32:00Z' },
        { label: 'IP Adresi', value: '54.23.112.88' },
        { label: 'Islem Suresi', value: '145ms' },
      ]}
      jsonValue={{
        id: 'pi_3Qf8sK2eZvKYlo2C1',
        amount: 8659700,
        currency: 'try',
        status: 'succeeded',
        metadata: { orderId: 'ORD-2024-1847' },
      }}
      jsonTitle="Webhook Payload"
      jsonDescription="Stripe tarafindan gonderilen ham istek verisi."
    />
  );
}`,
      previewProps: {},
      tags: ["json", "api", "debug", "denetim", "webhook"],
    },
  ],
  NavigationRail: [
    {
      id: "nav-rail-basic",
      title: "Temel Navigasyon Raylisi",
      description: "Ikonlar ve etiketler iceren dikey navigasyon paneli.",
      category: "basic",
      code: `import { NavigationRail } from '@mfe/design-system';
import { Home, Users, ShoppingCart, Settings, BarChart3 } from 'lucide-react';

export function Example() {
  return (
    <NavigationRail
      items={[
        { value: 'anasayfa', label: 'Ana Sayfa', icon: <Home className="h-5 w-5" /> },
        { value: 'musteriler', label: 'Musteriler', icon: <Users className="h-5 w-5" /> },
        { value: 'siparisler', label: 'Siparisler', icon: <ShoppingCart className="h-5 w-5" />, badge: '12' },
        { value: 'raporlar', label: 'Raporlar', icon: <BarChart3 className="h-5 w-5" /> },
        { value: 'ayarlar', label: 'Ayarlar', icon: <Settings className="h-5 w-5" /> },
      ]}
      defaultValue="anasayfa"
      onValueChange={(v) => console.log('Secilen:', v)}
    />
  );
}`,
      previewProps: {},
      tags: ["navigasyon", "menu", "dikey", "rail"],
    },
    {
      id: "nav-rail-compact",
      title: "Kompakt Navigasyon Raylisi",
      description: "Sadece ikonlar gosteren dar navigasyon paneli.",
      category: "layout",
      code: `import { NavigationRail, createNavigationRailPreset } from '@mfe/design-system';
import { LayoutDashboard, Bell, MessageSquare, Cog } from 'lucide-react';

export function Example() {
  const preset = createNavigationRailPreset('compact_utility');

  return (
    <NavigationRail
      {...preset}
      items={[
        { value: 'panel', label: 'Panel', icon: <LayoutDashboard className="h-5 w-5" /> },
        { value: 'bildirimler', label: 'Bildirimler', icon: <Bell className="h-5 w-5" />, badge: '3' },
        { value: 'mesajlar', label: 'Mesajlar', icon: <MessageSquare className="h-5 w-5" /> },
        { value: 'ayarlar', label: 'Ayarlar', icon: <Cog className="h-5 w-5" /> },
      ]}
      defaultValue="panel"
    />
  );
}`,
      previewProps: {},
      tags: ["kompakt", "compact", "ikon", "utility"],
    },
    {
      id: "nav-rail-with-footer",
      title: "Footer Alani ile Navigasyon",
      description: "Alt kisimda kullanici profili veya ek aksiyonlar iceren navigasyon raylisi.",
      category: "patterns",
      code: `import { NavigationRail, createNavigationRailPreset } from '@mfe/design-system';
import { Home, FileText, Users, BarChart3, LogOut } from 'lucide-react';

export function Example() {
  const preset = createNavigationRailPreset('ops_side_nav');

  return (
    <NavigationRail
      {...preset}
      items={[
        { value: 'dashboard', label: 'Dashboard', icon: <Home className="h-5 w-5" /> },
        { value: 'belgeler', label: 'Belgeler', icon: <FileText className="h-5 w-5" />, description: '24 yeni belge' },
        { value: 'ekip', label: 'Ekip', icon: <Users className="h-5 w-5" />, description: '8 aktif uye' },
        { value: 'analitik', label: 'Analitik', icon: <BarChart3 className="h-5 w-5" /> },
      ]}
      defaultValue="dashboard"
      footer={
        <button className="flex w-full items-center gap-3 rounded-xl px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 transition-colors">
          <LogOut className="h-4 w-4" />
          <span>Cikis Yap</span>
        </button>
      }
    />
  );
}`,
      previewProps: {},
      tags: ["footer", "profil", "cikis", "ops"],
    },
  ],
  TextInput: [
    {
      id: "textinput-basic",
      title: "Temel Metin Girişi",
      description: "Label, açıklama ve varsayılan boyutla basit metin girişi.",
      category: "form",
      code: `import { TextInput } from '@mfe/design-system';

export function Example() {
  return (
    <TextInput
      label="Ad Soyad"
      description="Kimliğinizdeki tam adınızı giriniz."
      placeholder="Örn: Ahmet Yılmaz"
    />
  );
}`,
      previewProps: {},
      tags: ["form", "text", "label", "input"],
    },
    {
      id: "textinput-validation",
      title: "Doğrulama Durumları",
      description: "Hata ve ipucu metinli doğrulama senaryoları.",
      category: "form",
      code: `import { TextInput } from '@mfe/design-system';

export function Example() {
  return (
    <div className="flex flex-col gap-4">
      <TextInput
        label="E-posta"
        hint="Kurumsal e-posta adresinizi giriniz."
        placeholder="ornek@sirket.com"
      />
      <TextInput
        label="E-posta"
        error="Geçersiz e-posta formatı."
        invalid
        defaultValue="hatali-adres"
      />
    </div>
  );
}`,
      previewProps: {},
      tags: ["validation", "error", "hint"],
    },
    {
      id: "textinput-sizes",
      title: "Boyut Skalası",
      description: "Küçük, orta ve büyük boyut varyantları.",
      category: "basic",
      code: `import { TextInput } from '@mfe/design-system';

export function Example() {
  return (
    <div className="flex flex-col gap-3">
      <TextInput size="sm" label="Küçük" placeholder="sm boyut" />
      <TextInput size="md" label="Orta" placeholder="md boyut" />
      <TextInput size="lg" label="Büyük" placeholder="lg boyut" />
    </div>
  );
}`,
      previewProps: { size: "md" },
      multiVariantAxis: "size",
      tags: ["size", "sm", "md", "lg"],
    },
    {
      id: "textinput-slots",
      title: "Slot Görselleri",
      description: "Ön ve arka görsel slotları ile zengin metin girişi.",
      category: "advanced",
      code: `import { TextInput } from '@mfe/design-system';
import { Search, Mail } from 'lucide-react';

export function Example() {
  return (
    <div className="flex flex-col gap-3">
      <TextInput
        label="Arama"
        leadingVisual={<Search className="h-4 w-4" />}
        placeholder="Ara..."
      />
      <TextInput
        label="E-posta"
        leadingVisual={<Mail className="h-4 w-4" />}
        trailingVisual={<span className="text-xs text-gray-400">@sirket.com</span>}
        placeholder="kullanici"
      />
    </div>
  );
}`,
      previewProps: {},
      tags: ["icon", "slot", "leading", "trailing"],
    },
  ],
  TextArea: [
    {
      id: "textarea-basic",
      title: "Temel Metin Alanı",
      description: "Çok satırlı metin girişi ve label desteği.",
      category: "form",
      code: `import { TextArea } from '@mfe/design-system';

export function Example() {
  return (
    <TextArea
      label="Açıklama"
      description="Detaylı açıklama giriniz."
      placeholder="Açıklamanızı buraya yazın..."
      rows={4}
    />
  );
}`,
      previewProps: {},
      tags: ["form", "multiline", "textarea"],
    },
    {
      id: "textarea-count",
      title: "Karakter Sayacı",
      description: "Maksimum karakter limiti ve sayaç gösterimi.",
      category: "form",
      code: `import { TextArea } from '@mfe/design-system';

export function Example() {
  return (
    <TextArea
      label="Not"
      showCount
      maxLength={200}
      placeholder="Notunuzu giriniz (maks. 200 karakter)"
      rows={3}
    />
  );
}`,
      previewProps: { showCount: true },
      tags: ["count", "maxlength", "limit"],
    },
    {
      id: "textarea-resize",
      title: "Boyutlandırma Modları",
      description: "Auto-resize, dikey ve sabit boyutlandırma modları.",
      category: "advanced",
      code: `import { TextArea } from '@mfe/design-system';

export function Example() {
  return (
    <div className="flex flex-col gap-4">
      <TextArea label="Otomatik" resize="auto" placeholder="İçerikle büyür..." rows={2} />
      <TextArea label="Dikey" resize="vertical" placeholder="Dikey boyutlandırma" rows={3} />
      <TextArea label="Sabit" resize="none" placeholder="Boyutlandırma yok" rows={3} />
    </div>
  );
}`,
      previewProps: {},
      tags: ["resize", "auto", "vertical"],
    },
  ],
  TimePicker: [
    {
      id: "timepicker-basic",
      title: "Temel Saat Seçici",
      description: "Label ve açıklama ile basit saat seçimi.",
      category: "form",
      code: `import { TimePicker } from '@mfe/design-system';

export function Example() {
  return (
    <TimePicker
      label="Başlangıç Saati"
      description="Toplantı başlangıç saatini seçin."
    />
  );
}`,
      previewProps: {},
      tags: ["form", "time", "picker"],
    },
    {
      id: "timepicker-range",
      title: "Saat Aralığı Kısıtı",
      description: "Minimum ve maksimum saat aralığı ile kısıtlı seçim.",
      category: "form",
      code: `import { TimePicker } from '@mfe/design-system';

export function Example() {
  return (
    <TimePicker
      label="Çalışma Saati"
      description="08:00 - 18:00 arası seçim yapılabilir."
      min="08:00"
      max="18:00"
      step={1800}
      defaultValue="09:00"
    />
  );
}`,
      previewProps: {},
      tags: ["range", "min", "max", "step"],
    },
    {
      id: "timepicker-states",
      title: "Erişim Durumları",
      description: "Salt okunur ve devre dışı erişim durumları.",
      category: "form",
      code: `import { TimePicker } from '@mfe/design-system';

export function Example() {
  return (
    <div className="flex flex-col gap-4">
      <TimePicker label="Aktif" defaultValue="14:30" />
      <TimePicker label="Salt Okunur" defaultValue="14:30" access="readonly" />
      <TimePicker label="Devre Dışı" defaultValue="14:30" disabled />
    </div>
  );
}`,
      previewProps: {},
      tags: ["readonly", "disabled", "access"],
    },
  ],
  Upload: [
    {
      id: "upload-basic",
      title: "Temel Dosya Yükleme",
      description: "Tekli dosya seçimi ile basit yükleme alanı.",
      category: "form",
      code: `import { Upload } from '@mfe/design-system';

export function Example() {
  return (
    <Upload
      label="Belge Yükle"
      description="PDF veya Word formatında belge yükleyin."
      accept=".pdf,.docx"
    />
  );
}`,
      previewProps: {},
      tags: ["form", "file", "upload"],
    },
    {
      id: "upload-multiple",
      title: "Çoklu Dosya Yükleme",
      description: "Birden fazla dosya seçimi ve dosya limiti.",
      category: "form",
      code: `import { Upload } from '@mfe/design-system';

export function Example() {
  return (
    <Upload
      label="Kanıt Paketleri"
      description="Maksimum 5 dosya yükleyebilirsiniz."
      multiple
      maxFiles={5}
      accept="image/*,.pdf"
    />
  );
}`,
      previewProps: { multiple: true },
      tags: ["multiple", "maxfiles", "limit"],
    },
    {
      id: "upload-sizes",
      title: "Boyut Varyantları",
      description: "Küçük, orta ve büyük yükleme alanı boyutları.",
      category: "basic",
      code: `import { Upload } from '@mfe/design-system';

export function Example() {
  return (
    <div className="flex flex-col gap-4">
      <Upload size="sm" label="Küçük" />
      <Upload size="md" label="Orta" />
      <Upload size="lg" label="Büyük" />
    </div>
  );
}`,
      previewProps: { size: "md" },
      multiVariantAxis: "size",
      tags: ["size", "sm", "md", "lg"],
    },
  ],
  Segmented: [
    {
      id: "segmented-basic",
      title: "Temel Segmented Kontrol",
      description: "Tekli seçim ile basit segment kontrolü.",
      category: "basic",
      code: `import { Segmented } from '@mfe/design-system';

export function Example() {
  return (
    <Segmented
      items={[
        { value: 'genel', label: 'Genel Bakış' },
        { value: 'detay', label: 'Detaylar' },
        { value: 'gecmis', label: 'Geçmiş' },
      ]}
      defaultValue="genel"
    />
  );
}`,
      previewProps: {},
      tags: ["selection", "toggle", "navigation"],
    },
    {
      id: "segmented-appearances",
      title: "Görünüm Varyantları",
      description: "Default, outline ve ghost görünüm seçenekleri.",
      category: "basic",
      code: `import { Segmented } from '@mfe/design-system';

const items = [
  { value: 'liste', label: 'Liste' },
  { value: 'grid', label: 'Grid' },
  { value: 'tablo', label: 'Tablo' },
];

export function Example() {
  return (
    <div className="flex flex-col gap-4">
      <Segmented items={items} defaultValue="liste" variant="default" />
      <Segmented items={items} defaultValue="liste" variant="outline" />
      <Segmented items={items} defaultValue="liste" variant="ghost" />
    </div>
  );
}`,
      previewProps: { appearance: "default" },
      multiVariantAxis: "appearance",
      tags: ["appearance", "outline", "ghost", "default"],
    },
    {
      id: "segmented-multiple",
      title: "Çoklu Seçim Filtresi",
      description: "Birden fazla seçim yapılabilen filtre modu.",
      category: "advanced",
      code: `import { Segmented } from '@mfe/design-system';

export function Example() {
  return (
    <Segmented
      selectionMode="multiple"
      shape="pill"
      appearance="ghost"
      items={[
        { value: 'aktif', label: 'Aktif', badge: <span className="ml-1 text-xs opacity-60">12</span> },
        { value: 'beklemede', label: 'Beklemede', badge: <span className="ml-1 text-xs opacity-60">5</span> },
        { value: 'tamamlandi', label: 'Tamamlandı', badge: <span className="ml-1 text-xs opacity-60">48</span> },
      ]}
      defaultValue={['aktif', 'beklemede']}
    />
  );
}`,
      previewProps: {},
      tags: ["multiple", "filter", "badge", "pill"],
    },
    {
      id: "segmented-icon",
      title: "İkon ve Açıklama",
      description: "İkon, etiket ve açıklama ile zengin segment içeriği.",
      category: "advanced",
      code: `import { Segmented } from '@mfe/design-system';
import { LayoutGrid, List, Table2 } from 'lucide-react';

export function Example() {
  return (
    <Segmented
      size="lg"
      iconPosition="top"
      items={[
        { value: 'grid', label: 'Grid', icon: <LayoutGrid className="h-4 w-4" />, description: 'Kart görünümü' },
        { value: 'liste', label: 'Liste', icon: <List className="h-4 w-4" />, description: 'Satır görünümü' },
        { value: 'tablo', label: 'Tablo', icon: <Table2 className="h-4 w-4" />, description: 'Tablo görünümü' },
      ]}
      defaultValue="grid"
    />
  );
}`,
      previewProps: {},
      tags: ["icon", "description", "top"],
    },
  ],
  MobileStepper: [
    {
      id: "mobilestepper-dots",
      title: "Nokta Göstergeli Stepper",
      description: "Kompakt viewport için nokta göstergeli adım takibi.",
      category: "basic",
      code: `import { MobileStepper } from '@mfe/design-system';

export function Example() {
  return (
    <MobileStepper
      steps={5}
      activeStep={2}
      variant="dots"
    />
  );
}`,
      previewProps: {},
      tags: ["stepper", "dots", "mobile", "navigation"],
    },
    {
      id: "mobilestepper-text",
      title: "Metin Göstergeli Stepper",
      description: "Adım numarası ile metin tabanlı ilerleme göstergesi.",
      category: "basic",
      code: `import { MobileStepper } from '@mfe/design-system';

export function Example() {
  return (
    <MobileStepper
      steps={5}
      activeStep={2}
      variant="text"
    />
  );
}`,
      previewProps: {},
      tags: ["stepper", "text", "progress"],
    },
    {
      id: "mobilestepper-progress",
      title: "İlerleme Çubuklu Stepper",
      description: "Yatay ilerleme çubuğu ile adım takibi.",
      category: "basic",
      code: `import { MobileStepper } from '@mfe/design-system';

export function Example() {
  return (
    <MobileStepper
      steps={5}
      activeStep={3}
      variant="progress"
    />
  );
}`,
      previewProps: {},
      tags: ["stepper", "progress", "bar"],
    },
  ],
  TablePagination: [
    {
      id: "tablepagination-basic",
      title: "Temel Tablo Sayfalama",
      description: "Satır adedi ve sayfa navigasyonu ile basit sayfalama.",
      category: "basic",
      code: `import { TablePagination } from '@mfe/design-system';

export function Example() {
  return (
    <TablePagination
      totalItems={150}
      defaultPage={1}
      defaultPageSize={10}
    />
  );
}`,
      previewProps: {},
      tags: ["pagination", "table", "navigation"],
    },
    {
      id: "tablepagination-firstlast",
      title: "İlk/Son Sayfa Butonları",
      description: "İlk ve son sayfa navigasyon butonları ile genişletilmiş sayfalama.",
      category: "basic",
      code: `import { TablePagination } from '@mfe/design-system';

export function Example() {
  return (
    <TablePagination
      totalItems={500}
      defaultPage={5}
      defaultPageSize={20}
      showFirstLastButtons
      pageSizeOptions={[10, 20, 50, 100]}
    />
  );
}`,
      previewProps: {},
      tags: ["firstlast", "buttons", "sizechanger"],
    },
    {
      id: "tablepagination-unknown",
      title: "Bilinmeyen Toplam Kayıt",
      description: "Toplam kayıt sayısı bilinmediğinde stream tabanlı sayfalama.",
      category: "advanced",
      code: `import { TablePagination } from '@mfe/design-system';

export function Example() {
  return (
    <TablePagination
      totalItems={0}
      totalItemsKnown={false}
      hasNextPage={true}
      defaultPage={1}
      defaultPageSize={20}
    />
  );
}`,
      previewProps: {},
      tags: ["unknown", "stream", "infinite"],
    },
  ],
  Empty: [
    {
      id: "empty-basic",
      title: "Temel Boş Durum",
      description: "İkon, başlık ve açıklama ile varsayılan boş durum ekranı.",
      category: "basic",
      code: `import { Empty } from '@mfe/design-system';
import { Inbox } from 'lucide-react';

export function Example() {
  return (
    <Empty
      icon={<Inbox />}
      title="Kayıt Bulunamadı"
      description="Aradığınız kriterlere uygun veri bulunamadı."
    />
  );
}`,
      previewProps: {},
      tags: ["empty", "nodata", "placeholder"],
    },
    {
      id: "empty-action",
      title: "Aksiyonlu Boş Durum",
      description: "Birincil ve ikincil aksiyon butonları ile boş durum.",
      category: "basic",
      code: `import { Empty } from '@mfe/design-system';
import { Button } from '@mfe/design-system';
import { Plus } from 'lucide-react';

export function Example() {
  return (
    <Empty
      icon={<Plus />}
      title="Henüz Belge Yok"
      description="İlk belgenizi oluşturarak başlayın."
      action={<Button variant="primary">Yeni Belge Oluştur</Button>}
      secondaryAction={<Button variant="ghost">Şablon Kullan</Button>}
    />
  );
}`,
      previewProps: {},
      tags: ["action", "button", "cta"],
    },
    {
      id: "empty-compact",
      title: "Kompakt Boş Durum",
      description: "Satır içi kullanım için küçültülmüş boş durum paneli.",
      category: "layout",
      code: `import { Empty } from '@mfe/design-system';
import { FileX } from 'lucide-react';

export function Example() {
  return (
    <div className="rounded-xl border border-gray-200 p-4">
      <Empty
        compact
        icon={<FileX />}
        title="Sonuç Yok"
        description="Filtreleri değiştirerek tekrar deneyin."
      />
    </div>
  );
}`,
      previewProps: { compact: true },
      tags: ["compact", "inline", "embedded"],
    },
  ],
  EmptyErrorLoading: [
    {
      id: "eel-loading",
      title: "Yükleniyor Durumu",
      description: "Skeleton ve spinner ile yükleniyor geri bildirimi.",
      category: "basic",
      code: `import { EmptyErrorLoading } from '@mfe/design-system';

export function Example() {
  return (
    <EmptyErrorLoading
      mode="loading"
      title="Veri Yükleniyor"
      description="Bilgiler sunucudan alınıyor, lütfen bekleyin."
      loadingLabel="Yükleniyor..."
    />
  );
}`,
      previewProps: { mode: "loading" },
      tags: ["loading", "skeleton", "spinner"],
    },
    {
      id: "eel-error",
      title: "Hata Durumu",
      description: "Hata mesajı ve yeniden deneme butonu ile hata geri bildirimi.",
      category: "basic",
      code: `import { EmptyErrorLoading } from '@mfe/design-system';

export function Example() {
  return (
    <EmptyErrorLoading
      mode="error"
      title="Bağlantı Hatası"
      description="Sunucu ile iletişim kurulamadı."
      errorLabel="Bir hata oluştu. Lütfen tekrar deneyin."
      retryLabel="Tekrar Dene"
      onRetry={() => console.log('retry')}
    />
  );
}`,
      previewProps: { mode: "error" },
      tags: ["error", "retry", "feedback"],
    },
    {
      id: "eel-empty",
      title: "Boş Durum",
      description: "Veri bulunamadığında gösterilen boş durum mesajı.",
      category: "basic",
      code: `import { EmptyErrorLoading } from '@mfe/design-system';

export function Example() {
  return (
    <EmptyErrorLoading
      mode="empty"
      title="Sonuç Bulunamadı"
      description="Arama kriterlerinize uygun kayıt yok."
    />
  );
}`,
      previewProps: { mode: "empty" },
      tags: ["empty", "no-data", "feedback"],
    },
  ],
  LinkInline: [
    {
      id: "linkinline-basic",
      title: "Temel Bağlantı",
      description: "Varsayılan primary ton ile satır içi bağlantı.",
      category: "basic",
      code: `import { LinkInline } from '@mfe/design-system';

export function Example() {
  return (
    <p>
      Detaylar için <LinkInline href="/docs">dokümantasyona</LinkInline> bakın.
    </p>
  );
}`,
      previewProps: { tone: "primary", underline: "hover" },
      tags: ["link", "inline", "primary"],
    },
    {
      id: "linkinline-tones",
      title: "Bağlantı Tonları",
      description: "Primary ve secondary ton karşılaştırması.",
      category: "basic",
      code: `import { LinkInline } from '@mfe/design-system';

export function Example() {
  return (
    <div className="flex gap-4">
      <LinkInline href="/page" variant="primary">Primary Bağlantı</LinkInline>
      <LinkInline href="/page" variant="secondary">Secondary Bağlantı</LinkInline>
    </div>
  );
}`,
      previewProps: { tone: "primary" },
      multiVariantAxis: "tone",
      tags: ["tone", "primary", "secondary"],
    },
    {
      id: "linkinline-external",
      title: "Harici Bağlantı",
      description: "Yeni sekmede açılan harici bağlantı, otomatik ikon ile.",
      category: "advanced",
      code: `import { LinkInline } from '@mfe/design-system';

export function Example() {
  return (
    <LinkInline href="https://example.com" external>
      Harici Kaynak
    </LinkInline>
  );
}`,
      previewProps: { external: true },
      tags: ["external", "target-blank", "icon"],
    },
    {
      id: "linkinline-disabled",
      title: "Devre Dışı Bağlantı",
      description: "Tıklanamaz durumda olan bağlantı gösterimi.",
      category: "advanced",
      code: `import { LinkInline } from '@mfe/design-system';

export function Example() {
  return (
    <LinkInline href="/restricted" disabled>
      Kısıtlı Bağlantı
    </LinkInline>
  );
}`,
      previewProps: { disabled: true },
      tags: ["disabled", "blocked", "access"],
    },
  ],
  MenuBar: [
    {
      id: "menubar-basic",
      title: "Temel Menü Çubuğu",
      description: "Varsayılan ayarlarla basit bir menü çubuğu.",
      category: "basic",
      code: `import { MenuBar } from '@mfe/design-system';

const items = [
  { value: 'dashboard', label: 'Kontrol Paneli', icon: '🏠' },
  { value: 'reports', label: 'Raporlar', icon: '📊' },
  { value: 'settings', label: 'Ayarlar', icon: '⚙️' },
];

export function Example() {
  return (
    <MenuBar
      items={items}
      defaultValue="dashboard"
      ariaLabel="Ana menü"
    />
  );
}`,
      previewProps: {},
      tags: ["menubar", "navigation", "basic"],
    },
    {
      id: "menubar-appearances",
      title: "Görünüm Varyantları",
      description: "Default, outline ve ghost görünüm karşılaştırması.",
      category: "basic",
      code: `import { MenuBar } from '@mfe/design-system';

const items = [
  { value: 'home', label: 'Ana Sayfa' },
  { value: 'products', label: 'Ürünler' },
  { value: 'about', label: 'Hakkında' },
];

export function Example() {
  return (
    <div className="flex flex-col gap-4">
      <MenuBar items={items} defaultValue="home" appearance="default" />
      <MenuBar items={items} defaultValue="home" appearance="outline" />
      <MenuBar items={items} defaultValue="home" appearance="ghost" />
    </div>
  );
}`,
      previewProps: { appearance: "default" },
      multiVariantAxis: "appearance",
      tags: ["appearance", "default", "outline", "ghost"],
    },
    {
      id: "menubar-overflow",
      title: "Taşma Davranışı",
      description: "Çok sayıda öğe ile overflow kontrolü.",
      category: "advanced",
      code: `import { MenuBar } from '@mfe/design-system';

const items = Array.from({ length: 10 }, (_, i) => ({
  value: \`item-\${i}\`,
  label: \`Bölüm \${i + 1}\`,
}));

export function Example() {
  return (
    <MenuBar
      items={items}
      defaultValue="item-0"
      overflowBehavior="collapse-to-more"
      maxVisibleItems={5}
      overflowLabel="Daha Fazla"
    />
  );
}`,
      previewProps: { overflowBehavior: "collapse-to-more", maxVisibleItems: 5 },
      tags: ["overflow", "collapse", "more"],
    },
  ],
  AppHeader: [
    {
      id: "appheader-basic",
      title: "Temel Uygulama Header",
      description: "Marka alanı, navigasyon ve yardımcı slot ile uygulama header.",
      category: "layout",
      code: `import { MenuBar } from '@mfe/design-system';

const items = [
  { value: 'dashboard', label: 'Kontrol Paneli' },
  { value: 'projects', label: 'Projeler' },
  { value: 'team', label: 'Ekip' },
];

export function Example() {
  return (
    <MenuBar
      items={items}
      defaultValue="dashboard"
      startSlot={<span className="font-bold text-lg">MyApp</span>}
      endSlot={<span className="text-sm">👤 Kullanıcı</span>}
      ariaLabel="Uygulama header"
    />
  );
}`,
      previewProps: {},
      tags: ["header", "brand", "utility", "app"],
    },
    {
      id: "appheader-responsive",
      title: "Duyarlı Header",
      description: "Mobilde ikon moduna geçen duyarlı uygulama header.",
      category: "layout",
      code: `import { MenuBar } from '@mfe/design-system';

const items = [
  { value: 'home', label: 'Ana Sayfa', icon: '🏠' },
  { value: 'search', label: 'Arama', icon: '🔍' },
  { value: 'profile', label: 'Profil', icon: '👤' },
];

export function Example() {
  return (
    <MenuBar
      items={items}
      defaultValue="home"
      labelVisibility="responsive"
      mobileFallback="menu"
      startSlot={<span className="font-bold">Logo</span>}
      ariaLabel="Duyarlı header"
    />
  );
}`,
      previewProps: { labelVisibility: "responsive", mobileFallback: "menu" },
      tags: ["responsive", "mobile", "icon-only"],
    },
  ],
  NavigationMenu: [
    {
      id: "navmenu-basic",
      title: "Temel Navigasyon Menüsü",
      description: "Ana rota bağlantıları ile navigasyon menüsü.",
      category: "layout",
      code: `import { MenuBar } from '@mfe/design-system';

const items = [
  { value: 'overview', label: 'Genel Bakış', icon: '📋' },
  { value: 'analytics', label: 'Analitik', icon: '📈' },
  { value: 'users', label: 'Kullanıcılar', icon: '👥' },
  { value: 'settings', label: 'Ayarlar', icon: '⚙️' },
];

export function Example() {
  return (
    <MenuBar
      items={items}
      defaultValue="overview"
      appearance="default"
      ariaLabel="Navigasyon menüsü"
    />
  );
}`,
      previewProps: {},
      tags: ["navigation", "routes", "menu"],
    },
    {
      id: "navmenu-pinned",
      title: "Sabitlenmiş Rotalar",
      description: "Pinned ve overflow yönetimi ile navigasyon menüsü.",
      category: "advanced",
      code: `import { MenuBar } from '@mfe/design-system';

const items = [
  { value: 'home', label: 'Ana Sayfa', icon: '🏠', pinned: true },
  { value: 'projects', label: 'Projeler', icon: '📁', pinned: true },
  { value: 'tasks', label: 'Görevler', icon: '✅' },
  { value: 'calendar', label: 'Takvim', icon: '📅' },
  { value: 'reports', label: 'Raporlar', icon: '📊' },
  { value: 'archive', label: 'Arşiv', icon: '🗄️' },
];

export function Example() {
  return (
    <MenuBar
      items={items}
      defaultValue="home"
      overflowBehavior="collapse-to-more"
      maxVisibleItems={4}
      overflowLabel="Daha Fazla"
      ariaLabel="Navigasyon"
    />
  );
}`,
      previewProps: { overflowBehavior: "collapse-to-more" },
      tags: ["pinned", "overflow", "priority"],
    },
  ],
  ActionHeader: [
    {
      id: "actionheader-basic",
      title: "Temel Aksiyon Header",
      description: "Seçim odaklı toplu işlem araç çubuğu.",
      category: "layout",
      code: `import { MenuBar } from '@mfe/design-system';

const items = [
  { value: 'select-all', label: '3 Seçili', icon: '☑️', emphasis: 'promoted' },
  { value: 'edit', label: 'Düzenle', icon: '✏️' },
  { value: 'delete', label: 'Sil', icon: '🗑️' },
  { value: 'export', label: 'Dışa Aktar', icon: '📤' },
];

export function Example() {
  return (
    <MenuBar
      items={items}
      size="sm"
      appearance="ghost"
      ariaLabel="Toplu işlem araç çubuğu"
    />
  );
}`,
      previewProps: { size: "sm", appearance: "ghost" },
      tags: ["action", "bulk", "toolbar", "selection"],
    },
    {
      id: "actionheader-governance",
      title: "Salt-Okunur Aksiyon Header",
      description: "Yönetim akışında salt-okunur modda aksiyon header.",
      category: "advanced",
      code: `import { MenuBar } from '@mfe/design-system';

const items = [
  { value: 'view', label: 'Görüntüle', icon: '👁️' },
  { value: 'approve', label: 'Onayla', icon: '✅', disabled: true },
  { value: 'reject', label: 'Reddet', icon: '❌', disabled: true },
];

export function Example() {
  return (
    <MenuBar
      items={items}
      defaultValue="view"
      size="sm"
      appearance="outline"
      access="readonly"
      ariaLabel="Onay akışı araç çubuğu"
    />
  );
}`,
      previewProps: { size: "sm", appearance: "outline", access: "readonly" },
      tags: ["readonly", "governance", "approval"],
    },
  ],
  ContextMenu: [
    {
      id: "contextmenu-basic",
      title: "Temel Bağlam Menüsü",
      description: "Sağ tıklama ile açılan temel bağlam menüsü.",
      category: "basic",
      code: `import { ContextMenu } from '@mfe/design-system';

const items = [
  { key: 'copy', label: 'Kopyala', shortcut: 'Ctrl+C' },
  { key: 'paste', label: 'Yapıştır', shortcut: 'Ctrl+V' },
  { type: 'separator', key: 'sep1' },
  { key: 'delete', label: 'Sil', danger: true },
];

export function Example() {
  return (
    <ContextMenu items={items}>
      <div className="rounded-lg border p-8 text-center text-sm text-gray-500">
        Sağ tıklayın
      </div>
    </ContextMenu>
  );
}`,
      previewProps: {},
      tags: ["context-menu", "right-click", "basic"],
    },
    {
      id: "contextmenu-groups",
      title: "Gruplu Bağlam Menüsü",
      description: "Etiket ve ayırıcı ile gruplanmış menü öğeleri.",
      category: "advanced",
      code: `import { ContextMenu } from '@mfe/design-system';

const items = [
  { type: 'label', key: 'lbl-edit', label: 'Düzenleme' },
  { key: 'cut', label: 'Kes', shortcut: 'Ctrl+X' },
  { key: 'copy', label: 'Kopyala', shortcut: 'Ctrl+C' },
  { key: 'paste', label: 'Yapıştır', shortcut: 'Ctrl+V' },
  { type: 'separator', key: 'sep1' },
  { type: 'label', key: 'lbl-action', label: 'İşlemler' },
  { key: 'rename', label: 'Yeniden Adlandır', shortcut: 'F2' },
  { key: 'archive', label: 'Arşivle' },
  { type: 'separator', key: 'sep2' },
  { key: 'delete', label: 'Sil', danger: true, shortcut: 'Del' },
];

export function Example() {
  return (
    <ContextMenu items={items}>
      <div className="rounded-lg border p-8 text-center text-sm text-gray-500">
        Sağ tıklayın
      </div>
    </ContextMenu>
  );
}`,
      previewProps: {},
      tags: ["groups", "labels", "separator", "advanced"],
    },
    {
      id: "contextmenu-icons",
      title: "İkonlu Bağlam Menüsü",
      description: "Her öğede ikon bulunan bağlam menüsü.",
      category: "basic",
      code: `import { ContextMenu } from '@mfe/design-system';

const items = [
  { key: 'open', label: 'Aç', icon: '📂' },
  { key: 'share', label: 'Paylaş', icon: '🔗' },
  { key: 'download', label: 'İndir', icon: '⬇️' },
  { type: 'separator', key: 'sep1' },
  { key: 'info', label: 'Bilgi', icon: 'ℹ️' },
];

export function Example() {
  return (
    <ContextMenu items={items}>
      <div className="rounded-lg border p-8 text-center text-sm text-gray-500">
        Sağ tıklayın
      </div>
    </ContextMenu>
  );
}`,
      previewProps: {},
      tags: ["icons", "visual", "context-menu"],
    },
  ],
  DesktopMenubar: [
    {
      id: "desktopmenubar-basic",
      title: "Temel Masaüstü Menü Çubuğu",
      description: "File/View/Tools benzeri klasik masaüstü menü yapısı.",
      category: "layout",
      code: `import { MenuBar } from '@mfe/design-system';

const items = [
  {
    value: 'file',
    label: 'Dosya',
    menuItems: [
      { key: 'new', label: 'Yeni', shortcut: 'Ctrl+N' },
      { key: 'open', label: 'Aç', shortcut: 'Ctrl+O' },
      { key: 'save', label: 'Kaydet', shortcut: 'Ctrl+S' },
    ],
  },
  {
    value: 'edit',
    label: 'Düzenle',
    menuItems: [
      { key: 'undo', label: 'Geri Al', shortcut: 'Ctrl+Z' },
      { key: 'redo', label: 'Yinele', shortcut: 'Ctrl+Y' },
    ],
  },
  {
    value: 'view',
    label: 'Görünüm',
    menuItems: [
      { key: 'zoom-in', label: 'Yakınlaştır', shortcut: 'Ctrl+=' },
      { key: 'zoom-out', label: 'Uzaklaştır', shortcut: 'Ctrl+-' },
    ],
  },
];

export function Example() {
  return (
    <MenuBar
      items={items}
      submenuTrigger="hover"
      appearance="ghost"
      size="sm"
      ariaLabel="Uygulama menü çubuğu"
    />
  );
}`,
      previewProps: { submenuTrigger: "hover", appearance: "ghost", size: "sm" },
      tags: ["desktop", "menubar", "file-menu", "hover"],
    },
    {
      id: "desktopmenubar-keyboard",
      title: "Klavye Navigasyonlu Menü",
      description: "Klavye kısayolları ve erişilebilirlik odaklı masaüstü menü.",
      category: "advanced",
      code: `import { MenuBar } from '@mfe/design-system';

const items = [
  {
    value: 'tools',
    label: 'Araçlar',
    menuItems: [
      { key: 'terminal', label: 'Terminal', shortcut: 'Ctrl+\`' },
      { key: 'devtools', label: 'Geliştirici Araçları', shortcut: 'F12' },
      { key: 'extensions', label: 'Eklentiler', shortcut: 'Ctrl+Shift+X' },
    ],
  },
  {
    value: 'help',
    label: 'Yardım',
    menuItems: [
      { key: 'docs', label: 'Dokümantasyon' },
      { key: 'shortcuts', label: 'Klavye Kısayolları', shortcut: 'Ctrl+K Ctrl+S' },
      { key: 'about', label: 'Hakkında' },
    ],
  },
];

export function Example() {
  return (
    <MenuBar
      items={items}
      submenuTrigger="hover"
      appearance="ghost"
      size="sm"
      ariaLabel="Araçlar menü çubuğu"
    />
  );
}`,
      previewProps: { submenuTrigger: "hover", appearance: "ghost", size: "sm" },
      tags: ["keyboard", "shortcuts", "accessibility"],
    },
  ],
  NotificationDrawer: [
    {
      id: "notificationdrawer-basic",
      title: "Temel Bildirim Cekmecesi",
      description: "Sag kenardan acilan bildirim cekmecesi.",
      category: "basic",
      code: `import { useState } from 'react';
import { NotificationDrawer } from '@mfe/design-system';

export function Example() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)}>Bildirimleri Ac</button>
      <NotificationDrawer
        open={open}
        onClose={() => setOpen(false)}
        items={[
          { id: '1', message: 'Yeni yorum eklendi', type: 'info', createdAt: Date.now() },
          { id: '2', message: 'Derleme basarili', type: 'success', createdAt: Date.now() - 60000 },
        ]}
      />
    </>
  );
}`,
      previewProps: { open: true },
      tags: ["drawer", "bildirim", "overlay"],
    },
    {
      id: "notificationdrawer-filtered",
      title: "Filtreli Bildirim Cekmecesi",
      description: "Filtre ve toplu islem destegi ile bildirim cekmecesi.",
      category: "advanced",
      code: `import { useState } from 'react';
import { NotificationDrawer } from '@mfe/design-system';

export function Example() {
  const [open, setOpen] = useState(true);

  return (
    <NotificationDrawer
      open={open}
      onClose={() => setOpen(false)}
      showFilters
      grouping="priority"
      onMarkAllRead={() => console.log('Tumunu okundu say')}
      items={[
        { id: '1', message: 'Kritik hata tespit edildi', type: 'error', priority: 'high', createdAt: Date.now() },
        { id: '2', message: 'Yeni surum yayinlandi', type: 'info', pinned: true, createdAt: Date.now() - 3600000 },
        { id: '3', message: 'Test basariyla tamamlandi', type: 'success', read: true, createdAt: Date.now() - 7200000 },
      ]}
    />
  );
}`,
      previewProps: { open: true, showFilters: true, grouping: "priority" },
      tags: ["drawer", "filtre", "gruplama", "oncelik"],
    },
  ],
  NotificationPanel: [
    {
      id: "notificationpanel-basic",
      title: "Temel Bildirim Paneli",
      description: "Bildirim listesi gosteren temel panel bileseni.",
      category: "basic",
      code: `import { NotificationPanel } from '@mfe/design-system';

export function Example() {
  return (
    <NotificationPanel
      title="Bildirimler"
      items={[
        { id: '1', message: 'Deployment basarili', type: 'success', createdAt: Date.now() },
        { id: '2', message: 'Disk alani %90 doldu', type: 'warning', priority: 'high', createdAt: Date.now() - 120000 },
        { id: '3', message: 'Yeni kullanici katildi', type: 'info', createdAt: Date.now() - 300000 },
      ]}
      onMarkAllRead={() => console.log('Tumunu okundu say')}
    />
  );
}`,
      previewProps: {},
      tags: ["bildirim", "liste", "panel"],
    },
    {
      id: "notificationpanel-filters",
      title: "Filtreli Bildirim Paneli",
      description: "Okunmamis, oncelikli ve pinlenmis filtreleriyle bildirim paneli.",
      category: "advanced",
      code: `import { NotificationPanel } from '@mfe/design-system';

export function Example() {
  return (
    <NotificationPanel
      title="Sistem Bildirimleri"
      showFilters
      availableFilters={['all', 'unread', 'high-priority', 'pinned']}
      grouping="priority"
      items={[
        { id: '1', message: 'Veritabani baglantisi kesildi', type: 'error', priority: 'high', createdAt: Date.now() },
        { id: '2', message: 'API surumu guncellendi', type: 'info', pinned: true, createdAt: Date.now() - 600000 },
        { id: '3', message: 'Yedekleme tamamlandi', type: 'success', read: true, createdAt: Date.now() - 900000 },
      ]}
    />
  );
}`,
      previewProps: { showFilters: true, grouping: "priority" },
      tags: ["filtre", "gruplama", "oncelik", "pin"],
    },
    {
      id: "notificationpanel-selectable",
      title: "Secim Destekli Bildirim Paneli",
      description: "Coklu secim ve toplu islem destegi ile bildirim paneli.",
      category: "advanced",
      code: `import { useState } from 'react';
import { NotificationPanel } from '@mfe/design-system';

export function Example() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  return (
    <NotificationPanel
      title="Bildirimler"
      selectable
      selectedIds={selectedIds}
      onSelectedIdsChange={setSelectedIds}
      onMarkSelectedRead={(ids) => console.log('Okundu:', ids)}
      onRemoveSelected={(ids) => console.log('Silindi:', ids)}
      items={[
        { id: '1', message: 'Build #142 basarisiz', type: 'error', createdAt: Date.now() },
        { id: '2', message: 'PR #58 onaylandi', type: 'success', createdAt: Date.now() - 60000 },
        { id: '3', message: 'Sprint planlama hatirlatmasi', type: 'info', createdAt: Date.now() - 180000 },
      ]}
    />
  );
}`,
      previewProps: { selectable: true },
      tags: ["secim", "toplu-islem", "checkbox"],
    },
  ],
  NotificationItemCard: [
    {
      id: "notificationitemcard-basic",
      title: "Temel Bildirim Karti",
      description: "Tekil bildirim ogesi karti.",
      category: "basic",
      code: `import { NotificationItemCard } from '@mfe/design-system';

export function Example() {
  return (
    <NotificationItemCard
      item={{
        id: '1',
        message: 'Yeni yorum eklendi',
        description: 'Kullanici Ali tasarim belgesine yorum ekledi.',
        type: 'info',
        createdAt: Date.now(),
      }}
      onRemove={(id) => console.log('Kaldirildi:', id)}
    />
  );
}`,
      previewProps: {},
      tags: ["bildirim", "kart", "temel"],
    },
    {
      id: "notificationitemcard-priority",
      title: "Oncelikli Bildirim Karti",
      description: "Yuksek oncelikli ve pinlenmis bildirim karti.",
      category: "advanced",
      code: `import { NotificationItemCard } from '@mfe/design-system';

export function Example() {
  return (
    <div className="flex flex-col gap-3">
      <NotificationItemCard
        item={{
          id: '1',
          message: 'Sunucu CPU kullanimi %95',
          description: 'Acil mudahale gerekli.',
          type: 'error',
          priority: 'high',
          createdAt: Date.now(),
        }}
        getPrimaryActionLabel={() => 'Detaylari Gor'}
        onPrimaryAction={(item) => console.log('Aksiyon:', item.id)}
      />
      <NotificationItemCard
        item={{
          id: '2',
          message: 'Onemli duyuru pinlendi',
          type: 'warning',
          pinned: true,
          read: true,
          createdAt: Date.now() - 86400000,
        }}
      />
    </div>
  );
}`,
      previewProps: {},
      tags: ["oncelik", "pin", "aksiyon", "hata"],
    },
  ],
  ToastProvider: [
    {
      id: "toast-basic",
      title: "Temel Toast Kullanimi",
      description: "useToast hook'u ile bildirim gosterimi.",
      category: "basic",
      code: `import { ToastProvider, useToast } from '@mfe/design-system';

function DemoButtons() {
  const toast = useToast();

  return (
    <div className="flex gap-2">
      <button onClick={() => toast.success('Basariyla kaydedildi!')}>Basari</button>
      <button onClick={() => toast.error('Bir hata olustu.')}>Hata</button>
      <button onClick={() => toast.info('Bilgilendirme mesaji.')}>Bilgi</button>
      <button onClick={() => toast.warning('Dikkat edilmesi gereken durum.')}>Uyari</button>
    </div>
  );
}

export function Example() {
  return (
    <ToastProvider>
      <DemoButtons />
    </ToastProvider>
  );
}`,
      previewProps: {},
      tags: ["toast", "bildirim", "hook"],
    },
    {
      id: "toast-positions",
      title: "Toast Konumlari",
      description: "Farkli ekran konumlarinda toast gosterimi.",
      category: "layout",
      code: `import { ToastProvider, useToast } from '@mfe/design-system';

function DemoButtons() {
  const toast = useToast();

  return (
    <button onClick={() => toast.info('Alt merkezden bildirim', { title: 'Konum Testi' })}>
      Toast Goster
    </button>
  );
}

export function Example() {
  return (
    <ToastProvider position="bottom-center" duration={3000} maxVisible={3}>
      <DemoButtons />
    </ToastProvider>
  );
}`,
      previewProps: { position: "bottom-center", duration: 3000, maxVisible: 3 },
      tags: ["konum", "position", "bottom", "center"],
    },
    {
      id: "toast-with-title",
      title: "Baslikli Toast",
      description: "Baslik ve ozel sure ile detayli toast mesajlari.",
      category: "advanced",
      code: `import { ToastProvider, useToast } from '@mfe/design-system';

function DemoButtons() {
  const toast = useToast();

  return (
    <div className="flex gap-2">
      <button onClick={() => toast.success('Degisiklikler basariyla kaydedildi.', { title: 'Kayit Basarili', duration: 5000 })}>
        Baslikli Basari
      </button>
      <button onClick={() => toast.error('Sunucu baglantisi kurulamadi.', { title: 'Baglanti Hatasi', duration: 8000 })}>
        Baslikli Hata
      </button>
    </div>
  );
}

export function Example() {
  return (
    <ToastProvider>
      <DemoButtons />
    </ToastProvider>
  );
}`,
      previewProps: {},
      tags: ["baslik", "title", "sure", "duration"],
    },
  ],
  TourCoachmarks: [
    {
      id: "tourcoachmarks-basic",
      title: "Temel Rehber Turu",
      description: "Adim adim kullanici rehberleme bileseni.",
      category: "basic",
      code: `import { TourCoachmarks } from '@mfe/design-system';

export function Example() {
  return (
    <TourCoachmarks
      open
      title="Baslangic Rehberi"
      steps={[
        { id: 'hosgeldin', title: 'Hosgeldiniz!', description: 'Bu rehber size temel ozellikleri tanitacaktir.' },
        { id: 'panel', title: 'Kontrol Paneli', description: 'Sol menuden tum modullere erisebilirsiniz.' },
        { id: 'ayarlar', title: 'Ayarlar', description: 'Profil ve bildirim tercihlerinizi buradan yonetebilirsiniz.' },
      ]}
      onFinish={() => console.log('Tur tamamlandi')}
    />
  );
}`,
      previewProps: { open: true },
      tags: ["tur", "rehber", "onboarding", "adim"],
    },
    {
      id: "tourcoachmarks-readonly",
      title: "Salt Okunur Tur",
      description: "Sadece goruntuleme modunda rehber turu.",
      category: "advanced",
      code: `import { TourCoachmarks } from '@mfe/design-system';

export function Example() {
  return (
    <TourCoachmarks
      open
      mode="readonly"
      showProgress
      allowSkip
      title="Ozellik Tanitimi"
      steps={[
        { id: 'raporlar', title: 'Raporlar', description: 'Detayli analizlere ve grafiklere erisim.', tone: 'info', meta: 'Yeni' },
        { id: 'entegrasyon', title: 'Entegrasyonlar', description: 'Ucuncu parti servisleri baglayin.', tone: 'success', meta: 'Aktif' },
        { id: 'guvenlik', title: 'Guvenlik', description: 'Iki faktorlu dogrulama ve erisim kontrolleri.', tone: 'warning', meta: 'Onerilen' },
      ]}
    />
  );
}`,
      previewProps: { open: true, mode: "readonly", showProgress: true },
      tags: ["readonly", "salt-okunur", "tanitim", "meta"],
    },
  ],
  JsonViewer: [
    {
      id: "jsonviewer-basic",
      title: "Temel JSON Goruntuleme",
      description: "Basit bir JSON nesnesini agac yapisinda gosterme.",
      category: "basic",
      code: `import { JsonViewer } from '@mfe/design-system';

export function Example() {
  return (
    <JsonViewer
      title="API Yaniti"
      description="Son istek sonucu"
      value={{
        status: 'success',
        code: 200,
        data: {
          kullanici: 'Ali Veli',
          rol: 'admin',
          aktif: true,
        },
      }}
    />
  );
}`,
      previewProps: {},
      tags: ["json", "agac", "veri", "temel"],
    },
    {
      id: "jsonviewer-array",
      title: "Dizi Verisi Goruntuleme",
      description: "JSON dizisi icerigi ile tip rozetleri.",
      category: "advanced",
      code: `import { JsonViewer } from '@mfe/design-system';

export function Example() {
  return (
    <JsonViewer
      title="Kullanici Listesi"
      rootLabel="kullanicilar"
      defaultExpandedDepth={2}
      showTypes
      value={[
        { id: 1, ad: 'Ayse', departman: 'Muhendislik', aktif: true },
        { id: 2, ad: 'Mehmet', departman: 'Tasarim', aktif: false },
        { id: 3, ad: 'Fatma', departman: 'Urun', aktif: true },
      ]}
    />
  );
}`,
      previewProps: { defaultExpandedDepth: 2, showTypes: true },
      tags: ["dizi", "array", "tip", "badge"],
    },
    {
      id: "jsonviewer-nested",
      title: "Derin Ic Ice JSON",
      description: "Cok katmanli ic ice gecmis veri yapisi goruntuleme.",
      category: "advanced",
      code: `import { JsonViewer } from '@mfe/design-system';

export function Example() {
  return (
    <JsonViewer
      title="Yapilandirma"
      rootLabel="config"
      defaultExpandedDepth={1}
      maxHeight={500}
      value={{
        veritabani: {
          host: 'db.example.com',
          port: 5432,
          ssl: true,
          havuz: { min: 2, max: 10, zaman_asimi: 30000 },
        },
        onbellek: {
          etkin: true,
          ttl: 3600,
          strateji: 'lru',
        },
        loglama: null,
      }}
    />
  );
}`,
      previewProps: { defaultExpandedDepth: 1, maxHeight: 500 },
      tags: ["nested", "ic-ice", "config", "yapilandirma"],
    },
  ],
  AnchorToc: [
    {
      id: "anchortoc-basic",
      title: "Temel Icerik Tablosu",
      description: "Sayfa ici navigasyon icin baglanti listesi.",
      category: "basic",
      code: `import { AnchorToc } from '@mfe/design-system';

export function Example() {
  return (
    <AnchorToc
      title="Bu Sayfada"
      items={[
        { id: 'giris', label: 'Giris' },
        { id: 'kurulum', label: 'Kurulum' },
        { id: 'kullanim', label: 'Kullanim' },
        { id: 'api', label: 'API Referansi' },
      ]}
    />
  );
}`,
      previewProps: {},
      tags: ["toc", "navigasyon", "baglanti", "sayfa-ici"],
    },
    {
      id: "anchortoc-hierarchical",
      title: "Hiyerarsik Icerik Tablosu",
      description: "Cok seviyeli girinti ile icerik tablosu.",
      category: "layout",
      code: `import { AnchorToc } from '@mfe/design-system';

export function Example() {
  return (
    <AnchorToc
      title="Dokumantasyon"
      density="comfortable"
      items={[
        { id: 'baslangic', label: 'Baslangic', level: 1 },
        { id: 'on-kosullar', label: 'On Kosullar', level: 2 },
        { id: 'yukleme', label: 'Yukleme Adimlari', level: 2 },
        { id: 'bileskenler', label: 'Bilesenler', level: 1 },
        { id: 'buton', label: 'Buton', level: 2, meta: '12 prop' },
        { id: 'form', label: 'Form Elemanlari', level: 2, meta: '8 prop' },
        { id: 'gelismis', label: 'Gelismis Konular', level: 1 },
        { id: 'tema', label: 'Tema Ozellestirme', level: 3 },
      ]}
    />
  );
}`,
      previewProps: { density: "comfortable" },
      tags: ["hiyerarsi", "seviye", "level", "meta"],
    },
    {
      id: "anchortoc-compact",
      title: "Sikisik Yogunluk",
      description: "Dar alanlarda kullanim icin compact gorunum.",
      category: "layout",
      code: `import { AnchorToc } from '@mfe/design-system';

export function Example() {
  return (
    <AnchorToc
      title="Hizli Erisim"
      density="compact"
      sticky
      items={[
        { id: 'ozet', label: 'Ozet' },
        { id: 'metrikler', label: 'Metrikler' },
        { id: 'grafikler', label: 'Grafikler' },
        { id: 'tablolar', label: 'Tablolar' },
        { id: 'sonuc', label: 'Sonuc', disabled: true },
      ]}
    />
  );
}`,
      previewProps: { density: "compact", sticky: true },
      tags: ["compact", "sikisik", "sticky", "disabled"],
    },
  ],
  Tree: [
    {
      id: "tree-basic",
      title: "Temel Agac Yapisi",
      description: "Hiyerarsik veriyi agac gorunumunde gosterme.",
      category: "basic",
      code: `import { Tree } from '@mfe/design-system';

export function Example() {
  return (
    <Tree
      title="Proje Yapisi"
      description="Kaynak kod dizin agaci"
      nodes={[
        {
          key: 'src',
          label: 'src',
          children: [
            { key: 'components', label: 'components', description: 'UI bileseleri', badges: ['14 dosya'] },
            { key: 'utils', label: 'utils', description: 'Yardimci fonksiyonlar' },
            { key: 'hooks', label: 'hooks', description: 'React hook\'lari', badges: ['Yeni'] },
          ],
        },
        { key: 'package', label: 'package.json', meta: '2.1 KB' },
        { key: 'readme', label: 'README.md', meta: '4.5 KB' },
      ]}
      defaultExpandedKeys={['src']}
    />
  );
}`,
      previewProps: { defaultExpandedKeys: ["src"] },
      tags: ["agac", "hiyerarsi", "klasor", "dizin"],
    },
    {
      id: "tree-tones",
      title: "Duruma Gore Renkli Dugumler",
      description: "Farkli ton ve rozet ile dugum vurgulama.",
      category: "advanced",
      code: `import { Tree } from '@mfe/design-system';

export function Example() {
  return (
    <Tree
      title="Servis Durumu"
      description="Mikro servis sagligi"
      nodes={[
        { key: 'api', label: 'API Gateway', description: 'Tum istekler yonlendiriliyor', tone: 'success', badges: ['Saglikli'] },
        { key: 'auth', label: 'Auth Servisi', description: 'Yanit suresi yuksek', tone: 'warning', badges: ['Yavas'] },
        {
          key: 'veritabani',
          label: 'Veritabani',
          tone: 'danger',
          badges: ['Kesinti'],
          children: [
            { key: 'primary', label: 'Primary', description: 'Baglanti zaman asimi', tone: 'danger' },
            { key: 'replica', label: 'Replica', description: 'Senkronizasyon bekleniyor', tone: 'warning' },
          ],
        },
        { key: 'cache', label: 'Onbellek', description: 'Redis cluster aktif', tone: 'info', badges: ['v7.2'] },
      ]}
      defaultExpandedKeys={['veritabani']}
    />
  );
}`,
      previewProps: { defaultExpandedKeys: ["veritabani"] },
      tags: ["ton", "durum", "saglik", "servis", "badge"],
    },
    {
      id: "tree-selectable",
      title: "Secilebilir Agac",
      description: "Dugum secimi ve olay yakalama ile agac yapisi.",
      category: "advanced",
      code: `import { useState } from 'react';
import { Tree } from '@mfe/design-system';

export function Example() {
  const [selected, setSelected] = useState<React.Key | null>(null);

  return (
    <Tree
      title="Departmanlar"
      selectedKey={selected}
      onNodeSelect={setSelected}
      density="compact"
      nodes={[
        {
          key: 'muhendislik',
          label: 'Muhendislik',
          badges: ['24 kisi'],
          children: [
            { key: 'frontend', label: 'Frontend', meta: '8 kisi' },
            { key: 'backend', label: 'Backend', meta: '10 kisi' },
            { key: 'devops', label: 'DevOps', meta: '6 kisi' },
          ],
        },
        {
          key: 'tasarim',
          label: 'Tasarim',
          badges: ['12 kisi'],
          children: [
            { key: 'uiux', label: 'UI/UX', meta: '7 kisi' },
            { key: 'grafik', label: 'Grafik Tasarim', meta: '5 kisi' },
          ],
        },
      ]}
      defaultExpandedKeys={['muhendislik', 'tasarim']}
    />
  );
}`,
      previewProps: { density: "compact", defaultExpandedKeys: ["muhendislik", "tasarim"] },
      tags: ["secim", "select", "departman", "compact"],
    },
  ],
  AgGridServer: [
    {
      id: "aggridserver-basic",
      title: "Temel Sunucu Grid",
      description: "Sunucu tarafli veri kaynagi ile AG Grid kullanimi.",
      category: "basic",
      code: `import { AgGridServer } from '@mfe/design-system';

export function Example() {
  return (
    <AgGridServer
      columnDefs={[
        { field: 'ad', headerName: 'Ad Soyad', flex: 1 },
        { field: 'departman', headerName: 'Departman', flex: 1 },
        { field: 'durum', headerName: 'Durum', width: 120 },
      ]}
      getData={async (request) => ({
        rows: [
          { ad: 'Ahmet Yilmaz', departman: 'Muhendislik', durum: 'Aktif' },
          { ad: 'Ayse Demir', departman: 'Tasarim', durum: 'Aktif' },
        ],
        total: 2,
      })}
      height={400}
    />
  );
}`,
      previewProps: { height: 400 },
      tags: ["grid", "sunucu", "ag-grid", "veri"],
    },
    {
      id: "aggridserver-custom-cols",
      title: "Ozel Sutun Ayarlari",
      description: "Varsayilan sutun tanimlamalari ve grid ayarlari ile.",
      category: "advanced",
      code: `import { AgGridServer } from '@mfe/design-system';

export function Example() {
  return (
    <AgGridServer
      columnDefs={[
        { field: 'kod', headerName: 'Urun Kodu', width: 140, pinned: 'left' },
        { field: 'urunAdi', headerName: 'Urun Adi', flex: 2 },
        { field: 'fiyat', headerName: 'Fiyat', width: 120, type: 'numericColumn' },
        { field: 'stok', headerName: 'Stok', width: 100, type: 'numericColumn' },
      ]}
      defaultColDef={{ sortable: true, filter: true, resizable: true }}
      getData={async () => ({
        rows: [
          { kod: 'PRD-001', urunAdi: 'Laptop Pro 15', fiyat: 45000, stok: 24 },
          { kod: 'PRD-002', urunAdi: 'Kablosuz Klavye', fiyat: 1200, stok: 150 },
        ],
        total: 2,
      })}
      height={350}
    />
  );
}`,
      previewProps: { height: 350 },
      tags: ["grid", "sutun", "siralama", "filtre"],
    },
  ],
  EntityGridTemplate: [
    {
      id: "entitygrid-basic",
      title: "Temel Varlik Tablosu",
      description: "Sayfalama ve hizli filtre ile varlik listesi.",
      category: "basic",
      code: `import { EntityGridTemplate } from '@mfe/design-system';

export function Example() {
  return (
    <EntityGridTemplate
      gridId="personel-listesi"
      gridSchemaVersion={1}
      columnDefs={[
        { field: 'ad', headerName: 'Ad Soyad', flex: 1 },
        { field: 'unvan', headerName: 'Unvan', flex: 1 },
        { field: 'departman', headerName: 'Departman', flex: 1 },
      ]}
      rowData={[
        { ad: 'Mehmet Ozkan', unvan: 'Kidemli Gelistirici', departman: 'Muhendislik' },
        { ad: 'Zeynep Kaya', unvan: 'UX Tasarimci', departman: 'Tasarim' },
        { ad: 'Can Aksoy', unvan: 'DevOps Muhendisi', departman: 'Altyapi' },
      ]}
      total={3}
      page={1}
      pageSize={25}
    />
  );
}`,
      previewProps: { gridId: "personel-listesi", gridSchemaVersion: 1, page: 1, pageSize: 25 },
      tags: ["grid", "tablo", "varlik", "liste"],
    },
    {
      id: "entitygrid-toolbar",
      title: "Arac Cubugu ile Grid",
      description: "Tema secici, yogunluk degistirici ve disa aktarma secenekleri.",
      category: "advanced",
      code: `import { EntityGridTemplate } from '@mfe/design-system';

export function Example() {
  return (
    <EntityGridTemplate
      gridId="siparis-takip"
      gridSchemaVersion={2}
      columnDefs={[
        { field: 'siparisNo', headerName: 'Siparis No', width: 140 },
        { field: 'musteri', headerName: 'Musteri', flex: 1 },
        { field: 'tutar', headerName: 'Tutar', width: 120, type: 'numericColumn' },
        { field: 'durum', headerName: 'Durum', width: 130 },
      ]}
      rowData={[
        { siparisNo: 'SIP-2024-001', musteri: 'ABC Ltd.', tutar: 15400, durum: 'Tamamlandi' },
        { siparisNo: 'SIP-2024-002', musteri: 'XYZ A.S.', tutar: 28750, durum: 'Hazirlaniyor' },
      ]}
      total={2}
      page={1}
      pageSize={50}
      exportConfig={{ fileBaseName: 'siparisler', sheetName: 'Siparisler' }}
      quickFilterPlaceholder="Siparis ara..."
    />
  );
}`,
      previewProps: { gridId: "siparis-takip", gridSchemaVersion: 2, page: 1, pageSize: 50 },
      tags: ["grid", "arac-cubugu", "disa-aktarma", "filtre", "tema"],
    },
    {
      id: "entitygrid-server-mode",
      title: "Sunucu Tarafli Veri Modu",
      description: "Server-side datasource entegrasyonu ile buyuk veri seti yonetimi.",
      category: "advanced",
      code: `import { EntityGridTemplate } from '@mfe/design-system';

export function Example() {
  return (
    <EntityGridTemplate
      gridId="log-kayitlari"
      gridSchemaVersion={1}
      dataSourceMode="server"
      columnDefs={[
        { field: 'tarih', headerName: 'Tarih', width: 180 },
        { field: 'seviye', headerName: 'Seviye', width: 100 },
        { field: 'mesaj', headerName: 'Mesaj', flex: 2 },
        { field: 'kaynak', headerName: 'Kaynak', flex: 1 },
      ]}
      total={10000}
      page={1}
      pageSize={100}
      pageSizeOptions={[50, 100, 250]}
      messages={{ overlayLoadingLabel: 'Kayitlar yukleniyor...' }}
    />
  );
}`,
      previewProps: { gridId: "log-kayitlari", gridSchemaVersion: 1, dataSourceMode: "server", page: 1, pageSize: 100 },
      tags: ["grid", "sunucu", "server-side", "buyuk-veri"],
    },
  ],
  TableSimple: [
    {
      id: "tablesimple-basic",
      title: "Temel Statik Tablo",
      description: "Basit veri gosterimi icin hafif tablo bileseni.",
      category: "basic",
      code: `import { TableSimple } from '@mfe/design-system';

export function Example() {
  return (
    <TableSimple
      caption="Ekip Uyeleri"
      description="Aktif proje ekibindeki uyeler"
      columns={[
        { key: 'ad', label: 'Ad Soyad', emphasis: true },
        { key: 'rol', label: 'Rol' },
        { key: 'katilim', label: 'Katilim Tarihi' },
      ]}
      rows={[
        { ad: 'Ali Veli', rol: 'Frontend Gelistirici', katilim: '2024-01-15' },
        { ad: 'Fatma Sahin', rol: 'Backend Gelistirici', katilim: '2024-03-20' },
        { ad: 'Emre Yildiz', rol: 'QA Muhendisi', katilim: '2024-06-01' },
      ]}
    />
  );
}`,
      previewProps: {},
      tags: ["tablo", "statik", "liste", "basit"],
    },
    {
      id: "tablesimple-compact",
      title: "Siki Yogunluk Tablosu",
      description: "Compact yoğunluk ve yapışkan başlık ile.",
      category: "layout",
      code: `import { TableSimple } from '@mfe/design-system';

export function Example() {
  return (
    <TableSimple
      caption="Son Islemler"
      density="compact"
      stickyHeader
      striped
      columns={[
        { key: 'tarih', label: 'Tarih', width: '120px' },
        { key: 'islem', label: 'Islem', emphasis: true },
        { key: 'tutar', label: 'Tutar', align: 'right' },
        { key: 'durum', label: 'Durum', align: 'center' },
      ]}
      rows={[
        { tarih: '2024-12-01', islem: 'Satis #1042', tutar: '12.500 TL', durum: 'Tamamlandi' },
        { tarih: '2024-12-02', islem: 'Iade #203', tutar: '-2.100 TL', durum: 'Isleniyor' },
        { tarih: '2024-12-03', islem: 'Satis #1043', tutar: '8.750 TL', durum: 'Tamamlandi' },
      ]}
    />
  );
}`,
      previewProps: { density: "compact", stickyHeader: true, striped: true },
      tags: ["tablo", "compact", "yapiskan", "yogunluk"],
    },
    {
      id: "tablesimple-loading",
      title: "Yukleniyor Durumu",
      description: "Skeleton placeholder ile veri yukleme durumu.",
      category: "patterns",
      code: `import { TableSimple } from '@mfe/design-system';

export function Example() {
  return (
    <TableSimple
      caption="Envanter Raporu"
      loading
      columns={[
        { key: 'urun', label: 'Urun' },
        { key: 'kategori', label: 'Kategori' },
        { key: 'stok', label: 'Stok', align: 'right' },
      ]}
      rows={[]}
    />
  );
}`,
      previewProps: { loading: true },
      tags: ["tablo", "yukleniyor", "skeleton", "bekleme"],
    },
  ],
  EntitySummaryBlock: [
    {
      id: "entitysummary-basic",
      title: "Temel Varlik Ozeti",
      description: "Avatar, baslik ve anahtar-deger cifti ile varlik ozet karti.",
      category: "basic",
      code: `import { EntitySummaryBlock } from '@mfe/design-system';

export function Example() {
  return (
    <EntitySummaryBlock
      title="Ahmet Yilmaz"
      subtitle="Kidemli Yazilim Muhendisi - Muhendislik Departmani"
      avatar={{ name: 'Ahmet Yilmaz', alt: 'AY' }}
      items={[
        { label: 'E-posta', value: 'ahmet.yilmaz@sirket.com' },
        { label: 'Telefon', value: '+90 532 123 4567' },
        { label: 'Konum', value: 'Istanbul, Turkiye' },
        { label: 'Baslangic', value: '15 Ocak 2022' },
      ]}
    />
  );
}`,
      previewProps: {},
      tags: ["ozet", "kart", "avatar", "profil"],
    },
    {
      id: "entitysummary-with-badge-actions",
      title: "Rozet ve Aksiyonlu Ozet",
      description: "Durum rozeti ve eylem butonlari ile zenginlestirilmis ozet.",
      category: "advanced",
      code: `import { EntitySummaryBlock } from '@mfe/design-system';
import { Button } from '@mfe/design-system';

export function Example() {
  return (
    <EntitySummaryBlock
      title="PRJ-2024-Alpha"
      subtitle="Musteri portali modernizasyon projesi"
      badge={<span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">Aktif</span>}
      actions={
        <div className="flex gap-2">
          <Button size="sm" variant="secondary">Duzenle</Button>
          <Button size="sm" variant="primary">Detaylar</Button>
        </div>
      }
      items={[
        { label: 'Proje Yoneticisi', value: 'Selin Kara' },
        { label: 'Baslangic', value: '01 Mart 2024' },
        { label: 'Hedef Bitis', value: '30 Eylul 2024' },
        { label: 'Butce', value: '1.250.000 TL' },
        { label: 'Ilerleme', value: '%68 tamamlandi' },
        { label: 'Ekip Buyuklugu', value: '12 kisi' },
      ]}
    />
  );
}`,
      previewProps: {},
      tags: ["ozet", "rozet", "aksiyon", "proje", "durum"],
    },
  ],
  ReportFilterPanel: [
    {
      id: "reportfilter-basic",
      title: "Temel Filtre Paneli",
      description: "Yatay filtre formu ile gonder ve sifirla butonlari.",
      category: "form",
      code: `import { ReportFilterPanel } from '@mfe/design-system';

export function Example() {
  return (
    <ReportFilterPanel
      submitLabel="Filtrele"
      resetLabel="Sifirla"
      onSubmit={() => console.log('Filtre uygulandi')}
      onReset={() => console.log('Filtreler sifirlandi')}
    >
      <input
        type="text"
        placeholder="Urun adi..."
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
      />
      <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
        <option value="">Kategori secin</option>
        <option value="elektronik">Elektronik</option>
        <option value="giyim">Giyim</option>
      </select>
    </ReportFilterPanel>
  );
}`,
      previewProps: { submitLabel: "Filtrele", resetLabel: "Sifirla" },
      tags: ["filtre", "form", "rapor", "arama"],
    },
    {
      id: "reportfilter-loading",
      title: "Yukleniyor Durumlu Filtre",
      description: "Veri cekilirken devre disi butonlar ile filtre paneli.",
      category: "form",
      code: `import { ReportFilterPanel } from '@mfe/design-system';

export function Example() {
  return (
    <ReportFilterPanel
      loading
      submitLabel="Yukleniyor..."
      resetLabel="Sifirla"
      onSubmit={() => {}}
      onReset={() => {}}
    >
      <input
        type="date"
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        defaultValue="2024-01-01"
      />
      <input
        type="date"
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        defaultValue="2024-12-31"
      />
      <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
        <option value="">Tum durumlar</option>
        <option value="aktif">Aktif</option>
        <option value="pasif">Pasif</option>
      </select>
    </ReportFilterPanel>
  );
}`,
      previewProps: { loading: true },
      tags: ["filtre", "yukleniyor", "devre-disi", "rapor"],
    },
    {
      id: "reportfilter-readonly",
      title: "Salt Okunur Filtre Paneli",
      description: "Erisim kontrolu ile salt okunur modda filtre paneli.",
      category: "advanced",
      code: `import { ReportFilterPanel } from '@mfe/design-system';

export function Example() {
  return (
    <ReportFilterPanel
      access="readonly"
      accessReason="Bu rapor filtreleri degistirilemez"
      submitLabel="Filtrele"
      resetLabel="Sifirla"
      onSubmit={() => {}}
      onReset={() => {}}
    >
      <input
        type="text"
        placeholder="Calisan adi..."
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
      />
      <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
        <option value="muhendislik">Muhendislik</option>
      </select>
    </ReportFilterPanel>
  );
}`,
      previewProps: { access: "readonly", accessReason: "Bu rapor filtreleri degistirilemez" },
      tags: ["filtre", "salt-okunur", "erisim", "readonly"],
    },
  ],
  DetailSectionTabs: [
    {
      id: "detailsectiontabs-basic",
      title: "Temel Detay Sekmeleri",
      description: "Detay sayfasi icin bolum sekmeleri.",
      category: "basic",
      code: `import { useState } from 'react';
import { DetailSectionTabs } from '@mfe/design-system';

export function Example() {
  const [activeTab, setActiveTab] = useState('genel');

  return (
    <DetailSectionTabs
      activeTabId={activeTab}
      onTabChange={setActiveTab}
      tabs={[
        { id: 'genel', label: 'Genel Bilgiler' },
        { id: 'iletisim', label: 'Iletisim' },
        { id: 'dosyalar', label: 'Dosyalar', badge: '12' },
        { id: 'notlar', label: 'Notlar' },
      ]}
    />
  );
}`,
      previewProps: { activeTabId: "genel" },
      tags: ["sekme", "detay", "navigasyon", "bolum"],
    },
    {
      id: "detailsectiontabs-with-badges",
      title: "Rozetli Detay Sekmeleri",
      description: "Her sekmede sayi rozeti ve devre disi durumu ile.",
      category: "advanced",
      code: `import { useState } from 'react';
import { DetailSectionTabs } from '@mfe/design-system';

export function Example() {
  const [activeTab, setActiveTab] = useState('siparisler');

  return (
    <DetailSectionTabs
      activeTabId={activeTab}
      onTabChange={setActiveTab}
      density="comfortable"
      tabs={[
        { id: 'siparisler', label: 'Siparisler', badge: '24', description: 'Acik ve kapali tum siparisler' },
        { id: 'faturalar', label: 'Faturalar', badge: '8' },
        { id: 'iadeler', label: 'Iadeler', badge: '3', description: 'Iade talepleri ve durumlari' },
        { id: 'arsiv', label: 'Arsiv', disabled: true },
      ]}
    />
  );
}`,
      previewProps: { activeTabId: "siparisler", density: "comfortable" },
      tags: ["sekme", "rozet", "sayi", "devre-disi"],
    },
  ],
  SectionTabs: [
    {
      id: "sectiontabs-basic",
      title: "Temel Bolum Sekmeleri",
      description: "Yatay bolum navigasyonu icin segmented sekme bileseni.",
      category: "basic",
      code: `import { useState } from 'react';
import { SectionTabs } from '@mfe/design-system';

export function Example() {
  const [value, setValue] = useState('genel');

  return (
    <SectionTabs
      value={value}
      onValueChange={setValue}
      ariaLabel="Sayfa bolumleri"
      items={[
        { value: 'genel', label: 'Genel' },
        { value: 'ayarlar', label: 'Ayarlar' },
        { value: 'guvenlik', label: 'Guvenlik' },
        { value: 'bildirimler', label: 'Bildirimler' },
      ]}
    />
  );
}`,
      previewProps: { value: "genel" },
      tags: ["sekme", "bolum", "navigasyon", "segmented"],
    },
    {
      id: "sectiontabs-with-descriptions",
      title: "Aciklamali Sekmeler",
      description: "Tooltip ile aciklama gosterimi ve rozet destegi.",
      category: "advanced",
      code: `import { useState } from 'react';
import { SectionTabs } from '@mfe/design-system';

export function Example() {
  const [value, setValue] = useState('performans');

  return (
    <SectionTabs
      value={value}
      onValueChange={setValue}
      ariaLabel="Dashboard bolumleri"
      density="comfortable"
      descriptionDisplay="tooltip"
      descriptionVisibility="hover"
      items={[
        { value: 'performans', label: 'Performans', description: 'Sistem performans metrikleri', badge: '3' },
        { value: 'kullanici', label: 'Kullanicilar', description: 'Aktif kullanici istatistikleri', badge: '1.2K' },
        { value: 'hatalar', label: 'Hatalar', description: 'Hata loglari ve uyarilar', badge: '7' },
        { value: 'denetim', label: 'Denetim', description: 'Denetim kayitlari ve izleme' },
      ]}
    />
  );
}`,
      previewProps: { value: "performans", density: "comfortable", descriptionDisplay: "tooltip", descriptionVisibility: "hover" },
      tags: ["sekme", "aciklama", "tooltip", "rozet", "dashboard"],
    },
    {
      id: "sectiontabs-wrap-layout",
      title: "Saran Yerlesim Modu",
      description: "Otomatik satiralti gecis ile genis icerik sekmeleri.",
      category: "layout",
      code: `import { useState } from 'react';
import { SectionTabs } from '@mfe/design-system';

export function Example() {
  const [value, setValue] = useState('urunler');

  return (
    <SectionTabs
      value={value}
      onValueChange={setValue}
      ariaLabel="Katalog bolumleri"
      layout="wrap"
      items={[
        { value: 'urunler', label: 'Urunler', badge: '256' },
        { value: 'kategoriler', label: 'Kategoriler', badge: '18' },
        { value: 'markalar', label: 'Markalar', badge: '42' },
        { value: 'kampanyalar', label: 'Kampanyalar', badge: '5' },
        { value: 'stok', label: 'Stok Yonetimi' },
        { value: 'fiyatlandirma', label: 'Fiyatlandirma' },
      ]}
    />
  );
}`,
      previewProps: { value: "urunler", layout: "wrap" },
      tags: ["sekme", "saran", "wrap", "responsive"],
    },
  ],
  ActionBar: [
    {
      id: "actionbar-basic",
      title: "Temel Aksiyon Cubugu",
      description: "Toplu islem butonlari ile secim odakli aksiyon cubugu.",
      category: "basic",
      code: `import { MenuBar } from '@mfe/design-system';

export function Example() {
  return (
    <MenuBar
      size="sm"
      appearance="outline"
      items={[
        { value: 'onayla', label: 'Onayla', icon: '\\u2713' },
        { value: 'reddet', label: 'Reddet', icon: '\\u2717' },
        { value: 'sil', label: 'Sil', icon: '\\ud83d\\uddd1' },
      ]}
      onAction={(value) => console.log('Aksiyon:', value)}
    />
  );
}`,
      previewProps: { size: "sm", appearance: "outline" },
      tags: ["aksiyon", "cubuk", "toplu-islem", "menubar"],
    },
    {
      id: "actionbar-selection-driven",
      title: "Secim Odakli Islemler",
      description: "Secili kayit sayisi rozetli toplu islem arabirimi.",
      category: "advanced",
      code: `import { MenuBar } from '@mfe/design-system';

export function Example() {
  return (
    <MenuBar
      size="sm"
      appearance="ghost"
      items={[
        { value: 'secim', label: '3 kayit secili', badge: '3', group: 'utility', emphasis: 'promoted' },
        { value: 'duzenle', label: 'Toplu Duzenle', group: 'primary' },
        { value: 'tasi', label: 'Tasi', group: 'primary' },
        { value: 'arsivle', label: 'Arsivle', group: 'secondary' },
        { value: 'sil', label: 'Sil', group: 'secondary', emphasis: 'subtle' },
      ]}
      onAction={(value) => console.log('Toplu islem:', value)}
    />
  );
}`,
      previewProps: { size: "sm", appearance: "ghost" },
      tags: ["aksiyon", "toplu", "secim", "rozet", "grup"],
    },
    {
      id: "actionbar-readonly",
      title: "Salt Okunur Mod",
      description: "Governance akisinda salt okunur aksiyon cubugu.",
      category: "patterns",
      code: `import { MenuBar } from '@mfe/design-system';

export function Example() {
  return (
    <MenuBar
      size="sm"
      appearance="outline"
      access="readonly"
      accessReason="Bu kayitlar uzerinde islem yetkiniz bulunmamaktadir"
      items={[
        { value: 'onayla', label: 'Onayla' },
        { value: 'reddet', label: 'Reddet' },
        { value: 'devret', label: 'Devret' },
      ]}
      onAction={() => {}}
    />
  );
}`,
      previewProps: { size: "sm", appearance: "outline", access: "readonly" },
      tags: ["aksiyon", "salt-okunur", "readonly", "governance"],
    },
  ],
  ApprovalReview: [
    {
      id: "approval-review-basic",
      title: "Temel Onay Inceleme",
      description: "Checkpoint, atif paneli ve denetim izlerini birlestiren temel inceleme gorunumu.",
      category: "basic",
      code: `import { ApprovalReview } from '@mfe/design-system';

export function Example() {
  return (
    <ApprovalReview
      title="Yayinlama Onayi"
      description="Insan checkpoint, kaynak kanit ve denetim izleri tek review altinda gorunur."
      checkpoint={{
        title: "Uretim ortamina yayinla",
        summary: "Son degisiklikler icin insan onayi gerekli.",
        status: "pending",
        steps: [
          { key: "1", label: "Kod inceleme", status: "approved" },
          { key: "2", label: "QA testi", status: "ready" },
        ],
      }}
      citations={[
        { id: "c1", title: "API Politikasi", excerpt: "Tum endpoint'ler rate-limit gerektirir.", source: "platform-policy.md", kind: "policy" },
        { id: "c2", title: "Test Raporu", excerpt: "176 testin tamami basarili.", source: "ci/test-report", kind: "doc" },
      ]}
      auditItems={[
        { id: "a1", actor: "ai", title: "Otomatik kod analizi", timestamp: "10:30", status: "executed" },
        { id: "a2", actor: "human", title: "Takim liderinden onay", timestamp: "11:15", status: "approved" },
      ]}
    />
  );
}`,
      previewProps: {},
      tags: ["onay", "inceleme", "checkpoint", "atif", "denetim"],
    },
    {
      id: "approval-review-readonly",
      title: "Salt Okunur Inceleme",
      description: "Erisim kisitlama ile salt okunur modda inceleme paneli.",
      category: "patterns",
      code: `import { ApprovalReview } from '@mfe/design-system';

export function Example() {
  return (
    <ApprovalReview
      title="Arsiv Inceleme"
      description="Tamamlanmis onay sureci salt okunur olarak goruntulenir."
      access="readonly"
      accessReason="Bu kayit arsivlenmistir"
      checkpoint={{
        title: "Uretim yayini",
        summary: "Basariyla tamamlandi.",
        status: "approved",
      }}
      citations={[
        { id: "c1", title: "Yayin Notu", excerpt: "v2.4.1 basariyla yayinlandi.", source: "releases/v2.4.1", kind: "doc" },
      ]}
      auditItems={[
        { id: "a1", actor: "system", title: "Otomatik deploy", timestamp: "14:00", status: "executed" },
      ]}
    />
  );
}`,
      previewProps: { access: "readonly" },
      tags: ["onay", "salt-okunur", "arsiv", "readonly"],
    },
  ],
  ApprovalCheckpoint: [
    {
      id: "checkpoint-basic",
      title: "Temel Onay Noktasi",
      description: "Durum, adimlar ve aksiyonlarla temel kontrol noktasi.",
      category: "basic",
      code: `import { ApprovalCheckpoint } from '@mfe/design-system';

export function Example() {
  return (
    <ApprovalCheckpoint
      title="Uretim Yayini Onayi"
      summary="Son degisiklikler icin insan onayi gereklidir."
      status="pending"
      approverLabel="Platform Ekibi"
      dueLabel="15 Mart 2026"
      evidenceItems={["test-report.pdf", "coverage.html"]}
      steps={[
        { key: "1", label: "Kod inceleme tamamlandi", status: "approved" },
        { key: "2", label: "QA testi", status: "ready" },
        { key: "3", label: "Guvenlik taramasi", status: "todo" },
      ]}
      primaryActionLabel="Onayla"
      secondaryActionLabel="Inceleme Iste"
    />
  );
}`,
      previewProps: { status: "pending" },
      tags: ["onay", "kontrol-noktasi", "adim", "durum"],
    },
    {
      id: "checkpoint-approved",
      title: "Onaylanmis Durum",
      description: "Tum adimlar tamamlanmis onaylanmis kontrol noktasi.",
      category: "basic",
      code: `import { ApprovalCheckpoint } from '@mfe/design-system';

export function Example() {
  return (
    <ApprovalCheckpoint
      title="API Gateway Degisikligi"
      summary="Tum kontroller basariyla tamamlandi."
      status="approved"
      steps={[
        { key: "1", label: "Kod inceleme", status: "approved" },
        { key: "2", label: "Entegrasyon testi", status: "approved" },
      ]}
      citations={["RFC-2024-03", "SEC-AUDIT-44"]}
      footerNote="Onay: 15 Mart 2026, 14:30"
    />
  );
}`,
      previewProps: { status: "approved" },
      tags: ["onay", "onaylanmis", "tamamlanmis"],
    },
    {
      id: "checkpoint-blocked",
      title: "Engellenmi\u015f Durum",
      description: "Eksik adimlar nedeniyle engellenmis kontrol noktasi.",
      category: "advanced",
      code: `import { ApprovalCheckpoint } from '@mfe/design-system';

export function Example() {
  return (
    <ApprovalCheckpoint
      title="Hassas Veri Erisimi"
      summary="Guvenlik taramasi basarisiz oldu."
      status="blocked"
      steps={[
        { key: "1", label: "Guvenlik taramasi", status: "blocked", helper: "3 kritik bulgu" },
        { key: "2", label: "DPO onayi", status: "todo" },
      ]}
      primaryActionLabel="Tekrar Tara"
      secondaryActionLabel="Rapor Gor"
    />
  );
}`,
      previewProps: { status: "blocked" },
      tags: ["onay", "engellenmis", "guvenlik", "blocked"],
    },
  ],
  AIGuidedAuthoring: [
    {
      id: "ai-authoring-basic",
      title: "Temel AI Yazarlik",
      description: "Prompt, oneriler ve guven skoruyla temel AI yazarlik paneli.",
      category: "basic",
      code: `import { AIGuidedAuthoring } from '@mfe/design-system';

export function Example() {
  return (
    <AIGuidedAuthoring
      title="AI Destekli Icerik Olusturma"
      confidenceLevel="high"
      confidenceScore={87}
      sourceCount={12}
      promptComposerProps={{
        defaultSubject: "API dokumantasyonu",
        defaultValue: "Kullanici kimlik dogrulama endpoint'leri icin kapsamli dokumantasyon olustur.",
        defaultScope: "general",
        defaultTone: "neutral",
        guardrails: ["PII filtreleme", "Marka uyumu"],
      }}
      recommendations={[
        {
          id: "r1",
          title: "Ornek kod ekle",
          summary: "Her endpoint icin curl ornekleri eklenebilir.",
          confidenceLevel: "high",
          confidenceScore: 92,
          rationale: ["Kullanici geri bildirimi yuksek", "Benzer dokumanlarda basarili"],
        },
      ]}
    />
  );
}`,
      previewProps: { confidenceLevel: "high", confidenceScore: 87 },
      tags: ["ai", "yazarlik", "prompt", "oneri", "guven"],
    },
    {
      id: "ai-authoring-command-palette",
      title: "Komut Paleti ile Yazarlik",
      description: "Komut paleti entegrasyonu ile AI yazarlik akisi.",
      category: "advanced",
      code: `import { AIGuidedAuthoring } from '@mfe/design-system';

export function Example() {
  return (
    <AIGuidedAuthoring
      title="Politika Yazarlik Asistani"
      confidenceLevel="medium"
      confidenceScore={64}
      sourceCount={5}
      promptComposerProps={{
        defaultScope: "policy",
        defaultTone: "strict",
      }}
      commandItems={[
        { id: "cmd1", label: "Kaynak Ekle", description: "Mevcut kaynaktan referans al" },
        { id: "cmd2", label: "Ton Degistir", description: "Yazim tonunu ayarla" },
        { id: "cmd3", label: "Sablon Uygula", description: "Politika sablonu uygula" },
      ]}
      defaultPaletteOpen={false}
    />
  );
}`,
      previewProps: { confidenceLevel: "medium" },
      tags: ["ai", "komut-paleti", "politika", "command-palette"],
    },
  ],
  AIActionAuditTimeline: [
    {
      id: "audit-timeline-basic",
      title: "Temel Denetim Zaman Cizelgesi",
      description: "AI ve insan aksiyonlarini kronolojik olarak gosteren zaman cizelgesi.",
      category: "basic",
      code: `import { AIActionAuditTimeline } from '@mfe/design-system';

export function Example() {
  return (
    <AIActionAuditTimeline
      title="Islem Gecmisi"
      items={[
        { id: "1", actor: "ai", title: "Icerik taslagi olusturuldu", timestamp: "09:15", status: "drafted", summary: "AI modeli ilk taslagi hazirladi." },
        { id: "2", actor: "human", title: "Icerik incelendi", timestamp: "10:30", status: "approved", summary: "Editorden onay alindi." },
        { id: "3", actor: "system", title: "Yayinlama islemi baslatildi", timestamp: "11:00", status: "executed" },
      ]}
    />
  );
}`,
      previewProps: {},
      tags: ["denetim", "zaman-cizelgesi", "ai", "audit", "timeline"],
    },
    {
      id: "audit-timeline-selected",
      title: "Secili Oge ile Zaman Cizelgesi",
      description: "Belirli bir denetim kaydinin secili oldugu gorunum.",
      category: "advanced",
      code: `import { AIActionAuditTimeline } from '@mfe/design-system';

export function Example() {
  return (
    <AIActionAuditTimeline
      title="Onay Sureci Izleri"
      selectedId="2"
      items={[
        { id: "1", actor: "ai", title: "Risk analizi tamamlandi", timestamp: "08:00", status: "executed" },
        { id: "2", actor: "human", title: "Manuel inceleme", timestamp: "09:30", status: "approved", summary: "Guvenlik ekibi onayladi." },
        { id: "3", actor: "ai", title: "Otomatik deploy", timestamp: "10:00", status: "observed" },
      ]}
      onSelectItem={(id) => console.log('Secilen:', id)}
    />
  );
}`,
      previewProps: { selectedId: "2" },
      tags: ["denetim", "secim", "detay", "izleme"],
    },
    {
      id: "audit-timeline-empty",
      title: "Bos Zaman Cizelgesi",
      description: "Henuz denetim kaydi bulunmayan bos durum gorunumu.",
      category: "basic",
      code: `import { AIActionAuditTimeline } from '@mfe/design-system';

export function Example() {
  return (
    <AIActionAuditTimeline
      title="Islem Gecmisi"
      items={[]}
      emptyStateLabel="Henuz islem kaydi bulunmuyor."
    />
  );
}`,
      previewProps: {},
      tags: ["denetim", "bos", "empty-state"],
    },
  ],
  PromptComposer: [
    {
      id: "prompt-composer-basic",
      title: "Temel Prompt Duzenleyici",
      description: "Kapsam, ton ve koruma kurallariyla prompt yazim paneli.",
      category: "basic",
      code: `import { PromptComposer } from '@mfe/design-system';

export function Example() {
  return (
    <PromptComposer
      title="Prompt Olusturucu"
      defaultSubject="Musteri destek sablonu"
      defaultValue="Musteri sikayet e-postalarina profesyonel ve empatik yanit taslagi olustur."
      defaultScope="general"
      defaultTone="neutral"
      guardrails={["PII koruma", "Marka tonu"]}
      citations={["destek-rehberi.md", "marka-kilavuzu.pdf"]}
    />
  );
}`,
      previewProps: { defaultScope: "general", defaultTone: "neutral" },
      tags: ["prompt", "duzenleyici", "kapsam", "ton"],
    },
    {
      id: "prompt-composer-policy",
      title: "Politika Kapsaminda Prompt",
      description: "Politika kapsaminda siki ton ile prompt yazimi.",
      category: "advanced",
      code: `import { PromptComposer } from '@mfe/design-system';

export function Example() {
  return (
    <PromptComposer
      title="Politika Prompt Yazici"
      defaultSubject="Veri saklama politikasi"
      defaultValue="KVKK uyumlu veri saklama politikasi taslagi hazirla."
      defaultScope="policy"
      defaultTone="strict"
      maxLength={2000}
      guardrails={["KVKK uyumu", "Veri siniflandirma", "Saklama suresi"]}
      citations={["kvkk-rehber.pdf", "veri-politikasi-v3.md"]}
      footerNote="Politika prompt'lari hukuk ekibi tarafindan incelenmelidir."
    />
  );
}`,
      previewProps: { defaultScope: "policy", defaultTone: "strict" },
      tags: ["prompt", "politika", "kvkk", "uyumluluk"],
    },
    {
      id: "prompt-composer-readonly",
      title: "Salt Okunur Prompt",
      description: "Onaylanmis prompt'un salt okunur gorunumu.",
      category: "patterns",
      code: `import { PromptComposer } from '@mfe/design-system';

export function Example() {
  return (
    <PromptComposer
      title="Onaylanmis Prompt"
      defaultSubject="Uretim talimat seti"
      defaultValue="Bu prompt onaylanmistir ve degistirilemez."
      access="readonly"
      accessReason="Bu prompt onay surecinden gecmistir"
      guardrails={["Degisiklik kilidi"]}
    />
  );
}`,
      previewProps: { access: "readonly" },
      tags: ["prompt", "salt-okunur", "onaylanmis", "readonly"],
    },
  ],
  RecommendationCard: [
    {
      id: "recommendation-basic",
      title: "Temel Oneri Karti",
      description: "Guven skoru, gerekce ve aksiyonlarla oneri karti.",
      category: "basic",
      code: `import { RecommendationCard } from '@mfe/design-system';

export function Example() {
  return (
    <RecommendationCard
      title="Onbellek Stratejisi Ekle"
      summary="API yanit surelerini %40 azaltmak icin Redis onbellek katmani onerilir."
      confidenceLevel="high"
      confidenceScore={91}
      sourceCount={8}
      rationale={[
        "Benzer sistemlerde %35-45 iyilesme gozlemlendi",
        "Mevcut altyapi Redis destekliyor",
        "Operasyonel maliyet dusuk",
      ]}
      citations={["perf-benchmark-2024.pdf", "infra-capacity.md"]}
      primaryActionLabel="Uygula"
      secondaryActionLabel="Incele"
    />
  );
}`,
      previewProps: { tone: "info", confidenceLevel: "high" },
      tags: ["oneri", "kart", "guven", "gerekce"],
    },
    {
      id: "recommendation-warning",
      title: "Uyari Tonunda Oneri",
      description: "Dikkat gerektiren bir oneri karti.",
      category: "advanced",
      code: `import { RecommendationCard } from '@mfe/design-system';

export function Example() {
  return (
    <RecommendationCard
      title="Bagimliligi Guncelle"
      summary="lodash@4.17.20 bilinen guvenlik acigi iceriyor."
      tone="warning"
      confidenceLevel="very-high"
      confidenceScore={98}
      sourceCount={3}
      rationale={[
        "CVE-2021-23337 prototype pollution acigi",
        "Guncelleme geriye uyumlu",
      ]}
      primaryActionLabel="Simdi Guncelle"
      secondaryActionLabel="Raporu Gor"
    />
  );
}`,
      previewProps: { tone: "warning", confidenceLevel: "very-high" },
      tags: ["oneri", "uyari", "guvenlik", "bagimllik"],
    },
    {
      id: "recommendation-compact",
      title: "Kompakt Oneri Karti",
      description: "Dar alanlarda kullanilabilecek kompakt oneri gorunumu.",
      category: "layout",
      code: `import { RecommendationCard } from '@mfe/design-system';

export function Example() {
  return (
    <RecommendationCard
      title="Index Onerisi"
      summary="users tablosuna email kolonu icin index ekleyin."
      tone="success"
      confidenceLevel="medium"
      confidenceScore={72}
      compact
    />
  );
}`,
      previewProps: { tone: "success", compact: true },
      tags: ["oneri", "kompakt", "minimal"],
    },
  ],
  ConfidenceBadge: [
    {
      id: "confidence-basic",
      title: "Temel Guven Rozeti",
      description: "Farkli guven seviyelerini gosteren rozetler.",
      category: "basic",
      code: `import { ConfidenceBadge } from '@mfe/design-system';

export function Example() {
  return (
    <div className="flex flex-wrap gap-3">
      <ConfidenceBadge level="low" score={25} sourceCount={2} />
      <ConfidenceBadge level="medium" score={58} sourceCount={5} />
      <ConfidenceBadge level="high" score={87} sourceCount={12} />
      <ConfidenceBadge level="very-high" score={96} sourceCount={20} />
    </div>
  );
}`,
      previewProps: { level: "medium", score: 58 },
      multiVariantAxis: "level",
      tags: ["guven", "rozet", "seviye", "skor"],
    },
    {
      id: "confidence-compact",
      title: "Kompakt Guven Rozeti",
      description: "Kaynak sayisi gizlenmis kompakt gorunum.",
      category: "layout",
      code: `import { ConfidenceBadge } from '@mfe/design-system';

export function Example() {
  return (
    <div className="flex flex-wrap gap-3">
      <ConfidenceBadge level="high" score={89} compact />
      <ConfidenceBadge level="medium" score={55} compact />
    </div>
  );
}`,
      previewProps: { level: "high", score: 89, compact: true },
      tags: ["guven", "kompakt", "rozet"],
    },
    {
      id: "confidence-custom-label",
      title: "Ozel Etiketli Rozet",
      description: "Ozel etiket ile guven rozeti kullanimi.",
      category: "advanced",
      code: `import { ConfidenceBadge } from '@mfe/design-system';

export function Example() {
  return (
    <ConfidenceBadge
      level="high"
      score={94}
      sourceCount={15}
      label="Model Dogrulugu"
    />
  );
}`,
      previewProps: { level: "high", score: 94, label: "Model Dogrulugu" },
      tags: ["guven", "ozel-etiket", "model"],
    },
  ],
  CitationPanel: [
    {
      id: "citation-panel-basic",
      title: "Temel Atif Paneli",
      description: "Farkli kaynak turlerini gosteren atif paneli.",
      category: "basic",
      code: `import { CitationPanel } from '@mfe/design-system';

export function Example() {
  return (
    <CitationPanel
      title="Kaynaklar"
      items={[
        { id: "c1", title: "Platform Politikasi", excerpt: "Tum API endpoint'leri rate-limit ile korunmalidir.", source: "platform-policy.md", kind: "policy" },
        { id: "c2", title: "Servis Kodu", excerpt: "RateLimiter middleware her route'a eklenmistir.", source: "src/middleware/rate-limiter.ts", kind: "code", locator: "satir 42-58" },
        { id: "c3", title: "Erisim Logu", excerpt: "Son 24 saatte 3 rate-limit ihlali tespit edildi.", source: "logs/access-2026-03.log", kind: "log" },
      ]}
    />
  );
}`,
      previewProps: {},
      tags: ["atif", "kaynak", "panel", "politika", "kod"],
    },
    {
      id: "citation-panel-interactive",
      title: "Etkilesimli Atif Paneli",
      description: "Atif secimi ve aktif durum yonetimiyle etkilesimli panel.",
      category: "advanced",
      code: `import { CitationPanel } from '@mfe/design-system';

export function Example() {
  return (
    <CitationPanel
      title="Kanit Seti"
      activeCitationId="c2"
      onOpenCitation={(id, item) => console.log('Atif secildi:', id)}
      items={[
        { id: "c1", title: "Tasarim Dokumani", excerpt: "Komponent hiyerarsisi ve veri akisi.", source: "design-spec.md", kind: "doc" },
        { id: "c2", title: "Test Verisi", excerpt: "Model egitim seti icin kullanilan veri kumesi.", source: "datasets/training-v3", kind: "dataset" },
        { id: "c3", title: "Uyumluluk Raporu", excerpt: "KVKK madde 12 gereklilikleri karsilanmistir.", source: "compliance/kvkk-report.pdf", kind: "policy" },
      ]}
    />
  );
}`,
      previewProps: { activeCitationId: "c2" },
      tags: ["atif", "etkilesim", "secim", "aktif"],
    },
    {
      id: "citation-panel-empty",
      title: "Bos Atif Paneli",
      description: "Henuz kaynak eklenmemis bos durum gorunumu.",
      category: "basic",
      code: `import { CitationPanel } from '@mfe/design-system';

export function Example() {
  return (
    <CitationPanel
      title="Kaynaklar"
      items={[]}
      emptyStateLabel="Henuz kaynak eklenmedi."
    />
  );
}`,
      previewProps: {},
      tags: ["atif", "bos", "empty-state"],
    },
  ],
  CommandHeader: [
    {
      id: "cmd-header-basic",
      title: "Temel Komut Başlığı",
      description: "Arama alanı ve menü öğeleri içeren varsayılan komut başlığı.",
      category: "basic",
      code: `import { MenuBar } from '@mfe/design-system';

export function Example() {
  return (
    <MenuBar
      items={[
        { key: 'dashboard', label: 'Dashboard' },
        { key: 'reports', label: 'Raporlar' },
        { key: 'settings', label: 'Ayarlar' },
      ]}
      searchPlaceholder="Komut ara..."
    />
  );
}`,
      previewProps: {},
      tags: ["arama", "navigasyon", "komut"],
    },
    {
      id: "cmd-header-favorites",
      title: "Favoriler ile Komut Başlığı",
      description: "Son kullanılanlar ve favori kısayolları gösteren komut başlığı.",
      category: "advanced",
      code: `import { MenuBar } from '@mfe/design-system';

export function Example() {
  return (
    <MenuBar
      items={[
        { key: 'dashboard', label: 'Dashboard', isFavorite: true },
        { key: 'reports', label: 'Raporlar' },
        { key: 'users', label: 'Kullanıcılar', isFavorite: true },
      ]}
      searchPlaceholder="Hızlı erişim..."
      showRecents
    />
  );
}`,
      previewProps: {},
      tags: ["favori", "son-kullanilanlar", "kisayol"],
    },
    {
      id: "cmd-header-submenu",
      title: "Alt Menü Aksiyonları",
      description: "Zengin alt menü metadata ile derinlemesine navigasyon.",
      category: "patterns",
      code: `import { MenuBar } from '@mfe/design-system';

export function Example() {
  return (
    <MenuBar
      items={[
        {
          key: 'operations',
          label: 'Operasyonlar',
          children: [
            { key: 'batch', label: 'Toplu İşlem' },
            { key: 'export', label: 'Dışa Aktar' },
          ],
        },
      ]}
      searchPlaceholder="Komut ara..."
    />
  );
}`,
      previewProps: {},
      tags: ["alt-menu", "navigasyon", "operasyon"],
    },
  ],
  CommandWorkspace: [
    {
      id: "cmd-workspace-basic",
      title: "Temel Komut Çalışma Alanı",
      description: "Arama odaklı komut yüzeyi ile sonuç paneli.",
      category: "basic",
      code: `import { PageLayout, FilterBar, TableSimple } from '@mfe/design-system';

export function Example() {
  return (
    <PageLayout pageWidth="wide" stickyHeader>
      <PageLayout.Header>
        <FilterBar searchPlaceholder="Komut veya kayıt ara..." />
      </PageLayout.Header>
      <PageLayout.Content>
        <TableSimple
          columns={[
            { key: 'name', title: 'Ad' },
            { key: 'type', title: 'Tür' },
          ]}
          rows={[
            { name: 'Rapor Oluştur', type: 'Aksiyon' },
            { name: 'Kullanıcı Ekle', type: 'Aksiyon' },
          ]}
        />
      </PageLayout.Content>
    </PageLayout>
  );
}`,
      previewProps: { pageWidth: "wide" },
      tags: ["arama", "komut", "calisma-alani"],
    },
    {
      id: "cmd-workspace-context-panel",
      title: "Bağlam Panelli Çalışma Alanı",
      description: "Son işler kuyruğu ve detay paneli ile genişletilmiş çalışma alanı.",
      category: "advanced",
      code: `import { PageLayout, FilterBar, TableSimple } from '@mfe/design-system';

export function Example() {
  return (
    <PageLayout pageWidth="wide" stickyHeader>
      <PageLayout.Header>
        <FilterBar searchPlaceholder="Hızlı arama..." />
      </PageLayout.Header>
      <PageLayout.Content>
        <div className="grid grid-cols-[1fr_320px] gap-4">
          <TableSimple
            columns={[
              { key: 'action', title: 'Aksiyon' },
              { key: 'status', title: 'Durum' },
            ]}
            rows={[
              { action: 'Rapor Oluştur', status: 'Hazır' },
              { action: 'Veri Aktar', status: 'Bekliyor' },
            ]}
          />
          <aside className="rounded-xl border p-4">
            <h3>Son İşler</h3>
            <p>Son 5 komut burada listelenir.</p>
          </aside>
        </div>
      </PageLayout.Content>
    </PageLayout>
  );
}`,
      previewProps: { pageWidth: "wide", stickyHeader: true },
      tags: ["bagdam-paneli", "son-isler", "detay"],
    },
  ],
  CrudTemplate: [
    {
      id: "crud-basic",
      title: "Temel CRUD Listesi",
      description: "Filtre çubuğu ve veri tablosu ile standart CRUD liste şablonu.",
      category: "basic",
      code: `import { PageLayout, FilterBar, TableSimple } from '@mfe/design-system';

export function Example() {
  return (
    <PageLayout>
      <PageLayout.Header>
        <h1>Kullanıcı Yönetimi</h1>
      </PageLayout.Header>
      <PageLayout.Content>
        <FilterBar searchPlaceholder="Kullanıcı ara..." />
        <TableSimple
          columns={[
            { key: 'name', title: 'Ad Soyad' },
            { key: 'email', title: 'E-posta' },
            { key: 'role', title: 'Rol' },
          ]}
          rows={[
            { name: 'Ahmet Yılmaz', email: 'ahmet@ornek.com', role: 'Admin' },
            { name: 'Elif Demir', email: 'elif@ornek.com', role: 'Editör' },
          ]}
        />
      </PageLayout.Content>
    </PageLayout>
  );
}`,
      previewProps: {},
      tags: ["crud", "liste", "tablo", "filtre"],
    },
    {
      id: "crud-with-summary",
      title: "Özet Metrikli CRUD",
      description: "Tablo üstünde özet şeridi bulunan gelişmiş CRUD şablonu.",
      category: "advanced",
      code: `import { PageLayout, FilterBar, SummaryStrip, TableSimple } from '@mfe/design-system';

export function Example() {
  return (
    <PageLayout pageWidth="wide">
      <PageLayout.Header>
        <h1>Sipariş Yönetimi</h1>
      </PageLayout.Header>
      <PageLayout.Content>
        <SummaryStrip
          items={[
            { label: 'Toplam', value: '1.248' },
            { label: 'Bekleyen', value: '42' },
            { label: 'Tamamlanan', value: '1.206' },
          ]}
        />
        <FilterBar searchPlaceholder="Sipariş ara..." />
        <TableSimple
          columns={[
            { key: 'id', title: 'Sipariş No' },
            { key: 'customer', title: 'Müşteri' },
            { key: 'status', title: 'Durum' },
          ]}
          rows={[
            { id: '#1001', customer: 'ABC Ltd.', status: 'Tamamlandı' },
            { id: '#1002', customer: 'XYZ A.Ş.', status: 'Bekliyor' },
          ]}
        />
      </PageLayout.Content>
    </PageLayout>
  );
}`,
      previewProps: { pageWidth: "wide" },
      tags: ["crud", "ozet", "metrik", "siparis"],
    },
    {
      id: "crud-sticky-filters",
      title: "Sabit Filtreli CRUD",
      description: "Kaydırma sırasında sabit kalan başlık ve filtre çubuğu.",
      category: "patterns",
      code: `import { PageLayout, FilterBar, TableSimple } from '@mfe/design-system';

export function Example() {
  return (
    <PageLayout stickyHeader>
      <PageLayout.Header>
        <h1>Ürün Kataloğu</h1>
        <FilterBar
          searchPlaceholder="Ürün ara..."
          filters={[
            { key: 'category', label: 'Kategori', type: 'select' },
            { key: 'status', label: 'Durum', type: 'select' },
          ]}
        />
      </PageLayout.Header>
      <PageLayout.Content>
        <TableSimple
          columns={[
            { key: 'name', title: 'Ürün Adı' },
            { key: 'category', title: 'Kategori' },
            { key: 'price', title: 'Fiyat' },
          ]}
          rows={[
            { name: 'Widget A', category: 'Elektronik', price: '₺299' },
            { name: 'Widget B', category: 'Aksesuar', price: '₺149' },
          ]}
        />
      </PageLayout.Content>
    </PageLayout>
  );
}`,
      previewProps: { stickyHeader: true },
      tags: ["crud", "sabit-baslik", "filtre"],
    },
  ],
  DashboardTemplate: [
    {
      id: "dashboard-basic",
      title: "Temel Dashboard",
      description: "KPI şeridi ve özet kartları ile yönetici panosu.",
      category: "basic",
      code: `import { PageLayout, SummaryStrip } from '@mfe/design-system';

export function Example() {
  return (
    <PageLayout pageWidth="wide">
      <PageLayout.Header>
        <h1>Genel Bakış</h1>
      </PageLayout.Header>
      <PageLayout.Content>
        <SummaryStrip
          items={[
            { label: 'Toplam Gelir', value: '₺1.2M' },
            { label: 'Aktif Kullanıcı', value: '8.432' },
            { label: 'Dönüşüm Oranı', value: '%4.2' },
          ]}
        />
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-xl border p-4">Gelir Grafiği</div>
          <div className="rounded-xl border p-4">Kullanıcı Trendi</div>
        </div>
      </PageLayout.Content>
    </PageLayout>
  );
}`,
      previewProps: { pageWidth: "wide" },
      tags: ["dashboard", "kpi", "ozet"],
    },
    {
      id: "dashboard-tabs",
      title: "Sekmeli Dashboard",
      description: "Farklı veri görünümleri arasında sekme navigasyonu olan pano.",
      category: "advanced",
      code: `import { PageLayout, SummaryStrip, Tabs } from '@mfe/design-system';

export function Example() {
  return (
    <PageLayout pageWidth="wide">
      <PageLayout.Header>
        <h1>Operasyon Panosu</h1>
      </PageLayout.Header>
      <PageLayout.Content>
        <SummaryStrip
          items={[
            { label: 'Toplam İşlem', value: '24.680' },
            { label: 'Başarılı', value: '%99.2' },
            { label: 'Ortalama Süre', value: '1.4s' },
          ]}
        />
        <Tabs defaultValue="overview">
          <Tabs.List>
            <Tabs.Tab value="overview">Genel Bakış</Tabs.Tab>
            <Tabs.Tab value="performance">Performans</Tabs.Tab>
            <Tabs.Tab value="errors">Hatalar</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="overview">Genel bakış içeriği</Tabs.Panel>
          <Tabs.Panel value="performance">Performans metrikleri</Tabs.Panel>
          <Tabs.Panel value="errors">Hata logları</Tabs.Panel>
        </Tabs>
      </PageLayout.Content>
    </PageLayout>
  );
}`,
      previewProps: { pageWidth: "wide" },
      tags: ["dashboard", "sekme", "operasyon", "performans"],
    },
  ],
  DetailTemplate: [
    {
      id: "detail-basic",
      title: "Temel Detay Sayfası",
      description: "Varlık özeti ve metadata bölümleri ile detay şablonu.",
      category: "basic",
      code: `import { PageLayout, EntitySummaryBlock, Descriptions } from '@mfe/design-system';

export function Example() {
  return (
    <PageLayout>
      <PageLayout.Header>
        <EntitySummaryBlock
          title="Sipariş #1001"
          subtitle="ABC Ltd. — 15 Mart 2026"
          status="Tamamlandı"
        />
      </PageLayout.Header>
      <PageLayout.Content>
        <Descriptions
          items={[
            { label: 'Müşteri', value: 'ABC Ltd.' },
            { label: 'Toplam', value: '₺12.500' },
            { label: 'Durum', value: 'Tamamlandı' },
            { label: 'Ödeme', value: 'Kredi Kartı' },
          ]}
        />
      </PageLayout.Content>
    </PageLayout>
  );
}`,
      previewProps: {},
      tags: ["detay", "varlik", "metadata"],
    },
    {
      id: "detail-with-rail",
      title: "Inspector Rail ile Detay",
      description: "Yan panel ile ek bağlam bilgisi sunan detay şablonu.",
      category: "advanced",
      code: `import { PageLayout, EntitySummaryBlock, Descriptions, SummaryStrip } from '@mfe/design-system';

export function Example() {
  return (
    <PageLayout responsiveDetailCollapse>
      <PageLayout.Header>
        <EntitySummaryBlock
          title="Karar #KR-2024-042"
          subtitle="Onay Süreci — Devam Ediyor"
          status="İncelemede"
        />
      </PageLayout.Header>
      <PageLayout.Content>
        <SummaryStrip
          items={[
            { label: 'Onay Adımı', value: '3/5' },
            { label: 'Kalan Süre', value: '2 gün' },
          ]}
        />
        <Descriptions
          items={[
            { label: 'Talep Eden', value: 'Mehmet Öz' },
            { label: 'Bölüm', value: 'Finans' },
            { label: 'Tutar', value: '₺250.000' },
          ]}
        />
      </PageLayout.Content>
    </PageLayout>
  );
}`,
      previewProps: { responsiveDetailCollapse: true },
      tags: ["detay", "rail", "onay", "karar"],
    },
    {
      id: "detail-sticky-header",
      title: "Sabit Başlıklı Detay",
      description: "Kaydırma sırasında varlık başlığı sabit kalan detay görünümü.",
      category: "patterns",
      code: `import { PageLayout, EntitySummaryBlock, Descriptions } from '@mfe/design-system';

export function Example() {
  return (
    <PageLayout stickyHeader>
      <PageLayout.Header>
        <EntitySummaryBlock
          title="Müşteri: Elif Demir"
          subtitle="Hesap No: 10042 — Gold Üye"
        />
      </PageLayout.Header>
      <PageLayout.Content>
        <Descriptions
          items={[
            { label: 'E-posta', value: 'elif@ornek.com' },
            { label: 'Telefon', value: '+90 532 XXX XX XX' },
            { label: 'Kayıt Tarihi', value: '12 Ocak 2024' },
            { label: 'Son Giriş', value: '2 saat önce' },
          ]}
        />
      </PageLayout.Content>
    </PageLayout>
  );
}`,
      previewProps: { stickyHeader: true },
      tags: ["detay", "sabit-baslik", "musteri"],
    },
  ],
  SettingsTemplate: [
    {
      id: "settings-basic",
      title: "Temel Ayarlar Sayfası",
      description: "Bölüm sekmeleri ile yapılandırma ayarları şablonu.",
      category: "basic",
      code: `import { PageLayout, Tabs, Descriptions } from '@mfe/design-system';

export function Example() {
  return (
    <PageLayout stickyHeader>
      <PageLayout.Header>
        <h1>Ayarlar</h1>
      </PageLayout.Header>
      <PageLayout.Content>
        <Tabs defaultValue="general">
          <Tabs.List>
            <Tabs.Tab value="general">Genel</Tabs.Tab>
            <Tabs.Tab value="security">Güvenlik</Tabs.Tab>
            <Tabs.Tab value="notifications">Bildirimler</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="general">
            <Descriptions
              items={[
                { label: 'Dil', value: 'Türkçe' },
                { label: 'Zaman Dilimi', value: 'UTC+3' },
                { label: 'Tarih Formatı', value: 'GG/AA/YYYY' },
              ]}
            />
          </Tabs.Panel>
          <Tabs.Panel value="security">Güvenlik ayarları</Tabs.Panel>
          <Tabs.Panel value="notifications">Bildirim tercihleri</Tabs.Panel>
        </Tabs>
      </PageLayout.Content>
    </PageLayout>
  );
}`,
      previewProps: { stickyHeader: true },
      tags: ["ayarlar", "sekme", "yapilandirma"],
    },
    {
      id: "settings-with-aside",
      title: "Kural Panelli Ayarlar",
      description: "Guardrail aside paneli ile politika bilgilendirmeli ayarlar.",
      category: "advanced",
      code: `import { PageLayout, Tabs, Descriptions, SummaryStrip } from '@mfe/design-system';

export function Example() {
  return (
    <PageLayout stickyHeader>
      <PageLayout.Header>
        <h1>Sistem Ayarları</h1>
        <SummaryStrip
          items={[
            { label: 'Aktif Kurallar', value: '12' },
            { label: 'Uyarılar', value: '3' },
          ]}
        />
      </PageLayout.Header>
      <PageLayout.Content>
        <div className="grid grid-cols-[1fr_280px] gap-6">
          <Tabs defaultValue="policies">
            <Tabs.List>
              <Tabs.Tab value="policies">Politikalar</Tabs.Tab>
              <Tabs.Tab value="limits">Limitler</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="policies">
              <Descriptions
                items={[
                  { label: 'Parola Uzunluğu', value: 'Min 12 karakter' },
                  { label: 'MFA', value: 'Zorunlu' },
                ]}
              />
            </Tabs.Panel>
            <Tabs.Panel value="limits">Limit yapılandırması</Tabs.Panel>
          </Tabs>
          <aside className="rounded-xl border p-4">
            <h3>Kural Bilgisi</h3>
            <p>Seçili politika ile ilgili kısıtlamalar.</p>
          </aside>
        </div>
      </PageLayout.Content>
    </PageLayout>
  );
}`,
      previewProps: { stickyHeader: true },
      tags: ["ayarlar", "kural", "politika", "guardrail"],
    },
  ],
  ThemePresetCompare: [
    {
      id: "preset-compare-basic",
      title: "Temel Preset Karşılaştırma",
      description: "İki tema preseti arasındaki farkları matris görünümünde sunar.",
      category: "basic",
      code: `import { ThemePresetCompare } from '@mfe/design-system';

export function Example() {
  return (
    <ThemePresetCompare
      leftPreset={{
        presetId: 'default-light',
        label: 'Varsayılan Açık',
        appearance: 'light',
        density: 'comfortable',
        intent: 'Genel kullanım',
        isHighContrast: false,
        isDefaultMode: true,
      }}
      rightPreset={{
        presetId: 'accessibility',
        label: 'Erişilebilir',
        appearance: 'light',
        density: 'comfortable',
        intent: 'Yüksek kontrast',
        isHighContrast: true,
        isDefaultMode: false,
      }}
    />
  );
}`,
      previewProps: {},
      tags: ["tema", "karsilastirma", "preset"],
    },
    {
      id: "preset-compare-custom-axes",
      title: "Özel Eksenli Karşılaştırma",
      description: "Belirli eksenler üzerinde odaklanmış preset karşılaştırması.",
      category: "advanced",
      code: `import { ThemePresetCompare } from '@mfe/design-system';

export function Example() {
  return (
    <ThemePresetCompare
      leftPreset={{
        presetId: 'default',
        label: 'Varsayılan',
        appearance: 'light',
        density: 'comfortable',
        intent: 'Standart',
        isHighContrast: false,
        isDefaultMode: true,
        themeMode: 'light',
      }}
      rightPreset={{
        presetId: 'compact-dark',
        label: 'Kompakt Koyu',
        appearance: 'dark',
        density: 'compact',
        intent: 'Yoğun veri',
        isHighContrast: false,
        isDefaultMode: false,
        themeMode: 'dark',
      }}
      axes={['appearance', 'density', 'mode', 'contrast']}
      title="Mod Karşılaştırması"
      description="Açık ve koyu mod arasındaki temel farklar."
    />
  );
}`,
      previewProps: {},
      tags: ["tema", "eksen", "koyu-mod", "karsilastirma"],
    },
    {
      id: "preset-compare-empty",
      title: "Boş Karşılaştırma",
      description: "Henüz preset seçilmemiş boş durum görünümü.",
      category: "basic",
      code: `import { ThemePresetCompare } from '@mfe/design-system';

export function Example() {
  return (
    <ThemePresetCompare
      leftPreset={null}
      rightPreset={null}
      title="Preset Karşılaştırma"
      description="Karşılaştırma için iki preset seçin."
    />
  );
}`,
      previewProps: {},
      tags: ["tema", "bos", "empty-state"],
    },
  ],
  ThemePresetGallery: [
    {
      id: "preset-gallery-basic",
      title: "Temel Preset Galerisi",
      description: "Seçilebilir tema preset kartları galerisi.",
      category: "basic",
      code: `import { ThemePresetGallery } from '@mfe/design-system';

export function Example() {
  return (
    <ThemePresetGallery
      presets={[
        {
          presetId: 'default-light',
          label: 'Varsayılan Açık',
          themeMode: 'Light',
          appearance: 'Modern',
          density: 'Comfortable',
          isDefaultMode: true,
        },
        {
          presetId: 'default-dark',
          label: 'Varsayılan Koyu',
          themeMode: 'Dark',
          appearance: 'Modern',
          density: 'Comfortable',
        },
      ]}
    />
  );
}`,
      previewProps: {},
      tags: ["tema", "galeri", "preset", "secim"],
    },
    {
      id: "preset-gallery-controlled",
      title: "Kontrollü Preset Galerisi",
      description: "Dışarıdan yönetilen seçim durumu ile preset galerisi.",
      category: "advanced",
      code: `import { ThemePresetGallery } from '@mfe/design-system';
import { useState } from 'react';

export function Example() {
  const [selectedId, setSelectedId] = useState('default-light');

  return (
    <ThemePresetGallery
      presets={[
        {
          presetId: 'default-light',
          label: 'Varsayılan Açık',
          themeMode: 'Light',
          appearance: 'Modern',
          density: 'Comfortable',
          isDefaultMode: true,
        },
        {
          presetId: 'high-contrast',
          label: 'Yüksek Kontrast',
          themeMode: 'Light',
          appearance: 'Classic',
          density: 'Comfortable',
          isHighContrast: true,
        },
        {
          presetId: 'compact',
          label: 'Kompakt',
          themeMode: 'Light',
          appearance: 'Modern',
          density: 'Compact',
        },
      ]}
      selectedPresetId={selectedId}
      onSelectPreset={(id) => setSelectedId(id)}
      compareAxes={['Appearance', 'Density', 'Contrast']}
    />
  );
}`,
      previewProps: {},
      tags: ["tema", "galeri", "kontrollu", "kontrast"],
    },
    {
      id: "preset-gallery-empty",
      title: "Boş Preset Galerisi",
      description: "Preset tanımlı olmadığında boş durum mesajı.",
      category: "basic",
      code: `import { ThemePresetGallery } from '@mfe/design-system';

export function Example() {
  return (
    <ThemePresetGallery
      presets={[]}
      title="Tema Presetleri"
      description="Kullanılabilir preset bulunamadı."
    />
  );
}`,
      previewProps: {},
      tags: ["tema", "galeri", "bos", "empty-state"],
    },
  ],
  ThemePreviewCard: [
    {
      id: "preview-card-basic",
      title: "Temel Önizleme Kartı",
      description: "Tema varyasyonunu minik kart olarak gösteren önizleme.",
      category: "basic",
      code: `import { ThemePreviewCard } from '@mfe/design-system';

export function Example() {
  return (
    <div className="flex gap-4">
      <ThemePreviewCard />
      <ThemePreviewCard selected />
    </div>
  );
}`,
      previewProps: {},
      tags: ["tema", "onizleme", "kart"],
    },
    {
      id: "preview-card-selected",
      title: "Seçili Önizleme Kartı",
      description: "Aktif preset vurgusu ile seçili durum kartı.",
      category: "basic",
      code: `import { ThemePreviewCard } from '@mfe/design-system';

export function Example() {
  return (
    <ThemePreviewCard
      selected
      localeText={{
        titleText: 'Başlık metni',
        secondaryText: 'İkincil metin',
        saveLabel: 'Kaydet',
        selectedLabel: 'Seçili tema önizlemesi',
      }}
    />
  );
}`,
      previewProps: { selected: true },
      tags: ["tema", "secili", "onizleme", "yerellestirilmis"],
    },
    {
      id: "preview-card-gallery",
      title: "Galeri İçinde Önizleme",
      description: "Birden fazla önizleme kartının galeri düzeninde kullanımı.",
      category: "patterns",
      code: `import { ThemePreviewCard } from '@mfe/design-system';
import { useState } from 'react';

export function Example() {
  const [selected, setSelected] = useState(0);

  return (
    <div className="grid grid-cols-3 gap-3">
      {['Açık Tema', 'Koyu Tema', 'Yüksek Kontrast'].map((label, i) => (
        <button key={label} onClick={() => setSelected(i)} className="text-left">
          <ThemePreviewCard
            selected={selected === i}
            localeText={{ titleText: label }}
          />
          <span className="mt-1 block text-xs">{label}</span>
        </button>
      ))}
    </div>
  );
}`,
      previewProps: {},
      tags: ["tema", "galeri", "coklu", "secim"],
    },
  ],
  Tabs: [
    {
      id: "tabs-basic",
      title: "Basic Tabs",
      description: "Tab navigation for switching between content panels.",
      category: "basic",
      code: `import { Tabs } from '@mfe/design-system';

export function Example() {
  return (
    <Tabs defaultValue="overview">
      <Tabs.List>
        <Tabs.Tab value="overview">Overview</Tabs.Tab>
        <Tabs.Tab value="settings">Settings</Tabs.Tab>
        <Tabs.Tab value="billing">Billing</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="overview">Overview content</Tabs.Panel>
      <Tabs.Panel value="settings">Settings content</Tabs.Panel>
      <Tabs.Panel value="billing">Billing content</Tabs.Panel>
    </Tabs>
  );
}`,
      previewProps: {},
      tags: ["navigation", "panel", "switch"],
    },
  ],
};

/* ---- Public API ---- */

export function getExamplesForComponent(componentName: string): ExampleEntry[] {
  return _registry[componentName] ?? [];
}

export function getExampleCategories(examples: ExampleEntry[]): ExampleCategory[] {
  const cats = new Set(examples.map((e) => e.category));
  const order: ExampleCategory[] = ["basic", "form", "layout", "advanced", "patterns"];
  return order.filter((c) => cats.has(c));
}

export function hasExamples(componentName: string): boolean {
  return (componentName in _registry) && _registry[componentName].length > 0;
}
