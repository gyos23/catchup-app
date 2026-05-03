import SwiftUI

struct ContentView: View {
    @EnvironmentObject var store: DataStore

    var body: some View {
        Group {
            if store.relationships.isEmpty {
                OnboardingView(store: store)
            } else {
                TabView {
                    FavoritesView(store: store)
                        .tabItem { Label("Favorites", systemImage: "heart.fill") }

                    RecentsView(store: store)
                        .tabItem { Label("Recents", systemImage: "clock.fill") }

                    ContactsView(store: store)
                        .tabItem { Label("Contacts", systemImage: "phone.fill") }

                    InsightsView(store: store)
                        .tabItem { Label("Insights", systemImage: "bolt.fill") }
                        .badge(store.overdueCount > 0 ? store.overdueCount : 0)
                }
            }
        }
        .animation(.easeInOut(duration: 0.35), value: store.relationships.isEmpty)
    }
}

#Preview {
    ContentView()
        .environmentObject(DataStore())
}
