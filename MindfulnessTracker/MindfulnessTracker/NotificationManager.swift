import Foundation
import UserNotifications

/// Manages local notifications for daily reminders
class NotificationManager: ObservableObject {
    static let shared = NotificationManager()

    @Published var notificationsEnabled = false

    /// Default notification times (hours in 24-hour format)
    private let defaultNotificationTimes = [9, 13, 17, 21] // 9 AM, 1 PM, 5 PM, 9 PM

    init() {
        checkNotificationStatus()
    }

    /// Request notification permission
    func requestPermission(completion: @escaping (Bool) -> Void) {
        UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .badge, .sound]) { granted, error in
            DispatchQueue.main.async {
                self.notificationsEnabled = granted
                if granted {
                    self.scheduleNotifications()
                }
                completion(granted)
            }
        }
    }

    /// Check current notification permission status
    func checkNotificationStatus() {
        UNUserNotificationCenter.current().getNotificationSettings { settings in
            DispatchQueue.main.async {
                self.notificationsEnabled = settings.authorizationStatus == .authorized
            }
        }
    }

    /// Schedule daily notifications
    func scheduleNotifications(times: [Int]? = nil) {
        // Remove all pending notifications first
        UNUserNotificationCenter.current().removeAllPendingNotificationRequests()

        let notificationTimes = times ?? defaultNotificationTimes

        for hour in notificationTimes {
            scheduleNotification(for: hour)
        }
    }

    /// Schedule a notification for a specific hour
    private func scheduleNotification(for hour: Int) {
        let content = UNMutableNotificationContent()
        content.title = "Mindfulness Check-In"
        content.body = "Time to reflect on your day. How are you doing?"
        content.sound = .default
        content.badge = 1

        // Create a date components object for the time
        var dateComponents = DateComponents()
        dateComponents.hour = hour
        dateComponents.minute = 0

        // Create a calendar trigger
        let trigger = UNCalendarNotificationTrigger(dateMatching: dateComponents, repeats: true)

        // Create the request
        let request = UNNotificationRequest(
            identifier: "mindfulness-\(hour)",
            content: content,
            trigger: trigger
        )

        // Schedule the notification
        UNUserNotificationCenter.current().add(request) { error in
            if let error = error {
                print("Error scheduling notification: \(error.localizedDescription)")
            }
        }
    }

    /// Update notification times
    func updateNotificationTimes(_ times: [Int]) {
        scheduleNotifications(times: times)
    }

    /// Get currently scheduled notification times
    func getScheduledNotificationTimes(completion: @escaping ([Int]) -> Void) {
        UNUserNotificationCenter.current().getPendingNotificationRequests { requests in
            let times = requests.compactMap { request -> Int? in
                if let trigger = request.trigger as? UNCalendarNotificationTrigger,
                   let hour = trigger.dateComponents.hour {
                    return hour
                }
                return nil
            }.sorted()

            DispatchQueue.main.async {
                completion(times)
            }
        }
    }

    /// Cancel all notifications
    func cancelAllNotifications() {
        UNUserNotificationCenter.current().removeAllPendingNotificationRequests()
    }
}
