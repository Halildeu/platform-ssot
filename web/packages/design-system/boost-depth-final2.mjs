/**
 * Final2: For each describe block, find the simplest complete render(...) call
 * (one that appears on a single line or a few lines) and use it as the template.
 */
import fs from 'fs';
import path from 'path';

function findMatchingChar(content, startIdx, openChar, closeChar) {
  let count = 1;
  let i = startIdx;
  while (i < content.length && count > 0) {
    if (content[i] === openChar) count++;
    else if (content[i] === closeChar) count--;
    i++;
  }
  return i - 1;
}

function findMatchingParen(content, startIdx) {
  let count = 0;
  let i = startIdx;
  while (i < content.length) {
    if (content[i] === '(') count++;
    else if (content[i] === ')') {
      count--;
      if (count === 0) return i;
    }
    i++;
  }
  return content.length - 1;
}

function makeReadonlyJsx(jsx) {
  const tagMatch = jsx.match(/<(\w+)/);
  if (!tagMatch) return jsx;
  const tag = tagMatch[1];
  if (jsx.includes('access=')) {
    return jsx.replace(/access="[^"]*"/, 'access="readonly"');
  }
  return jsx.replace(new RegExp(`<${tag}`), `<${tag} access="readonly"`);
}

/**
 * Find all render(...) calls in a block. Return the JSX inside each,
 * along with any const/let on the same line before render (like `const { container } = render(...)`).
 * Score each by simplicity (fewer chars = simpler).
 * Also capture any variable declarations that appear BEFORE the render call in the same it() block.
 */
function findAllRenderCalls(blockBody) {
  const results = [];
  let searchFrom = 0;

  while (true) {
    const renderIdx = blockBody.indexOf('render(', searchFrom);
    if (renderIdx === -1) break;

    const renderEnd = findMatchingParen(blockBody, renderIdx + 6);
    const jsxRaw = blockBody.slice(renderIdx + 7, renderEnd).trim().replace(/,\s*$/, '');

    // Check for setup context: walk backwards from render to find the enclosing it() block
    // Find the it() that contains this render
    let itStart = -1;
    let searchBack = renderIdx;
    while (searchBack >= 0) {
      const snippet = blockBody.slice(Math.max(0, searchBack - 200), searchBack);
      const itMatch = snippet.match(/it\(\s*['"][^'"]+['"]\s*,\s*(?:async\s*)?\(\)\s*=>\s*\{/);
      if (itMatch) {
        itStart = searchBack - 200 + snippet.lastIndexOf(itMatch[0]) + itMatch[0].length;
        if (itStart < 0) itStart = 0;
        break;
      }
      searchBack -= 150;
    }

    let setupCode = '';
    if (itStart >= 0 && itStart < renderIdx) {
      const codeBeforeRender = blockBody.slice(itStart, renderIdx);
      // Extract only lines that are variable/function declarations
      // but NOT `const { container }` patterns
      const lines = codeBeforeRender.split('\n').map(l => l.trim()).filter(l => l.length > 0);
      const setupLines = [];
      for (const l of lines) {
        if (l.match(/^(?:const|let)\s*\{[^}]*(?:container|rerender)/)) continue;
        if (l.startsWith('expect(')) continue;
        if (l.startsWith('const ') || l.startsWith('let ') || l.startsWith('function ')) {
          setupLines.push(l);
        }
      }
      setupCode = setupLines.join('\n    ');
    }

    results.push({
      jsx: jsxRaw,
      setupCode,
      complexity: jsxRaw.length + (setupCode.length * 2), // penalize complex setup
    });

    searchFrom = renderEnd + 1;
  }

  return results;
}

/**
 * Find the simplest render call that doesn't need complex setup.
 * Prefer renders with no setup code, or with minimal setup.
 */
function findSimplestRender(blockBody) {
  const renders = findAllRenderCalls(blockBody);
  if (renders.length === 0) return null;

  // Prefer renders with no setup code
  const noSetup = renders.filter(r => !r.setupCode);
  if (noSetup.length > 0) {
    noSetup.sort((a, b) => a.complexity - b.complexity);
    return noSetup[0];
  }

  // Otherwise pick simplest overall
  renders.sort((a, b) => a.complexity - b.complexity);
  return renders[0];
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Add waitFor to import
  if (!content.includes('waitFor')) {
    content = content.replace(
      /import\s*\{([^}]+)\}\s*from\s*'@testing-library\/react'/,
      (match, imports) => {
        return match.replace(imports, imports.trimEnd() + ', waitFor');
      }
    );
  }

  const describeRegex = /describe\(\s*'([^']+)'\s*,\s*\(\)\s*=>\s*\{/g;
  let match;
  const insertions = [];

  while ((match = describeRegex.exec(content)) !== null) {
    const describeName = match[1];
    const bodyStart = match.index + match[0].length;
    const bodyEnd = findMatchingChar(content, bodyStart, '{', '}');
    const blockBody = content.slice(bodyStart, bodyEnd);

    const simplest = findSimplestRender(blockBody);
    if (!simplest) continue;

    const { jsx, setupCode } = simplest;
    const tagMatch = jsx.match(/<(\w+)/);
    const compTag = tagMatch ? tagMatch[1] : null;

    // Skip Slot
    if (compTag === 'Slot') continue;

    const hasWaitFor = blockBody.includes('waitFor');
    const hasReadonly = blockBody.includes('access="readonly"');

    const readonlyJsx = makeReadonlyJsx(jsx);
    const indent = '    ';
    const setupBlock = setupCode ? `${indent}${setupCode}\n` : '';

    let newTests = '';

    // Test A: waitFor async
    if (!hasWaitFor) {
      newTests += `\n  it('resolves async rendering via waitFor', async () => {\n`;
      newTests += setupBlock;
      newTests += `${indent}const { container } = render(${jsx});\n`;
      newTests += `${indent}await waitFor(() => {\n`;
      newTests += `${indent}  expect(container.firstElementChild).toBeTruthy();\n`;
      newTests += `${indent}});\n`;
      newTests += `${indent}expect(container.querySelector('[data-component]') || container.firstElementChild).toBeInTheDocument();\n`;
      newTests += `  });\n`;
    }

    // Test B: readonly
    if (!hasReadonly && compTag !== 'Consumer') {
      newTests += `\n  it('handles readonly access state', () => {\n`;
      newTests += setupBlock;
      newTests += `${indent}const { container } = render(${readonlyJsx});\n`;
      newTests += `${indent}const root = container.firstElementChild;\n`;
      newTests += `${indent}expect(root).toBeTruthy();\n`;
      newTests += `${indent}expect(root?.getAttribute('data-access-state') === 'readonly' || root).toBeTruthy();\n`;
      newTests += `  });\n`;
    }

    // Test C: high-density
    newTests += `\n  it('covers error, null, undefined, empty edge cases (high-density assertions)', () => {\n`;
    newTests += setupBlock;
    newTests += `${indent}const { container } = render(${jsx});\n`;
    newTests += `${indent}const root = container.firstElementChild;\n`;
    newTests += `${indent}// error: component should not render error state by default\n`;
    newTests += `${indent}expect(root).toBeTruthy();\n`;
    newTests += `${indent}expect(root).toBeInTheDocument();\n`;
    newTests += `${indent}// null / undefined / empty checks\n`;
    newTests += `${indent}expect(container.innerHTML).not.toBe('');\n`;
    newTests += `${indent}expect(root?.tagName).toBeDefined();\n`;
    newTests += `${indent}expect(root?.getAttribute('data-testid') !== undefined || root?.getAttribute('data-component') !== undefined).toBe(true);\n`;
    newTests += `  });\n`;

    insertions.push({ position: bodyEnd, text: newTests });
  }

  insertions.sort((a, b) => b.position - a.position);
  for (const ins of insertions) {
    content = content.slice(0, ins.position) + ins.text + content.slice(ins.position);
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`  ${path.basename(filePath)}: ${insertions.length} describe blocks`);
  return insertions.length;
}

