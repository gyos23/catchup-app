import SwiftUI

struct RecentsView: View {
    @ObservedObject var store: DataStore
    @State private var selectedContact: Relationship?

    var body: some View {
        NavigationView {
            Group {
                if store.recents.isEmpty {
                    ContentUnavailableView(
                        "No Recent Activity",
                        systemImage: "clock",
                        description: Text("Open a contact and tap Log after a call or message to start building your history.")
                    )
                } else {
                    List {
                        ForEach(Array(store.recents.enumerated()), id: \.offset) { _, pair in
                            Button {
                                selectedContact = pair.contact
                            } label: {
                                HStack(spacing: 12) {
                                    AvatarView(contact: pair.contact, size: 44, animationDelay: 0)
                                    VStack(alignment: .leading, spacing: 3) {
                                        Text(pair.contact.name)
                                            .font(.system(size: 16))
                                            .foregroundStyle(.primary)
                                        HStack(spacing: 4) {
                                            Image(systemName: pair.item.isCall ? "phone" : "message")
                                                .font(.system(size: 11))
                                                .foregroundStyle(.secondary)
                                            Text(pair.item.medium)
                                                .font(.system(size: 13))
                                                .foregroundStyle(.secondary)
                                        }
                                    }
                                    Spacer()
                                    VStack(alignment: .trailing, spacing: 2) {
                                        Text(pair.item.date)
                                            .font(.system(size: 13))
                                            .foregroundStyle(.secondary)
                                        if pair.item.initiatedBy == "me" {
                                            Text("You")
                                                .font(.system(size: 11))
                                                .foregroundStyle(.tertiary)
                                        }
                                    }
                                }
                            }
                            .buttonStyle(.plain)
                        }
                    }
                    .listStyle(.plain)
                }
            }
            .navigationTitle("Recents")
            .sheet(item: $selectedContact) { ContactDetailSheet(contact: $0, store: store) }
        }
    }
}
