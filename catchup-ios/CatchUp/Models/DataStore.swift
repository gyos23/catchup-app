import Foundation
import Combine

class DataStore: ObservableObject {
    @Published var relationships: [Relationship] = []

    var individuals: [Relationship] { relationships.filter { !$0.isGroup } }

    var avgHealth: Int {
        guard !individuals.isEmpty else { return 0 }
        return individuals.reduce(0) { $0 + $1.healthScore } / individuals.count
    }

    var yourMove: Relationship? {
        individuals
            .filter { $0.healthScore < 100 && $0.daysSinceContact != 0 }
            .sorted { $0.healthScore < $1.healthScore }
            .first
    }

    var overdueCount: Int { relationships.filter { $0.healthScore < 40 }.count }

    // Flatten all contactHistory into a single sorted feed
    var recents: [(item: ContactHistoryItem, contact: Relationship)] {
        relationships
            .flatMap { r in (r.contactHistory).map { ($0, r) } }
            .sorted { parseRelativeDate($0.item.date) > parseRelativeDate($1.item.date) }
    }

    init() { load() }

    func load() {
        guard
            let url = Bundle.main.url(forResource: "relationships", withExtension: "json"),
            let data = try? Data(contentsOf: url),
            let decoded = try? JSONDecoder().decode(RelationshipsPayload.self, from: data)
        else { return }
        relationships = decoded.relationships
    }

    // Parse relative date strings for sorting
    private func parseRelativeDate(_ str: String) -> TimeInterval {
        let s = str.lowercased().trimmingCharacters(in: .whitespaces)
        let now = Date().timeIntervalSince1970
        if s == "today" { return now - 1 }
        if s == "yesterday" { return now - 86400 }
        if let n = s.components(separatedBy: " ").first.flatMap(Int.init) {
            if s.contains("day")   { return now - Double(n) * 86400 }
            if s.contains("week")  { return now - Double(n) * 604800 }
            if s.contains("month") { return now - Double(n) * 2592000 }
            if s.contains("year")  { return now - Double(n) * 31536000 }
        }
        return 0
    }
}
