// Configuration
const UPDATE_INTERVAL = 3 * 60 * 60 * 1000; // 3 hours in milliseconds
const NEWS_COUNT = 3;

// DOM Elements
const newsContainer = document.getElementById('newsContainer');
const loadingIndicator = document.getElementById('loadingIndicator');
const errorContainer = document.getElementById('errorContainer');
const refreshBtn = document.getElementById('refreshBtn');
const lastUpdateEl = document.getElementById('lastUpdate');
const nextUpdateEl = document.getElementById('nextUpdate');

// State
let nextUpdateTimer = null;

// Initialize the app
async function init() {
    await fetchNews();
    setupAutoRefresh();
    setupRefreshButton();
}

// Fetch and display news
async function fetchNews() {
    try {
        showLoading();

        // Fetch top stories from Hacker News API
        const response = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');

        if (!response.ok) {
            throw new Error('Failed to fetch news');
        }

        const storyIds = await response.json();

        // Get the first 3 stories
        const topStoryIds = storyIds.slice(0, NEWS_COUNT);

        // Fetch details for each story
        const stories = await Promise.all(
            topStoryIds.map(id => fetchStoryDetails(id))
        );

        displayNews(stories);
        updateTimestamps();
        hideLoading();

    } catch (error) {
        console.error('Error fetching news:', error);
        showError();
    }
}

// Fetch individual story details
async function fetchStoryDetails(id) {
    const response = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);

    if (!response.ok) {
        throw new Error(`Failed to fetch story ${id}`);
    }

    return await response.json();
}

// Display news items
function displayNews(stories) {
    newsContainer.innerHTML = '';

    stories.forEach((story, index) => {
        if (!story) return;

        const newsItem = createNewsItem(story, index + 1);
        newsContainer.appendChild(newsItem);
    });
}

// Create a news item element
function createNewsItem(story, rank) {
    const article = document.createElement('article');
    article.className = 'news-item';

    const title = story.title || 'Untitled';
    const url = story.url || `https://news.ycombinator.com/item?id=${story.id}`;
    const author = story.by || 'Anonymous';
    const score = story.score || 0;
    const comments = story.descendants || 0;
    const time = story.time ? new Date(story.time * 1000) : new Date();

    article.innerHTML = `
        <div class="news-rank">${rank}</div>
        <h2 class="news-title">
            <a href="${url}" target="_blank" rel="noopener noreferrer">${escapeHtml(title)}</a>
        </h2>
        <div class="news-meta">
            <span class="meta-item">👤 ${escapeHtml(author)}</span>
            <span class="meta-item">⬆️ ${score} points</span>
            <span class="meta-item">💬 ${comments} comments</span>
            <span class="meta-item">🕒 ${formatTimeAgo(time)}</span>
        </div>
        <a href="https://news.ycombinator.com/item?id=${story.id}" target="_blank" rel="noopener noreferrer" class="news-link">
            View Discussion →
        </a>
    `;

    return article;
}

// Format time ago
function formatTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);

    const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60
    };

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
        const interval = Math.floor(seconds / secondsInUnit);
        if (interval >= 1) {
            return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`;
        }
    }

    return 'just now';
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Update timestamps
function updateTimestamps() {
    const now = new Date();
    lastUpdateEl.textContent = now.toLocaleString();

    const nextUpdate = new Date(now.getTime() + UPDATE_INTERVAL);
    nextUpdateEl.textContent = nextUpdate.toLocaleString();

    // Store last update time in localStorage
    localStorage.setItem('lastNewsUpdate', now.toISOString());
}

// Setup auto-refresh
function setupAutoRefresh() {
    // Clear existing timer if any
    if (nextUpdateTimer) {
        clearInterval(nextUpdateTimer);
    }

    // Set up new timer
    nextUpdateTimer = setInterval(() => {
        fetchNews();
    }, UPDATE_INTERVAL);

    // Check if we need to update based on last update time
    const lastUpdate = localStorage.getItem('lastNewsUpdate');
    if (lastUpdate) {
        const lastUpdateTime = new Date(lastUpdate);
        const timeSinceUpdate = Date.now() - lastUpdateTime.getTime();

        if (timeSinceUpdate >= UPDATE_INTERVAL) {
            // If more than 3 hours since last update, fetch immediately
            fetchNews();
        } else {
            // Otherwise, update the display timestamps
            const nextUpdate = new Date(lastUpdateTime.getTime() + UPDATE_INTERVAL);
            lastUpdateEl.textContent = lastUpdateTime.toLocaleString();
            nextUpdateEl.textContent = nextUpdate.toLocaleString();
        }
    }
}

// Setup refresh button
function setupRefreshButton() {
    refreshBtn.addEventListener('click', async () => {
        refreshBtn.disabled = true;
        await fetchNews();
        refreshBtn.disabled = false;
    });
}

// Show loading state
function showLoading() {
    loadingIndicator.style.display = 'block';
    newsContainer.style.display = 'none';
    errorContainer.style.display = 'none';
}

// Hide loading state
function hideLoading() {
    loadingIndicator.style.display = 'none';
    newsContainer.style.display = 'grid';
    errorContainer.style.display = 'none';
}

// Show error state
function showError() {
    loadingIndicator.style.display = 'none';
    newsContainer.style.display = 'none';
    errorContainer.style.display = 'block';
}

// Start the app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
