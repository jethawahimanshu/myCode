import Foundation

/// Represents a single daily entry with answers to mindfulness questions
struct DailyEntry: Codable, Identifiable {
    let id: UUID
    let date: Date
    var complained: Bool?
    var madeExcuses: Bool?
    var tensedMuscles: Bool?
    var hadFear: Bool?

    init(id: UUID = UUID(), date: Date = Date(), complained: Bool? = nil, madeExcuses: Bool? = nil, tensedMuscles: Bool? = nil, hadFear: Bool? = nil) {
        self.id = id
        self.date = date
        self.complained = complained
        self.madeExcuses = madeExcuses
        self.tensedMuscles = tensedMuscles
        self.hadFear = hadFear
    }

    /// Check if all questions have been answered
    var isComplete: Bool {
        return complained != nil && madeExcuses != nil && tensedMuscles != nil && hadFear != nil
    }

    /// Get a summary string for the entry
    var summary: String {
        let dateFormatter = DateFormatter()
        dateFormatter.dateStyle = .medium
        dateFormatter.timeStyle = .short
        return dateFormatter.string(from: date)
    }
}

/// Question type enum for the questionnaire
enum QuestionType: String, CaseIterable {
    case complained = "Did I complain at all?"
    case madeExcuses = "Did I make any excuses?"
    case tensedMuscles = "Did I tense my muscles at any point?"
    case hadFear = "Did I have any fear at any point?"

    var icon: String {
        switch self {
        case .complained: return "💬"
        case .madeExcuses: return "🤷"
        case .tensedMuscles: return "💪"
        case .hadFear: return "😰"
        }
    }
}
