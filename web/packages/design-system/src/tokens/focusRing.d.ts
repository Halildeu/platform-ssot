export declare const focusRing: {
    readonly width: 2;
    readonly offset: 2;
    readonly color: "var(--focus-ring, var(--focus-outline, var(--accent-primary)))";
    readonly style: "solid";
    readonly class: "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[color-mix(in_oklab,var(--focus-ring)_30%,transparent)] focus-visible:ring-offset-2";
};
export type FocusRingKey = keyof typeof focusRing;
