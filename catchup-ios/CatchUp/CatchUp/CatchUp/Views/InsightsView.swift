import SwiftUI

struct InsightsView: View {
    @ObservedObject var store: DataStore
    @State private var selectedContact: Relationship?
    @State private var showScience = false

    var healthLabel: String {
        store.avgHealth >= 70 ? "Strong" :
        store.avgHealth >= 40 ? "Drifting" : "Needs work"
    }

    var body: some View {
        NavigationView {
            List {
                // Overall health ring card
                Section {
                    HStack(spacing: 16) {
                        InsightsRing(score: store.avgHealth, size: 72)
                        VStack(alignment: .leading, spacing: 4) {
                            Text(healthLabel)
                                .font(.system(size: 22, weight: .bold))
                            Text("across \(store.individuals.count) relationships")
                                .font(.subheadline)
                                .foregroundStyle(.secondary)
                        }
                    }
                    .padding(.vertical, 4)
                }

                // Breakdown
                Section("Breakdown") {
                    StatusRow(label: "Healthy",  count: store.individuals.filter { $0.healthScore >= 70 }.count, color: Color(hex: "34C759"))
                    StatusRow(label: "Drifting", count: store.individuals.filter { $0.healthScore >= 40 && $0.healthScore < 70 }.count, color: Color(hex: "FF9F0A"))
                    StatusRow(label: "Overdue",  count: store.individuals.filter { $0.healthScore < 40 }.count, color: Color(hex: "FF453A"))
                }

                // This month stats
                Section("This Month") {
                    HStack(spacing: 12) {
                        StatCard(
                            value: "\(store.individuals.filter { ($0.daysSinceContact ?? 999) < 30 }.count)",
                            unit: "people",
                            label: "Reached out"
                        )
                        StatCard(
                            value: "\(store.avgHealth)",
                            unit: "/ 100",
                            label: "Avg. health"
                        )
                    }
                }
                .listRowBackground(Color.clear)
                .listRowInsets(EdgeInsets(top: 8, leading: 16, bottom: 8, trailing: 16))

                // Action items
                let overdue = store.relationships
                    .filter { $0.healthScore < 60 }
                    .sorted { $0.healthScore < $1.healthScore }
                    .prefix(3)

                if !overdue.isEmpty {
                    Section("Action Items") {
                        ForEach(overdue) { contact in
                            Button { selectedContact = contact } label: {
                                HStack(spacing: 12) {
                                    AvatarView(contact: contact, size: 44, animationDelay: 0.2)
                                    VStack(alignment: .leading, spacing: 2) {
                                        Text(contact.name).font(.system(size: 16)).foregroundStyle(.primary)
                                        if let urgency = contact.urgencyLabel, let days = contact.daysSinceContact {
                                            Text("\(urgency.text) · \(contact.daysLabel(days))")
                                                .font(.system(size: 13, weight: .medium))
                                                .foregroundStyle(urgency.color)
                                        }
                                    }
                                    Spacer()
                                    HStack(spacing: 8) {
                                        Image(systemName: "message").foregroundStyle(.blue)
                                        Image(systemName: "phone").foregroundStyle(.green)
                                    }
                                    .font(.system(size: 16))
                                }
                            }
                            .buttonStyle(.plain)
                        }
                    }
                }
            }
            .listStyle(.insetGrouped)
            .navigationTitle("Insights")
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button {
                        showScience = true
                    } label: {
                        Image(systemName: "flask.fill")
                            .foregroundStyle(Color(hex: "007AFF"))
                    }
                }
            }
            .sheet(item: $selectedContact) { ContactDetailSheet(contact: $0, store: store) }
            .sheet(isPresented: $showScience) { ScienceView() }
        }
    }
}

// MARK: - Subviews

private struct InsightsRing: View {
    let score: Int
    let size: CGFloat
    @State private var filled = false

    var color: Color {
        score >= 70 ? Color(hex: "34C759") :
        score >= 40 ? Color(hex: "FF9F0A") :
                      Color(hex: "FF453A")
    }

    var body: some View {
        ZStack {
            Circle().stroke(Color(.systemFill), lineWidth: 5)
            Circle()
                .trim(from: 0, to: filled ? CGFloat(score) / 100 : 0)
                .stroke(color, style: StrokeStyle(lineWidth: 5, lineCap: .round))
                .rotationEffect(.degrees(-90))
                .animation(.spring(response: 1.1, dampingFraction: 0.75).delay(0.12), value: filled)
            Text("\(score)")
                .font(.system(size: 18, weight: .bold))
        }
        .frame(width: size, height: size)
        .onAppear { filled = true }
    }
}

private struct StatusRow: View {
    let label: String
    let count: Int
    let color: Color
    var body: some View {
        HStack {
            Circle().fill(color).frame(width: 8, height: 8)
            Text(label)
            Spacer()
            Text("\(count)").foregroundStyle(.secondary).fontWeight(.semibold)
        }
    }
}

private struct StatCard: View {
    let value: String
    let unit: String
    let label: String
    var body: some View {
        VStack(alignment: .leading, spacing: 2) {
            HStack(alignment: .lastTextBaseline, spacing: 4) {
                Text(value).font(.system(size: 32, weight: .bold))
                Text(unit).font(.system(size: 13)).foregroundStyle(.secondary)
            }
            Text(label.uppercased())
                .font(.system(size: 11, weight: .medium))
                .foregroundStyle(.tertiary)
                .tracking(0.3)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(16)
        .background(Color(.secondarySystemGroupedBackground))
        .clipShape(RoundedRectangle(cornerRadius: 14))
    }
}
