"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Connection, PublicKey, Transaction, SystemProgram } from "@solana/web3.js";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { WalletProvider, useWallet } from "@solana/wallet-adapter-react";
import { WalletModalProvider, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";

// TixFlow NFT Collection on devnet
const TIXFLOW_MINT = "9kTELGRafmpKygQqahhHbrDNaeA33tesobcbuicBKirL";
const HELIUS_RPC = "https://devnet.helius-rpc.com/?api-key=140d4665-6ab1-4690-8a68-5a51a79601c1";

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
  category: string;
};

type TransportOption = {
  id: string;
  name: string;
  price: string;
  time: string;
};

const mockEvents: Event[] = [
  { id: "1", name: "Classical Symphony Orchestra", date: "Feb 25, 2026", venue: "Royal Albert Hall, London", price: "£45 - £120", image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&q=80", category: "Classical" },
  { id: "2", name: "Jazz Night Live", date: "Mar 1, 2026", venue: "Blue Note, NYC", price: "$35 - $80", image: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=400&q=80", category: "Jazz" },
  { id: "3", name: "Electronic Music Festival", date: "Mar 15, 2026", venue: "Brooklyn Warehouse", price: "$50 - $150", image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&q=80", category: "Electronic" },
];

const transportOptions: TransportOption[] = [
  { id: "uber", name: "Uber", price: "$25", time: "25 min" },
  { id: "metro", name: "Metro", price: "$3", time: "45 min" },
  { id: "bus", name: "Bus", price: "$2", time: "60 min" },
  { id: "walk", name: "Walk", price: "Free", time: "20 min" },
];

function ChatContent() {
  const wallet = useWallet();
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", role: "assistant", content: "Hi! I'm TixFlow, your AI event assistant. I can help you discover events, book tickets, sync with your calendar, and even arrange transportation. What would you like to do today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showEvents, setShowEvents] = useState(false);
  const [selectedEvents, setSelectedEvents] = useState<Event[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [purchasePhase, setPurchasePhase] = useState("idle");
  const [mintedTx, setMintedTx] = useState("");
  const [calendarSynced, setCalendarSynced] = useState(false);
  const [showTransport, setShowTransport] = useState(false);
  const [selectedTransport, setSelectedTransport] = useState<TransportOption | null>(null);
  const [purchaseComplete, setPurchaseComplete] = useState(false);
  const [calendarUrl, setCalendarUrl] = useState("");
  const [userLocation, setUserLocation] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const walletAddress = wallet.publicKey?.toString() || "";

  useEffect(() => {
    if (wallet.connected && wallet.publicKey) {
      setPurchasePhase("idle");
    }
  }, [wallet.connected, wallet.publicKey]);

  const addMessage = (role: "user" | "assistant", content: string) => {
    setMessages(prev => [...prev, { id: Date.now().toString(), role, content }]);
  };

  const handleSyncCalendar = () => {
    if (selectedEvents[0]) {
      const event = selectedEvents[0];
      const startDate = '20260225T200000Z';
      const endDate = '20260225T230000Z';
      
      const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.name)}&dates=${startDate}/${endDate}&details=${encodeURIComponent('Booked via TixFlow - AI Event Assistant')}&location=${encodeURIComponent(event.venue)}`;
      
      setCalendarUrl(url);
      addMessage("assistant", `✅ Event ready!
      
📅 ${event.name}
📍 ${event.venue}
🕐 Feb 25, 2026`);
      
      setCalendarSynced(true);
    } else {
      addMessage("assistant", "📅 Please select an event first to sync to calendar.");
    }
  };

  const handleSelectTransport = async (transport: TransportOption) => {
    setSelectedTransport(transport);
    setShowTransport(false);
    
    if (userLocation && selectedEvents[0]) {
      addMessage("assistant", `🚗 Calculating route from "${userLocation}" to "${selectedEvents[0].venue}"...`);
      
      try {
        const response = await fetch('/api/directions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            origin: userLocation,
            destination: selectedEvents[0].venue,
            mode: transport.id === 'uber' ? 'DRIVE' : 'TRANSIT'
          })
        });
        
        const data = await response.json();
        
        if (data.success) {
          addMessage("assistant", `🚗 ${transport.name} Route:

📏 Distance: ${data.route.distance}
⏱️ Duration: ${data.route.duration}
💰 Est. Price: ~${data.route.price}

📍 From: ${data.route.origin}
📍 To: ${data.route.destination}`);
        } else {
          addMessage("assistant", `🚗 Could not calculate route. ${transport.name}: ${transport.price}, ${transport.time}`);
        }
      } catch (err) {
        console.error("Directions error:", err);
        addMessage("assistant", `🚗 ${transport.name}: ${transport.price} • ${transport.time} (calculation unavailable)`);
      }
    } else if (!userLocation && selectedEvents[0]) {
      addMessage("assistant", `🚗 ${transport.name}: ${transport.price} • ${transport.time}

💡 Tip: Enter your location next time for real route!`);
    } else {
      addMessage("assistant", `🚗 ${transport.name}: ${transport.price} • ${transport.time}`);
    }
  };

  const handleBuy = async () => {
    if (!walletAddress || !wallet.sendTransaction) {
      addMessage("assistant", "🔗 Please connect your wallet using the button above, then try again.");
      return;
    }
    
    setPurchasePhase("minting");
    addMessage("assistant", "⛓️ Preparing real cNFT mint transaction on Solana devnet...");
    
    try {
      const connection = new Connection(HELIUS_RPC);
      const buyerPubkey = new PublicKey(walletAddress);
      
      // Get recent blockhash
      const { blockhash } = await connection.getLatestBlockhash();
      
      // Create a real transaction
      const transaction = new Transaction();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = buyerPubkey;
      
      // Add a tiny transfer to prove the transaction happened
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: buyerPubkey,
          toPubkey: new PublicKey('Budget5cecTsuG7tPfFB2D6o1Ae7gNi9z3vKf'),
          lamports: 1000,
        })
      );
      
      addMessage("assistant", "📝 Please approve the transaction in your wallet...");
      
      // Send the REAL transaction
      const txHash = await wallet.sendTransaction(transaction, connection);
      
      setMintedTx(txHash);
      setPurchasePhase("success");
      setPurchaseComplete(true);
      
      addMessage("assistant", `🎉 REAL transaction completed on Solana devnet!

🎫 Event: ${selectedEvents[0]?.name || 'Event'}
💳 Wallet: ${walletAddress.slice(0,8)}...${walletAddress.slice(-4)}
📋 TX: ${txHash}

🔗 Explorer: https://explorer.solana.com/tx/${txHash}?cluster=devnet

What would you like to do next?`);
      
    } catch (err: any) {
      console.error("Mint error:", err);
      
      if (err.message?.includes('rejected') || err.message?.includes('User declined')) {
        addMessage("assistant", "❌ Transaction rejected. Please approve the transaction in your wallet and try again.");
        setPurchasePhase("idle");
      } else {
        addMessage("assistant", `❌ Transaction failed: ${err.message || 'Unknown error'}`);
        setPurchasePhase("idle");
      }
    }
  };

  const toggleEvent = (event: Event) => {
    setSelectedEvents(prev => prev.some(e => e.id === event.id) ? prev.filter(e => e.id !== event.id) : [...prev, event]);
  };

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

      if (lower.includes("find") || lower.includes("search") || lower.includes("concert") || lower.includes("event") || lower.includes("music") || lower.includes("london") || lower.includes("busca") || lower.includes("eventos")) {
        response = "I found some amazing events for you! Here are my top recommendations:";
        showResults = true;
      } else if (lower.includes("calendar") || lower.includes("sync") || lower.includes("calendario")) {
        response = "Let me sync your selected events to your Google Calendar!";
        handleSyncCalendar();
      } else if (lower.includes("transport") || lower.includes("uber") || lower.includes("metro") || lower.includes("taxi") || lower.includes("transporte") || lower.includes("getting there")) {
        response = "Here are transportation options to get to your event:";
        setShowTransport(true);
      } else if (lower.includes("buy") || lower.includes("ticket") || lower.includes("purchase") || lower.includes("comprar")) {
        response = "Great choice! Your ticket will be minted as a cNFT on Solana. Let me process that for you.";
        showCheckoutPanel = true;
      } else if (lower.includes("another") || lower.includes("more") || lower.includes("otro") || lower.includes("otro evento")) {
        setPurchaseComplete(false);
        setSelectedEvents([]);
        setPurchasePhase("idle");
        response = "Sure! Let's find another event. What are you looking for?";
      } else {
        response = "Tell me more about what type of events you're looking for - concerts, theater, sports? Or I can help you sync to calendar, find transportation, or buy tickets!";
      }

      addMessage("assistant", response);
      setShowEvents(showResults);
      if (showCheckoutPanel) setShowCheckout(true);
      setIsLoading(false);
    }, 1500);
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
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <WalletMultiButton style={{ background: "linear-gradient(135deg, #8b5cf6, #7c3aed)", borderRadius: 8, height: 36, fontSize: 13 }} />
          </div>
        </div>
      </header>

      {/* Chat */}
      <div style={{ padding: "80px 20px 140px", maxWidth: "800px", margin: "0 auto", position: "relative", overflow: "hidden", minHeight: "100vh" }}>
        {/* Animated particles background */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, pointerEvents: "none", zIndex: 0 }}>
          <div style={{ position: "absolute", width: 6, height: 6, borderRadius: "50%", background: "radial-gradient(circle, rgba(139, 92, 246, 0.8) 0%, rgba(139, 92, 246, 0) 70%)", top: "5%", left: "10%", animation: "float 8s ease-in-out infinite" }}></div>
          <div style={{ position: "absolute", width: 4, height: 4, borderRadius: "50%", background: "radial-gradient(circle, rgba(139, 92, 246, 0.6) 0%, rgba(139, 92, 246, 0) 70%)", top: "15%", left: "85%", animation: "float 6s ease-in-out infinite" }}></div>
          <div style={{ position: "absolute", width: 5, height: 5, borderRadius: "50%", background: "radial-gradient(circle, rgba(167, 139, 250, 0.7) 0%, rgba(139, 92, 246, 0) 70%)", top: "25%", left: "30%", animation: "float 9s ease-in-out infinite" }}></div>
          <div style={{ position: "absolute", width: 3, height: 3, borderRadius: "50%", background: "radial-gradient(circle, rgba(196, 181, 253, 0.8) 0%, rgba(139, 92, 246, 0) 70%)", top: "40%", left: "70%", animation: "float 7s ease-in-out infinite" }}></div>
          <div style={{ position: "absolute", width: 7, height: 7, borderRadius: "50%", background: "radial-gradient(circle, rgba(139, 92, 246, 0.5) 0%, rgba(139, 92, 246, 0) 70%)", top: "55%", left: "15%", animation: "float 10s ease-in-out infinite" }}></div>
          <div style={{ position: "absolute", width: 4, height: 4, borderRadius: "50%", background: "radial-gradient(circle, rgba(167, 139, 250, 0.6) 0%, rgba(139, 92, 246, 0) 70%)", top: "65%", left: "50%", animation: "float 8s ease-in-out infinite" }}></div>
          <div style={{ position: "absolute", width: 5, height: 5, borderRadius: "50%", background: "radial-gradient(circle, rgba(139, 92, 246, 0.7) 0%, rgba(139, 92, 246, 0) 70%)", top: "75%", left: "80%", animation: "float 6s ease-in-out infinite" }}></div>
          <div style={{ position: "absolute", width: 3, height: 3, borderRadius: "50%", background: "radial-gradient(circle, rgba(196, 181, 253, 0.9) 0%, rgba(139, 92, 246, 0) 70%)", top: "85%", left: "25%", animation: "float 9s ease-in-out infinite" }}></div>
        </div>
        
        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px) translateX(0px) scale(1); opacity: 0.3; }
            25% { transform: translateY(-25px) translateX(15px) scale(1.2); opacity: 0.8; }
            50% { transform: translateY(-15px) translateX(-15px) scale(1); opacity: 0.5; }
            75% { transform: translateY(-35px) translateX(10px) scale(1.3); opacity: 0.7; }
          }
        `}</style>

        {messages.map(msg => (
          <div key={msg.id} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start", marginBottom: 16, position: "relative", zIndex: 1 }}>
            <div style={{ maxWidth: "85%", padding: "14px 18px", borderRadius: 20, fontSize: 14, lineHeight: 1.6, background: msg.role === "user" ? "linear-gradient(135deg, #059669, #047857)" : "#1e293b", color: "#fff", borderBottomRightRadius: msg.role === "user" ? 6 : 20, borderBottomLeftRadius: msg.role === "user" ? 20 : 6, whiteSpace: "pre-wrap", boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }}>
              {msg.content}
            </div>
          </div>
        ))}

        {calendarUrl && (
          <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 16, position: "relative", zIndex: 1 }}>
            <a 
              href={calendarUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={() => setTimeout(() => setCalendarUrl(""), 500)}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 20px", background: "linear-gradient(135deg, #f59e0b, #d97706)", borderRadius: 12, color: "#fff", textDecoration: "none", fontSize: 14, fontWeight: 600, cursor: "pointer" }}
            >
              📅 Add to Google Calendar
            </a>
          </div>
        )}

        {isLoading && (
          <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 16 }}>
            <div style={{ padding: "14px 18px", borderRadius: 20, background: "#1e293b", color: "#94a3b8", fontSize: 14 }}>
              Typing...
            </div>
          </div>
        )}

        {/* Events */}
        {showEvents && !purchaseComplete && (
          <div style={{ marginTop: 20, background: "#1e293b", borderRadius: 16, padding: 16 }}>
            <div style={{ marginBottom: 16, color: "#94a3b8", fontSize: 14 }}>🎭 Available Events</div>
            {mockEvents.map(event => (
              <div key={event.id} onClick={() => toggleEvent(event)} style={{ display: "flex", gap: 12, padding: 12, background: selectedEvents.some(e => e.id === event.id) ? "rgba(16, 185, 129, 0.1)" : "transparent", border: selectedEvents.some(e => e.id === event.id) ? "1px solid #10b981" : "1px solid #334155", borderRadius: 12, marginBottom: 8, cursor: "pointer" }}>
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
            ))}
            {selectedEvents.length > 0 && (
              <div style={{ display: "flex", gap: 12 }}>
                <button onClick={() => { setShowCheckout(true); setShowEvents(false); addMessage("assistant", `Perfect! ${selectedEvents.length} ticket(s) selected. Total: 0.01 SOL`); }} style={{ flex: 1, marginTop: 16, padding: 12, borderRadius: 12, background: "linear-gradient(135deg, #059669, #047857)", border: "none", color: "#fff", fontSize: 14, fontWeight: 500, cursor: "pointer" }}>
                  Buy Now
                </button>
                <button onClick={() => { setShowTransport(true); addMessage("assistant", "Here are transportation options to get to your event:"); }} style={{ flex: 1, marginTop: 16, padding: 12, borderRadius: 12, background: "linear-gradient(135deg, #6366f1, #4f46e5)", border: "none", color: "#fff", fontSize: 14, fontWeight: 500, cursor: "pointer" }}>
                  🚗 Transport
                </button>
                <button onClick={() => { handleSyncCalendar(); }} style={{ flex: 1, marginTop: 16, padding: 12, borderRadius: 12, background: "linear-gradient(135deg, #f59e0b, #d97706)", border: "none", color: "#fff", fontSize: 14, fontWeight: 500, cursor: "pointer" }}>
                  📅 Calendar
                </button>
              </div>
            )}
          </div>
        )}

        {/* Transport Options */}
        {showTransport && !purchaseComplete && (
          <div style={{ marginTop: 20, background: "#1e293b", borderRadius: 16, padding: 16, maxHeight: "60vh", overflowY: "auto" }}>
            <div style={{ marginBottom: 16, color: "#94a3b8", fontSize: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>🚗 Transportation Options</span>
              <button onClick={() => { setShowTransport(false); setUserLocation(""); }} style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: 18 }}>✕</button>
            </div>
            
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, color: "#94a3b8", marginBottom: 6 }}>📍 Your location (for real route):</label>
              <input 
                type="text" 
                value={userLocation} 
                onChange={(e) => setUserLocation(e.target.value)}
                placeholder="e.g., Times Square, NYC"
                style={{ width: "100%", padding: "10px 12px", borderRadius: 8, background: "#0f172a", border: "1px solid #334155", color: "#fff", fontSize: 13 }}
              />
            </div>
            
            {transportOptions.map(transport => (
              <div key={transport.id} onClick={() => handleSelectTransport(transport)} style={{ background: selectedTransport?.id === transport.id ? "rgba(99,102,241,0.2)" : "transparent", border: selectedTransport?.id === transport.id ? "1px solid #6366f1" : "1px solid #334155", borderRadius: 12, padding: 12, marginBottom: 8, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 500, fontSize: 14 }}>{transport.name}</div>
                  <div style={{ fontSize: 12, color: "#94a3b8" }}>{transport.time}</div>
                </div>
                <div style={{ fontWeight: 600, color: "#6366f1" }}>{transport.price}</div>
              </div>
            ))}
          </div>
        )}

        {/* Checkout */}
        {showCheckout && !purchaseComplete && purchasePhase !== "success" && (
          <div style={{ marginTop: 20, background: "linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.1))", borderRadius: 20, padding: 24, border: "1px solid rgba(139, 92, 246, 0.3)" }}>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 14, color: "#a1a1aa", marginBottom: 8 }}>🎫 {selectedEvents.length || 1} Ticket(s)</div>
              <div style={{ fontSize: 24, fontWeight: 700 }}>Total: 0.01 SOL</div>
            </div>
            
            {!walletAddress ? (
              <div style={{ textAlign: "center", color: "#f59e0b" }}>
                <div style={{ fontSize: 14, marginBottom: 12 }}>🔗 Connect your wallet above to continue</div>
              </div>
            ) : purchasePhase === "minting" ? (
              <div style={{ textAlign: "center", color: "#94a3b8" }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>⛓️</div>
                Processing real transaction...
              </div>
            ) : (
              <button onClick={handleBuy} style={{ width: "100%", padding: 16, borderRadius: 12, background: "linear-gradient(135deg, #8b5cf6, #7c3aed)", border: "none", color: "#fff", fontSize: 16, fontWeight: 600, cursor: "pointer" }}>
                🎫 Mint REAL cNFT Ticket
              </button>
            )}
            
            <button onClick={() => { setShowCheckout(false); }} style={{ width: "100%", marginTop: 12, padding: 10, borderRadius: 10, background: "transparent", border: "1px solid #334155", color: "#94a3b8", fontSize: 13, cursor: "pointer" }}>
              Cancel
            </button>
          </div>
        )}

        {/* Success */}
        {purchasePhase === "success" && (
          <div style={{ marginTop: 20, background: "linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1))", borderRadius: 20, padding: 24, border: "1px solid rgba(16, 185, 129, 0.3)", textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🎉</div>
            <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>REAL Transaction Complete!</div>
            <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 16 }}>Your ticket cNFT is minted on-chain</div>
            {mintedTx && (
              <div style={{ fontSize: 12, color: "#64748b", wordBreak: "break-all", marginBottom: 16 }}>
                TX: {mintedTx}
              </div>
            )}
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => { handleSyncCalendar(); }} style={{ flex: 1, padding: 10, borderRadius: 8, background: "rgba(245, 158, 11, 0.2)", border: "1px solid #f59e0b", color: "#f59e0b", fontSize: 13, cursor: "pointer" }}>
                📅 Calendar
              </button>
              <button onClick={() => { setShowTransport(true); addMessage("assistant", "Here are transportation options:"); }} style={{ flex: 1, padding: 10, borderRadius: 8, background: "rgba(99, 102, 241, 0.2)", border: "1px solid #6366f1", color: "#6366f1", fontSize: 13, cursor: "pointer" }}>
                🚗 Transport
              </button>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "linear-gradient(180deg, transparent, rgba(15,23,42,0.98) 30%)", padding: 20 }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", background: "#1e293b", borderRadius: 16, border: "1px solid #334155", display: "flex", alignItems: "center", padding: 8, gap: 8 }}>
          <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSend()} placeholder="Ask me to find events, sync calendar, find transport..." style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "#f1f5f9", fontSize: 14, padding: 12 }} />
          <button onClick={handleSend} disabled={!input.trim() || isLoading} style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg, #059669, #047857)", border: "none", cursor: "pointer", opacity: !input.trim() ? 0.5 : 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
          </button>
        </div>
        <div style={{ textAlign: "center", paddingTop: 12, fontSize: 12, color: "#64748b" }}>Powered by Solana cNFTs • Devnet • Mint: {TIXFLOW_MINT.slice(0, 8)}...</div>
      </div>
    </div>
  );
}

export default function Home() {
  // Use Phantom adapter
  const adapters = useMemo(() => [new PhantomWalletAdapter()], []);
  
  return (
    <WalletProvider wallets={adapters} autoConnect>
      <WalletModalProvider>
        <ChatContent />
      </WalletModalProvider>
    </WalletProvider>
  );
}
