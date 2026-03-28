import type { Template } from '../types';

/* ------------------------------------------------------------------ */
/*  package.json                                                       */
/* ------------------------------------------------------------------ */

const templateDeps: Record<Template, Record<string, string>> = {
  dashboard: {
    '@mfe/x-charts': '*',
  },
  crud: {
    '@mfe/x-data-grid': '*',
    '@mfe/x-form-builder': '*',
  },
  admin: {
    '@mfe/x-form-builder': '*',
  },
  minimal: {},
};

export function generatePackageJson(name: string, template: Template): string {
  const deps: Record<string, string> = {
    '@mfe/design-system': '*',
    '@mfe/blocks': '*',
    react: '^18.3.0',
    'react-dom': '^18.3.0',
    'react-router-dom': '^6.23.0',
    ...templateDeps[template],
  };

  const pkg = {
    name,
    version: '0.1.0',
    private: true,
    scripts: {
      dev: 'vite',
      build: 'tsc && vite build',
      preview: 'vite preview',
      typecheck: 'tsc --noEmit',
    },
    dependencies: deps,
    devDependencies: {
      '@types/react': '^18.3.0',
      '@types/react-dom': '^18.3.0',
      '@vitejs/plugin-react': '^4.3.0',
      typescript: '^5.4.0',
      vite: '^5.4.0',
    },
  };

  return JSON.stringify(pkg, null, 2) + '\n';
}

/* ------------------------------------------------------------------ */
/*  tsconfig.json                                                      */
/* ------------------------------------------------------------------ */

export function generateTsConfig(): string {
  const config = {
    compilerOptions: {
      target: 'ES2020',
      module: 'ESNext',
      moduleResolution: 'bundler',
      jsx: 'react-jsx',
      strict: true,
      esModuleInterop: true,
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true,
      resolveJsonModule: true,
      isolatedModules: true,
      noEmit: true,
    },
    include: ['src'],
  };

  return JSON.stringify(config, null, 2) + '\n';
}

/* ------------------------------------------------------------------ */
/*  vite.config.ts                                                     */
/* ------------------------------------------------------------------ */

export function generateViteConfig(): string {
  return `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
`;
}

/* ------------------------------------------------------------------ */
/*  index.html                                                         */
/* ------------------------------------------------------------------ */

export function generateIndexHtml(name: string): string {
  const title = name
    .replace(/^@[^/]+\//, '')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;
}

/* ------------------------------------------------------------------ */
/*  src/main.tsx                                                       */
/* ------------------------------------------------------------------ */

export function generateMain(): string {
  return `import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { DesignSystemProvider } from '@mfe/design-system';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DesignSystemProvider locale="en">
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </DesignSystemProvider>
  </React.StrictMode>,
);
`;
}

/* ------------------------------------------------------------------ */
/*  src/index.css                                                      */
/* ------------------------------------------------------------------ */

export function generateCss(): string {
  return `/* ------------------------------------------------------------------ */
/*  Global reset and base styles                                       */
/* ------------------------------------------------------------------ */

*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family:
    'Inter',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: var(--color-background));
  color: var(--color-text-primary));
}

#root {
  min-height: 100vh;
}
`;
}

/* ------------------------------------------------------------------ */
/*  src/layouts/AppLayout.tsx                                           */
/* ------------------------------------------------------------------ */

export function generateAppLayout(name: string): string {
  const displayName = name
    .replace(/^@[^/]+\//, '')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return `import React from 'react';
import type { ReactNode } from 'react';
import { NavLink, Outlet } from 'react-router-dom';

interface AppLayoutProps {
  children?: ReactNode;
}

const navStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '1.5rem',
  padding: '0 1.5rem',
  height: '56px',
  borderBottom: '1px solid var(--color-border))',
  backgroundColor: 'var(--color-surface))',
};

const linkStyle: React.CSSProperties = {
  textDecoration: 'none',
  fontSize: '0.875rem',
  fontWeight: 500,
  color: 'var(--color-text-secondary))',
};

const activeStyle: React.CSSProperties = {
  ...linkStyle,
  color: 'var(--color-primary))',
};

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div>
      <nav style={navStyle}>
        <span
          style={{
            fontWeight: 700,
            fontSize: '1rem',
            color: 'var(--color-text-primary))',
            marginRight: '1rem',
          }}
        >
          ${displayName}
        </span>
        {children}
      </nav>
      <main style={{ padding: '1.5rem', maxWidth: '1280px', margin: '0 auto' }}>
        <Outlet />
      </main>
    </div>
  );
}
`;
}
