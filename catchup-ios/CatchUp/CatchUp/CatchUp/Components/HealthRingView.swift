import SwiftUI

/// The core visual innovation: health ring IS the avatar ring.
/// Mirrors the animated SVG ring from DesignE exactly.
struct HealthRingView: View {
    let score: Int
    var size: CGFloat = 44
    var strokeWidth: CGFloat = 2.5
    var animationDelay: Double = 0

    @State private var filled = false

    var color: Color {
        score >= 70 ? Color(hex: "34C759") :
        score >= 40 ? Color(hex: "FF9F0A") :
                      Color(hex: "FF453A")
    }

    var body: some View {
        ZStack {
            // Track
            Circle()
                .stroke(Color(.systemFill), lineWidth: strokeWidth)
            // Fill
            Circle()
                .trim(from: 0, to: filled ? CGFloat(score) / 100 : 0)
                .stroke(
                    color,
                    style: StrokeStyle(lineWidth: strokeWidth, lineCap: .round)
                )
                .rotationEffect(.degrees(-90))
                .animation(
                    .spring(response: 1.1, dampingFraction: 0.75)
                    .delay(animationDelay),
                    value: filled
                )
        }
        .frame(width: size, height: size)
        .onAppear {
            DispatchQueue.main.asyncAfter(deadline: .now() + animationDelay) {
                filled = true
            }
        }
    }
}

#Preview {
    HStack(spacing: 20) {
        HealthRingView(score: 94, size: 60)
        HealthRingView(score: 55, size: 60)
        HealthRingView(score: 22, size: 60)
    }
    .padding()
}
