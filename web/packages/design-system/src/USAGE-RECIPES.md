# Usage Recipes

> **Package:** `@mfe/design-system`
> Common patterns and composition recipes for the design system.

---

## 1. Form with Validation

Combine `Input`, `Select`, `Checkbox`, and `Button` for a complete form with validation feedback.

```tsx
import { useState } from 'react';
import { Input } from '@mfe/design-system/primitives/input';
import { Textarea } from '@mfe/design-system/primitives/input';
import { Select } from '@mfe/design-system/primitives/select';
import { Checkbox } from '@mfe/design-system/primitives/checkbox';
import { Button } from '@mfe/design-system/primitives/button';

function RegistrationForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = () => {
    const nextErrors: Record<string, string> = {};
    // validation logic here
    if (!agreed) nextErrors.terms = 'Kosullari kabul etmelisiniz.';
    setErrors(nextErrors);
  };

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}
      style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 400 }}
    >
      <Input
        label="Ad Soyad"
        required
        error={errors.name}
        placeholder="Ornegin: Ahmet Yilmaz"
      />
      <Input
        label="E-posta"
        type="email"
        required
        error={errors.email}
        placeholder="ornek@sirket.com"
      />
      <Select
        label="Departman"
        required
        error={errors.department}
        options={[
          { value: 'engineering', label: 'Muhendislik' },
          { value: 'design', label: 'Tasarim' },
          { value: 'product', label: 'Urun' },
          { value: 'hr', label: 'Insan Kaynaklari' },
        ]}
        placeholder="Departman seciniz"
      />
      <Textarea
        label="Notlar"
        hint="Istege bagli"
        placeholder="Eklemek istediginiz bir not var mi?"
        rows={3}
      />
      <Checkbox
        label="Kullanim kosullarini kabul ediyorum"
        error={Boolean(errors.terms)}
        checked={agreed}
        onChange={() => setAgreed(!agreed)}
      />
      <Button variant="primary" type="submit" fullWidth>
        Kayit Ol
      </Button>
    </form>
  );
}
```

---

## 2. Data Table with Filters

Use `SearchFilterListing` with `FilterBar` for searchable, filterable data views.

```tsx
import { useState } from 'react';
import { SearchFilterListing } from '@mfe/design-system/components/search-filter-listing';
import { Input } from '@mfe/design-system/primitives/input';
import { Select } from '@mfe/design-system/primitives/select';
import { Button } from '@mfe/design-system/primitives/button';
import { Badge } from '@mfe/design-system/primitives/badge';

function AuditReportList({ data }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = data.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <SearchFilterListing
      title="Denetim Raporlari"
      description="Tum raporlari goruntuleyin ve filtreleyin."
      items={filtered.map((item) => (
        <div key={item.id} style={{ padding: '12px 0', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ fontWeight: 600, fontSize: 14 }}>{item.title}</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>
            {item.author} | {item.date}
          </div>
        </div>
      ))}
      totalCount={filtered.length}
      listTitle="Sonuclar"
      status={<Badge variant="success">Guncel</Badge>}
      actions={<Button size="sm">Yeni Rapor</Button>}
      filters={
        <div style={{ display: 'flex', gap: 8 }}>
          <Input
            placeholder="Rapor ara..."
            size="sm"
            fullWidth={false}
            onValueChange={setSearch}
          />
          <Select
            options={[
              { value: 'all', label: 'Tum Durumlar' },
              { value: 'completed', label: 'Tamamlandi' },
              { value: 'pending', label: 'Bekliyor' },
            ]}
            placeholder="Durum"
            size="sm"
            fullWidth={false}
            onValueChange={setStatusFilter}
          />
        </div>
      }
      activeFilters={
        statusFilter !== 'all'
          ? [{ key: 'status', label: 'Durum', value: statusFilter, onRemove: () => setStatusFilter('all') }]
          : []
      }
      onClearAllFilters={() => {
        setSearch('');
        setStatusFilter('all');
      }}
    />
  );
}
```

---

## 3. Modal Dialog Flow

Combine `Dialog` (or `Modal`) with a form and `useToast` for a complete create/edit flow with confirmation.

