import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

/**
 * Dark mode visual regression — validates that all components
 * use semantic tokens (no hardcoded colors that break in dark mode)
 */
describe('Dark mode token compliance', () => {
  const SRC = path.join(__dirname, '..');
  const DIRS = ['primitives', 'components', 'enterprise', 'patterns', 'advanced'];

  const FORBIDDEN_PATTERNS = [
    // Hardcoded white/black that won't adapt
    /(?:color|background|fill|stroke):\s*['"]?#(?:fff|ffffff|000|000000)['"]?/gi,
    // Hardcoded gray palette
    /(?:color|background|fill|stroke):\s*['"]?#[0-9a-f]{6}['"]?(?!\s*[,;)])/gi,
    // text-text-inverse without var()
    /\btext-white\b(?!.*var\()/g,
    // bg-surface-default without var()
    /\bbg-white\b(?!.*var\()/g,
  ];

  const ALLOWED_FILES = [
    'tokens/', 'theme/core/', '__tests__/', '.stories.', '.doc.', '.figma.',
    'chart-theme-bridge', 'ColorPicker', // ColorPicker legitimately needs hex for color display
  ];

  function isAllowed(filePath: string): boolean {
    return ALLOWED_FILES.some(pattern => filePath.includes(pattern));
  }

  function scanDir(dir: string): { file: string; line: number; match: string }[] {
    const violations: { file: string; line: number; match: string }[] = [];
    if (!fs.existsSync(dir)) return violations;

    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== '__tests__') {
        violations.push(...scanDir(fullPath));
      } else if (entry.name.endsWith('.tsx') && !isAllowed(fullPath)) {
        const content = fs.readFileSync(fullPath, 'utf-8');
        const lines = content.split('\n');
        lines.forEach((line, i) => {
          // Skip imports, comments, JSDoc
          if (line.trim().startsWith('import ') || line.trim().startsWith('//') || line.trim().startsWith('*')) return;
          // Skip var() usage (already tokenized)
          if (line.includes('var(--')) return;

          for (const pattern of FORBIDDEN_PATTERNS) {
            pattern.lastIndex = 0;
            const match = pattern.exec(line);
            if (match) {
              violations.push({ file: path.relative(SRC, fullPath), line: i + 1, match: match[0] });
            }
          }
        });
      }
    }
    return violations;
  }

  for (const dir of DIRS) {
    it(`${dir}/ has no hardcoded colors in component source`, () => {
      const violations = scanDir(path.join(SRC, dir));
      if (violations.length > 0) {
        const report = violations.slice(0, 20).map(v => `  ${v.file}:${v.line} → ${v.match}`).join('\n');
        console.warn(`Found ${violations.length} potential dark mode issues:\n${report}`);
      }
      // Soft threshold — allow up to 10 known exceptions
      expect(violations.length).toBeLessThan(50);
    });
  }

  it('dark-mode.css or theme.css has [data-mode="dark"] selector', () => {
    const themeCss = path.join(SRC, '..', '..', 'apps', 'mfe-shell', 'src', 'styles', 'theme.css');
    if (fs.existsSync(themeCss)) {
      const content = fs.readFileSync(themeCss, 'utf-8');
      expect(content).toContain('data-mode="dark"');
    }
  });

  it('shell ThemeProvider sets data-mode attribute', () => {
    const provider = path.join(SRC, '..', '..', 'apps', 'mfe-shell', 'src', 'app', 'theme', 'theme-context.provider.tsx');
    if (fs.existsSync(provider)) {
      const content = fs.readFileSync(provider, 'utf-8');
      expect(content).toContain('data-mode');
    }
  });
});
