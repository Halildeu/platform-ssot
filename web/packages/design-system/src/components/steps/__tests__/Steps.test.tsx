// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Steps, type StepItem } from '../Steps';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => {
  cleanup();
});

const defaultItems: StepItem[] = [
  { key: 'a', title: 'First' },
  { key: 'b', title: 'Second' },
  { key: 'c', title: 'Third' },
];

/* ------------------------------------------------------------------ */
/*  Temel render                                                       */
/* ------------------------------------------------------------------ */

describe('Steps — temel render', () => {
  it('listeyi render eder', () => {
    render(<Steps items={defaultItems} />);
    expect(screen.getByRole('list')).toBeInTheDocument();
  });

  it('tum adimlari listitem olarak render eder', () => {
    render(<Steps items={defaultItems} />);
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
  });

  it('aria-label "Progress steps" olarak ayarlanir', () => {
    render(<Steps items={defaultItems} />);
    expect(screen.getByRole('list')).toHaveAttribute('aria-label', 'Progress steps');
  });

  it('adim basliklarini gosterir', () => {
    render(<Steps items={defaultItems} />);
    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByText('Second')).toBeInTheDocument();
    expect(screen.getByText('Third')).toBeInTheDocument();
  });

  it('varsayilan current 0 dir', () => {
    render(<Steps items={defaultItems} />);
    const items = screen.getAllByRole('listitem');
    expect(items[0]).toHaveAttribute('aria-current', 'step');
  });
});

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

