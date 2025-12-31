"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await apiFetch("/tenants/signup", {
        method: "POST",
        body: JSON.stringify(form),
      });

      setSession(res.accessToken, res.tenantId);
      router.push("/dashboard");
    } catch (e: any) {
      setError(e.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const fieldLabels: Record<string, string> = {
    companyName: "Company Name",
    adminName: "Admin Name",
    adminEmail: "Admin Email",
    password: "Password"
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: `
        linear-gradient(135deg, rgba(15, 12, 41, 0.95) 0%, rgba(48, 43, 99, 0.95) 50%, rgba(36, 36, 62, 0.95) 100%),
        repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(99, 102, 241, 0.03) 2px, rgba(99, 102, 241, 0.03) 4px),
        repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(139, 92, 246, 0.03) 2px, rgba(139, 92, 246, 0.03) 4px),
        radial-gradient(circle at 20% 30%, rgba(99, 102, 241, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 70%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)
      `,
      backgroundSize: "100% 100%, 50px 50px, 50px 50px, 100% 100%, 100% 100%",
      padding: "20px",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Launch Pad Pattern Background */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `
          radial-gradient(circle at 25% 40%, rgba(99, 102, 241, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 75% 60%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
          linear-gradient(30deg, transparent 48%, rgba(99, 102, 241, 0.02) 48%, rgba(99, 102, 241, 0.02) 52%, transparent 52%),
          linear-gradient(150deg, transparent 48%, rgba(139, 92, 246, 0.02) 48%, rgba(139, 92, 246, 0.02) 52%, transparent 52%)
        `,
        backgroundSize: "100% 100%, 100% 100%, 60px 105px, 60px 105px",
        opacity: 0.6
      }} />
      
      {/* Animated Rocket Trail Elements */}
      <div style={{
        position: "absolute",
        top: "10%",
        left: "10%",
        width: "300px",
        height: "300px",
        background: "radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, transparent 70%)",
        borderRadius: "50%",
        filter: "blur(60px)",
        animation: "float 6s ease-in-out infinite"
      }} />
      <div style={{
        position: "absolute",
        bottom: "10%",
        right: "10%",
        width: "400px",
        height: "400px",
        background: "radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)",
        borderRadius: "50%",
        filter: "blur(80px)",
        animation: "float 8s ease-in-out infinite reverse"
      }} />
      
      {/* Tech Grid Pattern */}
      <div style={{
        position: "absolute",
        bottom: "5%",
        left: "5%",
        width: "180px",
        height: "180px",
        background: `
          repeating-linear-gradient(0deg, transparent, transparent 10px, rgba(99, 102, 241, 0.08) 10px, rgba(99, 102, 241, 0.08) 11px),
          repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(139, 92, 246, 0.08) 10px, rgba(139, 92, 246, 0.08) 11px)
        `,
        opacity: 0.3,
        animation: "float 14s ease-in-out infinite"
      }} />
      
      {/* Signup Card */}
      <div style={{
        background: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        padding: "50px 40px",
        borderRadius: "24px",
        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37), inset 0 0 0 1px rgba(255, 255, 255, 0.1)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        width: "100%",
        maxWidth: "480px",
        position: "relative",
        zIndex: 1
      }}>
        {/* Logo/Icon */}
        <div style={{
          textAlign: "center",
          marginBottom: "30px"
        }}>
          <div style={{
            display: "inline-block",
            padding: "20px",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            borderRadius: "20px",
            boxShadow: "0 8px 24px rgba(102, 126, 234, 0.4)",
            marginBottom: "20px"
          }}>
            <span style={{ fontSize: "48px" }}>🚀</span>
          </div>
          <h1 style={{
            fontSize: "32px",
            fontWeight: "700",
            marginBottom: "8px",
            background: "linear-gradient(135deg, #667eea 0%, #b39ddb 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text"
          }}>Create Your Tenant</h1>
          <p style={{
            color: "rgba(255, 255, 255, 0.7)",
            fontSize: "16px",
            marginBottom: "0"
          }}>Start building with <strong style={{ color: "rgba(255, 255, 255, 0.9)" }}>Adwa-Agent</strong></p>
        </div>

        {error && (
          <div style={{
            background: "rgba(239, 68, 68, 0.15)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            color: "#fca5a5",
            padding: "14px 16px",
            borderRadius: "12px",
            marginBottom: "24px",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}>
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={submit}>
          {Object.keys(form).map((k) => (
            <div key={k} style={{ marginBottom: "20px" }}>
              <label style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "600",
                marginBottom: "8px",
                color: "rgba(255, 255, 255, 0.9)",
                letterSpacing: "0.5px"
              }}>
                {fieldLabels[k]}
              </label>
              <input
                type={k === "password" ? "password" : k === "adminEmail" ? "email" : "text"}
                placeholder={`Enter ${fieldLabels[k].toLowerCase()}`}
                value={(form as any)[k]}
                onChange={(e) =>
                  setForm({ ...form, [k]: e.target.value })
                }
                required
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  background: "rgba(255, 255, 255, 0.08)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  borderRadius: "12px",
                  fontSize: "16px",
                  boxSizing: "border-box",
                  color: "white",
                  outline: "none",
                  transition: "all 0.3s ease"
                }}
                onFocus={(e) => {
                  e.target.style.background = "rgba(255, 255, 255, 0.12)";
                  e.target.style.border = "1px solid rgba(102, 126, 234, 0.5)";
                  e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.background = "rgba(255, 255, 255, 0.08)";
                  e.target.style.border = "1px solid rgba(255, 255, 255, 0.15)";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              background: loading ? "rgba(156, 163, 175, 0.3)" : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              border: "none",
              borderRadius: "12px",
              fontSize: "16px",
              fontWeight: "700",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.3s ease",
              boxShadow: loading ? "none" : "0 4px 20px rgba(102, 126, 234, 0.4)",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
              marginTop: "8px"
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 6px 28px rgba(102, 126, 234, 0.5)";
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 20px rgba(102, 126, 234, 0.4)";
              }
            }}
          >
            {loading ? (
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                <span style={{ 
                  width: "16px", 
                  height: "16px", 
                  border: "2px solid rgba(255,255,255,0.3)",
                  borderTop: "2px solid white",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite"
                }}></span>
                Creating Account...
              </span>
            ) : "Create Account"}
          </button>
        </form>

        <div style={{
          marginTop: "28px",
          textAlign: "center",
          padding: "18px 20px",
          background: "rgba(255, 255, 255, 0.03)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "12px"
        }}>
          <p style={{
            fontSize: "14px",
            color: "rgba(255, 255, 255, 0.6)",
            margin: 0
          }}>
            Already have an account?{" "}
            <Link href="/login" style={{
              color: "rgba(102, 126, 234, 0.9)",
              textDecoration: "none",
              fontWeight: "600",
              transition: "all 0.3s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "rgba(139, 92, 246, 0.9)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "rgba(102, 126, 234, 0.9)";
            }}
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(20px, 20px); }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
