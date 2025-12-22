"use client";

import Link from "next/link";

export default function Dashboard() {
  return (
    <div style={{ padding: 40 }}>
      <h1>Dashboard</h1>
      <ul>
        <li><Link href="/chat">Chat with Ignite-Agent</Link></li>
        <li><Link href="/teams">Teams & Capabilities</Link></li>
      </ul>
    </div>
  );
}
