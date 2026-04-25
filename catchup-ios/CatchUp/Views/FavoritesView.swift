import SwiftUI

struct FavoritesView: View {
    @ObservedObject var store: DataStore
    @State private var selectedContact: Relationship?

    var favorites: [Relationship] {
        store.individuals
            .sorted { $0.healthScore > $1.healthScore }
            .prefix(6)
            .map { $0 }
    }

    var suggested: [Relationship] {
        let favIds = Set(favorites.map { $0.id })
        return store.individuals
            .filter { !favIds.contains($0.id) }
            .prefix(4)
            .map { $0 }
    }

    var body: some View {
        NavigationView {
            List {
                // Favorites grid
                Section {
                    LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 3), spacing: 20) {
                        ForEach(Array(favorites.enumerated()), id: \.element.id) { i, contact in
                            Button {
                                selectedContact = contact
                            } label: {
                                VStack(spacing: 5) {
                                    AvatarView(contact: contact, size: 64, animationDelay: Double(i) * 0.06 + 0.1)
                                    Text(contact.name.components(separatedBy: " ").first ?? contact.name)
                                        .font(.system(size: 12))
                                        .foregroundStyle(.primary)
                                        .lineLimit(1)
                                    if let urgency = contact.urgencyLabel {
                                        Text(urgency.text)
                                            .font(.system(size: 10, weight: .semibold))
                                            .foregroundStyle(urgency.color)
                                            .textCase(.uppercase)
                                            .tracking(0.3)
                                    }
                                }
                            }
                            .buttonStyle(.plain)
                        }
                    }
                    .padding(.vertical, 8)
                }
                .listRowBackground(Color.clear)
                .listRowInsets(EdgeInsets(top: 8, leading: 16, bottom: 8, trailing: 16))

                // Suggested
                if !suggested.isEmpty {
                    Section("Suggested") {
                        ForEach(suggested) { contact in
                            Button { selectedContact = contact } label: {
                                HStack(spacing: 12) {
                                    AvatarView(contact: contact, size: 44, animationDelay: 0.3)
                                    VStack(alignment: .leading, spacing: 2) {
                                        Text(contact.name).font(.system(size: 16)).foregroundStyle(.primary)
                                        if let days = contact.daysSinceContact {
                                            Text(contact.daysLabel(days)).font(.subheadline).foregroundStyle(.secondary)
                                        }
                                    }
                                    Spacer()
                                    Image(systemName: "phone").foregroundStyle(.blue)
                                }
                            }
                            .buttonStyle(.plain)
                        }
                    }
                }
            }
            .listStyle(.insetGrouped)
            .navigationTitle("Favorites")
            .sheet(item: $selectedContact) { ContactDetailSheet(contact: $0) }
        }
    }
}
