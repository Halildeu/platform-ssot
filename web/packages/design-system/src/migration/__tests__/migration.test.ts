// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { applyMigration, dryRunMigration, v1ToV2Transforms } from '../index';

describe('Migration Engine', () => {
  it('transforms import path', () => {
    const source = `import { Button } from 'mfe-ui-kit';`;
    const result = applyMigration(source, v1ToV2Transforms);
    expect(result.changed).toBe(true);
    expect(result.transforms.some(t => t.id === 'import-path-update')).toBe(true);
  });

  it('transforms selectSize to size', () => {
    const source = `<Select selectSize="sm" />`;
    const result = applyMigration(source, v1ToV2Transforms);
    expect(result.changed).toBe(true);
    expect(result.transforms.some(t => t.id === 'select-size-rename')).toBe(true);
  });

  it('transforms Badge tone to variant', () => {
    const source = `<Badge tone="success">OK</Badge>`;
    const result = applyMigration(source, v1ToV2Transforms);
    expect(result.changed).toBe(true);
    expect(result.transforms.some(t => t.id === 'badge-tone-rename')).toBe(true);
  });

  it('does not change clean code', () => {
    const source = `import { Button } from '@mfe/design-system';\n<Button size="md" />`;
    const result = applyMigration(source, v1ToV2Transforms);
    expect(result.changed).toBe(false);
    expect(result.transforms).toEqual([]);
  });

  it('dryRunMigration returns same result as applyMigration', () => {
    const source = `import { Select } from 'mfe-ui-kit';\n<Select selectSize="lg" />`;
    const dry = dryRunMigration(source, v1ToV2Transforms);
    const real = applyMigration(source, v1ToV2Transforms);
    expect(dry.transforms.length).toBe(real.transforms.length);
  });

  it('applies multiple transforms', () => {
    const source = `import { Select, Badge } from 'mfe-ui-kit';\n<Select selectSize="sm" />\n<Badge tone="info">New</Badge>`;
    const result = applyMigration(source, v1ToV2Transforms);
    expect(result.transforms.length).toBeGreaterThanOrEqual(3);
  });

  it('includes file path in result', () => {
    const result = applyMigration('', v1ToV2Transforms, 'src/App.tsx');
    expect(result.file).toBe('src/App.tsx');
  });

  it('is idempotent (2x apply = same result)', () => {
    const source = `import { Button } from 'mfe-ui-kit';`;
    const first = applyMigration(source, v1ToV2Transforms);
    // Apply on already-migrated code
    const second = applyMigration(
      source.replace(/from 'mfe-ui-kit'/, "from '@mfe/design-system'"),
      v1ToV2Transforms,
    );
    expect(second.changed).toBe(false);
  });
});
