# Using Mindfulness Tracker in Incognito Mode

## How It Works Now

I've added support for incognito/private browsing mode! Here's what happens:

### 🔒 In Incognito Mode:

1. **Warning Banner Appears**
   - Purple gradient banner at the top
   - Tells you data will only last for the session
   - Provides link to enable GitHub Sync

2. **sessionStorage Used as Fallback**
   - Your data is saved to sessionStorage
   - Data persists **while the tab is open**
   - Data **survives page refreshes** in the same tab
   - Data **survives opening new tabs** (within same window)

3. **What Doesn't Persist:**
   - When you **close the tab** → data is deleted
   - When you **close the browser** → data is deleted
   - When you **open a new incognito window** → fresh start

---

## Two Ways to Make Data Persistent in Incognito

### Option 1: Enable GitHub Sync (RECOMMENDED)

With GitHub Sync, your data is stored in your GitHub repository instead of your browser:

1. **Click "enable GitHub Sync"** in the warning banner
2. Or go to **Settings** → Enable GitHub Sync
3. **Configure your GitHub credentials:**
   - Create a Personal Access Token: https://github.com/settings/tokens/new
   - Select `repo` permission
   - Copy the token
4. **Enter details:**
   - Token: (paste your token)
   - Owner: your GitHub username
   - Repo: repository name (e.g., `myCode`)
   - Branch: `main` (or your preferred branch)
5. **Save & Sync**

**Now your data:**
- ✅ Persists across incognito sessions
- ✅ Works across devices
- ✅ Is backed up to GitHub
- ✅ Syncs automatically

### Option 2: Exit Incognito Mode

Just use the app in normal browsing mode:
- Data persists permanently in localStorage
- No need for GitHub Sync
- Works offline

---

## What You'll See in Console

### Normal Mode:
```
✅ localStorage is working
localStorage read: 1 entries
Saved to localStorage: 1 entries
```

### Incognito Mode:
```
🔒 Incognito mode detected
localStorage not available, using sessionStorage
sessionStorage read: 1 entries
Saved to sessionStorage: 1 entries
```

### Incognito + GitHub Sync:
```
🔒 Incognito mode detected
sessionStorage read: 0 entries
GitHub sync is configured, syncing...
Synced successfully from GitHub
```

---

## Testing in Incognito Mode

1. **Open app in incognito mode**
2. **See the warning banner** (purple at top)
3. **Create a check-in** (answer questions)
4. **Refresh the page** → Data is still there! ✅
5. **Open new tab (same window)** → Data is still there! ✅
6. **Close tab and reopen** → Data is gone ❌
   - Unless you enabled GitHub Sync!

---

## Banner Features

**Warning Banner Shows:**
- 🔒 Private Browsing Mode indicator
- Explanation that data is temporary
- Link to enable GitHub Sync
- Dismiss button

**Clicking "enable GitHub Sync":**
- Takes you to Settings tab
- Scrolls to GitHub Sync section
- Highlights the toggle
- Makes it easy to set up

**Dismiss button:**
- Hides the banner
- You can still use the app
- sessionStorage still works

---

## Why sessionStorage in Incognito?

**localStorage:** Normally persists forever, but **blocked in incognito**
**sessionStorage:** Persists for the tab session, **works in incognito**

So I use sessionStorage as a fallback! It's better than nothing.

---

## Best Practices

### For Regular Use:
- **Use normal browsing mode**
- Data persists automatically
- No setup required

### For Privacy:
- **Use incognito mode + GitHub Sync**
- Browser history is not saved
- Data still persists via GitHub
- Delete repo file when done if needed

### For Maximum Privacy:
- **Use incognito without GitHub Sync**
- Data only lasts the session
- No trace left after closing tab
- Perfect for one-time use

---

## FAQ

**Q: Why use incognito mode?**
A: Maybe you don't want the site in your browser history, or you're on a shared computer.

**Q: Will my data be lost if I refresh in incognito?**
A: No! sessionStorage survives refreshes in the same tab.

**Q: Can I use GitHub Sync in normal mode too?**
A: Yes! It works in both modes for cross-device sync.

**Q: What if I forget I'm in incognito?**
A: The warning banner reminds you! You can't miss it.

**Q: Can I hide the banner?**
A: Yes, click "Dismiss". But remember your data won't persist!

**Q: Does sessionStorage work across tabs?**
A: It persists across tabs opened from the same incognito window.

---

## Your App Is Ready!

The updated code is deployed to: **`claude/deploy-mindfulness-app-011CUMGtEMP2aeUNDHsjgiLo`**

**To see it in action:**
1. Enable GitHub Pages with that branch
2. Open in incognito mode
3. See the warning banner
4. Create some check-ins
5. Refresh → data still there!
6. Close and reopen → data gone (unless GitHub Sync enabled)

---

**Perfect for privacy-conscious users! 🔒**
