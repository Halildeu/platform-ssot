import React from 'react';
import { Badge, Button, Empty, Select, Tag, Text } from '@mfe/design-system';
import type { ThemeDensity, AccessLevel } from '@mfe/design-system';
import {
  RUNTIME_THEME_MATRIX_THEMES,
  RUNTIME_THEME_MATRIX_DENSITIES,
  RUNTIME_THEME_MATRIX_ACCESS_STATES,
  RUNTIME_THEME_MATRIX_APPEARANCE_MAP,
  THEME_MATRIX_HIDDEN_LABEL,
  type RuntimeThemeMatrixTheme,
} from './theme-matrix.constants';

const moduleOptions = [
  { value: 'users', label: 'Kullanıcılar' },
  { value: 'access', label: 'Erişim' },
  { value: 'audit', label: 'Denetim' },
];

const LoginPreview = () => (
  <div className="rounded-2xl border border-border-subtle bg-surface p-4 shadow-xs">
    <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-text-secondary">
      Login
    </div>
    <div className="flex flex-col gap-2">
      <label className="text-[11px] font-semibold text-text-secondary">
        E-posta
        <input
          className="mt-1 h-8 w-full rounded-md border border-border-default bg-surface-panel px-2 text-sm text-text-primary focus:outline-hidden focus:ring-2 focus:ring-selection-outline"
          placeholder="kullanici@example.com"
        />
      </label>
      <label className="text-[11px] font-semibold text-text-secondary">
        Parola
        <input
          className="mt-1 h-8 w-full rounded-md border border-border-default bg-surface-panel px-2 text-sm text-text-primary focus:outline-hidden focus:ring-2 focus:ring-selection-outline"
          placeholder="••••••"
          type="password"
        />
      </label>
      <Button className="w-full" access="full">
        Giriş Yap
      </Button>
      <Button className="w-full" variant="secondary" access="readonly">
        Misafir Modu (readonly)
      </Button>
    </div>
  </div>
);

const UnauthorizedPreview = () => (
  <div className="rounded-2xl border border-border-subtle bg-surface p-4 shadow-xs">
    <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-secondary">
      Unauthorized
    </div>
    <p className="text-sm text-text-secondary">
      Bu sayfayı görmek için &quot;REPORTING_MODULE&quot; yetkisi gerekir.
    </p>
    <Button className="mt-3 w-full" access="disabled" accessReason="Role: VIEWER">
      Yetki İste
    </Button>
  </div>
);

