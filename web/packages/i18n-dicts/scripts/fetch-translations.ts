import { createHash } from 'node:crypto';
import { promises as fs } from 'node:fs';
import { join, dirname, normalize, relative } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

type CLIOptions = {
  dryRun: boolean;
  ci: boolean;
  localOnly: boolean;
};

type RawDictionary = Record<string, unknown>;

type NormalizedDictionary = Record<string, string>;

type ManifestEntry = {
  locale: string;
  namespace: string;
  sha256: string;
  size: number;
  keyCount: number;
  keysAdded: number;
  keysRemoved: number;
  keysChanged: number;
  updatedAt: string;
  sourceUpdatedAt?: string;
  sourceVersion?: string;
  etag?: string;
  lastModified?: string;
};

type Manifest = {
  version: string;
  generatedAt: string;
  tms: {
    baseUrl?: string;
    env?: string;
  };
  entries: Record<string, ManifestEntry>;
};

type DiffSummary = {
  added: number;
  removed: number;
  changed: number;
};

type ChangeAccumulator = {
  hasChanges: boolean;
  hasMajor: boolean;
  hasMinor: boolean;
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PACKAGE_ROOT = join(__dirname, '..');
const SRC_ROOT = join(PACKAGE_ROOT, 'src');
const LOCALES_ROOT = join(SRC_ROOT, 'locales');
const MANIFEST_PATH = join(PACKAGE_ROOT, 'manifest.json');

const DEFAULT_LOCALES = ['en', 'tr'];
const DISCOVERY_ENDPOINT = '/api/dicts/namespaces';
const DICT_ENDPOINT = '/api/dicts';

const parseArgs = (): CLIOptions => {
  const args = process.argv.slice(2);
  return {
    dryRun: args.includes('--dry-run'),
    ci: args.includes('--ci'),
    localOnly: args.includes('--local-only'),
  };
};

const parseList = (value: string | undefined): string[] | undefined => {
  if (!value) {
    return undefined;
  }
  const items = value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
  return items.length > 0 ? items : undefined;
};

const pathExists = async (path: string): Promise<boolean> => {
  try {
    await fs.access(path);
    return true;
  } catch {
    return false;
  }
};

const loadManifest = async (): Promise<Manifest> => {
  if (!(await pathExists(MANIFEST_PATH))) {
    return {
      version: '0.0.0',
      generatedAt: new Date().toISOString(),
      tms: {},
      entries: {},
    };
  }
  const file = await fs.readFile(MANIFEST_PATH, 'utf8');
  try {
    const parsed = JSON.parse(file) as Manifest;
    return parsed;
  } catch (error) {
    throw new Error(`manifest.json parse edilemedi: ${(error as Error).message}`);
  }
};

const saveManifest = async (manifest: Manifest, dryRun: boolean) => {
  const serialized = `${JSON.stringify(manifest, null, 2)}\n`;
  if (dryRun) {
    console.log('ℹ️  (dry-run) manifest güncellendi, dosyaya yazılmadı.');
    return;
  }
  await fs.writeFile(MANIFEST_PATH, serialized, 'utf8');
};

const normalizeBaseUrl = (value?: string): string | undefined => {
  if (!value) {
    return undefined;
  }
  return value.endsWith('/') ? value.slice(0, -1) : value;
};

const fetchJSON = async (
  url: URL,
  init: RequestInit,
): Promise<Response> => {
  const response = await fetch(url, init);
  if (!response.ok && response.status !== 304) {
    const body = await response.text();
    throw new Error(`TMS isteği başarısız (${response.status} ${response.statusText}): ${body}`);
  }
  return response;
};

const fetchNamespaces = async (
  baseUrl: string,
  locale: string,
  token: string,
  env: string | undefined,
): Promise<string[] | undefined> => {
  if (!baseUrl || !token) {
    return undefined;
  }
  try {
    const url = new URL(`${baseUrl}${DISCOVERY_ENDPOINT}`);
    url.searchParams.set('locale', locale);
    if (env) {
      url.searchParams.set('env', env);
    }
    const response = await fetchJSON(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });
    if (response.status === 304) {
      return undefined;
    }
    const payload = (await response.json()) as { namespaces?: string[] };
    if (!payload.namespaces || payload.namespaces.length === 0) {
      return undefined;
    }
    return payload.namespaces.sort();
  } catch (error) {
    console.warn('⚠️  Namespace discovery başarısız, fallback kullanılacak:', (error as Error).message);
    return undefined;
  }
};

