import Foundation
import Combine

/// Manages data persistence for daily entries
class DataManager: ObservableObject {
    static let shared = DataManager()

    @Published var entries: [DailyEntry] = []

    private let entriesKey = "mindfulness_entries"

    init() {
        loadEntries()
    }

    /// Load entries from UserDefaults
    func loadEntries() {
        if let data = UserDefaults.standard.data(forKey: entriesKey),
           let decoded = try? JSONDecoder().decode([DailyEntry].self, from: data) {
            entries = decoded.sorted { $0.date > $1.date }
        }
    }

    /// Save entries to UserDefaults
    func saveEntries() {
        if let encoded = try? JSONEncoder().encode(entries) {
            UserDefaults.standard.set(encoded, forKey: entriesKey)
        }
    }

    /// Add a new entry
    func addEntry(_ entry: DailyEntry) {
        entries.append(entry)
        entries.sort { $0.date > $1.date }
        saveEntries()
    }

    /// Update an existing entry
    func updateEntry(_ entry: DailyEntry) {
        if let index = entries.firstIndex(where: { $0.id == entry.id }) {
            entries[index] = entry
            saveEntries()
        }
    }

    /// Get today's entries
    func getTodayEntries() -> [DailyEntry] {
        let calendar = Calendar.current
        let today = calendar.startOfDay(for: Date())

        return entries.filter { entry in
            calendar.isDate(entry.date, inSameDayAs: today)
        }
    }

    /// Get or create an entry for the current time
    func getCurrentEntry() -> DailyEntry {
        // Check if there's a recent entry (within the last 4 hours)
        let fourHoursAgo = Date().addingTimeInterval(-4 * 60 * 60)
        if let recentEntry = entries.first(where: { $0.date > fourHoursAgo && !$0.isComplete }) {
            return recentEntry
        }

        // Create a new entry
        let newEntry = DailyEntry()
        addEntry(newEntry)
        return newEntry
    }

    /// Delete an entry
    func deleteEntry(_ entry: DailyEntry) {
        entries.removeAll { $0.id == entry.id }
        saveEntries()
    }

    /// Get entries grouped by date
    func getEntriesGroupedByDate() -> [Date: [DailyEntry]] {
        let calendar = Calendar.current
        var grouped: [Date: [DailyEntry]] = [:]

        for entry in entries {
            let startOfDay = calendar.startOfDay(for: entry.date)
            if grouped[startOfDay] == nil {
                grouped[startOfDay] = []
            }
            grouped[startOfDay]?.append(entry)
        }

        return grouped
    }
}
