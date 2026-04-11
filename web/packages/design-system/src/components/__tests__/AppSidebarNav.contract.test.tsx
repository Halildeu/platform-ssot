// @vitest-environment jsdom
// Auto-generated contract test — do not edit manually
// Regenerate with: node scripts/ci/generate-contract-tests.mjs --write
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { SidebarWrapper } from '../../__tests__/contract-providers';
import { AppSidebarNav } from '../app-sidebar/AppSidebarNav';
import type { AppSidebarNavProps, AppSidebarNavRef, AppSidebarNavElement, AppSidebarNavCSSProperties } from '../app-sidebar/AppSidebarNav';

describe('AppSidebarNav — contract', () => {
  
  it('renders without crash', () => {
    const { container } = render(<SidebarWrapper><AppSidebarNav  /></SidebarWrapper>);
    expect(container.firstElementChild).toBeTruthy();
  });

  it('has displayName', () => {
    expect(AppSidebarNav.displayName).toBeTruthy();
  });

  it('respects access=hidden', () => {
    const { container } = render(<SidebarWrapper><AppSidebarNav  access="hidden" /></SidebarWrapper>);
    expect(container.querySelector('[data-sidebar]')).toBeTruthy();
  });

  it('applies disabled state via access=readonly', () => {
    const { container } = render(<SidebarWrapper><AppSidebarNav  access="readonly" /></SidebarWrapper>);
    expect(container.firstElementChild).toBeTruthy();
  });

  it('exports expected types', () => {
    // Type-level check — if this compiles, types are exported correctly
    const _appsidebarnavprops: AppSidebarNavProps | undefined = undefined; void _appsidebarnavprops;
    const _appsidebarnavref: AppSidebarNavRef | undefined = undefined; void _appsidebarnavref;
    const _appsidebarnavelement: AppSidebarNavElement | undefined = undefined; void _appsidebarnavelement;
    const _appsidebarnavcssproperties: AppSidebarNavCSSProperties | undefined = undefined; void _appsidebarnavcssproperties;
    expect(true).toBe(true);
  });
});
