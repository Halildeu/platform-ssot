import { promises as fs } from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const webRoot = path.resolve(__dirname, '..', '..');
const repoRoot = path.resolve(webRoot, '..');

const uiKitPackagePath = path.join(webRoot, 'packages', 'ui-kit', 'package.json');
const registryPath = path.join(webRoot, 'packages', 'ui-kit', 'src', 'catalog', 'component-registry.v1.json');
const apiCatalogPath = path.join(webRoot, 'packages', 'ui-kit', 'src', 'catalog', 'component-api-catalog.v1.json');
const contractPath = path.join(repoRoot, 'docs', '02-architecture', 'context', 'ui-library-package-release.contract.v1.json');
const releaseNotesPath = path.join(repoRoot, 'docs', '04-operations', 'RELEASE-NOTES', 'RELEASE-NOTES-ui-library.md');
const outputRoot = path.join(webRoot, 'test-results', 'releases', 'ui-library');
const distManifestPath = path.join(webRoot, 'dist', 'ui-kit', 'ui-library-release-manifest.v1.json');
const distMarkdownPath = path.join(webRoot, 'dist', 'ui-kit', 'ui-library-release-manifest.v1.md');

async function readJson(file) {
  return JSON.parse(await fs.readFile(file, 'utf8'));
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function exists(file) {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
}

async function sha256(file) {
  const buf = await fs.readFile(file);
  return crypto.createHash('sha256').update(buf).digest('hex');
}

function parseReleaseEntries(text) {
  const lines = text.split(/\r?\n/);
  const entries = [];
  let current = null;
  let inEvidence = false;
  let inEntriesSection = false;
  for (const raw of lines) {
    const line = raw.trimEnd();
    if (line.trim() === '## Entries') {
      inEntriesSection = true;
      current = null;
      inEvidence = false;
      continue;
    }
    if (!inEntriesSection) continue;
    if (line.startsWith('- version:')) {
      if (current) entries.push(current);
      current = {
        version: line.split(':').slice(1).join(':').trim(),
        date: '',
        changed_components: '',
        lifecycle_changes: '',
        breaking_changes: '',
        migration_notes: '',
        evidence_refs: [],
      };
      inEvidence = false;
      continue;
    }
    if (!current) continue;
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith('date:')) current.date = trimmed.slice(5).trim();
    else if (trimmed.startsWith('changed_components:')) current.changed_components = trimmed.slice('changed_components:'.length).trim();
    else if (trimmed.startsWith('lifecycle_changes:')) current.lifecycle_changes = trimmed.slice('lifecycle_changes:'.length).trim();
    else if (trimmed.startsWith('breaking_changes:')) current.breaking_changes = trimmed.slice('breaking_changes:'.length).trim();
    else if (trimmed.startsWith('migration_notes:')) current.migration_notes = trimmed.slice('migration_notes:'.length).trim();
    else if (trimmed.startsWith('evidence_refs:')) inEvidence = true;
    else if (inEvidence && trimmed.startsWith('- ')) current.evidence_refs.push(trimmed.slice(2).trim());
  }
  if (current) entries.push(current);
  return entries;
}

async function collectArtifactInfo(paths) {
  const out = [];
  for (const rel of paths) {
    const abs = path.join(repoRoot, rel);
    const present = await exists(abs);
    out.push({
      path: rel,
      present,
      sha256: present ? await sha256(abs) : '',
    });
  }
  return out;
}

function summarizeRegistry(registry, apiCatalog) {
  const items = Array.isArray(registry.items) ? registry.items : [];
  const apiItems = Array.isArray(apiCatalog.items) ? apiCatalog.items : [];
  const countBy = (field, value) => items.filter((item) => item[field] === value).length;
  return {
    total: items.length,
    exported: countBy('availability', 'exported'),
    planned: countBy('availability', 'planned'),
    stable: countBy('lifecycle', 'stable'),
    beta: countBy('lifecycle', 'beta'),
    liveDemo: countBy('demoMode', 'live'),
    apiCatalogItems: apiItems.length,
  };
}

