import SwiftUI

/// View for answering daily mindfulness questions
struct QuestionnaireView: View {
    @ObservedObject var dataManager = DataManager.shared
    @State private var currentEntry: DailyEntry
    @State private var showingCompletionMessage = false
    @Environment(\.dismiss) var dismiss

    init() {
        _currentEntry = State(initialValue: DataManager.shared.getCurrentEntry())
    }

    var body: some View {
        NavigationView {
            ScrollView {
                VStack(spacing: 30) {
                    // Header
                    VStack(spacing: 10) {
                        Text("Daily Check-In")
                            .font(.largeTitle)
                            .fontWeight(.bold)

                        Text("Reflect on your experiences")
                            .font(.subheadline)
                            .foregroundColor(.secondary)

                        Text(formattedDate)
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                    .padding(.top, 20)

                    Divider()

                    // Questions
                    VStack(spacing: 25) {
                        QuestionCard(
                            question: QuestionType.complained.rawValue,
                            icon: QuestionType.complained.icon,
                            answer: $currentEntry.complained,
                            onAnswerChanged: saveEntry
                        )

                        QuestionCard(
                            question: QuestionType.madeExcuses.rawValue,
                            icon: QuestionType.madeExcuses.icon,
                            answer: $currentEntry.madeExcuses,
                            onAnswerChanged: saveEntry
                        )

                        QuestionCard(
                            question: QuestionType.tensedMuscles.rawValue,
                            icon: QuestionType.tensedMuscles.icon,
                            answer: $currentEntry.tensedMuscles,
                            onAnswerChanged: saveEntry
                        )

                        QuestionCard(
                            question: QuestionType.hadFear.rawValue,
                            icon: QuestionType.hadFear.icon,
                            answer: $currentEntry.hadFear,
                            onAnswerChanged: saveEntry
                        )
                    }
                    .padding(.horizontal)

                    // Completion status
                    if currentEntry.isComplete {
                        VStack(spacing: 10) {
                            Image(systemName: "checkmark.circle.fill")
                                .font(.system(size: 50))
                                .foregroundColor(.green)

                            Text("All questions answered!")
                                .font(.headline)
                                .foregroundColor(.green)

                            Text("Thank you for your reflection")
                                .font(.subheadline)
                                .foregroundColor(.secondary)
                        }
                        .padding()
                        .transition(.scale.combined(with: .opacity))
                    }

                    Spacer(minLength: 30)
                }
            }
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Done") {
                        dismiss()
                    }
                }
            }
        }
    }

    private var formattedDate: String {
        let formatter = DateFormatter()
        formatter.dateStyle = .long
        formatter.timeStyle = .short
        return formatter.string(from: currentEntry.date)
    }

    private func saveEntry() {
        dataManager.updateEntry(currentEntry)
    }
}

/// Individual question card component
struct QuestionCard: View {
    let question: String
    let icon: String
    @Binding var answer: Bool?
    let onAnswerChanged: () -> Void

    var body: some View {
        VStack(alignment: .leading, spacing: 15) {
            HStack {
                Text(icon)
                    .font(.title)

                Text(question)
                    .font(.headline)
                    .foregroundColor(.primary)

                Spacer()
            }

            HStack(spacing: 15) {
                AnswerButton(
                    title: "Yes",
                    isSelected: answer == true,
                    color: .red
                ) {
                    answer = true
                    onAnswerChanged()
                }

                AnswerButton(
                    title: "No",
                    isSelected: answer == false,
                    color: .green
                ) {
                    answer = false
                    onAnswerChanged()
                }
            }
        }
        .padding()
        .background(
            RoundedRectangle(cornerRadius: 15)
                .fill(Color(.systemBackground))
                .shadow(color: .black.opacity(0.1), radius: 5, x: 0, y: 2)
        )
    }
}

/// Answer button component
struct AnswerButton: View {
    let title: String
    let isSelected: Bool
    let color: Color
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Text(title)
                .font(.headline)
                .foregroundColor(isSelected ? .white : color)
                .frame(maxWidth: .infinity)
                .padding()
                .background(
                    RoundedRectangle(cornerRadius: 10)
                        .fill(isSelected ? color : Color.clear)
                        .overlay(
                            RoundedRectangle(cornerRadius: 10)
                                .stroke(color, lineWidth: 2)
                        )
                )
        }
    }
}

struct QuestionnaireView_Previews: PreviewProvider {
    static var previews: some View {
        QuestionnaireView()
    }
}
