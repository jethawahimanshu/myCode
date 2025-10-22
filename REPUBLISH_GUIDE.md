# How to Publish Your Mindfulness Tracker

## Quick Steps to Publish on GitHub Pages

### Step 1: Go to Your Repository Settings

1. Open your GitHub repository: **https://github.com/jethawahimanshu/myCode**
2. Click on **"Settings"** (top right, near the Code tab)
3. In the left sidebar, scroll down and click **"Pages"** (under "Code and automation")

### Step 2: Enable GitHub Pages

On the Pages settings screen:

1. **Source**: Select **"Deploy from a branch"**
2. **Branch**:
   - Click the dropdown that says "None"
   - Select **`claude/gh-pages-011CUMGtEMP2aeUNDHsjgiLo`**
3. **Folder**:
   - Click the dropdown next to the branch
   - Select **`/ (root)`**
4. Click **"Save"**

### Step 3: Wait for Deployment (1-2 minutes)

- GitHub will start building and deploying your site
- You'll see a message: "Your site is ready to be published at..."
- Refresh the page after 1-2 minutes

### Step 4: Your Site is Live!

Once deployed, your app will be available at:

**https://jethawahimanshu.github.io/myCode/**

---

## Visual Guide

Here's exactly what to select:

```
Settings > Pages >

Build and deployment
├─ Source: [Deploy from a branch]
└─ Branch:
    ├─ Branch: [claude/gh-pages-011CUMGtEMP2aeUNDHsjgiLo]
    └─ Folder: [/ (root)]

[Save]
```

---

## Checking Deployment Status

After clicking Save:

1. Stay on the Pages settings page
2. Refresh after 1-2 minutes
3. You'll see one of these messages:

   **✅ Success:**
   ```
   Your site is live at https://jethawahimanshu.github.io/myCode/
   ```

   **⏳ Building:**
   ```
   Your site is ready to be published at https://jethawahimanshu.github.io/myCode/
   ```
   (Wait 1-2 more minutes and refresh)

   **❌ Error:**
   - Check that you selected the correct branch
   - Make sure the branch exists (check repository branches)

---

## Troubleshooting

### "No branches found"

If you don't see `claude/gh-pages-011CUMGtEMP2aeUNDHsjgiLo` in the dropdown:

1. Go back to your repository main page
2. Click the branch dropdown (should say "main" or similar)
3. Look for `claude/gh-pages-011CUMGtEMP2aeUNDHsjgiLo`
4. If it's not there, run this command:

```bash
git checkout claude/gh-pages-011CUMGtEMP2aeUNDHsjgiLo
git push -u origin claude/gh-pages-011CUMGtEMP2aeUNDHsjgiLo
```

### "404 - Page not found" after deployment

1. Wait 2-3 minutes (deployment can take time)
2. Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
3. Try incognito/private browsing mode
4. Check the branch has the files: Go to the branch on GitHub and verify you see `index.html`, `app.js`, etc.

### Changed the repository name?

If you renamed your repository, the URL will change:
- New URL format: `https://jethawahimanshu.github.io/NEW-REPO-NAME/`

---

## Alternative: Using a Different Branch

If you want to use a different branch for deployment:

### Option A: Use your development branch
1. In Pages settings, select: `claude/create-daily-mindfulness-tracker-011CUMGtEMP2aeUNDHsjgiLo`
2. Folder: `/ (root)` or `/webapp` (if you want to deploy from the webapp folder)
3. Save

### Option B: Create a new gh-pages branch from main
```bash
git checkout -b gh-pages
cp -r webapp/* .
rm -rf MindfulnessTracker webapp
git add -A
git commit -m "Deploy to GitHub Pages"
git push -u origin gh-pages
```
Then in Pages settings, select `gh-pages` branch.

---

## FREE Alternative Hosting Options

If GitHub Pages isn't working, here are other free options:

### 1. Netlify (Easiest!)

**Deploy via Drag & Drop:**
1. Go to [netlify.com](https://netlify.com)
2. Sign up (free)
3. Click "Add new site" > "Deploy manually"
4. Drag your `webapp` folder to the upload area
5. Get instant URL: `https://your-app.netlify.app`

**Deploy via GitHub:**
1. Go to [netlify.com](https://netlify.com)
2. Click "Add new site" > "Import an existing project"
3. Connect GitHub
4. Select `jethawahimanshu/myCode`
5. Branch: `claude/gh-pages-011CUMGtEMP2aeUNDHsjgiLo`
6. Publish directory: `/` (root)
7. Deploy!

### 2. Vercel

```bash
npm install -g vercel
cd webapp
vercel --prod
```

You'll get a URL like: `https://mindfulness-tracker.vercel.app`

### 3. Cloudflare Pages

1. Go to [pages.cloudflare.com](https://pages.cloudflare.com)
2. Sign up (free)
3. Connect GitHub repository
4. Select branch: `claude/gh-pages-011CUMGtEMP2aeUNDHsjgiLo`
5. Deploy!

### 4. Surge.sh (Super Fast!)

```bash
cd webapp
npx surge
```

Follow prompts and get instant URL!

---

## After Publishing

Once your site is live:

1. **Test it**: Visit the URL and make sure everything works
2. **Add to home screen**: Install it on your phone
3. **Enable notifications**: Grant permission in Settings
4. **Set up GitHub Sync** (optional): For cross-device sync

---

## Quick Reference

**Your Repository**: https://github.com/jethawahimanshu/myCode

**Settings**: https://github.com/jethawahimanshu/myCode/settings/pages

**Branch to Deploy**: `claude/gh-pages-011CUMGtEMP2aeUNDHsjgiLo`

**Your Site URL** (after publishing): https://jethawahimanshu.github.io/myCode/

---

Need help? The app is fully configured and ready to deploy - just enable GitHub Pages! 🚀
