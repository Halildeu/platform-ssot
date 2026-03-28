export type ThemeContract = {
    version: string;
    defaultMode: string;
    allowedModes?: string[];
    modes: Record<string, {
        label?: string;
        appearance?: string;
        isHighContrast?: boolean;
    }>;
    aliases?: {
        appearance?: Record<string, string>;
        density?: Record<string, string>;
    };
    coerce?: Array<{
        when: Partial<{
            appearance: string;
            density: string;
        }>;
        mode: string;
    }>;
};
export declare const getThemeContract: () => ThemeContract;
export declare const resolveThemeModeKey: (axes?: {
    appearance?: unknown;
    density?: unknown;
    modeKey?: unknown;
}) => string;
