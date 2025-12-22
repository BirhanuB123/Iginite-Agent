"use client";

import { useState } from "react";
import { apiFetch } from "../../lib/api";

export default function ChatPage() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!message) return;
    setLoading(true);
    setMessages((m) => [...m, `You: ${message}`]);

    try {
      const res = await apiFetch("/agent/chat", {
        method: "POST",
        body: JSON.stringify({ message }),
      });

      setMessages((m) => [...m, `Ignite-Agent: ${res.text}`]);
    } catch (e: any) {
      setMessages((m) => [...m, `Error: ${e.message}`]);
    }

    setMessage("");
    setLoading(false);
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Ignite-Agent Chat</h1>

      <div style={{ minHeight: 200, border: "1px solid #ccc", padding: 10 }}>
        {messages.map((m, i) => (
          <div key={i}>{m}</div>
        ))}
      </div>

      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{ width: "80%", marginTop: 10 }}
      />
      <button onClick={send} disabled={loading}>
        Send
      </button>
    </div>
  );
}
