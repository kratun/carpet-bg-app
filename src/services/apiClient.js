export async function apiFetch(
  endpoint,
  { method = "GET", headers = {}, body, params } = {}
) {
  const BASE_URL = import.meta.env.VITE_API_URL || "https://localhost:7176";

  let url = `${BASE_URL}/api${endpoint}`;
  if (params) {
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => query.append(key, v));
      } else if (value !== undefined && value !== null) {
        query.append(key, value);
      }
    });

    const queryParams = query.toString();

    url += `?${queryParams}`;
  }

  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);
    const contentType = response.headers.get("Content-Type");

    if (!response.ok) {
      const errorBody = contentType?.includes("application/json")
        ? await response.json()
        : await response.text();
      throw new Error(
        typeof errorBody === "string"
          ? errorBody
          : errorBody.message || "Unknown error"
      );
    }

    return contentType?.includes("application/json")
      ? await response.json()
      : null;
  } catch (error) {
    console.error("API error:", error);
    throw error;
  }
}

apiFetch.get = (endpoint, options = {}) =>
  apiFetch(endpoint, { ...options, method: "GET" });
apiFetch.post = (endpoint, options = {}) =>
  apiFetch(endpoint, { ...options, method: "POST" });
apiFetch.put = (endpoint, options = {}) =>
  apiFetch(endpoint, { ...options, method: "PUT" });
apiFetch.delete = (endpoint, options = {}) =>
  apiFetch(endpoint, { ...options, method: "DELETE" });
