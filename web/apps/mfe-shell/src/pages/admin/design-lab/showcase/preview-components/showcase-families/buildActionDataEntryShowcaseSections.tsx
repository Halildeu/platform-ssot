import React from 'react';
import {
  Badge,
  Button,
  Checkbox,
  Combobox,
  FilterBar,
  Segmented,
  Select,
  Text,
  TextInput,
} from '@mfe/design-system';
import {
  LibraryMetricCard,
  LibrarySectionBadge as SectionBadge,
} from '../../../../../../../../../packages/design-system/src/catalog/design-lab-internals';
import type {
  ComponentShowcaseSection,
  DesignLabTranslate,
  PreviewPanelComponent,
} from '../../showcaseTypes';

type ActionDataEntryShowcaseContext = {
  PreviewPanel: PreviewPanelComponent;
  t: DesignLabTranslate;
  checkboxValue: boolean;
  dropdownAction: string;
  inviteInputValue: string;
  searchInputValue: string;
  selectValue: string;
  textInputValue: string;
  setCheckboxValue: (nextValue: boolean) => void;
  setDropdownAction: (nextValue: string) => void;
  setInviteInputValue: (nextValue: string) => void;
  setSearchInputValue: (nextValue: string) => void;
  setSelectValue: (nextValue: string) => void;
  setTextInputValue: (nextValue: string) => void;
};

