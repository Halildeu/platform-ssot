export type TokenResolver = () => string | null;
export declare const getResolvedToken: () => string | null;
export declare const registerTokenResolver: (resolver?: TokenResolver | null) => void;
export declare const resetTokenResolver: () => void;
export declare const buildAuthHeaders: () => Record<string, string>;
