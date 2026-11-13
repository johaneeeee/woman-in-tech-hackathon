# Lalin 🌙

> *Look after yourself. Look after the island.*

Lalin is a gamified self-care, confidence and island-care app for girls and young women in Mauritius (13–24). Small daily quests heal your own animated lagoon, synced to the real moon phase, and the energy you earn goes toward cleaning real Mauritian beaches.

Built for the **Woman in Tech Hackathon**.

## The idea

Most wellbeing apps feel like homework. Lalin turns two minutes of self-care, morning or before sleep, into something you can watch come back to life: tick a quest, and a ball of light flows into your lagoon. The coral blooms, the water clears, a piece of plastic fades away.

## Features

- **Lagoon (Home):** a living, drawn lagoon that heals as you complete daily quests, with the current moon phase, streak and Moon Energy.
- **Daily quests** across four worlds, themed by moon phase (set intentions, build habits, celebrate, rest):
  - **Body:** water, walks, sleep
  - **Mind:** moods, breathing, one-line journaling
  - **Glow:** small brave things
  - **Learn:** Myth or Fact cards
- **Breathe:** a full-screen guided breathing exercise with a 1-minute timer.
- **Learn:** swipeable Myth-or-Fact cards, plus a "Need to talk" help page.
- **Lalin Run:** a six-level beach game along the Mauritian coast (Flic en Flac, Blue Bay, Belle Mare, Le Morne, Grand Baie, Île aux Cerfs). Dodge obstacles, collect plastic and ghost nets, earn up to 3 stars per level.
- **Circles:** private groups of up to 5 friends sharing a moon that fills as members finish their quest. Communication is limited to four fixed encouragement messages (no free text between users).
- **Leaderboard & community mission:** a weekly leaderboard and a shared plastic-collection goal (10,000 pieces).
- **Progress:** lagoon level, moon badges, XP, a week of mood faces and Moon Letters.

## Privacy and safety by design

- Anonymous: nickname and avatar only, no accounts or personal data.
- No free text between users, only preset encouragement messages.
- Row-level security on the Supabase backend.

## Tech stack

| Area | Tools |
|---|---|
| App | Expo (React Native), Expo Router, TypeScript |
| UI | HeroUI Native, Uniwind (Tailwind v4), React Native Skia, Reanimated |
| State | Zustand + MMKV (local-first) |
| Backend | Supabase (Postgres, RPC functions, row-level security) |
| Tooling | Bun, built with [Newly](https://newly.app) |

## Getting started

### Prerequisites

- [Bun](https://bun.sh)
- Xcode (iOS) or Android Studio (Android), or just a browser for the web build

### Install and run

```bash
bun install
bun run ios       # or: bun run android / bun run web
```

Lalin uses native modules (Skia, MMKV, Pulsar), so it needs a **development build** rather than Expo Go on mobile.

### Checks

```bash
bun run typecheck   # TypeScript
bun run lint:slop   # design-system lint (tokens only, primitives, motion rules)
```

## Backend (Supabase)

Schema and seed data live in `supabase/migrations/`:

1. `20261112090000_lalin_schema.sql`: tables for quests, myth cards, run scores, circles, members, encouragements and missions.
2. `20261112090100_lalin_seed.sql`: initial quests, myth cards and the active mission.

The client in `src/lib/supabase.ts` uses the public anon key, which is safe to ship because access is guarded by row-level security. Never put a service-role key in the app.

To use your own project, create a Supabase project, apply the two migrations, then update `SUPABASE_URL` and `SUPABASE_ANON_KEY` in `src/lib/supabase.ts`.

## Project structure

```
src/
├── app/                 Expo Router screens (tabs, quest, breathe, run, level, leaderboard…)
├── components/          Shared UI primitives (Card, Section, ListRow, Segmented…)
├── features/
│   ├── content/         Quests, worlds, beaches, myth cards and types
│   ├── lalin/           Game engine, lagoon art, stores, community API
│   └── settings/        Settings store
├── hooks/               Cross-feature hooks
├── lib/                 Supabase client, storage, dates, moon phase, motion
└── constants/           Theme fallback palette
design/                  DESIGN.md and dials.json, the locked visual identity
supabase/migrations/     Database schema and seed
```

## Design

A "picture-book dawn" look: warm milk background, peach, mint, honey and misty-blue pastels, Fredoka for display text and Nunito for body text. Everything is drawn in-app with soft layered shapes, with no stock photos. Light theme only. See [`design/DESIGN.md`](design/DESIGN.md) for the full plan.

## License

MIT, see [LICENSE](LICENSE).
