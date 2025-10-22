// API Configuration
class APIManager {
    constructor() {
        this.claudeKey = localStorage.getItem('claude_api_key') || '';
        this.hfKey = localStorage.getItem('hf_api_key') || '';
    }

    saveKeys(claudeKey, hfKey) {
        this.claudeKey = claudeKey;
        this.hfKey = hfKey;
        localStorage.setItem('claude_api_key', claudeKey);
        localStorage.setItem('hf_api_key', hfKey);
    }

    hasKeys() {
        return this.claudeKey && this.hfKey;
    }

    getClaudeKey() {
        return this.claudeKey;
    }

    getHFKey() {
        return this.hfKey;
    }
}

// Claude API Integration
class ClaudeAPI {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.endpoint = 'https://api.anthropic.com/v1/messages';
    }

    async generateLyrics(premise, genre, mood) {
        const prompt = this.buildPrompt(premise, genre, mood);

        try {
            const response = await fetch(this.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': this.apiKey,
                    'anthropic-version': '2023-06-01'
                },
                body: JSON.stringify({
                    model: 'claude-3-5-sonnet-20241022',
                    max_tokens: 2000,
                    messages: [{
                        role: 'user',
                        content: prompt
                    }]
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error?.message || 'Claude API error');
            }

            const data = await response.json();
            const text = data.content[0].text;

            return this.parseLyricsResponse(text);
        } catch (error) {
            console.error('Claude API Error:', error);
            throw error;
        }
    }

    buildPrompt(premise, genre, mood) {
        let prompt = `You are a professional songwriter. Create original song lyrics based on this description:\n\n${premise}\n\n`;

        if (genre) {
            prompt += `Genre: ${genre}\n`;
        }
        if (mood) {
            prompt += `Mood: ${mood}\n`;
        }

        prompt += `\nPlease provide:\n`;
        prompt += `1. A creative song title\n`;
        prompt += `2. Complete lyrics with the following structure:\n`;
        prompt += `   - Verse 1\n`;
        prompt += `   - Chorus\n`;
        prompt += `   - Verse 2\n`;
        prompt += `   - Chorus\n`;
        prompt += `   - Bridge (optional)\n`;
        prompt += `   - Final Chorus\n`;
        prompt += `3. A brief description of the musical style and instrumentation\n`;
        prompt += `4. Suggested tempo (BPM) and key\n\n`;
        prompt += `Format your response as JSON with these fields:\n`;
        prompt += `{\n`;
        prompt += `  "title": "Song Title",\n`;
        prompt += `  "lyrics": "Full lyrics with [Verse 1], [Chorus], etc. labels",\n`;
        prompt += `  "musicDescription": "Description of the musical style",\n`;
        prompt += `  "tempo": "120 BPM",\n`;
        prompt += `  "key": "C Major"\n`;
        prompt += `}`;

        return prompt;
    }

    parseLyricsResponse(text) {
        try {
            // Try to extract JSON from the response
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                return parsed;
            }

            // Fallback: parse text format
            return {
                title: this.extractTitle(text),
                lyrics: this.extractLyrics(text),
                musicDescription: this.extractMusicDescription(text),
                tempo: '120 BPM',
                key: 'C Major'
            };
        } catch (error) {
            console.error('Parse error:', error);
            // Return raw text as fallback
            return {
                title: 'Untitled Song',
                lyrics: text,
                musicDescription: 'Original composition',
                tempo: '120 BPM',
                key: 'C Major'
            };
        }
    }

    extractTitle(text) {
        const titleMatch = text.match(/(?:title|Title):\s*"?([^"\n]+)"?/i);
        return titleMatch ? titleMatch[1] : 'Untitled Song';
    }

    extractLyrics(text) {
        // Try to find lyrics section
        const lyricsMatch = text.match(/(?:lyrics|Lyrics):\s*"?([\s\S]*?)(?:"\s*,|\n\n)/i);
        if (lyricsMatch) {
            return lyricsMatch[1].trim();
        }

        // Return cleaned text
        return text.replace(/\{|\}|"title":|"lyrics":/gi, '').trim();
    }

    extractMusicDescription(text) {
        const descMatch = text.match(/(?:musicDescription|Music Description):\s*"?([^"\n]+)"?/i);
        return descMatch ? descMatch[1] : 'Original composition';
    }
}

