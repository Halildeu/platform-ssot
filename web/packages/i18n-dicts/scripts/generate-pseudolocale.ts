import { promises as fs } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  getAvailableNamespaces,
  getDictionary,
  dictionaryVersion,
} from '../src/index';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const TARGET_LOCALE = 'pseudo';
const BASE_LOCALE = 'en';
const localesRoot = join(__dirname, '..', 'src', 'locales');
const targetRoot = join(localesRoot, TARGET_LOCALE);

const accentMap = new Map<string, string>([
  ['a', 'á'],
  ['e', 'é'],
  ['i', 'í'],
  ['o', 'ó'],
  ['u', 'ú'],
  ['A', 'Á'],
  ['E', 'É'],
  ['I', 'Í'],
  ['O', 'Ó'],
  ['U', 'Ú'],
  ['c', 'ç'],
  ['C', 'Ç'],
  ['n', 'ñ'],
  ['N', 'Ñ'],
]);

const pseudolocalize = (value: string): string =>
  value
    .split('')
    .map((char) => accentMap.get(char) ?? char)
    .join('');

const generateFileContent = (entries: Record<string, string>): string => {
  const serialized = JSON.stringify(entries, null, 2);
  const banner = `// Generated from ${BASE_LOCALE} dictionaries (version ${dictionaryVersion})`;
  return `${banner}\nconst pseudo = ${serialized};\n\nexport default pseudo;\n`;
};

const main = async () => {
  const namespaces = getAvailableNamespaces();
  await fs.mkdir(targetRoot, { recursive: true });

  await Promise.all(
    namespaces.map(async (namespace) => {
      const baseDictionary = getDictionary(BASE_LOCALE, namespace);
      if (!baseDictionary) {
        console.warn(`⚠️  Base dictionary bulunamadı: ${BASE_LOCALE}/${namespace}`);
        return;
      }

      const transformed = Object.fromEntries(
        Object.entries(baseDictionary.dictionary).map(([key, value]) => [
          key,
          typeof value === 'string' ? pseudolocalize(value) : value,
        ]),
      );

      const filePath = join(targetRoot, `${namespace}.ts`);
      const content = generateFileContent(transformed);
      await fs.mkdir(dirname(filePath), { recursive: true });
      await fs.writeFile(filePath, content, 'utf8');
      console.log(`✅ ${TARGET_LOCALE}/${namespace} sözlüğü güncellendi: ${filePath}`);
    }),
  );
};

main().catch((error) => {
  console.error('❌ Pseudolocale üretimi başarısız:', error);
  process.exitCode = 1;
});
