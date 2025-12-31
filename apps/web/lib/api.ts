import { getToken, getTenantId } from "./auth";

export async function apiFetch(
  path: string,
  options: RequestInit = {}
) {
  const token = getToken();
  const tenantId = getTenantId();

  // Don't add tenant header for auth endpoints
  const isAuthEndpoint = path.startsWith("/auth/");

  const apiBase = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3000";
  const url = `${apiBase}${path}`;
  
  console.log("🚀 API Fetch:", url);
  console.log("📦 API Base:", apiBase);
  console.log("📝 Options:", options);

  const res = await fetch(
    url,
    {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(!isAuthEndpoint && tenantId ? { "X-Tenant-Id": tenantId } : {}),
      },
    }
  );

  console.log("✅ Response status:", res.status);

  if (!res.ok) {
    const text = await res.text();
    console.error("❌ API Error:", text);
    throw new Error(text || "API request failed");
  }

  const data = await res.json();
  console.log("✅ Response data:", data);
  return data;
}
