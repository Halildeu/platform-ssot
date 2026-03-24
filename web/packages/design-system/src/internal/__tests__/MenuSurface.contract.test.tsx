// @vitest-environment jsdom
// Auto-generated contract test
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { MenuSurface } from '../MenuSurface';

const ownerRef = { current: document.createElement('div') };

describe('MenuSurface — contract', () => {
  it('renders without crash', () => {
    const { container } = render(
      <MenuSurface open={true} items={[]} ownerRef={ownerRef} ariaLabel="test menu">
        <div>child</div>
      </MenuSurface>,
    );
    // MenuSurface portals its content to document.body, so the container itself may be empty
    expect(document.querySelector('[role="menu"]')).toBeTruthy();
  });

  it('exports a named component', () => {
    expect(typeof MenuSurface).toBe('function');
  });

  it('renders children (items)', () => {
    const items = [{ key: 'inner', label: 'inner' }];
    render(
      <MenuSurface open={true} items={items} ownerRef={ownerRef} ariaLabel="test menu" />,
    );
    expect(document.querySelector('[role="menuitem"]')).toBeTruthy();
  });
});
