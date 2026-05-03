import Foundation
import Combine

private let kUserContacts = "catchup_user_contacts"
private let iCloudContainerID = "iCloud.com.dorianliriano.CatchUp"

class DataStore: ObservableObject {
    @Published var relationships: [Relationship] = []
    @Published var isImported: Bool = false

    // MARK: - iCloud sync

    private var metadataQuery: NSMetadataQuery?
    private var iCloudObservers: [NSObjectProtocol] = []

    /// The iCloud Documents folder for this app, or nil if iCloud is unavailable.
    var iCloudDocumentsURL: URL? {
        FileManager.default
            .url(forUbiquityContainerIdentifier: iCloudContainerID)?
            .appendingPathComponent("Documents")
    }

    /// Start watching the iCloud container for relationships.json changes.
    func startICloudSync() {
        // iCloud container lookup must happen off the main thread to avoid a
        // brief stall; we use a detached Task and push results back to MainActor.
        Task.detached(priority: .userInitiated) { [weak self] in
            guard let self else { return }
            guard let docsURL = self.iCloudDocumentsURL else {
                print("ℹ️ iCloud unavailable — using local / file-importer sync only")
                return
            }

            // Immediately load if the file is already on disk
            let fileURL = docsURL.appendingPathComponent("relationships.json")
            if FileManager.default.fileExists(atPath: fileURL.path) {
                await MainActor.run { self.loadFromICloud(url: fileURL) }
            }

            // Set up NSMetadataQuery on the main thread (required)
            await MainActor.run { self.startMetadataQuery() }
        }
    }

    private func startMetadataQuery() {
        let query = NSMetadataQuery()
        query.searchScopes = [NSMetadataQueryUbiquitousDocumentsScope]
        query.predicate = NSPredicate(format: "%K == %@",
                                      NSMetadataItemFSNameKey, "relationships.json")

        let handler: (Notification) -> Void = { [weak self, weak query] _ in
            guard let self, let query else { return }
            self.handleQueryResults(query)
        }

        iCloudObservers = [
            NotificationCenter.default.addObserver(
                forName: .NSMetadataQueryDidFinishGathering,
                object: query, queue: .main, using: handler),
            NotificationCenter.default.addObserver(
                forName: .NSMetadataQueryDidUpdate,
                object: query, queue: .main, using: handler),
        ]

        query.start()
        metadataQuery = query
        print("✅ iCloud sync watcher started")
    }

    private func handleQueryResults(_ query: NSMetadataQuery) {
        query.disableUpdates()
        defer { query.enableUpdates() }

        for i in 0..<query.resultCount {
            guard let item = query.result(at: i) as? NSMetadataItem,
                  let url = item.value(forAttribute: NSMetadataItemURLKey) as? URL
            else { continue }

            let status = item.value(forAttribute: NSMetadataUbiquitousItemDownloadingStatusKey) as? String
            if status == NSMetadataUbiquitousItemDownloadingStatusNotDownloaded {
                try? FileManager.default.startDownloadingUbiquitousItem(at: url)
                print("☁️ Downloading relationships.json from iCloud…")
            } else if status == NSMetadataUbiquitousItemDownloadingStatusCurrent ||
                      status == NSMetadataUbiquitousItemDownloadingStatusDownloaded {
                loadFromICloud(url: url)
            }
        }
    }

    private func loadFromICloud(url: URL) {
        guard let data = try? Data(contentsOf: url),
              let decoded = try? JSONDecoder().decode(RelationshipsPayload.self, from: data),
              !decoded.relationships.isEmpty
        else {
            print("⚠️ iCloud file found but couldn't decode")
            return
        }
        relationships = decoded.relationships
        isImported = true
        save()
        HapticManager.success()
        print("✅ iCloud sync loaded \(decoded.relationships.count) contacts")
    }

    var individuals: [Relationship] { relationships.filter { !$0.isGroup } }

