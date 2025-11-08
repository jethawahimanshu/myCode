# 🎵 AI Song Generator

A complete AI-powered song generation website that creates **original lyrics** using **Anthropic Claude** and **full songs with singing vocals** using **MiniMax Music-1.5**.

## ✨ Features

- 🎤 **Complete Songs with Vocals**: Generate full songs with AI singing voices (up to 4 minutes!)
- 📝 **AI Lyrics**: Claude generates creative, structured lyrics (verse, chorus, bridge)
- 🎵 **AI Music & Vocals**: MiniMax Music-1.5 creates instrumental music + natural singing vocals
- 💾 **Download Everything**: Get both music (WAV) and lyrics (TXT) files
- 🎨 **Beautiful UI**: Modern, responsive design with smooth animations
- 🔒 **Privacy First**: All API keys stored locally in your browser
- 🎛️ **Customizable**: Choose genre, mood, and vocal style

---

## 🚀 Quick Start

### Step 1: Get Your API Keys

#### Claude API Key (Anthropic)
1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Sign up / Log in
3. Go to **API Keys** section
4. Click **"Create Key"**
5. Copy your key (starts with `sk-ant-api03-...`)

#### Replicate API Token
1. Go to [Replicate](https://replicate.com/account/api-tokens)
2. Sign up / Log in (free credits included!)
3. Copy your default token or create a new one
4. Copy your token (starts with `r8_...`)

**Note:** Replicate offers free credits to start with, perfect for testing!

### Step 2: Deploy to Netlify

**This app requires Netlify to work** (it uses serverless functions to proxy API calls and avoid CORS issues).

#### Deployment Steps:

1. **Push to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Add song generator"
   git push
   ```

2. **Deploy to Netlify**:
   - Go to [Netlify](https://app.netlify.com/)
   - Click **"Add new site"** → **"Import an existing project"**
   - Choose **GitHub** and select your repository
   - Configure build settings:
     - **Base directory**: `song-generator`
     - **Build command**: (leave empty)
     - **Publish directory**: `.`
   - Click **"Deploy site"**

3. **Your app will be live!**
   - Netlify will give you a URL like: `https://your-app.netlify.app`
   - The serverless functions will automatically deploy too

#### Local Development (Optional):

To test locally with Netlify functions:

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Navigate to song-generator folder
cd song-generator

# Run local dev server
netlify dev
```

Then open: `http://localhost:8888`

### Step 3: Configure API Keys

1. Open the app
2. Paste your Claude API key
3. Paste your Replicate token
4. Click **"Save Keys"**

Your keys are stored securely in browser localStorage.

### Step 4: Generate Your First Song!

1. Describe your song idea (be creative!)
2. Optionally select genre and mood
3. Choose music duration
4. Click **"Generate Song"**
5. Wait 30-90 seconds
6. Download and enjoy!

---

## 🎨 How It Works

### Architecture

```
User Input
    ↓
Claude API → Generates lyrics, structure, metadata
    ↓
MusicGen API → Generates instrumental music
    ↓
Complete Song (Lyrics + Music)
    ↓
Download as WAV + TXT
```

### Technologies Used

- **Frontend**: Pure HTML, CSS, JavaScript (no frameworks!)
- **Backend**: Netlify Serverless Functions
- **Lyrics AI**: Anthropic Claude 3.5 Sonnet
- **Music & Vocals AI**: MiniMax Music-1.5 (via Replicate API)
- **Styling**: Modern CSS with gradients and animations
- **Storage**: Browser localStorage for API keys

---

## 💡 Usage Examples

### Example 1: Pop Song
**Description:**
> "An upbeat pop song about summer love at the beach, with catchy hooks and cheerful vibes"

**Result:**
- Lyrics with beach/summer imagery
- Upbeat instrumental track
- Pop song structure

### Example 2: Melancholic Indie
**Description:**
> "A sad indie rock ballad about lost friendship, with poetic metaphors and slow tempo"

**Result:**
- Deep, emotional lyrics
- Slow, atmospheric music
- Indie rock vibe

### Example 3: Let AI Decide
**Description:**
> "A song about overcoming challenges"

**Result:**
- AI chooses appropriate genre
- AI sets the mood
- Complete creative freedom

---

## 📋 Features Breakdown

### Lyrics Generation (Claude API)

Claude generates:
- ✅ Original song title
- ✅ Structured lyrics (Verse, Chorus, Bridge)
- ✅ Musical style description
- ✅ Suggested tempo and key
- ✅ Poetic and creative language
- ✅ Proper song structure

### Music & Vocal Generation (MiniMax Music-1.5)

MiniMax Music-1.5 creates:
- ✅ Complete songs with natural singing vocals
- ✅ Instrumental accompaniment
- ✅ Matches the described style and genre
- ✅ Up to 4 minutes (240 seconds) duration
- ✅ WAV format audio
- ✅ Studio-quality output with rich instrumentation

### Download Options

- 🎵 **Music**: Download as WAV file
- 📝 **Lyrics**: Download as TXT file
- 📋 **Copy**: Copy lyrics to clipboard

---

## ⚙️ Configuration Options

### Genre Options
- Pop
- Rock
- Indie
- Electronic
- Jazz
- Blues
- Country
- Hip Hop
- Classical
- Folk
- *Or let AI decide*

### Mood Options
- Happy
- Sad
- Energetic
- Calm
- Romantic
- Dark
- Uplifting
- Melancholic
- *Or let AI decide*

### Song Length
- Automatically generates songs up to 4 minutes (240 seconds)
- Length depends on lyrics and song structure
- Complete songs with all sections (intro, verse, chorus, bridge, outro)

---

## 🔧 Troubleshooting

### "Claude API Error"
- **Check your API key** is correct (starts with `sk-ant-api03-`)
- **Check your account** has API credits
- **Check the console** for detailed error messages

### "Music Generation is Taking Too Long"
- **Wait 1-2 minutes** - MiniMax Music-1.5 generates complete songs with vocals
- **Try again** - First request may take longer as model warms up
- **Check your Replicate token** is correct

### "Music Generation Failed"
- **Replicate may be busy** - Try again in a few minutes
- **Check your lyrics** - Make sure Claude generated proper lyrics
- **Simplify genre/mood** - Try more common genres like "pop" or "rock"
- **Check credits** - Make sure you have Replicate credits available

### "No Audio Plays"
- **Check browser compatibility** - Chrome, Firefox, Safari work best
- **Check browser console** for audio format errors
- **Try downloading** the file and playing locally

---

## 💰 Cost Estimate

### Claude API
- ~$0.01 - $0.03 per song
- Uses Claude 3.5 Sonnet
- Pay per token

### Replicate (MiniMax Music-1.5)
- **FREE credits** to start with
- ~$0.05 - $0.15 per song (depending on length) after free credits
- Generates complete songs with vocals
- Worth it for studio-quality output!

**Total cost per song: ~$0.06 - $0.18**

Still very affordable for creative projects! Replicate offers free credits when you sign up.

---

## 🎯 Best Practices

### For Better Lyrics
- ✅ Be specific about emotions and themes
- ✅ Mention specific imagery or metaphors
- ✅ Specify the narrative (story arc)
- ✅ Include desired tone (serious, playful, etc.)

### For Better Music
- ✅ Describe instrumentation (guitar, piano, drums)
- ✅ Mention musical references ("like The Beatles")
- ✅ Specify energy level (calm, energetic, etc.)
- ✅ Include tempo preferences (slow, fast, medium)

### Example of Good Prompt
> "A dreamy indie-pop song about stargazing with someone special, featuring soft acoustic guitar and ethereal synths, with a slow tempo around 80 BPM, romantic and nostalgic mood, lyrics should use celestial metaphors"

---

## 🔐 Privacy & Security

### Your Data
- ✅ API keys stored **locally** in your browser
- ✅ Never sent to any server except official APIs
- ✅ No tracking or analytics
- ✅ No account required

### API Keys
- Stored in browser `localStorage`
- Only you can access them
- Not shared with anyone
- Clear browser data to remove

### Generated Content
- Lyrics and music are temporarily stored in browser memory
- Cleared when you close the tab
- Downloads are saved to your device
- You own all generated content

---

## 🚀 Advanced Usage

### Deploying to Production

#### GitHub Pages
```bash
git add song-generator/
git commit -m "Add AI song generator"
git push
```
Then enable GitHub Pages for the repo.

#### Netlify
1. Drag `song-generator` folder to Netlify
2. Instant deployment
3. Get custom URL

#### Your Own Server
Just upload the files - pure static HTML!

### Customization

#### Change Color Scheme
Edit `styles.css`:
```css
:root {
    --primary: #8B5CF6; /* Change this */
    --secondary: #EC4899; /* And this */
}
```

#### Adjust Music Duration Limits
Edit `app.js`, line with duration options:
```javascript
<option value="60">60 seconds</option>
```

#### Change Claude Model
Edit `app.js`, line in ClaudeAPI class:
```javascript
model: 'claude-3-5-haiku-20241022' // Cheaper, faster
```

---

## 📚 API Documentation

### Claude API
- Docs: https://docs.anthropic.com/
- Models: https://docs.anthropic.com/claude/docs/models-overview
- Pricing: https://www.anthropic.com/pricing

### Replicate (MiniMax Music-1.5)
- MiniMax Music-1.5 Model: https://replicate.com/minimax/music-1.5
- API Docs: https://replicate.com/docs
- Pricing: https://replicate.com/pricing

---

## 🎼 Sample Songs

Try these prompts for inspiration:

### Prompt 1: Road Trip Anthem
> "An energetic rock song about a cross-country road trip with friends, featuring electric guitars and driving drums, lyrics about freedom and adventure"

### Prompt 2: Rainy Day Blues
> "A melancholic jazz-influenced song about loneliness on a rainy evening, with piano and soft drums, introspective and poetic lyrics"

### Prompt 3: Dance Party
> "An upbeat electronic dance track about celebrating life and dancing all night, energetic with synths and strong beat, fun and carefree lyrics"

---

## 🤝 Contributing

Want to improve this project?

Ideas:
- Add more music generation models
- Support longer song durations
- Add vocal synthesis
- Create playlist management
- Add social sharing
- Implement user accounts

---

## ⚠️ Limitations

### Current Limitations
- ⚠️ Song generation takes 1-2 minutes (worth the wait!)
- ⚠️ Maximum song length is 4 minutes (240 seconds)
- ⚠️ Vocal style depends on lyrics and genre (limited customization)
- ⚠️ Quality varies based on prompt complexity
- ⚠️ No real-time preview during generation
- ⚠️ Requires Replicate credits after free tier

### Workarounds
- Use generated lyrics with other vocal tools
- Generate multiple 30-second segments
- Be patient during generation
- Try different prompts if output isn't great

---

## 📝 License

This project is open source. Feel free to:
- ✅ Use it personally
- ✅ Modify it
- ✅ Share it
- ✅ Learn from it

Generated content (lyrics & music) belongs to **you**!

---

## 🎉 Credits

- **Anthropic** - Claude AI for lyrics generation
- **MiniMax** - Music-1.5 model for vocals & music
- **Replicate** - API hosting and infrastructure
- **Netlify** - Serverless functions hosting
- **You** - For creating amazing songs!

---

## 📧 Support

Having issues?
1. Check the Troubleshooting section above
2. Check browser console for errors (F12)
3. Verify your API keys are correct
4. Try the example prompts first

---

**Made with ❤️ using Claude AI and MiniMax Music-1.5**

**Start creating your hit songs with vocals now! 🎤🎵🚀**
