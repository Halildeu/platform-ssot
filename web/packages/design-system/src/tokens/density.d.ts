export declare const density: {
    readonly compact: {
        readonly controlHeight: {
            readonly sm: 24;
            readonly md: 28;
            readonly lg: 32;
        };
        readonly padding: {
            readonly xs: 4;
            readonly sm: 6;
            readonly md: 8;
            readonly lg: 10;
        };
        readonly gap: {
            readonly xs: 2;
            readonly sm: 4;
            readonly md: 6;
            readonly lg: 8;
        };
        readonly fontSize: {
            readonly xs: 10;
            readonly sm: 11;
            readonly md: 12;
            readonly lg: 13;
        };
        readonly iconSize: {
            readonly sm: 12;
            readonly md: 14;
            readonly lg: 16;
        };
    };
    readonly comfortable: {
        readonly controlHeight: {
            readonly sm: 28;
            readonly md: 32;
            readonly lg: 40;
        };
        readonly padding: {
            readonly xs: 6;
            readonly sm: 8;
            readonly md: 12;
            readonly lg: 16;
        };
        readonly gap: {
            readonly xs: 4;
            readonly sm: 6;
            readonly md: 8;
            readonly lg: 12;
        };
        readonly fontSize: {
            readonly xs: 11;
            readonly sm: 12;
            readonly md: 13;
            readonly lg: 14;
        };
        readonly iconSize: {
            readonly sm: 14;
            readonly md: 16;
            readonly lg: 20;
        };
    };
    readonly spacious: {
        readonly controlHeight: {
            readonly sm: 32;
            readonly md: 40;
            readonly lg: 48;
        };
        readonly padding: {
            readonly xs: 8;
            readonly sm: 12;
            readonly md: 16;
            readonly lg: 20;
        };
        readonly gap: {
            readonly xs: 6;
            readonly sm: 8;
            readonly md: 12;
            readonly lg: 16;
        };
        readonly fontSize: {
            readonly xs: 12;
            readonly sm: 13;
            readonly md: 14;
            readonly lg: 16;
        };
        readonly iconSize: {
            readonly sm: 16;
            readonly md: 20;
            readonly lg: 24;
        };
    };
};
export type DensityMode = keyof typeof density;
