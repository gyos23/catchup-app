import SwiftUI

struct ContactDetailSheet: View {
    let contact: Relationship
    @ObservedObject var store: DataStore
    @Environment(\.dismiss) private var dismiss

    @State private var draft: Relationship
    @State private var showLogSheet = false
    @State private var editingNotes = false
    @State private var notesText: String

    init(contact: Relationship, store: DataStore) {
        self.contact = contact
        self.store = store
        _draft = State(initialValue: contact)
        _notesText = State(initialValue: contact.notes)
    }

    var body: some View {
        NavigationView {
            ScrollView {
                VStack(spacing: 0) {

                    // ── Gradient header ──────────────────────────────────────
                    ZStack(alignment: .bottom) {
                        LinearGradient(
                            colors: [draft.healthColor.opacity(0.25), Color(.systemGroupedBackground)],
                            startPoint: .top, endPoint: .bottom
                        )
                        .frame(height: 200)

                        VStack(spacing: 10) {
                            AvatarView(contact: draft, size: 88, animationDelay: 0.1)
                            VStack(spacing: 4) {
                                Text(draft.name)
                                    .font(.system(size: 22, weight: .bold))
                                if !draft.phoneNumber.isEmpty {
                                    Text(draft.phoneNumber)
                                        .font(.subheadline)
                                        .foregroundStyle(.secondary)
                                } else if draft.isGroup, !draft.participants.isEmpty {
                                    Text(draft.participants.joined(separator: " · "))
                                        .font(.caption)
                                        .foregroundStyle(.secondary)
                                        .multilineTextAlignment(.center)
                                }
                                // Health badge
                                if draft.lastContact == "Not yet tracked" {
                                    HStack(spacing: 4) {
                                        Image(systemName: "questionmark.circle")
                                            .font(.system(size: 11))
                                            .foregroundStyle(Color(.systemGray3))
                                        Text("No history yet — tap Log after a call")
                                            .font(.system(size: 12))
                                            .foregroundStyle(Color(.systemGray3))
                                    }
                                    .padding(.top, 2)
                                } else {
                                    HStack(spacing: 4) {
                                        Circle().fill(draft.healthColor).frame(width: 7, height: 7)
                                        Text("\(draft.healthScore)% health")
                                            .font(.system(size: 12, weight: .medium))
                                            .foregroundStyle(draft.healthColor)
                                    }
                                    .padding(.top, 2)
                                }
                            }
                        }
                        .padding(.bottom, 20)
                    }

                    // ── Action buttons ───────────────────────────────────────
                    HStack(spacing: 16) {
                        // Message
                        ActionBtn(label: "Message", systemImage: "message.fill", color: .blue) {
                            HapticManager.medium()
                            openURL("sms://\(draft.phoneNumber.filter(\.isNumber))")
                            logInteractionDirect(medium: "iMessage", initiatedBy: "Me")
                        }
                        // Call
                        ActionBtn(label: "Call", systemImage: "phone.fill", color: Color(hex: "34C759")) {
                            HapticManager.medium()
                            openURL("tel://\(draft.phoneNumber.filter(\.isNumber))")
                            logInteractionDirect(medium: "Phone Call", initiatedBy: "Me")
                        }
                        // Log manually
                        ActionBtn(label: "Log", systemImage: "square.and.pencil", color: Color(hex: "FF9F0A")) {
                            HapticManager.light()
                            showLogSheet = true
                        }
                    }
                    .padding(.horizontal, 24)
                    .padding(.vertical, 20)

                    // ── AI Suggestion ────────────────────────────────────────
                    HStack(alignment: .top, spacing: 10) {
                        Image(systemName: "bolt.fill")
                            .foregroundColor(.blue)
                            .font(.system(size: 14))
                            .padding(.top, 1)
                        Text(draft.aiSuggestion)
                            .font(.system(size: 14))
                            .foregroundStyle(.primary)
                            .lineSpacing(3)
                        Spacer()
                    }
                    .padding(14)
                    .background(Color.blue.opacity(0.08))
                    .clipShape(RoundedRectangle(cornerRadius: 14))
                    .padding(.horizontal, 16)
                    .padding(.bottom, 16)

                    // ── Topics ───────────────────────────────────────────────
                    if !draft.topics.isEmpty {
                        ScrollView(.horizontal, showsIndicators: false) {
                            HStack(spacing: 8) {
                                ForEach(draft.topics, id: \.self) { topic in
                                    Text(topic)
                                        .font(.system(size: 13, weight: .medium))
                                        .foregroundStyle(.secondary)
                                        .padding(.horizontal, 12)
                                        .padding(.vertical, 5)
                                        .background(Color(.secondarySystemFill))
                                        .clipShape(Capsule())
                                }
                            }
                            .padding(.horizontal, 16)
                        }
                        .padding(.bottom, 16)
                    }

                    // ── Activity history ─────────────────────────────────────
                    VStack(alignment: .leading, spacing: 8) {
                        HStack {
                            Text("Activity")
                                .font(.system(size: 13, weight: .semibold))
                                .foregroundStyle(.secondary)
                                .textCase(.uppercase)
                                .tracking(0.5)
                            Spacer()
                            if !draft.contactHistory.isEmpty {
                                Text("\(draft.contactHistory.count) total")
                                    .font(.system(size: 12))
                                    .foregroundStyle(.tertiary)
                            }
                        }
                        .padding(.horizontal, 16)

                        if draft.contactHistory.isEmpty {
                            // Empty state
                            VStack(spacing: 8) {
                                Image(systemName: "clock.badge.questionmark")
                                    .font(.system(size: 32))
                                    .foregroundStyle(.tertiary)
                                Text("No activity yet")
                                    .font(.system(size: 15, weight: .medium))
                                    .foregroundStyle(.secondary)
                                Text("Tap Log after a call or message to start tracking.")
                                    .font(.system(size: 13))
                                    .foregroundStyle(.tertiary)
                                    .multilineTextAlignment(.center)
                            }
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 32)
                            .padding(.horizontal, 16)
                            .background(Color(.secondarySystemGroupedBackground))
                            .clipShape(RoundedRectangle(cornerRadius: 14))
                            .padding(.horizontal, 16)
                        } else {
                            VStack(spacing: 0) {
                                ForEach(Array(draft.contactHistory.prefix(10).enumerated()), id: \.element.id) { i, item in
                                    HistoryRow(item: item)
                                    if i < min(draft.contactHistory.count, 10) - 1 {
                                        Divider().padding(.leading, 56)
                                    }
                                }
                            }
                            .background(Color(.secondarySystemGroupedBackground))
                            .clipShape(RoundedRectangle(cornerRadius: 14))
                            .padding(.horizontal, 16)
                        }
                    }
                    .padding(.bottom, 16)

                    // ── Notes ────────────────────────────────────────────────
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Notes")
                            .font(.system(size: 13, weight: .semibold))
                            .foregroundStyle(.secondary)
                            .textCase(.uppercase)
                            .tracking(0.5)
                            .padding(.horizontal, 16)

                        ZStack(alignment: .topLeading) {
                            RoundedRectangle(cornerRadius: 14)
                                .fill(Color(.secondarySystemGroupedBackground))

                            if notesText.isEmpty {
                                Text("Add a note about this person…")
                                    .font(.system(size: 15))
                                    .foregroundStyle(.tertiary)
                                    .padding(14)
                            }

                            TextEditor(text: $notesText)
                                .font(.system(size: 15))
                                .scrollContentBackground(.hidden)
                                .padding(10)
                                .frame(minHeight: 80)
                                .onChange(of: notesText) { _, new in
                                    draft.notes = new
                                }
                        }
                        .frame(minHeight: 80)
                        .padding(.horizontal, 16)
                    }

                    Spacer(minLength: 48)
                }
            }
            .background(Color(.systemGroupedBackground))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Done") {
                        saveAndDismiss()
                    }
                    .fontWeight(.semibold)
                }
            }
            .sheet(isPresented: $showLogSheet) {
                LogInteractionSheet(contact: $draft) {
                    store.updateContact(draft)
                    HapticManager.success()
                }
            }
        }
    }

    // MARK: - Helpers

    private func openURL(_ str: String) {
        guard let url = URL(string: str) else { return }
        UIApplication.shared.open(url)
    }

    private func logInteractionDirect(medium: String, initiatedBy: String) {
        let fmt = DateFormatter()
        fmt.dateFormat = "yyyy-MM-dd HH:mm:ss"
        let item = ContactHistoryItem(
            date: "Today",
            medium: medium,
            subject: medium,
            initiatedBy: initiatedBy,
            summary: "—"
        )
        draft.contactHistory.insert(item, at: 0)
        draft.recomputeHealth()
        store.updateContact(draft)
    }

    private func saveAndDismiss() {
        if draft.notes != contact.notes || draft.contactHistory.count != contact.contactHistory.count {
            store.updateContact(draft)
        }
        dismiss()
    }
}

