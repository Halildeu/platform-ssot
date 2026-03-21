import { describe, it, expect } from 'vitest';
import { generateDashboardTemplate } from '../templates/dashboard';
import { generateCrudTemplate } from '../templates/crud';
import { generateAdminTemplate } from '../templates/admin';
import { generateMinimalTemplate } from '../templates/minimal';
import { generateTemplate } from '../index';

/* ------------------------------------------------------------------ */
/*  Dashboard template                                                 */
/* ------------------------------------------------------------------ */

describe('Dashboard template', () => {
  const files = generateDashboardTemplate('my-dashboard');

  it('generates correct number of files', () => {
    expect(files.length).toBeGreaterThan(5);
  });

  it('includes package.json', () => {
    const pkg = files.find((f) => f.path === 'package.json');
    expect(pkg).toBeTruthy();
    expect(pkg!.content).toContain('"my-dashboard"');
    expect(pkg!.content).toContain('@mfe/design-system');
    expect(pkg!.content).toContain('@mfe/blocks');
    expect(pkg!.content).toContain('@mfe/x-charts');
  });

  it('includes App.tsx', () => {
    expect(files.find((f) => f.path === 'src/App.tsx')).toBeTruthy();
  });

  it('includes DashboardPage.tsx with blocks imports', () => {
    const page = files.find((f) => f.path === 'src/pages/DashboardPage.tsx');
    expect(page).toBeTruthy();
    expect(page!.content).toContain('DashboardPageTemplate');
    expect(page!.content).toContain('@mfe/blocks');
  });

  it('includes DesignSystemProvider in main.tsx', () => {
    const main = files.find((f) => f.path === 'src/main.tsx');
    expect(main).toBeTruthy();
    expect(main!.content).toContain('DesignSystemProvider');
    expect(main!.content).toContain('@mfe/design-system');
  });
});

/* ------------------------------------------------------------------ */
/*  CRUD template                                                      */
/* ------------------------------------------------------------------ */

describe('CRUD template', () => {
  const files = generateCrudTemplate('my-crud-app');

  it('generates correct number of files', () => {
    expect(files.length).toBeGreaterThan(5);
  });

  it('includes package.json with data-grid dep', () => {
    const pkg = files.find((f) => f.path === 'package.json');
    expect(pkg).toBeTruthy();
    expect(pkg!.content).toContain('@mfe/x-data-grid');
  });

  it('includes ProductsPage with CrudPageTemplate', () => {
    const page = files.find((f) => f.path === 'src/pages/ProductsPage.tsx');
    expect(page).toBeTruthy();
    expect(page!.content).toContain('CrudPageTemplate');
    expect(page!.content).toContain('@mfe/blocks');
  });

  it('includes sample product data', () => {
    const data = files.find((f) => f.path === 'src/data/products.ts');
    expect(data).toBeTruthy();
    expect(data!.content).toContain('Product');
    expect(data!.content).toContain('sampleProducts');
  });
});

/* ------------------------------------------------------------------ */
/*  Admin template                                                     */
/* ------------------------------------------------------------------ */

describe('Admin template', () => {
  const files = generateAdminTemplate('my-admin');

  it('generates correct number of files', () => {
    expect(files.length).toBeGreaterThan(5);
  });

  it('includes package.json', () => {
    const pkg = files.find((f) => f.path === 'package.json');
    expect(pkg).toBeTruthy();
    expect(pkg!.content).toContain('"my-admin"');
  });

  it('includes SettingsPage with SettingsPageTemplate', () => {
    const page = files.find((f) => f.path === 'src/pages/SettingsPage.tsx');
    expect(page).toBeTruthy();
    expect(page!.content).toContain('SettingsPageTemplate');
    expect(page!.content).toContain('@mfe/blocks');
  });

  it('includes UsersPage with UserManagementBlock', () => {
    const page = files.find((f) => f.path === 'src/pages/UsersPage.tsx');
    expect(page).toBeTruthy();
    expect(page!.content).toContain('UserManagementBlock');
    expect(page!.content).toContain('@mfe/blocks');
  });

  it('includes multi-page routing', () => {
    const app = files.find((f) => f.path === 'src/App.tsx');
    expect(app).toBeTruthy();
    expect(app!.content).toContain('SettingsPage');
    expect(app!.content).toContain('UsersPage');
  });
});

/* ------------------------------------------------------------------ */
/*  Minimal template                                                   */
/* ------------------------------------------------------------------ */

describe('Minimal template', () => {
  const files = generateMinimalTemplate('my-minimal');

  it('generates correct number of files', () => {
    expect(files.length).toBeGreaterThanOrEqual(7);
  });

  it('includes package.json with only base deps', () => {
    const pkg = files.find((f) => f.path === 'package.json');
    expect(pkg).toBeTruthy();
    expect(pkg!.content).toContain('@mfe/design-system');
    expect(pkg!.content).not.toContain('@mfe/x-charts');
    expect(pkg!.content).not.toContain('@mfe/x-data-grid');
  });

  it('includes App.tsx with design-system components', () => {
    const app = files.find((f) => f.path === 'src/App.tsx');
    expect(app).toBeTruthy();
    expect(app!.content).toContain('@mfe/design-system');
    expect(app!.content).toContain('Button');
    expect(app!.content).toContain('Card');
  });

  it('does not generate layout or page files', () => {
    expect(files.find((f) => f.path.includes('layouts/'))).toBeUndefined();
    expect(files.find((f) => f.path.includes('pages/'))).toBeUndefined();
  });
});

/* ------------------------------------------------------------------ */
/*  generateTemplate dispatcher                                        */
/* ------------------------------------------------------------------ */

describe('generateTemplate', () => {
  it('routes to dashboard generator', () => {
    const files = generateTemplate({
      name: 'test-app',
      template: 'dashboard',
      typescript: true,
      installDeps: false,
      git: false,
    });
    expect(files.find((f) => f.path === 'src/pages/DashboardPage.tsx')).toBeTruthy();
  });

  it('routes to crud generator', () => {
    const files = generateTemplate({
      name: 'test-app',
      template: 'crud',
      typescript: true,
      installDeps: false,
      git: false,
    });
    expect(files.find((f) => f.path === 'src/pages/ProductsPage.tsx')).toBeTruthy();
  });

  it('routes to admin generator', () => {
    const files = generateTemplate({
      name: 'test-app',
      template: 'admin',
      typescript: true,
      installDeps: false,
      git: false,
    });
    expect(files.find((f) => f.path === 'src/pages/SettingsPage.tsx')).toBeTruthy();
  });

  it('routes to minimal generator', () => {
    const files = generateTemplate({
      name: 'test-app',
      template: 'minimal',
      typescript: true,
      installDeps: false,
      git: false,
    });
    expect(files.length).toBe(7);
  });

  it('throws on unknown template', () => {
    expect(() =>
      generateTemplate({
        name: 'test-app',
        template: 'nonexistent' as any,
        typescript: true,
        installDeps: false,
        git: false,
      }),
    ).toThrow('Unknown template');
  });

  it('all templates include index.html and vite config', () => {
    for (const template of ['dashboard', 'crud', 'admin', 'minimal'] as const) {
      const files = generateTemplate({
        name: 'test',
        template,
        typescript: true,
        installDeps: false,
        git: false,
      });
      expect(files.find((f) => f.path === 'index.html')).toBeTruthy();
      expect(files.find((f) => f.path === 'vite.config.ts')).toBeTruthy();
      expect(files.find((f) => f.path === 'src/main.tsx')).toBeTruthy();
      expect(files.find((f) => f.path === 'src/index.css')).toBeTruthy();
    }
  });
});
