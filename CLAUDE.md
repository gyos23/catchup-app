# CatchUp App — Project Memory

## What This App Is

CatchUp is a personal relationship health tracker. It monitors how often you stay in touch with the people who matter to you, scores each relationship by recency and frequency of contact, and nudges you to reach out when someone is slipping. The core insight is Dunbar's number — humans can only maintain ~150 meaningful relationships, so the app helps you be deliberate about the important ones. There is no server — all data flows from the user's local macOS Messages database through iCloud Drive to the iOS app.

---

## What We Built Together

### Phase 1 — Web App Foundation (Sep 2025)
- React app bootstrapped in CodeSandbox
- `CatchUpDashboard.js` — main dashboard component
- `App.js` / `App.css` — root layout and styles
- Early data model: contacts with health scores based on last-contact dates

### Phase 2 — Major Feature Expansion (Apr 2026, PR #1)
Merged branch `catchup-feature-branch`.

**Call Tracking**
- Integrated `CallHistoryDB` (phone, FaceTime audio, FaceTime video) into health scoring
- Calls count as 3× message-equivalents (capped at 15) toward recency and frequency metrics

**Filter / Sort / Do Not Track**
- Sort contacts by health score, name, last contact
- Filter by contact type
- Per-contact "Do Not Track" toggle to exclude someone from scoring

**Auto-refresh**
- 30-minute silent data refresh interval — no manual reload needed

**About Page**
- Plain-English explanation of the health score algorithm
- Cites Dunbar science for credibility

**PWA Support**
- `manifest.json` added; `display: "standalone"`, theme color `#0969b8`
- Apple touch icons: 152, 180, 192, 512px
- Safe-area insets for notched phones
- Installable to home screen on iOS/Android

**launchd Background Sync**
- `scripts/catchup-sync-wrapper.sh` — hourly background sync via macOS launchd
- `scripts/sync-imessages.js` — reads iMessage + CallHistory, writes `relationships.json`

**Design Variants — Coach, Orbit, Pulse, Focus, Native**
- `src/components/HomeVariants.js` added — houses all variant UIs
- **Focus** (ADA candidate): animated SVG health rings, hero action card, spring-eased ring fills
- `AnimatedRing` component: fills 0→score on mount with cubic-bezier, staggered per contact

### Phase 3 — Polish Pass (Apr 2026, PR #2)
Merged branch `polish-v2`:

- American spelling throughout (`Favorite` not `Favourite`)
- `daysSinceContact` reads `lastContactDate` ISO field correctly
- Favorites tab sorts highest health score first
- `yourMove` skips contacts touched today or already at 100%
- `InsightsRing` animates with spring easing
- Switcher pill floats above native tab bar (z-index fix)
- Plus icon import fixed (was causing blank-screen crash)
- 7 real contacts loaded from iMessage sync into `public/data/relationships.json`
- `.gitignore` added

### Phase 4 — Color & Header Fixes (May 2026)
- Health ring / score colors corrected: green (good), orange (warning), red (critical)
- Blue header applied to the Focus variant
- Orbit and Pulse variants removed from the design switcher

### Phase 5 — iOS SwiftUI Scaffold (Apr 2026)
`catchup-ios/` directory added — full SwiftUI project, no UIKit:

| File | Role |
|------|------|
| `CatchUpApp.swift` | App entry point |
| `ContentView.swift` | Root tab view |
| `Views/ContactsView.swift` | Contacts list with sort/filter/search |
| `Views/ContactDetailSheet.swift` | Per-contact analytics sheet |
| `Views/FavoritesView.swift` | Favorites grid tab |
| `Views/RecentsView.swift` | Recent interactions tab |
| `Views/InsightsView.swift` | Aggregate health + action items |
| `Models/Relationship.swift` | Codable contact struct |
| `Models/DataStore.swift` | Combine observable; iCloud/file/Contacts import |
| `Components/AvatarView.swift` | Gradient initials avatar |
| `Components/HealthRingView.swift` | Spring-animated SwiftUI health ring |

---

## Data Flow Architecture

```
macOS
  ~/Library/Messages/chat.db          (iMessages + SMS)
  ~/Library/.../CallHistory.storedata (phone + FaceTime calls)
  AddressBook-v22.abcddb              (contact name lookup)
        │
        ▼
  scripts/sync-imessages.js           (Node.js + SQLite CLI)
        │
        ├──► public/data/relationships.json   (consumed by React web app)
        │
        └──► iCloud Drive
             iCloud~com~dorianliriano~CatchUp/Documents/relationships.json
                    │
                    ▼ (NSMetadataQuery auto-download)
             iOS DataStore.swift
                    │
                    ▼
             SwiftUI Views (read-only; offline recompute via recomputeHealth())
```

**Fallback import paths on iOS** (if iCloud unavailable):
1. File picker — AirDrop or Files.app
2. iOS Contacts.app — import all system contacts (no history, health = 0)

