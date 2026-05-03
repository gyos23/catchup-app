import SwiftUI

@main
struct CatchUpApp: App {
    @StateObject private var store = DataStore()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(store)
                .onAppear {
                    store.startICloudSync()
                }
        }
    }
}