    var avgHealth: Int {
        guard !individuals.isEmpty else { return 0 }
        return individuals.reduce(0) { $0 + $1.healthScore } / individuals.count
    }

    var yourMove: Relationship? {
        individuals
            .filter { $0.lastContact != "Not yet tracked" && $0.healthScore < 100 && $0.daysSinceContact != 0 }
            .sorted { $0.healthScore < $1.healthScore }
            .first
    }

    var overdueCount: Int { relationships.filter { $0.lastContact != "Not yet tracked" && $0.healthScore < 40 }.count }

    var recents: [(item: ContactHistoryItem, contact: Relationship)] {
        relationships
            .flatMap { r in r.contactHistory.map { ($0, r) } }
            .sorted { parseRelativeDate($0.item.date) > parseRelativeDate($1.item.date) }
    }

    init() { load() }

    // MARK: - Load

    func load() {
        // Only restore previously imported contacts — never auto-populate for new users
        if let saved = UserDefaults.standard.data(forKey: kUserContacts),
           let decoded = try? JSONDecoder().decode([Relationship].self, from: saved),
           !decoded.isEmpty {
            relationships = decoded
            isImported = true
            print("✅ Loaded \(decoded.count) imported contacts")
        } else {
            relationships = []
            isImported = false
            print("ℹ️ No contacts — showing onboarding")
        }
    }

    /// Load the bundled sample data for the onboarding demo
    func loadDemo() {
        guard
            let url = Bundle.main.url(forResource: "relationships", withExtension: "json"),
            let data = try? Data(contentsOf: url),
            let decoded = try? JSONDecoder().decode(RelationshipsPayload.self, from: data)
        else {
            print("❌ Demo data not found")
            return
        }
        relationships = decoded.relationships
        isImported = false   // keeps import button visible so users can replace with their own
        print("✅ Loaded \(decoded.relationships.count) demo contacts")
    }

    // MARK: - Import from iOS Contacts

    @Published var isImporting = false

    @MainActor
    func importFromiOSContacts() async {
        guard !isImporting else { return }
        isImporting = true
        defer { isImporting = false }

        let granted = await ContactsImporter.requestAccess()
        guard granted else { return }
        do {
            // Enumerate contacts strictly on a background thread
            let imported = try await withCheckedThrowingContinuation { continuation in
                DispatchQueue.global(qos: .userInitiated).async {
                    do {
                        let result = try ContactsImporter.fetchAll()
                        continuation.resume(returning: result)
                    } catch {
                        continuation.resume(throwing: error)
                    }
                }
            }
            relationships = imported
            isImported = true
            save()
            print("✅ Imported \(imported.count) contacts from iOS")
        } catch {
            print("❌ Import failed: \(error)")
        }
    }

    // MARK: - Import from Mac sync file (AirDrop / Files)

    @discardableResult
    func importFromFile(_ url: URL) -> Int {
        url.startAccessingSecurityScopedResource()
        defer { url.stopAccessingSecurityScopedResource() }
        guard
            let data = try? Data(contentsOf: url),
            let decoded = try? JSONDecoder().decode(RelationshipsPayload.self, from: data),
            !decoded.relationships.isEmpty
        else {
            print("❌ File import failed — bad format?")
            return 0
        }
        relationships = decoded.relationships
        isImported = true
        save()
        print("✅ Imported \(decoded.relationships.count) contacts from file")
        return decoded.relationships.count
    }

    // MARK: - Update

    func updateContact(_ updated: Relationship) {
        guard let idx = relationships.firstIndex(where: { $0.id == updated.id }) else { return }
        relationships[idx] = updated
        save()
    }

    // MARK: - Persist

    func save() {
        if let encoded = try? JSONEncoder().encode(relationships) {
            UserDefaults.standard.set(encoded, forKey: kUserContacts)
        }
    }

    func resetToBundle() {
        UserDefaults.standard.removeObject(forKey: kUserContacts)
        isImported = false
        load()
    }

    // MARK: - Helpers

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
