"use client";

import { useState } from "react";
import Link from "next/link";

export default function Landing() {
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", color: "#fff", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(139, 92, 246, 0.3), 0 0 40px rgba(139, 92, 246, 0.1); }
          50% { box-shadow: 0 0 30px rgba(139, 92, 246, 0.5), 0 0 60px rgba(139, 92, 246, 0.2); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .btn-luxury {
          background: linear-gradient(90deg, #8b5cf6, #a855f7, #8b5cf6);
          background-size: 200% auto;
          animation: shimmer 3s linear infinite;
        }
        .btn-luxury:hover {
          animation: glow 1.5s ease-in-out infinite, shimmer 1s linear infinite;
          transform: scale(1.02);
        }
        .logo-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
      
      {/* Header - Toggle */}
      <div style={{ padding: "24px 0", display: "flex", justifyContent: "center" }}>
        <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: "16px", padding: "6px", display: "flex", gap: "4px", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(10px)" }}>
          <Link href="/chat" style={{ padding: "14px 28px", borderRadius: "12px", color: "#fff", fontSize: "15px", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px", textDecoration: "none", background: "rgba(255,255,255,0.05)", transition: "all 0.3s", border: "1px solid rgba(255,255,255,0.1)" }}>
            <span style={{ fontSize: "18px" }}>👨</span> I'm a Human
          </Link>
          <Link href="/agent" className="btn-luxury" style={{ padding: "14px 28px", borderRadius: "12px", border: "none", color: "#fff", fontSize: "15px", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px", textDecoration: "none", fontWeight: 600 }}>
            <span style={{ fontSize: "18px" }}>🤖</span> I'm an AI Agent
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 20px" }}>
        
        {/* Hero */}
        <div style={{ textAlign: "center", padding: "60px 0 80px" }}>
          <div className="logo-float" style={{ marginBottom: "24px" }}>
            <img src="/logo.svg" width="80" height="80" alt="TixFlow" style={{ filter: "drop-shadow(0 0 20px rgba(139, 92, 246, 0.5))" }} />
          </div>
          <h1 style={{ fontSize: "56px", fontWeight: 800, marginBottom: "16px", letterSpacing: "-1px" }}>
            <span style={{ background: "linear-gradient(135deg, #fff 0%, #c4b5fd 50%, #8b5cf6 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              TixFlow
            </span>
          </h1>
          <p style={{ fontSize: "18px", color: "#71717a", maxWidth: "500px", margin: "0 auto", lineHeight: 1.6 }}>
            Your AI-powered event assistant for discovering, booking, and coordinating tickets
          </p>
        </div>

        {/* CTA Principal */}
        <div style={{ textAlign: "center", paddingBottom: "60px" }}>
          <Link href="/chat" className="btn-luxury" style={{ display: "inline-block", padding: "18px 48px", borderRadius: "14px", fontSize: "18px", fontWeight: 700, textDecoration: "none", color: "#fff", border: "none" }}>
            Start Exploring →
          </Link>
          <p style={{ marginTop: "16px", fontSize: "13px", color: "#52525b" }}>
            No sign-up required • Demo mode available
          </p>
        </div>

        {/* Features */}
        <div style={{ padding: "40px 0", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <h2 style={{ textAlign: "center", fontSize: "20px", fontWeight: 600, marginBottom: "32px", color: "#a1a1aa", letterSpacing: "2px", textTransform: "uppercase" }}>Capabilities</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px" }}>
            {[
              { icon: "🔍", title: "Event Discovery", desc: "Search events by artist, location, date, or genre", border: "rgba(139, 92, 246, 0.3)" },
              { icon: "🎫", title: "Smart Booking", desc: "Purchase tickets across platforms automatically", border: "rgba(236, 72, 153, 0.3)" },
              { icon: "📅", title: "Calendar Sync", desc: "Sync events to Google Calendar with reminders", border: "rgba(34, 197, 94, 0.3)" },
              { icon: "⏰", title: "Waitlist", desc: "Get notified when sold-out events have availability", border: "rgba(251, 146, 60, 0.3)" },
              { icon: "🤖", title: "AI Agent", desc: "Let your agent handle everything automatically", border: "rgba(139, 92, 246, 0.3)" },
              { icon: "🔗", title: "NFT Tickets", desc: "Tickets as cNFTs on Solana", border: "rgba(236, 72, 153, 0.3)" },
            ].map((f, i) => (
              <div key={i} style={{ 
                background: "rgba(255,255,255,0.03)", 
                borderRadius: "16px", 
                padding: "24px", 
                border: `1px solid ${f.border}`,
                transition: "all 0.3s"
              }}>
                <div style={{ fontSize: "28px", marginBottom: "16px" }}>{f.icon}</div>
                <h3 style={{ fontSize: "17px", fontWeight: 600, marginBottom: "8px", color: "#e4e4e7" }}>{f.title}</h3>
                <p style={{ fontSize: "13px", color: "#71717a", lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* How it Works */}
        <div style={{ padding: "60px 0", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <h2 style={{ textAlign: "center", fontSize: "20px", fontWeight: 600, marginBottom: "40px", color: "#a1a1aa", letterSpacing: "2px", textTransform: "uppercase" }}>How It Works</h2>
          <div style={{ display: "flex", justifyContent: "center", gap: "24px", flexWrap: "wrap" }}>
            {[
              { step: "1", title: "Search", desc: "Find events you love", color: "#8b5cf6" },
              { step: "2", title: "Book", desc: "Get tickets instantly", color: "#ec4899" },
              { step: "3", title: "Enjoy", desc: "Never miss an event", color: "#22c55e" },
            ].map((item, i) => (
              <div key={i} style={{ textAlign: "center", maxWidth: "220px", padding: "24px" }}>
                <div style={{ 
                  width: "56px", 
                  height: "56px", 
                  borderRadius: "16px", 
                  background: `linear-gradient(135deg, ${item.color}20, ${item.color}40)`,
                  border: `1px solid ${item.color}40`,
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  fontSize: "22px", 
                  fontWeight: "bold",
                  margin: "0 auto 16px",
                  color: item.color
                }}>
                  {item.step}
                </div>
                <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "4px", color: "#e4e4e7" }}>{item.title}</h3>
                <p style={{ fontSize: "13px", color: "#71717a" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer CTA */}
        <div style={{ textAlign: "center", padding: "40px 0 100px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <p style={{ fontSize: "14px", color: "#52525b", marginBottom: "16px" }}>Ready to experience the future of event ticketing?</p>
          <Link href="/chat" style={{ color: "#a855f7", fontSize: "15px", textDecoration: "none", fontWeight: 500 }}>
            Try TixFlow Now →
          </Link>
        </div>

      </div>

    </div>
  );
}
