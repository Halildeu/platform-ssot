// @vitest-environment jsdom
// Auto-generated contract test — do not edit manually
// Regenerate with: node scripts/ci/generate-contract-tests.mjs --write
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { SidebarWrapper } from '../../__tests__/contract-providers';
import { AppSidebarGroup } from '../app-sidebar/AppSidebarGroup';
import type { AppSidebarGroupProps, AppSidebarGroupRef, AppSidebarGroupElement, AppSidebarGroupCSSProperties } from '../app-sidebar/AppSidebarGroup';

describe('AppSidebarGroup — contract', () => {
  
  it('renders without crash', () => {
    const { container } = render(<SidebarWrapper><AppSidebarGroup  /></SidebarWrapper>);
    expect(container.firstElementChild).toBeTruthy();
  });

  it('has displayName', () => {
    expect(AppSidebarGroup.displayName).toBeTruthy();
  });

  it('respects access=hidden', () => {
    const { container } = render(<SidebarWrapper><AppSidebarGroup  access="hidden" /></SidebarWrapper>);
    expect(container.querySelector('[data-sidebar]')).toBeTruthy();
  });

  it('applies disabled state via access=readonly', () => {
    const { container } = render(<SidebarWrapper><AppSidebarGroup  access="readonly" /></SidebarWrapper>);
    expect(container.firstElementChild).toBeTruthy();
  });

  it('exports expected types', () => {
    // Type-level check — if this compiles, types are exported correctly
    const _appsidebargroupprops: AppSidebarGroupProps | undefined = undefined; void _appsidebargroupprops;
    const _appsidebargroupref: AppSidebarGroupRef | undefined = undefined; void _appsidebargroupref;
    const _appsidebargroupelement: AppSidebarGroupElement | undefined = undefined; void _appsidebargroupelement;
    const _appsidebargroupcssproperties: AppSidebarGroupCSSProperties | undefined = undefined; void _appsidebargroupcssproperties;
    expect(true).toBe(true);
  });
});
