// apps/web/lib/auth.ts

export function setSession(token: string, tenantId: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem("ignite_token", token);
  localStorage.setItem("ignite_tenant_id", tenantId);
}

export function clearSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("ignite_token");
  localStorage.removeItem("ignite_tenant_id");
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("ignite_token");
}

export function getTenantId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("ignite_tenant_id");
}

export function isAuthenticated(): boolean {
  return !!getToken() && !!getTenantId();
}
