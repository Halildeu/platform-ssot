// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ColorPicker } from '../ColorPicker';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => cleanup());

describe('ColorPicker contract', () => {
  /* ---- Identity ---- */
  it('has displayName', () => {
    expect(ColorPicker.displayName).toBe('ColorPicker');
  });

  it('renders with required props', () => {
    const { container } = render(<ColorPicker />);
    expect(container.querySelector('[data-testid="color-picker-root"]')).toBeInTheDocument();
  });

  it('forwards ref to root div', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<ColorPicker ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  /* ---- Label ---- */
  it('renders label', () => {
    render(<ColorPicker label="Brand color" />);
    expect(screen.getByText('Brand color')).toBeInTheDocument();
  });

  /* ---- Description ---- */
  it('renders description', () => {
    render(<ColorPicker description="Choose a brand color" />);
    expect(screen.getByText('Choose a brand color')).toBeInTheDocument();
  });

  /* ---- Default value ---- */
  it('uses defaultValue', () => {
    render(<ColorPicker defaultValue="#ff0000" />);
    const swatch = screen.getByTestId('color-picker-swatch');
    expect(swatch).toHaveStyle({ backgroundColor: '#ff0000' });
  });

  /* ---- Controlled value ---- */
  it('respects controlled value', () => {
    render(<ColorPicker value="#00ff00" />);
    const swatch = screen.getByTestId('color-picker-swatch');
    expect(swatch).toHaveStyle({ backgroundColor: '#00ff00' });
  });

  /* ---- onValueChange callback ---- */
  it('opens popover on swatch click and shows input', async () => {
    const user = userEvent.setup();
    render(<ColorPicker showInput />);
    await user.click(screen.getByTestId('color-picker-swatch'));
    expect(screen.getByTestId('color-picker-popover')).toBeInTheDocument();
    expect(screen.getByTestId('color-picker-input')).toBeInTheDocument();
  });

  /* ---- className merge ---- */
  it('merges custom className', () => {
    const { container } = render(<ColorPicker className="my-picker" />);
    expect(container.querySelector('.my-picker')).toBeInTheDocument();
  });

  /* ---- Sizes ---- */
  it.each(['sm', 'md', 'lg'] as const)('renders size=%s', (size) => {
    render(<ColorPicker size={size} />);
    expect(screen.getByTestId('color-picker-root')).toBeInTheDocument();
  });

  /* ---- Presets ---- */
  it('renders preset palettes when provided', async () => {
    const user = userEvent.setup();
    const presets = [{ label: 'Basic', colors: ['#ff0000', '#00ff00'] }];
    render(<ColorPicker presets={presets} />);
    await user.click(screen.getByTestId('color-picker-swatch'));
    expect(screen.getByTestId('color-picker-presets')).toBeInTheDocument();
    expect(screen.getByText('Basic')).toBeInTheDocument();
  });

  /* ---- Access control ---- */
  it('access=hidden returns null', () => {
    const { container } = render(<ColorPicker access="hidden" />);
    expect(container.innerHTML).toBe('');
  });

  it('access=disabled renders disabled swatch', () => {
    render(<ColorPicker access="disabled" />);
    expect(screen.getByTestId('color-picker-swatch')).toHaveAttribute('aria-disabled', 'true');
  });
});

describe('ColorPicker — accessibility', () => {
  it('has no axe-core a11y violations', async () => {
    const { container } = render(<ColorPicker label="Color" />);
    await expectNoA11yViolations(container);
  });
});
