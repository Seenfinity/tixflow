"use client";

import Link from "next/link";

export default function AgentPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#0d0d0d", color: "#fff", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <style>{`*{box-sizing:border-box}body{margin:0}code{font-family:'SF Mono',Monaco,'Andale Mono',monospace}`}</style>
      
      {/* Header - Toggle */}
      <div style={{ padding: "24px 0", display: "flex", justifyContent: "center" }}>
        <div style={{ background: "#1a1a1a", borderRadius: "12px", padding: "4px", display: "flex", gap: "4px" }}>
          <Link href="/chat" style={{ padding: "12px 24px", borderRadius: "8px", border: "none", color: "#888", fontSize: "16px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
            <span>👨</span> I'm a Human
          </Link>
          <button style={{ padding: "12px 24px", borderRadius: "8px", background: "#8b5cf6", border: "none", color: "#fff", fontSize: "16px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
            <span>🤖</span> I'm an AI Agent
          </button>
        </div>
      </div>

      {/* Main Card */}
      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "0 20px 80px" }}>
        <div style={{ background: "#171717", borderRadius: "16px", border: "1px solid #2a2a2a", padding: "32px" }}>
          
          {/* Title */}
          <h1 style={{ textAlign: "center", fontSize: "28px", fontWeight: 600, marginBottom: "8px" }}>
            Connect Your Agent to <span style={{ color: "#8b5cf6" }}>TixFlow</span> 🔮
          </h1>
          <p style={{ textAlign: "center", color: "#666", marginBottom: "32px", fontSize: "14px" }}>
            AI-powered event discovery, booking, and coordination
          </p>

          {/* Tabs */}
          <div style={{ display: "flex", gap: "4px", marginBottom: "24px", background: "#1a1a1a", padding: "4px", borderRadius: "8px" }}>
            <button style={{ flex: 1, padding: "10px", borderRadius: "6px", background: "#8b5cf6", border: "none", color: "#fff", fontSize: "14px", cursor: "pointer", fontWeight: 500 }}>
              ClawHub
            </button>
            <button style={{ flex: 1, padding: "10px", borderRadius: "6px", background: "transparent", border: "none", color: "#666", fontSize: "14px", cursor: "pointer" }}>
              Manual / API
            </button>
          </div>

          {/* Command Box */}
          <div style={{ background: "#0d0d0d", borderRadius: "8px", padding: "16px", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px", border: "1px solid #2a2a2a" }}>
            <code style={{ color: "#22c55e", fontSize: "14px" }}>
              clawhub install tixflow
            </code>
            <button 
              onClick={() => navigator.clipboard.writeText('clawhub install tixflow')}
              style={{ padding: "6px 12px", borderRadius: "6px", background: "transparent", border: "1px solid #444", color: "#888", fontSize: "12px", cursor: "pointer" }}>
              Copy
            </button>
          </div>

          {/* What happens */}
          <h3 style={{ fontSize: "14px", color: "#888", marginBottom: "16px", fontWeight: 500 }}>What happens:</h3>
          <ol style={{ paddingLeft: "20px", color: "#666", fontSize: "14px", lineHeight: 1.8 }}>
            <li style={{ color: "#22c55e" }}><span style={{ color: "#666" }}>Agent installs the TixFlow skill</span></li>
            <li style={{ color: "#22c55e", marginTop: "8px" }}><span style={{ color: "#666" }}>Registers and gets API access to events</span></li>
            <li style={{ color: "#22c55e", marginTop: "8px" }}><span style={{ color: "#666" }}>Starts discovering and booking tickets</span></li>
          </ol>

          {/* Docs link */}
          <div style={{ textAlign: "center", marginTop: "32px", paddingTop: "24px", borderTop: "1px solid #2a2a2a" }}>
            <a href="#" style={{ color: "#8b5cf6", fontSize: "14px", textDecoration: "none" }}>
              Full API docs →
            </a>
          </div>

        </div>

        {/* For Humans CTA */}
        <div style={{ textAlign: "center", marginTop: "24px" }}>
          <p style={{ color: "#666", fontSize: "14px", marginBottom: "12px" }}>For humans:</p>
          <Link href="/chat" style={{ color: "#8b5cf6", fontSize: "14px", textDecoration: "none" }}>
            Try the chat interface →
          </Link>
        </div>

      </div>

    </div>
  );
}
