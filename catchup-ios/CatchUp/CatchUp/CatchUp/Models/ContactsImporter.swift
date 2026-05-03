import Contacts
import Foundation

class ContactsImporter {

    static func requestAccess() async -> Bool {
        let store = CNContactStore()
        do {
            return try await store.requestAccess(for: .contacts)
        } catch {
            return false
        }
    }

    static func fetchAll() throws -> [Relationship] {
        let store = CNContactStore()
        let keys: [CNKeyDescriptor] = [
            CNContactGivenNameKey as CNKeyDescriptor,
            CNContactFamilyNameKey as CNKeyDescriptor,
            CNContactPhoneNumbersKey as CNKeyDescriptor,
            CNContactOrganizationNameKey as CNKeyDescriptor,
        ]

        var results: [Relationship] = []
        let request = CNContactFetchRequest(keysToFetch: keys)

        try store.enumerateContacts(with: request) { contact, _ in
            let name = [contact.givenName, contact.familyName]
                .filter { !$0.isEmpty }
                .joined(separator: " ")
                .trimmingCharacters(in: .whitespaces)

            guard !name.isEmpty else { return }

            let phone = contact.phoneNumbers.first?.value.stringValue ?? ""
            let stableId = abs((name + phone).hashValue) % 2_000_000_000

            // No real history available on import — start neutral.
            // Score and last-contact update the moment the user logs a real interaction.
            results.append(Relationship(
                id: stableId,
                name: name,
                avatar: String(name.split(separator: " ").compactMap { $0.first }.prefix(2).map(String.init).joined().uppercased()),
                phoneNumber: phone,
                isGroup: false,
                participants: [],
                healthScore: 50,
                lastContact: "Not yet tracked",
                lastContactDate: nil,
                status: "yellow",
                topics: [],
                notes: "",
                contactHistory: []
            ))
        }

        return results.sorted { $0.name < $1.name }
    }
}
