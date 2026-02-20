# TixFlow - Technical Specification

## Overview

AI-powered event assistant that helps users discover, purchase, and coordinate event tickets. Built for KYD Labs Ticketing Track in Solana Graveyard Hackathon.

## Features

### 1. Event Discovery
- Search events by type, location, date, budget
- Compare prices across platforms
- Get personalized recommendations based on preferences

### 2. Smart Purchase
- Purchase tickets via KYD Protocol
- NFT-based tickets (cNFT on Solana)
- Instant settlement and verification

### 3. Calendar Integration
- Sync events to Google Calendar automatically
- Set reminders for upcoming events
- Send notifications before events

### 4. Waitlist Management
- Add users to waitlists for sold-out events
- Monitor for cancellations
- Auto-purchase when tickets available

## Architecture

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│  Frontend   │────▶│  OpenClaw    │────▶│   KYD Labs  │
│  (Chat UI)  │     │   Agent      │     │  Protocol   │
└─────────────┘     └──────────────┘     └─────────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │   Google     │
                    │   Calendar   │
                    └──────────────┘
```

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Framer Motion
- **Agent**: OpenClaw Agent with custom skill
- **Blockchain**: Solana (cNFT tickets via KYD)
- **APIs**: Google Calendar API

## OpenClaw Skill

See `skill/` directory for the OpenClaw skill configuration.

### Tools
- `google_calendar` - Sync events to user's calendar
- `kyd_protocol` - Purchase and mint tickets
- `event_scraper` - Search events from various sources

### Commands
- `find_events` - Search for events
- `get_event_details` - Get event information
- `purchase_ticket` - Buy tickets
- `sync_to_calendar` - Add to calendar
- `add_to_waitlist` - Join waitlist

## Frontend

See `frontend/` directory for the web application.

### Pages
- `/` - Chat interface with event agent

### Components
- ChatMessage - Display user/assistant messages
- EventCard - Show event information
- EventList - Display search results

## Environment Variables

```
# Google Calendar (optional)
GOOGLE_CALENDAR_API_KEY=your_api_key

# KYD Labs Protocol (optional)
KYD_API_KEY=your_api_key
```

## Getting Started

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### OpenClaw Skill
```bash
# Install skill
/skills install event-agent
```

## Demo

The frontend includes a demo mode with mock event data for testing purposes.

## License

MIT
