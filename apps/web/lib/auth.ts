// apps/web/lib/auth.ts

export function setSession(token: string, tenantId: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem("adwa_token", token);
  localStorage.setItem("adwa_tenant_id", tenantId);
}

export function clearSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("adwa_token");
  localStorage.removeItem("adwa_tenant_id");
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("adwa_token");
}

export function getTenantId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("adwa_tenant_id");
}

export function isAuthenticated(): boolean {
  return !!getToken() && !!getTenantId();
}
