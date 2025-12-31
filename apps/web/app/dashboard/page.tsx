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
        linear-gradient(135deg, #0a0e27 0%, #1a1147 30%, #2d1b69 60%, #1e3a8a 100%),
        radial-gradient(circle at 20% 30%, rgba(124, 58, 237, 0.15) 0%, transparent 50%),
        radial-gradient(circle at 80% 70%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
        repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(139, 92, 246, 0.05) 2px, rgba(139, 92, 246, 0.05) 4px),
        repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(59, 130, 246, 0.05) 2px, rgba(59, 130, 246, 0.05) 4px)
      `,
      backgroundSize: "100% 100%, 100% 100%, 100% 100%, 60px 60px, 60px 60px",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* AI Neural Network Background */}
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
        backgroundImage: `
          radial-gradient(circle at 15% 25%, rgba(124, 58, 237, 0.2) 0%, transparent 30%),
          radial-gradient(circle at 85% 75%, rgba(59, 130, 246, 0.2) 0%, transparent 30%),
          radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.1) 0%, transparent 40%),
          linear-gradient(45deg, transparent 48%, rgba(124, 58, 237, 0.03) 48%, rgba(124, 58, 237, 0.03) 52%, transparent 52%),
          linear-gradient(-45deg, transparent 48%, rgba(59, 130, 246, 0.03) 48%, rgba(59, 130, 246, 0.03) 52%, transparent 52%)
        `,
        backgroundSize: "100% 100%, 100% 100%, 100% 100%, 80px 80px, 80px 80px",
        opacity: 0.9
      }}>
        {/* Large Animated Neural Orbs */}
        <div style={{
          position: "absolute",
          top: "10%",
          left: "8%",
          width: "600px",
          height: "600px",
          background: "radial-gradient(circle, rgba(124, 58, 237, 0.3) 0%, rgba(139, 92, 246, 0.15) 35%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(90px)",
          animation: "float 12s ease-in-out infinite"
        }} />
        <div style={{
          position: "absolute",
          bottom: "10%",
          right: "8%",
          width: "550px",
          height: "550px",
          background: "radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, rgba(37, 99, 235, 0.15) 35%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(90px)",
          animation: "float 15s ease-in-out infinite reverse"
        }} />
        <div style={{
          position: "absolute",
          top: "45%",
          right: "15%",
          width: "450px",
          height: "450px",
          background: "radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(85px)",
          animation: "pulse 10s ease-in-out infinite"
        }} />
        
        {/* Circuit Board Nodes */}
        <div style={{
          position: "absolute",
          top: "15%",
          right: "8%",
          width: "250px",
          height: "250px",
          background: `
            radial-gradient(circle, rgba(124, 58, 237, 0.15) 2px, transparent 2px),
            radial-gradient(circle, rgba(59, 130, 246, 0.15) 2px, transparent 2px)
          `,
          backgroundSize: "50px 50px, 50px 50px",
          backgroundPosition: "0 0, 25px 25px",
          opacity: 0.4,
          animation: "float 18s ease-in-out infinite"
        }} />
        
        {/* Data Flow Lines */}
        <div style={{
          position: "absolute",
          bottom: "20%",
          left: "10%",
          width: "300px",
          height: "300px",
          background: `
            repeating-linear-gradient(0deg, transparent, transparent 12px, rgba(16, 185, 129, 0.12) 12px, rgba(16, 185, 129, 0.12) 14px),
            repeating-linear-gradient(90deg, transparent, transparent 12px, rgba(59, 130, 246, 0.12) 12px, rgba(59, 130, 246, 0.12) 14px)
          `,
          opacity: 0.3,
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
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{
            padding: "10px",
            background: "linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%)",
            borderRadius: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 6px 20px rgba(124, 58, 237, 0.5), 0 0 20px rgba(59, 130, 246, 0.3)"
          }}>
            <span style={{ fontSize: "28px" }}>🤖</span>
          </div>
          <h1 style={{
            fontSize: "26px",
            fontWeight: "800",
            margin: 0,
            background: "linear-gradient(135deg, #a78bfa 0%, #60a5fa 50%, #34d399 100%)",
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
            fontWeight: "900",
            background: "linear-gradient(135deg, #ffffff 0%, #a78bfa 40%, #60a5fa 70%, #34d399 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            marginBottom: "16px",
            letterSpacing: "1px",
            textShadow: "0 0 80px rgba(124, 58, 237, 0.3)"
          }}>Welcome to Adwa-Agent</h2>
          <p style={{
            fontSize: "20px",
            color: "rgba(255, 255, 255, 0.8)",
            maxWidth: "650px",
            margin: "0 auto",
            fontWeight: "400",
            lineHeight: "1.6"
          }}>Your AI-powered multi-tenant assistant for intelligent automation and knowledge management</p>
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
                background: "linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%)",
                borderRadius: "18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "32px",
                marginBottom: "20px",
                boxShadow: "0 10px 30px rgba(124, 58, 237, 0.5), 0 0 30px rgba(59, 130, 246, 0.3)"
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
                background: "linear-gradient(135deg, #a855f7 0%, #6366f1 100%)",
                borderRadius: "18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "32px",
                marginBottom: "20px",
                boxShadow: "0 10px 30px rgba(168, 85, 247, 0.5), 0 0 30px rgba(99, 102, 241, 0.3)"
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
              background: "linear-gradient(135deg, #3b82f6 0%, #10b981 100%)",
              borderRadius: "18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "32px",
              marginBottom: "20px",
              boxShadow: "0 10px 30px rgba(59, 130, 246, 0.5), 0 0 30px rgba(16, 185, 129, 0.3)"
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
