"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "../../lib/api";
import { setSession } from "../../lib/auth";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("client@acme.com");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

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
      console.error("LOGIN ERROR", e);
      setError(e.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: `
        linear-gradient(135deg, #0a0e27 0%, #1a1147 30%, #2d1b69 60%, #1e3a8a 100%),
        radial-gradient(circle at 25% 35%, rgba(124, 58, 237, 0.2) 0%, transparent 50%),
        radial-gradient(circle at 75% 65%, rgba(59, 130, 246, 0.2) 0%, transparent 50%),
        repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(124, 58, 237, 0.06) 2px, rgba(124, 58, 237, 0.06) 4px),
        repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(59, 130, 246, 0.06) 2px, rgba(59, 130, 246, 0.06) 4px)
      `,
      backgroundSize: "100% 100%, 100% 100%, 100% 100%, 60px 60px, 60px 60px",
      padding: "20px",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* AI Security Matrix Background */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `
          radial-gradient(circle at 20% 50%, rgba(124, 58, 237, 0.15) 0%, transparent 50%),
          radial-gradient(circle at 80% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
          radial-gradient(circle at 40% 20%, rgba(16, 185, 129, 0.1) 0%, transparent 40%),
          radial-gradient(circle at 60% 80%, rgba(168, 85, 247, 0.1) 0%, transparent 40%)
        `,
        opacity: 0.7
      }} />
      
      {/* Animated Energy Orbs */}
      <div style={{
        position: "absolute",
        top: "12%",
        left: "12%",
        width: "400px",
        height: "400px",
        background: "radial-gradient(circle, rgba(124, 58, 237, 0.4) 0%, rgba(139, 92, 246, 0.2) 40%, transparent 70%)",
        borderRadius: "50%",
        filter: "blur(70px)",
        animation: "float 7s ease-in-out infinite"
      }} />
      <div style={{
        position: "absolute",
        bottom: "12%",
        right: "12%",
        width: "450px",
        height: "450px",
        background: "radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, rgba(37, 99, 235, 0.2) 40%, transparent 70%)",
        borderRadius: "50%",
        filter: "blur(80px)",
        animation: "float 9s ease-in-out infinite reverse"
      }} />
      
      {/* Cyber Grid Pattern */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `
          linear-gradient(45deg, transparent 47%, rgba(124, 58, 237, 0.03) 47%, rgba(124, 58, 237, 0.03) 53%, transparent 53%),
          linear-gradient(-45deg, transparent 47%, rgba(59, 130, 246, 0.03) 47%, rgba(59, 130, 246, 0.03) 53%, transparent 53%)
        `,
        backgroundSize: "80px 80px",
        opacity: 0.6
      }} />
      
      {/* Login Card */}
      <div style={{
        background: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        padding: "50px 40px",
        borderRadius: "24px",
        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37), inset 0 0 0 1px rgba(255, 255, 255, 0.1)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        width: "100%",
        maxWidth: "440px",
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
            background: "linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%)",
            borderRadius: "22px",
            boxShadow: "0 12px 32px rgba(124, 58, 237, 0.6), 0 0 40px rgba(59, 130, 246, 0.4)",
            marginBottom: "20px"
          }}>
            <span style={{ fontSize: "48px" }}>🤖</span>
          </div>
          <h1 style={{
            fontSize: "32px",
            fontWeight: "800",
            marginBottom: "8px",
            background: "linear-gradient(135deg, #a78bfa 0%, #60a5fa 50%, #34d399 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text"
          }}>Welcome Back</h1>
          <p style={{
            color: "rgba(255, 255, 255, 0.7)",
            fontSize: "16px",
            marginBottom: "0"
          }}>Sign in to <strong style={{ color: "rgba(255, 255, 255, 0.9)" }}>Adwa-Agent</strong></p>
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

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "20px" }}>
            <label style={{
              display: "block",
              fontSize: "14px",
              fontWeight: "600",
              marginBottom: "8px",
              color: "rgba(255, 255, 255, 0.9)",
              letterSpacing: "0.5px"
            }}>
              Email Address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
                e.target.style.border = "1px solid rgba(124, 58, 237, 0.6)";
                e.target.style.boxShadow = "0 0 0 3px rgba(124, 58, 237, 0.15), 0 0 20px rgba(59, 130, 246, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.background = "rgba(255, 255, 255, 0.08)";
                e.target.style.border = "1px solid rgba(255, 255, 255, 0.15)";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          <div style={{ marginBottom: "28px" }}>
            <label style={{
              display: "block",
              fontSize: "14px",
              fontWeight: "600",
              marginBottom: "8px",
              color: "rgba(255, 255, 255, 0.9)",
              letterSpacing: "0.5px"
            }}>
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
                e.target.style.border = "1px solid rgba(124, 58, 237, 0.6)";
                e.target.style.boxShadow = "0 0 0 3px rgba(124, 58, 237, 0.15), 0 0 20px rgba(59, 130, 246, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.background = "rgba(255, 255, 255, 0.08)";
                e.target.style.border = "1px solid rgba(255, 255, 255, 0.15)";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              background: loading ? "rgba(156, 163, 175, 0.3)" : "linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%)",
              color: "white",
              border: "none",
              borderRadius: "12px",
              fontSize: "16px",
              fontWeight: "700",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.3s ease",
              boxShadow: loading ? "none" : "0 6px 24px rgba(124, 58, 237, 0.5), 0 0 30px rgba(59, 130, 246, 0.3)",
              letterSpacing: "0.5px",
              textTransform: "uppercase"
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 8px 32px rgba(124, 58, 237, 0.6), 0 0 40px rgba(59, 130, 246, 0.4)";
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 6px 24px rgba(124, 58, 237, 0.5), 0 0 30px rgba(59, 130, 246, 0.3)";
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
                Signing in...
              </span>
            ) : "Sign In"}
          </button>
        </form>

        <div style={{
          marginTop: "28px",
          padding: "18px 20px",
          background: "rgba(255, 255, 255, 0.03)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "12px",
          fontSize: "13px",
          color: "rgba(255, 255, 255, 0.6)",
          lineHeight: "1.8"
        }}>
          <div style={{ 
            color: "rgba(255, 255, 255, 0.9)", 
            fontWeight: "600", 
            marginBottom: "8px",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            <span>🔑</span>
            <span>Test Credentials</span>
          </div>
          <div style={{ fontSize: "12px" }}>
            <div>Email: <span style={{ color: "rgba(124, 58, 237, 0.9)", fontWeight: "500" }}>client@acme.com</span></div>
            <div>Password: <span style={{ color: "rgba(124, 58, 237, 0.9)", fontWeight: "500" }}>password123</span></div>
          </div>
        </div>

        <div style={{
          marginTop: "24px",
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
            Don't have an account?{" "}
            <Link href="/signup" style={{
              color: "rgba(124, 58, 237, 0.9)",
              textDecoration: "none",
              fontWeight: "600",
              transition: "all 0.3s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "rgba(59, 130, 246, 0.9)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "rgba(124, 58, 237, 0.9)";
            }}
            >
              Create Account
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
