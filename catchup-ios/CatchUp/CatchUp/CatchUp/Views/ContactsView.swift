import SwiftUI
import UniformTypeIdentifiers

// MARK: - Sort & Filter options

enum ContactSort: String, CaseIterable, Identifiable {
    case name       = "Name"
    case worstFirst = "Needs Attention First"
    case bestFirst  = "Healthiest First"
    var id: String { rawValue }
}

enum ContactFilter: String, CaseIterable, Identifiable {
    case all           = "All"
    case needsAttention = "Needs Attention"
    case healthy       = "Healthy"
    var id: String { rawValue }
}

struct ContactsView: View {
    @ObservedObject var store: DataStore
    @State private var searchText = ""
    @State private var selectedContact: Relationship?
    @State private var sortOrder: ContactSort = .name
    @State private var filterOption: ContactFilter = .all
    @State private var showFilePicker = false

    // MARK: - Derived lists

    var baseList: [Relationship] {
        // 1. text search
        let searched = searchText.isEmpty
            ? store.relationships
            : store.relationships.filter { $0.name.localizedCaseInsensitiveContains(searchText) }

        // 2. filter
        let filtered: [Relationship]
        switch filterOption {
        case .all:            filtered = searched
        case .needsAttention: filtered = searched.filter { $0.healthScore < 60 }
        case .healthy:        filtered = searched.filter { $0.healthScore >= 60 }
        }

        // 3. sort
        switch sortOrder {
        case .name:       return filtered.sorted { $0.name < $1.name }
        case .worstFirst: return filtered.sorted { $0.healthScore < $1.healthScore }
        case .bestFirst:  return filtered.sorted { $0.healthScore > $1.healthScore }
        }
    }

    var alphaSections: [(letter: String, contacts: [Relationship])] {
        // Only use alpha grouping when sorted by name
        guard sortOrder == .name else { return [] }
        let grouped = Dictionary(grouping: baseList) {
            String($0.name.prefix(1).uppercased())
        }
        return grouped.keys.sorted().map { (letter: $0, contacts: grouped[$0]!) }
    }

    var priority: [Relationship] {
        store.relationships
            .filter { $0.healthScore < 60 }
            .sorted { $0.healthScore < $1.healthScore }
            .prefix(3)
            .map { $0 }
    }

    // MARK: - Body

    var body: some View {
        NavigationView {
            List {
                // Your move today — only when not filtering/sorting
                if searchText.isEmpty, filterOption == .all, sortOrder == .name,
                   let move = store.yourMove {
                    Section {
                        YourMoveRow(contact: move) { selectedContact = move }
                    }
                    .listRowInsets(EdgeInsets(top: 8, leading: 16, bottom: 8, trailing: 16))
                }

                // Needs Attention — only in default view
                if searchText.isEmpty, filterOption == .all, sortOrder == .name,
                   !priority.isEmpty {
                    Section("Needs Attention") {
                        ForEach(Array(priority.enumerated()), id: \.element.id) { i, contact in
                            ContactRow(contact: contact, delay: Double(i) * 0.065 + 0.1) {
                                selectedContact = contact
                            }
                        }
                    }
                }

                // Sorted by health — flat list with optional section header
                if sortOrder != .name {
                    if !baseList.isEmpty {
                        Section(sortOrder == .worstFirst ? "Needs Attention First" : "Healthiest First") {
                            ForEach(baseList) { contact in
                                ContactRow(contact: contact, delay: 0) { selectedContact = contact }
                            }
                        }
                    }
                } else {
                    // Alphabetical sections
                    ForEach(alphaSections, id: \.letter) { section in
                        Section(section.letter) {
                            ForEach(section.contacts) { contact in
                                ContactRow(contact: contact, delay: 0) { selectedContact = contact }
                            }
                        }
                    }
                }
            }
            .listStyle(.insetGrouped)
            .navigationTitle("Contacts")
            .searchable(text: $searchText, prompt: "Search")
            .toolbar {
                // Sort & Filter menu
                ToolbarItem(placement: .topBarLeading) {
                    Menu {
                        Picker("Sort", selection: $sortOrder) {
                            ForEach(ContactSort.allCases) { Text($0.rawValue).tag($0) }
                        }
                        Picker("Filter", selection: $filterOption) {
                            ForEach(ContactFilter.allCases) { Text($0.rawValue).tag($0) }
                        }
                    } label: {
                        let isDefault = filterOption == .all && sortOrder == .name
                        Image(systemName: isDefault
                              ? "line.3.horizontal.decrease.circle"
                              : "line.3.horizontal.decrease.circle.fill")
                        .foregroundStyle(isDefault ? Color.primary : Color.blue)
                    }
                }

                // Import menu
                ToolbarItem(placement: .topBarTrailing) {
                    Menu {
                        Button {
                            showFilePicker = true
                        } label: {
                            Label("Sync from Mac", systemImage: "arrow.down.doc.fill")
                        }
                        Button {
                            Task { await store.importFromiOSContacts() }
                        } label: {
                            Label("Import Contacts", systemImage: "person.badge.plus")
                        }
                    } label: {
                        if store.isImporting {
                            ProgressView().scaleEffect(0.8)
                        } else {
                            Image(systemName: "arrow.down.circle.fill")
                                .foregroundStyle(Color(hex: "007AFF"))
                        }
                    }
                    .disabled(store.isImporting)
                }
            }
            .sheet(item: $selectedContact) { contact in
                ContactDetailSheet(contact: contact, store: store)
            }
            .fileImporter(
                isPresented: $showFilePicker,
                allowedContentTypes: [.json],
                allowsMultipleSelection: false
            ) { result in
                if case .success(let urls) = result, let url = urls.first {
                    store.importFromFile(url)
                    HapticManager.success()
                }
            }
        }
    }
}

