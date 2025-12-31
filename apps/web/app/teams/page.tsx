"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "../../lib/api";
import { isAuthenticated, clearSession } from "../../lib/auth";

export default function TeamsPage() {
  const router = useRouter();
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
    } else {
      setMounted(true);
      // You will add this endpoint later: GET /teams
      apiFetch("/teams")
        .then((data) => {
          setTeams(data);
          setLoading(false);
        })
        .catch(() => {
          setTeams([]);
          setLoading(false);
        });
    }
  }, [router]);

  const handleLogout = () => {
    clearSession();
    router.push("/login");
  };

  if (!mounted) return null;

  return (
    <div style={{
      minHeight: "100vh",
      background: `
        linear-gradient(135deg, rgba(15, 12, 41, 0.95) 0%, rgba(48, 43, 99, 0.95) 50%, rgba(36, 36, 62, 0.95) 100%),
        repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(139, 92, 246, 0.03) 2px, rgba(139, 92, 246, 0.03) 4px),
        repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(99, 102, 241, 0.03) 2px, rgba(99, 102, 241, 0.03) 4px)
      `,
      backgroundSize: "100% 100%, 50px 50px, 50px 50px",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Team Network Background */}
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
        backgroundImage: `
          radial-gradient(circle at 20% 30%, rgba(139, 92, 246, 0.12) 0%, transparent 25%),
          radial-gradient(circle at 80% 70%, rgba(99, 102, 241, 0.12) 0%, transparent 25%),
          radial-gradient(circle at 50% 50%, rgba(99, 130, 246, 0.08) 0%, transparent 35%),
          linear-gradient(60deg, transparent 47%, rgba(139, 92, 246, 0.02) 47%, rgba(139, 92, 246, 0.02) 53%, transparent 53%),
          linear-gradient(120deg, transparent 47%, rgba(99, 102, 241, 0.02) 47%, rgba(99, 102, 241, 0.02) 53%, transparent 53%)
        `,
        backgroundSize: "100% 100%, 100% 100%, 100% 100%, 70px 120px, 70px 120px",
        opacity: 0.8
      }}>
        {/* Animated Team Nodes */}
        <div style={{
          position: "absolute",
          top: "15%",
          left: "10%",
          width: "450px",
          height: "450px",
          background: "radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(80px)",
          animation: "float 10s ease-in-out infinite"
        }} />
        <div style={{
          position: "absolute",
          bottom: "15%",
          right: "10%",
          width: "500px",
          height: "500px",
          background: "radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(80px)",
          animation: "float 12s ease-in-out infinite reverse"
        }} />
        
        {/* Collaboration Grid */}
        <div style={{
          position: "absolute",
          top: "40%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "300px",
          height: "300px",
          background: `
            repeating-linear-gradient(0deg, transparent, transparent 12px, rgba(139, 92, 246, 0.06) 12px, rgba(139, 92, 246, 0.06) 13px),
            repeating-linear-gradient(90deg, transparent, transparent 12px, rgba(99, 102, 241, 0.06) 12px, rgba(99, 102, 241, 0.06) 13px)
          `,
          opacity: 0.3,
          animation: "float 18s ease-in-out infinite"
        }} />
      </div>

      {/* Header */}
      <div style={{
        position: "sticky",
        top: 0,
        background: "rgba(15, 12, 41, 0.8)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        padding: "20px 32px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        zIndex: 10,
        boxShadow: "0 4px 24px rgba(0, 0, 0, 0.2)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "12px"
          }}>
            <div style={{
              padding: "8px",
              background: "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 16px rgba(139, 92, 246, 0.4)"
            }}>
              <span style={{ fontSize: "24px" }}>👥</span>
            </div>
            <h1 style={{
              fontSize: "22px",
              fontWeight: "700",
              margin: 0,
              background: "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}>Teams & Capabilities</h1>
          </div>
          <Link href="/dashboard" style={{
            color: "rgba(255, 255, 255, 0.7)",
            textDecoration: "none",
            fontSize: "14px",
            padding: "8px 16px",
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "8px",
            transition: "all 0.3s ease",
            fontWeight: "500"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
            e.currentTarget.style.color = "rgba(255, 255, 255, 0.9)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
            e.currentTarget.style.color = "rgba(255, 255, 255, 0.7)";
          }}
          >
            ← Dashboard
          </Link>
        </div>
        <button
          onClick={handleLogout}
          style={{
            padding: "10px 20px",
            background: "rgba(239, 68, 68, 0.15)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            color: "#fca5a5",
            borderRadius: "10px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "600",
            transition: "all 0.3s ease"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(239, 68, 68, 0.25)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(239, 68, 68, 0.15)";
          }}
        >
          Logout
        </button>
      </div>

      {/* Content */}
      <div style={{
        padding: "48px 32px 80px",
        maxWidth: "1400px",
        margin: "0 auto",
        position: "relative",
        zIndex: 1
      }}>
        {loading ? (
          <div style={{
            textAlign: "center",
            color: "rgba(255, 255, 255, 0.6)",
            marginTop: "80px"
          }}>
            <div style={{
              display: "inline-block",
              width: "48px",
              height: "48px",
              border: "4px solid rgba(139, 92, 246, 0.2)",
              borderTop: "4px solid rgba(139, 92, 246, 0.8)",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              marginBottom: "20px"
            }}></div>
            <p style={{ fontSize: "16px" }}>Loading teams...</p>
          </div>
        ) : teams.length === 0 ? (
          <div style={{
            textAlign: "center",
            color: "rgba(255, 255, 255, 0.6)",
            marginTop: "80px"
          }}>
            <div style={{
              display: "inline-block",
              padding: "24px",
              background: "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)",
              borderRadius: "24px",
              boxShadow: "0 8px 32px rgba(139, 92, 246, 0.4)",
              marginBottom: "24px"
            }}>
              <span style={{ fontSize: "64px" }}>👥</span>
            </div>
            <h2 style={{
              fontSize: "28px",
              color: "rgba(255, 255, 255, 0.9)",
              marginBottom: "12px",
              fontWeight: "600"
            }}>No Teams Available</h2>
            <p style={{
              fontSize: "16px",
              color: "rgba(255, 255, 255, 0.6)",
              marginBottom: "24px"
            }}>The teams endpoint is not yet configured.</p>
            <div style={{
              maxWidth: "600px",
              margin: "0 auto",
              padding: "24px",
              background: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "16px",
              textAlign: "left"
            }}>
              <h3 style={{
                fontSize: "16px",
                color: "rgba(255, 255, 255, 0.9)",
                marginBottom: "12px",
                fontWeight: "600"
              }}>Expected Features:</h3>
              <ul style={{
                color: "rgba(255, 255, 255, 0.7)",
                fontSize: "14px",
                lineHeight: "2",
                paddingLeft: "20px"
              }}>
                <li>View team capabilities and assignments</li>
                <li>Manage work item routing</li>
                <li>Track team performance metrics</li>
                <li>Configure team permissions</li>
              </ul>
            </div>
          </div>
        ) : (
          <>
            <div style={{
              marginBottom: "40px",
              textAlign: "center"
            }}>
              <h2 style={{
                fontSize: "36px",
                fontWeight: "700",
                background: "linear-gradient(135deg, #ffffff 0%, #b39ddb 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                marginBottom: "12px"
              }}>Team Management</h2>
              <p style={{
                fontSize: "16px",
                color: "rgba(255, 255, 255, 0.7)"
              }}>Manage your teams and their capabilities</p>
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
              gap: "24px"
            }}>
              {teams.map((team) => (
                <div
                  key={team.id}
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    borderRadius: "16px",
                    padding: "28px",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
                    transition: "all 0.3s ease",
                    cursor: "pointer"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 12px 40px 0 rgba(139, 92, 246, 0.4)";
                    e.currentTarget.style.border = "1px solid rgba(139, 92, 246, 0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 8px 32px 0 rgba(31, 38, 135, 0.37)";
                    e.currentTarget.style.border = "1px solid rgba(255, 255, 255, 0.08)";
                  }}
                >
                  <h3 style={{
                    fontSize: "20px",
                    fontWeight: "700",
                    color: "rgba(255, 255, 255, 0.95)",
                    marginBottom: "12px"
                  }}>
                    {team.name}
                  </h3>
                  <p style={{
                    color: "rgba(255, 255, 255, 0.6)",
                    fontSize: "14px",
                    lineHeight: "1.6",
                    margin: 0
                  }}>
                    {team.description}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(30px, 30px); }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
