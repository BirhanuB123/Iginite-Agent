import { getToken, getTenantId } from "./auth";

export async function apiFetch(
  path: string,
  options: RequestInit = {}
) {
  const token = getToken();
  const tenantId = getTenantId();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE}${path}`,
    {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(tenantId ? { "X-Tenant-Id": tenantId } : {}),
      },
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "API request failed");
  }

  return res.json();
}
