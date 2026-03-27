export declare const fontFamily: {
    readonly sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    readonly mono: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace";
};
export declare const fontSize: {
    readonly xs: "0.75rem";
    readonly sm: "0.875rem";
    readonly base: "1rem";
    readonly lg: "1.125rem";
    readonly xl: "1.25rem";
    readonly "2xl": "1.5rem";
    readonly "3xl": "1.875rem";
    readonly "4xl": "2.25rem";
};
export declare const fontWeight: {
    readonly normal: 400;
    readonly medium: 500;
    readonly semibold: 600;
    readonly bold: 700;
};
export declare const lineHeight: {
    readonly tight: 1.25;
    readonly snug: 1.375;
    readonly normal: 1.5;
    readonly relaxed: 1.625;
    readonly loose: 2;
};
export declare const letterSpacing: {
    readonly tighter: "-0.05em";
    readonly tight: "-0.025em";
    readonly normal: "0em";
    readonly wide: "0.025em";
    readonly wider: "0.05em";
    readonly widest: "0.1em";
};
export type FontSizeKey = keyof typeof fontSize;
export type FontWeightKey = keyof typeof fontWeight;
