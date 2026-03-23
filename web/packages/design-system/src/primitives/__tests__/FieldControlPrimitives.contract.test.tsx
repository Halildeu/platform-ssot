// @vitest-environment jsdom
// Auto-generated contract test — do not edit manually
// Regenerate with: node scripts/ci/generate-contract-tests.mjs --write
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import {
  FieldControlShell,
  getFieldTone,
  getFieldFrameClass,
  getFieldInputClass,
  getFieldSlotClass,
  buildDescribedBy,
} from '../_shared/FieldControlPrimitives';
import type { FieldSize, FieldTone, FieldDensity } from '../_shared/FieldControlPrimitives';

describe('FieldControlPrimitives — contract', () => {

  it('renders FieldControlShell without crash', () => {
    const { container } = render(
      <FieldControlShell inputId="test-input">
        <input id="test-input" />
      </FieldControlShell>,
    );
    expect(container.firstElementChild).toBeTruthy();
  });

  it('FieldControlShell has displayName', () => {
    expect(FieldControlShell.displayName).toBeTruthy();
  });

  it('getFieldTone returns correct tone', () => {
    expect(getFieldTone({})).toBe('default');
    expect(getFieldTone({ invalid: true })).toBe('invalid');
    expect(getFieldTone({ disabled: true })).toBe('disabled');
    expect(getFieldTone({ readonly: true })).toBe('readonly');
  });

  it('getFieldFrameClass returns a string', () => {
    expect(typeof getFieldFrameClass('md', 'default', true)).toBe('string');
  });

  it('getFieldInputClass returns a string', () => {
    expect(typeof getFieldInputClass('md')).toBe('string');
  });

  it('getFieldSlotClass returns a string', () => {
    expect(typeof getFieldSlotClass('md')).toBe('string');
  });

  it('buildDescribedBy filters empty values', () => {
    expect(buildDescribedBy(undefined, 'id-1', undefined)).toBe('id-1');
    expect(buildDescribedBy(undefined)).toBeUndefined();
  });

  it('exports expected types', () => {
    // Type-level check — if this compiles, types are exported correctly
    const _fieldsize: FieldSize | undefined = undefined; void _fieldsize;
    const _fieldtone: FieldTone | undefined = undefined; void _fieldtone;
    const _fielddensity: FieldDensity | undefined = undefined; void _fielddensity;
    expect(true).toBe(true);
  });
});
