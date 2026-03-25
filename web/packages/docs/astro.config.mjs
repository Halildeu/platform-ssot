import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  integrations: [
    starlight({
      // Pagefind search is enabled by default in Starlight v0.15+
      pagefind: true,
      title: '@mfe/design-system',
      description: 'Enterprise-grade AI-native React component library',
      locales: {
        root: { label: 'Türkçe', lang: 'tr' },
        en: { label: 'English', lang: 'en' },
      },
      defaultLocale: 'root',
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
