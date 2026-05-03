import SwiftUI
import UniformTypeIdentifiers

struct OnboardingView: View {
    @ObservedObject var store: DataStore
    @State private var showScience = false
    @State private var showFilePicker = false
    @State private var importError: String?
    @State private var showError = false

    var body: some View {
        ZStack {
            LinearGradient(
                colors: [Color(hex: "007AFF").opacity(0.08), Color(.systemBackground)],
                startPoint: .top, endPoint: .bottom
            )
            .ignoresSafeArea()

            ScrollView {
                VStack(spacing: 0) {

                    // ── Hero ────────────────────────────────────────────────
                    VStack(spacing: 16) {
                        ZStack {
                            ForEach(0..<3) { i in
                                RingPreview(
                                    score: [82, 58, 34][i],
                                    size: CGFloat([80, 64, 50][i]),
                                    delay: Double(i) * 0.18
                                )
                                .offset(x: CGFloat([-32, 0, 32][i]),
                                        y: CGFloat([8, -4, 8][i]))
                            }
                        }
                        .frame(height: 110)
                        .padding(.top, 56)

                        Text("CatchUp")
                            .font(.system(size: 36, weight: .bold))
                        Text("Relationships worth keeping,\nvisible at a glance.")
                            .font(.system(size: 17))
                            .foregroundStyle(.secondary)
                            .multilineTextAlignment(.center)
                    }
                    .padding(.bottom, 40)

                    // ── Value props ─────────────────────────────────────────
                    VStack(spacing: 12) {
                        ValueProp(icon: "chart.bar.fill", color: Color(hex: "007AFF"),
                                  title: "Health score for every relationship",
                                  desc: "Based on recency, frequency, balance, and trend.")
                        ValueProp(icon: "bolt.fill", color: Color(hex: "FF9F0A"),
                                  title: "Your move, every day",
                                  desc: "One nudge — the person who needs you most right now.")
                        ValueProp(icon: "lock.fill", color: Color(hex: "34C759"),
                                  title: "100% on-device, no account needed",
                                  desc: "Your data never leaves your phone.")
                    }
                    .padding(.horizontal, 24)
                    .padding(.bottom, 36)

                    // ── CTAs ────────────────────────────────────────────────
                    VStack(spacing: 12) {

                        // Primary: Sync from Mac
                        Button { showFilePicker = true } label: {
                            HStack(spacing: 10) {
                                Image(systemName: "arrow.down.doc.fill")
                                VStack(alignment: .leading, spacing: 1) {
                                    Text("Sync from Mac")
                                        .fontWeight(.semibold)
                                    Text("Real scores from your iMessage & calls")
                                        .font(.system(size: 11))
                                        .opacity(0.85)
                                }
                            }
                            .frame(maxWidth: .infinity, alignment: .leading)
                            .padding(.horizontal, 20)
                            .padding(.vertical, 14)
                            .background(Color(hex: "007AFF"))
                            .foregroundStyle(.white)
                            .clipShape(RoundedRectangle(cornerRadius: 14))
                        }

                        // Secondary: Import contacts
                        Button {
                            Task { await store.importFromiOSContacts() }
                        } label: {
                            HStack(spacing: 10) {
                                if store.isImporting {
                                    ProgressView()
                                } else {
                                    Image(systemName: "person.badge.plus")
                                }
                                Text(store.isImporting ? "Importing…" : "Import My Contacts")
                                    .fontWeight(.medium)
                            }
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 14)
                            .background(Color(.secondarySystemFill))
                            .foregroundStyle(.primary)
                            .clipShape(RoundedRectangle(cornerRadius: 14))
                        }
                        .disabled(store.isImporting)

                        // Tertiary: Demo
                        Button { store.loadDemo() } label: {
                            Text("Try a Demo")
                                .font(.system(size: 14))
                                .foregroundStyle(.secondary)
                        }
                        .padding(.top, 4)
                    }
                    .padding(.horizontal, 24)

                    // ── How to sync instructions ─────────────────────────────
                    VStack(alignment: .leading, spacing: 10) {
                        Text("HOW TO SYNC FROM YOUR MAC")
                            .font(.system(size: 11, weight: .semibold))
                            .foregroundStyle(.secondary)
                            .tracking(0.5)

                        ForEach(syncSteps, id: \.num) { step in
                            HStack(alignment: .top, spacing: 12) {
                                Text("\(step.num)")
                                    .font(.system(size: 12, weight: .bold))
                                    .foregroundStyle(.white)
                                    .frame(width: 20, height: 20)
                                    .background(Color(hex: "007AFF"))
                                    .clipShape(Circle())
                                VStack(alignment: .leading, spacing: 2) {
                                    Text(step.title)
                                        .font(.system(size: 13, weight: .semibold))
                                    Text(step.detail)
                                        .font(.system(size: 12))
                                        .foregroundStyle(.secondary)
                                }
                            }
                        }

                        // iCloud badge
                        HStack(spacing: 6) {
                            Image(systemName: "checkmark.icloud.fill")
                                .foregroundStyle(Color(hex: "34C759"))
                                .font(.system(size: 13))
                            Text("No AirDrop needed — iCloud does it automatically")
                                .font(.system(size: 12))
                                .foregroundStyle(.secondary)
                        }
                        .padding(.top, 4)
                    }
                    .padding(16)
                    .background(Color(.secondarySystemGroupedBackground))
                    .clipShape(RoundedRectangle(cornerRadius: 14))
                    .padding(.horizontal, 24)
                    .padding(.top, 28)

                    // ── Science link ────────────────────────────────────────
                    Button { showScience = true } label: {
                        HStack(spacing: 4) {
                            Image(systemName: "flask.fill")
                            Text("Backed by science — learn how scoring works")
                        }
                        .font(.system(size: 13))
                        .foregroundStyle(Color(hex: "007AFF"))
                    }
                    .padding(.top, 20)
                    .padding(.bottom, 48)
                }
            }
        }
        .fileImporter(
            isPresented: $showFilePicker,
            allowedContentTypes: [.json],
            allowsMultipleSelection: false
        ) { result in
            switch result {
            case .success(let urls):
                guard let url = urls.first else { return }
                let count = store.importFromFile(url)
                if count == 0 {
                    importError = "Couldn't read the file. Make sure it's the relationships.json from the CatchUp sync script."
                    showError = true
                } else {
                    HapticManager.success()
                }
            case .failure(let error):
                importError = error.localizedDescription
                showError = true
            }
        }
        .alert("Import Failed", isPresented: $showError) {
            Button("OK", role: .cancel) {}
        } message: {
            Text(importError ?? "Unknown error")
        }
        .sheet(isPresented: $showScience) { ScienceView() }
    }
}

