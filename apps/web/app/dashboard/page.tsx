"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { isAuthenticated, clearSession } from "../../lib/auth";

export default function Dashboard() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
    } else {
      setMounted(true);
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
        repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(99, 102, 241, 0.03) 2px, rgba(99, 102, 241, 0.03) 4px),
        repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(139, 92, 246, 0.03) 2px, rgba(139, 92, 246, 0.03) 4px)
      `,
      backgroundSize: "100% 100%, 50px 50px, 50px 50px",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* AI Circuit Board Pattern */}
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
        backgroundImage: `
          radial-gradient(circle at 10% 20%, rgba(99, 102, 241, 0.15) 0%, transparent 25%),
          radial-gradient(circle at 90% 80%, rgba(139, 92, 246, 0.15) 0%, transparent 25%),
          radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 30%),
          linear-gradient(30deg, transparent 48%, rgba(99, 102, 241, 0.02) 48%, rgba(99, 102, 241, 0.02) 52%, transparent 52%),
          linear-gradient(150deg, transparent 48%, rgba(139, 92, 246, 0.02) 48%, rgba(139, 92, 246, 0.02) 52%, transparent 52%)
        `,
        backgroundSize: "100% 100%, 100% 100%, 100% 100%, 60px 105px, 60px 105px",
        opacity: 0.8
      }}>
        {/* Animated Neural Nodes */}
        <div style={{
          position: "absolute",
          top: "20%",
          left: "5%",
          width: "500px",
          height: "500px",
          background: "radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(80px)",
          animation: "float 10s ease-in-out infinite"
        }} />
        <div style={{
          position: "absolute",
          bottom: "15%",
          right: "10%",
          width: "400px",
          height: "400px",
          background: "radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(80px)",
          animation: "float 12s ease-in-out infinite reverse"
        }} />
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "600px",
          height: "600px",
          background: "radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(100px)",
          animation: "pulse 8s ease-in-out infinite"
        }} />
        
        {/* Digital Grid Overlay */}
        <div style={{
          position: "absolute",
          top: "10%",
          right: "5%",
          width: "200px",
          height: "200px",
          background: `
            repeating-linear-gradient(0deg, transparent, transparent 10px, rgba(99, 102, 241, 0.1) 10px, rgba(99, 102, 241, 0.1) 11px),
            repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(99, 102, 241, 0.1) 10px, rgba(99, 102, 241, 0.1) 11px)
          `,
          opacity: 0.3,
          animation: "float 15s ease-in-out infinite"
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
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{
            padding: "10px",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 16px rgba(102, 126, 234, 0.4)"
          }}>
            <span style={{ fontSize: "28px" }}>🤖</span>
          </div>
          <h1 style={{
            fontSize: "26px",
            fontWeight: "700",
            margin: 0,
            background: "linear-gradient(135deg, #667eea 0%, #b39ddb 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            letterSpacing: "0.5px"
          }}>Adwa-Agent Dashboard</h1>
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
            transition: "all 0.3s ease",
            letterSpacing: "0.5px"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(239, 68, 68, 0.25)";
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(239, 68, 68, 0.15)";
            e.currentTarget.style.transform = "translateY(0)";
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
        {/* Hero Section */}
        <div style={{
          marginBottom: "48px",
          textAlign: "center"
        }}>
          <h2 style={{
            fontSize: "48px",
            fontWeight: "800",
            background: "linear-gradient(135deg, #ffffff 0%, #b39ddb 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            marginBottom: "16px",
            letterSpacing: "1px"
          }}>Welcome to Adwa-Agent</h2>
          <p style={{
            fontSize: "20px",
            color: "rgba(255, 255, 255, 0.7)",
            maxWidth: "600px",
            margin: "0 auto"
          }}>Your AI-powered multi-tenant assistant for intelligent automation</p>
        </div>

        {/* Feature Cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "28px",
          marginBottom: "56px"
        }}>
          {/* Chat Card */}
          <Link href="/chat" style={{ textDecoration: "none" }}>
            <div style={{
              background: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              borderRadius: "20px",
              padding: "36px",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
              transition: "all 0.3s ease",
              cursor: "pointer",
              minHeight: "280px",
              display: "flex",
              flexDirection: "column"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-8px)";
              e.currentTarget.style.boxShadow = "0 12px 40px 0 rgba(102, 126, 234, 0.4)";
              e.currentTarget.style.border = "1px solid rgba(102, 126, 234, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 8px 32px 0 rgba(31, 38, 135, 0.37)";
              e.currentTarget.style.border = "1px solid rgba(255, 255, 255, 0.08)";
            }}
            >
              <div style={{
                width: "64px",
                height: "64px",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                borderRadius: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "32px",
                marginBottom: "20px",
                boxShadow: "0 8px 24px rgba(102, 126, 234, 0.4)"
              }}>💬</div>
              <h3 style={{
                fontSize: "26px",
                fontWeight: "700",
                marginBottom: "12px",
                color: "rgba(255, 255, 255, 0.95)"
              }}>AI Chat</h3>
              <p style={{
                color: "rgba(255, 255, 255, 0.6)",
                fontSize: "15px",
                lineHeight: "1.7",
                margin: 0
              }}>
                Chat with Adwa-Agent to search your knowledge base, create work items, and get intelligent assistance
              </p>
            </div>
          </Link>

          {/* Teams Card */}
          <Link href="/teams" style={{ textDecoration: "none" }}>
            <div style={{
              background: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              borderRadius: "20px",
              padding: "36px",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
              transition: "all 0.3s ease",
              cursor: "pointer",
              minHeight: "280px",
              display: "flex",
              flexDirection: "column"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-8px)";
              e.currentTarget.style.boxShadow = "0 12px 40px 0 rgba(139, 92, 246, 0.4)";
              e.currentTarget.style.border = "1px solid rgba(139, 92, 246, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 8px 32px 0 rgba(31, 38, 135, 0.37)";
              e.currentTarget.style.border = "1px solid rgba(255, 255, 255, 0.08)";
            }}
            >
              <div style={{
                width: "64px",
                height: "64px",
                background: "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)",
                borderRadius: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "32px",
                marginBottom: "20px",
                boxShadow: "0 8px 24px rgba(139, 92, 246, 0.4)"
              }}>👥</div>
              <h3 style={{
                fontSize: "26px",
                fontWeight: "700",
                marginBottom: "12px",
                color: "rgba(255, 255, 255, 0.95)"
              }}>Teams & Capabilities</h3>
              <p style={{
                color: "rgba(255, 255, 255, 0.6)",
                fontSize: "15px",
                lineHeight: "1.7",
                margin: 0
              }}>
                View and manage team capabilities, assignments, and work item routing
              </p>
            </div>
          </Link>

          {/* Knowledge Base Card */}
          <div style={{
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderRadius: "20px",
            padding: "36px",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
            opacity: 0.7,
            minHeight: "280px",
            display: "flex",
            flexDirection: "column"
          }}>
            <div style={{
              width: "64px",
              height: "64px",
              background: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
              borderRadius: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "32px",
              marginBottom: "20px",
              boxShadow: "0 8px 24px rgba(59, 130, 246, 0.4)"
            }}>📚</div>
            <h3 style={{
              fontSize: "26px",
              fontWeight: "700",
              marginBottom: "12px",
              color: "rgba(255, 255, 255, 0.95)"
            }}>Knowledge Base</h3>
            <p style={{
              color: "rgba(255, 255, 255, 0.6)",
              fontSize: "15px",
              lineHeight: "1.7",
              marginBottom: "16px"
            }}>
              Semantic search with vector embeddings • Document ingestion • RAG-powered answers
            </p>
            <div style={{
              marginTop: "auto",
              padding: "10px 14px",
              background: "rgba(59, 130, 246, 0.15)",
              border: "1px solid rgba(59, 130, 246, 0.3)",
              borderRadius: "10px",
              fontSize: "12px",
              color: "rgba(147, 197, 253, 0.9)",
              fontWeight: "600",
              textAlign: "center"
            }}>
              Coming soon: Document management UI
            </div>
          </div>
        </div>

        {/* Features List */}
        <div style={{
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderRadius: "20px",
          padding: "40px",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)"
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "28px"
          }}>
            <span style={{ fontSize: "28px" }}>✨</span>
            <h3 style={{
              fontSize: "24px",
              fontWeight: "700",
              margin: 0,
              color: "rgba(255, 255, 255, 0.95)"
            }}>Key Features</h3>
          </div>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "20px"
          }}>
            {[
              { icon: "🔐", text: "Multi-tenant Architecture" },
              { icon: "🧠", text: "Semantic Search (pgvector)" },
              { icon: "🛠️", text: "Extensible Tool Registry" },
              { icon: "📝", text: "Document Ingestion & Chunking" },
              { icon: "📊", text: "Audit Logging" },
              { icon: "🎯", text: "Policy-based Authorization" },
              { icon: "🔄", text: "Work Item Management" },
              { icon: "🤖", text: "OpenAI Integration" }
            ].map((feature, i) => (
              <div key={i} style={{
                padding: "16px 20px",
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "12px",
                fontSize: "15px",
                color: "rgba(255, 255, 255, 0.85)",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
                e.currentTarget.style.transform = "translateX(4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
                e.currentTarget.style.transform = "translateX(0)";
              }}
              >
                <span style={{ fontSize: "20px" }}>{feature.icon}</span>
                <span style={{ fontWeight: "500" }}>{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(30px, 30px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.8; transform: translate(-50%, -50%) scale(1.1); }
        }
      `}</style>
    </div>
  );
}
