import type React from "react";

export type AccessLevel = "full" | "readonly" | "disabled" | "hidden";

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
  const state: AccessLevel = access ?? "full";
  return {
    state,
    isHidden: state === "hidden",
    isReadonly: state === "readonly",
    isDisabled: state === "disabled",
  };
};

export const shouldBlockInteraction = (
  state: AccessLevel,
  externallyDisabled?: boolean,
) => {
  if (externallyDisabled) {
    return true;
  }
  return state === "readonly" || state === "disabled";
};

/**
 * Returns Tailwind utility class strings for a given access level.
 *
 * @example
 * ```tsx
 * <div className={cn("...", accessStyles(access))}>
 *   Content
 * </div>
 * ```
 */
export function accessStyles(access: AccessLevel): string {
  switch (access) {
    case "disabled":
      return "cursor-not-allowed opacity-50 pointer-events-none";
    case "readonly":
      return "cursor-default opacity-70";
    case "hidden":
      return "invisible";
    default:
      return "";
  }
}

/** @deprecated Use `accessStyles` instead. */
export const _accessStyles = accessStyles;

/** @deprecated Use `AccessControlledProps` instead. */
export type _AccessControlledProps = AccessControlledProps;

export const withAccessGuard = <
  E extends React.SyntheticEvent = React.SyntheticEvent,
>(
  state: AccessLevel,
  handler?: ((event: E) => void | Promise<void>) | (() => void | Promise<void>),
  externallyDisabled?: boolean,
) => {
  return (event: E) => {
    if (shouldBlockInteraction(state, externallyDisabled)) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    (handler as ((event: E) => void | Promise<void>) | undefined)?.(event);
  };
};
