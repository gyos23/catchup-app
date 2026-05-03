import SwiftUI

// MARK: - CatchUp App Clip
// Shown when someone scans a QR code or taps a Smart App Banner.
// Displays animated relationship rings + CTA to get the full app.

struct AppClipView: View {
    @State private var appeared = false

    // Sample contacts for the preview — no real data access needed in the clip
    private let samples: [(initials: String, score: Int, name: String)] = [
        ("JL", 83, "Janice"),
        ("MM", 47, "Matt"),
        ("SR", 28, "Sandra"),
    ]

    var body: some View {
        ZStack {
            // Background
            LinearGradient(
                colors: [Color(hex: "007AFF").opacity(0.1), Color(.systemBackground)],
                startPoint: .top, endPoint: .bottom
            )
            .ignoresSafeArea()

            VStack(spacing: 0) {

                Spacer()

                // ── Rings ────────────────────────────────────────────────────
                HStack(spacing: 20) {
                    ForEach(Array(samples.enumerated()), id: \.offset) { i, sample in
                        VStack(spacing: 8) {
                            ClipRing(
                                initials: sample.initials,
                                score: sample.score,
                                size: 72,
                                delay: Double(i) * 0.2
                            )
                            Text(sample.name)
                                .font(.system(size: 13))
                                .foregroundStyle(.secondary)
                        }
                    }
                }
                .padding(.bottom, 32)

                // ── Headline ─────────────────────────────────────────────────
                VStack(spacing: 10) {
                    Text("CatchUp")
                        .font(.system(size: 32, weight: .bold))

                    Text("See the health of every\nrelationship at a glance.")
                        .font(.system(size: 17))
                        .foregroundStyle(.secondary)
                        .multilineTextAlignment(.center)
                }
                .padding(.bottom, 24)

                // ── Score pills ──────────────────────────────────────────────
                HStack(spacing: 10) {
                    ForEach([("🟢", "Healthy"), ("🟡", "Check In"), ("🔴", "Overdue")], id: \.1) { dot, label in
                        HStack(spacing: 4) {
                            Text(dot).font(.system(size: 12))
                            Text(label).font(.system(size: 12, weight: .medium)).foregroundStyle(.secondary)
                        }
                        .padding(.horizontal, 10).padding(.vertical, 5)
                        .background(Color(.secondarySystemFill))
                        .clipShape(Capsule())
                    }
                }
                .padding(.bottom, 36)

                // ── CTA ──────────────────────────────────────────────────────
                VStack(spacing: 12) {
                    Link(destination: URL(string: "https://apps.apple.com/app/catchup/id000000000")!) {
                        HStack(spacing: 8) {
                            Image(systemName: "arrow.down.app.fill")
                            Text("Get CatchUp — Free")
                                .fontWeight(.semibold)
                        }
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 16)
                        .background(Color(hex: "007AFF"))
                        .foregroundStyle(.white)
                        .clipShape(RoundedRectangle(cornerRadius: 14))
                    }

                    Text("100% on-device · No account · No tracking")
                        .font(.system(size: 12))
                        .foregroundStyle(.tertiary)
                }
                .padding(.horizontal, 32)

                Spacer()
            }
        }
    }
}

// MARK: - Animated ring for the clip

private struct ClipRing: View {
    let initials: String
    let score: Int
    let size: CGFloat
    let delay: Double
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

            ZStack {
                Circle().fill(color.opacity(0.15)).frame(width: size - 12, height: size - 12)
                Text(initials)
                    .font(.system(size: size * 0.22, weight: .semibold))
                    .foregroundStyle(color)
            }
        }
        .frame(width: size, height: size)
        .onAppear { filled = true }
    }
}

// MARK: - Color helper (self-contained for the clip target)
extension Color {
    init(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let r = Double((int >> 16) & 0xFF) / 255
        let g = Double((int >> 8)  & 0xFF) / 255
        let b = Double(int         & 0xFF) / 255
        self.init(red: r, green: g, blue: b)
    }
}
