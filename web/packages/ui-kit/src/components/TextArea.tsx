import React from 'react';
import {
  resolveAccessState,
  withAccessGuard,
  type AccessControlledProps,
  type AccessLevel,
} from '../runtime/access-controller';
import {
  FieldControlShell,
  buildDescribedBy,
  getFieldFrameClass,
  getFieldInputClass,
  getFieldSlotClass,
  getFieldTone,
  type FieldSize,
} from './FieldControlPrimitives';

export type TextAreaResize = 'vertical' | 'none' | 'auto';

export interface TextAreaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange' | 'children'>,
    AccessControlledProps {
  label?: React.ReactNode;
  description?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  invalid?: boolean;
  size?: FieldSize;
  leadingVisual?: React.ReactNode;
  trailingVisual?: React.ReactNode;
  onValueChange?: (value: string, event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  showCount?: boolean;
  fullWidth?: boolean;
  resize?: TextAreaResize;
}

const getInitialValue = (value?: string | readonly string[], defaultValue?: string | readonly string[]) => {
  if (value !== undefined && value !== null) return String(value);
  if (defaultValue !== undefined && defaultValue !== null) return String(defaultValue);
  return '';
};

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
  {
    id,
    value,
    defaultValue,
    label,
    description,
    hint,
    error,
    invalid = false,
    size = 'md',
    leadingVisual,
    trailingVisual,
    onChange,
    onValueChange,
    disabled = false,
    readOnly = false,
    required = false,
    maxLength,
    showCount = false,
    className,
    fullWidth = true,
    access = 'full',
    accessReason,
    rows = 4,
    resize = 'vertical',
    style,
    ...props
  },
  forwardedRef,
) {
  const accessState = resolveAccessState(access);
  const generatedId = React.useId();
  const inputId = id ?? `text-area-${generatedId}`;
  const descriptionId = description ? `${inputId}-description` : undefined;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const countId = showCount || maxLength !== undefined ? `${inputId}-count` : undefined;
  const describedBy = buildDescribedBy(descriptionId, error ? errorId : hintId, countId);
  const [internalValue, setInternalValue] = React.useState(() => getInitialValue(undefined, defaultValue));
  const isControlled = value !== undefined;
  const currentValue = isControlled ? getInitialValue(value, undefined) : internalValue;
  const isReadonly = readOnly || accessState.isReadonly;
  const resolvedDisabled = disabled || accessState.isDisabled;
  const interactionState: AccessLevel = resolvedDisabled
    ? 'disabled'
    : isReadonly
      ? 'readonly'
      : accessState.state;
  const tone = getFieldTone({
    invalid: invalid || Boolean(error),
    disabled: resolvedDisabled,
    readonly: isReadonly,
  });
  const countLabel =
    showCount || maxLength !== undefined
      ? `${currentValue.length}${maxLength !== undefined ? ` / ${maxLength}` : ''}`
      : undefined;

  const localRef = React.useRef<HTMLTextAreaElement | null>(null);
  const assignRef = (node: HTMLTextAreaElement | null) => {
    localRef.current = node;
    if (typeof forwardedRef === 'function') {
      forwardedRef(node);
    } else if (forwardedRef) {
      forwardedRef.current = node;
    }
  };

  React.useEffect(() => {
    if (resize !== 'auto' || !localRef.current) {
      return;
    }
    const node = localRef.current;
    node.style.height = '0px';
    node.style.height = `${Math.max(node.scrollHeight, rows * 24)}px`;
  }, [currentValue, resize, rows]);

  const handleChange = withAccessGuard<React.ChangeEvent<HTMLTextAreaElement>>(
    interactionState,
    (event) => {
      if (!isControlled) {
        setInternalValue(event.target.value);
      }
      onChange?.(event);
      onValueChange?.(event.target.value, event);
    },
    resolvedDisabled,
  );

  if (accessState.isHidden) {
    return null;
  }

  return (
    <FieldControlShell
      inputId={inputId}
      label={label}
      description={
        description ? (
          <span id={descriptionId}>
            {description}
          </span>
        ) : undefined
      }
      hint={
        !error && hint ? (
          <span id={hintId}>
            {hint}
          </span>
        ) : undefined
      }
      error={
        error ? (
          <span id={errorId}>
            {error}
          </span>
        ) : undefined
      }
      countLabel={countLabel}
      required={required}
      fullWidth={fullWidth}
    >
      <div
        className={getFieldFrameClass(size, tone, fullWidth, className)}
        data-access-state={accessState.state}
        data-field-tone={tone}
        data-size={size}
        data-field-type="text-area"
        title={accessReason}
      >
        {leadingVisual ? <span className={getFieldSlotClass(size)}>{leadingVisual}</span> : null}
        <textarea
          {...props}
          ref={assignRef}
          id={inputId}
          value={currentValue}
          disabled={resolvedDisabled}
          readOnly={isReadonly}
          required={required}
          rows={rows}
          maxLength={maxLength}
          aria-invalid={invalid || Boolean(error) || undefined}
          aria-readonly={isReadonly || undefined}
          aria-disabled={resolvedDisabled || isReadonly || undefined}
          aria-describedby={describedBy}
          data-resize={resize}
          className={getFieldInputClass(size, 'resize-none leading-7')}
          onChange={handleChange}
          style={{
            ...style,
            resize: resize === 'auto' ? 'none' : resize,
            minHeight: `${rows * 1.5}rem`,
          }}
        />
        {trailingVisual ? <span className={getFieldSlotClass(size)}>{trailingVisual}</span> : null}
      </div>
      {countId ? (
        <span id={countId} className="sr-only">
          {countLabel}
        </span>
      ) : null}
    </FieldControlShell>
  );
});

export default TextArea;
