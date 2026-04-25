import SwiftUI

struct ContactDetailSheet: View {
    let contact: Relationship
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationView {
            ScrollView {
                VStack(spacing: 0) {

                    // MARK: - Header
                    VStack(spacing: 10) {
                        AvatarView(contact: contact, size: 88, animationDelay: 0.1)
                        VStack(spacing: 4) {
                            Text(contact.name)
                                .font(.system(size: 22, weight: .bold))
                            if !contact.phoneNumber.isEmpty {
                                Text(contact.phoneNumber)
                                    .font(.subheadline)
                                    .foregroundStyle(.secondary)
                            } else if contact.isGroup, !contact.participants.isEmpty {
                                Text(contact.participants.joined(separator: " · "))
                                    .font(.caption)
                                    .foregroundStyle(.secondary)
                                    .multilineTextAlignment(.center)
                            }
                        }
                    }
                    .padding(.top, 8)
                    .padding(.bottom, 20)

                    // MARK: - Action buttons
                    HStack(spacing: 16) {
                        ActionButton(label: "message", systemImage: "message.fill", color: .blue)
                        ActionButton(label: "call",    systemImage: "phone.fill",   color: .green)
                    }
                    .padding(.bottom, 20)

                    // MARK: - AI Suggestion
                    HStack(alignment: .top, spacing: 10) {
                        Image(systemName: "bolt.fill")
                            .foregroundColor(.blue)
                            .font(.system(size: 14))
                            .padding(.top, 1)
                        Text(contact.aiSuggestion)
                            .font(.system(size: 14))
                            .foregroundStyle(.primary)
                            .lineSpacing(3)
                        Spacer()
                    }
                    .padding(14)
                    .background(Color.blue.opacity(0.08))
                    .clipShape(RoundedRectangle(cornerRadius: 14))
                    .padding(.horizontal, 16)
                    .padding(.bottom, 14)

                    // MARK: - Topics
                    if !contact.topics.isEmpty {
                        HStack {
                            ForEach(contact.topics, id: \.self) { topic in
                                Text(topic)
                                    .font(.system(size: 13, weight: .medium))
                                    .foregroundStyle(.secondary)
                                    .padding(.horizontal, 12)
                                    .padding(.vertical, 4)
                                    .background(Color(.secondarySystemFill))
                                    .clipShape(Capsule())
                            }
                            Spacer()
                        }
                        .padding(.horizontal, 16)
                        .padding(.bottom, 14)
                    }

                    // MARK: - Recent Activity
                    if !contact.contactHistory.isEmpty {
                        VStack(alignment: .leading, spacing: 8) {
                            Text("Recent Activity")
                                .font(.system(size: 13, weight: .semibold))
                                .foregroundStyle(.secondary)
                                .textCase(.uppercase)
                                .tracking(0.5)
                                .padding(.horizontal, 16)

                            VStack(spacing: 0) {
                                ForEach(Array(contact.contactHistory.prefix(7))) { item in
                                    HistoryRow(item: item)
                                    if item.id != contact.contactHistory.prefix(7).last?.id {
                                        Divider().padding(.leading, 56)
                                    }
                                }
                            }
                            .background(Color(.secondarySystemGroupedBackground))
                            .clipShape(RoundedRectangle(cornerRadius: 14))
                            .padding(.horizontal, 16)
                        }
                    }

                    Spacer(minLength: 40)
                }
            }
            .background(Color(.systemGroupedBackground))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Done") { dismiss() }
                        .fontWeight(.semibold)
                }
            }
        }
    }
}

// MARK: - Sub-views

private struct ActionButton: View {
    let label: String
    let systemImage: String
    let color: Color

    var body: some View {
        VStack(spacing: 5) {
            RoundedRectangle(cornerRadius: 14)
                .fill(Color(.secondarySystemGroupedBackground))
                .frame(width: 56, height: 56)
                .overlay(
                    Image(systemName: systemImage)
                        .font(.system(size: 22))
                        .foregroundColor(color)
                )
            Text(label)
                .font(.system(size: 12))
                .foregroundStyle(.secondary)
        }
    }
}

private struct HistoryRow: View {
    let item: ContactHistoryItem

    var hasBody: Bool {
        item.summary != "—" &&
        !item.summary.hasPrefix("FaceTime") &&
        !item.summary.hasPrefix("Phone Call")
    }

    var body: some View {
        HStack(alignment: .center, spacing: 10) {
            ZStack {
                Circle()
                    .fill(Color(.systemFill))
                    .frame(width: 32, height: 32)
                Image(systemName: item.isCall ? "phone.fill" : "message.fill")
                    .font(.system(size: 13))
                    .foregroundColor(item.isCall ? .green : .blue)
            }
            VStack(alignment: .leading, spacing: 2) {
                Text(item.medium)
                    .font(.system(size: 14))
                if hasBody {
                    Text(item.summary)
                        .font(.system(size: 12))
                        .foregroundStyle(.secondary)
                        .lineLimit(1)
                }
            }
            Spacer()
            Text(item.date)
                .font(.system(size: 12))
                .foregroundStyle(.tertiary)
        }
        .padding(.horizontal, 14)
        .padding(.vertical, 11)
    }
}