// MusicGen API Integration (via Hugging Face)
class MusicGenAPI {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.endpoint = 'https://api-inference.huggingface.co/models/facebook/musicgen-small';
    }

    async generateMusic(description, duration = 20) {
        const inputs = this.buildMusicPrompt(description, duration);

        try {
            const response = await fetch(this.endpoint, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    inputs: inputs,
                    parameters: {
                        max_new_tokens: Math.floor(duration * 50) // Approximate tokens for duration
                    }
                })
            });

            if (!response.ok) {
                const error = await response.text();
                console.error('MusicGen Error Response:', error);

                // Check if model is loading
                if (response.status === 503) {
                    throw new Error('Model is loading. Please wait 30 seconds and try again.');
                }

                throw new Error(`MusicGen API error: ${response.status}`);
            }

            // Response is audio blob
            const audioBlob = await response.blob();
            return audioBlob;
        } catch (error) {
            console.error('MusicGen API Error:', error);
            throw error;
        }
    }

    buildMusicPrompt(songData, duration) {
        let prompt = '';

        if (songData.musicDescription) {
            prompt = songData.musicDescription;
        } else {
            prompt = 'A melodic instrumental track';
        }

        // Add tempo and mood info
        if (songData.tempo) {
            prompt += ` with a tempo of ${songData.tempo}`;
        }

        return prompt;
    }
}

// Main App Controller
class SongGeneratorApp {
    constructor() {
        this.apiManager = new APIManager();
        this.currentSong = null;
        this.initializeUI();
        this.attachEventListeners();
    }

    initializeUI() {
        // Check if API keys are already saved
        if (this.apiManager.hasKeys()) {
            document.getElementById('claude-api-key').value = this.apiManager.getClaudeKey();
            document.getElementById('hf-api-key').value = this.apiManager.getHFKey();
            this.showGeneratorSection();
        }
    }

    attachEventListeners() {
        // Save API keys
        document.getElementById('save-keys').addEventListener('click', () => {
            this.saveAPIKeys();
        });

        // Generate song
        document.getElementById('generate-btn').addEventListener('click', () => {
            this.generateSong();
        });

        // Copy lyrics
        document.getElementById('copy-lyrics').addEventListener('click', () => {
            this.copyLyrics();
        });

        // Download music
        document.getElementById('download-music').addEventListener('click', () => {
            this.downloadMusic();
        });

        // Download lyrics
        document.getElementById('download-lyrics').addEventListener('click', () => {
            this.downloadLyrics();
        });

        // Generate another
        document.getElementById('generate-another').addEventListener('click', () => {
            this.resetGenerator();
        });
    }

    saveAPIKeys() {
        const claudeKey = document.getElementById('claude-api-key').value.trim();
        const hfKey = document.getElementById('hf-api-key').value.trim();

        if (!claudeKey || !hfKey) {
            alert('Please enter both API keys');
            return;
        }

        this.apiManager.saveKeys(claudeKey, hfKey);
        this.showGeneratorSection();
        alert('API keys saved! Ready to generate songs.');
    }

    showGeneratorSection() {
        document.getElementById('api-setup').style.display = 'none';
        document.getElementById('generator-section').style.display = 'block';
    }

    async generateSong() {
        const premise = document.getElementById('song-premise').value.trim();
        if (!premise) {
            alert('Please describe your song idea');
            return;
        }

        const genre = document.getElementById('genre').value;
        const mood = document.getElementById('mood').value;
        const duration = parseInt(document.getElementById('duration').value);

        // Disable button
        const generateBtn = document.getElementById('generate-btn');
        generateBtn.disabled = true;
        generateBtn.textContent = '🎵 Generating...';

        // Show progress
        document.getElementById('progress-section').style.display = 'block';
        document.getElementById('results-section').style.display = 'none';

        try {
            // Step 1: Generate lyrics with Claude
            await this.generateLyrics(premise, genre, mood);

            // Step 2: Generate music with MusicGen
            await this.generateMusic(duration);

            // Show results
            this.showResults();

        } catch (error) {
            alert('Error generating song: ' + error.message);
            console.error(error);
        } finally {
            generateBtn.disabled = false;
            generateBtn.textContent = '🎼 Generate Song';
        }
    }

