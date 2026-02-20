# TixFlow 🤖🎫

AI-powered event assistant that helps users discover, purchase, and coordinate event tickets.

## Features

- **Event Discovery** - Find events based on preferences, artists, location
- **Smart Purchase** - Monitor prices, compare options, buy tickets
- **Calendar Sync** - Automatically sync events to Google Calendar
- **Waitlist Management** - Get notified when sold-out events have availability
- **Event Coordination** - Coordinate with friends, split payments, group bookings

## Project Structure

```
event-agent/
├── frontend/          # Next.js web application
│   ├── src/
│   │   ├── app/     # Next.js app router
│   │   └── components/
│   └── public/
├── skill/           # OpenClaw agent skill
│   ├── skill.json
│   └── src/
└── docs/            # Documentation
```

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Agent**: OpenClaw Agent with custom skills
- **APIs**: Google Calendar API, KYD Labs Protocol

## Getting Started

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### OpenClaw Skill

See `skill/` directory for OpenClaw skill configuration.

## Use Cases

1. User asks: "Find classical music concerts in London this weekend"
2. Agent searches events, shows options
3. User selects one, agent checks availability
4. Agent syncs to Google Calendar
5. Agent monitors for price drops or cancellations

## Demo

[View Live Demo](https://event-agent-demo.vercel.app)

## License

MIT
