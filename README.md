# TixFlow

> AI-powered event assistant for the future of ticketing

<div align="center">

![TixFlow Logo](https://raw.githubusercontent.com/Seenfinity/tixflow/master/frontend/public/logo.svg)

**Built for KYD Labs Ticketing Track @ Solana Graveyard Hackathon**

</div>

## 🎯 What is TixFlow?

TixFlow is an AI agent that helps users discover, book, and coordinate event tickets — automatically. Just tell it what you want, and it handles the rest.

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔍 **Event Discovery** | Find events by artist, location, date, or genre |
| 🎫 **Smart Booking** | Purchase tickets across platforms automatically |
| 📅 **Calendar Sync** | Sync events to Google Calendar with reminders |
| ⏰ **Waitlist** | Get notified when sold-out events have availability |
| 🤖 **AI Agent** | Let your agent handle everything automatically |
| 🔗 **NFT Tickets** | Tickets as cNFTs on Solana |

## 🏗️ Architecture

```
tixflow/
├── frontend/          # Next.js 14 web app
│   ├── src/app/      # App router pages
│   └── public/        # Static assets
├── skill/            # OpenClaw agent skill
│   ├── scripts/       # Core functions
│   └── skill.json     # Skill manifest
└── README.md
```

## 🚀 Demo

**[Live Demo →](https://frontend-smoky-seven-13.vercel.app)**

Try these prompts:
- "Find classical music concerts in London"
- "Sync this to my calendar"
- "I want to buy tickets"

## 🛠️ Tech Stack

- **Frontend:** Next.js 14, TypeScript
- **Agent:** OpenClaw with custom TixFlow skill
- **Blockchain:** Solana (NFT tickets via KYD Protocol)
- **Integrations:** Google Calendar API

## 📦 Installation

### As an AI Agent
```bash
clawhub install tixflow
```

### Run Locally
```bash
cd frontend
npm install
npm run dev
```

## 🎪 Solana Graveyard Hackathon

This project is submitted to the **KYD Labs Ticketing Track** at Solana Graveyard Hackathon.

We're building the future of event ticketing — where AI agents handle the complexity of finding, comparing, and purchasing tickets so humans don't have to.

## 🤝 Connect

- **Author:** [@Seenfinity](https://github.com/Seenfinity)
- **Demo:** https://frontend-smoky-seven-13.vercel.app
- **Skill:** clawhub.com/skill/tixflow

## 📄 License

MIT
