import SwiftUI

struct AvatarView: View {
    let contact: Relationship
    var size: CGFloat = 44
    var animationDelay: Double = 0

    private static let gradients: [(Color, Color)] = [
        (Color(hex: "FF6B6B"), Color(hex: "C0392B")),
        (Color(hex: "4ECDC4"), Color(hex: "16A085")),
        (Color(hex: "45B7D1"), Color(hex: "2980B9")),
        (Color(hex: "96CEB4"), Color(hex: "27AE60")),
        (Color(hex: "DDA0DD"), Color(hex: "8E44AD")),
        (Color(hex: "F7DC6F"), Color(hex: "D4AC0D")),
        (Color(hex: "F0A500"), Color(hex: "E67E22")),
        (Color(hex: "85C1E9"), Color(hex: "1A5276")),
    ]

    var gradientPair: (Color, Color) {
        let idx = Int(contact.name.unicodeScalars.first?.value ?? 0) % Self.gradients.count
        return Self.gradients[idx]
    }

    var innerSize: CGFloat { size - (size > 60 ? 10 : 8) }
    var strokeWidth: CGFloat { size > 60 ? 3.5 : 2.5 }

    var isUntracked: Bool { contact.lastContact == "Not yet tracked" }

    var body: some View {
        ZStack {
            if isUntracked {
                // Grey dashed ring — no score available yet
                Circle()
                    .stroke(Color(.systemFill), style: StrokeStyle(lineWidth: strokeWidth, dash: [4, 3]))
                    .frame(width: size, height: size)
            } else {
                HealthRingView(
                    score: contact.healthScore,
                    size: size,
                    strokeWidth: strokeWidth,
                    animationDelay: animationDelay
                )
            }

            Circle()
                .fill(
                    isUntracked
                        ? LinearGradient(colors: [Color(.systemGray4), Color(.systemGray3)], startPoint: .topLeading, endPoint: .bottomTrailing)
                        : LinearGradient(colors: [gradientPair.0, gradientPair.1], startPoint: .topLeading, endPoint: .bottomTrailing)
                )
                .frame(width: innerSize, height: innerSize)

            if isUntracked {
                Text("?")
                    .font(.system(size: innerSize * 0.34, weight: .semibold))
                    .foregroundColor(Color(.systemGray2))
            } else {
                Text(contact.initials)
                    .font(.system(size: innerSize * 0.34, weight: .semibold))
                    .foregroundColor(.white)
            }
        }
    }
}

#Preview {
    let sample = try! JSONDecoder().decode(
        RelationshipsPayload.self,
        from: Data("""
        {"relationships":[{"id":1,"name":"Yli Liriano","avatar":"YL","phoneNumber":"+1","isGroup":false,"participants":[],"healthScore":88,"lastContact":"Today","lastContactDate":null,"status":"green","topics":["Travel"],"notes":"Hey","contactHistory":[]}]}
        """.utf8)
    )
    AvatarView(contact: sample.relationships[0], size: 80)
        .padding()
}
