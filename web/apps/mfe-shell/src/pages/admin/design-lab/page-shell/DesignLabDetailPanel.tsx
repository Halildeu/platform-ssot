import React from 'react';
import clsx from 'clsx';

type DesignLabDetailPanelProps = {
  resetKey: string;
  children: React.ReactNode;
  className?: string;
  onResetView?: () => void;
};

export const DesignLabDetailPanel: React.FC<DesignLabDetailPanelProps> = ({
  resetKey,
  children,
  className,
  onResetView,
}) => {
  const panelRef = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    onResetView?.();

    const element = panelRef.current;
    if (!element) {
      return;
    }

    if (typeof element.scrollTo === 'function') {
      element.scrollTo({
        top: 0,
        left: 0,
        behavior: 'auto',
      });
      return;
    }

    element.scrollTop = 0;
  }, [onResetView, resetKey]);

  return (
    <section
      ref={panelRef}
      data-testid="design-lab-detail-panel"
      className={clsx('min-w-0 xl:max-h-[calc(100vh-14rem)] xl:overflow-y-auto xl:pr-1', className)}
    >
      {children}
    </section>
  );
};
