// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';
import { expectNoA11yViolations } from '../../__tests__/a11y-utils';

// Mock useReducedMotion to return false so animation wrapper renders
vi.mock('../../internal/overlay-engine/reduced-motion', () => ({
  useReducedMotion: () => false,
  prefersReducedMotion: () => false,
}));

import { StaggerGroup } from '../StaggerGroup';

describe('StaggerGroup', () => {
  it('renders children', () => {
    const { getByText } = render(
      <StaggerGroup>
        <div>Child A</div>
        <div>Child B</div>
      </StaggerGroup>,
    );
    expect(getByText('Child A')).toBeTruthy();
    expect(getByText('Child B')).toBeTruthy();
  });

  it('applies stagger delay to children', () => {
    const { container } = render(
      <StaggerGroup staggerDelay={100} duration={300}>
        <div>First</div>
        <div>Second</div>
      </StaggerGroup>,
    );
    const children = container.querySelectorAll('div');
    expect((children[0] as HTMLElement).style.animationDelay).toBe('0ms');
    expect((children[1] as HTMLElement).style.animationDelay).toBe('100ms');
  });

  it('has no a11y violations', async () => {
    const { container } = render(
      <StaggerGroup>
        <div>Item 1</div>
        <div>Item 2</div>
        <div>Item 3</div>
      </StaggerGroup>,
    );
    await expectNoA11yViolations(container);
  });
});
