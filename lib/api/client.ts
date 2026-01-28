import { storage } from "@/lib/storage";
import { NativeModules, Platform } from "react-native";

export class ApiError extends Error {
  status: number;
  payload: unknown;

  constructor(status: number, message: string, payload?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

export const AUTH_TOKEN_KEY = "auth.token";

export function getApiBaseUrl() {
  const raw = process.env.EXPO_PUBLIC_API_URL;
  let base = (raw?.trim() || "http://localhost:8000").replace(/\/$/, "");

  // Improve dev experience: if running on a device and base points to localhost,
  // try to derive the LAN IP from the RN dev server scriptURL.
  if (!raw && Platform.OS !== "web" && /localhost|127\.0\.0\.1/.test(base)) {
    try {
      const scriptURL: string | undefined = (NativeModules as any)?.SourceCode
        ?.scriptURL;
      // e.g. "http://192.168.0.50:8081/index.bundle?platform=android&dev=true"
      if (scriptURL) {
        const m = scriptURL.match(/^https?:\/\/([\d\.]+):\d+/);
        const ip = m?.[1];
        if (ip) {
          base = `http://${ip}:8000`;
        }
      }
    } catch {
      // ignore
    }
  }

  return base;
}

type ApiRequestOptions = RequestInit & {
  auth?: boolean;
  cacheKey?: string;
  cacheTtlSeconds?: number;
};

async function parseJsonSafe(text: string): Promise<unknown> {
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  // Basic response caching using AsyncStorage when cacheKey + cacheTtlSeconds are provided
  if (
    options.cacheKey &&
    options.cacheTtlSeconds &&
    options.method !== "POST" &&
    options.method !== "PUT" &&
    options.method !== "PATCH" &&
    options.method !== "DELETE"
  ) {
    const cachedRaw = await storage.getItem(options.cacheKey);
    if (cachedRaw) {
      try {
        const cached = JSON.parse(cachedRaw) as {
          expiresAt: number;
          value: unknown;
        };
        if (
          cached &&
          typeof cached.expiresAt === "number" &&
          cached.expiresAt > Date.now()
        ) {
          return cached.value as T;
        }
      } catch {
        // ignore cache parse errors
      }
    }
  }

  const baseUrl = getApiBaseUrl();
  const url = path.startsWith("http")
    ? path
    : `${baseUrl}${path.startsWith("/") ? "" : "/"}${path}`;

  const headers = new Headers(options.headers);

  const body = options.body as any;
  const isFormData =
    typeof FormData !== "undefined" && body instanceof FormData;

  if (!headers.has("Accept")) headers.set("Accept", "application/json");
  if (!isFormData && body != null && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (options.auth) {
    const token = await storage.getItem(AUTH_TOKEN_KEY);
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(url, {
    ...options,
    headers,
  });

  const text = await res.text();
  const payload = await parseJsonSafe(text);

  if (!res.ok) {
    const message =
      (payload && typeof payload === "object" && (payload as any).detail) ||
      res.statusText ||
      "Request failed";
    throw new ApiError(res.status, String(message), payload);
  }

  // Store successful responses in cache if requested
  if (
    options.cacheKey &&
    options.cacheTtlSeconds &&
    options.method !== "POST" &&
    options.method !== "PUT" &&
    options.method !== "PATCH" &&
    options.method !== "DELETE"
  ) {
    try {
      const entry = {
        expiresAt: Date.now() + options.cacheTtlSeconds * 1000,
        value: payload,
      };
      await storage.setItem(options.cacheKey, JSON.stringify(entry));
    } catch {
      // ignore cache set errors
    }
  }

  return payload as T;
}

export async function setAuthToken(token: string | null) {
  if (!token) {
    await storage.removeItem(AUTH_TOKEN_KEY);
    return;
  }
  await storage.setItem(AUTH_TOKEN_KEY, token);
}

export async function getAuthToken() {
  return storage.getItem(AUTH_TOKEN_KEY);
}
