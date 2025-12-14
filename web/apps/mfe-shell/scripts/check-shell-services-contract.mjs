import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const schemaPath = join(__dirname, '..', 'src', 'app', 'services', 'contract', 'shell-services.contract.json');

const schemaRaw = readFileSync(schemaPath, 'utf8');
const schema = JSON.parse(schemaRaw);

const requiredSections = ['auth', 'query', 'telemetry', 'notify', 'featureFlags'];
const requiredAuthProps = ['getToken', 'onTokenChange'];

if (typeof schema.version !== 'string') {
  throw new Error('Shell services contract must expose a semantic version string.');
}

if (!Array.isArray(schema.required)) {
  throw new Error('Shell services contract must list required sections.');
}

for (const section of requiredSections) {
  if (!schema.required.includes(section)) {
    throw new Error(`Shell services contract eksik: "${section}" zorunlu alanlardan değil.`);
  }
  if (!schema.properties?.[section]) {
    throw new Error(`Shell services contract eksik: "${section}" için properties tanımlı değil.`);
  }
}

const authProperties = schema.properties.auth?.properties ?? {};
for (const prop of requiredAuthProps) {
  if (!authProperties[prop]) {
    throw new Error(`Shell services contract auth.${prop} tanımı bulunamadı.`);
  }
}

console.log('✅ Shell services contract doğrulandı (version:', schema.version + ')');
