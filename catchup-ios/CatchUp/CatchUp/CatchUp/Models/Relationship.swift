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

    // Mutable — updated when interactions are logged
    var healthScore: Int
    var lastContact: String
    var lastContactDate: String?
    var status: String
    var topics: [String]
    var notes: String
    var contactHistory: [ContactHistoryItem]

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
        // Prefer ISO date field
        if let raw = lastContactDate {
            let fmt = DateFormatter()
            fmt.dateFormat = "yyyy-MM-dd HH:mm:ss"
            if let date = fmt.date(from: raw) {
                return Calendar.current.dateComponents([.day], from: date, to: .now).day
            }
        }
        // Fall back to parsing relative string (for contacts with no ISO date)
        let days = Self.daysFromRelativeString(lastContact)
        return days >= 0 ? days : nil
    }

    var urgencyLabel: (text: String, color: Color)? {
        // No history logged yet — don't show a misleading urgency badge
        guard lastContact != "Not yet tracked" else { return nil }
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

    // MARK: - Recompute health from logged history

    /// Call after logging any new interaction to keep the score live.
    mutating func recomputeHealth() {
        guard !contactHistory.isEmpty else { return }

        let now = Date().timeIntervalSince1970
        let timestamps = contactHistory
            .map { Self.parseHistoryDate($0.date) }
            .filter { $0 > 0 }
            .sorted(by: >)

        guard let mostRecent = timestamps.first else { return }

        // ── Recency (40 pts) ────────────────────────────────────────────────
        let daysSince = (now - mostRecent) / 86400
        let recency: Int
        switch daysSince {
        case ..<1:   recency = 40
        case ..<3:   recency = 35
        case ..<7:   recency = 28
        case ..<14:  recency = 20
        case ..<30:  recency = 10
        case ..<60:  recency = 5
        default:     recency = 2
        }

        // ── Frequency (30 pts) — interactions/week over 90 days ─────────────
        let ninetyDaysAgo = now - 90 * 86400
        let recentCount = timestamps.filter { $0 > ninetyDaysAgo }.count
        let perWeek = Double(recentCount) / 12.86
        let frequency: Int
        switch perWeek {
        case 10...:      frequency = 30
        case 5..<10:     frequency = 24
        case 2..<5:      frequency = 18
        case 1..<2:      frequency = 12
        case 0.5..<1:    frequency = 6
        default:         frequency = 2
        }

        // ── Balance (20 pts) — user-initiated ratio over 30 days ───────────
        let thirtyDaysAgo = now - 30 * 86400
        let recent30 = contactHistory.filter { Self.parseHistoryDate($0.date) > thirtyDaysAgo }
        let initiated = recent30.filter {
            $0.initiatedBy.lowercased().contains("me") ||
            $0.initiatedBy.lowercased().contains("you")
        }.count
        let ratio = recent30.isEmpty ? 0.3 : Double(initiated) / Double(recent30.count)
        let balance: Int
        switch ratio {
        case 0.3...:      balance = 20
        case 0.15..<0.3:  balance = 14
        case 0.05..<0.15: balance = 8
        default:          balance = 3
        }

        // ── Trend (10 pts) — this month vs last month ───────────────────────
        let thisMonthStart = now - 30 * 86400
        let lastMonthStart = now - 60 * 86400
        let thisMonth  = timestamps.filter { $0 > thisMonthStart }.count
        let lastMonth  = timestamps.filter { $0 > lastMonthStart && $0 <= thisMonthStart }.count
        let trend: Int  = thisMonth >= lastMonth ? 10 : (Double(thisMonth) > Double(lastMonth) * 0.5 ? 5 : 0)

        healthScore = min(100, recency + frequency + balance + trend)
        status      = healthScore >= 70 ? "green" : healthScore >= 40 ? "yellow" : "red"

        // Update lastContact string
        let d = Int(daysSince)
        lastContact = d == 0 ? "Today" : d == 1 ? "Yesterday" : "\(d) days ago"

        // Update lastContactDate to ISO
        let fmt = DateFormatter()
        fmt.dateFormat = "yyyy-MM-dd HH:mm:ss"
        lastContactDate = fmt.string(from: Date(timeIntervalSince1970: mostRecent))
    }

    // MARK: - Date parsing helpers (static so usable from non-mutating context)

    static func parseHistoryDate(_ str: String) -> TimeInterval {
        let s = str.lowercased().trimmingCharacters(in: .whitespaces)
        let now = Date().timeIntervalSince1970
        if s == "today"     { return now - 60 }
        if s == "yesterday" { return now - 86400 }
        let parts = s.components(separatedBy: " ")
        if let n = parts.first.flatMap(Int.init) {
            if s.contains("day")   { return now - Double(n) * 86400 }
            if s.contains("week")  { return now - Double(n) * 604800 }
            if s.contains("month") { return now - Double(n) * 2592000 }
            if s.contains("year")  { return now - Double(n) * 31536000 }
        }
        let fmt = DateFormatter()
        fmt.dateFormat = "yyyy-MM-dd HH:mm:ss"
        if let date = fmt.date(from: str) { return date.timeIntervalSince1970 }
        return 0
    }

    static func daysFromRelativeString(_ str: String) -> Int {
        let s = str.lowercased().trimmingCharacters(in: .whitespaces)
        if s == "today"     { return 0 }
        if s == "yesterday" { return 1 }
        let parts = s.components(separatedBy: " ")
        if let n = parts.first.flatMap(Int.init) {
            if s.contains("day")   { return n }
            if s.contains("week")  { return n * 7 }
            if s.contains("month") { return n * 30 }
            if s.contains("year")  { return n * 365 }
        }
        return -1
    }

    static func == (lhs: Relationship, rhs: Relationship) -> Bool { lhs.id == rhs.id }
    func hash(into hasher: inout Hasher) { hasher.combine(id) }
}

// MARK: - ContactHistoryItem

struct ContactHistoryItem: Codable, Identifiable {
    var id = UUID()
    var date: String
    var medium: String
    var subject: String
    var initiatedBy: String
    var summary: String

    var isCall: Bool { !medium.lowercased().contains("imessage") && !medium.lowercased().contains("message") }

    var mediumIcon: String {
        let m = medium.lowercased()
        if m.contains("facetime") && m.contains("video") { return "video.fill" }
        if m.contains("facetime") { return "phone.fill" }
        if m.contains("phone") || m.contains("call") { return "phone.fill" }
        return "message.fill"
    }

    var mediumColor: Color {
        isCall ? Color(hex: "34C759") : Color(hex: "007AFF")
    }

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
