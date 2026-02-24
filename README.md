# TixFlow 🎫🤖

> AI-powered event concierge for the future of ticketing

<div align="center">

**Built for KYD Labs Solana Graveyard Hackathon**

**Live Demo**: [https://frontend-smoky-seven-13.vercel.app/chat](https://frontend-smoky-seven-13.vercel.app/chat)

</div>

## 🎯 What is TixFlow?

TixFlow is an AI agent that helps users discover, book, and coordinate event tickets — automatically. Just tell it what you want, and it handles the rest.

## ✨ Features (Demo Working)

| Feature | Status | Description |
|---------|--------|-------------|
| 🔍 **AI Discovery** | ✅ | Natural language event search |
| 📅 **Calendar Sync** | ✅ | Add events to Google Calendar with direct links |
| 🗺️ **Transport Routes** | ✅ | Find best routes via Google Maps API |
| 🎟️ **cNFT Tickets** | ✅ | Real on-chain cNFT minted via CrossMint |
| 👻 **Ghost Mode** | 🔜 | Buy tickets anonymously |

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 + TypeScript + Tailwind
- **Blockchain**: Solana (Devnet)
- **NFT Standard**: cNFT via CrossMint API
- **Wallet**: Phantom Wallet Integration
- **AI**: Natural language processing

## 🔄 How It Works

```
User: "Find concerts in London this weekend"
    ↓
TixFlow: Searches events + shows options
    ↓
User: "Buy 2 tickets for [event]"
    ↓
TixFlow: Mints cNFT directly to user's wallet via CrossMint
    ↓
User: "Add to my calendar"
    ↓
TixFlow: Generates Google Calendar link
    ↓
User: "How do I get there?"
    ↓
TixFlow: Shows best transport route via Google Maps
```

## 🚀 Demo

**Live**: [https://frontend-smoky-seven-13.vercel.app/chat](https://frontend-smoky-seven-13.vercel.app/chat)

### Try these commands:

- "Find concerts in London"
- "Buy a ticket for that event"
- "Add it to my calendar"
- "How do I get there?"

## 🛠️ Development

```bash
# Clone the repo
git clone https://github.com/Seenfinity/tixflow.git
cd tixflow/frontend

# Install dependencies
npm install

# Run locally
npm run dev
```

### Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_HELIUS_RPC=your-helius-rpc-url
CROSSMINT_API_KEY=your-crossmint-api-key
CROSSMINT_COLLECTION_ID=your-collection-id
```

## 🔗 Links

- **Live Demo**: https://frontend-smoky-seven-13.vercel.app/chat
- **GitHub**: https://github.com/Seenfinity/tixflow

## 📄 License

MIT

---

*Built with ❤️ by Seenfinity for KYD Labs Solana Graveyard Hackathon*
