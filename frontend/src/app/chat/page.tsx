"use client";

import { useState, useRef, useEffect } from "react";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type Event = {
  id: string;
  name: string;
  date: string;
  venue: string;
  price: string;
  image: string;
};

const mockEvents: Event[] = [
  { id: "1", name: "Classical Symphony Orchestra", date: "Feb 25, 2026", venue: "Royal Albert Hall, London", price: "£45 - £120", image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&q=80" },
  { id: "2", name: "Jazz Night Live", date: "Mar 1, 2026", venue: "Blue Note, NYC", price: "$35 - $80", image: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=400&q=80" },
  { id: "3", name: "Electronic Music Festival", date: "Mar 15, 2026", venue: "Brooklyn Warehouse", price: "$50 - $150", image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&q=80" },
];

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", role: "assistant", content: "Hi! I'm TixFlow, your AI event assistant. I can help you discover events, book tickets, and sync them to your calendar. What would you like to do today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showEvents, setShowEvents] = useState(false);
  const [selectedEvents, setSelectedEvents] = useState<Event[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [purchasePhase, setPurchasePhase] = useState("idle");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, showCheckout]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = { id: Date.now().toString(), role: "user" as const, content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    setTimeout(() => {
      const lower = input.toLowerCase();
      let response = "";
      let showResults = false;
      let showCheckoutPanel = false;

      if (lower.includes("find") || lower.includes("search") || lower.includes("concert") || lower.includes("event") || lower.includes("music") || lower.includes("london") || lower.includes("busca")) {
        response = "I found some amazing events for you! Here are my top recommendations:";
        showResults = true;
      } else if (lower.includes("calendar") || lower.includes("sync")) {
        response = "I've synced your selected events to your Google Calendar! You'll receive reminders 24 hours before each event.";
      } else if (lower.includes("buy") || lower.includes("ticket") || lower.includes("purchase") || lower.includes("comprar")) {
        response = "Great choice! Your ticket will be minted as a cNFT on Solana.";
        showCheckoutPanel = true;
      } else {
        response = "Tell me more about what type of events you're looking for - concerts, theater, sports?";
      }

      setMessages(prev => [...prev, { id: Date.now().toString(), role: "assistant", content: response }]);
      setShowEvents(showResults);
      if (showCheckoutPanel) setShowCheckout(true);
      setIsLoading(false);
    }, 1500);
  };

  const toggleEvent = (event: Event) => {
    setSelectedEvents(prev => prev.some(e => e.id === event.id) ? prev.filter(e => e.id !== event.id) : [...prev, event]);
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg, #0f172a 0%, #020617 100%)", color: "#fff", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <style>{`*{box-sizing:border-box}body{margin:0}::-webkit-scrollbar{width:6px}::-webkit-scrollbar-thumb{background:#334155;border-radius:3px}`}</style>
      
      {/* Header */}
      <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, background: "rgba(15,23,42,0.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid #1e293b" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <img src="/logo.svg" width={40} height={40} alt="TixFlow" />
            <div>
              <div style={{ fontSize: 18, fontWeight: 600 }}>TixFlow</div>
              <div style={{ fontSize: 11, color: "#94a3b8" }}>AI Event Assistant</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#94a3b8" }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981" }}></span>
            <span>Online</span>
          </div>
        </div>
      </header>

      {/* Chat */}
      <div style={{ padding: "80px 20px 140px", maxWidth: "800px", margin: "0 auto" }}>
        {messages.map(msg => (
          <div key={msg.id} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start", marginBottom: 16 }}>
            <div style={{ maxWidth: "85%", padding: "14px 18px", borderRadius: 20, fontSize: 14, lineHeight: 1.6, background: msg.role === "user" ? "linear-gradient(135deg, #059669, #047857)" : "#1e293b", color: "#fff", borderBottomRightRadius: msg.role === "user" ? 6 : 20, borderBottomLeftRadius: msg.role === "user" ? 20 : 6 }}>
              {msg.content}
            </div>
          </div>
        ))}

        {showEvents && (
          <div style={{ marginTop: 20 }}>
            <div style={{ marginBottom: 16, color: "#94a3b8", fontSize: 14 }}>Found {mockEvents.length} events</div>
            {mockEvents.map(event => (
              <div key={event.id} onClick={() => toggleEvent(event)} style={{ background: selectedEvents.some(e => e.id === event.id) ? "rgba(16,185,129,0.15)" : "#1e293b", border: selectedEvents.some(e => e.id === event.id) ? "1px solid #10b981" : "1px solid #334155", borderRadius: 16, padding: 16, marginBottom: 12, cursor: "pointer" }}>
                <div style={{ display: "flex", gap: 12 }}>
                  <img src={event.image} alt={event.name} style={{ width: 60, height: 60, borderRadius: 8, objectFit: "cover" }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500, fontSize: 14, marginBottom: 4 }}>{event.name}</div>
                    <div style={{ fontSize: 12, color: "#94a3b8" }}>{event.date} • {event.venue}</div>
                    <div style={{ fontSize: 12, color: "#fbbf24", marginTop: 4 }}>{event.price}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div style={{ width: 20, height: 20, borderRadius: "50%", border: `2px solid ${selectedEvents.some(e => e.id === event.id) ? "#10b981" : "#475569"}`, background: selectedEvents.some(e => e.id === event.id) ? "#10b981" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>
                      {selectedEvents.some(e => e.id === event.id) ? "✓" : ""}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {selectedEvents.length > 0 && (
              <button onClick={() => { setShowCheckout(true); setShowEvents(false); setMessages(prev => [...prev, { id: Date.now().toString(), role: "assistant", content: `Perfect! ${selectedEvents.length} ticket(s) selected. Total: 0.01 SOL` }]); }} style={{ width: "100%", marginTop: 16, padding: 12, borderRadius: 12, background: "linear-gradient(135deg, #059669, #047857)", border: "none", color: "#fff", fontSize: 14, fontWeight: 500, cursor: "pointer" }}>
                Continue with {selectedEvents.length} event{selectedEvents.length > 1 ? "s" : ""}
              </button>
            )}
          </div>
        )}

        {/* Checkout */}
        {showCheckout && purchasePhase !== "success" && (
          <div style={{ marginTop: 20, background: "linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.1))", borderRadius: 20, padding: 24, border: "1px solid rgba(139, 92, 246, 0.3)" }}>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 14, color: "#a1a1aa", marginBottom: 8 }}>🎫 {selectedEvents.length || 1} Ticket(s)</div>
              <div style={{ fontSize: 24, fontWeight: 700 }}>Total: 0.01 SOL</div>
            </div>
            
            {!walletConnected ? (
              <button 
                onClick={() => { setPurchasePhase("connecting"); setTimeout(() => { setWalletConnected(true); setWalletAddress("EW9vx...CZD8"); setPurchasePhase("idle"); }, 1500); }}
                disabled={purchasePhase === "connecting"}
                style={{ width: "100%", padding: 16, borderRadius: 12, border: "none", background: "linear-gradient(135deg, #8b5cf6, #a855f7)", color: "#fff", fontSize: 15, fontWeight: 600, cursor: "pointer" }}
              >
                {purchasePhase === "connecting" ? "Connecting..." : "🦊 Connect Phantom Wallet"}
              </button>
            ) : (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: 12, background: "rgba(255,255,255,0.05)", borderRadius: 10, marginBottom: 16, fontSize: 13, color: "#a1a1aa" }}>
                  <span style={{ color: "#22c55e" }}>●</span> {walletAddress}
                </div>
                <button 
                  onClick={() => { setPurchasePhase("buying"); setTimeout(() => { setPurchasePhase("success"); }, 2000); }}
                  style={{ width: "100%", padding: 16, borderRadius: 12, border: "none", background: "linear-gradient(135deg, #ec4899, #f472b6)", color: "#fff", fontSize: 15, fontWeight: 600, cursor: "pointer" }}
                >
                  {purchasePhase === "buying" ? "Minting cNFT..." : "Buy Now (0.01 SOL)"}
                </button>
              </div>
            )}
            
            <p style={{ textAlign: "center", fontSize: 11, color: "#52525b", marginTop: 16 }}>
              Powered by Solana cNFTs • Devnet
            </p>
          </div>
        )}

        {purchasePhase === "success" && (
          <div style={{ marginTop: 20, textAlign: "center", padding: 24, background: "linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(16, 185, 129, 0.1))", borderRadius: 20, border: "1px solid rgba(34, 197, 94, 0.3)" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🎉</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: "#22c55e", marginBottom: 4 }}>Tickets Purchased!</div>
            <div style={{ fontSize: 13, color: "#71717a" }}>cNFT minted to your wallet</div>
            <div style={{ marginTop: 16, padding: 12, background: "rgba(255,255,255,0.05)", borderRadius: 8, fontSize: 12, color: "#a1a1aa", display: "inline-block" }}>
              <span style={{ color: "#22c55e" }}>●</span> {walletAddress}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "linear-gradient(180deg, transparent, rgba(15,23,42,0.98) 30%)", padding: 20 }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", background: "#1e293b", borderRadius: 16, border: "1px solid #334155", display: "flex", alignItems: "center", padding: 8, gap: 8 }}>
          <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSend()} placeholder="Ask me to find events..." style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "#f1f5f9", fontSize: 14, padding: 12 }} />
          <button onClick={handleSend} disabled={!input.trim() || isLoading} style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg, #059669, #047857)", border: "none", cursor: "pointer", opacity: !input.trim() ? 0.5 : 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
          </button>
        </div>
        <div style={{ textAlign: "center", paddingTop: 12, fontSize: 12, color: "#64748b" }}>TixFlow Demo • AI Event Assistant</div>
      </div>
    </div>
  );
}
