import React from "react";
import { type AccessControlledProps } from "../../internal/access-controller";
export interface CalendarEvent {
    date: Date;
    color?: string;
    label?: string;
}
export interface CalendarLocaleText {
    months?: string[];
    weekdays?: string[];
    weekdaysShort?: string[];
    today?: string;
    previousMonth?: string;
    nextMonth?: string;
}
export type CalendarMode = "single" | "multiple" | "range";
export type CalendarSize = "sm" | "md" | "lg";
export interface CalendarProps extends AccessControlledProps {
    /** Selected date(s) */
    value?: Date | Date[] | null;
    /** Default value */
    defaultValue?: Date | null;
    /** Selection mode */
    mode?: CalendarMode;
    /** Current viewed month */
    month?: Date;
    /** Default month to display */
    defaultMonth?: Date;
    /** Min selectable date */
    minDate?: Date;
    /** Max selectable date */
    maxDate?: Date;
    /** Disabled specific dates */
    disabledDates?: (date: Date) => boolean;
    /** Highlight specific dates */
    highlightedDates?: Date[];
    /** First day of week (0=Sun, 1=Mon) */
    firstDayOfWeek?: 0 | 1;
    /** Show week numbers */
    showWeekNumbers?: boolean;
    /** Size */
    size?: CalendarSize;
    /** Show outside days (prev/next month) */
    showOutsideDays?: boolean;
    /** Number of months to display */
    numberOfMonths?: 1 | 2 | 3;
    /** Custom day render */
    renderDay?: (date: Date) => React.ReactNode;
    /** Event dots/badges per day */
    events?: CalendarEvent[];
    /** Locale text */
    localeText?: CalendarLocaleText;
    /** Called when value changes */
    onValueChange?: (value: Date | Date[] | null) => void;
    /** Called when displayed month changes */
    onMonthChange?: (month: Date) => void;
    /** Additional CSS class */
    className?: string;
}
export declare const Calendar: React.ForwardRefExoticComponent<CalendarProps & React.RefAttributes<HTMLDivElement>>;
export default Calendar;
