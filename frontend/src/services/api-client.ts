export const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000").replace(/\/+$/, "");

export type ApiErrorKind = "network" | "http" | "invalid-response";

export class ApiError extends Error {
  readonly status: number;
  readonly kind: ApiErrorKind;

  constructor(message: string, status: number, kind: ApiErrorKind) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.kind = kind;
  }

  get isBackendDown() {
    return this.kind === "network";
  }
}

interface RequestOptions {
  method?: "GET" | "POST";
  body?: unknown;
  signal?: AbortSignal;
}

function extractDetail(payload: unknown): string | null {
  if (payload && typeof payload === "object" && "detail" in payload) {
    const detail = (payload as { detail: unknown }).detail;
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail)) return "The backend rejected the request payload.";
  }
  return null;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, signal } = options;

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      signal,
      cache: "no-store",
      headers: body !== undefined ? { "Content-Type": "application/json" } : undefined,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") throw error;
    throw new ApiError(`Unable to reach the arbitration backend at ${API_BASE_URL}.`, 0, "network");
  }

  const payload: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const detail = extractDetail(payload);
    const fallback =
      response.status >= 500
        ? `The backend encountered an internal error (HTTP ${response.status}).`
        : `Request to ${path} failed with HTTP ${response.status}.`;
    throw new ApiError(detail ?? fallback, response.status, "http");
  }

  if (payload === null) {
    throw new ApiError(`The backend returned an empty or non-JSON response for ${path}.`, response.status, "invalid-response");
  }

  return payload as T;
}
