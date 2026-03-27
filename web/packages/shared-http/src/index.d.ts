import { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
export * from './telemetryClient';
type AuthMode = 'keycloak' | 'permitAll';
type TokenResolver = () => string | null;
type TraceIdResolver = () => string | null;
type UnauthorizedHandler = (error: AxiosError) => void;
export declare const registerAuthTokenResolver: (resolver?: TokenResolver) => void;
export declare const registerTraceIdResolver: (resolver?: TraceIdResolver) => void;
export declare const registerUnauthorizedHandler: (handler?: UnauthorizedHandler) => void;
export declare const configureSharedHttp: (config?: {
    authMode?: AuthMode;
}) => void;
declare const api: AxiosInstance;
export declare const resolveAuthToken: () => string | null;
export declare const resolveTraceId: () => string | null;
export declare const getGatewayBaseUrl: () => string;
export declare const conditionalGet: <T>(url: string, config?: AxiosRequestConfig & {
    etag?: string;
}) => Promise<import("axios").AxiosResponse<T, any, {}>>;
export { api };
export type ApiInstance = typeof api;
export { fetchManifest, fetchPageLayout } from './manifest';
