import SwiftUI

/// Main content view with tab navigation
struct ContentView: View {
    @StateObject private var dataManager = DataManager.shared
    @StateObject private var notificationManager = NotificationManager.shared
    @State private var showingQuestionnaire = false

    var body: some View {
        TabView {
            // Home Tab
            HomeView(showingQuestionnaire: $showingQuestionnaire)
                .tabItem {
                    Label("Home", systemImage: "house.fill")
                }

            // History Tab
            HistoryView()
                .tabItem {
                    Label("History", systemImage: "clock.fill")
                }

            // Settings Tab
            SettingsView()
                .tabItem {
                    Label("Settings", systemImage: "gear")
                }
        }
        .sheet(isPresented: $showingQuestionnaire) {
            QuestionnaireView()
        }
    }
}

/// Home view
struct HomeView: View {
    @ObservedObject var dataManager = DataManager.shared
    @Binding var showingQuestionnaire: Bool

    var body: some View {
        NavigationView {
            ScrollView {
                VStack(spacing: 25) {
                    // Header
                    VStack(spacing: 10) {
                        Text("Mindfulness Tracker")
                            .font(.largeTitle)
                            .fontWeight(.bold)

                        Text("Track your daily awareness")
                            .font(.subheadline)
                            .foregroundColor(.secondary)
                    }
                    .padding(.top, 20)

                    // Quick Stats
                    if !dataManager.entries.isEmpty {
                        TodayStatsCard()
                    }

                    // Check-in button
                    Button(action: {
                        showingQuestionnaire = true
                    }) {
                        HStack {
                            Image(systemName: "plus.circle.fill")
                                .font(.title2)

                            Text("New Check-In")
                                .font(.headline)
                        }
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(
                            RoundedRectangle(cornerRadius: 15)
                                .fill(Color.blue)
                        )
                    }
                    .padding(.horizontal)

                    // Today's entries
                    if !todayEntries.isEmpty {
                        VStack(alignment: .leading, spacing: 15) {
                            Text("Today's Check-Ins")
                                .font(.headline)
                                .padding(.horizontal)

                            VStack(spacing: 10) {
                                ForEach(todayEntries) { entry in
                                    EntryRow(entry: entry)
                                        .padding(.horizontal)
                                }
                            }
                        }
                    }

                    Spacer()
                }
            }
            .navigationBarTitleDisplayMode(.inline)
        }
    }

    private var todayEntries: [DailyEntry] {
        dataManager.getTodayEntries()
    }
}

/// Today's stats card
struct TodayStatsCard: View {
    @ObservedObject var dataManager = DataManager.shared

    var body: some View {
        VStack(spacing: 15) {
            Text("Today's Summary")
                .font(.headline)

            HStack(spacing: 20) {
                StatBadge(
                    title: "Check-ins",
                    value: "\(todayEntries.count)",
                    icon: "checkmark.circle"
                )

                StatBadge(
                    title: "Completed",
                    value: "\(completedEntries)",
                    icon: "star.fill"
                )
            }
        }
        .padding()
        .background(
            RoundedRectangle(cornerRadius: 15)
                .fill(Color.blue.opacity(0.1))
        )
        .padding(.horizontal)
    }

    private var todayEntries: [DailyEntry] {
        dataManager.getTodayEntries()
    }

    private var completedEntries: Int {
        todayEntries.filter { $0.isComplete }.count
    }
}

/// Stat badge component
struct StatBadge: View {
    let title: String
    let value: String
    let icon: String

    var body: some View {
        VStack(spacing: 8) {
            Image(systemName: icon)
                .font(.title2)
                .foregroundColor(.blue)

            Text(value)
                .font(.title)
                .fontWeight(.bold)

            Text(title)
                .font(.caption)
                .foregroundColor(.secondary)
        }
        .frame(maxWidth: .infinity)
    }
}

/// Settings view
struct SettingsView: View {
    @ObservedObject var notificationManager = NotificationManager.shared
    @State private var notificationTimes: [Int] = [9, 13, 17, 21]
    @State private var showingTimeEditor = false

    var body: some View {
        NavigationView {
            Form {
                // Notifications Section
                Section(header: Text("Notifications")) {
                    Toggle("Enable Reminders", isOn: Binding(
                        get: { notificationManager.notificationsEnabled },
                        set: { newValue in
                            if newValue {
                                notificationManager.requestPermission { _ in }
                            } else {
                                notificationManager.cancelAllNotifications()
                            }
                        }
                    ))

                    if notificationManager.notificationsEnabled {
                        Button("Configure Times") {
                            showingTimeEditor = true
                        }

                        VStack(alignment: .leading, spacing: 8) {
                            Text("Current reminders:")
                                .font(.caption)
                                .foregroundColor(.secondary)

                            ForEach(notificationTimes, id: \.self) { hour in
                                Text(formatHour(hour))
                                    .font(.subheadline)
                            }
                        }
                        .padding(.vertical, 5)
                    }
                }

                // About Section
                Section(header: Text("About")) {
                    HStack {
                        Text("Version")
                        Spacer()
                        Text("1.0")
                            .foregroundColor(.secondary)
                    }

                    HStack {
                        Text("Total Entries")
                        Spacer()
                        Text("\(DataManager.shared.entries.count)")
                            .foregroundColor(.secondary)
                    }
                }

                // Data Section
                Section(header: Text("Data")) {
                    Button("Clear All Data") {
                        clearAllData()
                    }
                    .foregroundColor(.red)
                }
            }
            .navigationTitle("Settings")
        }
        .onAppear {
            loadNotificationTimes()
        }
        .sheet(isPresented: $showingTimeEditor) {
            NotificationTimeEditor(times: $notificationTimes, onSave: {
                notificationManager.updateNotificationTimes(notificationTimes)
            })
        }
    }

    private func loadNotificationTimes() {
        notificationManager.getScheduledNotificationTimes { times in
            if !times.isEmpty {
                notificationTimes = times
            }
        }
    }

    private func formatHour(_ hour: Int) -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = "h:mm a"
        var components = DateComponents()
        components.hour = hour
        components.minute = 0
        if let date = Calendar.current.date(from: components) {
            return formatter.string(from: date)
        }
        return "\(hour):00"
    }

    private func clearAllData() {
        DataManager.shared.entries.removeAll()
        DataManager.shared.saveEntries()
    }
}

/// Notification time editor
struct NotificationTimeEditor: View {
    @Binding var times: [Int]
    let onSave: () -> Void
    @Environment(\.dismiss) var dismiss

    var body: some View {
        NavigationView {
            Form {
                Section(header: Text("Select notification times")) {
                    ForEach(0..<24, id: \.self) { hour in
                        Toggle(formatHour(hour), isOn: Binding(
                            get: { times.contains(hour) },
                            set: { isOn in
                                if isOn {
                                    times.append(hour)
                                    times.sort()
                                } else {
                                    times.removeAll { $0 == hour }
                                }
                            }
                        ))
                    }
                }
            }
            .navigationTitle("Notification Times")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Cancel") {
                        dismiss()
                    }
                }

                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Save") {
                        onSave()
                        dismiss()
                    }
                }
            }
        }
    }

    private func formatHour(_ hour: Int) -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = "h:mm a"
        var components = DateComponents()
        components.hour = hour
        components.minute = 0
        if let date = Calendar.current.date(from: components) {
            return formatter.string(from: date)
        }
        return "\(hour):00"
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
