const BASE_URL = "https://bruno-backend-286108491545.europe-west4.run.app";

export class ApiClientError extends Error {
  constructor(
    public status: number,
    public body: unknown,
  ) {
    super(`API error ${status}`);
  }
}

async function request<T>(
  path: string,
  options: RequestInit & { token?: string } = {},
): Promise<T> {
  const { token, ...init } = options;

  const headers = new Headers(init.headers);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  if (!headers.has("Content-Type") && !(init.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...init, headers });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new ApiClientError(res.status, body);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export function createClient(token?: string) {
  const withToken = <T>(path: string, options: RequestInit = {}) =>
    request<T>(path, { ...options, token });

  return {
    get: <T>(path: string) => withToken<T>(path),
    post: <T>(path: string, body: unknown) =>
      withToken<T>(path, { method: "POST", body: JSON.stringify(body) }),
    postForm: <T>(path: string, form: FormData) =>
      withToken<T>(path, { method: "POST", body: form }),
    patch: <T>(path: string, body: unknown) =>
      withToken<T>(path, { method: "PATCH", body: JSON.stringify(body) }),
    delete: <T>(path: string) => withToken<T>(path, { method: "DELETE" }),
  };
}

export type ApiClient = ReturnType<typeof createClient>;
