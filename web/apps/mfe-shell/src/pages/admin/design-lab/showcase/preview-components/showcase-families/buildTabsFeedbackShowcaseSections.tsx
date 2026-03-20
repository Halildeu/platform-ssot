import React from 'react';
import {
  Alert,
  Badge,
  Button,
  Tabs,
  Text,
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

type TabsFeedbackShowcaseContext = {
  PreviewPanel: PreviewPanelComponent;
  t: DesignLabTranslate;
  dropdownAction: string;
  setDropdownAction: (nextValue: string) => void;
  setTabsValue: (nextValue: string) => void;
  tabsValue: string;
};

export const buildTabsFeedbackShowcaseSections = (
  componentName: string,
  context: TabsFeedbackShowcaseContext,
): ComponentShowcaseSection[] | null => {
  const {
    PreviewPanel,
    dropdownAction,
    setDropdownAction,
    setTabsValue,
    tabsValue,
  } = context;

  switch (componentName) {
    case 'Tabs':
      return [
        {
          id: 'tabs-scroll-nav',
          eyebrow: 'Navigation & wayfinding',
          title: 'Kaydirilabilir ust gezinme',
          description: 'MUI scrollable tabs ve Ant navigation kaliplarina yakin, cok sekmeli calisma alani gezinmesini gosterir.',
          badges: ['scrollable', 'navigation', 'workspace'],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.15fr_0.85fr]">
              <PreviewPanel title="Uzun sekme listesi">
                <Tabs
                  activeKey={tabsValue}
                  onChange={setTabsValue}
                  variant="scrollable"
                  listLabel="Workspace gezinmesi"
                  items={[
                    { key: 'overview', label: 'Overview', content: <Text variant="secondary">Genel karar yuzeyi.</Text> },
                    { key: 'activity', label: 'Activity', content: <Text variant="secondary">Olay akisi ve son hareketler.</Text> },
                    { key: 'preview', label: 'Preview', badge: <Badge tone="info">2</Badge>, content: <Text variant="secondary">Canli onizleme alani.</Text> },
                    { key: 'api', label: 'API', content: <Text variant="secondary">Prop ve durum modeli.</Text> },
                    { key: 'quality', label: 'Quality', content: <Text variant="secondary">Gate ve regresyon kanitlari.</Text> },
                    { key: 'migration', label: 'Migration', content: <Text variant="secondary">Adoption ve gecis plani.</Text> },
                  ]}
                />
              </PreviewPanel>
              <PreviewPanel title="Kural">
                <Text variant="secondary" className="block leading-7">
                  Sekme sayisi arttiginda wrap yerine yatay scroll tercih etmek, icerik alaninin yuksekligini sabit tutar ve karar yuzeyini daha ongorulebilir hale getirir. `getTabLinkProps` ile ayni yuzey route-aware tabset gibi de davranabilir.
                </Text>
              </PreviewPanel>
            </div>
          ),
        },
        {
          id: 'tabs-manual-router-review',
          eyebrow: 'Activation semantics',
          title: 'Manual activation ve non-loop review',
          description: 'React Aria ve Base UI benchmark’ina yakin, router-aware ama kontrollu klavye aktivasyonlu sekme davranisini gosterir.',
          badges: ['manual', 'router-aware', 'non-loop'],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.05fr_0.95fr]">
              <PreviewPanel title="Review lane">
                <Tabs
                  variant="pill"
                  activeKey={tabsValue}
                  onChange={setTabsValue}
                  listLabel="Review workspace"
                  items={[
                    {
                      key: 'overview',
                      label: 'Overview',
                      description: 'Focus hareketi ile panel aktivasyonunu ayirir.',
                      content: <Text variant="secondary">Review ozet ve karar cercevesi.</Text>,
                    },
                    {
                      key: 'preview',
                      label: 'Evidence',
                      description: 'Source ve citation stack.',
                      badge: <Badge tone="warning">manual</Badge>,
                      content: <Text variant="secondary">Evidence lane klavye ile kontrollu acilir.</Text>,
                    },
                    {
                      key: 'api',
                      label: 'Handoff',
                      description: 'Consumer teslim maddeleri.',
                      content: <Text variant="secondary">Handoff checklist ve release notlari.</Text>,
                    },
                  ]}
                />
              </PreviewPanel>
              <PreviewPanel title="Neden canonical?">
                <Text variant="secondary" className="block leading-7">
                  Review ve governance akislari, ok tuslariyla gezinirken paneli hemen degistirmemeyi tercih edebilir. `loopFocus=false` de son sekmeden basa sarma davranisini kapatarak daha kontrollu bir IA hissi verir.
                </Text>
              </PreviewPanel>
            </div>
          ),
        },
        {
          id: 'tabs-pill-workspace',
          eyebrow: 'Workspace shells',
          title: 'Pill calisma alani',
          description: 'Badge, aciklama ve ekstra aksiyonla daha urunlesmis bir workspace tab dili uretir.',
          badges: ['pill', 'badge', 'extra-actions'],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <PreviewPanel title="Pill ve extra content">
                <Tabs
                  variant="pill"
                  activeKey={tabsValue}
                  onChange={setTabsValue}
                  listLabel="Detail workspace"
                  items={[
                    {
                      key: 'overview',
                      label: 'Genel',
                      description: 'Kimlik, durum ve hizli karar cercevesi',
                      badge: <Badge tone="muted">1</Badge>,
                      content: <Text variant="secondary">Ozet metrikler ve owner bilgileri.</Text>,
                    },
                    {
                      key: 'preview',
                      label: 'Onizleme',
                      description: 'Canli demo ve varyant yuzeyi',
                      badge: <Badge tone="success">live</Badge>,
                      content: <Text variant="secondary">Tek aktif calisma alaninda demo ve recete gorunumu.</Text>,
                    },
                    {
                      key: 'api',
                      label: 'API',
                      description: 'Ice aktarma, props ve durum modeli',
                      badge: <Badge tone="info">14</Badge>,
                      content: <Text variant="secondary">Prop sozlesmesi ve kullanim ornekleri.</Text>,
                    },
                  ]}
                />
              </PreviewPanel>
              <PreviewPanel title="Yorum">
                <Text variant="secondary" className="block leading-7">
                  Aciklamali pill tabs, ozellikle detail workspace yuzeylerinde breadcrumb ile icerik arasinda ara bir yon bulma katmani olarak iyi calisir.
                </Text>
              </PreviewPanel>
            </div>
          ),
        },
        {
          id: 'tabs-editable-review',
          eyebrow: 'Review flows',
          title: 'Editable inceleme akisi',
          description: 'Closable ve addable tab davranisi ile belge / oturum tabanli review senaryosu gosterir.',
          badges: ['editable', 'closable', 'review'],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_1fr]">
              <PreviewPanel title="Oturum sekmeleri">
                <Tabs
                  variant="pill"
                  onCloseTab={(key: string) => setDropdownAction(`Kapatilan sekme: ${key}`)}
                  defaultActiveKey="draft"
                  listLabel="Review oturumlari"
                  items={[
                    { key: 'draft', label: 'Taslak', closable: true, content: <Text variant="secondary">Taslak review notlari.</Text> },
                    { key: 'handoff', label: 'Handoff', closable: true, content: <Text variant="secondary">Consumer handoff kontrol listesi.</Text> },
                    { key: 'evidence', label: 'Kanit', closable: true, content: <Text variant="secondary">Smoke, visual ve policy ciktilari.</Text> },
                  ]}
                />
              </PreviewPanel>
              <PreviewPanel title="Son aksiyon">
                <LibraryMetricCard
                  label="Sekme aksiyonu"
                  value={dropdownAction}
                  note="Closable ve addable sekmelerde callback'leri deterministic tutmak gerekir."
                />
              </PreviewPanel>
            </div>
          ),
        },
      ];
    case 'Alert':
      return [
        {
          id: 'alert-severity-matrix',
          eyebrow: 'Feedback & status',
          title: 'Severity matrisi',
          description: 'Basarili, bilgi, uyari ve hata yuzeylerini ayni layout icinde karsilastirmali gosterir.',
          badges: ['severity', 'status', 'decision-support'],
          content: (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <Alert severity="success" title="Gate gecti" description="Hedefli regresyon, visual check ve smoke hatti temiz." />
              <Alert severity="info" title="Yeni alternatif seti" description="Bu aile icin Design Lab varyantlari genisletildi." />
              <Alert severity="warning" title="Review gerekli" description="Public rollout oncesi consumer adoption notlari tekrar gozden gecirilmeli." />
              <Alert severity="error" title="Blokaj" description="Kritik schema veya contract uyumsuzlugu cozulmeden yayin akisi ilerlememeli." />
            </div>
          ),
        },
        {
          id: 'alert-banner-actions',
          eyebrow: 'Announcement surfaces',
          title: 'Banner ve aksiyon',
          description: 'Sayfa ustu duyuru, CTA ve kapatilabilir bilgi yuzeylerini birlikte gosterir.',
          badges: ['banner', 'action', 'announcement'],
          content: (
            <div className="space-y-4">
              <Alert
                severity="info"
                banner
                title="SEO ve GEO readiness"
                description="Public component surface'lerinde metadata, canonical URL ve structured data kaniti zorunlu."
                action={<Button size="sm" variant="secondary">Checklist'i ac</Button>}
              />
              <Alert
                severity="warning"
                title="Dondurulmus release penceresi"
                description="Bu hafta yalniz policy ve docs yuzeylerine kontrollu degisiklik alinacak."
                closable
              />
            </div>
          ),
        },
        {
          id: 'alert-audit-stack',
          eyebrow: 'Audit readiness',
          title: 'Audit stack',
          description: 'Rich action, custom icon ve stacked alert kullanimi ile daha modern review yuzeyi uretir.',
          badges: ['audit', 'stack', 'rich-actions'],
          content: (
            <div className="space-y-4">
              <Alert
                severity="info"
                title="Adoption raporu hazir"
                description="Component recipe adoption ve consumer cleanup ciktilari raporlandi."
                action={<SectionBadge label="report:v1" />}
              />
              <Alert
                severity="success"
                title="Yayin adayi temiz"
                description="Contract, quality gates ve kullanim kanitlari ayni yuzeyde tamam."
                icon={<span aria-hidden="true" className="text-lg">✓</span>}
              />
            </div>
          ),
        },
      ];
    default:
      return null;
  }
};