    async generateLyrics(premise, genre, mood) {
        const lyricsIcon = document.getElementById('lyrics-icon');
        const lyricsStatus = document.getElementById('lyrics-status');

        lyricsIcon.textContent = '⏳';
        lyricsIcon.classList.add('loading');
        lyricsStatus.textContent = 'Claude is writing your song...';

        try {
            const claudeAPI = new ClaudeAPI(this.apiManager.getClaudeKey());
            this.currentSong = await claudeAPI.generateLyrics(premise, genre, mood);

            lyricsIcon.textContent = '✅';
            lyricsIcon.classList.remove('loading');
            lyricsIcon.classList.add('success');
            lyricsStatus.textContent = 'Lyrics generated successfully!';

        } catch (error) {
            lyricsIcon.textContent = '❌';
            lyricsIcon.classList.remove('loading');
            lyricsStatus.textContent = 'Failed to generate lyrics';
            throw error;
        }
    }

    async generateMusic(duration) {
        const musicIcon = document.getElementById('music-icon');
        const musicStatus = document.getElementById('music-status');

        musicIcon.textContent = '⏳';
        musicIcon.classList.add('loading');
        musicStatus.textContent = 'MusicGen is composing your track... (this may take 30-60 seconds)';

        try {
            const musicGenAPI = new MusicGenAPI(this.apiManager.getHFKey());
            const audioBlob = await musicGenAPI.generateMusic(this.currentSong, duration);

            // Create URL for audio playback
            this.currentSong.audioBlob = audioBlob;
            this.currentSong.audioURL = URL.createObjectURL(audioBlob);

            musicIcon.textContent = '✅';
            musicIcon.classList.remove('loading');
            musicIcon.classList.add('success');
            musicStatus.textContent = 'Music generated successfully!';

        } catch (error) {
            musicIcon.textContent = '❌';
            musicIcon.classList.remove('loading');
            musicStatus.textContent = 'Failed to generate music: ' + error.message;
            throw error;
        }
    }

    showResults() {
        // Hide progress
        document.getElementById('progress-section').style.display = 'none';

        // Show results
        document.getElementById('results-section').style.display = 'block';

        // Update song info
        document.getElementById('song-title').textContent = this.currentSong.title;
        document.getElementById('song-metadata').textContent =
            `${this.currentSong.musicDescription} • ${this.currentSong.tempo} • ${this.currentSong.key}`;

        // Update lyrics
        document.getElementById('lyrics-display').textContent = this.currentSong.lyrics;

        // Update audio player
        const audioPlayer = document.getElementById('music-player');
        audioPlayer.src = this.currentSong.audioURL;

        // Scroll to results
        document.getElementById('results-section').scrollIntoView({ behavior: 'smooth' });
    }

    copyLyrics() {
        const lyrics = this.currentSong.lyrics;
        navigator.clipboard.writeText(lyrics).then(() => {
            const btn = document.getElementById('copy-lyrics');
            const originalText = btn.textContent;
            btn.textContent = '✅ Copied!';
            setTimeout(() => {
                btn.textContent = originalText;
            }, 2000);
        });
    }

    downloadMusic() {
        if (!this.currentSong.audioBlob) return;

        const url = this.currentSong.audioURL;
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.currentSong.title.replace(/[^a-z0-9]/gi, '_')}.wav`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    downloadLyrics() {
        const lyrics = `${this.currentSong.title}\n\n${this.currentSong.lyrics}\n\n---\n${this.currentSong.musicDescription}\n${this.currentSong.tempo} • ${this.currentSong.key}`;

        const blob = new Blob([lyrics], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.currentSong.title.replace(/[^a-z0-9]/gi, '_')}_lyrics.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    resetGenerator() {
        document.getElementById('song-premise').value = '';
        document.getElementById('results-section').style.display = 'none';
        document.getElementById('song-premise').focus();
    }
}

// Initialize app
let app;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        app = new SongGeneratorApp();
    });
} else {
    app = new SongGeneratorApp();
}