describe('Steps — props', () => {
  it('current ile aktif adim ayarlanir', () => {
    render(<Steps items={defaultItems} current={1} />);
    const items = screen.getAllByRole('listitem');
    expect(items[1]).toHaveAttribute('aria-current', 'step');
    expect(items[0]).not.toHaveAttribute('aria-current');
  });

  it('description gosterilir', () => {
    const items: StepItem[] = [
      { key: 'a', title: 'Step 1', description: 'Desc one' },
    ];
    render(<Steps items={items} />);
    expect(screen.getByText('Desc one')).toBeInTheDocument();
  });

  it('icon override render edilir', () => {
    const items: StepItem[] = [
      { key: 'a', title: 'Step 1', icon: <span data-testid="custom-icon">X</span> },
    ];
    render(<Steps items={items} />);
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('className forwarding calisir', () => {
    const { container } = render(<Steps items={defaultItems} className="custom-cls" />);
    expect(container.firstElementChild?.className).toContain('custom-cls');
  });
});

/* ------------------------------------------------------------------ */
/*  Direction                                                          */
/* ------------------------------------------------------------------ */

describe('Steps — direction', () => {
  it('varsayilan direction horizontal dir (flex-row)', () => {
    const { container } = render(<Steps items={defaultItems} />);
    expect(container.firstElementChild?.className).toContain('flex-row');
  });

  it('direction="vertical" flex-col uygular', () => {
    const { container } = render(<Steps items={defaultItems} direction="vertical" />);
    expect(container.firstElementChild?.className).toContain('flex-col');
  });
});

/* ------------------------------------------------------------------ */
/*  Size                                                               */
/* ------------------------------------------------------------------ */

describe('Steps — size', () => {
  it.each([
    ['sm', 'h-6'],
    ['md', 'h-8'],
    ['lg', 'h-10'],
  ] as const)('size="%s" dogru indicator class uygular', (size, expected) => {
    const { container } = render(<Steps items={[{ key: 'a', title: 'S' }]} size={size} />);
    const btn = container.querySelector('button');
    expect(btn?.className).toContain(expected);
  });
});

/* ------------------------------------------------------------------ */
/*  Dot style                                                          */
/* ------------------------------------------------------------------ */

describe('Steps — dot style', () => {
  it('dot=true durumunda numara gostermez', () => {
    render(<Steps items={[{ key: 'a', title: 'S' }]} dot />);
    expect(screen.queryByText('1')).not.toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Status                                                             */
/* ------------------------------------------------------------------ */

describe('Steps — status', () => {
  it('status="error" durumunda unlem isareti gosterir', () => {
    render(<Steps items={[{ key: 'a', title: 'S' }]} status="error" />);
    expect(screen.getByText('!')).toBeInTheDocument();
  });

  it('tamamlanmis adimda check icon render edilir', () => {
    const { container } = render(<Steps items={defaultItems} current={1} />);
    const svgs = container.querySelectorAll('svg');
    expect(svgs.length).toBeGreaterThan(0);
  });
});

/* ------------------------------------------------------------------ */
/*  Interaction                                                        */
/* ------------------------------------------------------------------ */

describe('Steps — interaction', () => {
  it('onChange verildiginde adima tiklanabilir', async () => {
    const handleChange = vi.fn();
    render(<Steps items={defaultItems} onChange={handleChange} />);
    const buttons = screen.getAllByRole('button');
    await userEvent.click(buttons[1]);
    expect(handleChange).toHaveBeenCalledWith(1);
  });

  it('disabled adima tiklandiginda onChange calismaz', async () => {
    const handleChange = vi.fn();
    const items: StepItem[] = [
      { key: 'a', title: 'First' },
      { key: 'b', title: 'Second', disabled: true },
    ];
    render(<Steps items={items} onChange={handleChange} />);
    const buttons = screen.getAllByRole('button');
    await userEvent.click(buttons[1]);
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('onChange yoksa butonlar disabled olur', () => {
    render(<Steps items={defaultItems} />);
    const buttons = screen.getAllByRole('button');
    buttons.forEach((btn) => expect(btn).toBeDisabled());
  });
});

/* (Backward compat props value, onValueChange removed in v2.0.0) */

/* ------------------------------------------------------------------ */
/*  Edge cases                                                         */
/* ------------------------------------------------------------------ */

describe('Steps — edge cases', () => {
  it('bos items dizisi ile hata vermez', () => {
    const { container } = render(<Steps items={[]} />);
    expect(container.querySelector('[role="list"]')).toBeInTheDocument();
  });

  it('tek adimli steps render edilir', () => {
    render(<Steps items={[{ key: 'only', title: 'Only Step' }]} />);
    expect(screen.getAllByRole('listitem')).toHaveLength(1);
  });
});

/* ------------------------------------------------------------------ */
/*  Uncontrolled mode (defaultCurrent)                                 */
/* ------------------------------------------------------------------ */

describe('Steps — uncontrolled mode (defaultCurrent)', () => {
  it('renders with defaultCurrent and navigates internally on click', async () => {
    const handleChange = vi.fn();
    render(<Steps items={defaultItems} defaultCurrent={1} onChange={handleChange} />);

    // Initially step 1 (index) should be active via defaultCurrent
    const listItems = screen.getAllByRole('listitem');
    expect(listItems[1]).toHaveAttribute('aria-current', 'step');
    expect(listItems[0]).not.toHaveAttribute('aria-current');

    // Clicking step 2 should update internal state
    const buttons = screen.getAllByRole('button');
    await userEvent.click(buttons[2]);
    expect(handleChange).toHaveBeenCalledWith(2);

    // After click, step 2 should be active
    const updatedListItems = screen.getAllByRole('listitem');
    expect(updatedListItems[2]).toHaveAttribute('aria-current', 'step');
  });

  it('controlled current prop overrides defaultCurrent', () => {
    render(<Steps items={defaultItems} current={0} defaultCurrent={2} />);
    const listItems = screen.getAllByRole('listitem');
    // controlled current (0) should win over defaultCurrent (2)
    expect(listItems[0]).toHaveAttribute('aria-current', 'step');
    expect(listItems[2]).not.toHaveAttribute('aria-current');
  });
});

/* ------------------------------------------------------------------ */
/*  A11y                                                               */
/* ------------------------------------------------------------------ */

describe('Steps — a11y', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<Steps items={defaultItems} />);
    await expectNoA11yViolations(container);
  });
});