---

## Health Score Algorithm

**Scale: 0–100. Frozen — do not change thresholds; it feels like data loss to users.**

| Component | Weight | Logic |
|-----------|--------|-------|
| Recency | 40 pts | Days since last contact: 0-1d=40, 1-3d=35, 3-7d=28, 7-14d=18, 14-30d=10, 30-60d=5, 60+d=2 |
| Frequency | 30 pts | Messages/week over 365d: 10+=30, 5+=24, 2+=18, 1+=12, 0.5+=6 |
| Balance | 20 pts | Your initiation ratio (30d window): 30%+=20, 15%+=14, 5%+=8 |
| Trend | 10 pts | This month ≥ 80% of last month: yes=10, ≥50%=5 |

**Calls:** Phone + FaceTime counted as 3× message-equivalents, capped at 15, added before scoring.

**Status colours:** green ≥ 70 · orange 40–69 · red < 40

**iOS offline recompute:** `Relationship.recomputeHealth()` re-runs the same algorithm from `contactHistory[]` so score updates immediately after a logged interaction — no re-sync needed.

---

## Design Variants

All five variants share the same data model (`relationships.json`) but present different UX entry points.

### A — Coach (currently active in switcher as "Classic")
- Hero "Your move today" card showing the single most urgent contact
- Compact roster sorted worst-health-first below it
- Team health % in header
- Best for: quick daily action, task-oriented users

### B — Orbit *(removed from switcher — too noisy)*
- Dark-background 3×2 grid of animated avatar rings
- Expandable "Needs attention" section below
- Best for: visual thinkers who want tribe-at-a-glance

### C — Pulse *(removed from switcher — too noisy)*
- Section-based layout: "Reach out now" (red) / "This week" (yellow) / "In good shape" (green)
- Health bar at top showing aggregate score
- Collapsible sections, 2-3 items each
- Most accessible layout; clear visual hierarchy

### D — Focus (ADA candidate, active in switcher)
- Staggered spring-animated ring fills on load (1.1s cubic-bezier, delays per contact)
- Hero action card only when someone actually needs attention; celebratory card when tribe health is strong
- Blue header (`#0969b8`)
- Best for: delight + accessibility compliance

### E — Native
- 4-tab iPhone-native interface: Contacts · Favorites · Insights · Recents
- iOS system colors: blue `#007AFF`, green `#34C759`, red `#FF453A`
- Alphabetical section jump (A–Z rail on right)
- Favorites grid (up to 6) with urgency badges
- Badge count on tab bar for overdue contacts
- Best for: users who want it to feel indistinguishable from a system app

---

## Key Source Files

| File | Purpose |
|------|---------|
| `src/App.js` | Minimal wrapper — mounts `<CatchUpDashboard />`; no state |
| `src/components/CatchUpDashboard.js` | All app state, navigation, detail sheets, variant switching |
| `src/components/HomeVariants.js` | All five homepage variant components + shared UI primitives |
| `scripts/sync-imessages.js` | macOS sync engine — SQLite queries, scoring, JSON output |
| `scripts/catchup-sync-wrapper.sh` | launchd hourly wrapper; resolves nvm/system node path |
| `public/data/relationships.json` | Generated contact data consumed by React app |
| `public/manifest.json` | PWA manifest (`display: standalone`, theme `#0969b8`) |
| `catchup-ios/CatchUp/Models/Relationship.swift` | Codable contact struct + offline `recomputeHealth()` |
| `catchup-ios/CatchUp/Models/DataStore.swift` | Combine `@Published` store; three import paths |
| `catchup-ios/CatchUp/Components/HealthRingView.swift` | SwiftUI ring: spring 1.1s/0.75 damping, staggered |

---

## Key Functions & Hooks

### React (`CatchUpDashboard.js`)

| Function | What it does |
|----------|-------------|
| `useContactPrefs()` | Custom hook; persists per-contact customisation to `localStorage` — relationship tag, added/removed topics, target health score, Do Not Track flag |
| `computeScoreBreakdown()` | Decomposes a health score into its 4 weighted components for the detail modal |
| `generateGoalSuggestions()` | Produces actionable goal cards: "Message today to boost recency from 30 → 40" |
| `generateAIMessage()` | Context-aware ice-breaker keyed to mood: `"excited"` / `"stressed"` / `"hurt"` |
| `getBestContactMethod()` | Recommends call vs text from the contact's historical method breakdown |

### Shared UI (both files)

| Component | What it does |
|-----------|-------------|
| `HealthRing` / `HealthRingLight` | SVG circular progress, dark/light variants |
| `AnimatedRing` | Spring-fills from 0→score on mount; staggered per-contact delay |
| `NativeAvatar` / `NativeAvatarLarge` | Gradient circle with initials |
| `daysSinceContact()` | Parses ISO date or relative string → days integer |
| `urgencyLabel()` | Returns `"Overdue"` or `"Check in"` badge text |

