// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Cascader, type CascaderOption } from '../Cascader';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => cleanup());

const makeOptions = (): CascaderOption[] => [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [
      {
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [
          { value: 'xihu', label: 'West Lake' },
        ],
      },
    ],
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [
      { value: 'nanjing', label: 'Nanjing' },
    ],
  },
];

describe('Cascader contract', () => {
  /* ---- Identity ---- */
  it('has displayName', () => {
    expect(Cascader.displayName).toBe('Cascader');
  });

  it('renders with required props', () => {
    render(<Cascader options={makeOptions()} />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('forwards ref to root div', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Cascader ref={ref} options={makeOptions()} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  /* ---- Label ---- */
  it('renders label', () => {
    render(<Cascader options={makeOptions()} label="Location" />);
    expect(screen.getByText('Location')).toBeInTheDocument();
  });

  /* ---- Description ---- */
  it('renders description', () => {
    render(<Cascader options={makeOptions()} description="Select a location" />);
    expect(screen.getByText('Select a location')).toBeInTheDocument();
  });

  /* ---- Placeholder ---- */
  it('renders placeholder', () => {
    render(<Cascader options={makeOptions()} placeholder="Choose..." />);
    expect(screen.getByText('Choose...')).toBeInTheDocument();
  });

  /* ---- Error state ---- */
  it('renders error message when error is true', () => {
    render(<Cascader options={makeOptions()} error />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  /* ---- Opens dropdown on click ---- */
  it('opens dropdown on trigger click', async () => {
    const user = userEvent.setup();
    render(<Cascader options={makeOptions()} />);
    await user.click(screen.getByRole('combobox'));
    expect(screen.getByTestId('cascader-dropdown')).toBeInTheDocument();
    expect(screen.getByText('Zhejiang')).toBeInTheDocument();
    expect(screen.getByText('Jiangsu')).toBeInTheDocument();
  });

  /* ---- Controlled value ---- */
  it('displays selected value path', () => {
    render(<Cascader options={makeOptions()} value={['zhejiang', 'hangzhou', 'xihu']} />);
    expect(screen.getByText('Zhejiang / Hangzhou / West Lake')).toBeInTheDocument();
  });

  /* ---- className merge ---- */
  it('merges custom className', () => {
    const { container } = render(<Cascader options={makeOptions()} className="my-cascader" />);
    expect(container.querySelector('.my-cascader')).toBeInTheDocument();
  });

  /* ---- Access control ---- */
  it('access=hidden returns null', () => {
    const { container } = render(<Cascader options={makeOptions()} access="hidden" />);
    expect(container.innerHTML).toBe('');
  });

  it('access=disabled renders disabled trigger', () => {
    render(<Cascader options={makeOptions()} access="disabled" />);
    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  /* ---- Sizes ---- */
  it.each(['sm', 'md', 'lg'] as const)('renders size=%s', (size) => {
    render(<Cascader options={makeOptions()} size={size} />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });
});

describe('Cascader — accessibility', () => {
  it('has no axe-core a11y violations', async () => {
    const { container } = render(<Cascader options={makeOptions()} label="Location" />);
    await expectNoA11yViolations(container);
  });
});
