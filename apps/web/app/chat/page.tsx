"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "../../lib/api";
import { isAuthenticated, clearSession } from "../../lib/auth";
import Link from "next/link";

type Message = {
  role: "user" | "assistant" | "error";
  content: string;
  timestamp: Date;
};

export default function ChatPage() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || loading) return;

    const userMessage = message.trim();
    setMessage("");
    setLoading(true);

    setMessages((m) => [
      ...m,
      { role: "user", content: userMessage, timestamp: new Date() },
    ]);

    try {
      const res = await apiFetch("/agent/chat", {
        method: "POST",
        body: JSON.stringify({ message: userMessage }),
      });

      setMessages((m) => [
        ...m,
        { role: "assistant", content: res.text || res.message || "No response", timestamp: new Date() },
      ]);
    } catch (e: any) {
      console.error("CHAT ERROR", e);
      setMessages((m) => [
        ...m,
        { role: "error", content: `Error: ${e.message || "Failed to get response"}`, timestamp: new Date() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearSession();
    router.push("/login");
  };

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      background: `
        linear-gradient(135deg, rgba(15, 12, 41, 0.95) 0%, rgba(48, 43, 99, 0.95) 50%, rgba(36, 36, 62, 0.95) 100%),
        repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(99, 102, 241, 0.03) 2px, rgba(99, 102, 241, 0.03) 4px),
        repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(139, 92, 246, 0.03) 2px, rgba(139, 92, 246, 0.03) 4px)
      `,
      backgroundSize: "100% 100%, 50px 50px, 50px 50px",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* AI Message Flow Background */}
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
        backgroundImage: `
          radial-gradient(circle at 15% 25%, rgba(99, 102, 241, 0.12) 0%, transparent 30%),
          radial-gradient(circle at 85% 75%, rgba(139, 92, 246, 0.12) 0%, transparent 30%),
          linear-gradient(45deg, transparent 48%, rgba(99, 102, 241, 0.015) 48%, rgba(99, 102, 241, 0.015) 52%, transparent 52%),
          linear-gradient(-45deg, transparent 48%, rgba(139, 92, 246, 0.015) 48%, rgba(139, 92, 246, 0.015) 52%, transparent 52%)
        `,
        backgroundSize: "100% 100%, 100% 100%, 40px 40px, 40px 40px",
        opacity: 0.9
      }}>
        {/* Animated Data Nodes */}
        <div style={{
          position: "absolute",
          top: "10%",
          left: "10%",
          width: "400px",
          height: "400px",
          background: "radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(80px)",
          animation: "float 10s ease-in-out infinite"
        }} />
        <div style={{
          position: "absolute",
          bottom: "10%",
          right: "10%",
          width: "500px",
          height: "500px",
          background: "radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(80px)",
          animation: "float 12s ease-in-out infinite reverse"
        }} />
        
        {/* Circuit Connections */}
        <div style={{
          position: "absolute",
          top: "30%",
          right: "15%",
          width: "150px",
          height: "150px",
          background: `
            repeating-linear-gradient(0deg, transparent, transparent 8px, rgba(99, 102, 241, 0.08) 8px, rgba(99, 102, 241, 0.08) 9px),
            repeating-linear-gradient(90deg, transparent, transparent 8px, rgba(99, 102, 241, 0.08) 8px, rgba(99, 102, 241, 0.08) 9px)
          `,
          borderRadius: "50%",
          opacity: 0.4,
          animation: "pulse 10s ease-in-out infinite"
        }} />
      </div>

      {/* Header */}
      <div style={{
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
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 16px rgba(102, 126, 234, 0.4)"
            }}>
              <span style={{ fontSize: "24px" }}>🤖</span>
            </div>
            <h1 style={{
              fontSize: "22px",
              fontWeight: "700",
              margin: 0,
              background: "linear-gradient(135deg, #667eea 0%, #b39ddb 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}>Adwa-Agent Chat</h1>
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

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        padding: "32px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        position: "relative",
        zIndex: 1
      }}>
        {messages.length === 0 && (
          <div style={{
            textAlign: "center",
            color: "rgba(255, 255, 255, 0.6)",
            marginTop: "120px"
          }}>
            <div style={{
              display: "inline-block",
              padding: "24px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              borderRadius: "24px",
              boxShadow: "0 8px 32px rgba(102, 126, 234, 0.4)",
              marginBottom: "24px"
            }}>
              <span style={{ fontSize: "64px" }}>💬</span>
            </div>
            <p style={{ 
              fontSize: "24px", 
              marginBottom: "12px", 
              color: "rgba(255, 255, 255, 0.9)",
              fontWeight: "600"
            }}>Start a conversation</p>
            <p style={{ 
              fontSize: "16px",
              color: "rgba(255, 255, 255, 0.6)"
            }}>Ask me about your knowledge base, create work items, or get help</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
              animation: "slideIn 0.3s ease"
            }}
          >
            <div style={{
              maxWidth: "75%",
              padding: "16px 20px",
              borderRadius: "16px",
              background: msg.role === "user" 
                ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                : msg.role === "error" 
                ? "rgba(239, 68, 68, 0.15)"
                : "rgba(255, 255, 255, 0.08)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: msg.role === "error" 
                ? "1px solid rgba(239, 68, 68, 0.3)"
                : "1px solid rgba(255, 255, 255, 0.1)",
              color: msg.role === "user" 
                ? "white" 
                : msg.role === "error" 
                ? "#fca5a5" 
                : "rgba(255, 255, 255, 0.9)",
              boxShadow: msg.role === "user"
                ? "0 8px 24px rgba(102, 126, 234, 0.3)"
                : "0 4px 16px rgba(0, 0, 0, 0.2)",
              wordBreak: "break-word"
            }}>
              <div style={{ 
                whiteSpace: "pre-wrap",
                lineHeight: "1.6",
                fontSize: "15px"
              }}>{msg.content}</div>
              <div style={{
                fontSize: "11px",
                marginTop: "8px",
                opacity: 0.7,
                textAlign: msg.role === "user" ? "right" : "left"
              }}>
                {msg.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div style={{
              padding: "16px 20px",
              borderRadius: "16px",
              background: "rgba(255, 255, 255, 0.08)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)"
            }}>
              <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                <span style={{ 
                  color: "rgba(255, 255, 255, 0.6)",
                  animation: "pulse 1.5s ease-in-out infinite"
                }}>●</span>
                <span style={{ 
                  color: "rgba(255, 255, 255, 0.6)",
                  animation: "pulse 1.5s ease-in-out 0.2s infinite"
                }}>●</span>
                <span style={{ 
                  color: "rgba(255, 255, 255, 0.6)",
                  animation: "pulse 1.5s ease-in-out 0.4s infinite"
                }}>●</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{
        background: "rgba(15, 12, 41, 0.8)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
        padding: "24px 32px",
        position: "relative",
        zIndex: 10,
        boxShadow: "0 -4px 24px rgba(0, 0, 0, 0.2)"
      }}>
        <form onSubmit={send} style={{ 
          display: "flex", 
          gap: "16px",
          maxWidth: "1200px",
          margin: "0 auto"
        }}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            disabled={loading}
            style={{
              flex: 1,
              padding: "16px 20px",
              background: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              borderRadius: "12px",
              fontSize: "16px",
              outline: "none",
              color: "white",
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
          <button
            type="submit"
            disabled={loading || !message.trim()}
            style={{
              padding: "16px 32px",
              background: loading || !message.trim() 
                ? "rgba(156, 163, 175, 0.3)" 
                : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              border: "none",
              borderRadius: "12px",
              fontSize: "16px",
              fontWeight: "700",
              cursor: loading || !message.trim() ? "not-allowed" : "pointer",
              transition: "all 0.3s ease",
              boxShadow: loading || !message.trim()
                ? "none"
                : "0 4px 20px rgba(102, 126, 234, 0.4)",
              letterSpacing: "0.5px"
            }}
            onMouseEnter={(e) => {
              if (!loading && message.trim()) {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 6px 28px rgba(102, 126, 234, 0.5)";
              }
            }}
            onMouseLeave={(e) => {
              if (!loading && message.trim()) {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 20px rgba(102, 126, 234, 0.4)";
              }
            }}
          >
            Send
          </button>
        </form>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(20px, 20px); }
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
