import { promises as fs } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SOURCE_LOCALE = 'en';
const OUTPUT_LOCALE = 'pseudo';
const dictionariesRoot = join(__dirname, '..', 'src', 'i18n', 'dictionaries');
const sourceRoot = join(dictionariesRoot, SOURCE_LOCALE);
const outputRoot = join(dictionariesRoot, OUTPUT_LOCALE);

const accentMap = new Map([
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

const pseudolocalize = (value) =>
  value
    .split('')
    .map((char) => accentMap.get(char) ?? char)
    .join('');

const walkFiles = async (dir) => {
  const entries = await fs.readdir(dir, { withFileTypes: true }).catch(() => []);
  const files = await Promise.all(
    entries.map((entry) => {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        return walkFiles(fullPath);
      }
      if (entry.isFile() && entry.name.endsWith('.json')) {
        return [fullPath];
      }
      return [];
    }),
  );
  return files.flat();
};

const generate = async () => {
  const files = await walkFiles(sourceRoot);
  if (files.length === 0) {
    console.warn('⚠️  Pseudolocale üretilecek sözlük bulunamadı:', sourceRoot);
    return;
  }

  await fs.mkdir(outputRoot, { recursive: true });

  await Promise.all(
    files.map(async (file) => {
      const relative = file.slice(sourceRoot.length + 1);
      const outputPath = join(outputRoot, relative);
      const raw = await fs.readFile(file, 'utf8');
      const data = JSON.parse(raw);

      const transformed = Object.fromEntries(
        Object.entries(data).map(([key, value]) => [key, typeof value === 'string' ? pseudolocalize(value) : value]),
      );

      await fs.mkdir(dirname(outputPath), { recursive: true });
      await fs.writeFile(`${outputPath}`, `${JSON.stringify(transformed, null, 2)}\n`, 'utf8');
    }),
  );

  console.log('✅ Pseudolocale sözlükleri üretildi:', outputRoot);
};

generate().catch((error) => {
  console.error('❌ Pseudolocale üretimi başarısız:', error);
  process.exitCode = 1;
});