```tsx
import { useState } from 'react';
import { Dialog } from '@mfe/design-system/primitives/dialog';
import { Input } from '@mfe/design-system/primitives/input';
import { Button } from '@mfe/design-system/primitives/button';
import { useToast } from '@mfe/design-system/components/toast';

function CreateUserDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const toast = useToast();

  const handleSubmit = () => {
    if (!name.trim()) return;
    // API call here
    setOpen(false);
    setName('');
    toast.success('Kullanici basariyla olusturuldu.', {
      title: 'Basarili',
    });
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>Kullanici Ekle</Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Yeni Kullanici"
        description="Sisteme yeni bir kullanici ekleyin."
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Iptal
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              Kaydet
            </Button>
          </>
        }
      >
        <Input
          label="Ad Soyad"
          required
          value={name}
          onValueChange={setName}
          placeholder="Ornegin: Ahmet Yilmaz"
        />
      </Dialog>
    </>
  );
}
```

### Destructive Confirmation Modal

```tsx
import { Modal } from '@mfe/design-system/primitives/modal';

function DeleteConfirmModal({ open, onClose, onConfirm, itemName }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      surface="destructive"
      title="Kaydi Sil"
    >
      <p>
        <strong>{itemName}</strong> kalici olarak silinecektir. Bu islem geri alinamaz.
      </p>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
        <Button variant="secondary" onClick={onClose}>Iptal</Button>
        <Button variant="danger" onClick={onConfirm}>Sil</Button>
      </div>
    </Modal>
  );
}
```

---

## 4. Page Layout with Sidebar

Combine `PageLayout` pattern components for a standard admin page.

```tsx
import { PageLayout } from '@mfe/design-system/patterns/page-layout';
import { PageHeader } from '@mfe/design-system/patterns/page-header';
import { NavigationRail } from '@mfe/design-system/components/navigation-rail';
import { Tabs } from '@mfe/design-system/components/tabs';
import { Button } from '@mfe/design-system/primitives/button';

function AdminPage() {
  return (
    <PageLayout
      sidebar={
        <NavigationRail
          items={[
            { key: 'dashboard', label: 'Kontrol Paneli', icon: '...' },
            { key: 'users', label: 'Kullanicilar', icon: '...' },
            { key: 'reports', label: 'Raporlar', icon: '...' },
            { key: 'settings', label: 'Ayarlar', icon: '...' },
          ]}
          activeKey="users"
        />
      }
    >
      <PageHeader
        title="Kullanicilar"
        description="Sistem kullanicilarini yonetebilirsiniz."
        actions={<Button>Yeni Kullanici</Button>}
      />
      <Tabs
        items={[
          { key: 'active', label: 'Aktif', content: <div>Aktif kullanicilar</div> },
          { key: 'inactive', label: 'Pasif', content: <div>Pasif kullanicilar</div> },
          { key: 'all', label: 'Tumu', content: <div>Tum kullanicilar</div> },
        ]}
      />
    </PageLayout>
  );
}
```

---

## 5. Command Palette Integration

Add a global command palette with keyboard shortcut (Cmd+K).

```tsx
import { useState, useEffect } from 'react';
import { CommandPalette } from '@mfe/design-system/components/command-palette';
import { useNavigate } from 'react-router-dom';

function AppWithCommandPalette({ children }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // Cmd+K / Ctrl+K keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const commands = [
    {
      id: 'home',
      title: 'Ana Sayfa',
      group: 'Navigasyon',
      shortcut: 'G H',
      keywords: ['dashboard', 'giris'],
    },
    {
      id: 'users',
      title: 'Kullanicilar',
      group: 'Navigasyon',
      shortcut: 'G U',
    },
    {
      id: 'new-report',
      title: 'Yeni Rapor Olustur',
      group: 'Islemler',
      shortcut: 'N R',
    },
    {
      id: 'theme-toggle',
      title: 'Tema Degistir',
      group: 'Sistem',
    },
  ];

  return (
    <>
      {children}
      <CommandPalette
        open={open}
        items={commands}
        onClose={() => setOpen(false)}
        onSelect={(id) => {
          if (id === 'home') navigate('/');
          if (id === 'users') navigate('/users');
          // handle other commands
        }}
      />
    </>
  );
}
```

---

## 6. Toast Notification Patterns

### Setup

Wrap your application root with `ToastProvider`:

```tsx
import { ToastProvider } from '@mfe/design-system/components/toast';

function App() {
  return (
    <ToastProvider position="top-right" duration={4000} maxVisible={5}>
      <Router>
        <Routes />
      </Router>
    </ToastProvider>
  );
}
```