export const buildActionDataEntryShowcaseSections = (
  componentName: string,
  context: ActionDataEntryShowcaseContext,
): ComponentShowcaseSection[] | null => {
  const {
    PreviewPanel,
    t,
    checkboxValue,
    dropdownAction,
    inviteInputValue,
    searchInputValue,
    selectValue,
    textInputValue,
    setCheckboxValue,
    setDropdownAction,
    setInviteInputValue,
    setSearchInputValue,
    setSelectValue,
    setTextInputValue,
  } = context;

  switch (componentName) {
    case 'Button':
      return [
        {
          id: 'button-cta-matrix',
          eyebrow: 'Actions & Triggers',
          title: 'CTA matrisi',
          description: 'Ant Design ve Material UI çizgisindeki birincil, ikincil ve hafif aksiyon yoğunluğunu aynı yüzeyde gösterir.',
          badges: ['cta', 'hero', 'decision'],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
              <PreviewPanel title="Release çağrısı">
                <div className="flex flex-wrap gap-3">
                  <Button leftIcon={<span aria-hidden="true">↗</span>}>Yayına al</Button>
                  <Button variant="secondary">Notları aç</Button>
                  <Button variant="ghost">Sadece gözden geçir</Button>
                </div>
              </PreviewPanel>
              <PreviewPanel title="Yoğun CTA sırası">
                <div className="flex flex-wrap gap-3">
                  <Button size="sm" variant="secondary">Taslağı kaydet</Button>
                  <Button size="sm" loading loadingLabel="Derleniyor">
                    Paketle
                  </Button>
                  <Button size="sm" variant="ghost" rightIcon={<span aria-hidden="true">→</span>}>
                    Detay
                  </Button>
                </div>
              </PreviewPanel>
              <PreviewPanel title="Tam genişlikli görev">
                <div className="flex flex-col gap-3">
                  <Button fullWidth rightIcon={<span aria-hidden="true">→</span>}>
                    İnceleme akışını başlat
                  </Button>
                  <Button fullWidth variant="secondary">
                    Karşılaştırma görünümünü aç
                  </Button>
                </div>
              </PreviewPanel>
            </div>
          ),
        },
        {
          id: 'button-toolbar-density',
          eyebrow: 'Toolbar recipes',
          title: 'Araç çubuğu aksiyonları',
          description: 'Sık kullanılan filtre, export ve görünüm kaydet kalıpları için daha kompakt bir toolbar dili üretir.',
          badges: ['toolbar', 'compact', 'pairing'],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.1fr_0.9fr]">
              <PreviewPanel title="Yoğun toolbar satırı">
                <FilterBar>
                  <TextInput
                    label="Arama"
                    value={searchInputValue}
                    onValueChange={setSearchInputValue}
                    size="sm"
                    leadingVisual={<span aria-hidden="true">⌕</span>}
                  />
                  <Segmented
                    ariaLabel="Liste yoğunlugu"
                    selectionMode="single"
                    size="sm"
                    value={selectValue}
                    onValueChange={(nextValue) => setSelectValue(String(nextValue))}
                    items={[
                      { value: 'comfortable', label: 'Konforlu' },
                      { value: 'compact', label: 'Kompakt' },
                      { value: 'sharp', label: 'Keskin' },
                    ]}
                  />
                </FilterBar>
              </PreviewPanel>
              <PreviewPanel title="Aksiyon ayrımı">
                <div className="flex flex-col gap-3">
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="secondary">Dışa aktar</Button>
                    <Button size="sm" variant="secondary">Kopya al</Button>
                    <Button size="sm">Yeni varyant</Button>
                  </div>
                  <Text variant="secondary" className="block leading-7">
                    Birincil aksiyonu sona koyup ikincil aksiyonları aynı yoğunlukta tutmak toolbar okumasını belirginleştirir.
                  </Text>
                </div>
              </PreviewPanel>
            </div>
          ),
        },
        {
          id: 'button-directional-actions',
          eyebrow: 'Directional actions',
          title: 'Yönlendirmeli butonlar',
          description: 'Link benzeri ama daha güçlü vurgulu görev geçişleri için ikonlu ve pill hissi veren alternatifler sunar.',
          badges: ['directional', 'icon', 'modern'],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
              <PreviewPanel title="Önceki / sonraki">
                <div className="flex flex-wrap gap-3">
                  <Button variant="ghost" leftIcon={<span aria-hidden="true">←</span>}>Önceki blok</Button>
                  <Button rightIcon={<span aria-hidden="true">→</span>}>Sonraki blok</Button>
                </div>
              </PreviewPanel>
              <PreviewPanel title="İkon merkezli">
                <div className="flex flex-wrap gap-3">
                  <Button variant="secondary" leftIcon={<span aria-hidden="true">★</span>}>Favorilere ekle</Button>
                  <Button variant="ghost" leftIcon={<span aria-hidden="true">⤴</span>}>Paylaş</Button>
                </div>
              </PreviewPanel>
              <PreviewPanel title="Readonly / disabled">
                <div className="flex flex-wrap gap-3">
                  <Button access="readonly" variant="secondary">Readonly</Button>
                  <Button disabled variant="ghost">Disabled</Button>
                </div>
              </PreviewPanel>
            </div>
          ),
        },
        {
          id: 'button-decision-footer-lane',
          eyebrow: 'Decision footers',
          title: 'Karar footer aksiyonları',
          description: 'Modal, drawer ve review footer’larında birincil ve ikincil aksiyon ayrımını daha sakin bir düzenle gösterir.',
          badges: ['footer', 'decision', 'handoff'],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.1fr_0.9fr]">
              <PreviewPanel title="Review footer">
                <div className="rounded-[24px] border border-border-subtle bg-surface-default p-4">
                  <div className="flex flex-wrap items-center justify-end gap-3">
                    <Button variant="ghost">Evidencelari kapat</Button>
                    <Button variant="secondary">Notlari ac</Button>
                    <Button>Review'u tamamla</Button>
                  </div>
                </div>
              </PreviewPanel>
              <PreviewPanel title="Yorum">
                <Text variant="secondary" className="block leading-7">
                  Footer aksiyonlarinda destructive veya primary karari en saga sabitlemek, enterprise shell’lerde karar hizini artirir.
                </Text>
              </PreviewPanel>
            </div>
          ),
        },
        {
          id: 'button-status-chip-actions',
          eyebrow: 'Status-linked actions',
          title: 'Duruma bagli chip aksiyonlari',
          description: 'Kompakt ama premium gorunen, badge ve durum tonu ile esitlenen aksiyon varyantlarini gosterir.',
          badges: ['status', 'chip', 'compact'],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
              <PreviewPanel title="Stable">
                <div className="flex flex-wrap gap-3">
                  <Button size="sm" leftIcon={<Badge variant="success">ok</Badge>}>Deploy</Button>
                </div>
              </PreviewPanel>
              <PreviewPanel title="Warn">
                <div className="flex flex-wrap gap-3">
                  <Button size="sm" variant="secondary" leftIcon={<Badge variant="warning">2</Badge>}>Review</Button>
                </div>
              </PreviewPanel>
              <PreviewPanel title="Info">
                <div className="flex flex-wrap gap-3">
                  <Button size="sm" variant="ghost" rightIcon={<Badge variant="info">new</Badge>}>Docs'i ac</Button>
                </div>
              </PreviewPanel>
            </div>
          ),
        },
      ];
    case 'Select':
      return [
        {
          id: 'select-grouped-policy',
          eyebrow: 'Forms & data entry',
          title: 'Gruplu seçim matrisi',
          description: 'Ant Design ve Chakra çizgisindeki option group yaklaşımını daha açıklamalı helper semantiğiyle gösterir.',
          badges: ['grouped', 'helper', 'policy'],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.05fr_0.95fr]">
              <PreviewPanel title="Gruplu field shell">
                <Select
                  label="Yüzey yoğunluğu"
                  description="Kullanıcının tercih ettiği yoğunluk dilini belirler."
                  value={selectValue}
                  onValueChange={setSelectValue}
                  clearable
                  emptyOptionLabel="Varsayılan seçimi kullan"
                  options={[
                    {
                      value: 'comfortable',
                      label: 'Konforlu',
                      description: 'Daha geniş spacing ve okunabilir ritim.',
                      metaLabel: 'Default',
                      tone: 'info',
                    },
                    {
                      value: 'compact',
                      label: 'Kompakt',
                      description: 'Yoğun liste ve araç çubuğu kullanımına uygun.',
                      metaLabel: 'Dense',
                      tone: 'warning',
                    },
                    {
                      value: 'sharp',
                      label: 'Keskin',
                      description: 'Daha sıkı ve sert bir enterprise tonu.',
                      metaLabel: 'Policy',
                      tone: 'danger',
                    },
                  ]}
                  emptyStateLabel="Henüz seçim yapılmadı; varsayılan sistem davranışı kullanılacak."
                />
              </PreviewPanel>
              <PreviewPanel title="Kural">
                <Text variant="secondary" className="block leading-7">
                  Gruplu seçenekler özellikle aynı alan içinde hem günlük hem de ileri seviye ayarları birlikte sunarken bilişsel yükü azaltır.
                </Text>
              </PreviewPanel>
            </div>
          ),
        },
        {
          id: 'select-compact-filter-row',
          eyebrow: 'Search & filter',
          title: 'Kompakt filtre satırı',
          description: 'Araç çubuklarında select, segmented ve CTA kombinasyonunu gösteren daha modern bir filter-row alternatifi üretir.',
          badges: ['filter-row', 'compact', 'toolbar'],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <PreviewPanel title="Sıkı filtre kombinasyonu">
                <FilterBar>
                  <TextInput
                    label="Hızlı arama"
                    value={searchInputValue}
                    onValueChange={setSearchInputValue}
                    size="sm"
                    leadingVisual={<span aria-hidden="true">⌕</span>}
                  />
                  <Select
                    label="Yoğunluk"
                    size="sm"
                    value={selectValue}
                    onValueChange={setSelectValue}
                    options={[
                      { value: 'comfortable', label: 'Konforlu' },
                      { value: 'compact', label: 'Kompakt' },
                      { value: 'sharp', label: 'Keskin' },
                    ]}
                  />
                </FilterBar>
              </PreviewPanel>
              <PreviewPanel title="Yorum">
                <Text variant="secondary" className="block leading-7">
                  Select alanını toolbar içinde kullandığımızda `size=sm` ve clearable/empty-state kombinasyonu daha okunabilir bir enterprise filtre dili veriyor.
                </Text>
              </PreviewPanel>
            </div>
          ),
        },
        {
          id: 'select-readonly-governed',
          eyebrow: 'Governed forms',
          title: 'Readonly ve yönetişim',
          description: 'Readonly, disabled reason ve yardımcı metin üretimini aynı anda gösteren daha kontrollü bir field alternatifi sunar.',
          badges: ['readonly', 'governance', 'access'],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
              <PreviewPanel title="Readonly karar">
                <Select
                  label="Yayın penceresi"
                  value="release-window"
                  access="readonly"
                  options={[
                    { value: 'release-window', label: 'Release window', description: 'Sistem tarafından yönetiliyor.' },
                  ]}
                  hint="Bu alan yalnız release owner tarafından düzenlenebilir."
                />
              </PreviewPanel>
              <PreviewPanel title="Disabled seçenek">
                <Select
                  label="Approval lane"
                  defaultValue="standard"
                  options={[
                    { value: 'standard', label: 'Standard lane' },
                    { value: 'regulated', label: 'Regulated lane', disabled: true, disabledReason: 'Bu lane yalnız compliance repoları için açılır.' },
                  ]}
                />
              </PreviewPanel>
              <PreviewPanel title="Boş durum">
                <Select
                  label="Opsiyonel bağlam"
                  clearable
                  placeholder="Yüzey seç"
                  emptyStateLabel="İsteğe bağlı olduğu için seçim yapmadan devam edebilirsin."
                  options={[
                    { value: 'workspace', label: 'Workspace context' },
                    { value: 'portfolio', label: 'Portfolio context' },
                  ]}
                />
              </PreviewPanel>
            </div>
          ),
        },
        {
          id: 'select-inline-owner-routing',
          eyebrow: 'Routing & ownership',
          title: 'Inline owner routing',
          description: 'Owner, lane ve route kararlarini tek satirda yoneten daha operasyonel bir select varyanti sunar.',
          badges: ['owner', 'routing', 'inline'],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.1fr_0.9fr]">
              <PreviewPanel title="Owner route">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr_auto]">
                  <Select
                    label="Owner"
                    size="sm"
                    value={selectValue}
                    onValueChange={setSelectValue}
                    options={[
                      { value: 'platform', label: 'Platform UI', metaLabel: 'Core', tone: 'info' },
                      { value: 'governance', label: 'Governance desk', metaLabel: 'Policy', tone: 'warning' },
                      { value: 'content', label: 'Content ops', metaLabel: 'Ops', tone: 'muted' },
                    ]}
                  />
                  <Select
                    label="Lane"
                    size="sm"
                    defaultValue="review"
                    options={[
                      { value: 'review', label: 'Review lane', metaLabel: 'Human', tone: 'warning' },
                      { value: 'delivery', label: 'Delivery lane', metaLabel: 'Ship', tone: 'success' },
                      { value: 'support', label: 'Support lane', metaLabel: 'Ops', tone: 'muted' },
                    ]}
                  />
                  <Button size="sm" className="sm:self-end">Ata</Button>
                </div>
              </PreviewPanel>
              <PreviewPanel title="Kural">
                <Text variant="secondary" className="block leading-7">
                  Birden fazla select yan yana kullanildiginda her birinin label ve helper’ini koruyup CTA’yi sonda tutmak daha okunabilir bir ownership shell’i verir.
                </Text>
              </PreviewPanel>
            </div>
          ),
        },
        {
          id: 'select-stateful-compact-stack',
          eyebrow: 'Compact stacks',
          title: 'Durum odakli compact stack',
          description: 'Badge, helper ve readonly/clearable davranislarini daha yogun bir decision stack’te birlikte gosterir.',
          badges: ['compact', 'stateful', 'stack'],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
              <PreviewPanel title="Draft">
                <Select
                  label="State"
                  size="sm"
                  defaultValue="draft"
                  options={[
                    { value: 'draft', label: 'Draft', description: 'Henuz reviewe cikmadi.', metaLabel: 'WIP', tone: 'muted' },
                    { value: 'ready', label: 'Ready', description: 'Reviewe uygun.', metaLabel: 'Go', tone: 'success' },
                  ]}
                />
              </PreviewPanel>
              <PreviewPanel title="Clearable">
                <Select
                  label="Opsiyonel lane"
                  size="sm"
                  clearable
                  emptyOptionLabel="Atama yok"
                  options={[
                    { value: 'ops', label: 'Ops lane' },
                    { value: 'ux', label: 'UX lane' },
                  ]}
                />
              </PreviewPanel>
              <PreviewPanel title="Readonly">
                <Select
                  label="Managed scope"
                  size="sm"
                  value="core"
                  access="readonly"
                  options={[
                    { value: 'core', label: 'Core managed', metaLabel: 'Locked', tone: 'muted' },
                  ]}
                  hint="Bu alan release kontrati tarafindan yonetiliyor."
                />
              </PreviewPanel>
            </div>
          ),
        },
        {
          id: 'select-combobox-upgrade-path',
          eyebrow: 'Select family',
          title: 'Select -> Combobox upgrade path',
          description: 'Base UI, Ark UI ve Chakra benchmark kararlarina gore native select ile searchable combobox arasindaki canonical ayrimi gosterir.',
          badges: ['native', 'combobox', 'upgrade-path'],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <PreviewPanel title="Committed native select">
                <Select
                  label="Owner"
                  description="Arama gerekmeyen kisa owner listelerinde native popup canonical kalir."
                  defaultValue="platform"
                  options={[
                    { value: 'platform', label: 'Platform UI', metaLabel: 'Core', tone: 'info' },
                    { value: 'governance', label: 'Governance desk', metaLabel: 'Policy', tone: 'warning' },
                    { value: 'content', label: 'Content ops', metaLabel: 'Ops', tone: 'muted' },
                  ]}
                />
              </PreviewPanel>
              <PreviewPanel title="Searchable combobox">
                <Combobox
                  label="Owner"
                  description="Arama, keyword ve daha zengin popup anatomy’si gerektiginde combobox'a gec."
                  defaultValue="governance"
                  defaultInputValue="Governance desk"
                  options={[
                    {
                      label: 'Core teams',
                      options: [
                        {
                          value: 'platform',
                          label: 'Platform UI',
                          description: 'Core design system ve release governance sahibi.',
                          keywords: ['platform', 'design', 'release'],
                        },
                        {
                          value: 'governance',
                          label: 'Governance desk',
                          description: 'Compliance ve policy escalation akislarini yonetir.',
                          keywords: ['policy', 'compliance', 'review'],
                        },
                        {
                          value: 'content',
                          label: 'Content ops',
                          description: 'Operational content ve knowledge handoff akislarini toplar.',
                          keywords: ['content', 'handoff', 'ops'],
                        },
                      ],
                    },
                  ]}
                  clearable
                  emptyStateLabel="Bir owner secilmedi"
                />
              </PreviewPanel>
            </div>
          ),
        },
      ];
    case 'TextInput':
      return [
        {
          id: 'text-input-profile',
          eyebrow: t('designlab.showcase.component.textInput.sections.profile.eyebrow'),
          title: t('designlab.showcase.component.textInput.sections.profile.title'),
          description: t('designlab.showcase.component.textInput.sections.profile.description'),
          badges: [
            t('designlab.showcase.component.textInput.sections.profile.badge.form'),
            t('designlab.showcase.component.textInput.sections.profile.badge.stable'),
            t('designlab.showcase.component.textInput.sections.profile.badge.count'),
          ],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.15fr_0.85fr]">
              <PreviewPanel title={t('designlab.showcase.component.textInput.sections.profile.panelFilled')}>
                <TextInput
                  label={t('designlab.showcase.component.textInput.live.primary.label')}
                  description={t('designlab.showcase.component.textInput.live.primary.description')}
                  hint={t('designlab.showcase.component.textInput.live.primary.hint')}
                  value={textInputValue}
                  maxLength={32}
                  showCount
                  onValueChange={setTextInputValue}
                  leadingVisual={<span aria-hidden="true">@</span>}
                />
              </PreviewPanel>
              <PreviewPanel title={t('designlab.showcase.component.textInput.sections.profile.panelGuideline')}>
                <Text variant="secondary" className="block leading-7">
                  {t('designlab.showcase.component.textInput.sections.profile.guideline')}
                </Text>
              </PreviewPanel>
            </div>
          ),
        },
        {
          id: 'text-input-search',
          eyebrow: t('designlab.showcase.component.textInput.sections.search.eyebrow'),
          title: t('designlab.showcase.component.textInput.sections.search.title'),
          description: t('designlab.showcase.component.textInput.sections.search.description'),
          badges: [
            t('designlab.showcase.component.textInput.sections.search.badge.search'),
            t('designlab.showcase.component.textInput.sections.search.badge.compact'),
            t('designlab.showcase.component.textInput.sections.search.badge.leadingIcon'),
          ],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <PreviewPanel title={t('designlab.showcase.component.textInput.sections.search.panelSearch')}>
                <TextInput
                  label={t('designlab.showcase.component.textInput.sections.search.searchLabel')}
                  description={t('designlab.showcase.component.textInput.sections.search.searchDescription')}
                  value={searchInputValue}
                  onValueChange={setSearchInputValue}
                  size="sm"
                  leadingVisual={<span aria-hidden="true">⌕</span>}
                  trailingVisual={<SectionBadge label="⌘K" />}
                />
              </PreviewPanel>
              <PreviewPanel title={t('designlab.showcase.component.textInput.sections.search.panelFilterRow')}>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto]">
                  <TextInput
                    label={t('designlab.showcase.component.textInput.sections.search.quickFilterLabel')}
                    defaultValue="policy"
                    size="sm"
                    fullWidth
                    leadingVisual={<span aria-hidden="true">⌕</span>}
                  />
                  <Button variant="secondary" className="sm:self-end">
                    {t('designlab.showcase.component.textInput.sections.search.apply')}
                  </Button>
                </div>
              </PreviewPanel>
            </div>
          ),
        },
        {
          id: 'text-input-validation',
          eyebrow: t('designlab.showcase.component.textInput.sections.validation.eyebrow'),
          title: t('designlab.showcase.component.textInput.sections.validation.title'),
          description: t('designlab.showcase.component.textInput.sections.validation.description'),
          badges: [
            t('designlab.showcase.component.textInput.sections.validation.badge.validation'),
            t('designlab.showcase.component.textInput.sections.validation.badge.readonly'),
            t('designlab.showcase.component.textInput.sections.validation.badge.error'),
          ],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
              <PreviewPanel title={t('designlab.showcase.component.textInput.sections.validation.panelValidated')}>
                <TextInput
                  label={t('designlab.showcase.component.textInput.live.stateMatrix.validatedLabel')}
                  defaultValue="nova.user"
                  trailingVisual={<span aria-hidden="true">✓</span>}
                />
              </PreviewPanel>
              <PreviewPanel title={t('designlab.showcase.component.textInput.sections.validation.panelInvalid')}>
                <TextInput
                  label={t('designlab.showcase.component.textInput.live.stateMatrix.invalidLabel')}
                  defaultValue="!"
                  invalid
                  error={t('designlab.showcase.component.textInput.live.stateMatrix.invalidError')}
                />
              </PreviewPanel>
              <PreviewPanel title={t('designlab.showcase.component.textInput.sections.validation.panelReadonly')}>
                <TextInput
                  label={t('designlab.showcase.component.textInput.live.stateMatrix.readonlyLabel')}
                  defaultValue="system-generated"
                  access="readonly"
                />
              </PreviewPanel>
            </div>
          ),
        },
        {
          id: 'text-input-density',
          eyebrow: t('designlab.showcase.component.textInput.sections.density.eyebrow'),
          title: t('designlab.showcase.component.textInput.sections.density.title'),
          description: t('designlab.showcase.component.textInput.sections.density.description'),
          badges: [
            t('designlab.showcase.component.textInput.sections.density.badge.sm'),
            t('designlab.showcase.component.textInput.sections.density.badge.md'),
            t('designlab.showcase.component.textInput.sections.density.badge.lg'),
          ],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
              <PreviewPanel title={t('designlab.showcase.component.textInput.sections.density.panelSmall')}>
                <TextInput label={t('designlab.showcase.component.textInput.sections.density.smallLabel')} defaultValue="sm-density" size="sm" />
              </PreviewPanel>
              <PreviewPanel title={t('designlab.showcase.component.textInput.sections.density.panelMedium')}>
                <TextInput label={t('designlab.showcase.component.textInput.sections.density.mediumLabel')} defaultValue="md-density" size="md" />
              </PreviewPanel>
              <PreviewPanel title={t('designlab.showcase.component.textInput.sections.density.panelLarge')}>
                <TextInput
                  label={t('designlab.showcase.component.textInput.sections.density.largeLabel')}
                  defaultValue="lg-density"
                  size="lg"
                  trailingVisual={<span aria-hidden="true">→</span>}
                />
              </PreviewPanel>
            </div>
          ),
        },
        {
          id: 'text-input-invite',
          eyebrow: t('designlab.showcase.component.textInput.sections.invite.eyebrow'),
          title: t('designlab.showcase.component.textInput.sections.invite.title'),
          description: t('designlab.showcase.component.textInput.sections.invite.description'),
          badges: [
            t('designlab.showcase.component.textInput.sections.invite.badge.actionPair'),
            t('designlab.showcase.component.textInput.sections.invite.badge.cta'),
            t('designlab.showcase.component.textInput.sections.invite.badge.taskFlow'),
          ],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_auto]">
              <PreviewPanel title={t('designlab.showcase.component.textInput.sections.invite.panelInput')}>
                <TextInput
                  label={t('designlab.showcase.component.textInput.sections.invite.label')}
                  description={t('designlab.showcase.component.textInput.sections.invite.descriptionShort')}
                  value={inviteInputValue}
                  onValueChange={setInviteInputValue}
                  type="email"
                  leadingVisual={<span aria-hidden="true">✉</span>}
                  trailingVisual={<Badge variant="info">{t('designlab.showcase.component.textInput.sections.invite.pending')}</Badge>}
                />
              </PreviewPanel>
              <div className="flex items-end">
                <Button fullWidth={false} rightIcon={<span aria-hidden="true">→</span>}>
                  {t('designlab.showcase.component.textInput.sections.invite.send')}
                </Button>
              </div>
            </div>
          ),
        },
        {
          id: 'text-input-access',
          eyebrow: t('designlab.showcase.component.textInput.sections.access.eyebrow'),
          title: t('designlab.showcase.component.textInput.sections.access.title'),
          description: t('designlab.showcase.component.textInput.sections.access.description'),
          badges: [
            t('designlab.showcase.component.textInput.sections.access.badge.access'),
            t('designlab.showcase.component.textInput.sections.access.badge.policy'),
            t('designlab.showcase.component.textInput.sections.access.badge.governance'),
          ],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
              <PreviewPanel title={t('designlab.showcase.component.textInput.sections.access.panelReadonly')}>
                <TextInput
                  label={t('designlab.showcase.component.textInput.sections.access.readonlyLabel')}
                  defaultValue="release-window"
                  access="readonly"
                  hint={t('designlab.showcase.component.textInput.sections.access.readonlyHint')}
                />
              </PreviewPanel>
              <PreviewPanel title={t('designlab.showcase.component.textInput.sections.access.panelDisabled')}>
                <TextInput
                  label={t('designlab.showcase.component.textInput.sections.access.disabledLabel')}
                  defaultValue="publish-locked"
                  access="disabled"
                  hint={t('designlab.showcase.component.textInput.sections.access.disabledHint')}
                />
              </PreviewPanel>
              <PreviewPanel title={t('designlab.showcase.component.textInput.sections.access.panelRule')}>
                <Text variant="secondary" className="block leading-7">
                  {t('designlab.showcase.component.textInput.sections.access.rule')}
                </Text>
              </PreviewPanel>
            </div>
          ),
        },
        {
          id: 'text-input-command-bar',
          eyebrow: 'Search & command',
          title: 'Komut ve filtre satiri',
          description: 'Arama, slug ve yardimci utility alanlarini ayni satirda gosteren daha modern bir toolbar field alternatifi uretir.',
          badges: ['command', 'toolbar', 'compact'],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.15fr_0.85fr]">
              <PreviewPanel title="Kompakt komut satiri">
                <div className="flex flex-col gap-3">
                  <TextInput
                    label="Komut ara"
                    description="Bilesen, recipe veya owner bazli hizli arama."
                    value={searchInputValue}
                    onValueChange={setSearchInputValue}
                    size="sm"
                    leadingVisual={<span aria-hidden="true">⌕</span>}
                    trailingVisual={<SectionBadge label="⌘K" />}
                  />
                  <TextInput
                    label="Anchor slug"
                    defaultValue="anchor-toc"
                    size="sm"
                    hint="Docs, preview ve policy derin linkleri icin kullanilir."
                    trailingVisual={<Badge variant="info">stable</Badge>}
                  />
                </div>
              </PreviewPanel>
              <PreviewPanel title="Kural">
                <Text variant="secondary" className="block leading-7">
                  Komut odakli input satirlarinda aciklama yogunlugunu dusurup trailing utility alanini net tutmak daha modern bir enterprise toolbar dili verir.
                </Text>
              </PreviewPanel>
            </div>
          ),
        },
        {
          id: 'text-input-inline-edit-shell',
          eyebrow: 'Inline editing',
          title: 'Inline edit shell',
          description: 'Baslik, slug ve helper bilgisini ayni satirda tutan daha dokuman-odakli bir duzenleme yuzeyi sunar.',
          badges: ['inline-edit', 'slug', 'docs'],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.15fr_0.85fr]">
              <PreviewPanel title="Inline edit">
                <div className="grid grid-cols-1 gap-3">
                  <TextInput
                    label="Baslik"
                    defaultValue="Detail Section Tabs"
                    hint="Public component adı"
                  />
                  <TextInput
                    label="Slug"
                    defaultValue="detail-section-tabs"
                    size="sm"
                    leadingVisual={<span aria-hidden="true">#</span>}
                    trailingVisual={<Badge variant="info">stable</Badge>}
                  />
                </div>
              </PreviewPanel>
              <PreviewPanel title="Yorum">
                <Text variant="secondary" className="block leading-7">
                  Inline edit shell’lerinde ust alanlari kisa tutup helper’lari ikinci satira almak, uzun form hissini azaltir.
                </Text>
              </PreviewPanel>
            </div>
          ),
        },
        {
          id: 'text-input-evidence-search',
          eyebrow: 'Evidence search',
          title: 'Kanit arama girisi',
          description: 'Audit, citation ve issue ID aramasini ayni utility dilinde gosteren daha odakli bir field alternatifi uretir.',
          badges: ['evidence', 'search', 'audit'],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
              <PreviewPanel title="Audit">
                <TextInput
                  label="Audit ID"
                  defaultValue="audit-review"
                  size="sm"
                  leadingVisual={<span aria-hidden="true">⌕</span>}
                />
              </PreviewPanel>
              <PreviewPanel title="Citation">
                <TextInput
                  label="Citation"
                  defaultValue="policy-4-2"
                  size="sm"
                  trailingVisual={<SectionBadge label="source" />}
                />
              </PreviewPanel>
              <PreviewPanel title="Issue">
                <TextInput
                  label="Issue"
                  defaultValue="SEO-GEO-12"
                  size="sm"
                  trailingVisual={<Badge variant="warning">open</Badge>}
                />
              </PreviewPanel>
            </div>
          ),
        },
      ];
    case 'FilterBar':
      return [
        {
          id: 'filter-bar-toolbar-shell',
          eyebrow: t('designlab.showcase.component.filterBar.sections.toolbar.eyebrow'),
          title: t('designlab.showcase.component.filterBar.sections.toolbar.title'),
          description: t('designlab.showcase.component.filterBar.sections.toolbar.description'),
          badges: [
            t('designlab.showcase.component.filterBar.sections.toolbar.badge.filters'),
            t('designlab.showcase.component.filterBar.sections.toolbar.badge.stable'),
            t('designlab.showcase.component.filterBar.sections.toolbar.badge.toolbar'),
          ],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.1fr_0.9fr]">
              <PreviewPanel title={t('designlab.showcase.component.filterBar.sections.toolbar.panelControlled')}>
                <div className="rounded-[24px] border border-border-subtle bg-surface-panel p-4 shadow-xs">
                  <FilterBar>
                    <TextInput
                      label={t('designlab.showcase.component.filterBar.sections.toolbar.fields.search')}
                      value={searchInputValue}
                      onValueChange={setSearchInputValue}
                      size="sm"
                    />
                    <Select
                      label={t('designlab.showcase.component.filterBar.sections.toolbar.fields.density')}
                      size="sm"
                      value={selectValue}
                      onValueChange={(value) => setSelectValue(String(value))}
                      options={[
                        { label: t('designlab.showcase.component.filterBar.sections.toolbar.options.comfortable'), value: 'comfortable' },
                        { label: t('designlab.showcase.component.filterBar.sections.toolbar.options.compact'), value: 'compact' },
                      ]}
                    />
                    <Checkbox
                      label={t('designlab.showcase.component.filterBar.sections.toolbar.fields.activeOnly')}
                      checked={checkboxValue}
                      onCheckedChange={setCheckboxValue}
                    />
                  </FilterBar>
                </div>
              </PreviewPanel>
              <PreviewPanel title={t('designlab.showcase.component.filterBar.sections.toolbar.panelState')}>
                <LibraryMetricCard
                  label={t('designlab.showcase.component.filterBar.sections.toolbar.metric.label')}
                  value={dropdownAction}
                  note={t('designlab.showcase.component.filterBar.sections.toolbar.metric.note')}
                />
              </PreviewPanel>
            </div>
          ),
        },
        {
          id: 'filter-bar-readonly-shell',
          eyebrow: t('designlab.showcase.component.filterBar.sections.readonly.eyebrow'),
          title: t('designlab.showcase.component.filterBar.sections.readonly.title'),
          description: t('designlab.showcase.component.filterBar.sections.readonly.description'),
          badges: [
            t('designlab.showcase.component.filterBar.sections.readonly.badge.readonly'),
            t('designlab.showcase.component.filterBar.sections.readonly.badge.policy'),
            t('designlab.showcase.component.filterBar.sections.readonly.badge.state'),
          ],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <PreviewPanel title={t('designlab.showcase.component.filterBar.sections.readonly.panelReadonly')}>
                <div className="rounded-[24px] border border-border-subtle bg-surface-panel p-4 shadow-xs">
                  <FilterBar>
                    <TextInput
                      label={t('designlab.showcase.component.filterBar.sections.readonly.fields.search')}
                      value="ui-kit"
                      size="sm"
                      access="readonly"
                    />
                    <Select
                      label={t('designlab.showcase.component.filterBar.sections.readonly.fields.scope')}
                      size="sm"
                      value="shared"
                      options={[{ label: t('designlab.showcase.component.filterBar.sections.readonly.options.shared'), value: 'shared' }]}
                      access="readonly"
                    />
                  </FilterBar>
                </div>
              </PreviewPanel>
              <PreviewPanel title={t('designlab.showcase.component.filterBar.sections.readonly.panelGuideline')}>
                <Text variant="secondary" className="block leading-7">
                  {t('designlab.showcase.component.filterBar.sections.readonly.guideline')}
                </Text>
              </PreviewPanel>
            </div>
          ),
        },
        {
          id: 'filter-bar-search-query',
          eyebrow: 'Search, filter & query',
          title: 'Query odaklı filtre satırı',
          description: 'Segmented, select ve search alanını aynı toolbar içinde daha modern bir query yüzeyi olarak birleştirir.',
          badges: ['query', 'segmented', 'search-toolbar'],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.1fr_0.9fr]">
              <PreviewPanel title="Query toolbar">
                <div className="rounded-[24px] border border-border-subtle bg-surface-panel p-4 shadow-xs">
                  <FilterBar>
                    <Segmented
                      ariaLabel="Liste modu"
                      selectionMode="single"
                      size="sm"
                      value={selectValue}
                      onValueChange={(nextValue) => setSelectValue(String(nextValue))}
                      items={[
                        { value: 'comfortable', label: 'Katalog' },
                        { value: 'compact', label: 'Yoğun' },
                        { value: 'sharp', label: 'İnceleme' },
                      ]}
                    />
                    <TextInput
                      label="Arama"
                      value={searchInputValue}
                      onValueChange={setSearchInputValue}
                      size="sm"
                      leadingVisual={<span aria-hidden="true">⌕</span>}
                    />
                    <Checkbox
                      label="Sadece yayınlanabilir"
                      checked={checkboxValue}
                      onCheckedChange={setCheckboxValue}
                    />
                  </FilterBar>
                </div>
              </PreviewPanel>
              <PreviewPanel title="Yorum">
                <Text variant="secondary" className="block leading-7">
                  Arama, görünüm modu ve policy filtresini aynı satırda toplamak özellikle kütüphane kataloglarında keşif hızını yükseltir.
                </Text>
              </PreviewPanel>
            </div>
          ),
        },
        {
          id: 'filter-bar-saved-view-stack',
          eyebrow: 'Saved views',
          title: 'Kaydedilmis gorunum satiri',
          description: 'View secimi, arama ve owner filtresini tek saved-view shell’i icinde toplar.',
          badges: ['saved-view', 'owner', 'toolbar'],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.15fr_0.85fr]">
              <PreviewPanel title="Saved view toolbar">
                <div className="rounded-[24px] border border-border-subtle bg-surface-panel p-4 shadow-xs">
                  <FilterBar>
                    <Select
                      label="Gorunum"
                      size="sm"
                      value={selectValue}
                      onValueChange={(value) => setSelectValue(String(value))}
                      options={[
                        { label: 'All views', value: 'all' },
                        { label: 'Ops triage', value: 'ops' },
                        { label: 'Governance queue', value: 'governance' },
                      ]}
                    />
                    <TextInput
                      label="Arama"
                      value={searchInputValue}
                      onValueChange={setSearchInputValue}
                      size="sm"
                      leadingVisual={<span aria-hidden="true">⌕</span>}
                    />
                    <Button size="sm" variant="secondary">Gorunumu ac</Button>
                  </FilterBar>
                </div>
              </PreviewPanel>
              <PreviewPanel title="Not">
                <Text variant="secondary" className="block leading-7">
                  Saved-view shell’lerinde ilk secim gorunumu acmak, geri kalan filter alanlarini ikincil tutmak daha net bir bilgi mimarisi verir.
                </Text>
              </PreviewPanel>
            </div>
          ),
        },
        {
          id: 'filter-bar-compliance-queue',
          eyebrow: 'Compliance queue',
          title: 'Compliance filtre satiri',
          description: 'Policy state, evidence readiness ve owner filtrelerini tek governance toolbar’inda toplar.',
          badges: ['compliance', 'evidence', 'queue'],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <PreviewPanel title="Governance toolbar">
                <div className="rounded-[24px] border border-border-subtle bg-surface-panel p-4 shadow-xs">
                  <FilterBar>
                    <Select
                      label="Policy state"
                      size="sm"
                      value={selectValue}
                      onValueChange={(value) => setSelectValue(String(value))}
                      options={[
                        { label: 'All', value: 'all' },
                        { label: 'Ready', value: 'ready' },
                        { label: 'Needs waiver', value: 'waiver' },
                      ]}
                    />
                    <Checkbox
                      label="Sadece evidence eksik"
                      checked={checkboxValue}
                      onCheckedChange={setCheckboxValue}
                    />
                    <TextInput
                      label="Owner"
                      defaultValue="Governance"
                      size="sm"
                    />
                  </FilterBar>
                </div>
              </PreviewPanel>
              <PreviewPanel title="Durum">
                <LibraryMetricCard
                  label="Queue state"
                  value={dropdownAction}
                  note="Saved view, waiver ve evidence filtreleri ayni toolbar shell’inde birlesiyor."
                />
              </PreviewPanel>
            </div>
          ),
        },
      ];
    default:
      return null;
  }
};
