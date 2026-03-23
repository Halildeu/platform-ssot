/**
 * Fix form-depth.test.tsx: add ctx declaration before each render(<FormWrapper ctx={ctx}>)
 * in injected tests that don't already have it.
 */
import fs from 'fs';

const filePath = '/Users/halilkocoglu/Documents/dev/web/packages/design-system/src/form/__tests__/form-depth.test.tsx';
let content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');
const result = [];
let fixed = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const trimmed = line.trim();

  // Check if this line has render(<FormWrapper ctx={ctx}> and the previous non-empty line
  // doesn't have createMockFormContext
  if (trimmed.includes('render(<FormWrapper ctx={ctx}>') || trimmed.includes('render(<FormWrapper access="readonly" ctx={ctx}>')) {
    // Look back to see if ctx is already defined
    let hasCtx = false;
    for (let j = i - 1; j >= Math.max(0, i - 5); j--) {
      if (lines[j].includes('createMockFormContext')) {
        hasCtx = true;
        break;
      }
      // Stop looking back if we hit an it( boundary
      if (lines[j].trim().startsWith("it(")) break;
    }

    if (!hasCtx) {
      // Determine which Connected component this is for
      let ctxValues = "{}";
      // Look ahead to find the component
      for (let j = i; j < Math.min(lines.length, i + 3); j++) {
        if (lines[j].includes('ConnectedInput')) ctxValues = "{ values: { email: '' } }";
        else if (lines[j].includes('ConnectedSelect')) ctxValues = "{ values: { color: 'a' } }";
        else if (lines[j].includes('ConnectedCheckbox')) ctxValues = "{ values: { agree: false } }";
        else if (lines[j].includes('ConnectedRadio')) ctxValues = "{ values: { size: 'lg' } }";
        else if (lines[j].includes('ConnectedTextarea')) ctxValues = "{ values: { bio: '' } }";
        else if (lines[j].includes('ConnectedFormField')) ctxValues = "{ values: { field1: '' } }";
      }

      // Add ctx declaration before this line
      const indent = line.match(/^(\s*)/)[1];
      result.push(`${indent}const ctx = createMockFormContext(${ctxValues});`);
      fixed++;
    }
  }

  result.push(line);
}

fs.writeFileSync(filePath, result.join('\n'), 'utf8');
console.log(`Fixed ${fixed} missing ctx declarations`);