### Usage in Components

```tsx
import { useToast } from '@mfe/design-system/components/toast';

function SaveButton() {
  const toast = useToast();

  const handleSave = async () => {
    try {
      await saveData();
      toast.success('Kayit basariyla guncellendi.');
    } catch (err) {
      toast.error('Kayit sirasinda bir hata olustu.', {
        title: 'Hata',
        duration: 8000,  // longer duration for errors
      });
    }
  };

  return <Button onClick={handleSave}>Kaydet</Button>;
}
```

### Common Toast Patterns

```tsx
const toast = useToast();

// Simple notifications
toast.info('Sistem bakimi planlanmistir.');
toast.success('Dosya yuklendi.');
toast.warning('Oturum suresi dolmak uzere.');
toast.error('Baglanti kesildi.');

// With title
toast.success('3 kayit basariyla guncellendi.', { title: 'Toplu Guncelleme' });

// With custom duration
toast.error('Sunucu hatasi. Tekrar deneyin.', { title: 'Hata', duration: 10000 });
```

---

## 7. Access Control Patterns

### Form Fields with Permission Levels

```tsx
import { Input } from '@mfe/design-system/primitives/input';
import { Select } from '@mfe/design-system/primitives/select';

function UserEditForm({ permissions }) {
  // 'full' | 'readonly' | 'disabled' | 'hidden'
  const fieldAccess = permissions.canEdit ? 'full' : 'readonly';
  const sensitiveAccess = permissions.canViewSensitive ? fieldAccess : 'hidden';

  return (
    <form>
      <Input
        label="Ad Soyad"
        access={fieldAccess}
        accessReason={!permissions.canEdit ? 'Duzenleme yetkiniz yok' : undefined}
      />
      <Input
        label="TC Kimlik No"
        access={sensitiveAccess}
        accessReason="Bu alani gormek icin yetki gereklidir"
      />
      <Select
        label="Rol"
        access={permissions.isAdmin ? 'full' : 'disabled'}
        accessReason="Yalnizca yoneticiler degistirebilir"
        options={[
          { value: 'viewer', label: 'Izleyici' },
          { value: 'editor', label: 'Duzenleyici' },
          { value: 'admin', label: 'Yonetici' },
        ]}
      />
    </form>
  );
}
```

### Overlay with Access Control

```tsx
import { CommandPalette } from '@mfe/design-system/components/command-palette';

function ProtectedCommandPalette({ userRole, ...props }) {
  return (
    <CommandPalette
      {...props}
      access={userRole === 'admin' ? 'full' : 'readonly'}
      accessReason={userRole !== 'admin' ? 'Yalnizca yoneticiler komut calistirabilir' : undefined}
    />
  );
}
```

---

## 8. Multi-Step Form with Steps Component

```tsx
import { useState } from 'react';
import { Steps } from '@mfe/design-system/components/steps';
import { Input } from '@mfe/design-system/primitives/input';
import { Button } from '@mfe/design-system/primitives/button';
import { useToast } from '@mfe/design-system/components/toast';

function OnboardingWizard() {
  const [step, setStep] = useState(0);
  const toast = useToast();

  const steps = [
    { key: 'info', title: 'Bilgiler' },
    { key: 'prefs', title: 'Tercihler' },
    { key: 'review', title: 'Onay' },
  ];

  const handleComplete = () => {
    toast.success('Kayit tamamlandi!', { title: 'Basarili' });
  };

  return (
    <div style={{ maxWidth: 600 }}>
      <Steps items={steps} current={step} />

      <div style={{ marginTop: 24 }}>
        {step === 0 && <Input label="Ad Soyad" required />}
        {step === 1 && <Input label="Tercih Edilen Dil" />}
        {step === 2 && <p>Bilgilerinizi kontrol edin ve gonderin.</p>}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
        <Button
          variant="secondary"
          disabled={step === 0}
          onClick={() => setStep((s) => s - 1)}
        >
          Geri
        </Button>
        {step < steps.length - 1 ? (
          <Button variant="primary" onClick={() => setStep((s) => s + 1)}>
            Ileri
          </Button>
        ) : (
          <Button variant="primary" onClick={handleComplete}>
            Tamamla
          </Button>
        )}
      </div>
    </div>
  );
}
```
