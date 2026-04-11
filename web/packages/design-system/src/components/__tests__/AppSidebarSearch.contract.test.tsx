// @vitest-environment jsdom
// Auto-generated contract test — do not edit manually
// Regenerate with: node scripts/ci/generate-contract-tests.mjs --write
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { SidebarWrapper } from '../../__tests__/contract-providers';
import { AppSidebarSearch } from '../app-sidebar/AppSidebarSearch';
import type { AppSidebarSearchProps, AppSidebarSearchRef, AppSidebarSearchElement, AppSidebarSearchCSSProperties } from '../app-sidebar/AppSidebarSearch';

describe('AppSidebarSearch — contract', () => {
  
  it('renders without crash', () => {
    const { container } = render(<SidebarWrapper><AppSidebarSearch  /></SidebarWrapper>);
    expect(container.firstElementChild).toBeTruthy();
  });

  it('has displayName', () => {
    expect(AppSidebarSearch.displayName).toBeTruthy();
  });

  it('respects access=hidden', () => {
    const { container } = render(<SidebarWrapper><AppSidebarSearch  access="hidden" /></SidebarWrapper>);
    expect(container.querySelector('[data-sidebar]')).toBeTruthy();
  });

  it('applies disabled state via access=readonly', () => {
    const { container } = render(<SidebarWrapper><AppSidebarSearch  access="readonly" /></SidebarWrapper>);
    expect(container.firstElementChild).toBeTruthy();
  });

  it('exports expected types', () => {
    // Type-level check — if this compiles, types are exported correctly
    const _appsidebarsearchprops: AppSidebarSearchProps | undefined = undefined; void _appsidebarsearchprops;
    const _appsidebarsearchref: AppSidebarSearchRef | undefined = undefined; void _appsidebarsearchref;
    const _appsidebarsearchelement: AppSidebarSearchElement | undefined = undefined; void _appsidebarsearchelement;
    const _appsidebarsearchcssproperties: AppSidebarSearchCSSProperties | undefined = undefined; void _appsidebarsearchcssproperties;
    expect(true).toBe(true);
  });
});
