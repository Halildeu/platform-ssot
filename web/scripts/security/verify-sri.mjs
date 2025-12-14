#!/usr/bin/env node
/**
 * SRI doğrulama ve rotasyon aracı.
 *
 * Kullanım:
 *   node scripts/security/verify-sri.mjs --check
 *   node scripts/security/verify-sri.mjs --write
 *   node scripts/security/verify-sri.mjs --check --output security-reports/sri/report.json
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..', '..');
const manifestPath = path.join(repoRoot, 'security', 'sri-manifest.json');

const args = process.argv.slice(2);
const writeMode = args.includes('--write');
const checkMode = args.includes('--check') || !writeMode;
const outputIdx = args.findIndex((arg) => arg === '--output');
const outputPath = outputIdx >= 0 ? path.resolve(process.cwd(), args[outputIdx + 1]) : null;

const loadManifest = async () => {
  try {
    const raw = await readFile(manifestPath, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    throw new Error(`SRI manifest dosyası okunamadı: ${manifestPath}\n${error instanceof Error ? error.message : error}`);
  }
};

const computeSri = (buffer) => {
  const hash = createHash('sha384').update(buffer).digest('base64');
  return `sha384-${hash}`;
};

const verify = async () => {
    const manifest = await loadManifest();
    const entries = Object.entries(manifest.remotes ?? {});
    if (entries.length === 0) {
      throw new Error('SRI manifest içinde doğrulanacak remote kaydı bulunamadı.');
    }

    const now = new Date().toISOString();
    const report = {
      generatedAt: now,
      results: [],
    };

    let hasMismatch = false;

    for (const [remoteKey, value] of entries) {
      const artifactRel = value.artifact;
      if (!artifactRel) {
        throw new Error(`SRI manifest kaydı eksik: ${remoteKey} için 'artifact' alanı tanımlı değil.`);
      }

      const artifactAbs = path.resolve(repoRoot, artifactRel);
      let fileBuffer;
      try {
        fileBuffer = await readFile(artifactAbs);
      } catch (error) {
        throw new Error(`SRI doğrulaması için gerekli artefact bulunamadı: ${artifactRel}\n${error instanceof Error ? error.message : error}`);
      }

      const calculatedSri = computeSri(fileBuffer);
      const expectedSri = value.sri;

      const matches = calculatedSri === expectedSri;
      if (!matches) {
        hasMismatch = true;
      }

      report.results.push({
        remote: remoteKey,
        artifact: artifactRel,
        expected: expectedSri,
        calculated: calculatedSri,
        matches,
      });

      if (writeMode) {
        value.sri = calculatedSri;
        value.lastRotatedAt = now;
      }
    }

    if (writeMode) {
      manifest.generatedAt = now;
      await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
      console.log(`🔐 SRI manifest güncellendi (${manifestPath}).`);
    } else {
      if (outputPath) {
        const dir = path.dirname(outputPath);
        await mkdir(dir, { recursive: true });
        await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
        console.log(`📝 SRI doğrulama raporu kaydedildi: ${outputPath}`);
      }

      if (hasMismatch && checkMode) {
        console.error('❌ SRI doğrulaması başarısız. Manifestteki değerlerle yeni hash’ler uyuşmuyor.');
        process.exit(1);
      }

      console.log('✅ SRI doğrulaması başarılı.');
    }
};

verify().catch((error) => {
  console.error(`SRI doğrulama sırasında hata oluştu:\n${error instanceof Error ? error.stack || error.message : String(error)}`);
  process.exit(1);
});
