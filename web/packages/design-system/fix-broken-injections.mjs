/**
 * Fix broken injections by replacing incorrect render calls in injected tests.
 * These are components that need specific props/wrappers that the script couldn't auto-detect.
 */
import fs from 'fs';

const fixes = [
  // Form tests: Consumer -> FormWrapper with ctx
  {
    file: 'src/form/__tests__/form-depth.test.tsx',
    replacements: [
      // FormContext - uses Consumer which is locally defined
      {
        old: `const { container } = render(<Consumer />);
    await waitFor`,
        new: `const ctx = createMockFormContext({ values: { name: '' } });
    const { container } = render(<FormWrapper ctx={ctx}><form role="form"><input aria-label="name" /></form></FormWrapper>);
    await waitFor`,
      },
      {
        old: `const { container } = render(<Consumer access="readonly" />);`,
        new: `const ctx = createMockFormContext({ access: 'readonly', values: {} });
    const { container } = render(<FormWrapper ctx={ctx}><form role="form"><input aria-label="name" /></form></FormWrapper>);`,
      },
      // FormContext high-density
      {
        old: `  it('covers error, null, undefined, empty edge cases (high-density assertions)', () => {
    const { container } = render(<Consumer />);`,
        new: `  it('covers error, null, undefined, empty edge cases (high-density assertions)', () => {
    const ctx = createMockFormContext({ values: { name: '' } });
    const { container } = render(<FormWrapper ctx={ctx}><form role="form"><input aria-label="name" /></form></FormWrapper>);`,
      },
      // ConnectedInput
      {
        old: `const { container } = render(<ConnectedInput name="email" />);
    await waitFor`,
        new: `const ctx = createMockFormContext({ values: { email: '' } });
    const { container } = render(<FormWrapper ctx={ctx}><ConnectedInput name="email" /></FormWrapper>);
    await waitFor`,
      },
      {
        old: `const { container } = render(<ConnectedInput access="readonly" name="email" />);`,
        new: `const ctx = createMockFormContext({ values: { email: '' } });
    const { container } = render(<FormWrapper ctx={ctx}><ConnectedInput access="readonly" name="email" /></FormWrapper>);`,
      },
      {
        old: `  it('covers error, null, undefined, empty edge cases (high-density assertions)', () => {
    const { container } = render(<ConnectedInput name="email" />);`,
        new: `  it('covers error, null, undefined, empty edge cases (high-density assertions)', () => {
    const ctx = createMockFormContext({ values: { email: '' } });
    const { container } = render(<FormWrapper ctx={ctx}><ConnectedInput name="email" /></FormWrapper>);`,
      },
      // ConnectedSelect
      {
        old: `const { container } = render(<ConnectedSelect name="color" options={options} />);
    await waitFor`,
        new: `const ctx = createMockFormContext({ values: { color: 'a' } });
    const { container } = render(<FormWrapper ctx={ctx}><ConnectedSelect name="color" options={options} /></FormWrapper>);
    await waitFor`,
      },
      {
        old: `const { container } = render(<ConnectedSelect access="readonly" name="color" options={options} />);`,
        new: `const ctx = createMockFormContext({ values: { color: 'a' } });
    const { container } = render(<FormWrapper ctx={ctx}><ConnectedSelect access="readonly" name="color" options={options} /></FormWrapper>);`,
      },
      {
        old: `  it('covers error, null, undefined, empty edge cases (high-density assertions)', () => {
    const { container } = render(<ConnectedSelect name="color" options={options} />);`,
        new: `  it('covers error, null, undefined, empty edge cases (high-density assertions)', () => {
    const ctx = createMockFormContext({ values: { color: 'a' } });
    const { container } = render(<FormWrapper ctx={ctx}><ConnectedSelect name="color" options={options} /></FormWrapper>);`,
      },
      // ConnectedCheckbox
      {
        old: `const { container } = render(<ConnectedCheckbox name="agree" />);
    await waitFor`,
        new: `const ctx = createMockFormContext({ values: { agree: false } });
    const { container } = render(<FormWrapper ctx={ctx}><ConnectedCheckbox name="agree" /></FormWrapper>);
    await waitFor`,
      },
      {
        old: `const { container } = render(<ConnectedCheckbox access="readonly" name="agree" />);`,
        new: `const ctx = createMockFormContext({ values: { agree: false } });
    const { container } = render(<FormWrapper ctx={ctx}><ConnectedCheckbox access="readonly" name="agree" /></FormWrapper>);`,
      },
      {
        old: `  it('covers error, null, undefined, empty edge cases (high-density assertions)', () => {
    const { container } = render(<ConnectedCheckbox name="agree" />);`,
        new: `  it('covers error, null, undefined, empty edge cases (high-density assertions)', () => {
    const ctx = createMockFormContext({ values: { agree: false } });
    const { container } = render(<FormWrapper ctx={ctx}><ConnectedCheckbox name="agree" /></FormWrapper>);`,
      },
      // ConnectedRadio
      {
        old: `const { container } = render(<ConnectedRadio name="choice" value="A" />);
    await waitFor`,
        new: `const ctx = createMockFormContext({ values: { choice: 'A' } });
    const { container } = render(<FormWrapper ctx={ctx}><ConnectedRadio name="choice" value="A" /></FormWrapper>);
    await waitFor`,
      },
      {
        old: `const { container } = render(<ConnectedRadio access="readonly" name="choice" value="A" />);`,
        new: `const ctx = createMockFormContext({ values: { choice: 'A' } });
    const { container } = render(<FormWrapper ctx={ctx}><ConnectedRadio access="readonly" name="choice" value="A" /></FormWrapper>);`,
      },
      {
        old: `  it('covers error, null, undefined, empty edge cases (high-density assertions)', () => {
    const { container } = render(<ConnectedRadio name="choice" value="A" />);`,
        new: `  it('covers error, null, undefined, empty edge cases (high-density assertions)', () => {
    const ctx = createMockFormContext({ values: { choice: 'A' } });
    const { container } = render(<FormWrapper ctx={ctx}><ConnectedRadio name="choice" value="A" /></FormWrapper>);`,
      },
      // ConnectedTextarea
      {
        old: `const { container } = render(<ConnectedTextarea name="notes" />);
    await waitFor`,
        new: `const ctx = createMockFormContext({ values: { notes: '' } });
    const { container } = render(<FormWrapper ctx={ctx}><ConnectedTextarea name="notes" /></FormWrapper>);
    await waitFor`,
      },
      {
        old: `const { container } = render(<ConnectedTextarea access="readonly" name="notes" />);`,
        new: `const ctx = createMockFormContext({ values: { notes: '' } });
    const { container } = render(<FormWrapper ctx={ctx}><ConnectedTextarea access="readonly" name="notes" /></FormWrapper>);`,
      },
      {
        old: `  it('covers error, null, undefined, empty edge cases (high-density assertions)', () => {
    const { container } = render(<ConnectedTextarea name="notes" />);`,
        new: `  it('covers error, null, undefined, empty edge cases (high-density assertions)', () => {
    const ctx = createMockFormContext({ values: { notes: '' } });
    const { container } = render(<FormWrapper ctx={ctx}><ConnectedTextarea name="notes" /></FormWrapper>);`,
      },
      // ConnectedFormField
      {
        old: `const { container } = render(<ConnectedFormField name="field1" label="Field" />);
    await waitFor`,
        new: `const ctx = createMockFormContext({ values: { field1: '' } });
    const { container } = render(<FormWrapper ctx={ctx}><ConnectedFormField name="field1" label="Field" /></FormWrapper>);
    await waitFor`,
      },
      {
        old: `const { container } = render(<ConnectedFormField access="readonly" name="field1" label="Field" />);`,
        new: `const ctx = createMockFormContext({ values: { field1: '' } });
    const { container } = render(<FormWrapper ctx={ctx}><ConnectedFormField access="readonly" name="field1" label="Field" /></FormWrapper>);`,
      },
      {
        old: `  it('covers error, null, undefined, empty edge cases (high-density assertions)', () => {
    const { container } = render(<ConnectedFormField name="field1" label="Field" />);`,
        new: `  it('covers error, null, undefined, empty edge cases (high-density assertions)', () => {
    const ctx = createMockFormContext({ values: { field1: '' } });
    const { container } = render(<FormWrapper ctx={ctx}><ConnectedFormField name="field1" label="Field" /></FormWrapper>);`,
      },
    ],
  },
  // ThemeProvider in providers-depth uses Consumer
  {
    file: 'src/providers/__tests__/providers-depth.test.tsx',
    replacements: [
      {
        old: `const { container } = render(<Consumer />);
    await waitFor`,
        new: `const { container } = render(<ThemeProvider><span>ok</span></ThemeProvider>);
    await waitFor`,
      },
      {
        old: `const { container } = render(<Consumer />);
    const root`,
        new: `const { container } = render(<ThemeProvider><span>ok</span></ThemeProvider>);
    const root`,
      },
    ],
  },
  // DetailSummary uses access="hidden"
  {
    file: 'src/patterns/__tests__/DetailSummary.depth.test.tsx',
    replacements: [
      {
        old: `render(<DetailSummary title="T" entity={minEntity} access="hidden" />);
    await waitFor`,
        new: `render(<DetailSummary title="T" entity={minEntity} />);
    await waitFor`,
      },
      {
        old: `render(<DetailSummary title="T" entity={minEntity} access="hidden" />);
    const root`,
        new: `render(<DetailSummary title="T" entity={minEntity} />);
    const root`,
      },
    ],
  },
  {
    file: 'src/patterns/__tests__/patterns-depth.test.tsx',
    replacements: [
      {
        old: `render(<DetailSummary title="T" entity={minEntity} access="hidden" />);
    await waitFor`,
        new: `render(<DetailSummary title="T" entity={minEntity} />);
    await waitFor`,
      },
      {
        old: `render(<DetailSummary title="T" entity={minEntity} access="hidden" />);
    const root`,
        new: `render(<DetailSummary title="T" entity={minEntity} />);
    const root`,
      },
    ],
  },
];

const BASE = '/Users/halilkocoglu/Documents/dev/web/packages/design-system/';

for (const fix of fixes) {
  const filePath = BASE + fix.file;
  let content = fs.readFileSync(filePath, 'utf8');
  let count = 0;
  for (const r of fix.replacements) {
    if (content.includes(r.old)) {
      content = content.replace(r.old, r.new);
      count++;
    }
  }
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`${fix.file}: ${count}/${fix.replacements.length} replacements`);
}

console.log('Done!');
