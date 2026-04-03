import React from 'react';
import { Bell } from 'lucide-react';
import { Tooltip } from '@mfe/design-system';

/* ------------------------------------------------------------------ */
/*  NotificationBell — Bell icon with animated badge count             */
/* ------------------------------------------------------------------ */

interface NotificationBellProps {
  unreadCount: number;
  onClick: () => void;
  label?: string;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({
  unreadCount,
  onClick,
  label = 'Bildirimler',
}) => {
  const showBadge = unreadCount > 0;
  const displayCount = unreadCount > 99 ? '99+' : String(unreadCount);

  return (
    <Tooltip content={label} placement="bottom">
      <button
        type="button"
        onClick={onClick}
        aria-label={label}
        className="group relative inline-flex h-9 w-9 items-center justify-center rounded-lg text-text-secondary transition-colors duration-150 hover:bg-surface-muted hover:text-text-primary"
      >
        <Bell className={`h-[18px] w-[18px] transition-transform duration-150 ${showBadge ? 'group-hover:rotate-12' : ''}`} aria-hidden />
        {showBadge && (
          <span className="absolute -right-0.5 -top-0.5 flex min-w-[18px] items-center justify-center rounded-full bg-state-danger-text px-1 text-center text-[10px] font-bold leading-[18px] text-text-inverse animate-[pulse_1s_ease-in-out_3]">
            {displayCount}
          </span>
        )}
      </button>
    </Tooltip>
  );
};
