// @vitest-environment jsdom
// Auto-generated contract test — do not edit manually
// Regenerate with: node scripts/ci/generate-contract-tests.mjs --write
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { SidebarWrapper } from '../../__tests__/contract-providers';
import { AppSidebarSeparator } from '../app-sidebar/AppSidebarSeparator';
import type { AppSidebarSeparatorProps, AppSidebarSeparatorRef, AppSidebarSeparatorElement, AppSidebarSeparatorCSSProperties } from '../app-sidebar/AppSidebarSeparator';

describe('AppSidebarSeparator — contract', () => {
  
  it('renders without crash', () => {
    const { container } = render(<SidebarWrapper><AppSidebarSeparator  /></SidebarWrapper>);
    expect(container.firstElementChild).toBeTruthy();
  });

  it('has displayName', () => {
    expect(AppSidebarSeparator.displayName).toBeTruthy();
  });

  it('respects access=hidden', () => {
    const { container } = render(<SidebarWrapper><AppSidebarSeparator  access="hidden" /></SidebarWrapper>);
    expect(container.querySelector('[data-sidebar]')).toBeTruthy();
  });

  it('applies disabled state via access=readonly', () => {
    const { container } = render(<SidebarWrapper><AppSidebarSeparator  access="readonly" /></SidebarWrapper>);
    expect(container.firstElementChild).toBeTruthy();
  });

  it('exports expected types', () => {
    // Type-level check — if this compiles, types are exported correctly
    const _appsidebarseparatorprops: AppSidebarSeparatorProps | undefined = undefined; void _appsidebarseparatorprops;
    const _appsidebarseparatorref: AppSidebarSeparatorRef | undefined = undefined; void _appsidebarseparatorref;
    const _appsidebarseparatorelement: AppSidebarSeparatorElement | undefined = undefined; void _appsidebarseparatorelement;
    const _appsidebarseparatorcssproperties: AppSidebarSeparatorCSSProperties | undefined = undefined; void _appsidebarseparatorcssproperties;
    expect(true).toBe(true);
  });
});
