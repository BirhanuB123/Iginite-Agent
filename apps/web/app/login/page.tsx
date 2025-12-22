"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setSession } from "../../lib/auth";
import { apiFetch } from "../../lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

const login = async () => {
  setError("");
  try {
    const res = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
        tenantId: "00000000-0000-0000-0000-000000000001",
      }),
    });

    setSession(res.accessToken, res.tenantId);
    router.push("/dashboard");
  } catch (e: any) {
    setError(e.message || "Login failed");
  }
};

  return (
    <div style={{ padding: 40 }}>
      <h1>Ignite-Agent Login</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ display: "block", marginBottom: 10 }}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ display: "block", marginBottom: 10 }}
      />

      <button onClick={login}>Login</button>
    </div>
  );
}
