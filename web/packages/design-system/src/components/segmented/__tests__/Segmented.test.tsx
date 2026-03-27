// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Segmented,
  resolveSegmentedNextValue,
  createSegmentedPreset,
  type SegmentedItem,
} from '../Segmented';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => {
  cleanup();
});

const sampleItems: SegmentedItem[] = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
];

/* ------------------------------------------------------------------ */
/*  Temel render                                                       */
/* ------------------------------------------------------------------ */

describe('Segmented — temel render', () => {
  it('group role ile render eder', () => {
    render(<Segmented items={sampleItems} />);
    expect(screen.getByRole('group')).toBeInTheDocument();
  });

  it('radiogroup role icerir', () => {
    render(<Segmented items={sampleItems} />);
    expect(screen.getByRole('radiogroup')).toBeInTheDocument();
  });

  it('tum item etiketlerini gosterir', () => {
    render(<Segmented items={sampleItems} />);
    expect(screen.getByText('Day')).toBeInTheDocument();
    expect(screen.getByText('Week')).toBeInTheDocument();
    expect(screen.getByText('Month')).toBeInTheDocument();
  });

  it('radio role butonlar icerir', () => {
    render(<Segmented items={sampleItems} />);
    const radios = screen.getAllByRole('radio');
    expect(radios).toHaveLength(3);
  });

  it('ariaLabel kullanir', () => {
    render(<Segmented items={sampleItems} ariaLabel="Time range" />);
    expect(screen.getByRole('group')).toHaveAttribute('aria-label', 'Time range');
  });
});

/* ------------------------------------------------------------------ */
/*  Selection — single mode                                            */
/* ------------------------------------------------------------------ */

describe('Segmented — single selection', () => {
  it('defaultValue ile baslangic secimi ayarlanir', () => {
    render(<Segmented items={sampleItems} defaultValue="week" />);
    const weekRadio = screen.getByRole('radio', { name: 'Week' });
    expect(weekRadio).toHaveAttribute('aria-checked', 'true');
  });

  it('controlled value ile secim belirlenir', () => {
    render(<Segmented items={sampleItems} value="month" />);
    const monthRadio = screen.getByRole('radio', { name: 'Month' });
    expect(monthRadio).toHaveAttribute('aria-checked', 'true');
  });

  it('onValueChange tiklandiginda cagrilir', async () => {
    const handleChange = vi.fn();
    render(<Segmented items={sampleItems} onValueChange={handleChange} />);
    await userEvent.click(screen.getByText('Week'));
    expect(handleChange).toHaveBeenCalledWith('week');
  });

  it('allowEmptySelection=false zaten secili itema tiklaninca degisiklik olmaz', async () => {
    const handleChange = vi.fn();
    render(<Segmented items={sampleItems} defaultValue="day" onValueChange={handleChange} />);
    await userEvent.click(screen.getByText('Day'));
    expect(handleChange).toHaveBeenCalledWith('day');
  });
});

/* ------------------------------------------------------------------ */
/*  Selection — multiple mode                                          */
/* ------------------------------------------------------------------ */

describe('Segmented — multiple selection', () => {
  it('birden fazla secim yapilabilir', async () => {
    const handleChange = vi.fn();
    render(
      <Segmented
        items={sampleItems}
        selectionMode="multiple"
        defaultValue={['day']}
        onValueChange={handleChange}
      />,
    );
    await userEvent.click(screen.getByText('Week'));
    expect(handleChange).toHaveBeenCalledWith(['day', 'week']);
  });
});

/* ------------------------------------------------------------------ */
/*  Size                                                               */
/* ------------------------------------------------------------------ */