const AppShellPreview = () => (
  <div className="rounded-2xl border border-border-subtle bg-surface p-4">
    <div className="mb-3 flex items-center justify-between">
      <span className="text-sm font-semibold text-text-primary">Shell Header</span>
      <Badge variant="info">AppShell</Badge>
    </div>
    <div className="flex flex-wrap gap-2">
      {['Dashboard', 'Users', 'Access', 'Audit', 'Reports'].map((item, index) => (
        <span
          key={item}
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            index === 0
              ? 'bg-action-primary text-action-primary-text'
              : 'bg-surface-muted text-text-secondary'
          }`}
        >
          {item}
        </span>
      ))}
    </div>
    <div className="mt-3 grid gap-2 md:grid-cols-2">
      <div className="rounded-xl border border-border-subtle bg-surface-panel px-3 py-2 text-[11px] font-semibold text-text-secondary">
        Kullanıcı: theme.dev@example.com
      </div>
      <div className="rounded-xl border border-border-subtle bg-surface-panel px-3 py-2 text-[11px] font-semibold text-text-secondary">
        Tema/Yoğunluk: runtime panel
      </div>
    </div>
  </div>
);

const DetailDrawerPreview = () => (
  <div
    className="rounded-2xl border border-border-subtle bg-surface shadow-xs"
    data-testid="detail-drawer-preview"
  >
    <div className="border-b border-border-subtle px-4 py-3">
      <div className="text-sm font-semibold text-text-primary">DetailDrawer</div>
      <p className="text-xs text-text-secondary">Entity detayları readonly modda</p>
    </div>
    <div className="flex flex-col gap-3 px-4 py-4 text-sm text-text-primary">
      <div className="flex items-center justify-between">
        <span>Durum</span>
        <Tag variant="info" access="readonly" accessReason="Audit kaydı">
          Readonly
        </Tag>
      </div>
      <div className="flex items-center justify-between">
        <span>Yetki</span>
        <Badge variant="warning">Onay bekliyor</Badge>
      </div>
      <div className="flex flex-col gap-1 text-xs text-text-secondary">
        <span>Değişiklik Notu</span>
        <Text variant="secondary">Detay çekme senaryosu.</Text>
      </div>
    </div>
  </div>
);

const FormDrawerPreview = () => (
  <div
    className="rounded-2xl border border-border-subtle bg-surface shadow-xs"
    data-testid="form-drawer-preview"
  >
    <div className="border-b border-border-subtle px-4 py-3">
      <div className="text-sm font-semibold text-text-primary">FormDrawer</div>
      <p className="text-xs text-text-secondary">Form alanları disabled/readonly kombinasyonları</p>
    </div>
    <div className="flex flex-col gap-3 px-4 py-4 text-sm text-text-primary">
      <label className="text-xs font-semibold text-text-secondary">
        İsim
        <input
          className="mt-1 h-8 w-full rounded-md border border-border-default bg-surface-panel px-2 text-sm text-text-primary focus:ring-2 focus:ring-selection-outline"
          defaultValue="Theme Runtime"
        />
      </label>
      <label className="text-xs font-semibold text-text-secondary">
        Rol
        <input
          className="mt-1 h-8 w-full rounded-md border border-border-default bg-surface px-2 text-sm text-text-primary"
          defaultValue="ADMIN"
          readOnly
        />
      </label>
      <Button access="disabled" accessReason="Onaylanmamış değişiklik" className="w-full">
        Kaydet
      </Button>
    </div>
  </div>
);

const AccessDrawerPreview = () => (
  <div
    className="rounded-2xl border border-border-subtle bg-surface shadow-xs"
    data-testid="access-drawer-preview"
  >
    <div className="border-b border-border-subtle px-4 py-3">
      <div className="text-sm font-semibold text-text-primary">Access Drawer</div>
      <p className="text-xs text-text-secondary">Roller paneli</p>
    </div>
    <div className="flex flex-col gap-3 px-4 py-4 text-sm text-text-primary">
      <div className="flex items-center justify-between">
        <span>Modül</span>
        <Tag variant="info">USER_MANAGEMENT</Tag>
      </div>
      <div className="flex items-center gap-2">
        <Button access="readonly" className="flex-1" variant="secondary" accessReason="Sadece izle">
          Rolleri İncele
        </Button>
        <Button access="disabled" className="flex-1" accessReason="Policy kilidi">
          Rol Ata
        </Button>
      </div>
      <Text variant="secondary">
        Onaya gönderilen talepler bu panelde listelenir; erişimi olmayan aksiyonlar gizlenir.
      </Text>
    </div>
  </div>
);

const NotificationPreview = () => (
  <div
    className="rounded-2xl border border-border-subtle bg-surface shadow-xs"
    data-testid="notification-preview"
  >
    <div className="border-b border-border-subtle px-4 py-3">
      <div className="text-sm font-semibold text-text-primary">Notification Center</div>
      <p className="text-xs text-text-secondary">State renkleri semantic token üzerinden</p>
    </div>
    <div className="flex flex-col gap-2 px-4 py-4 text-sm">
      <div className="rounded-xl border border-border-subtle bg-state-info-bg px-3 py-2 text-state-info-text">
        Rapor oluşturuldu
      </div>
      <div className="rounded-xl border border-border-subtle bg-state-warning-bg px-3 py-2 text-state-warning-text">
        Access isteği beklemede
      </div>
      <div className="rounded-xl border border-border-subtle bg-state-danger-bg px-3 py-2 text-state-danger-text">
        Audit hatası
      </div>
    </div>
  </div>
);

const ReportingPreview = () => (
  <div
    className="rounded-2xl border border-border-subtle bg-surface-panel p-4 shadow-xs"
    data-testid="reporting-preview-item"
  >
    <div className="mb-3 flex items-center justify-between text-xs font-semibold text-text-secondary">
      <span>Reporting Toolbar</span>
      <Badge variant="info">Reporting</Badge>
    </div>
    <div className="grid gap-3 md:grid-cols-2">
      <label className="text-xs font-semibold text-text-secondary">
        Hızlı filtre
        <input
          className="mt-1 h-8 w-full rounded-md border border-border-default bg-surface-panel px-2 text-sm text-text-primary focus:ring-2 focus:ring-selection-outline"
          placeholder="Tüm sütunlarda ara..."
        />
      </label>
      <label className="text-xs font-semibold text-text-secondary">
        Varyant
        <select className="mt-1 h-8 w-full rounded-md border border-border-default bg-surface-panel px-2 text-sm text-text-primary focus:ring-2 focus:ring-selection-outline">
          <option>Varsayılan</option>
          <option>Compact View</option>
        </select>
      </label>
    </div>
    <div className="mt-3 flex flex-wrap gap-2">
      <Button access="full">Excel (Görünür)</Button>
      <Button access="readonly" variant="secondary" accessReason="readonly rolü">CSV (Görünür)</Button>
      <Button access="disabled" accessReason="Yetki gerekir">Excel (Tümü)</Button>
    </div>
  </div>
);

const ThemeScopeCard = ({
  theme,
  density,
}: {
  theme: RuntimeThemeMatrixTheme;
  density: ThemeDensity;
}) => {
  const accessStates: AccessLevel[] = [...RUNTIME_THEME_MATRIX_ACCESS_STATES];
  return (
    <div
      data-theme-scope={`chromatic-${theme}-${density}`}
      data-theme={theme}
      data-appearance={RUNTIME_THEME_MATRIX_APPEARANCE_MAP[theme]}
      data-density={density}
      data-radius="rounded"
      data-elevation="raised"
      data-motion="standard"
      className="flex flex-col gap-4 rounded-2xl border border-border-subtle bg-surface-panel p-4 shadow-lg"
    >
      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-text-secondary">
        <span>{theme}</span>
        <span>Density: {density}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {accessStates.map((state) => (
          <Button
            key={`${theme}-${density}-${state}`}
            access={state}
            variant={state === 'full' ? 'primary' : 'secondary'}
          >
            {state === 'full' ? 'Tam Yetki' : state === 'readonly' ? 'Sadece Oku' : 'Kilitli'}
          </Button>
        ))}
      </div>
      <div
        data-testid={`hidden-action-${theme}-${density}`}
        className="sr-only"
        aria-hidden="true"
      >
        <Button access="hidden">{THEME_MATRIX_HIDDEN_LABEL}</Button>
      </div>
      <div className="grid gap-2 md:grid-cols-2">
        <Select
          access="full"
          value="users"
          onChange={() => {}}
          options={moduleOptions}
          placeholder="Modül seç"
        />
        <Select
          access="readonly"
          value="access"
          onChange={() => {}}
          options={moduleOptions}
          placeholder="Yetki seviyesi"
          accessReason="Sadece görüntüleme yetkisi"
        />
      </div>
      <div className="flex flex-col gap-2 md:grid md:grid-cols-2">
        <LoginPreview />
        <UnauthorizedPreview />
      </div>
      <AppShellPreview />
      <div className="rounded-2xl border border-border-subtle bg-surface p-4">
        <div className="flex items-center justify-between text-xs font-semibold text-text-secondary">
          <span>Users/Entity Grid Önizleme</span>
          <Badge variant="muted">Grid</Badge>
        </div>
        <div className="mt-3 rounded-xl border border-border-subtle">
          <div className="flex items-center justify-between border-b border-border-subtle bg-surface-muted px-3 py-2 text-xs font-medium text-text-secondary">
            <span>Üye</span>
            <span>Rol</span>
          </div>
          {[1, 2, 3].map((index) => (
            <div
              key={index}
              className="flex items-center justify-between px-3 py-2 text-sm text-text-primary odd:bg-surface"
              style={{ minHeight: density === 'compact' ? 36 : 48 }}
            >
              <span>Üye #{index}</span>
              <span className="text-text-secondary">Rol #{index}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <DetailDrawerPreview />
        <FormDrawerPreview />
      </div>
      <AccessDrawerPreview />
      <ReportingPreview />
      <NotificationPreview />
      <div className="flex items-center gap-3">
        <Badge variant="muted">Tema</Badge>
        <Text variant="secondary">Semantic token zinciri tüm bileşenlerde etkin.</Text>
      </div>
      <Empty description="Boş durum örneği" access="readonly" accessReason="Yalnız görüntüleme" />
    </div>
  );
};

export const ThemeMatrixGallery: React.FC = () => (
  <div className="flex flex-col gap-8" data-testid="runtime-theme-matrix-root">
    {RUNTIME_THEME_MATRIX_THEMES.map((theme) => (
      <section key={theme} className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold text-text-primary">{theme}</h3>
        <div className="grid gap-6 lg:grid-cols-2">
          {RUNTIME_THEME_MATRIX_DENSITIES.map((density) => (
            <ThemeScopeCard key={`${theme}-${density}`} theme={theme} density={density} />
          ))}
        </div>
      </section>
    ))}
  </div>
);
