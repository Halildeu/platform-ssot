import type React from 'react';

export type AccessLevel = 'full' | 'readonly' | 'disabled' | 'hidden';

export type AccessControlledProps = {
  access?: AccessLevel;
  accessReason?: string;
};

export type AccessResolution = {
  state: AccessLevel;
  isHidden: boolean;
  isReadonly: boolean;
  isDisabled: boolean;
};

export const resolveAccessState = (access?: AccessLevel): AccessResolution => {
  const state: AccessLevel = access ?? 'full';
  return {
    state,
    isHidden: state === 'hidden',
    isReadonly: state === 'readonly',
    isDisabled: state === 'disabled',
  };
};

export const shouldBlockInteraction = (state: AccessLevel, externallyDisabled?: boolean) => {
  if (externallyDisabled) {
    return true;
  }
  return state === 'readonly' || state === 'disabled';
};

export const withAccessGuard = <
  E extends React.SyntheticEvent,
  Handler extends (event: E) => void | Promise<void>,
>(
  state: AccessLevel,
  handler?: Handler,
  externallyDisabled?: boolean,
) => {
  return (event: E) => {
    if (shouldBlockInteraction(state, externallyDisabled)) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    handler?.(event);
  };
};
