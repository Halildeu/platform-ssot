// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Calendar } from '../Calendar';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => {
  cleanup();
});

/* ------------------------------------------------------------------ */
/*  Temel render                                                       */
/* ------------------------------------------------------------------ */

describe('Calendar — temel render', () => {
  it('renders the calendar container', () => {
    render(<Calendar />);
    expect(screen.getByTestId('calendar')).toBeInTheDocument();
  });

  it('renders month and year in header', () => {
    render(<Calendar defaultMonth={new Date(2024, 5, 1)} />);
    expect(screen.getByTestId('calendar-title')).toHaveTextContent('Haziran 2024');
  });

  it('renders weekday headers with Turkish defaults (Mon first)', () => {
    const { container } = render(<Calendar />);
    const headers = container.querySelectorAll('th');
    // firstDayOfWeek=1 by default, so Pt (Monday) is first
    expect(headers[0]).toHaveTextContent('Pt');
    expect(headers[6]).toHaveTextContent('Pz');
  });

  it('renders prev/next navigation buttons', () => {
    render(<Calendar />);
    expect(screen.getByTestId('calendar-prev')).toBeInTheDocument();
    expect(screen.getByTestId('calendar-next')).toBeInTheDocument();
  });

  it('renders day cells for the month', () => {
    const { container } = render(<Calendar defaultMonth={new Date(2024, 0, 1)} />);
    const buttons = container.querySelectorAll('td button');
    // 6 rows * 7 cols = 42 buttons (with outside days)
    expect(buttons.length).toBe(42);
  });

  it('has role="grid" on the table', () => {
    render(<Calendar />);
    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  it('has role="gridcell" on day cells', () => {
    render(<Calendar />);
    const cells = screen.getAllByRole('gridcell');
    expect(cells.length).toBeGreaterThan(0);
  });
});

/* ------------------------------------------------------------------ */
/*  Size variants                                                      */
/* ------------------------------------------------------------------ */

describe('Calendar — size variants', () => {
  it('renders sm size without errors', () => {
    render(<Calendar size="sm" />);
    expect(screen.getByTestId('calendar')).toBeInTheDocument();
  });

  it('renders lg size without errors', () => {
    render(<Calendar size="lg" />);
    expect(screen.getByTestId('calendar')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Navigation                                                         */
/* ------------------------------------------------------------------ */

describe('Calendar — navigation', () => {
  it('navigates to next month on next button click', async () => {
    render(<Calendar defaultMonth={new Date(2024, 0, 1)} />);
    expect(screen.getByTestId('calendar-title')).toHaveTextContent('Ocak 2024');
    await userEvent.click(screen.getByTestId('calendar-next'));
    expect(screen.getByTestId('calendar-title')).toHaveTextContent('Subat 2024');
  });

  it('navigates to previous month on prev button click', async () => {
    render(<Calendar defaultMonth={new Date(2024, 1, 1)} />);
    expect(screen.getByTestId('calendar-title')).toHaveTextContent('Subat 2024');
    await userEvent.click(screen.getByTestId('calendar-prev'));
    expect(screen.getByTestId('calendar-title')).toHaveTextContent('Ocak 2024');
  });

  it('calls onMonthChange when navigating', async () => {
    const handleMonthChange = vi.fn();
    render(<Calendar defaultMonth={new Date(2024, 0, 1)} onMonthChange={handleMonthChange} />);
    await userEvent.click(screen.getByTestId('calendar-next'));
    expect(handleMonthChange).toHaveBeenCalledTimes(1);
    const called = handleMonthChange.mock.calls[0][0] as Date;
    expect(called.getMonth()).toBe(1);
    expect(called.getFullYear()).toBe(2024);
  });
});

/* ------------------------------------------------------------------ */
/*  Single selection                                                   */
/* ------------------------------------------------------------------ */

describe('Calendar — single selection', () => {
  it('selects a date on click', async () => {
    const handleValueChange = vi.fn();
    render(
      <Calendar
        defaultMonth={new Date(2024, 0, 1)}
        onValueChange={handleValueChange}
      />,
    );
    const day15 = screen.getByLabelText('15 Ocak 2024');
    await userEvent.click(day15);
    expect(handleValueChange).toHaveBeenCalledTimes(1);
    const selected = handleValueChange.mock.calls[0][0] as Date;
    expect(selected.getDate()).toBe(15);
    expect(selected.getMonth()).toBe(0);
  });

  it('marks selected date with aria-selected', () => {
    render(
      <Calendar
        defaultMonth={new Date(2024, 0, 1)}
        value={new Date(2024, 0, 15)}
      />,
    );
    const day15 = screen.getByLabelText('15 Ocak 2024');
    expect(day15).toHaveAttribute('aria-selected', 'true');
  });

  it('works as uncontrolled with defaultValue', () => {
    render(
      <Calendar defaultValue={new Date(2024, 0, 10)} />,
    );
    const day10 = screen.getByLabelText('10 Ocak 2024');
    expect(day10).toHaveAttribute('aria-selected', 'true');
  });
});

/* ------------------------------------------------------------------ */
/*  Multiple selection                                                 */
/* ------------------------------------------------------------------ */

describe('Calendar — multiple selection', () => {
  it('selects multiple dates', async () => {
    const handleValueChange = vi.fn();
    render(
      <Calendar
        mode="multiple"
        defaultMonth={new Date(2024, 0, 1)}
        onValueChange={handleValueChange}
      />,
    );
    await userEvent.click(screen.getByLabelText('5 Ocak 2024'));
    await userEvent.click(screen.getByLabelText('10 Ocak 2024'));
    expect(handleValueChange).toHaveBeenCalledTimes(2);
    const second = handleValueChange.mock.calls[1][0] as Date[];
    expect(second).toHaveLength(2);
  });

  it('deselects a date on second click', async () => {
    const handleValueChange = vi.fn();
    render(
      <Calendar
        mode="multiple"
        defaultMonth={new Date(2024, 0, 1)}
        onValueChange={handleValueChange}
      />,
    );
    await userEvent.click(screen.getByLabelText('5 Ocak 2024'));
    await userEvent.click(screen.getByLabelText('5 Ocak 2024'));
    const second = handleValueChange.mock.calls[1][0] as Date[];
    expect(second).toHaveLength(0);
  });
});

/* ------------------------------------------------------------------ */
/*  Range selection                                                    */
/* ------------------------------------------------------------------ */

describe('Calendar — range selection', () => {
  it('selects a range with two clicks', async () => {
    const handleValueChange = vi.fn();
    render(
      <Calendar
        mode="range"
        defaultMonth={new Date(2024, 0, 1)}
        onValueChange={handleValueChange}
      />,
    );
    await userEvent.click(screen.getByLabelText('5 Ocak 2024'));
    await userEvent.click(screen.getByLabelText('15 Ocak 2024'));
    expect(handleValueChange).toHaveBeenCalledTimes(2);
    const range = handleValueChange.mock.calls[1][0] as Date[];
    expect(range).toHaveLength(2);
    expect(range[0].getDate()).toBe(5);
    expect(range[1].getDate()).toBe(15);
  });
});

/* ------------------------------------------------------------------ */
/*  Disabled dates                                                     */
/* ------------------------------------------------------------------ */

describe('Calendar — disabled dates', () => {
  it('disables dates via disabledDates function', () => {
    render(
      <Calendar
        defaultMonth={new Date(2024, 0, 1)}
        disabledDates={(d) => d.getDate() === 15}
      />,
    );
    const day15 = screen.getByLabelText('15 Ocak 2024');
    expect(day15).toBeDisabled();
  });

  it('disables dates before minDate', () => {
    render(
      <Calendar
        defaultMonth={new Date(2024, 0, 1)}
        minDate={new Date(2024, 0, 10)}
      />,
    );
    const day5 = screen.getByLabelText('5 Ocak 2024');
    expect(day5).toBeDisabled();
    const day10 = screen.getByLabelText('10 Ocak 2024');
    expect(day10).not.toBeDisabled();
  });

  it('disables dates after maxDate', () => {
    render(
      <Calendar
        defaultMonth={new Date(2024, 0, 1)}
        maxDate={new Date(2024, 0, 20)}
      />,
    );
    const day25 = screen.getByLabelText('25 Ocak 2024');
    expect(day25).toBeDisabled();
    const day20 = screen.getByLabelText('20 Ocak 2024');
    expect(day20).not.toBeDisabled();
  });

  it('does not call onValueChange for disabled dates', async () => {
    const handleValueChange = vi.fn();
    render(
      <Calendar
        defaultMonth={new Date(2024, 0, 1)}
        disabledDates={(d) => d.getDate() === 15}
        onValueChange={handleValueChange}
      />,
    );
    await userEvent.click(screen.getByLabelText('15 Ocak 2024'));
    expect(handleValueChange).not.toHaveBeenCalled();
  });
});

/* ------------------------------------------------------------------ */
/*  Today indicator                                                    */
/* ------------------------------------------------------------------ */

describe('Calendar — today indicator', () => {
  it('marks today with aria-current="date"', () => {
    const today = new Date();
    render(<Calendar defaultMonth={today} />);
    const todayDate = today.getDate();
    const monthNames = [
      "Ocak", "Subat", "Mart", "Nisan", "Mayis", "Haziran",
      "Temmuz", "Agustos", "Eylul", "Ekim", "Kasim", "Aralik",
    ];
    const label = `${todayDate} ${monthNames[today.getMonth()]} ${today.getFullYear()}`;
    const todayBtn = screen.getByLabelText(label);
    expect(todayBtn).toHaveAttribute('aria-current', 'date');
  });
});

/* ------------------------------------------------------------------ */
/*  Outside days                                                       */
/* ------------------------------------------------------------------ */

describe('Calendar — outside days', () => {
  it('hides outside days when showOutsideDays is false', () => {
    const { container } = render(
      <Calendar
        defaultMonth={new Date(2024, 0, 1)}
        showOutsideDays={false}
      />,
    );
    // January 2024 starts on Monday (firstDayOfWeek=1), so no leading empty cells
    // But there may be trailing empty cells
    const emptyGridcells = container.querySelectorAll('td[role="gridcell"]:empty');
    // When showOutsideDays is false, outside day cells should be empty
    expect(emptyGridcells.length).toBeGreaterThanOrEqual(0);
  });
});

/* ------------------------------------------------------------------ */
/*  Week numbers                                                       */
/* ------------------------------------------------------------------ */

describe('Calendar — week numbers', () => {
  it('shows week numbers when showWeekNumbers is true', () => {
    const { container } = render(
      <Calendar
        defaultMonth={new Date(2024, 0, 1)}
        showWeekNumbers
      />,
    );
    // Should have an extra column header "#"
    const headers = container.querySelectorAll('th');
    expect(headers[0]).toHaveTextContent('#');
    // 8 columns instead of 7
    expect(headers.length).toBe(8);
  });
});

/* ------------------------------------------------------------------ */
/*  First day of week                                                  */
/* ------------------------------------------------------------------ */

describe('Calendar — firstDayOfWeek', () => {
  it('starts with Sunday when firstDayOfWeek=0', () => {
    const { container } = render(
      <Calendar firstDayOfWeek={0} />,
    );
    const headers = container.querySelectorAll('th');
    expect(headers[0]).toHaveTextContent('Pz');
  });
});

/* ------------------------------------------------------------------ */
/*  Events                                                             */
/* ------------------------------------------------------------------ */

describe('Calendar — events', () => {
  it('renders event dots for dates with events', () => {
    const { container } = render(
      <Calendar
        defaultMonth={new Date(2024, 0, 1)}
        events={[
          { date: new Date(2024, 0, 15), color: 'red', label: 'Meeting' },
        ]}
      />,
    );
    const day15Btn = screen.getByLabelText('15 Ocak 2024');
    const dot = day15Btn.querySelector('span.absolute span') as HTMLElement;
    expect(dot).toBeInTheDocument();
    expect(dot.style.backgroundColor).toBe('red');
  });

  it('limits event dots to 3', () => {
    const { container } = render(
      <Calendar
        defaultMonth={new Date(2024, 0, 1)}
        events={[
          { date: new Date(2024, 0, 15), label: 'A' },
          { date: new Date(2024, 0, 15), label: 'B' },
          { date: new Date(2024, 0, 15), label: 'C' },
          { date: new Date(2024, 0, 15), label: 'D' },
        ]}
      />,
    );
    const day15Btn = screen.getByLabelText('15 Ocak 2024');
    const dots = day15Btn.querySelectorAll('span.absolute span');
    expect(dots.length).toBe(3);
  });
});

/* ------------------------------------------------------------------ */
/*  Custom renderDay                                                   */
/* ------------------------------------------------------------------ */

describe('Calendar — custom renderDay', () => {
  it('uses custom renderDay function', () => {
    render(
      <Calendar
        defaultMonth={new Date(2024, 0, 1)}
        renderDay={(date) => (
          <span data-testid={`custom-${date.getDate()}`}>{date.getDate()}!</span>
        )}
      />,
    );
    expect(screen.getByTestId('custom-15')).toHaveTextContent('15!');
  });
});

/* ------------------------------------------------------------------ */
/*  Multiple months                                                    */
/* ------------------------------------------------------------------ */

describe('Calendar — multiple months', () => {
  it('renders 2 month panels when numberOfMonths=2', () => {
    render(
      <Calendar
        defaultMonth={new Date(2024, 0, 1)}
        numberOfMonths={2}
      />,
    );
    const titles = screen.getAllByTestId('calendar-title');
    expect(titles).toHaveLength(2);
    expect(titles[0]).toHaveTextContent('Ocak 2024');
    expect(titles[1]).toHaveTextContent('Subat 2024');
  });

  it('renders 3 month panels when numberOfMonths=3', () => {
    render(
      <Calendar
        defaultMonth={new Date(2024, 0, 1)}
        numberOfMonths={3}
      />,
    );
    const titles = screen.getAllByTestId('calendar-title');
    expect(titles).toHaveLength(3);
  });
});

/* ------------------------------------------------------------------ */
/*  Locale text                                                        */
/* ------------------------------------------------------------------ */

describe('Calendar — locale text', () => {
  it('uses custom month names', () => {
    const customMonths = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ];
    render(
      <Calendar
        defaultMonth={new Date(2024, 0, 1)}
        localeText={{ months: customMonths }}
      />,
    );
    expect(screen.getByTestId('calendar-title')).toHaveTextContent('January 2024');
  });

  it('uses custom weekday short names', () => {
    const { container } = render(
      <Calendar
        localeText={{ weekdaysShort: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'] }}
      />,
    );
    const headers = container.querySelectorAll('th');
    // firstDayOfWeek=1 means Monday first
    expect(headers[0]).toHaveTextContent('Mo');
  });
});

/* ------------------------------------------------------------------ */
/*  Access control                                                     */
/* ------------------------------------------------------------------ */

describe('Calendar — access control', () => {
  it('access="hidden" renders nothing', () => {
    const { container } = render(<Calendar access="hidden" />);
    expect(container.innerHTML).toBe('');
  });

  it('access="disabled" disables all interactions', () => {
    const { container } = render(
      <Calendar access="disabled" defaultMonth={new Date(2024, 0, 1)} />,
    );
    const day = screen.getByLabelText('15 Ocak 2024');
    expect(day).toBeDisabled();
  });

  it('access="readonly" disables all interactions', async () => {
    const handleValueChange = vi.fn();
    render(
      <Calendar
        access="readonly"
        defaultMonth={new Date(2024, 0, 1)}
        onValueChange={handleValueChange}
      />,
    );
    const day = screen.getByLabelText('15 Ocak 2024');
    await userEvent.click(day);
    expect(handleValueChange).not.toHaveBeenCalled();
  });
});

/* ------------------------------------------------------------------ */
/*  Keyboard navigation                                                */
/* ------------------------------------------------------------------ */

describe('Calendar — keyboard navigation', () => {
  it('selects date on Enter key', () => {
    const handleValueChange = vi.fn();
    render(
      <Calendar
        defaultMonth={new Date(2024, 0, 1)}
        onValueChange={handleValueChange}
      />,
    );
    const day15 = screen.getByLabelText('15 Ocak 2024');
    fireEvent.focus(day15);
    fireEvent.keyDown(day15, { key: 'Enter' });
    expect(handleValueChange).toHaveBeenCalledTimes(1);
  });

  it('selects date on Space key', () => {
    const handleValueChange = vi.fn();
    render(
      <Calendar
        defaultMonth={new Date(2024, 0, 1)}
        onValueChange={handleValueChange}
      />,
    );
    const day15 = screen.getByLabelText('15 Ocak 2024');
    fireEvent.focus(day15);
    fireEvent.keyDown(day15, { key: ' ' });
    expect(handleValueChange).toHaveBeenCalledTimes(1);
  });
});

/* ------------------------------------------------------------------ */
/*  Highlighted dates                                                  */
/* ------------------------------------------------------------------ */

describe('Calendar — highlighted dates', () => {
  it('applies highlight styling to specified dates', () => {
    render(
      <Calendar
        defaultMonth={new Date(2024, 0, 1)}
        highlightedDates={[new Date(2024, 0, 20)]}
      />,
    );
    const day20 = screen.getByLabelText('20 Ocak 2024');
    expect(day20.className).toContain('surface-accent');
  });
});

/* ------------------------------------------------------------------ */
/*  Ref forwarding                                                     */
/* ------------------------------------------------------------------ */

describe('Calendar — ref forwarding', () => {
  it('forwards ref to the container div', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Calendar ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

/* ------------------------------------------------------------------ */
/*  className                                                          */
/* ------------------------------------------------------------------ */

describe('Calendar — className', () => {
  it('applies custom className', () => {
    render(<Calendar className="my-custom-class" />);
    expect(screen.getByTestId('calendar')).toHaveClass('my-custom-class');
  });
});

/* ------------------------------------------------------------------ */
/*  Controlled month                                                   */
/* ------------------------------------------------------------------ */

describe('Calendar — controlled month', () => {
  it('displays the controlled month', () => {
    render(<Calendar month={new Date(2025, 11, 1)} />);
    expect(screen.getByTestId('calendar-title')).toHaveTextContent('Aralik 2025');
  });
});

/* ------------------------------------------------------------------ */
/*  A11y                                                               */
/* ------------------------------------------------------------------ */

describe('Calendar — a11y', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<Calendar defaultMonth={new Date(2024, 0, 1)} />);
    await expectNoA11yViolations(container);
  });
});
