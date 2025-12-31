"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "../../../lib/api";
import { isAuthenticated, clearSession } from "../../../lib/auth";

interface Capability {
  id: string;
  capability: string;
  sla: {
    responseTime?: string;
    resolutionTime?: string;
  };
  raci: {
    responsible?: string;
    accountable?: string;
    consulted?: string;
    informed?: string;
  };
}

interface WorkItem {
  id: string;
  title: string;
  status: string;
  priority: string;
  createdAt: string;
}

interface TeamDetails {
  id: string;
  name: string;
  description: string;
  visibility: string;
  capabilities: Capability[];
  recentWorkItems: WorkItem[];
  createdAt: string;
}

export default function TeamDetailPage() {
  const router = useRouter();
  const params = useParams();
  const teamId = params?.id as string;
  
  const [team, setTeam] = useState<TeamDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
    } else {
      setMounted(true);
      loadTeamDetails();
    }
  }, [router, teamId]);

  const loadTeamDetails = async () => {
    try {
      const data = await apiFetch(`/teams/${teamId}`);
      setTeam(data);
    } catch (error) {
      console.error("Failed to load team details:", error);
    } finally {
      setLoading(false);
    }
  };

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
      {/* Animated Background */}
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
          radial-gradient(circle at 80% 70%, rgba(99, 102, 241, 0.18) 0%, transparent 30%)
        `,
        opacity: 0.9
      }}>
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
            }}>Team Details</h1>
          </div>
          <Link href="/teams" style={{
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
            ← All Teams
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
            <p style={{ fontSize: "16px" }}>Loading team details...</p>
          </div>
        ) : !team ? (
          <div style={{
            textAlign: "center",
            color: "rgba(255, 255, 255, 0.6)",
            marginTop: "80px"
          }}>
            <h2 style={{
              fontSize: "28px",
              color: "rgba(255, 255, 255, 0.9)",
              marginBottom: "12px"
            }}>Team Not Found</h2>
            <Link href="/teams" style={{
              color: "rgba(168, 85, 247, 0.9)",
              textDecoration: "none",
              fontSize: "16px"
            }}>
              ← Back to Teams
            </Link>
          </div>
        ) : (
          <>
            {/* Team Header */}
            <div style={{
              marginBottom: "40px",
              padding: "40px",
              background: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "20px",
              boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)"
            }}>
              <h2 style={{
                fontSize: "42px",
                fontWeight: "800",
                background: "linear-gradient(135deg, #ffffff 0%, #c084fc 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                marginBottom: "16px"
              }}>{team.name}</h2>
              <p style={{
                fontSize: "18px",
                color: "rgba(255, 255, 255, 0.7)",
                marginBottom: "24px",
                lineHeight: "1.6"
              }}>{team.description}</p>
              <div style={{
                display: "flex",
                gap: "16px",
                flexWrap: "wrap"
              }}>
                <div style={{
                  padding: "8px 16px",
                  background: "rgba(168, 85, 247, 0.15)",
                  border: "1px solid rgba(168, 85, 247, 0.3)",
                  borderRadius: "8px",
                  fontSize: "14px",
                  color: "rgba(192, 132, 252, 0.9)",
                  fontWeight: "600"
                }}>
                  {team.visibility} Team
                </div>
                <div style={{
                  padding: "8px 16px",
                  background: "rgba(59, 130, 246, 0.15)",
                  border: "1px solid rgba(59, 130, 246, 0.3)",
                  borderRadius: "8px",
                  fontSize: "14px",
                  color: "rgba(147, 197, 253, 0.9)",
                  fontWeight: "600"
                }}>
                  {team.capabilities.length} Capabilities
                </div>
                <div style={{
                  padding: "8px 16px",
                  background: "rgba(16, 185, 129, 0.15)",
                  border: "1px solid rgba(16, 185, 129, 0.3)",
                  borderRadius: "8px",
                  fontSize: "14px",
                  color: "rgba(52, 211, 153, 0.9)",
                  fontWeight: "600"
                }}>
                  {team.recentWorkItems?.length || 0} Work Items
                </div>
              </div>
            </div>

            {/* Capabilities Section */}
            <div style={{ marginBottom: "40px" }}>
              <h3 style={{
                fontSize: "28px",
                fontWeight: "700",
                color: "rgba(255, 255, 255, 0.95)",
                marginBottom: "24px",
                display: "flex",
                alignItems: "center",
                gap: "12px"
              }}>
                <span style={{ fontSize: "32px" }}>🎯</span>
                Team Capabilities
              </h3>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))",
                gap: "24px"
              }}>
                {team.capabilities.map((cap) => (
                  <div
                    key={cap.id}
                    style={{
                      background: "rgba(255, 255, 255, 0.05)",
                      backdropFilter: "blur(20px)",
                      borderRadius: "16px",
                      padding: "28px",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
                      transition: "all 0.3s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.boxShadow = "0 12px 40px 0 rgba(168, 85, 247, 0.4)";
                      e.currentTarget.style.border = "1px solid rgba(168, 85, 247, 0.3)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 8px 32px 0 rgba(31, 38, 135, 0.37)";
                      e.currentTarget.style.border = "1px solid rgba(255, 255, 255, 0.08)";
                    }}
                  >
                    <h4 style={{
                      fontSize: "20px",
                      fontWeight: "700",
                      color: "rgba(255, 255, 255, 0.95)",
                      marginBottom: "20px"
                    }}>
                      {cap.capability}
                    </h4>

                    {/* SLA */}
                    {(cap.sla.responseTime || cap.sla.resolutionTime) && (
                      <div style={{ marginBottom: "16px" }}>
                        <div style={{
                          fontSize: "13px",
                          color: "rgba(255, 255, 255, 0.5)",
                          marginBottom: "8px",
                          fontWeight: "600",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px"
                        }}>📊 SLA</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                          {cap.sla.responseTime && (
                            <div style={{
                              fontSize: "14px",
                              color: "rgba(255, 255, 255, 0.8)",
                              display: "flex",
                              justifyContent: "space-between"
                            }}>
                              <span>Response Time:</span>
                              <span style={{ fontWeight: "600", color: "rgba(52, 211, 153, 0.9)" }}>
                                {cap.sla.responseTime}
                              </span>
                            </div>
                          )}
                          {cap.sla.resolutionTime && (
                            <div style={{
                              fontSize: "14px",
                              color: "rgba(255, 255, 255, 0.8)",
                              display: "flex",
                              justifyContent: "space-between"
                            }}>
                              <span>Resolution Time:</span>
                              <span style={{ fontWeight: "600", color: "rgba(52, 211, 153, 0.9)" }}>
                                {cap.sla.resolutionTime}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* RACI */}
                    <div>
                      <div style={{
                        fontSize: "13px",
                        color: "rgba(255, 255, 255, 0.5)",
                        marginBottom: "8px",
                        fontWeight: "600",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px"
                      }}>👥 RACI Matrix</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        {cap.raci.responsible && (
                          <div style={{ fontSize: "13px", color: "rgba(255, 255, 255, 0.7)" }}>
                            <span style={{ color: "rgba(168, 85, 247, 0.9)", fontWeight: "600" }}>R:</span> {cap.raci.responsible}
                          </div>
                        )}
                        {cap.raci.accountable && (
                          <div style={{ fontSize: "13px", color: "rgba(255, 255, 255, 0.7)" }}>
                            <span style={{ color: "rgba(99, 102, 241, 0.9)", fontWeight: "600" }}>A:</span> {cap.raci.accountable}
                          </div>
                        )}
                        {cap.raci.consulted && (
                          <div style={{ fontSize: "13px", color: "rgba(255, 255, 255, 0.7)" }}>
                            <span style={{ color: "rgba(59, 130, 246, 0.9)", fontWeight: "600" }}>C:</span> {cap.raci.consulted}
                          </div>
                        )}
                        {cap.raci.informed && (
                          <div style={{ fontSize: "13px", color: "rgba(255, 255, 255, 0.7)" }}>
                            <span style={{ color: "rgba(16, 185, 129, 0.9)", fontWeight: "600" }}>I:</span> {cap.raci.informed}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Work Items */}
            {team.recentWorkItems && team.recentWorkItems.length > 0 && (
              <div>
                <h3 style={{
                  fontSize: "28px",
                  fontWeight: "700",
                  color: "rgba(255, 255, 255, 0.95)",
                  marginBottom: "24px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px"
                }}>
                  <span style={{ fontSize: "32px" }}>📋</span>
                  Recent Work Items
                </h3>
                <div style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  backdropFilter: "blur(20px)",
                  borderRadius: "16px",
                  padding: "28px",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)"
                }}>
                  {team.recentWorkItems.map((item, index) => (
                    <div
                      key={item.id}
                      style={{
                        padding: "16px",
                        borderBottom: index < team.recentWorkItems.length - 1 ? "1px solid rgba(255, 255, 255, 0.08)" : "none",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                      }}
                    >
                      <div>
                        <div style={{
                          fontSize: "16px",
                          fontWeight: "600",
                          color: "rgba(255, 255, 255, 0.9)",
                          marginBottom: "4px"
                        }}>
                          {item.title}
                        </div>
                        <div style={{ fontSize: "13px", color: "rgba(255, 255, 255, 0.5)" }}>
                          {new Date(item.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <div style={{
                          padding: "4px 12px",
                          background: item.status === "DONE" ? "rgba(16, 185, 129, 0.15)" : "rgba(59, 130, 246, 0.15)",
                          border: `1px solid ${item.status === "DONE" ? "rgba(16, 185, 129, 0.3)" : "rgba(59, 130, 246, 0.3)"}`,
                          borderRadius: "6px",
                          fontSize: "12px",
                          color: item.status === "DONE" ? "rgba(52, 211, 153, 0.9)" : "rgba(147, 197, 253, 0.9)",
                          fontWeight: "600"
                        }}>
                          {item.status}
                        </div>
                        <div style={{
                          padding: "4px 12px",
                          background: "rgba(168, 85, 247, 0.15)",
                          border: "1px solid rgba(168, 85, 247, 0.3)",
                          borderRadius: "6px",
                          fontSize: "12px",
                          color: "rgba(192, 132, 252, 0.9)",
                          fontWeight: "600"
                        }}>
                          {item.priority}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