const listDirectories = async (basePath: string): Promise<string[]> => {
  try {
    const entries = await fs.readdir(basePath, { withFileTypes: true });
    return entries.filter((dirent) => dirent.isDirectory()).map((dirent) => dirent.name).sort();
  } catch {
    return [];
  }
};

const listNamespaceFiles = async (locale: string): Promise<string[]> => {
  const localeDir = join(LOCALES_ROOT, locale);
  try {
    const entries = await fs.readdir(localeDir, { withFileTypes: true });
    return entries
      .filter((dirent) => dirent.isFile() && dirent.name.endsWith('.ts'))
      .map((dirent) => dirent.name.replace(/\.ts$/, ''))
      .sort();
  } catch {
    return [];
  }
};

const flattenDictionary = (
  input: RawDictionary,
  parentKey = '',
  accumulator: NormalizedDictionary = {},
): NormalizedDictionary => {
  for (const [key, value] of Object.entries(input)) {
    const resolvedKey = parentKey ? `${parentKey}.${key}` : key;
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      flattenDictionary(value as RawDictionary, resolvedKey, accumulator);
    } else if (typeof value === 'string') {
      accumulator[resolvedKey] = value;
    } else if (value !== undefined && value !== null) {
      accumulator[resolvedKey] = String(value);
    }
  }
  return accumulator;
};

const sortDictionary = (dictionary: NormalizedDictionary): NormalizedDictionary =>
  Object.fromEntries(Object.keys(dictionary).sort().map((key) => [key, dictionary[key]]));

