// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FloatButton } from '../FloatButton';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => cleanup());

describe('FloatButton contract', () => {
  it('has displayName', () => {
    expect(FloatButton.displayName).toBe('FloatButton');
  });

  it('renders with default props', () => {
    render(<FloatButton />);
    expect(screen.getByTestId('float-button-root')).toBeInTheDocument();
  });

  it('renders trigger button', () => {
    render(<FloatButton />);
    expect(screen.getByTestId('float-button-trigger')).toBeInTheDocument();
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<FloatButton ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('merges custom className', () => {
    const { container } = render(<FloatButton className="custom-fab" />);
    expect(container.querySelector('.custom-fab')).toBeInTheDocument();
  });

  it('renders label text', () => {
    render(<FloatButton label="Add item" />);
    expect(screen.getByText('Add item')).toBeInTheDocument();
  });

  it('fires onClick callback', async () => {
    const handler = vi.fn();
    const user = userEvent.setup();
    render(<FloatButton onClick={handler} />);
    await user.click(screen.getByTestId('float-button-trigger'));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('renders badge count', () => {
    render(<FloatButton badge={5} />);
    expect(screen.getByTestId('float-button-badge-count')).toHaveTextContent('5');
  });

  it('renders badge dot', () => {
    render(<FloatButton badge={true} />);
    expect(screen.getByTestId('float-button-badge-dot')).toBeInTheDocument();
  });

  it('returns null when access is hidden', () => {
    render(<FloatButton access="hidden" />);
    expect(screen.queryByTestId('float-button-root')).not.toBeInTheDocument();
  });
});

describe('FloatButton — accessibility', () => {
  it('has no axe-core a11y violations', async () => {
    const { container } = render(<FloatButton aria-label="Add action" />);
    await expectNoA11yViolations(container);
  });
});
