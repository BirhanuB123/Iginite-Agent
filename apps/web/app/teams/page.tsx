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
        linear-gradient(135deg, #0a0e27 0%, #1a1147 30%, #2d1b69 60%, #1e3a8a 100%),
        radial-gradient(circle at 20% 30%, rgba(168, 85, 247, 0.18) 0%, transparent 50%),
        radial-gradient(circle at 80% 70%, rgba(99, 102, 241, 0.16) 0%, transparent 50%),
        repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(168, 85, 247, 0.06) 2px, rgba(168, 85, 247, 0.06) 4px),
        repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(99, 102, 241, 0.05) 2px, rgba(99, 102, 241, 0.05) 4px)
      `,
      backgroundSize: "100% 100%, 100% 100%, 100% 100%, 60px 60px, 60px 60px",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Collaborative Network Background */}
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
        backgroundImage: `
          radial-gradient(circle at 20% 30%, rgba(168, 85, 247, 0.2) 0%, transparent 30%),
          radial-gradient(circle at 80% 70%, rgba(99, 102, 241, 0.18) 0%, transparent 30%),
          radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.12) 0%, transparent 40%),
          linear-gradient(60deg, transparent 47%, rgba(168, 85, 247, 0.03) 47%, rgba(168, 85, 247, 0.03) 53%, transparent 53%),
          linear-gradient(-60deg, transparent 47%, rgba(99, 102, 241, 0.025) 47%, rgba(99, 102, 241, 0.025) 53%, transparent 53%)
        `,
        backgroundSize: "100% 100%, 100% 100%, 100% 100%, 85px 85px, 85px 85px",
        opacity: 0.9
      }}>
        {/* Animated Team Collaboration Orbs */}
        <div style={{
          position: "absolute",
          top: "15%",
          left: "10%",
          width: "520px",
          height: "520px",
          background: "radial-gradient(circle, rgba(168, 85, 247, 0.3) 0%, rgba(139, 92, 246, 0.18) 35%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(85px)",
          animation: "float 11s ease-in-out infinite"
        }} />
        <div style={{
          position: "absolute",
          bottom: "15%",
          right: "10%",
          width: "560px",
          height: "560px",
          background: "radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, rgba(59, 130, 246, 0.18) 35%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(90px)",
          animation: "float 13s ease-in-out infinite reverse"
        }} />
        
        {/* Team Connection Grid */}
        <div style={{
          position: "absolute",
          top: "40%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "350px",
          height: "350px",
          background: `
            radial-gradient(circle, rgba(168, 85, 247, 0.12) 2px, transparent 2px),
            radial-gradient(circle, rgba(99, 102, 241, 0.1) 2px, transparent 2px)
          `,
          backgroundSize: "40px 40px, 40px 40px",
          backgroundPosition: "0 0, 20px 20px",
          opacity: 0.4,
          animation: "float 20s ease-in-out infinite",
          borderRadius: "20px"
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
              background: "linear-gradient(135deg, #a855f7 0%, #6366f1 100%)",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 6px 20px rgba(168, 85, 247, 0.5), 0 0 20px rgba(99, 102, 241, 0.3)"
            }}>
              <span style={{ fontSize: "24px" }}>👥</span>
            </div>
            <h1 style={{
              fontSize: "22px",
              fontWeight: "800",
              margin: 0,
              background: "linear-gradient(135deg, #c084fc 0%, #818cf8 100%)",
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
              border: "4px solid rgba(168, 85, 247, 0.2)",
              borderTop: "4px solid rgba(168, 85, 247, 0.8)",
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
              background: "linear-gradient(135deg, #a855f7 0%, #6366f1 100%)",
              borderRadius: "24px",
              boxShadow: "0 10px 36px rgba(168, 85, 247, 0.5), 0 0 40px rgba(99, 102, 241, 0.3)",
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
                <Link 
                  key={team.id} 
                  href={`/teams/${team.id}`}
                  style={{ textDecoration: "none" }}
                >
                  <div
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
                      e.currentTarget.style.boxShadow = "0 14px 44px 0 rgba(168, 85, 247, 0.5), 0 0 30px rgba(99, 102, 241, 0.3)";
                      e.currentTarget.style.border = "1px solid rgba(168, 85, 247, 0.4)";
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
                    <div style={{
                      marginTop: "16px",
                      fontSize: "13px",
                      color: "rgba(168, 85, 247, 0.9)",
                      fontWeight: "600",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px"
                    }}>
                      View Details →
                    </div>
                  </div>
                </Link>
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
