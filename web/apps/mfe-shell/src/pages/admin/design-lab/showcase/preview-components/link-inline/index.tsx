import React from 'react';
import { Badge, LinkInline, Text } from '@mfe/design-system';
import type { ComponentShowcaseSection, PreviewPanelComponent } from '../../showcaseTypes';

type BuildLinkInlinePreviewOptions = {
  PreviewPanel: PreviewPanelComponent;
};

const linkLocaleText = {
  externalScreenReaderLabel: 'Harici baglanti',
};

const LinkInlineNavigationStates = () => (
  <div className="space-y-4">
    <div className="rounded-2xl border border-border-subtle bg-surface-default p-4">
      <Text as="div" className="font-semibold text-text-primary">
        Internal / current
      </Text>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <LinkInline href="/admin/design-lab" current leadingVisual={<span aria-hidden="true">•</span>}>
          Design Lab current
        </LinkInline>
        <Badge variant="info">current</Badge>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <LinkInline href="/admin/users">Kullanici yonetimi</LinkInline>
        <LinkInline href="/admin/reporting" variant="secondary">
          Raporlama
        </LinkInline>
      </div>
    </div>
    <div className="rounded-2xl border border-border-subtle bg-surface-default p-4">
      <Text variant="secondary" className="block text-sm leading-6">
        Inline navigation, current-page semantics ve secondary tone ayni primitive uzerinden gorunur.
      </Text>
    </div>
  </div>
);

const LinkInlineInformationScent = () => (
  <div className="space-y-4">
    <div className="rounded-2xl border border-border-subtle bg-surface-default p-4">
      <Text as="div" className="font-semibold text-text-primary">
        Underline / external affordance
      </Text>
      <div className="mt-3 flex flex-wrap items-center gap-4">
        <LinkInline href="https://example.com/ui-docs" external underline="always" localeText={linkLocaleText}>
          Harici dokumantasyon
        </LinkInline>
        <LinkInline href="/admin/design-lab" underline="hover">
          Hover underline
        </LinkInline>
        <LinkInline href="/admin/design-lab" underline="none" variant="secondary" trailingVisual={<span aria-hidden="true">→</span>}>
          Minimal handoff
        </LinkInline>
      </div>
    </div>
    <div className="rounded-2xl border border-border-subtle bg-surface-default p-4">
      <Text variant="secondary" className="block text-sm leading-6">
        Information scent seviyesi underline ve trailing affordance ile ayarlanir; external link otomatik guvenlik davranisi alir.
      </Text>
    </div>
  </div>
);

const LinkInlineAccessSafety = () => (
  <div className="space-y-4">
    <div className="rounded-2xl border border-border-subtle bg-surface-default p-4">
      <Text as="div" className="font-semibold text-text-primary">
        Access fallback
      </Text>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <LinkInline href="/admin/users" disabled accessReason="Bu yuzey yalniz denetim rolune acik.">
          Kullanici verisi kilitli
        </LinkInline>
        <LinkInline href="/admin/contracts" access="readonly" accessReason="Salt okunur kontrat baglami.">
          Salt okunur kontrat
        </LinkInline>
      </div>
    </div>
    <div className="rounded-2xl border border-border-subtle bg-surface-default p-4">
      <Text variant="secondary" className="block text-sm leading-6">
        Disabled ve readonly durumlari linki kirik gibi gostermek yerine kontrollu span fallback ile semantic olarak korur.
      </Text>
    </div>
  </div>
);

export const buildLinkInlineLivePreview = (
  itemName: string,
  { PreviewPanel }: BuildLinkInlinePreviewOptions,
): React.ReactNode | null => {
  if (itemName !== 'LinkInline') {
    return null;
  }

  return (
    <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-xs">
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <PreviewPanel title="Navigation states">
          <LinkInlineNavigationStates />
        </PreviewPanel>
        <PreviewPanel title="Information scent">
          <LinkInlineInformationScent />
        </PreviewPanel>
        <PreviewPanel title="Access & safety">
          <LinkInlineAccessSafety />
        </PreviewPanel>
      </div>
    </div>
  );
};

export const buildLinkInlineShowcaseSections = (
  itemName: string,
  { PreviewPanel }: BuildLinkInlinePreviewOptions,
): ComponentShowcaseSection[] | null => {
  if (itemName !== 'LinkInline') {
    return null;
  }

  return [
    {
      id: 'linkinline-navigation-states',
      eyebrow: 'Pattern 01',
      title: 'Navigation states',
      description: 'Internal navigation, current-page semantics ve secondary tone ayni primitive ile gorunur.',
      badges: ['live', 'navigation', 'beta'],
      content: (
        <PreviewPanel title="Navigation states">
          <LinkInlineNavigationStates />
        </PreviewPanel>
      ),
    },
    {
      id: 'linkinline-information-scent',
      eyebrow: 'Pattern 02',
      title: 'Information scent',
      description: 'Underline, external affordance ve trailing visual ile link gorunurlugu kademelenir.',
      badges: ['live', 'affordance', 'external'],
      content: (
        <PreviewPanel title="Information scent">
          <LinkInlineInformationScent />
        </PreviewPanel>
      ),
    },
    {
      id: 'linkinline-access-safety',
      eyebrow: 'Pattern 03',
      title: 'Access & safety',
      description: 'Disabled ve readonly durumlari kirik anchor yerine kontrollu fallback yuzeyi ile izlenir.',
      badges: ['reference', 'access', 'safety'],
      content: (
        <PreviewPanel title="Access & safety" kind="reference">
          <LinkInlineAccessSafety />
        </PreviewPanel>
      ),
    },
  ];
};
