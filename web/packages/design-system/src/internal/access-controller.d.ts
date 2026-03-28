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
export declare const resolveAccessState: (access?: AccessLevel) => AccessResolution;
export declare const shouldBlockInteraction: (state: AccessLevel, externallyDisabled?: boolean) => boolean;
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
export declare function accessStyles(access: AccessLevel): string;
export declare const withAccessGuard: <E extends React.SyntheticEvent = React.SyntheticEvent>(state: AccessLevel, handler?: ((event: E) => void | Promise<void>) | (() => void | Promise<void>), externallyDisabled?: boolean) => (event: E) => void;