// MARK: - Sync steps data

private struct SyncStep { let num: Int; let title: String; let detail: String }
private let syncSteps = [
    SyncStep(num: 1, title: "On your Mac", detail: "Run: node scripts/sync-imessages.js"),
    SyncStep(num: 2, title: "That's it", detail: "iCloud pushes your scores to this iPhone automatically — no AirDrop, no cables."),
    SyncStep(num: 3, title: "Or use manual sync", detail: "Tap \"Sync from Mac\" above to pick relationships.json directly via Files / AirDrop."),
]

// MARK: - Sub-views

private struct ValueProp: View {
    let icon: String; let color: Color; let title: String; let desc: String
    var body: some View {
        HStack(alignment: .top, spacing: 14) {
            ZStack {
                RoundedRectangle(cornerRadius: 10)
                    .fill(color.opacity(0.12))
                    .frame(width: 40, height: 40)
                Image(systemName: icon)
                    .foregroundStyle(color)
                    .font(.system(size: 16))
            }
            VStack(alignment: .leading, spacing: 2) {
                Text(title).font(.system(size: 15, weight: .semibold))
                Text(desc).font(.system(size: 13)).foregroundStyle(.secondary)
            }
            Spacer()
        }
        .padding(14)
        .background(Color(.secondarySystemGroupedBackground))
        .clipShape(RoundedRectangle(cornerRadius: 14))
    }
}

private struct RingPreview: View {
    let score: Int; let size: CGFloat; let delay: Double
    @State private var filled = false

    var color: Color {
        score >= 70 ? Color(hex: "34C759") :
        score >= 40 ? Color(hex: "FF9F0A") :
                      Color(hex: "FF453A")
    }
    var body: some View {
        ZStack {
            Circle().stroke(Color(.systemFill), lineWidth: 4)
            Circle()
                .trim(from: 0, to: filled ? CGFloat(score) / 100 : 0)
                .stroke(color, style: StrokeStyle(lineWidth: 4, lineCap: .round))
                .rotationEffect(.degrees(-90))
                .animation(.spring(response: 1.2, dampingFraction: 0.7).delay(delay), value: filled)
            Circle()
                .fill(color.opacity(0.15))
                .frame(width: size - 12, height: size - 12)
        }
        .frame(width: size, height: size)
        .onAppear { filled = true }
    }
}
