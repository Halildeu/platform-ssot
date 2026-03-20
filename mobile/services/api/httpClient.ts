import { Platform } from "react-native";

type RequestOptions = Omit<RequestInit, "body" | "headers"> & {
  body?: BodyInit | null;
  headers?: HeadersInit;
  token?: string | null;
};

type JsonPrimitive = boolean | number | string | null;
type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };

type ApiError = Error & {
  code?: string;
  status?: number;
};

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, "");
const trimLeadingSlash = (value: string) => value.replace(/^\/+/, "");

const getEnvValue = (key: string): string | undefined => {
  if (typeof process !== "undefined" && typeof process.env?.[key] === "string") {
    return process.env[key];
  }

  if (typeof window !== "undefined") {
    const runtimeEnv = window as Window & {
      __env__?: Record<string, string | undefined>;
      __ENV__?: Record<string, string | undefined>;
    };
    const candidate = runtimeEnv.__env__?.[key] ?? runtimeEnv.__ENV__?.[key];
    if (typeof candidate === "string") {
      return candidate;
    }
  }

  return undefined;
};

export function resolveGatewayBaseUrl() {
  const fromEnv =
    getEnvValue("EXPO_PUBLIC_GATEWAY_URL") ??
    getEnvValue("GATEWAY_URL") ??
    getEnvValue("VITE_GATEWAY_URL");

  if (fromEnv) {
    return trimTrailingSlash(fromEnv);
  }

  if (Platform.OS === "web") {
    if (typeof window !== "undefined" && window.location?.hostname) {
      const protocol = window.location.protocol || "http:";
      const hostname = window.location.hostname;
      return `${protocol}//${hostname}:8080/api`;
    }
    return "http://127.0.0.1:8080/api";
  }

  if (Platform.OS === "android") {
    return "http://10.0.2.2:8080/api";
  }

  return "http://127.0.0.1:8080/api";
}

function buildRequestUrl(path: string) {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  return `${trimTrailingSlash(resolveGatewayBaseUrl())}/${trimLeadingSlash(path)}`;
}

async function buildRequestError(response: Response): Promise<ApiError> {
  let message = `Request failed: ${response.status}`;
  let code: string | undefined;

  try {
    const payload = (await response.json()) as Record<string, unknown>;
    if (typeof payload.message === "string" && payload.message.trim()) {
      message = payload.message;
    }
    if (typeof payload.error === "string" && payload.error.trim()) {
      code = payload.error;
    }
  } catch {
    // Ignore unparseable error bodies.
  }

  const error = new Error(message) as ApiError;
  error.code = code;
  error.status = response.status;
  return error;
}

export async function apiRequest(path: string, options: RequestOptions = {}) {
  const { body, headers: incomingHeaders, token, ...fetchOptions } = options;
  const headers = new Headers(incomingHeaders);

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (body && !(body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(buildRequestUrl(path), {
    ...fetchOptions,
    body: body ?? null,
    headers,
  });

  if (!response.ok) {
    throw await buildRequestError(response);
  }

  return response;
}

export async function apiJsonRequest<T>(path: string, options: RequestOptions = {}) {
  const response = await apiRequest(path, options);

  if (response.status === 204) {
    return null as T;
  }

  return (await response.json()) as T;
}

export function jsonBody(payload: Record<string, JsonValue>) {
  return JSON.stringify(payload);
}
