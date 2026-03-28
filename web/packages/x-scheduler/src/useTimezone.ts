import { useCallback, useMemo, useState } from 'react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface TimezoneState {
  /** Current IANA timezone (e.g. "America/New_York") */
  timezone: string;
  /** Switch to a different IANA timezone */
  setTimezone: (tz: string) => void;
  /** Convert a UTC Date to the selected timezone (returns a new Date shifted to local wall-clock) */
  toLocal: (date: Date) => Date;
  /** Convert a local-wall-clock Date back to UTC */
  toUTC: (date: Date) => Date;
  /** Format a Date in the selected timezone */
  formatInTimezone: (date: Date, format?: string) => string;
  /** Offset from UTC in minutes for the selected timezone (positive = ahead of UTC) */
  getOffset: () => number;
  /** Human-readable timezone label, e.g. "GMT+3" or "EST" */
  timezoneLabel: string;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/** Get the browser's IANA timezone */
function getBrowserTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return 'UTC';
  }
}

/**
 * Compute the UTC offset in minutes for a given IANA timezone at a specific instant.
 * Positive means ahead of UTC (e.g. +180 for Europe/Istanbul at UTC+3).
 */
function getTimezoneOffsetMinutes(timezone: string, at: Date = new Date()): number {
  // Format the date in the target timezone to extract the wall-clock parts
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(at);

  const get = (type: Intl.DateTimeFormatPartTypes): number => {
    const p = parts.find((p) => p.type === type);
    return p ? parseInt(p.value, 10) : 0;
  };

  // Build a UTC timestamp from the wall-clock parts
  const wallUtc = Date.UTC(get('year'), get('month') - 1, get('day'), get('hour'), get('minute'), get('second'));

  // Difference = wallUTC - actualUTC gives the offset
  return Math.round((wallUtc - at.getTime()) / 60_000);
}

/**
 * Shift a Date by the timezone offset so its local getters return wall-clock values
 * for the target timezone. Note: the resulting Date object's internal UTC value is
 * shifted — this is intentional so that getHours()/getMinutes()/etc. return
 * the expected wall-clock values for use in UI positioning.
 */
function shiftToTimezone(date: Date, timezone: string): Date {
  const offset = getTimezoneOffsetMinutes(timezone, date);
  // date.getTimezoneOffset() returns the browser's offset (negative for ahead of UTC)
  const browserOffset = -date.getTimezoneOffset();
  const diff = offset - browserOffset;
  return new Date(date.getTime() + diff * 60_000);
}

/**
 * Reverse of shiftToTimezone — takes a Date whose local getters represent wall-clock
 * in the target timezone and returns the actual UTC instant.
 */
function shiftFromTimezone(date: Date, timezone: string): Date {
  const offset = getTimezoneOffsetMinutes(timezone, date);
  const browserOffset = -date.getTimezoneOffset();
  const diff = offset - browserOffset;
  return new Date(date.getTime() - diff * 60_000);
}

/* ------------------------------------------------------------------ */
/*  Hook                                                               */
/* ------------------------------------------------------------------ */

export function useTimezone(initialTimezone?: string): TimezoneState {
  const [timezone, setTimezone] = useState<string>(initialTimezone ?? getBrowserTimezone());

  const toLocal = useCallback(
    (date: Date): Date => shiftToTimezone(date, timezone),
    [timezone],
  );

  const toUTC = useCallback(
    (date: Date): Date => shiftFromTimezone(date, timezone),
    [timezone],
  );

  const formatInTimezone = useCallback(
    (date: Date, format?: string): string => {
      const opts: Intl.DateTimeFormatOptions = { timeZone: timezone };

      switch (format) {
        case 'time':
          opts.hour = '2-digit';
          opts.minute = '2-digit';
          break;
        case 'date':
          opts.year = 'numeric';
          opts.month = '2-digit';
          opts.day = '2-digit';
          break;
        case 'datetime':
          opts.year = 'numeric';
          opts.month = '2-digit';
          opts.day = '2-digit';
          opts.hour = '2-digit';
          opts.minute = '2-digit';
          break;
        default:
          // Full representation
          opts.year = 'numeric';
          opts.month = '2-digit';
          opts.day = '2-digit';
          opts.hour = '2-digit';
          opts.minute = '2-digit';
          opts.second = '2-digit';
          break;
      }

      return new Intl.DateTimeFormat('en-US', opts).format(date);
    },
    [timezone],
  );

  const getOffset = useCallback((): number => {
    return getTimezoneOffsetMinutes(timezone);
  }, [timezone]);

  const timezoneLabel = useMemo(() => {
    try {
      const fmt = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        timeZoneName: 'short',
      });
      const parts = fmt.formatToParts(new Date());
      const tzPart = parts.find((p) => p.type === 'timeZoneName');
      return tzPart?.value ?? timezone;
    } catch {
      return timezone;
    }
  }, [timezone]);

  return {
    timezone,
    setTimezone,
    toLocal,
    toUTC,
    formatInTimezone,
    getOffset,
    timezoneLabel,
  };
}

/* Re-export helpers for testing */
export { getTimezoneOffsetMinutes, getBrowserTimezone };
