import { getBlock } from '../../blocks/registry';
import type { BlockMeta } from '../../blocks/types';

export interface AddResult {
  success: boolean;
  block: BlockMeta | null;
  message: string;
  code: string;
  indexCode: string;
  files: string[];
}

/** Category-specific template generators */
const CATEGORY_TEMPLATES: Record<string, (block: BlockMeta) => string> = {
  dashboard: (block) => {
    const imports = block.components.join(', ');
    return `'use client';

import React from 'react';
import { ${imports} } from '@mfe/design-system';

export interface ${block.name}Props {
  title?: string;
  className?: string;
}

/**
 * ${block.name} — ${block.description}
 *
 * @example
 * \`\`\`tsx
 * <${block.name} title="Overview" />
 * \`\`\`
 */
export function ${block.name}({ title, className }: ${block.name}Props) {
  return (
    <div className={\`flex flex-col gap-4 \${className ?? ''}\`}>
      {title && (
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">{title}</h2>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* TODO: Replace with real data */}
        <Card className="p-4">
          <Text size="sm" className="text-[var(--text-secondary)]">Metric</Text>
          <Text size="xl" className="font-bold">0</Text>
        </Card>
      </div>
    </div>
  );
}

${block.name}.displayName = '${block.name}';
`;
  },

  crud: (block) => {
    const imports = block.components.join(', ');
    return `'use client';

import React, { useState } from 'react';
import { ${imports} } from '@mfe/design-system';

export interface ${block.name}Props<T = Record<string, unknown>> {
  data?: T[];
  loading?: boolean;
  onItemClick?: (item: T) => void;
  className?: string;
}

/**
 * ${block.name} — ${block.description}
 *
 * @example
 * \`\`\`tsx
 * <${block.name} data={items} onItemClick={handleClick} />
 * \`\`\`
 */
export function ${block.name}<T extends Record<string, unknown>>({
  data = [],
  loading = false,
  onItemClick,
  className,
}: ${block.name}Props<T>) {
  const [search, setSearch] = useState('');

  const filtered = data.filter((item) =>
    Object.values(item).some((v) =>
      String(v).toLowerCase().includes(search.toLowerCase()),
    ),
  );

  return (
    <div className={\`flex flex-col gap-4 \${className ?? ''}\`}>
      <div className="flex items-center gap-3">
        <Input
          placeholder="Search..."
          value={search}
          onValueChange={setSearch}
          className="max-w-xs"
        />
      </div>
      {loading ? (
        <div className="flex justify-center py-8">
          <Spinner />
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-8 text-center text-[var(--text-secondary)]">
          No items found
        </div>
      ) : (
        <div className="divide-y divide-[var(--border-subtle)]">
          {filtered.map((item, i) => (
            <button
              key={i}
              onClick={() => onItemClick?.(item)}
              className="flex w-full items-center gap-3 px-4 py-3 text-start transition hover:bg-[var(--surface-muted)]"
              type="button"
            >
              <span className="text-sm">{JSON.stringify(item)}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

${block.name}.displayName = '${block.name}';
`;
  },

  admin: (block) => {
    const imports = block.components.join(', ');
    return `'use client';

import React from 'react';
import { ${imports} } from '@mfe/design-system';

export interface ${block.name}Props {
  title?: string;
  description?: string;
  className?: string;
}

/**
 * ${block.name} — ${block.description}
 */
export function ${block.name}({ title, description, className }: ${block.name}Props) {
  return (
    <Card className={\`p-6 \${className ?? ''}\`}>
      {title && (
        <div className="mb-4">
          <Text size="lg" className="font-semibold">{title}</Text>
          {description && (
            <Text size="sm" className="text-[var(--text-secondary)]">{description}</Text>
          )}
        </div>
      )}
      <div className="flex flex-col gap-3">
        {/* TODO: Add settings/admin content */}
        <div className="rounded-lg border border-[var(--border-subtle)] p-4">
          <Text size="sm" className="text-[var(--text-secondary)]">
            Configure ${block.name} content here
          </Text>
        </div>
      </div>
    </Card>
  );
}

${block.name}.displayName = '${block.name}';
`;
  },

  form: (block) => {
    const imports = block.components.join(', ');
    return `'use client';

import React from 'react';
import { ${imports} } from '@mfe/design-system';
import { useForm, ConnectedInput, createZodValidator } from '@mfe/design-system/form';

export interface ${block.name}Props {
  onSubmit?: (values: Record<string, unknown>) => void;
  loading?: boolean;
  className?: string;
}

/**
 * ${block.name} — ${block.description}
 *
 * Uses the design-system form adapter for validation.
 * Replace the schema with your actual validation rules.
 */
export function ${block.name}({ onSubmit, loading, className }: ${block.name}Props) {
  const form = useForm({
    defaultValues: { field1: '', field2: '' },
    // TODO: Add Zod schema: validator: createZodValidator(schema)
  });

  return (
    <form.FormProvider>
      <form
        onSubmit={form.handleSubmit(onSubmit ?? (() => {}))}
        className={\`flex flex-col gap-4 \${className ?? ''}\`}
      >
        <ConnectedInput name="field1" label="Field 1" required />
        <ConnectedInput name="field2" label="Field 2" />
        <Button type="submit" variant="primary" loading={loading}>
          Submit
        </Button>
      </form>
    </form.FormProvider>
  );
}

${block.name}.displayName = '${block.name}';
`;
  },

  review: (block) => {
    const imports = block.components.join(', ');
    return `'use client';

import React from 'react';
import { ${imports} } from '@mfe/design-system';

export interface ${block.name}Props {
  items?: Array<{ id: string; title: string; status: string; timestamp: string }>;
  className?: string;
}

/**
 * ${block.name} — ${block.description}
 */
export function ${block.name}({ items = [], className }: ${block.name}Props) {
  return (
    <div className={\`flex flex-col gap-4 \${className ?? ''}\`}>
      {items.length === 0 ? (
        <div className="py-8 text-center text-[var(--text-secondary)]">
          No items to review
        </div>
      ) : (
        items.map((item) => (
          <Card key={item.id} className="flex items-center justify-between p-4">
            <div>
              <Text className="font-medium">{item.title}</Text>
              <Text size="xs" className="text-[var(--text-secondary)]">{item.timestamp}</Text>
            </div>
            <Badge variant={item.status === 'approved' ? 'success' : 'default'}>
              {item.status}
            </Badge>
          </Card>
        ))
      )}
    </div>
  );
}

${block.name}.displayName = '${block.name}';
`;
  },

  layout: (block) => {
    const imports = block.components.join(', ');
    return `'use client';

import React from 'react';
import { ${imports} } from '@mfe/design-system';

export interface ${block.name}Props {
  children: React.ReactNode;
  className?: string;
}

/**
 * ${block.name} — ${block.description}
 */
export function ${block.name}({ children, className }: ${block.name}Props) {
  return (
    <PageLayout className={className}>
      <PageHeader title="Page Title" />
      <div className="flex-1 p-4">{children}</div>
    </PageLayout>
  );
}

${block.name}.displayName = '${block.name}';
`;
  },
};

/**
 * Generate production-ready block code from registry metadata.
 * Returns typed component code with proper imports, props interface,
 * JSDoc, and TODO markers for customization.
 */
export function generateBlockCode(blockId: string): AddResult {
  const block = getBlock(blockId);
  if (!block) {
    return {
      success: false,
      block: null,
      message: `Block "${blockId}" not found in registry. Run "mfe-ds list" to see available blocks.`,
      code: '',
      indexCode: '',
      files: [],
    };
  }

  const templateFn = CATEGORY_TEMPLATES[block.category] ?? CATEGORY_TEMPLATES.crud;
  const code = templateFn(block);

  const indexCode = [
    `export { ${block.name} } from './${block.name}';`,
    `export type { ${block.name}Props } from './${block.name}';`,
  ].join('\n');

  const files = [
    `src/blocks/${block.id}/${block.name}.tsx`,
    `src/blocks/${block.id}/index.ts`,
  ];

  return {
    success: true,
    block,
    message: `Block "${block.name}" generated. Uses: ${block.components.join(', ')}`,
    code,
    indexCode,
    files,
  };
}
