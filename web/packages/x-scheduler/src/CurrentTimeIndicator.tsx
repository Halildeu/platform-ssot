import React, { useEffect, useState } from 'react';

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

export interface CurrentTimeIndicatorProps {
  /** First visible hour (e.g. 8 for 08:00) */
  hourStart: number;
  /** Last visible hour exclusive (e.g. 20 for 20:00) */
  hourEnd: number;
  /** Optional CSS class */
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export const CurrentTimeIndicator: React.FC<CurrentTimeIndicatorProps> = ({
  hourStart,
  hourEnd,
  className,
}) => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const minutes = now.getHours() * 60 + now.getMinutes();
  const rangeStart = hourStart * 60;
  const rangeEnd = hourEnd * 60;

  // Not within visible range
  if (minutes < rangeStart || minutes >= rangeEnd) return null;

  const pct = ((minutes - rangeStart) / (rangeEnd - rangeStart)) * 100;

  return (
    <div
      className={className}
      aria-hidden="true"
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: `${pct}%`,
        zIndex: 3,
        pointerEvents: 'none',
      }}
    >
      {/* Dot */}
      <span
        style={{
          position: 'absolute',
          left: -4,
          top: -4,
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: 'var(--x-scheduler-now-color))',
        }}
      />
      {/* Line */}
      <span
        style={{
          display: 'block',
          height: 2,
          backgroundColor: 'var(--x-scheduler-now-color))',
        }}
      />
    </div>
  );
};
