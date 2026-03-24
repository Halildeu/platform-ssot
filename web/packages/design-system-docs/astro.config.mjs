import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  integrations: [
    starlight({
      title: '@mfe/design-system',
      description: 'Enterprise-grade React UI component library',
      defaultLocale: 'tr',
      locales: {
        tr: { label: 'Türkçe', lang: 'tr' },
        en: { label: 'English', lang: 'en' },
      },
      sidebar: [
        {
          label: 'Başlangıç',
          items: [
            { label: 'Kurulum', slug: 'getting-started/installation' },
            { label: 'Hızlı Başlangıç', slug: 'getting-started/quick-start' },
            { label: 'Tema Sistemi', slug: 'getting-started/theming' },
          ],
        },
        {
          label: 'Bileşenler',
          items: [
            { label: 'Primitives', slug: 'components/primitives' },
            { label: 'Enterprise', slug: 'components/enterprise' },
            { label: 'Patterns', slug: 'components/patterns' },
          ],
        },
        {
          label: 'Rehberler',
          items: [
            { label: 'Dark Mode', slug: 'guides/dark-mode' },
            { label: 'Erişilebilirlik', slug: 'guides/accessibility' },
            { label: 'Form Validation', slug: 'guides/form-validation' },
            { label: 'Access Control', slug: 'guides/access-control' },
          ],
        },
        {
          label: 'API Referans',
          items: [
            { label: 'Genel Bakış', slug: 'api/overview' },
          ],
        },
      ],
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/mfe/design-system' },
      ],
    }),
  ],
});