// MARK: - Subviews

private struct YourMoveRow: View {
    let contact: Relationship
    let onTap: () -> Void

    var body: some View {
        Button(action: onTap) {
            HStack(spacing: 12) {
                ZStack {
                    Circle()
                        .fill(LinearGradient(colors: [.blue, Color(hex: "5AC8FA")], startPoint: .topLeading, endPoint: .bottomTrailing))
                        .frame(width: 36, height: 36)
                    Image(systemName: "bolt.fill")
                        .foregroundColor(.white)
                        .font(.system(size: 15))
                }
                VStack(alignment: .leading, spacing: 2) {
                    Text("YOUR MOVE TODAY")
                        .font(.system(size: 11, weight: .semibold))
                        .foregroundStyle(.blue)
                        .tracking(0.4)
                    Text(contact.aiSuggestion.prefix(50).description)
                        .font(.system(size: 15, weight: .medium))
                        .foregroundStyle(.primary)
                        .lineLimit(1)
                }
                Spacer()
                HStack(spacing: 8) {
                    CircleIconButton(systemImage: "message.fill", color: .blue)
                    CircleIconButton(systemImage: "phone.fill",   color: .green)
                }
            }
        }
        .buttonStyle(.plain)
    }
}

private struct ContactRow: View {
    let contact: Relationship
    let delay: Double
    let onTap: () -> Void

    var body: some View {
        Button {
            HapticManager.light()
            onTap()
        } label: {
            HStack(spacing: 12) {
                if contact.isGroup {
                    ZStack {
                        Circle().fill(Color(.secondarySystemFill)).frame(width: 40, height: 40)
                        Image(systemName: "person.2.fill")
                            .foregroundStyle(.secondary)
                            .font(.system(size: 16))
                    }
                } else {
                    AvatarView(contact: contact, size: 40, animationDelay: delay)
                }
                VStack(alignment: .leading, spacing: 2) {
                    Text(contact.name)
                        .font(.system(size: 16))
                        .foregroundStyle(.primary)
                    if let urgency = contact.urgencyLabel {
                        Text("\(urgency.text) · \(contact.daysSinceContact.map { contact.daysLabel($0) } ?? "")")
                            .font(.system(size: 12, weight: .medium))
                            .foregroundStyle(urgency.color)
                    } else if !contact.topics.isEmpty {
                        TopicChips(topics: contact.topics)
                    } else {
                        Text(contact.lastContact)
                            .font(.system(size: 12))
                            .foregroundStyle(.secondary)
                    }
                }
                Spacer()
                Image(systemName: contact.isGroup ? "message" : "phone")
                    .foregroundStyle(.blue)
                    .font(.system(size: 17))
                    .opacity(0.8)
            }
        }
        .buttonStyle(.plain)
    }
}

private struct CircleIconButton: View {
    let systemImage: String
    let color: Color
    var body: some View {
        ZStack {
            Circle().fill(color.opacity(0.1)).frame(width: 32, height: 32)
            Image(systemName: systemImage).foregroundColor(color).font(.system(size: 14))
        }
    }
}

struct TopicChips: View {
    let topics: [String]
    var body: some View {
        HStack(spacing: 4) {
            ForEach(topics.prefix(3), id: \.self) { topic in
                Text(topic)
                    .font(.system(size: 11, weight: .medium))
                    .foregroundStyle(.secondary)
                    .padding(.horizontal, 8).padding(.vertical, 2)
                    .background(Color(.secondarySystemFill))
                    .clipShape(Capsule())
            }
        }
    }
}
