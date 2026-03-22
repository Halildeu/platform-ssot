/* Migration Engine — AST-free transform for design-system upgrades */

export interface MigrationTransform {
  id: string;
  description: string;
  fromVersion: string;
  toVersion: string;
  /** Pattern to match in import statements or JSX */
  pattern: RegExp;
  /** Replacement string or function */
  replacement: string | ((match: string, ...args: string[]) => string);
}

export interface MigrationResult {
  file: string;
  transforms: { id: string; description: string; before: string; after: string }[];
  changed: boolean;
}

/** Built-in migration transforms v1 → v2 */
export const v1ToV2Transforms: MigrationTransform[] = [
  {
    id: 'import-path-update',
    description: 'Update import path from mfe-ui-kit to @mfe/design-system',
    fromVersion: '1.0.0',
    toVersion: '2.0.0',
    pattern: /from ['"]mfe-ui-kit['"]/g,
    replacement: "from '@mfe/design-system'",
  },
  {
    id: 'select-size-rename',
    description: 'Rename selectSize prop to size',
    fromVersion: '1.0.0',
    toVersion: '2.0.0',
    pattern: /selectSize=/g,
    replacement: 'size=',
  },
  {
    id: 'switch-size-rename',
    description: 'Rename switchSize prop to size',
    fromVersion: '1.0.0',
    toVersion: '2.0.0',
    pattern: /switchSize=/g,
    replacement: 'size=',
  },
  {
    id: 'input-size-rename',
    description: 'Rename inputSize prop to size',
    fromVersion: '1.0.0',
    toVersion: '2.0.0',
    pattern: /inputSize=/g,
    replacement: 'size=',
  },
  {
    id: 'badge-tone-rename',
    description: 'Rename Badge tone prop to variant',
    fromVersion: '1.0.0',
    toVersion: '2.0.0',
    pattern: /(<Badge\b[^>]*?)tone=/g,
    replacement: '$1variant=',
  },
  {
    id: 'form-adapter-migration',
    description: 'Suggest migration to @mfe/design-system/form',
    fromVersion: '1.0.0',
    toVersion: '2.0.0',
    pattern: /from ['"]@hookform\/resolvers\/zod['"]/g,
    replacement: "from '@mfe/design-system/form' // Consider using built-in zodResolver",
  },
];

/**
 * Apply migration transforms to source code.
 * Returns the transformed code and a list of changes made.
 */
export function applyMigration(
  source: string,
  transforms: MigrationTransform[],
  filePath = 'unknown',
): MigrationResult {
  let code = source;
  const applied: MigrationResult['transforms'] = [];

  for (const transform of transforms) {
    const matches = code.match(transform.pattern);
    if (matches) {
      const before = matches[0];
      const after = typeof transform.replacement === 'string'
        ? before.replace(transform.pattern, transform.replacement)
        : before.replace(transform.pattern, transform.replacement);
      code = code.replace(transform.pattern, transform.replacement as string);
      applied.push({ id: transform.id, description: transform.description, before, after });
    }
  }

  return { file: filePath, transforms: applied, changed: applied.length > 0 };
}

/**
 * Dry-run migration — returns what would change without modifying source.
 */
export function dryRunMigration(
  source: string,
  transforms: MigrationTransform[],
  filePath = 'unknown',
): MigrationResult {
  return applyMigration(source, transforms, filePath);
}
