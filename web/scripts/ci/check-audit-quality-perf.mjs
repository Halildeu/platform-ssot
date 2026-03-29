import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const root = path.resolve(process.cwd());
const distRoot = path.join(root, 'apps', 'mfe-audit', 'dist-quality');
const assetsRoot = path.join(distRoot, 'assets');

const budgets = {
  htmlRaw: 1024,
  htmlGzip: 512,
  cssRaw: 8 * 1024,
  cssBrotli: 2 * 1024,
  jsRaw: 2_400_000,
  jsGzip: 650_000,
  jsBrotli: 525_000,
};

function fail(message) {
  console.error(`[check-audit-quality-perf] FAIL: ${message}`);
  process.exit(1);
}

function readSizes(filePath) {
  const content = fs.readFileSync(filePath);
  return {
    raw: content.length,
    gzip: zlib.gzipSync(content).length,
    brotli: zlib.brotliCompressSync(content).length,
  };
}

if (!fs.existsSync(distRoot)) {
  fail(`dist-quality bulunamadi: ${distRoot}`);
}

if (!fs.existsSync(assetsRoot)) {
  fail(`assets klasoru bulunamadi: ${assetsRoot}`);
}

const htmlPath = path.join(distRoot, 'index.html');
if (!fs.existsSync(htmlPath)) {
  fail(`index.html bulunamadi: ${htmlPath}`);
}

const assetFiles = fs.readdirSync(assetsRoot);
const mainJs = assetFiles.find((file) => /^index-.*\.js$/.test(file));
const mainCss = assetFiles.find((file) => /^index-.*\.css$/.test(file));

if (!mainJs) {
  fail('index-*.js ana bundle dosyasi bulunamadi');
}

if (!mainCss) {
  fail('index-*.css ana stil dosyasi bulunamadi');
}

const htmlSizes = readSizes(htmlPath);
const cssPath = path.join(assetsRoot, mainCss);
const cssSizes = readSizes(cssPath);
const jsPath = path.join(assetsRoot, mainJs);
const jsSizes = readSizes(jsPath);

const violations = [];

if (htmlSizes.raw > budgets.htmlRaw) {
  violations.push(`index.html raw=${htmlSizes.raw} > ${budgets.htmlRaw}`);
}
if (htmlSizes.gzip > budgets.htmlGzip) {
  violations.push(`index.html gzip=${htmlSizes.gzip} > ${budgets.htmlGzip}`);
}
if (cssSizes.raw > budgets.cssRaw) {
  violations.push(`${mainCss} raw=${cssSizes.raw} > ${budgets.cssRaw}`);
}
if (cssSizes.brotli > budgets.cssBrotli) {
  violations.push(`${mainCss} brotli=${cssSizes.brotli} > ${budgets.cssBrotli}`);
}
if (jsSizes.raw > budgets.jsRaw) {
  violations.push(`${mainJs} raw=${jsSizes.raw} > ${budgets.jsRaw}`);
}
if (jsSizes.gzip > budgets.jsGzip) {
  violations.push(`${mainJs} gzip=${jsSizes.gzip} > ${budgets.jsGzip}`);
}
if (jsSizes.brotli > budgets.jsBrotli) {
  violations.push(`${mainJs} brotli=${jsSizes.brotli} > ${budgets.jsBrotli}`);
}

if (violations.length > 0) {
  fail(violations.join(' | '));
}

console.log('[check-audit-quality-perf] OK');
console.log(JSON.stringify({
  status: 'OK',
  html: { path: htmlPath, ...htmlSizes },
  css: { path: cssPath, ...cssSizes },
  js: { path: jsPath, ...jsSizes },
}));
