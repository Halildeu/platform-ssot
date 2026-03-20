import { defineConfig, type Options } from 'tsup';

const entry = [
  // Main barrel
  'src/index.ts',
  // Layer-specific deep imports (F1 — Package Topology)
  'src/tokens/index.ts',
  'src/primitives/index.ts',
  'src/components/index.ts',
  'src/patterns/index.ts',
  'src/providers/index.ts',
  'src/theme/index.ts',
  'src/a11y/index.ts',
  'src/performance/index.ts',
  // Internal / headless
  'src/internal/interaction-core/index.ts',
  'src/internal/overlay-engine/index.ts',
  // Headless (unified public surface)
  'src/headless/index.ts',
  // Icons (tree-shakeable)
  'src/icons/index.ts',
  // Advanced
  'src/advanced/data-grid/setup.ts',
  'src/advanced/index.ts',
  // Server-safe entry (NO "use client")
  'src/server.ts',
];

/**
 * Strip "use client" directives and suppress empty chunk warnings.
 *
 * 1. Removes "use client" from esbuild output so Rollup (used by tsup for
 *    tree-shaking) doesn't warn about module-level directives.  The post-build
 *    script (scripts/post-build-use-client.mjs) re-injects the directive into
 *    the final ESM entry points.
 *
 * 2. Patches empty chunks with a no-op comment so Rollup doesn't emit
 *    EMPTY_BUNDLE warnings.  An empty chunk is a side-effect of setup.ts
 *    being both an entry point and a bare side-effect import from other
 *    entries — the content gets deduped into a shared chunk, leaving the
 *    original chunk empty.
 */
const cleanBuildPlugin: NonNullable<Options['plugins']>[number] = {
  name: 'clean-build',
  renderChunk(code, info) {
    let result = code;
    let changed = false;

    // Strip "use client" directive before Rollup sees it
    if (result.startsWith('"use client";') || result.startsWith("'use client';")) {
      result = result.replace(/^['"]use client['"];?\s*/, '');
      changed = true;
    }

    // Prevent EMPTY_BUNDLE warning: if a chunk is effectively empty (only
    // sourcemap comments or whitespace), inject a no-op marker so Rollup
    // considers it non-empty.
    const withoutComments = result.replace(/\/\/#\s*sourceMappingURL=.*/g, '').trim();
    if (withoutComments === '' && info.type === 'chunk' && info.path.includes('chunk-')) {
      // Assign to a global property — Rollup treats this as a side effect
      // since it cannot prove the assignment is safe to remove.
      result = 'globalThis.__ds_stub = 1;\n' + result;
      changed = true;
    }

    return changed ? { code: result, map: undefined } : undefined;
  },
};

const shared = {
  entry,
  sourcemap: true,
  external: [
    'react',
    'react-dom',
    'ag-grid-community',
    'ag-grid-enterprise',
    'ag-grid-react',
    'ag-charts-community',
    'ag-charts-enterprise',
    '@mfe/shared-http',
    '@mfe/shared-types',
    '@tanstack/react-query',
    'axios',
    'clsx',
    'tailwind-merge',
  ],
  treeshake: true,
  minify: true,
  esbuildOptions(options: Parameters<NonNullable<Options['esbuildOptions']>>[0]) {
    // Silence esbuild's own warning about module-level directives in source
    // files.  The directive is handled by the post-build script.
    options.logOverride = {
      ...options.logOverride,
      'module-level-directive': 'silent',
    };
  },
  plugins: [cleanBuildPlugin],
};

export default defineConfig([
  {
    ...shared,
    format: ['esm'],
    outDir: 'dist/esm',
    dts: false,
    splitting: true,
    outExtension: () => ({ js: '.js' }),
  },
  {
    ...shared,
    format: ['cjs'],
    outDir: 'dist/cjs',
    dts: false,
    splitting: false,
    outExtension: () => ({ js: '.cjs' }),
  },
]);
