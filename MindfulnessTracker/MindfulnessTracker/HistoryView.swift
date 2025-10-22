import SwiftUI

/// View showing history of past entries
struct HistoryView: View {
    @ObservedObject var dataManager = DataManager.shared

    var body: some View {
        NavigationView {
            List {
                if dataManager.entries.isEmpty {
                    VStack(spacing: 15) {
                        Image(systemName: "calendar.badge.clock")
                            .font(.system(size: 60))
                            .foregroundColor(.secondary)

                        Text("No entries yet")
                            .font(.headline)
                            .foregroundColor(.secondary)

                        Text("Complete your first check-in to see your history")
                            .font(.subheadline)
                            .foregroundColor(.secondary)
                            .multilineTextAlignment(.center)
                    }
                    .frame(maxWidth: .infinity)
                    .padding()
                    .listRowBackground(Color.clear)
                } else {
                    ForEach(groupedEntries.keys.sorted(by: >), id: \.self) { date in
                        Section(header: Text(formatDate(date))) {
                            ForEach(groupedEntries[date] ?? []) { entry in
                                EntryRow(entry: entry)
                            }
                            .onDelete { indexSet in
                                deleteEntries(at: indexSet, for: date)
                            }
                        }
                    }
                }
            }
            .navigationTitle("History")
            .toolbar {
                if !dataManager.entries.isEmpty {
                    ToolbarItem(placement: .navigationBarTrailing) {
                        EditButton()
                    }
                }
            }
        }
    }

    private var groupedEntries: [Date: [DailyEntry]] {
        dataManager.getEntriesGroupedByDate()
    }

    private func formatDate(_ date: Date) -> String {
        let calendar = Calendar.current
        if calendar.isDateInToday(date) {
            return "Today"
        } else if calendar.isDateInYesterday(date) {
            return "Yesterday"
        } else {
            let formatter = DateFormatter()
            formatter.dateStyle = .medium
            return formatter.string(from: date)
        }
    }

    private func deleteEntries(at offsets: IndexSet, for date: Date) {
        guard let entries = groupedEntries[date] else { return }
        for index in offsets {
            dataManager.deleteEntry(entries[index])
        }
    }
}

/// Row component for displaying a single entry
struct EntryRow: View {
    let entry: DailyEntry

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            // Time
            Text(formatTime(entry.date))
                .font(.caption)
                .foregroundColor(.secondary)

            // Answers grid
            if entry.isComplete {
                LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 10) {
                    AnswerChip(
                        icon: QuestionType.complained.icon,
                        label: "Complained",
                        answer: entry.complained
                    )

                    AnswerChip(
                        icon: QuestionType.madeExcuses.icon,
                        label: "Excuses",
                        answer: entry.madeExcuses
                    )

                    AnswerChip(
                        icon: QuestionType.tensedMuscles.icon,
                        label: "Tensed",
                        answer: entry.tensedMuscles
                    )

                    AnswerChip(
                        icon: QuestionType.hadFear.icon,
                        label: "Fear",
                        answer: entry.hadFear
                    )
                }
            } else {
                HStack {
                    Image(systemName: "clock.badge.questionmark")
                        .foregroundColor(.orange)
                    Text("Incomplete")
                        .font(.subheadline)
                        .foregroundColor(.orange)
                }
            }
        }
        .padding(.vertical, 5)
    }

    private func formatTime(_ date: Date) -> String {
        let formatter = DateFormatter()
        formatter.timeStyle = .short
        return formatter.string(from: date)
    }
}

/// Answer chip component for displaying individual answers
struct AnswerChip: View {
    let icon: String
    let label: String
    let answer: Bool?

    var body: some View {
        HStack(spacing: 5) {
            Text(icon)
                .font(.caption)

            Text(label)
                .font(.caption)
                .lineLimit(1)

            Spacer()

            if let answer = answer {
                Image(systemName: answer ? "xmark.circle.fill" : "checkmark.circle.fill")
                    .foregroundColor(answer ? .red : .green)
                    .font(.caption)
            } else {
                Image(systemName: "questionmark.circle")
                    .foregroundColor(.gray)
                    .font(.caption)
            }
        }
        .padding(.horizontal, 8)
        .padding(.vertical, 6)
        .background(
            RoundedRectangle(cornerRadius: 8)
                .fill(Color(.systemGray6))
        )
    }
}

struct HistoryView_Previews: PreviewProvider {
    static var previews: some View {
        HistoryView()
    }
}
