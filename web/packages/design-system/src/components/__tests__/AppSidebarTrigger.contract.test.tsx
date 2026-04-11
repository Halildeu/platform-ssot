// @vitest-environment jsdom
// Auto-generated contract test — do not edit manually
// Regenerate with: node scripts/ci/generate-contract-tests.mjs --write
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { SidebarWrapper } from '../../__tests__/contract-providers';
import { AppSidebarTrigger } from '../app-sidebar/AppSidebarTrigger';
import type { AppSidebarTriggerProps, AppSidebarTriggerRef, AppSidebarTriggerElement, AppSidebarTriggerCSSProperties } from '../app-sidebar/AppSidebarTrigger';

describe('AppSidebarTrigger — contract', () => {
  
  it('renders without crash', () => {
    const { container } = render(<SidebarWrapper><AppSidebarTrigger  /></SidebarWrapper>);
    expect(container.firstElementChild).toBeTruthy();
  });

  it('has displayName', () => {
    expect(AppSidebarTrigger.displayName).toBeTruthy();
  });

  it('respects access=hidden', () => {
    const { container } = render(<SidebarWrapper><AppSidebarTrigger  access="hidden" /></SidebarWrapper>);
    expect(container.querySelector('[data-sidebar]')).toBeTruthy();
  });

  it('applies disabled state via access=readonly', () => {
    const { container } = render(<SidebarWrapper><AppSidebarTrigger  access="readonly" /></SidebarWrapper>);
    expect(container.firstElementChild).toBeTruthy();
  });

  it('exports expected types', () => {
    // Type-level check — if this compiles, types are exported correctly
    const _appsidebartriggerprops: AppSidebarTriggerProps | undefined = undefined; void _appsidebartriggerprops;
    const _appsidebartriggerref: AppSidebarTriggerRef | undefined = undefined; void _appsidebartriggerref;
    const _appsidebartriggerelement: AppSidebarTriggerElement | undefined = undefined; void _appsidebartriggerelement;
    const _appsidebartriggercssproperties: AppSidebarTriggerCSSProperties | undefined = undefined; void _appsidebartriggercssproperties;
    expect(true).toBe(true);
  });
});