// MARK: - Log Interaction Sheet

struct LogInteractionSheet: View {
    @Binding var contact: Relationship
    let onSave: () -> Void
    @Environment(\.dismiss) private var dismiss

    @State private var medium = "Phone Call"
    @State private var initiatedBy = "Me"
    @State private var logDate = Date()
    @State private var note = ""

    private let mediums  = ["iMessage", "Phone Call", "FaceTime Video", "FaceTime Audio", "In Person"]
    private let initiators = ["Me", "Them"]

    var body: some View {
        NavigationView {
            Form {
                Section("Type") {
                    Picker("Medium", selection: $medium) {
                        ForEach(mediums, id: \.self) { Text($0) }
                    }
                    .pickerStyle(.wheel)
                    .frame(height: 120)
                }

                Section("When") {
                    DatePicker("Date", selection: $logDate, in: ...Date(), displayedComponents: [.date, .hourAndMinute])
                }

                Section("Who reached out?") {
                    Picker("Initiated by", selection: $initiatedBy) {
                        ForEach(initiators, id: \.self) { Text($0) }
                    }
                    .pickerStyle(.segmented)
                    .listRowBackground(Color.clear)
                }

                Section("Note (optional)") {
                    TextField("What did you talk about?", text: $note, axis: .vertical)
                        .lineLimit(3, reservesSpace: true)
                }
            }
            .navigationTitle("Log Interaction")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarLeading) {
                    Button("Cancel") { dismiss() }
                }
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Save") {
                        let fmt = DateFormatter()
                        fmt.dateFormat = "yyyy-MM-dd HH:mm:ss"

                        // Display-friendly date string
                        let calendar = Calendar.current
                        let displayDate: String
                        if calendar.isDateInToday(logDate)     { displayDate = "Today" }
                        else if calendar.isDateInYesterday(logDate) { displayDate = "Yesterday" }
                        else {
                            let days = calendar.dateComponents([.day], from: logDate, to: Date()).day ?? 0
                            displayDate = "\(days) days ago"
                        }

                        let item = ContactHistoryItem(
                            date: displayDate,
                            medium: medium,
                            subject: medium,
                            initiatedBy: initiatedBy,
                            summary: note.isEmpty ? "—" : note
                        )
                        contact.contactHistory.insert(item, at: 0)
                        contact.recomputeHealth()
                        onSave()
                        dismiss()
                    }
                    .fontWeight(.semibold)
                }
            }
        }
    }
}

