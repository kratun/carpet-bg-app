/* ================================
   API CORE TYPES
================================ */

export type ApiMethod = "GET" | "POST" | "PUT" | "DELETE";

export type ApiPrimitive = string | number | boolean;
export type ApiQueryValue =
  | ApiPrimitive
  | ApiPrimitive[]
  | null
  | undefined
  | Record<string, any>;

export type ApiQueryParams = Record<string, ApiQueryValue>;

/* ================================
   FETCH OPTIONS
================================ */

export interface ApiFetchOptions<
  TBody = unknown,
  TParams extends ApiQueryParams = ApiQueryParams
> {
  method?: ApiMethod;
  headers?: Record<string, string>;
  body?: TBody;
  params?: TParams;
}

/* ================================
   QUERY STRING BUILDER (GENERIC)
================================ */

export function buildQueryParams(params: ApiQueryParams): string {
  const query = new URLSearchParams();

  const append = (key: string, value: ApiQueryValue): void => {
    if (value === undefined || value === null) return;

    // Array
    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (isPlainObject(item)) {
          Object.entries(item).forEach(([childKey, childValue]) => {
            append(`${key}[${index}].${childKey}`, childValue);
          });
        } else {
          query.append(key, String(item));
        }
      });
      return;
    }

    // Object
    if (isPlainObject(value)) {
      Object.entries(value).forEach(([childKey, childValue]) => {
        append(`${key}.${childKey}`, childValue);
      });
      return;
    }

    // Primitive
    query.append(key, String(value));
  };

  Object.entries(params).forEach(([key, value]) => append(key, value));

  const queryString = query.toString();
  return queryString ? `?${queryString}` : "";
}

function isPlainObject(value: unknown): value is Record<string, ApiQueryValue> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/* ================================
   API FETCH (GENERIC, STRONG)
================================ */

export async function apiFetch<
  TResponse,
  TBody = undefined,
  TParams extends ApiQueryParams = ApiQueryParams
>(
  endpoint: string,
  {
    method = "GET",
    headers = {},
    body,
    params,
  }: ApiFetchOptions<TBody, TParams> = {}
): Promise<TResponse> {
  const BASE_URL = import.meta.env.VITE_API_URL ?? "https://localhost:7176";
  let url = `${BASE_URL}/api${endpoint}`;

  if (params) {
    url += buildQueryParams(params);
  }

  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const contentType = response.headers.get("Content-Type");
    const errorBody = contentType?.includes("application/json")
      ? await response.json()
      : await response.text();

    throw new Error(
      typeof errorBody === "string"
        ? errorBody
        : errorBody?.message ?? "Unknown error"
    );
  }

  // 204 No Content
  if (response.status === 204) {
    return undefined as TResponse;
  }

  const contentType = response.headers.get("Content-Type");
  if (!contentType?.includes("application/json")) {
    throw new Error("Expected JSON response");
  }

  return (await response.json()) as TResponse;
}

/* ================================
   METHOD SHORTCUTS
================================ */

apiFetch.get = <TResponse, TParams extends ApiQueryParams = ApiQueryParams>(
  endpoint: string,
  options?: Omit<ApiFetchOptions<undefined, TParams>, "method">
) =>
  apiFetch<TResponse, undefined, TParams>(endpoint, {
    ...options,
    method: "GET",
  });

apiFetch.post = <
  TResponse,
  TBody,
  TParams extends ApiQueryParams = ApiQueryParams
>(
  endpoint: string,
  options?: Omit<ApiFetchOptions<TBody, TParams>, "method">
) =>
  apiFetch<TResponse, TBody, TParams>(endpoint, { ...options, method: "POST" });

apiFetch.put = <
  TResponse,
  TBody,
  TParams extends ApiQueryParams = ApiQueryParams
>(
  endpoint: string,
  options?: Omit<ApiFetchOptions<TBody, TParams>, "method">
) =>
  apiFetch<TResponse, TBody, TParams>(endpoint, { ...options, method: "PUT" });

apiFetch.delete = <TResponse, TParams extends ApiQueryParams = ApiQueryParams>(
  endpoint: string,
  options?: Omit<ApiFetchOptions<undefined, TParams>, "method">
) =>
  apiFetch<TResponse, undefined, TParams>(endpoint, {
    ...options,
    method: "DELETE",
  });
