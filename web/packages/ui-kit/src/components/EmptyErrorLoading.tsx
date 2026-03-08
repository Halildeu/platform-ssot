import React from 'react';
import { Button } from './Button';
import { Empty } from './Empty';
import { Skeleton } from './Skeleton';
import { Spinner } from './Spinner';
import { Text } from './Text';
import { resolveAccessState, type AccessControlledProps } from '../runtime/access-controller';

export type EmptyErrorLoadingMode = 'empty' | 'error' | 'loading';

export interface EmptyErrorLoadingProps extends AccessControlledProps {
  mode: EmptyErrorLoadingMode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  errorLabel?: React.ReactNode;
  retryLabel?: string;
  onRetry?: () => void;
  loadingLabel?: string;
  showSkeleton?: boolean;
  className?: string;
}

export const EmptyErrorLoading: React.FC<EmptyErrorLoadingProps> = ({
  mode,
  title = 'State recipe',
  description = 'Bos, hata ve loading halleri ayni feedback diliyle tekrar kullanilir.',
  errorLabel = 'Bir seyler ters gitti. Kanit setini ve upstream baglantilarini kontrol et.',
  retryLabel = 'Tekrar dene',
  onRetry,
  loadingLabel = 'Yukleniyor',
  showSkeleton = true,
  className = '',
  access = 'full',
  accessReason,
}) => {
  const accessState = resolveAccessState(access);
  if (accessState.isHidden) {
    return null;
  }

  return (
    <section
      className={`rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm ${className}`.trim()}
      data-access-state={accessState.state}
      data-component="empty-error-loading"
      data-mode={mode}
      title={accessReason}
    >
      <Text as="div" className="text-base font-semibold text-text-primary">
        {title}
      </Text>
      <Text variant="secondary" className="mt-1 block text-sm leading-6">
        {description}
      </Text>

      <div className="mt-4 rounded-[24px] border border-border-subtle bg-surface-default p-4">
        {mode === 'loading' ? (
          <div className="space-y-4">
            <Spinner mode="block" label={loadingLabel} />
            {showSkeleton ? (
              <div className="grid grid-cols-1 gap-3">
                <Skeleton variant="text" lines={2} />
                <Skeleton variant="rect" className="h-28" />
                <Skeleton variant="table-row" />
              </div>
            ) : null}
          </div>
        ) : mode === 'error' ? (
          <div className="space-y-4">
            <Empty description={typeof errorLabel === 'string' ? errorLabel : 'Hata olustu'} />
            {onRetry ? (
              <div className="flex justify-center">
                <Button fullWidth={false} variant="secondary" onClick={onRetry} access={access}>
                  {retryLabel}
                </Button>
              </div>
            ) : null}
          </div>
        ) : (
          <Empty description="Bu recipe icin gosterilecek veri bulunamadi." />
        )}
      </div>
    </section>
  );
};

export default EmptyErrorLoading;
