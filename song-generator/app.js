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

// Claude API Integration (via Netlify Function)
class ClaudeAPI {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.endpoint = '/.netlify/functions/generate-lyrics';
    }

    async generateLyrics(premise, genre, mood) {
        try {
            const response = await fetch(this.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    apiKey: this.apiKey,
                    premise,
                    genre,
                    mood
                })
            });

            if (!response.ok) {
                // Read as text first (can only read body once)
                const text = await response.text();
                let error;
                try {
                    error = JSON.parse(text);
                } catch (e) {
                    error = { error: text || 'Claude API error' };
                }
                throw new Error(error.error || 'Claude API error');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Claude API Error:', error);
            throw error;
        }
    }
}

// MiniMax Music-1.5 API Integration (via Netlify Function)
class MusicGenAPI {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.endpoint = '/.netlify/functions/generate-music';
    }

    async generateMusic(songData, genre, mood) {
        try {
            const response = await fetch(this.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    apiKey: this.apiKey,
                    songData,
                    genre,
                    mood
                })
            });

            if (!response.ok) {
                // Read as text first (can only read body once)
                const text = await response.text();
                let error;
                try {
                    error = JSON.parse(text);
                } catch (e) {
                    error = { error: text || 'Music generation error' };
                }

                // Log the full error for debugging
                console.error('Music generation error:', error);

                // Extract the most detailed error message available
                const errorMsg = error.error || error.detail || error.message || text || 'Music generation error';
                throw new Error(errorMsg);
            }

            const data = await response.json();

            // Convert base64 to blob
            const binaryString = atob(data.audio);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            const audioBlob = new Blob([bytes], { type: data.contentType });

            return audioBlob;
        } catch (error) {
            console.error('Music Generation API Error:', error);
            throw error;
        }
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

            // Step 2: Generate complete song with vocals using MiniMax Music-1.5
            await this.generateMusic(genre, mood);

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

    async generateMusic(genre, mood) {
        const musicIcon = document.getElementById('music-icon');
        const musicStatus = document.getElementById('music-status');

        musicIcon.textContent = '⏳';
        musicIcon.classList.add('loading');
        musicStatus.textContent = 'MiniMax is generating your song with vocals... (this may take 1-2 minutes)';

        try {
            const musicGenAPI = new MusicGenAPI(this.apiManager.getHFKey());
            const audioBlob = await musicGenAPI.generateMusic(this.currentSong, genre, mood);

            // Create URL for audio playback
            this.currentSong.audioBlob = audioBlob;
            this.currentSong.audioURL = URL.createObjectURL(audioBlob);

            musicIcon.textContent = '✅';
            musicIcon.classList.remove('loading');
            musicIcon.classList.add('success');
            musicStatus.textContent = 'Complete song with vocals generated successfully!';

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
