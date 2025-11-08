# Mindfulness Tracker - Web App

A Progressive Web App (PWA) for daily mindfulness tracking that works on any device with a browser. Install it on your phone for a native app experience!

## Features

- **Daily Check-Ins**: Answer 4 mindfulness questions multiple times per day
- **Browser Notifications**: Get reminders at customizable times
- **Offline Support**: Works without internet after first visit
- **Installable**: Add to home screen for app-like experience
- **Data Privacy**: All data stored locally in your browser
- **Cross-Platform**: Works on iOS, Android, and desktop

## Quick Start

### Option 1: Open Locally (Quickest)

1. **Generate the icons first**:
   - Open `generate-icons.html` in your browser
   - Right-click each canvas and save as `icon-192.png` and `icon-512.png`
   - Place them in the `webapp` folder

2. **Run a local server** (required for PWA features):

   **Using Python 3:**
   ```bash
   cd webapp
   python3 -m http.server 8000
   ```

   **Using Python 2:**
   ```bash
   cd webapp
   python -m SimpleHTTPServer 8000
   ```

   **Using Node.js (if you have it):**
   ```bash
   cd webapp
   npx serve
   ```

3. **Open in browser**:
   - Go to `http://localhost:8000`
   - The app should load!

### Option 2: Deploy for Free (Best for Mobile Use)

Deploy your app online so you can access it from anywhere and install it on your phone!

---

## Free Hosting Options

### 🏆 Recommended: GitHub Pages (Easiest)

**Steps:**

1. **Create icons** (if not done already):
   - Open `generate-icons.html` in browser
   - Save both icons in the `webapp` folder

2. **Push to GitHub** (already set up in your repo):
   ```bash
   cd /home/user/myCode
   git add webapp/
   git commit -m "Add mindfulness tracker web app"
   git push origin claude/create-daily-mindfulness-tracker-011CUMGtEMP2aeUNDHsjgiLo
   ```

3. **Enable GitHub Pages**:
   - Go to your GitHub repository
   - Click "Settings" > "Pages"
   - Source: Select your branch
   - Folder: Select `/webapp`
   - Click "Save"
   - Your site will be live at: `https://<username>.github.io/<repo>/`

4. **Access your app**:
   - Visit the URL provided
   - On mobile, use "Add to Home Screen" to install

---

### Alternative: Netlify (Very Easy)

**Steps:**

