import SwiftUI
import Foundation

// MARK: - Data Models

struct RelationshipsPayload: Codable {
    let relationships: [Relationship]
}

struct Relationship: Codable, Identifiable, Hashable {
    let id: Int
    let name: String
    let avatar: String
    let phoneNumber: String
    let isGroup: Bool
    let participants: [String]
    let healthScore: Int
    let lastContact: String
    let lastContactDate: String?
    let status: String
    let topics: [String]
    let notes: String
    let contactHistory: [ContactHistoryItem]

    // MARK: - Computed

    var initials: String {
        name.split(separator: " ")
            .compactMap { $0.first }
            .prefix(2)
            .map(String.init)
            .joined()
            .uppercased()
    }

    var healthColor: Color {
        healthScore >= 70 ? Color(hex: "34C759") :
        healthScore >= 40 ? Color(hex: "FF9F0A") :
                            Color(hex: "FF453A")
    }

    var daysSinceContact: Int? {
        guard let raw = lastContactDate else { return nil }
        let fmt = DateFormatter()
        fmt.dateFormat = "yyyy-MM-dd HH:mm:ss"
        guard let date = fmt.date(from: raw) else { return nil }
        return Calendar.current.dateComponents([.day], from: date, to: .now).day
    }

    var urgencyLabel: (text: String, color: Color)? {
        let days = daysSinceContact
        if healthScore < 30 || (days ?? 0) > 60 {
            return ("Overdue", Color(hex: "FF453A"))
        }
        if healthScore < 60 || (days ?? 0) > 30 {
            return ("Check in", Color(hex: "FF9F0A"))
        }
        return nil
    }

    var aiSuggestion: String {
        let n = notes.trimmingCharacters(in: .whitespaces)
        if n.count > 10, !n.hasPrefix("http"), !n.contains("instagram.com") {
            let snippet = n.count > 70 ? String(n.prefix(70)) + "…" : n
            return "Follow up: \"\(snippet)\""
        }
        if let topic = topics.first {
            return "Ask about \(topic.lowercased()) — you two talk about it often."
        }
        if let days = daysSinceContact, days > 14 {
            return "It's been \(daysLabel(days)) — a quick \"thinking of you\" goes a long way."
        }
        return "Keep the momentum going — say hi."
    }

    func daysLabel(_ days: Int) -> String {
        if days == 0 { return "today" }
        if days == 1 { return "yesterday" }
        if days < 7  { return "\(days)d ago" }
        if days < 30 { return "\(days / 7)w ago" }
        if days < 365 { return "\(days / 30)mo ago" }
        return "\(days / 365)y ago"
    }

    static func == (lhs: Relationship, rhs: Relationship) -> Bool { lhs.id == rhs.id }
    func hash(into hasher: inout Hasher) { hasher.combine(id) }
}

struct ContactHistoryItem: Codable, Identifiable {
    var id = UUID()
    let date: String
    let medium: String
    let subject: String
    let initiatedBy: String
    let summary: String

    var isCall: Bool { !medium.lowercased().contains("imessage") }

    enum CodingKeys: String, CodingKey {
        case date, medium, subject, initiatedBy, summary
    }
}

// MARK: - Color Hex Helper

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
