import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  integrations: [
    starlight({
      title: '@mfe/design-system',
      description: 'Enterprise-grade AI-native React component library',
      defaultLocale: 'tr',
      locales: {
        tr: { label: 'Türkçe' },
        en: { label: 'English' },
      },
      sidebar: [
        {
          label: 'Başlarken',
          items: [
            { label: 'Kurulum', slug: 'installation' },
            { label: 'Hızlı Başlangıç', slug: 'getting-started' },
            { label: 'Tema Sistemi', slug: 'theming' },
            { label: 'Dark Mode', slug: 'dark-mode' },
          ],
        },
        {
          label: 'Bileşenler',
          autogenerate: { directory: 'components' },
        },
        {
          label: 'Enterprise',
          autogenerate: { directory: 'enterprise' },
        },
      ],
      social: {
        github: 'https://github.com/Halildeu/mfe-design-system',
      },
      customCss: ['./src/styles/custom.css'],
    }),
  ],
});
