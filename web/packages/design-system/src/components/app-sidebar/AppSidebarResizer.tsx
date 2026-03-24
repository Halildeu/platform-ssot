import React, { useCallback, useRef } from 'react';
import { cn } from '../../utils/cn';
import { useSidebar } from './useSidebar';
import type { AppSidebarResizerProps } from './types';

export const AppSidebarResizer: React.FC<AppSidebarResizerProps> = ({
  className,
}) => {
  const { resize, setWidth, setIsResizing, isCollapsed } = useSidebar();
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!resize || isCollapsed) return;

      e.preventDefault();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      startXRef.current = e.clientX;
      startWidthRef.current = resize.width;
      setIsResizing(true);

      const onPointerMove = (ev: PointerEvent) => {
        const delta = ev.clientX - startXRef.current;
        const next = Math.min(
          resize.maxWidth,
          Math.max(resize.minWidth, startWidthRef.current + delta),
        );
        setWidth(next);
      };

      const onPointerUp = () => {
        setIsResizing(false);
        document.removeEventListener('pointermove', onPointerMove);
        document.removeEventListener('pointerup', onPointerUp);
      };

      document.addEventListener('pointermove', onPointerMove);
      document.addEventListener('pointerup', onPointerUp);
    },
    [resize, isCollapsed, setWidth, setIsResizing],
  );

  if (!resize || isCollapsed) return null;

  return (
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label="Resize sidebar"
      aria-valuenow={resize.width}
      aria-valuemin={resize.minWidth}
      aria-valuemax={resize.maxWidth}
      className={cn(
        'absolute right-0 top-0 z-10 h-full w-1.5',
        'cursor-col-resize select-none',
        'hover:bg-[var(--action-primary)]/20',
        'active:bg-[var(--action-primary)]/30',
        'transition-colors duration-150',
        resize.isResizing && 'bg-[var(--action-primary)]/30',
        className,
      )}
      onPointerDown={onPointerDown}
    />
  );
};

AppSidebarResizer.displayName = 'AppSidebar.Resizer';
