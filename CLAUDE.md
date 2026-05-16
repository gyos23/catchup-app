# CatchUp App — Project Memory

## What This App Is

CatchUp is a personal relationship health tracker. It monitors how often you stay in touch with the people who matter to you, scores each relationship by recency and frequency of contact, and nudges you to reach out when someone is slipping. The core insight is Dunbar's number — humans can only maintain ~150 meaningful relationships, so the app helps you be deliberate about the important ones.

---

## What We Built Together

### Phase 1 — Web App Foundation (Sep 2025)
- React app bootstrapped in CodeSandbox
- `CatchUpDashboard.js` — main dashboard component
- `App.js` / `App.css` — root layout and styles
- Early data model: contacts with health scores based on last-contact dates

### Phase 2 — Major Feature Expansion (Apr 2026, PR #1)
Merged branch `catchup-feature-branch`. Big lift:

**Call Tracking**
- Integrated `CallHistoryDB` (phone, FaceTime audio, FaceTime video) into health scoring
- Calls count toward both recency and frequency metrics

**Filter / Sort / Do Not Track**
- Sort contacts by health score, name, last contact
- Filter by contact type
- Per-contact "Do Not Track" toggle to exclude someone from scoring

**Auto-refresh**
- 30-minute silent data refresh interval so the dashboard stays current without a reload

**About Page**
- Plain-English explanation of how the health score works
- Cites Dunbar science for credibility

**PWA Support**
- `manifest.json` added
- Apple touch icons: 152, 180, 192, 512px
- Safe-area insets for notched phones
- Installable to home screen on iOS/Android

**launchd Background Sync**
- `scripts/catchup-sync-wrapper.sh` — hourly background sync via macOS launchd
- `scripts/sync-imessages.js` — reads iMessage history and writes `relationships.json`

**Design Variants — Classic, Coach, Orbit, Pulse, Focus**
- `src/components/HomeVariants.js` added — houses all variant UIs
- **Focus** (ADA candidate): animated SVG health rings, hero action card, section-based layout
- `AnimatedRing` component: fills 0→score on mount with spring-like cubic-bezier, staggered per contact

### Phase 3 — Polish Pass (Apr 2026, PR #2)
Merged branch `polish-v2`:

- American spelling throughout (`Favorite` not `Favourite`)
- `daysSinceContact` now reads the `lastContactDate` ISO field correctly
- Favorites tab sorts highest health score first
- `yourMove` list skips contacts touched today or already at 100%
- `InsightsRing` animates with spring easing
- Switcher pill floats above the native tab bar (z-index fix)
- Plus icon import fixed (was causing blank-screen crash)
- 7 real contacts loaded from iMessage sync into `public/data/relationships.json`
- `.gitignore` added

### Phase 4 — Color & Header Fixes (May 2026)
- Health ring / score colors corrected: green (good), orange (warning), red (critical)
- Blue header applied to the Focus variant
- Orbit and Pulse variants removed from the design switcher

### Phase 5 — iOS SwiftUI Scaffold (Apr 2026)
- `catchup-ios/` directory added with a full SwiftUI project structure
- Key files:
  - `CatchUpApp.swift` — app entry point
  - `ContentView.swift` — root tab view
  - `Views/ContactsView.swift` — contacts list
  - `Views/ContactDetailSheet.swift` — per-contact detail sheet
  - `Views/FavoritesView.swift` — favorites tab
  - `Views/RecentsView.swift` — recent interactions tab
  - `Views/InsightsView.swift` — insights / analytics tab
  - `Models/Relationship.swift` — data model
  - `Models/DataStore.swift` — observable data store
  - `Components/AvatarView.swift` — reusable avatar component
  - `Components/HealthRingView.swift` — SwiftUI health ring matching the web animated ring

---

## Architecture Notes

### Data Flow
```
iMessage DB (macOS) → sync-imessages.js → relationships.json → React app
CallHistoryDB       ↗
```

### Health Score
- Combines recency (days since last contact) and frequency (contacts per month)
- 0–100 scale; displayed as a ring/arc
- Color: green ≥ 70, orange 40–69, red < 40
- Calls (phone + FaceTime) count equally with messages

### Design Switcher
- Floating pill UI lets you switch between `Classic` and `Focus` variants at runtime
- Variant state lives in `App.js` and is passed down

### PWA
- Manifest at `public/manifest.json`
- Icons at `public/icon-{152,180,192,512}.png`

---

## Key Files

| File | Purpose |
|------|---------|
| `src/components/CatchUpDashboard.js` | Main dashboard — Classic variant |
| `src/components/HomeVariants.js` | Focus (and previously Orbit/Pulse) variants |
| `scripts/sync-imessages.js` | Reads iMessage + CallHistory, writes relationships.json |
| `scripts/catchup-sync-wrapper.sh` | launchd hourly sync wrapper |
| `public/data/relationships.json` | Contact data with health scores |
| `public/manifest.json` | PWA manifest |
| `catchup-ios/` | SwiftUI iOS app (Stage 2 scaffold) |

---

## Decisions & Trade-offs Recorded

- **Orbit and Pulse removed** — too visually noisy; Focus and Classic cover the use cases
- **American spelling** — standardised on `Favorite` (not `Favourite`) throughout the UI
- **DNT per contact** — opted for per-contact toggle rather than a global list, keeps it simple
- **Dunbar citations** — kept in the About page to give the scoring philosophy credibility with new users
- **launchd over cron** — macOS launchd is the right tool for background jobs on Mac; the wrapper script handles the node path portability issue

---

*Last updated: 2026-05-16*
