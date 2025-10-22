# Mindfulness Tracker

A daily mindfulness tracking app that prompts you multiple times throughout the day to reflect on your mental and physical state.

## Choose Your Version

This repository contains **TWO versions** of the same app:

### 🌐 Web App (Recommended - Works on ANY device!)
**Location:** `/webapp/` folder

A Progressive Web App (PWA) that works on iPhone, Android, and desktop browsers. No Mac required!

- **Install on your phone** like a native app
- **Works offline** after first visit
- **Browser notifications** for reminders
- **100% free** to deploy and use
- **Privacy-focused** - all data stays in your browser

👉 **[Read the Web App README](webapp/README.md)** for instructions

### 📱 iOS App (Requires Mac + Xcode)
**Location:** `/MindfulnessTracker/` folder

A native iOS app built with SwiftUI for iPhone and iPad.

- Requires macOS with Xcode to build
- Native iOS experience
- Local notifications

👉 **Continue reading below** for iOS app instructions

---

## Quick Start (Web App)

1. **Open** `webapp/generate-icons.html` in a browser and save the two icons
2. **Run** a local server:
   ```bash
   cd webapp
   python3 -m http.server 8000
   ```
3. **Visit** `http://localhost:8000` in your browser
4. **Install** to your phone's home screen for best experience!

See [webapp/README.md](webapp/README.md) for deployment to free hosting.

---

# iOS App Documentation

Below are the instructions for the native iOS app version.

## Features

### Daily Check-Ins
The app asks you four key questions multiple times per day:
- Did I complain at all?
- Did I make any excuses?
- Did I tense my muscles at any point?
- Did I have any fear at any point?

### Smart Notifications
- Configurable daily reminders (default: 9 AM, 1 PM, 5 PM, 9 PM)
- Local notifications that work offline
- Customize notification times to fit your schedule

### Data Tracking
- View your complete history of check-ins
- See daily summaries and statistics
- Data persists locally on your device
- Delete entries or clear all data

### Beautiful UI
- Clean, modern SwiftUI interface
- Intuitive yes/no answer buttons
- Visual feedback for completed check-ins
- History view with date grouping

## Requirements

- **macOS** with Xcode 14.0 or later
- **iOS 15.0** or later target device
- Apple Developer account (free or paid) for running on physical device

## Installation & Setup

Since you don't currently have a Mac, here are your options:

### Option 1: Use a Mac Later
When you have access to a Mac:

1. **Open the project in Xcode:**
   ```bash
   cd MindfulnessTracker
   open MindfulnessTracker.xcodeproj
   ```

2. **Configure the project:**
   - Select the project in Xcode's navigator
   - Under "Signing & Capabilities", select your team
   - Change the bundle identifier if needed (e.g., com.yourname.mindfulnesstracker)

3. **Run on simulator or device:**
   - Select your target device from the scheme menu
   - Press Cmd+R to build and run
   - Grant notification permissions when prompted

### Option 2: Cloud Mac Service
Use a cloud Mac service like [MacInCloud](https://www.macincloud.com/) or [MacStadium](https://www.macstadium.com/):

1. Rent a Mac by the hour
2. Upload this project folder
3. Follow the steps in Option 1

### Option 3: Get Help from Someone with a Mac
Share this repository with someone who has a Mac and Xcode. They can:
1. Build the app
2. Install it on their device via Xcode
3. If they have a paid developer account, they can create an IPA file for you

## Project Structure

```
MindfulnessTracker/
├── MindfulnessTracker/
│   ├── MindfulnessTrackerApp.swift    # App entry point
│   ├── ContentView.swift              # Main tab view and home screen
│   ├── QuestionnaireView.swift        # Question interface
│   ├── HistoryView.swift              # History display
│   ├── DailyEntry.swift               # Data model
│   ├── DataManager.swift              # Data persistence
│   ├── NotificationManager.swift      # Notification handling
│   └── Info.plist                     # App configuration
└── MindfulnessTracker.xcodeproj/      # Xcode project file
```

## How to Use the App

1. **First Launch:**
   - App will request notification permissions
   - Grant permissions to receive daily reminders

2. **Daily Check-Ins:**
   - Tap "New Check-In" from the home screen
   - Or open the app when you receive a notification
   - Answer the four questions by tapping Yes or No
   - Your responses are automatically saved

3. **View History:**
   - Tap the "History" tab to see all past check-ins
   - Entries are grouped by date
   - Swipe to delete individual entries

4. **Configure Settings:**
   - Tap the "Settings" tab
   - Enable/disable notifications
   - Configure notification times
   - View total entries count
   - Clear all data if needed

## Customization

### Changing Notification Times
1. Go to Settings tab
2. Ensure "Enable Reminders" is on
3. Tap "Configure Times"
4. Toggle the hours you want reminders
5. Tap "Save"

### Modifying Questions
To change the questions, edit the `QuestionType` enum in `DailyEntry.swift`:

```swift
enum QuestionType: String, CaseIterable {
    case complained = "Your custom question here?"
    // ... add or modify questions
}
```

## Technical Details

- **Framework:** SwiftUI
- **Minimum iOS Version:** iOS 15.0
- **Data Storage:** UserDefaults (for simple data persistence)
- **Notifications:** Local notifications via UserNotifications framework
- **Architecture:** MVVM pattern with ObservableObject for state management

## Privacy

- All data is stored locally on your device
- No internet connection required
- No data is sent to any servers
- Complete privacy and data ownership

## Troubleshooting

### Notifications Not Working
1. Go to iOS Settings > Mindfulness Tracker > Notifications
2. Ensure "Allow Notifications" is enabled
3. In the app's Settings, toggle notifications off and on again

### Build Errors in Xcode
1. Ensure you're using Xcode 14.0 or later
2. Clean build folder (Product > Clean Build Folder)
3. Ensure deployment target is set to iOS 15.0 or later
4. Check that you've selected a valid development team

### App Crashes on Launch
1. Check the Xcode console for error messages
2. Ensure all Swift files are included in the target
3. Reset the simulator or device

## Future Enhancements

Potential features you could add:
- Data export (CSV, JSON)
- Weekly/monthly statistics and charts
- Custom questions
- Themes and color customization
- iCloud sync across devices
- Apple Watch companion app
- Reminders based on location or activity

## License

This is a personal project. Feel free to modify and use as needed.

## Support

If you need help or want to report issues:
- Check the troubleshooting section above
- Review Apple's SwiftUI documentation
- Post questions to Stack Overflow with the tag `swiftui`

---

**Note:** This app was created to help with mindfulness and self-awareness. Use it consistently for best results!