describe('Segmented — size', () => {
  it('data-size attribute ayarlar', () => {
    const { container } = render(<Segmented items={sampleItems} size="sm" />);
    expect(container.querySelector('[data-size="sm"]')).toBeInTheDocument();
  });

  it.each(['sm', 'md', 'lg'] as const)('size="%s" render eder', (size) => {
    const { container } = render(<Segmented items={sampleItems} size={size} />);
    expect(container.querySelector(`[data-size="${size}"]`)).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Appearance                                                         */
/* ------------------------------------------------------------------ */

describe('Segmented — appearance', () => {
  it.each(['default', 'outline', 'ghost'] as const)(
    'appearance="%s" data-appearance attribute ayarlar',
    (appearance) => {
      const { container } = render(<Segmented items={sampleItems} appearance={appearance} />);
      expect(container.querySelector(`[data-appearance="${appearance}"]`)).toBeInTheDocument();
    },
  );
});

/* ------------------------------------------------------------------ */
/*  Orientation                                                        */
/* ------------------------------------------------------------------ */

describe('Segmented — orientation', () => {
  it('data-orientation="horizontal" (varsayilan)', () => {
    const { container } = render(<Segmented items={sampleItems} />);
    expect(container.querySelector('[data-orientation="horizontal"]')).toBeInTheDocument();
  });

  it('data-orientation="vertical"', () => {
    const { container } = render(<Segmented items={sampleItems} orientation="vertical" />);
    expect(container.querySelector('[data-orientation="vertical"]')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Disabled items                                                     */
/* ------------------------------------------------------------------ */

describe('Segmented — disabled items', () => {
  it('disabled item button disabled olur', () => {
    const items: SegmentedItem[] = [
      { value: 'a', label: 'A' },
      { value: 'b', label: 'B', disabled: true },
    ];
    render(<Segmented items={items} />);
    expect(screen.getByRole('radio', { name: 'B' })).toBeDisabled();
  });
});

/* ------------------------------------------------------------------ */
/*  fullWidth                                                          */
/* ------------------------------------------------------------------ */

describe('Segmented — fullWidth', () => {
  it('fullWidth=true durumunda w-full class uygular', () => {
    const { container } = render(<Segmented items={sampleItems} fullWidth />);
    expect(container.querySelector('.w-full')).toBeInTheDocument();
  });

  it('fullWidth=false (varsayilan) w-full class uygulamaz', () => {
    const { container } = render(<Segmented items={sampleItems} />);
    const group = container.querySelector('[role="group"]');
    expect(group?.className).not.toContain('w-full');
  });
});

/* ------------------------------------------------------------------ */
/*  Icon ve badge                                                      */
/* ------------------------------------------------------------------ */

describe('Segmented — icon ve badge', () => {
  it('icon render eder', () => {
    const items: SegmentedItem[] = [
      { value: 'a', label: 'A', icon: <span data-testid="seg-icon">IC</span> },
    ];
    render(<Segmented items={items} />);
    expect(screen.getByTestId('seg-icon')).toBeInTheDocument();
  });

  it('badge render eder', () => {
    const items: SegmentedItem[] = [
      { value: 'a', label: 'A', badge: <span data-testid="seg-badge">3</span> },
    ];
    render(<Segmented items={items} />);
    expect(screen.getByTestId('seg-badge')).toBeInTheDocument();
  });

  it('description render eder', () => {
    const items: SegmentedItem[] = [
      { value: 'a', label: 'A', description: 'First option' },
    ];
    render(<Segmented items={items} />);
    expect(screen.getByText('First option')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Keyboard navigation                                                */
/* ------------------------------------------------------------------ */

describe('Segmented — keyboard navigation', () => {
  it('ArrowRight ile sonraki item odaklanir (horizontal)', () => {
    render(<Segmented items={sampleItems} defaultValue="day" />);
    const dayBtn = screen.getByRole('radio', { name: 'Day' });
    dayBtn.focus();
    fireEvent.keyDown(dayBtn, { key: 'ArrowRight' });
    expect(document.activeElement?.textContent).toContain('Week');
  });

  it('ArrowLeft ile onceki item odaklanir (horizontal)', () => {
    render(<Segmented items={sampleItems} defaultValue="week" />);
    const weekBtn = screen.getByRole('radio', { name: 'Week' });
    weekBtn.focus();
    fireEvent.keyDown(weekBtn, { key: 'ArrowLeft' });
    expect(document.activeElement?.textContent).toContain('Day');
  });
});

/* ------------------------------------------------------------------ */
/*  Helper functions                                                   */
/* ------------------------------------------------------------------ */

describe('resolveSegmentedNextValue', () => {
  it('single: farkli deger secilince yeni degeri doner', () => {
    expect(resolveSegmentedNextValue('day', 'week', 'single')).toBe('week');
  });

  it('single: ayni deger secilince (allowEmpty=false) eski degeri doner', () => {
    expect(resolveSegmentedNextValue('day', 'day', 'single')).toBe('day');
  });

  it('single: ayni deger secilince (allowEmpty=true) bos string doner', () => {
    expect(resolveSegmentedNextValue('day', 'day', 'single', { allowEmptySelection: true })).toBe('');
  });

  it('multiple: yeni deger eklenir', () => {
    expect(resolveSegmentedNextValue(['day'], 'week', 'multiple')).toEqual(['day', 'week']);
  });

  it('multiple: var olan deger cikarilir', () => {
    expect(resolveSegmentedNextValue(['day', 'week'], 'day', 'multiple')).toEqual(['week']);
  });
});

describe('createSegmentedPreset', () => {
  it('toolbar preset doner', () => {
    const preset = createSegmentedPreset('toolbar');
    expect(preset.size).toBe('sm');
    expect(preset.appearance).toBe('outline');
  });

  it('pill_tabs preset doner', () => {
    const preset = createSegmentedPreset('pill_tabs');
    expect(preset.size).toBe('md');
    expect(preset.shape).toBe('pill');
  });
});

/* ------------------------------------------------------------------ */
/*  Edge cases                                                         */
/* ------------------------------------------------------------------ */

describe('Segmented — edge cases', () => {
  it('className forwarding calisir', () => {
    const { container } = render(<Segmented items={sampleItems} className="custom-class" />);
    expect(container.querySelector('[role="group"]')?.className).toContain('custom-class');
  });

  it('ref forwarding calisir', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Segmented items={sampleItems} ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('data-testid item uzerinde ayarlanir', () => {
    const items: SegmentedItem[] = [
      { value: 'a', label: 'A', dataTestId: 'seg-a' },
    ];
    const { container } = render(<Segmented items={items} />);
    expect(container.querySelector('[data-testid="seg-a"]')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  A11y                                                               */
/* ------------------------------------------------------------------ */

describe('Segmented — a11y', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<Segmented items={sampleItems} />);
    await expectNoA11yViolations(container);
  });
});