1. **Create account** at [netlify.com](https://netlify.com) (free)

2. **Deploy via drag & drop**:
   - Log in to Netlify
   - Click "Add new site" > "Deploy manually"
   - Drag the entire `webapp` folder into the upload area
   - Done! You'll get a URL like `https://random-name.netlify.app`

3. **Or deploy via CLI**:
   ```bash
   npm install -g netlify-cli
   cd webapp
   netlify deploy --prod
   ```

**Custom domain (optional)**: Netlify allows free custom domains!

---

### Alternative: Vercel

**Steps:**

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Deploy**:
   ```bash
   cd webapp
   vercel --prod
   ```

3. **Access**: You'll get a URL like `https://your-app.vercel.app`

---

### Alternative: Cloudflare Pages

**Steps:**

1. **Create account** at [pages.cloudflare.com](https://pages.cloudflare.com)

2. **Connect GitHub** repo or **Upload directly**:
   - Select your repository
   - Build settings: Leave empty (static site)
   - Deploy!

3. **Access**: You'll get a URL on `pages.dev`

---

## Installing on Your Phone

### iOS (iPhone/iPad)

1. **Open in Safari** (must use Safari, not Chrome)
2. Tap the **Share button** (square with arrow)
3. Scroll down and tap **"Add to Home Screen"**
4. Tap **"Add"**
5. The app icon will appear on your home screen!

**Enable notifications:**
- Open the app from home screen
- Go to Settings tab
- Enable "Reminders"
- Grant notification permission when prompted

### Android

1. **Open in Chrome**
2. Tap the **menu** (⋮) in the top right
3. Tap **"Add to Home screen"** or **"Install app"**
4. Tap **"Add"**
5. The app will install and appear in your app drawer!

**Enable notifications:**
- Open the app
- Go to Settings tab
- Enable "Reminders"
- Grant notification permission when prompted

### Desktop (Chrome, Edge)

1. Open the web app
2. Look for the **install icon** (➕) in the address bar
3. Click it and select **"Install"**
4. The app will open in its own window!

---

## How to Use

### First Time Setup

1. **Open the app** (from browser or home screen)
2. **Enable notifications**:
   - Go to Settings tab
   - Toggle "Enable Reminders"
   - Allow notifications when prompted
3. **Configure reminder times**:
   - Tap "Configure Times"
   - Select times you want reminders (default: 9 AM, 1 PM, 5 PM, 9 PM)
   - Tap "Save"

### Daily Use

1. **Receive notification** at your scheduled time
2. **Open the app** (tap notification or open manually)
3. **Tap "New Check-In"**
4. **Answer the 4 questions**:
   - Did I complain at all?
   - Did I make any excuses?
   - Did I tense my muscles at any point?
   - Did I have any fear at any point?
5. Your answers are automatically saved!

### View History

- Go to **History tab**
- See all your past check-ins organized by date
- Each entry shows your answers with visual indicators:
  - ✅ = No (good!)
  - ❌ = Yes (awareness point)

### Stats

- **Home tab** shows today's summary
- See how many check-ins you've completed today
- View your recent entries

---

## Customization

### Changing Questions

Edit `app.js` and find the questionnaire section in `index.html`:

```javascript
// In index.html, find and modify:
<div class="question-card">
    <div class="question-header">
        <span class="question-icon">💬</span>
        <span class="question-text">Your custom question?</span>
    </div>
    ...
</div>
```

Also update the corresponding logic in `app.js`.

### Changing Colors

Edit `styles.css` and modify the CSS variables at the top:

```css
:root {
    --primary-color: #2196F3;  /* Change to your color */
    --success-color: #4CAF50;
    --danger-color: #f44336;
    /* ... */
}
```

### Default Notification Times

Edit `app.js` and find:

```javascript
this.defaultTimes = [9, 13, 17, 21]; // Change these hours
```

---

## Technical Details

- **No Backend Required**: Everything runs in the browser
- **Data Storage**: localStorage (persists across sessions)
- **Offline**: Service Worker caches the app for offline use
- **Notifications**: Browser Notification API
- **Framework**: Vanilla JavaScript (no dependencies!)
- **Size**: < 50 KB total

---

## Browser Support

- **Chrome/Edge**: Full support ✅
- **Safari**: Full support ✅
- **Firefox**: Full support ✅
- **Samsung Internet**: Full support ✅
- **iOS Safari**: Full support (notifications require home screen install) ✅

---

## Troubleshooting

### Notifications Not Working

**iOS:**
- Must install to home screen first
- Must open from home screen (not browser)
- Check Settings > Notifications > [App Name]

**Android:**
- Check Chrome > Settings > Site Settings > Notifications
- Ensure battery optimization isn't blocking the app

**Desktop:**
- Check browser notification settings
- Ensure notifications aren't blocked for the site

### App Not Installing

- Make sure you're using HTTPS (required for PWA)
- Local testing: use `localhost` or `127.0.0.1`
- Clear browser cache and try again

### Data Lost

- Don't clear browser data/cache
- Data is stored per browser (Chrome data ≠ Safari data)
- Consider exporting data feature (could be added)

### Icons Not Showing

- Generate icons using `generate-icons.html`
- Make sure files are named exactly: `icon-192.png` and `icon-512.png`
- Clear cache and reinstall

---

## Privacy & Data

- **100% Private**: No data leaves your device
- **No Analytics**: No tracking whatsoever
- **No Account**: No login required
- **Your Data**: Stored in your browser only
- **Delete Anytime**: Settings > Clear All Data

---

## Future Enhancements

Ideas for improvements:

- [ ] Export data as CSV/JSON
- [ ] Import previous data
- [ ] Weekly/monthly statistics and charts
- [ ] Dark mode
- [ ] More questions/categories
- [ ] Streaks and achievements
- [ ] Data backup to cloud (optional)
- [ ] Multiple profiles
- [ ] Apple Watch/Android Wear support

---

## Support

This is a simple, standalone app with no backend or support infrastructure.

For technical issues:
- Check the Troubleshooting section above
- Review browser console for errors (F12)
- Check notification permissions in browser settings

---

## License

Free to use and modify for personal use.

---

**Made with ❤️ for mindfulness and self-awareness**

Enjoy your journey to greater self-awareness! 🧘‍♂️
