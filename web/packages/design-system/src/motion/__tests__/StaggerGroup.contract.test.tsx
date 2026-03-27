// @vitest-environment jsdom
// Auto-generated contract test — do not edit manually
// Regenerate with: node scripts/ci/generate-contract-tests.mjs --write
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { StaggerGroup } from '../StaggerGroup';
import type { StaggerGroupProps } from '../StaggerGroup';

describe('StaggerGroup — contract', () => {

  it('renders without crash', () => {
    const { container } = render(<StaggerGroup><div>test</div></StaggerGroup>);
    expect(container.firstElementChild).toBeTruthy();
  });

  it('has displayName', () => {
    expect(StaggerGroup.displayName).toBeTruthy();
  });

  it('exports expected types', () => {
    // Type-level check — if this compiles, types are exported correctly
    const _staggergroupprops: StaggerGroupProps | undefined = undefined; void _staggergroupprops;
    expect(true).toBe(true);
  });
});
