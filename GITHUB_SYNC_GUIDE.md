# GitHub Sync Setup Guide

Your mindfulness data can now be synced to your GitHub repository! This provides:
- **Backup** - Your data is safely stored in GitHub
- **Cross-device sync** - Access your data from any device
- **Version history** - GitHub tracks all changes
- **Privacy** - Data stays in YOUR repository

## Quick Setup (5 minutes)

### Step 1: Create a Personal Access Token

1. Go to [GitHub Settings > Tokens](https://github.com/settings/tokens/new)
2. Click **"Generate new token (classic)"**
3. Give it a name: `Mindfulness Tracker`
4. Set expiration: Choose your preference (e.g., 90 days or No expiration)
5. Check the **`repo`** permission (Full control of private repositories)
6. Click **"Generate token"** at the bottom
7. **COPY THE TOKEN** - You won't see it again!
   - Example: `ghp_1234567890abcdefghijklmnopqrstuvwxyz`

### Step 2: Enable GitHub Sync in the App

1. Open your Mindfulness Tracker app
2. Go to **Settings** tab
3. Toggle **"Enable GitHub Sync"** ON
4. Fill in the configuration:
   - **Personal Access Token**: Paste the token you just copied
   - **Repository Owner**: Your GitHub username (e.g., `jethawahimanshu`)
   - **Repository Name**: The repo name (e.g., `myCode`)
   - **Branch**: `main` (or your preferred branch)

5. Click **"Test Connection"** to verify it works
6. Click **"Save & Sync"**

Done! Your data is now syncing to GitHub!

## How It Works

### Automatic Sync
- Every time you create/update/delete an entry, it automatically syncs to GitHub
- The app creates a file called `mindfulness-data.json` in your repository
- All your check-ins are stored in this JSON file

### Manual Sync
- Click **"Sync Now"** in Settings to force a sync anytime
- Useful if you made changes on another device

### Data Merging
- When you open the app, it automatically syncs from GitHub
- Local and GitHub data are merged (no data is lost)
- GitHub is the "source of truth" - if an entry exists in both places, GitHub wins

## Your Data File

After syncing, you'll see a new file in your GitHub repo:
```
your-repo/
  └── mindfulness-data.json
```

Example contents:
```json
[
  {
    "id": 1698765432100.123,
    "date": "2024-10-22T14:30:00.000Z",
    "complained": false,
    "madeExcuses": false,
    "tensedMuscles": true,
    "hadFear": false
  },
  {
    "id": 1698851832100.456,
    "date": "2024-10-22T20:00:00.000Z",
    "complained": true,
    "madeExcuses": false,
    "tensedMuscles": false,
    "hadFear": false
  }
]
```

## Using on Multiple Devices

### Setup on Device 1:
1. Configure GitHub sync (see above)
2. Your data is now syncing

### Setup on Device 2:
1. Open the app
2. Go to Settings > Enable GitHub Sync
3. Enter the **same** credentials
4. Your data automatically downloads!

Now both devices stay in sync!

## Troubleshooting

### "Failed to connect to GitHub"

**Check these:**
1. Token has `repo` permission
2. Token hasn't expired
3. Repository name is correct (case-sensitive!)
4. You have write access to the repository

### "API returned 404"

- The repository doesn't exist or name is wrong
- Check: `https://github.com/YOUR_USERNAME/YOUR_REPO` exists

### "API returned 403"

- Token doesn't have correct permissions
- Create a new token with `repo` permission

### Data not syncing between devices

1. Click **"Sync Now"** on both devices
2. Check browser console for errors (F12 > Console)
3. Verify both devices are using the same repo/branch

### Want to stop syncing?

1. Go to Settings
2. Toggle "Enable GitHub Sync" OFF
3. Your local data stays intact
4. The GitHub file remains (manual deletion required)

## Security Notes

### Is my token safe?

- The token is stored in localStorage in your browser
- It's ONLY on your device - not sent anywhere except GitHub
- Use a dedicated token you can revoke anytime
- Don't share your token with anyone

### Can others see my data?

- If your repository is **private**: Only you can see it
- If your repository is **public**: Anyone can see the data file
- **Recommendation**: Use a private repository

### Revoking access

To stop GitHub sync completely:
1. Disable sync in the app settings
2. [Revoke the token](https://github.com/settings/tokens)
3. Optionally delete `mindfulness-data.json` from your repo

## Advanced Usage

### Using a specific branch

You can sync to a different branch:
1. Create a branch in your repo (e.g., `mindfulness-data`)
2. In app settings, set **Branch**: `mindfulness-data`
3. Your data file will be created/updated on that branch

### Backing up to multiple repos

You can manually configure different repos on different devices:
- Device 1: syncs to `repo1`
- Device 2: syncs to `repo2`

But this defeats the purpose of cross-device sync!

### Manual data recovery

If something goes wrong, your data is in GitHub:
1. Go to `https://github.com/YOUR_USERNAME/YOUR_REPO/blob/main/mindfulness-data.json`
2. Click **"Raw"**
3. Copy the JSON
4. In app console: `localStorage.setItem('mindfulness_entries', 'PASTE_JSON_HERE')`
5. Refresh the app

## Privacy & Compliance

- **Your data**: Stored in YOUR GitHub account
- **Your control**: You own the repository
- **Your privacy**: No third-party servers involved
- **Your security**: Encrypted in transit (HTTPS)
- **Your choice**: Turn it off anytime

## Questions?

- Data is always saved locally first (even without GitHub sync)
- GitHub sync is completely optional
- You can export `mindfulness-data.json` from GitHub anytime
- The app works perfectly fine without GitHub sync!

---

**Enjoy seamless cross-device mindfulness tracking! 🧘‍♂️**
