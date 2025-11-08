# Tech News Feed

A modern, responsive tech news feed that displays the top 3 stories from Hacker News, automatically updating every 3 hours.

## Features

- **Auto-refresh**: Automatically fetches new stories every 3 hours
- **Top 3 Stories**: Displays the most important tech news from Hacker News
- **Manual Refresh**: Refresh button to get latest news on demand
- **Responsive Design**: Works beautifully on desktop and mobile devices
- **Real-time Updates**: Shows last update time and next scheduled update
- **Persistent Tracking**: Remembers last update time using localStorage

## How It Works

The app uses the [Hacker News API](https://github.com/HackerNews/API) to fetch:
- Top story IDs
- Individual story details including title, author, score, and comments

## Technical Stack

- Pure HTML5, CSS3, and JavaScript (no frameworks required)
- Responsive grid layout
- Modern CSS animations and transitions
- LocalStorage for state persistence

## Usage

Simply open `index.html` in a web browser. The app will:
1. Automatically fetch the top 3 tech stories
2. Display them with rankings, scores, and comment counts
3. Auto-refresh every 3 hours
4. Allow manual refresh via the refresh button

## Files

- `index.html` - Main HTML structure
- `styles.css` - Responsive styling and animations
- `app.js` - Core functionality and API integration
- `README.md` - Documentation