### iOS Swift

| Symbol | What it does |
|--------|-------------|
| `DataStore.yourMove` | Computed: lowest-health contact not already contacted today |
| `DataStore.overdueCount` | Count of contacts with health < 40 (drives tab badge) |
| `Relationship.recomputeHealth()` | Re-runs scoring from `contactHistory[]` offline |
| `DataStore.parseHistoryDate()` | Handles ISO timestamps + relative strings ("3 days ago", "yesterday") |

---

## Contact Data Schema (`relationships.json`)

```json
{
  "generatedAt": "2026-05-03T13:46:52.206Z",
  "source": "iMessage+Calls",
  "relationships": [
    {
      "id": 2900697887,
      "name": "Yli Liriano",
      "avatar": "YL",
      "phoneNumber": "+1...",
      "isGroup": false,
      "healthScore": 84,
      "status": "green",
      "lastContact": "Today",
      "lastContactDate": "2026-05-03 04:51:24",
      "topics": ["Health", "Family", "Travel"],
      "contactHistory": [
        {
          "date": "2026-05-03",
          "medium": "iMessage",
          "from_me": true,
          "text": "..."
        }
      ],
      "analytics": {
        "totalContacts": 142,
        "avgResponseTime": "2h",
        "monthlyChart": [12, 8, 15, ...],
        "methodBreakdown": { "iMessage": 120, "FaceTime Audio": 10, "Phone": 12 },
        "responsiveness": 78,
        "initiationRatio": 0.45
      },
      "nextSuggested": "2026-05-10"
    }
  ]
}
```

**`id`** is a stable hash of the phone number — never random. This is the localStorage key for `useContactPrefs()`.

---

## Technologies & Dependencies

**Web**
- React 18.2 + React Scripts 5.0
- `lucide-react` — icon library
- Tailwind CSS (via className strings, not config file)
- No state management library — plain `useState` + custom hooks

**iOS**
- SwiftUI only (no UIKit)
- Combine — `@Published` / `@ObservedObject` for reactive state
- Foundation `NSMetadataQuery` — iCloud Drive file watching
- `ContactsUI` — system contact picker

**Scripts**
- Node.js (≥18 recommended)
- SQLite accessed via macOS `sqlite3` CLI (no npm SQLite package)

---

## Development Gotchas

1. **Full Disk Access required** — `sync-imessages.js` reads `~/Library/Messages/chat.db`. Go to System Settings → Privacy & Security → Full Disk Access → add Terminal (or the Node binary).

2. **iCloud container ID is hardcoded** — `iCloud.com.dorianliriano.CatchUp` appears in both `sync-imessages.js` and `DataStore.swift`. It must match the Xcode provisioning profile exactly.

3. **Stable IDs are critical** — IDs are a hash of the phone number. Never use `Math.random()` or an auto-increment. Changing ID generation breaks all localStorage preferences for every contact.

4. **Call number normalisation** — `CallHistory.storedata` stores numbers in a different format than Messages.db. The sync script strips all non-digit characters and matches on the last 10 digits.

5. **Topic keywords are hardcoded** — Extracted by keyword scan in `sync-imessages.js`. Categories: Work, Family, Food, Sports, Travel, Entertainment, Health, Finance, Tech, Relationships. Not config-driven; edit the script to add new ones.

6. **Health algorithm is frozen** — The scoring thresholds are tuned. Changing them makes every contact's score shift, which feels like a data corruption bug to users. Discuss explicitly before touching.

7. **`useContactPrefs()` is localStorage-only** — It is intentionally decoupled from the sync'd JSON. The JSON is read-only output from the sync script; user customisations live separately.

8. **Orbit and Pulse are in the code but removed from the switcher** — `HomeVariants.js` still contains `DesignB` and `DesignC`; they are just not wired into the design switcher UI. Restore them by adding cases back to the switcher component.

---

## Decisions & Trade-offs

| Decision | Rationale |
|----------|-----------|
| No central server | Data stays on device + iCloud; zero infra cost, no privacy risk |
| launchd over cron | macOS launchd is the correct tool for background jobs; wrapper handles nvm path portability |
| American spelling (`Favorite`) | Standardised in Phase 3 polish pass |
| Per-contact DNT toggle | Simpler than a global exclusion list; avoids accidental bulk opt-outs |
| Calls = 3× messages (capped 15) | Voice signals stronger relationship intent; cap prevents a single long call dominating score |
| Orbit + Pulse removed from switcher | Too visually noisy in user testing; Coach + Focus cover the spectrum |
| Dunbar citations in About page | Gives new users a credible reason why 150 is the target, not arbitrary |
| localStorage for prefs | Decouples user customisation from sync data so re-syncing never resets preferences |
| SwiftUI only (no UIKit) | Simpler codebase; native feel; Combine fits reactive data model |

---

*Last updated: 2026-05-16*
