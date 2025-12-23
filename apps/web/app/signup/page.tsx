"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "../../lib/api";
import { setSession } from "../../lib/auth";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    companyName: "",
    adminName: "",
    adminEmail: "",
    password: "",
  });
  const [error, setError] = useState("");

  const submit = async () => {
    setError("");
    try {
      const res = await apiFetch("/tenants/signup", {
        method: "POST",
        body: JSON.stringify(form),
      });

      setSession(res.accessToken, res.tenantId);
      router.push("/dashboard");
    } catch (e: any) {
      setError(e.message || "Signup failed");
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Create Your Tenant</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {Object.keys(form).map((k) => (
        <input
          key={k}
          placeholder={k}
          type={k === "password" ? "password" : "text"}
          value={(form as any)[k]}
          onChange={(e) =>
            setForm({ ...form, [k]: e.target.value })
          }
          style={{ display: "block", marginBottom: 10 }}
        />
      ))}

      <button onClick={submit}>Create Account</button>
    </div>
  );
}
