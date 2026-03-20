import React from 'react';
import {
  PageLayout,
  Text,
  createPageLayoutBreadcrumbItems,
  createPageLayoutPreset,
} from '@mfe/design-system';
import { ThemeMatrixGallery } from '../../features/theme/theme-matrix-gallery';

export const ThemeMatrixPage: React.FC = () => (
  <PageLayout
    {...createPageLayoutPreset({ preset: 'content-only', pageWidth: 'wide' })}
    title="Runtime Theme Matrix"
    description="Tema × yoğunluk × access varyantlarını test etmek için yardımcı sayfa."
    breadcrumbItems={createPageLayoutBreadcrumbItems([
      { title: 'Shell', path: '/' },
      { title: 'Runtime Theme Matrix', path: '/runtime/theme-matrix' },
    ])}
  >
    <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
      <Text variant="secondary">
        Bu sayfa, Playwright ve Chromatic/axe testleri için resmi tema modları × yoğunluk
        (comfortable/compact) kombinasyonlarını ve Button/Select/Tag gibi bileşenlerin
        `access=full|readonly|disabled|hidden` davranışlarını gözlemlemek amacıyla hazırlanmıştır.
      </Text>
    </div>
    <ThemeMatrixGallery />
  </PageLayout>
);

export default ThemeMatrixPage;
