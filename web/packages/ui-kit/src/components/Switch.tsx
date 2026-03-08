import React from 'react';
import {
  resolveAccessState,
  type AccessControlledProps,
} from '../runtime/access-controller';
import { buildDescribedBy, getFieldTone, type FieldSize } from './FieldControlPrimitives';
import {
  BooleanControlShell,
  getBooleanToggleInputClass,
  getBooleanToggleThumbClass,
  getBooleanToggleTrackClass,
} from './BooleanControlPrimitives';

export interface SwitchProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'onChange' | 'children'>,
    AccessControlledProps {
  label?: React.ReactNode;
  description?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  invalid?: boolean;
  size?: FieldSize;
  onCheckedChange?: (checked: boolean, event: React.ChangeEvent<HTMLInputElement>) => void;
  fullWidth?: boolean;
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  {
    id,
    label,
    description,
    hint,
    error,
    invalid = false,
    size = 'md',
    onChange,
    onCheckedChange,
    disabled = false,
    required = false,
    className,
    fullWidth = true,
    access = 'full',
    accessReason,
    checked,
    defaultChecked,
    onClick,
    onKeyDown,
    ...props
  },
  forwardedRef,
) {
  const accessState = resolveAccessState(access);
  const generatedId = React.useId();
  const inputId = id ?? `switch-${generatedId}`;
  const descriptionId = description ? `${inputId}-description` : undefined;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy = buildDescribedBy(descriptionId, error ? errorId : hintId);
  const isReadonly = accessState.isReadonly;
  const isDisabled = disabled || accessState.isDisabled;
  const tone = getFieldTone({ invalid: invalid || Boolean(error), disabled: isDisabled, readonly: isReadonly });

  const preventReadonlyInteraction = (event: React.SyntheticEvent<HTMLInputElement>) => {
    if (!isReadonly) return false;
    event.preventDefault();
    event.stopPropagation();
    return true;
  };

  const handleClick = (event: React.MouseEvent<HTMLInputElement>) => {
    if (preventReadonlyInteraction(event)) return;
    onClick?.(event);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (isReadonly && (event.key === ' ' || event.key === 'Enter')) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    onKeyDown?.(event);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (preventReadonlyInteraction(event)) return;
    onChange?.(event);
    onCheckedChange?.(event.target.checked, event);
  };

  if (accessState.isHidden) {
    return null;
  }

  return (
    <BooleanControlShell
      inputId={inputId}
      label={label}
      description={description}
      descriptionId={descriptionId}
      hint={hint}
      hintId={hintId}
      error={error}
      errorId={errorId}
      required={required}
      fullWidth={fullWidth}
      size={size}
      tone={tone}
      accessState={accessState.state}
      accessReason={accessReason}
      className={className}
      control={(
        <span className="relative inline-flex shrink-0 items-center">
          <input
            {...props}
            ref={forwardedRef}
            id={inputId}
            type="checkbox"
            role="switch"
            checked={checked}
            defaultChecked={defaultChecked}
            disabled={isDisabled}
            required={required}
            aria-invalid={invalid || Boolean(error) || undefined}
            aria-readonly={isReadonly || undefined}
            aria-disabled={isDisabled || isReadonly || undefined}
            aria-describedby={describedBy}
            className={getBooleanToggleInputClass(isReadonly, isDisabled)}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            onChange={handleChange}
          />
          <span
            aria-hidden="true"
            className={getBooleanToggleTrackClass(size, tone, isReadonly, isDisabled)}
          >
            <span className={getBooleanToggleThumbClass(size)} />
          </span>
        </span>
      )}
    />
  );
});

export default Switch;