function buildMarkdown(manifest) {
  const lines = [];
  lines.push('# UI Library Release Manifest');
  lines.push('');
  lines.push(`- package: ${manifest.package.name}`);
  lines.push(`- version: ${manifest.package.version}`);
  lines.push(`- date: ${manifest.generated_at}`);
  lines.push(`- latest_release_notes: ${manifest.release_notes.version} (${manifest.release_notes.date})`);
  lines.push('');
  lines.push('## Registry Summary');
  lines.push(`- total: ${manifest.registry_summary.total}`);
  lines.push(`- exported: ${manifest.registry_summary.exported}`);
  lines.push(`- planned: ${manifest.registry_summary.planned}`);
  lines.push(`- stable: ${manifest.registry_summary.stable}`);
  lines.push(`- beta: ${manifest.registry_summary.beta}`);
  lines.push(`- live_demo: ${manifest.registry_summary.liveDemo}`);
  lines.push(`- api_catalog_items: ${manifest.registry_summary.apiCatalogItems}`);
  lines.push('');
  lines.push('## Distribution Targets');
  for (const target of manifest.distribution_targets) {
    lines.push(`- ${target.target_id} (${target.channel})`);
    for (const artifact of target.artifacts) {
      const mark = artifact.present ? 'OK' : 'MISSING';
      lines.push(`  - ${artifact.path}: ${mark}`);
    }
  }
  lines.push('');
  lines.push('## Evidence');
  for (const ref of manifest.release_notes.evidence_refs) {
    lines.push(`- ${ref}`);
  }
  return lines.join('\n') + '\n';
}

async function main() {
  const uiKitPackage = await readJson(uiKitPackagePath);
  const contract = await readJson(contractPath);
  const registry = await readJson(registryPath);
  const apiCatalog = await readJson(apiCatalogPath);
  const releaseNotesText = await fs.readFile(releaseNotesPath, 'utf8');
  const releaseEntries = parseReleaseEntries(releaseNotesText);
  const latestEntry = releaseEntries[0] || null;
  if (!latestEntry) {
    throw new Error('Release notes entry bulunamadi');
  }
  if (latestEntry.version !== uiKitPackage.version) {
    throw new Error(`Release notes son girisi (${latestEntry.version}) package version (${uiKitPackage.version}) ile uyusmuyor`);
  }

  const versionDir = path.join(outputRoot, uiKitPackage.version);
  const latestDir = path.join(outputRoot, 'latest');
  await ensureDir(versionDir);
  await ensureDir(latestDir);
  if (await exists(path.dirname(distManifestPath))) {
    await ensureDir(path.dirname(distManifestPath));
  }

  const distributionTargets = [];
  for (const target of contract.distribution_targets || []) {
    distributionTargets.push({
      target_id: target.target_id,
      channel: target.channel,
      build_command: target.build_command,
      artifacts: await collectArtifactInfo(target.artifact_paths || []),
    });
  }

  const manifest = {
    version: '1.0',
    manifest_id: 'ui-library-release-manifest-v1',
    generated_at: new Date().toISOString(),
    package: {
      name: uiKitPackage.name,
      version: uiKitPackage.version,
      package_json_path: path.relative(repoRoot, uiKitPackagePath),
    },
    contract: {
      path: path.relative(repoRoot, contractPath),
      contract_id: contract.contract_id,
    },
    release_notes: latestEntry,
    registry_summary: summarizeRegistry(registry, apiCatalog),
    distribution_targets: distributionTargets,
    evidence_paths: {
      design_lab_index: 'web/apps/mfe-shell/src/pages/admin/design-lab.index.json',
      frontend_doctor: 'web/test-results/diagnostics/frontend-doctor/latest/frontend-doctor.summary.v1.json',
      wave_gate: 'web/test-results/diagnostics/ui-library-wave-gate/latest/ui-library-wave-gate.summary.v1.json',
      release_gate: 'web/test-results/diagnostics/ui-library-release-gate/latest/ui-library-release-gate.summary.v1.json',
    },
  };

  const manifestJson = JSON.stringify(manifest, null, 2) + '\n';
  const manifestMd = buildMarkdown(manifest);
  const versionJson = path.join(versionDir, 'ui-library-release-manifest.v1.json');
  const versionMd = path.join(versionDir, 'ui-library-release-manifest.v1.md');
  const latestJson = path.join(latestDir, 'ui-library-release-manifest.v1.json');
  const latestMd = path.join(latestDir, 'ui-library-release-manifest.v1.md');

  await fs.writeFile(versionJson, manifestJson, 'utf8');
  await fs.writeFile(versionMd, manifestMd, 'utf8');
  await fs.writeFile(latestJson, manifestJson, 'utf8');
  await fs.writeFile(latestMd, manifestMd, 'utf8');
  await ensureDir(path.dirname(distManifestPath));
  await fs.writeFile(distManifestPath, manifestJson, 'utf8');
  await fs.writeFile(distMarkdownPath, manifestMd, 'utf8');

  console.log(`[export-ui-library-release-manifest] OK version=${uiKitPackage.version} targets=${distributionTargets.length}`);
}

main().catch((error) => {
  console.error(`[export-ui-library-release-manifest] FAIL ${error.message}`);
  process.exit(1);
});