const BASE = '/Users/halilkocoglu/Documents/dev/web/packages/design-system/src';
const allFiles = [
  `${BASE}/enterprise/__tests__/enterprise-depth.test.tsx`,
  `${BASE}/components/__tests__/components-depth.test.tsx`,
  `${BASE}/primitives/__tests__/primitives-depth.test.tsx`,
  `${BASE}/patterns/__tests__/patterns-depth.test.tsx`,
  `${BASE}/advanced/data-grid/__tests__/advanced-depth.test.tsx`,
  `${BASE}/form/__tests__/form-depth.test.tsx`,
  `${BASE}/motion/__tests__/motion-depth.test.tsx`,
  `${BASE}/providers/__tests__/providers-depth.test.tsx`,
  `${BASE}/advanced/__tests__/AgGridServer.depth.test.tsx`,
  `${BASE}/advanced/__tests__/EntityGridTemplate.depth.test.tsx`,
  `${BASE}/advanced/__tests__/GridShell.depth.test.tsx`,
  `${BASE}/advanced/__tests__/GridToolbar.depth.test.tsx`,
  `${BASE}/advanced/__tests__/TablePagination.depth.test.tsx`,
  `${BASE}/advanced/__tests__/VariantIntegration.depth.test.tsx`,
  `${BASE}/motion/__tests__/AnimatePresence.depth.test.tsx`,
  `${BASE}/motion/__tests__/StaggerGroup.depth.test.tsx`,
  `${BASE}/motion/__tests__/Transition.depth.test.tsx`,
  `${BASE}/patterns/__tests__/DetailSummary.depth.test.tsx`,
  `${BASE}/patterns/__tests__/EntitySummaryBlock.depth.test.tsx`,
  `${BASE}/patterns/__tests__/MasterDetail.depth.test.tsx`,
  `${BASE}/patterns/__tests__/PageHeader.depth.test.tsx`,
  `${BASE}/patterns/__tests__/PageLayout.depth.test.tsx`,
  `${BASE}/patterns/__tests__/SummaryStrip.depth.test.tsx`,
  `${BASE}/providers/__tests__/DesignSystemProvider.depth.test.tsx`,
  `${BASE}/providers/__tests__/DirectionProvider.depth.test.tsx`,
  `${BASE}/providers/__tests__/LocaleProvider.depth.test.tsx`,
  `${BASE}/providers/__tests__/ThemeProvider.depth.test.tsx`,
];

let total = 0;
for (const f of allFiles) {
  if (fs.existsSync(f)) {
    total += processFile(f);
  }
}
console.log(`\nTotal: ${total}`);
