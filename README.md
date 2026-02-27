# Tixflow

every time you want to go to an event, you open four tabs, scroll through two ticket platforms, check your calendar, forget to buy, and then see someone posting about it the day after.

tixflow is an AI agent that collapses that whole mess into a conversation. you describe what you want, it finds it, books it, mints your ticket on Solana, syncs your calendar, and even tells you how to get there. the goal was simple: make going to things feel as easy as thinking about going to things.

> Started at the Solana Graveyard Hackathon.

**→ [try the demo](https://www.tixflow.fun/)**

---

## What it does

you type something like *"find me a concert in NYC this weekend"* and tixflow handles the rest. the full flow in practice:

```
"Find concerts in NYC this weekend"
  → searches real events from KYD Labs

"Buy 2 tickets for Gary Bartz"
  → mints a cNFT directly to your wallet via CrossMint

"Add it to my calendar"
  → generates a Google Calendar link

"How do I get there?"
  → shows the best route via Google Maps
```

the features that are live right now:

- **natural language search** — real events from KYD Labs, no filters needed
- **cNFT tickets** — minted on-chain via CrossMint API, straight to your wallet
- **calendar sync** — Google Calendar integration, one step
- **transport routes** — Google Maps directions to the venue
- **waitlists** — get notified when sold-out events open up

x402 streaming payments (so agents can buy tickets on your behalf autonomously) are coming next.

---

## the skill — for AI agents

tixflow isn't just a chat interface. it's also an installable skill for AI agents. if you're building on OpenClaw or ClawHub, you can give your agent the full ticketing flow in one install.

```bash
# via ClawHub
clawhub install tixflow

# or directly in OpenClaw
/skills install tixflow
```

once installed, your agent gets access to: `findEvents`, `purchaseTicket`, `syncToCalendar`, `getDirections`, `addToWaitlist`, and `checkPrices`.

the skill needs these env vars to run:

```env
GOOGLE_CALENDAR_API_KEY=your-key
GOOGLE_MAPS_API_KEY=your-key
```

---

## stack — and why

**Next.js 14 + TypeScript + Tailwind** for the frontend. Next for SSR on event search pages, TypeScript because the data shapes from ticketing APIs are inconsistent enough that you want the compiler catching mismatches, not runtime errors.

**Solana + CrossMint (cNFTs)** for ticket minting. CrossMint handles the minting API so users don't need to manage keypairs themselves — they just receive the cNFT in their wallet. we chose cNFTs over regular NFTs because the cost per ticket is negligible at scale: data lives off-chain in a Merkle tree, only the root is anchored on-chain.

**Phantom Wallet** because it's where most Solana users already are. wallet-as-identity means we don't need to build auth.

**Google Maps + Google Calendar APIs** for the post-purchase flow. the insight here was that buying the ticket is only half the job — getting people to actually show up is the other half.

---

## run it locally

```bash
git clone https://github.com/Seenfinity/tixflow.git
cd tixflow/frontend
npm install
npm run dev
```

create a `.env.local` with:

```env
NEXT_PUBLIC_HELIUS_RPC=your-helius-rpc-url
CROSSMINT_API_KEY=your-crossmint-api-key
CROSSMINT_COLLECTION_ID=your-collection-id
```

open `localhost:3000` and start from the chat. for the full minting flow you'll need Phantom installed and switched to Devnet.

---

## links

- demo → https://www.tixflow.fun/chat
- repo → https://github.com/Seenfinity/tixflow

---

## license

MIT — do whatever, just don't resell tickets with it. that's the whole problem we're solving.
