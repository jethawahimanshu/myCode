# 🎵 AI Song Generator

A complete AI-powered song generation website that creates **original lyrics** using **Anthropic Claude** and **instrumental music** using **Meta's MusicGen**.

## ✨ Features

- 🎼 **Full Song Generation**: Create complete songs from just a description
- 📝 **AI Lyrics**: Claude generates creative, structured lyrics (verse, chorus, bridge)
- 🎵 **AI Music**: MusicGen composes instrumental tracks to match your vision
- 💾 **Download Everything**: Get both music (WAV) and lyrics (TXT) files
- 🎨 **Beautiful UI**: Modern, responsive design with smooth animations
- 🔒 **Privacy First**: All API keys stored locally in your browser
- 🎛️ **Customizable**: Choose genre, mood, and music duration

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
- **Music AI**: Meta MusicGen (via Replicate API)
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

### Music Generation (MusicGen)

MusicGen creates:
- ✅ Instrumental track (no vocals)
- ✅ Matches the described style
- ✅ 10-30 second duration
- ✅ WAV format audio
- ✅ High quality output

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

### Duration Options
- 8 seconds (quick preview)
- 15 seconds (recommended)
- 30 seconds (longer track)

---

## 🔧 Troubleshooting

### "Claude API Error"
- **Check your API key** is correct (starts with `sk-ant-api03-`)
- **Check your account** has API credits
- **Check the console** for detailed error messages

### "MusicGen Model is Loading"
- **Wait 30-60 seconds** - The model needs to warm up on Replicate
- **Try again** - First request takes longer
- **Check your Replicate token** is correct

### "Music Generation Failed"
- **Replicate may be busy** - Try again in a few minutes
- **Check your description** - Make it more specific about music style
- **Reduce duration** - Shorter tracks generate faster (try 8 seconds)
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

### Replicate (MusicGen)
- **FREE credits** to start with
- ~$0.002 - $0.005 per generation after free credits
- Fast and reliable

**Total cost per song: ~$0.01 - $0.04**

Very affordable for creative projects! Replicate offers free credits when you sign up.

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

### Replicate (MusicGen)
- MusicGen Model: https://replicate.com/meta/musicgen
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
- ❌ Music is instrumental only (no singing)
- ❌ Music duration limited to 30 seconds max (for faster generation)
- ❌ MusicGen may take 30-120 seconds to generate
- ❌ Quality depends on model and prompt
- ❌ No real-time preview during generation
- ❌ Requires Replicate credits after free tier

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

- **Anthropic** - Claude AI for lyrics
- **Meta** - MusicGen model
- **Replicate** - MusicGen API hosting
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

**Made with ❤️ using Claude AI and MusicGen**

**Start creating your hit songs now! 🎵🚀**
