export declare const duration: {
    readonly instant: "0ms";
    readonly fast: "100ms";
    readonly normal: "200ms";
    readonly slow: "300ms";
    readonly slower: "500ms";
};
export declare const easing: {
    readonly default: "cubic-bezier(0.4, 0, 0.2, 1)";
    readonly in: "cubic-bezier(0.4, 0, 1, 1)";
    readonly out: "cubic-bezier(0, 0, 0.2, 1)";
    readonly inOut: "cubic-bezier(0.4, 0, 0.2, 1)";
    readonly spring: "cubic-bezier(0.175, 0.885, 0.32, 1.275)";
};
export type DurationKey = keyof typeof duration;
export type EasingKey = keyof typeof easing;
