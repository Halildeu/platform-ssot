export declare const contrastRatio: {
    readonly standard: {
        /** No adjustment — uses default palette values */
        readonly borderAlpha: 1;
        readonly textAlpha: 1;
        /** Minimum contrast ratio target (informational) */
        readonly minContrastText: 4.5;
        readonly minContrastLargeText: 3;
        readonly minContrastUI: 3;
    };
    readonly aa: {
        /** WCAG 2.1 AA — enhanced border visibility */
        readonly borderAlpha: 1.15;
        readonly textAlpha: 1.1;
        readonly minContrastText: 4.5;
        readonly minContrastLargeText: 3;
        readonly minContrastUI: 3;
    };
    readonly aaa: {
        /** WCAG 2.1 AAA — maximum contrast for low-vision users */
        readonly borderAlpha: 1.4;
        readonly textAlpha: 1.25;
        readonly minContrastText: 7;
        readonly minContrastLargeText: 4.5;
        readonly minContrastUI: 4.5;
    };
};
export type ContrastRatioMode = keyof typeof contrastRatio;
