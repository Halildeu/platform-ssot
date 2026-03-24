// @vitest-environment jsdom
// Auto-generated contract test — do not edit manually
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { AppSidebarFooter } from '../AppSidebarFooter';

describe('AppSidebarFooter — contract', () => {
  it('renders without crash', () => {
    const { container } = render(<AppSidebarFooter><span>footer</span></AppSidebarFooter>);
    expect(container.firstElementChild).toBeTruthy();
  });

  it('has displayName', () => {
    expect(AppSidebarFooter.displayName).toBeTruthy();
  });

  it('forwards className', () => {
    const { container } = render(<AppSidebarFooter className="custom"><span>footer</span></AppSidebarFooter>);
    expect(container.innerHTML).toContain('custom');
  });

  it('renders with only required props', () => {
    const { container } = render(<AppSidebarFooter><span>footer</span></AppSidebarFooter>);
    expect(container.firstElementChild).toBeTruthy();
  });
});
