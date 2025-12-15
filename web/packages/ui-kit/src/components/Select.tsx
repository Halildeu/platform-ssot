import React from 'react';
import {
  resolveAccessState,
  withAccessGuard,
  type AccessControlledProps,
  type AccessLevel,
} from '../runtime/access-controller';

type Option = {
  label: string;
  value: string;
  disabled?: boolean;
};

export type SelectProps = {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
} & AccessControlledProps;

export const Select: React.FC<SelectProps> = ({
  id,
  value,
  onChange,
  options,
  placeholder,
  disabled = false,
  className = '',
  access = 'full',
  accessReason,
}) => {
  const accessState = resolveAccessState(access);
  if (accessState.isHidden) {
    return null;
  }
  const isReadonly = accessState.isReadonly;
  const resolvedDisabled = disabled || accessState.isDisabled;
  const interactionState: AccessLevel = resolvedDisabled
    ? 'disabled'
    : isReadonly
      ? 'readonly'
      : accessState.state;
  const handleChange = withAccessGuard<React.ChangeEvent<HTMLSelectElement>>(
    interactionState,
    (event) => onChange(event.target.value),
    resolvedDisabled,
  );
  return (
    <select
      id={id}
      value={value}
      disabled={resolvedDisabled || isReadonly}
      aria-readonly={isReadonly || undefined}
      aria-disabled={resolvedDisabled || isReadonly || undefined}
      onChange={handleChange}
      data-access-state={accessState.state}
      title={accessReason}
      className={`h-9 rounded-md border border-border-default bg-surface-panel px-3 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-[var(--accent-focus)] focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      style={{
        color: 'var(--text-primary)',
        backgroundColor: 'var(--surface-panel-bg)',
        borderColor: 'var(--border-default)',
      }}
    >
      {placeholder ? (
        <option value="" disabled hidden>
          {placeholder}
        </option>
      ) : null}
      {options.map((option) => (
        <option key={option.value} value={option.value} disabled={option.disabled}>
          {option.label}
        </option>
      ))}
    </select>
  );
};
