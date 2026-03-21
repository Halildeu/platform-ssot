import type { TemplateFile } from '../types';
import {
  generatePackageJson,
  generateTsConfig,
  generateViteConfig,
  generateIndexHtml,
  generateMain,
  generateCss,
} from './shared';

/* ------------------------------------------------------------------ */
/*  Minimal template                                                   */
/* ------------------------------------------------------------------ */

export function generateMinimalTemplate(name: string): TemplateFile[] {
  return [
    { path: 'package.json', content: generatePackageJson(name, 'minimal') },
    { path: 'tsconfig.json', content: generateTsConfig() },
    { path: 'vite.config.ts', content: generateViteConfig() },
    { path: 'index.html', content: generateIndexHtml(name) },
    { path: 'src/main.tsx', content: generateMain() },
    { path: 'src/App.tsx', content: generateMinimalApp(name) },
    { path: 'src/index.css', content: generateCss() },
  ];
}

/* ------------------------------------------------------------------ */
/*  src/App.tsx                                                        */
/* ------------------------------------------------------------------ */

function generateMinimalApp(name: string): string {
  const displayName = name
    .replace(/^@[^/]+\//, '')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c: string) => c.toUpperCase());

  return `import React from 'react';
import { Button, Card, Text, Stack } from '@mfe/design-system';

export default function App() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '2rem',
      }}
    >
      <Card style={{ maxWidth: '480px', padding: '2rem', textAlign: 'center' }}>
        <Stack direction="column" gap="md" align="center">
          <Text variant="heading-lg">${displayName}</Text>
          <Text variant="body-md" color="secondary">
            Scaffolded with @mfe/create-app using the @mfe/design-system.
          </Text>
          <Text variant="body-sm" color="secondary">
            Edit <code>src/App.tsx</code> to get started.
          </Text>
          <Button
            variant="primary"
            onClick={() => window.open('https://github.com/your-org/design-system', '_blank')}
          >
            View Documentation
          </Button>
        </Stack>
      </Card>
    </div>
  );
}
`;
}
