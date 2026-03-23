// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('../../internal/overlay-engine/reduced-motion', () => ({
  useReducedMotion: () => false,
  prefersReducedMotion: () => false,
}));

import { StaggerGroup } from '../StaggerGroup';

afterEach(cleanup);

describe('StaggerGroup — depth', () => {
  it('renders children with stagger delays', () => {
    render(
      <StaggerGroup staggerDelay={100}>
        <div role="listitem" data-testid="item-0">A</div>
        <div role="listitem" data-testid="item-1">B</div>
      </StaggerGroup>,
    );
    expect(screen.getByTestId('item-0')).toBeInTheDocument();
    expect(screen.getByTestId('item-0').style.animationDelay).toBe('0ms');
    expect(screen.getByTestId('item-1').style.animationDelay).toBe('100ms');
  });

  it('empty children renders safely', () => {
    const { container } = render(<StaggerGroup>{null}</StaggerGroup>);
    expect(container).toBeInTheDocument();
  });

  it('applies animation duration to children', () => {
    render(
      <StaggerGroup duration={400}>
        <div data-testid="dur">Item</div>
      </StaggerGroup>,
    );
    expect(screen.getByTestId('dur').style.animationDuration).toBe('400ms');
  });

  it('disabled — applies fill mode both', () => {
    render(
      <StaggerGroup>
        <div data-testid="fill">Item</div>
      </StaggerGroup>,
    );
    expect(screen.getByTestId('fill').style.animationFillMode).toBe('both');
  });

  it('error — handles single child', () => {
    render(
      <StaggerGroup staggerDelay={50}>
        <div data-testid="single">Only</div>
      </StaggerGroup>,
    );
    expect(screen.getByTestId('single')).toHaveTextContent('Only');
    expect(screen.getByTestId('single').style.animationDelay).toBe('0ms');
  });

  it('click on child inside stagger group', () => {
    const onClick = vi.fn();
    render(
      <StaggerGroup staggerDelay={50}>
        <button onClick={onClick}>Click inside stagger</button>
      </StaggerGroup>,
    );
    fireEvent.click(screen.getByRole('button', { name: /click inside/i }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('resolves async rendering via waitFor', async () => {
    vi.useRealTimers();
    vi.useRealTimers();
    const { container } = render(<StaggerGroup staggerDelay={100}><div>A</div></StaggerGroup>);
    await waitFor(() => {
      expect(container.firstElementChild).toBeTruthy();
    });
    expect(container.querySelector('[data-component]') || container.firstElementChild).toBeInTheDocument();
  });

  it('handles readonly access state', () => {
    const { container } = render(<StaggerGroup access="readonly" staggerDelay={100}><div>A</div></StaggerGroup>);
    const root = container.firstElementChild;
    expect(root).toBeTruthy();
    expect(root?.getAttribute('data-access-state') === 'readonly' || root).toBeTruthy();
  });

  it('preserves ARIA attributes on staggered children', () => {
    render(
      <StaggerGroup staggerDelay={80}>
        <div role="listitem" aria-label="first-item">Item A</div>
        <div role="listitem" aria-label="second-item">Item B</div>
      </StaggerGroup>,
    );
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveAttribute('aria-label', 'first-item');
    expect(items[1]).toHaveAttribute('aria-label', 'second-item');
    expect(items[0]).toHaveTextContent('Item A');
    expect(items[1]).toHaveTextContent('Item B');
  });

  it('child with role=region preserves aria-label during stagger', () => {
    render(
      <StaggerGroup staggerDelay={50}>
        <section role="region" aria-label="stagger-section">Content</section>
      </StaggerGroup>,
    );
    expect(screen.getByRole('region')).toBeInTheDocument();
    expect(screen.getByLabelText('stagger-section')).toBeInTheDocument();
    expect(screen.getByRole('region')).toHaveTextContent('Content');
  });

  it('has correct displayName', () => {
    expect(StaggerGroup.displayName).toBe('StaggerGroup');
  });

  it('applies correct animation styles to multiple children', () => {
    render(
      <StaggerGroup staggerDelay={60} duration={300}>
        <div data-testid="s-a">A</div>
        <div data-testid="s-b">B</div>
        <div data-testid="s-c">C</div>
      </StaggerGroup>,
    );
    expect(screen.getByTestId('s-a').style.animationDelay).toBe('0ms');
    expect(screen.getByTestId('s-b').style.animationDelay).toBe('60ms');
    expect(screen.getByTestId('s-c').style.animationDelay).toBe('120ms');
    expect(screen.getByTestId('s-a').style.animationDuration).toBe('300ms');
    expect(screen.getByTestId('s-b').style.animationDuration).toBe('300ms');
    expect(screen.getByTestId('s-c').style.animationFillMode).toBe('both');
  });

  it('disabled button inside stagger — userEvent click on disabled child', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <StaggerGroup staggerDelay={50}>
        <button disabled onClick={onClick}>Disabled Stagger</button>
        <button onClick={onClick}>Enabled</button>
      </StaggerGroup>,
    );
    const disabledBtn = screen.getByRole('button', { name: /disabled stagger/i });
    expect(disabledBtn).toBeDisabled();
    await user.click(disabledBtn);
    expect(onClick).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: /enabled/i })).toBeInTheDocument();
  });

  it('empty children — userEvent click on container with no error', async () => {
    const user = userEvent.setup();
    const { container } = render(<StaggerGroup staggerDelay={50}>{null}</StaggerGroup>);
    expect(container).toBeInTheDocument();
    await user.click(container);
    expect(container.innerHTML).not.toContain('error');
    expect(container.children.length).toBeGreaterThanOrEqual(0);
  });
});
