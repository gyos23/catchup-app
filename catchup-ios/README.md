# CatchUp iOS

SwiftUI port of the React/Vercel prototype.

## Setup (3 steps)

1. **Open Xcode → File → New → Project**
   - Template: iOS → App
   - Product Name: `CatchUp`
   - Bundle ID: `com.dorian.catchup`
   - Interface: SwiftUI | Language: Swift | Storage: None
   - Save location: `catchup-app/catchup-ios/` (this folder)

2. **Replace the generated files with these**
   - Delete `ContentView.swift` Xcode created → drag in all `.swift` files from this folder (keeping group structure)
   - Right-click the project → Add Files → select `Resources/relationships.json` → check "Copy items if needed" + "Add to target"

3. **Run**
   - Select your iPhone as target (or Simulator)
   - `Cmd+R`

## File structure

```
CatchUp/
  CatchUpApp.swift          ← App entry point
  ContentView.swift         ← TabView (Favorites / Recents / Contacts / Insights)
  Models/
    Relationship.swift      ← Data model + computed properties
    DataStore.swift         ← Loads JSON, computed arrays (yourMove, recents, etc.)
  Views/
    ContactsView.swift      ← Contacts tab with Your Move, Needs Attention, alpha list
    FavoritesView.swift     ← 3-column grid + Suggested list
    RecentsView.swift       ← Flattened call/message feed
    InsightsView.swift      ← Health ring, breakdown, stats, action items
    ContactDetailSheet.swift ← Bottom sheet: avatar, AI suggestion, history, topics
  Components/
    HealthRingView.swift    ← Animated ring (the core visual)
    AvatarView.swift        ← Initials + gradient + health ring
  Resources/
    relationships.json      ← Synced from Mac via scripts/sync-imessages.js
```

## Dev pipeline

New features → prototype in React (`src/components/HomeVariants.js`)
                                ↓
              validate in Vercel on real device
                                ↓
              port to SwiftUI when frozen

## Updating data

Run on Mac: `node scripts/sync-imessages.js`
Then copy: `cp public/data/relationships.json catchup-ios/CatchUp/Resources/relationships.json`
Rebuild in Xcode.