const toQuotedString = (value: string): string => {
  const escapedInner = JSON.stringify(value);
  // escapedInner is wrapped with double quotes; convert into single quoted string.
  const inner = escapedInner.slice(1, -1).replace(/'/g, "\\'");
  return `'${inner}'`;
};

const renderDictionaryModule = (
  namespace: string,
  dictionary: NormalizedDictionary,
): string => {
  const lines = Object.entries(dictionary).map(
    ([key, value]) => `  '${key}': ${toQuotedString(value)},`,
  );
  const body = lines.join('\n');
  return `const ${namespace} = {\n${body}\n};\n\nexport default ${namespace};\n`;
};

const computeSha = (content: string): string =>
  createHash('sha256').update(content).digest('hex');

const loadExistingDictionary = async (
  locale: string,
  namespace: string,
): Promise<NormalizedDictionary> => {
  const filePath = join(LOCALES_ROOT, locale, `${namespace}.ts`);
  if (!(await pathExists(filePath))) {
    return {};
  }
  try {
    const moduleUrl = pathToFileURL(filePath).href;
    const mod = await import(moduleUrl);
    const raw = (mod.default ?? mod[namespace] ?? {}) as RawDictionary;
    return sortDictionary(flattenDictionary(raw));
  } catch (error) {
    console.warn(
      `⚠️  ${locale}/${namespace} sözlüğü import edilemedi: ${(error as Error).message}`,
    );
    return {};
  }
};

const diffDictionaries = (
  prev: NormalizedDictionary,
  next: NormalizedDictionary,
): DiffSummary => {
  let added = 0;
  let removed = 0;
  let changed = 0;

  const prevKeys = new Set(Object.keys(prev));
  const nextKeys = new Set(Object.keys(next));

  for (const key of nextKeys) {
    if (!prevKeys.has(key)) {
      added += 1;
    } else if (prev[key] !== next[key]) {
      changed += 1;
    }
  }

  for (const key of prevKeys) {
    if (!nextKeys.has(key)) {
      removed += 1;
    }
  }

  return { added, removed, changed };
};

const bumpVersion = (current: string, changeType: 'major' | 'minor' | 'patch'): string => {
  const [major = 0, minor = 0, patch = 0] = current
    .split('.')
    .map((segment) => Number.parseInt(segment, 10))
    .map((segment) => (Number.isNaN(segment) ? 0 : segment));

  if (changeType === 'major') {
    return `${major + 1}.0.0`;
  }
  if (changeType === 'minor') {
    return `${major}.${minor + 1}.0`;
  }
  return `${major}.${minor}.${patch + 1}`;
};

const buildEntryKey = (locale: string, namespace: string) => `${locale}:${namespace}`;

const logChange = (
  locale: string,
  namespace: string,
  diff: DiffSummary,
  options: CLIOptions,
) => {
  if (!diff.added && !diff.removed && !diff.changed) {
    console.log(`➖ ${locale}/${namespace} değişmedi.`);
    return;
  }
  const scope = `${locale}/${namespace}`;
  const parts = [
    diff.added ? `+${diff.added}` : null,
    diff.removed ? `-${diff.removed}` : null,
    diff.changed ? `~${diff.changed}` : null,
  ].filter(Boolean);
  const prefix = options.dryRun ? '🔍 (dry-run)' : '✅';
  console.log(`${prefix} ${scope} güncellendi (${parts.join(', ')}).`);
};

const main = async () => {
  const options = parseArgs();
  const manifest = await loadManifest();
  const manifestEntries = { ...manifest.entries };
  const changeAccumulator: ChangeAccumulator = {
    hasChanges: false,
    hasMajor: false,
    hasMinor: false,
  };
  const processedKeys = new Set<string>();

  const baseUrl = normalizeBaseUrl(process.env.TMS_BASE_URL);
  const apiToken = process.env.TMS_API_TOKEN;
  const tmsEnv = process.env.TMS_ENV;

  const locales =
    parseList(process.env.I18N_LOCALES) ??
    (await listDirectories(LOCALES_ROOT)).filter((locale) => locale !== 'pseudo') ??
    DEFAULT_LOCALES;

  let namespaces =
    parseList(process.env.I18N_NAMESPACES) ??
    (await fetchNamespaces(baseUrl ?? '', locales[0] ?? 'en', apiToken ?? '', tmsEnv));

  if (!namespaces || namespaces.length === 0) {
    // fallback: union of namespaces for each locale that already exists
    const namespaceSet = new Set<string>();
    for (const locale of locales) {
      const files = await listNamespaceFiles(locale);
      files.forEach((name) => namespaceSet.add(name));
    }
    namespaces = namespaceSet.size > 0 ? Array.from(namespaceSet).sort() : ['common'];
  }

  if (!options.localOnly && (!baseUrl || !apiToken)) {
    throw new Error(
      'TMS_BASE_URL ve TMS_API_TOKEN ortam değişkenleri tanımlı olmalı (ya da --local-only kullanılmalı).',
    );
  }

  for (const locale of locales) {
    for (const namespace of namespaces) {
      const key = buildEntryKey(locale, namespace);
      processedKeys.add(key);
      const previousEntry = manifest.entries[key];
      const previousDictionary = await loadExistingDictionary(locale, namespace);

      if (options.localOnly) {
        if (Object.keys(previousDictionary).length === 0) {
          console.warn(`⚠️  ${locale}/${namespace} için yerel sözlük bulunamadı, atlanıyor.`);
          continue;
        }
        const serialized = JSON.stringify(previousDictionary, null, 2);
        manifestEntries[key] = {
          locale,
          namespace,
          sha256: computeSha(serialized),
          size: Buffer.byteLength(serialized, 'utf8'),
          keyCount: Object.keys(previousDictionary).length,
          keysAdded: 0,
          keysRemoved: 0,
          keysChanged: 0,
          updatedAt: new Date().toISOString(),
          sourceVersion: previousEntry?.sourceVersion,
          sourceUpdatedAt: previousEntry?.sourceUpdatedAt,
          etag: previousEntry?.etag,
          lastModified: previousEntry?.lastModified,
        };
        continue;
      }

      const entryUrl = new URL(
        `${baseUrl}${DICT_ENDPOINT}/${encodeURIComponent(locale)}/${encodeURIComponent(namespace)}`,
      );
      if (tmsEnv) {
        entryUrl.searchParams.set('env', tmsEnv);
      }
      const headers: Record<string, string> = {
        Authorization: `Bearer ${apiToken}`,
        Accept: 'application/json',
      };
      if (previousEntry?.etag) {
        headers['If-None-Match'] = previousEntry.etag;
      } else if (previousEntry?.lastModified) {
        headers['If-Modified-Since'] = previousEntry.lastModified;
      }

      const response = await fetchJSON(entryUrl, { headers });

      if (response.status === 304) {
        logChange(locale, namespace, { added: 0, removed: 0, changed: 0 }, options);
        manifestEntries[key] = previousEntry ?? {
          locale,
          namespace,
          sha256: '',
          size: 0,
          keyCount: 0,
          keysAdded: 0,
          keysRemoved: 0,
          keysChanged: 0,
          updatedAt: new Date().toISOString(),
        };
        continue;
      }

      const payload = (await response.json()) as {
        keys?: RawDictionary;
        updatedAt?: string;
        version?: string;
      };
      const rawDictionary = payload.keys ?? (payload as RawDictionary);
      const normalized = sortDictionary(flattenDictionary(rawDictionary));
      const diff = diffDictionaries(previousDictionary, normalized);

      const moduleContent = renderDictionaryModule(namespace, normalized);
      const serializedForHash = JSON.stringify(normalized, null, 2);
      const sha256 = computeSha(serializedForHash);
      const filePath = join(LOCALES_ROOT, locale, `${namespace}.ts`);

      if (!options.dryRun) {
        await fs.mkdir(dirname(filePath), { recursive: true });
        await fs.writeFile(filePath, `${moduleContent}`, 'utf8');
      } else {
        console.log(
          `ℹ️  (dry-run) ${relative(PACKAGE_ROOT, normalize(filePath))} yazılmayacak.`,
        );
      }

      manifestEntries[key] = {
        locale,
        namespace,
        sha256,
        size: Buffer.byteLength(moduleContent, 'utf8'),
        keyCount: Object.keys(normalized).length,
        keysAdded: diff.added,
        keysRemoved: diff.removed,
        keysChanged: diff.changed,
        updatedAt: new Date().toISOString(),
        sourceUpdatedAt: payload.updatedAt,
        sourceVersion: payload.version,
        etag: response.headers.get('etag') ?? undefined,
        lastModified: response.headers.get('last-modified') ?? undefined,
      };

      if (diff.added || diff.changed || diff.removed) {
        changeAccumulator.hasChanges = true;
      }

      if (!previousEntry) {
        changeAccumulator.hasMinor = true;
      }

      if (previousDictionary && Object.keys(previousDictionary).length > 0) {
        const removalRatio =
          Object.keys(previousDictionary).length === 0
            ? 0
            : diff.removed / Object.keys(previousDictionary).length;
        if (removalRatio > 0.05) {
          changeAccumulator.hasMajor = true;
        }
      }

      logChange(locale, namespace, diff, options);
    }
  }

  // Preserve untouched entries
  for (const [key, entry] of Object.entries(manifest.entries)) {
    if (!processedKeys.has(key)) {
      manifestEntries[key] = entry;
    }
  }

  let nextVersion = manifest.version ?? '0.0.0';
  if (changeAccumulator.hasChanges) {
    if (changeAccumulator.hasMajor) {
      nextVersion = bumpVersion(nextVersion, 'major');
    } else if (changeAccumulator.hasMinor) {
      nextVersion = bumpVersion(nextVersion, 'minor');
    } else {
      nextVersion = bumpVersion(nextVersion, 'patch');
    }
  }

  const updatedManifest: Manifest = {
    version: nextVersion,
    generatedAt: new Date().toISOString(),
    tms: {
      baseUrl,
      env: tmsEnv,
    },
    entries: manifestEntries,
  };

  await saveManifest(updatedManifest, options.dryRun);

  if (!changeAccumulator.hasChanges) {
    console.log('✅ Sözlüklerde değişiklik tespit edilmedi.');
  } else {
    console.log(`📦 manifest versiyonu güncellendi: ${manifest.version} -> ${nextVersion}`);
  }
};

main().catch((error) => {
  console.error('❌ i18n sözlük güncelleme başarısız:', error);
  process.exitCode = 1;
});