// MARK: - Sub-views

private struct ActionBtn: View {
    let label: String
    let systemImage: String
    let color: Color
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            VStack(spacing: 6) {
                RoundedRectangle(cornerRadius: 14)
                    .fill(color.opacity(0.12))
                    .frame(width: 56, height: 56)
                    .overlay(
                        Image(systemName: systemImage)
                            .font(.system(size: 22))
                            .foregroundStyle(color)
                    )
                Text(label)
                    .font(.system(size: 12))
                    .foregroundStyle(.secondary)
            }
        }
        .buttonStyle(.plain)
    }
}

private struct HistoryRow: View {
    let item: ContactHistoryItem

    var body: some View {
        HStack(alignment: .center, spacing: 10) {
            ZStack {
                Circle()
                    .fill(item.mediumColor.opacity(0.12))
                    .frame(width: 34, height: 34)
                Image(systemName: item.mediumIcon)
                    .font(.system(size: 13))
                    .foregroundStyle(item.mediumColor)
            }
            VStack(alignment: .leading, spacing: 2) {
                Text(item.medium)
                    .font(.system(size: 14))
                if item.summary != "—" {
                    Text(item.summary)
                        .font(.system(size: 12))
                        .foregroundStyle(.secondary)
                        .lineLimit(1)
                }
            }
            Spacer()
            VStack(alignment: .trailing, spacing: 2) {
                Text(item.date)
                    .font(.system(size: 12))
                    .foregroundStyle(.tertiary)
                if item.initiatedBy.lowercased() == "me" || item.initiatedBy.lowercased() == "you" {
                    Text("You")
                        .font(.system(size: 11))
                        .foregroundStyle(.tertiary)
                }
            }
        }
        .padding(.horizontal, 14)
        .padding(.vertical, 11)
    }
}
