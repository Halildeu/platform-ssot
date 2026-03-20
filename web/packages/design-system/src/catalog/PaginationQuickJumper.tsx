import React from 'react';
import { Button } from '../primitives/button';
import { Text } from '../primitives/text';
import { TextInput } from '../primitives/input';
import {
  resolveAccessState,
  type AccessControlledProps,
} from '../internal/access-controller';

export type PaginationQuickJumperProps = AccessControlledProps & {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  inputClassName?: string;
  inputAriaLabel?: string;
  showButton?: boolean;
  buttonLabel?: string;
  prefixLabel?: React.ReactNode;
  suffixLabel?: React.ReactNode;
};

const normalizeQuickJumpValue = (value: string, totalPages: number) => {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) {
    return null;
  }
  return Math.min(Math.max(1, parsed), Math.max(1, totalPages));
};

export const PaginationQuickJumper: React.FC<PaginationQuickJumperProps> = ({
  page,
  totalPages,
  onPageChange,
  className,
  inputClassName,
  inputAriaLabel = 'Jump to page',
  showButton = false,
  buttonLabel = 'Go',
  prefixLabel = 'Go to',
  suffixLabel = 'Page',
  access = 'full',
  accessReason,
}) => {
  const accessState = resolveAccessState(access);
  const [inputValue, setInputValue] = React.useState(String(page));

  if (accessState.isHidden) {
    return null;
  }

  React.useEffect(() => {
    setInputValue(String(page));
  }, [page]);

  const commitValue = React.useCallback(() => {
    const normalizedValue = normalizeQuickJumpValue(inputValue, totalPages);
    if (normalizedValue === null) {
      setInputValue(String(page));
      return;
    }

    onPageChange(normalizedValue);
  }, [inputValue, onPageChange, page, totalPages]);

  return (
    <div className={['flex items-center gap-3', className ?? ''].join(' ').trim()}>
      {prefixLabel ? <Text variant="secondary">{prefixLabel}</Text> : null}
      <TextInput
        label={undefined}
        aria-label={inputAriaLabel}
        value={inputValue}
        onValueChange={(value) => setInputValue(value)}
        inputMode="numeric"
        fullWidth={false}
        className={['w-24', inputClassName ?? ''].join(' ').trim()}
        access={accessState.state}
        accessReason={accessReason}
        onBlur={() => {
          if (!showButton) {
            commitValue();
          }
        }}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            commitValue();
          }
        }}
      />
      {suffixLabel ? <Text variant="secondary">{suffixLabel}</Text> : null}
      {showButton ? (
        <Button
          variant="secondary"
          onClick={() => commitValue()}
          access={accessState.state}
          accessReason={accessReason}
        >
          {buttonLabel}
        </Button>
      ) : null}
    </div>
  );
};

export default PaginationQuickJumper;
