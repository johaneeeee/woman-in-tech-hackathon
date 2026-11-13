# Lalin — design plan

"Look after yourself. Look after the island."

## Ground
- **Subject:** a moon-synced self-care game where small daily quests heal your own lagoon, and the energy you earn cleans real Mauritian beaches.
- **Who:** girls and young women in Mauritius, 13–24. Phone in bed at night or on the bus to Curepipe; fluent in games, allergic to "motivational" apps.
- **Core action:** tick a quest → light flows into the lagoon and something heals.
- **Moment of use:** 2 minutes, morning or before sleep. Calm. One thumb.

## Three directions
1. **Picture-book dawn** — warm milk page, peach/mint/honey/misty pastels, Fredoka display + Nunito body, soft layered SVG lagoon at the top of Home. *Kept: it is exactly the brief ("a warm blanket at sunrise by the lagoon").*
2. Night sticker arcade — indigo, neon turquoise, hard offset shadows. Lost: the user's second, later brief replaced it with a soft, cocooning look.
3. Editorial tide-chart — New York serif, ink-on-paper, moon tables. Lost: too cold and grown-up for 13-year-olds; no play.

## Palette (tokens in src/global.css, art copies in src/constants/theme.ts)
| name | hex | role / token |
|---|---|---|
| Warm milk | #FFF6EF | `--background` |
| Soft cocoa | #4A3B47 | `--foreground` (never pure black) |
| Peach | #FFC9B5 | Body world, main buttons `bg-peach` |
| Mint lagoon | #BFE8DF | Mind world, water `bg-mint` |
| Honey | #FFE3A8 | Glow world, stars, rewards `bg-honey` |
| Misty blue | #CFE0F5 | Learn world `bg-mist` |
| Lavender moon | #E3D7F7 | moon, Circles `bg-lavender` |
| Soft turquoise | #7FD6C7 | healed lagoon, key highlights `bg-turquoise` |
Accent (`--accent`, tab tint) is a deeper clay-peach #D9826B so selected tabs stay legible. Light-only by design: the dawn is the identity; the app locks to the light theme.

## Type
- Display: **Fredoka SemiBold**, 36–56 pt headlines, big numerals (energy, stars).
- Body: **Nunito** Medium/Bold/ExtraBold, generous leading.
- Voice: short sentences, dry and warm. Kreol only for greetings and small rewards ("Bonzour", "Bravo", "Alé").

## Imagery
No photos, no stock. Everything is drawn in-app as soft layered shapes with gentle gradients, no outlines: the lagoon, the moon, the island map, the beach runs. One "shoot": dawn light, peach sky, mint water, lavender moon.

## Shell
```
┌──────────────────────────────┐
│ (content scrolls under bar)  │
│                              │
├──────────────────────────────┤
│ Lagoon  Learn  Run  Circle  Progress │  native glass tab bar, cocoa/clay tint
└──────────────────────────────┘
```
Root Stack (no headers) → tabs group + pushed: quest/[id], breathe, run/[level] (full-screen game), level/[id] (form sheet), leaderboard, letter, help, onboarding.

## Screens
**Home (Lagoon)** — drawn two ways:
```
A (kept)                        B
┌────────────────────────┐      ┌────────────────────────┐
│ ◐ Waxing crescent · 12d│      │ Bonzour Anaïs          │
│ ☁  pale moon     ~~~~~ │      │ [stat][stat][stat]     │
│   LAGOON ILLUSTRATION  │      │ lagoon thumbnail       │
│  coral · plastic · fish│      │ quests…                │
│ ~~~~~~~~~~~~~~~~~~~~~~ │      └────────────────────────┘
├ Bonzour Anaïs          ┤
│ 🔥3  ☾ 4 energy  Coral │  ← chips, each next to its meaning
│ Today · Waxing: build  │
│ (Body)(Mind)(Glow)(Learn) quest pills, world-coloured
│ Real Mission ▓▓▓░░ 3,412/10,000
│ Lalin Run card  ★ 7/18 │
└────────────────────────┘
```
A wins: the lagoon is the thesis; numbers sit next to what they mean.

**Quest detail** — compact lagoon at top, quest title (display), description, world colour wash, big pill "Done". Mood / journal / breathing / cards quests embed their own control.
**Breathe** — full-screen mint→misty gradient, breathing circle over slow waves, "Breathe in / Breathe out", 1:00 countdown, sound toggle.
**Learn** — today's Myth-or-Fact stack (5), tilt-swipe, explanation card; "Need to talk" card.
**Run** — island map at dawn, dotted coastal path, 6 beach nodes; tap → form-sheet level card → full-screen run.
**Circle** — big shared moon that fills as members finish a quest; member avatars with today's status; message chips (4 fixed lines).
**Progress** — lagoon level, moon badges, XP, week of mood faces, plastic, stars, Moon Letters.
**Leaderboard & Mission**, **Need to talk** — calm lists.

## Motion (dial: calm)
Timing only, ease-in-out, slow. Ambient loops (waves, floating avatar, breathing node) use the `ambient` tokens. Presses scale 0.97 (HeroUI) with a light haptic.

## Signature moment — "Light into the lagoon"
On Done, a warm honey orb lifts off the button, drifts up into the lagoon, and as it lands the coral blooms a shade warmer, water clears a step, a piece of plastic fades, and soft sparkles drift up. Success haptic, "+1 Moon Energy" counts up. Lagoon level-up → one slow pastel confetti fall with the new level name. Run: stars glow in one by one; 3 stars → confetti.

## Unmistakable
Your self-care is literally drawn as a reef you watch come back to life, under the real moon over Mauritius.

## Plan check
First draft opened Home on a greeting + stat chips (default look #4). Moved the lagoon to the top as the hero and folded the numbers into chips beside their meaning. Quests became world-coloured pills, not grey "meta · meta" rows.
