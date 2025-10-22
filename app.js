// GitHub Storage Backend
class GitHubStorage {
    constructor() {
        this.token = localStorage.getItem('github_token') || '';
        this.repo = localStorage.getItem('github_repo') || '';
        this.owner = localStorage.getItem('github_owner') || '';
        this.branch = localStorage.getItem('github_branch') || 'main';
        this.dataFile = 'mindfulness-data.json';
        this.enabled = localStorage.getItem('github_sync_enabled') === 'true';
        this.lastSync = localStorage.getItem('last_sync') || null;
    }

    isConfigured() {
        return this.enabled && this.token && this.repo && this.owner;
    }

    configure(token, owner, repo, branch = 'main') {
        this.token = token;
        this.owner = owner;
        this.repo = repo;
        this.branch = branch;
        this.enabled = true;

        localStorage.setItem('github_token', token);
        localStorage.setItem('github_owner', owner);
        localStorage.setItem('github_repo', repo);
        localStorage.setItem('github_branch', branch);
        localStorage.setItem('github_sync_enabled', 'true');
    }

    disable() {
        this.enabled = false;
        localStorage.setItem('github_sync_enabled', 'false');
    }

    async fetchData() {
        if (!this.isConfigured()) {
            return null;
        }

        try {
            const url = `https://api.github.com/repos/${this.owner}/${this.repo}/contents/${this.dataFile}?ref=${this.branch}`;
            const response = await fetch(url, {
                headers: {
                    'Authorization': `token ${this.token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (response.status === 404) {
                // File doesn't exist yet, return empty data
                return { entries: [], sha: null };
            }

            if (!response.ok) {
                throw new Error(`GitHub API error: ${response.status}`);
            }

            const data = await response.json();
            const content = atob(data.content);
            const entries = JSON.parse(content);

            this.lastSync = new Date().toISOString();
            localStorage.setItem('last_sync', this.lastSync);

            return { entries, sha: data.sha };
        } catch (error) {
            console.error('Error fetching from GitHub:', error);
            return null;
        }
    }

    async saveData(entries, sha = null) {
        if (!this.isConfigured()) {
            return false;
        }

        try {
            const content = btoa(JSON.stringify(entries, null, 2));
            const url = `https://api.github.com/repos/${this.owner}/${this.repo}/contents/${this.dataFile}`;

            const body = {
                message: `Update mindfulness data - ${new Date().toISOString()}`,
                content: content,
                branch: this.branch
            };

            if (sha) {
                body.sha = sha;
            }

            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${this.token}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(`GitHub API error: ${response.status} - ${error.message}`);
            }

            this.lastSync = new Date().toISOString();
            localStorage.setItem('last_sync', this.lastSync);

            return true;
        } catch (error) {
            console.error('Error saving to GitHub:', error);
            return false;
        }
    }

    async testConnection() {
        if (!this.token || !this.owner || !this.repo) {
            return { success: false, error: 'Missing configuration' };
        }

        try {
            const url = `https://api.github.com/repos/${this.owner}/${this.repo}`;
            const response = await fetch(url, {
                headers: {
                    'Authorization': `token ${this.token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (!response.ok) {
                return { success: false, error: `API returned ${response.status}` };
            }

            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

// Enhanced Data Management with GitHub Sync
class DataManager {
    constructor() {
        this.githubStorage = new GitHubStorage();
        this.entries = [];
        this.currentEntry = null;
        this.sha = null; // GitHub file SHA for updates
        this.syncing = false;
        this.init();
    }

    async init() {
        // Always load from localStorage first (fast)
        this.entries = this.loadEntriesLocal();

        // If GitHub sync is enabled, try to sync
        if (this.githubStorage.isConfigured()) {
            await this.syncFromGitHub();
        }

        // Update UI after initialization
        if (window.app) {
            app.updateUI();
        }
    }

    loadEntriesLocal() {
        const data = localStorage.getItem('mindfulness_entries');
        return data ? JSON.parse(data) : [];
    }

    saveEntriesLocal() {
        localStorage.setItem('mindfulness_entries', JSON.stringify(this.entries));
    }

    async syncFromGitHub() {
        if (this.syncing || !this.githubStorage.isConfigured()) {
            return;
        }

        this.syncing = true;
        console.log('Syncing from GitHub...');

        const result = await this.githubStorage.fetchData();

        if (result) {
            // Merge entries: combine local and GitHub data
            const githubEntries = result.entries || [];
            const localEntries = this.entries;

            // Create a map of all entries by ID
            const entriesMap = new Map();

            // Add GitHub entries first (they're the source of truth)
            githubEntries.forEach(entry => {
                entriesMap.set(entry.id, entry);
            });

            // Add local entries (only if not already in GitHub or newer)
            localEntries.forEach(entry => {
                const existing = entriesMap.get(entry.id);
                if (!existing) {
                    entriesMap.set(entry.id, entry);
                }
            });

            // Update entries and save SHA
            this.entries = Array.from(entriesMap.values()).sort((a, b) =>
                new Date(b.date) - new Date(a.date)
            );
            this.sha = result.sha;

            // Save merged data locally
            this.saveEntriesLocal();

            console.log('Synced successfully from GitHub');
        }

        this.syncing = false;
    }

    async syncToGitHub() {
        if (!this.githubStorage.isConfigured()) {
            return false;
        }

        console.log('Syncing to GitHub...');
        const success = await this.githubStorage.saveData(this.entries, this.sha);

        if (success) {
            console.log('Synced successfully to GitHub');
            // Refresh to get new SHA
            await this.syncFromGitHub();
        }

        return success;
    }

    async saveEntries() {
        // Always save locally first
        this.saveEntriesLocal();

        // If GitHub sync is enabled, also save to GitHub
        if (this.githubStorage.isConfigured()) {
            await this.syncToGitHub();
        }
    }

    createEntry() {
        const entry = {
            id: Date.now() + Math.random(),
            date: new Date().toISOString(),
            complained: null,
            madeExcuses: null,
            tensedMuscles: null,
            hadFear: null
        };
        this.entries.unshift(entry);
        this.saveEntries();
        return entry;
    }

    updateEntry(entry) {
        const index = this.entries.findIndex(e => e.id === entry.id);
        if (index !== -1) {
            this.entries[index] = entry;
            this.saveEntries();
        }
    }

    deleteEntry(id) {
        this.entries = this.entries.filter(e => e.id !== id);
        this.saveEntries();
    }

    getTodayEntries() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return this.entries.filter(entry => {
            const entryDate = new Date(entry.date);
            entryDate.setHours(0, 0, 0, 0);
            return entryDate.getTime() === today.getTime();
        });
    }

    isEntryComplete(entry) {
        return entry.complained !== null &&
               entry.madeExcuses !== null &&
               entry.tensedMuscles !== null &&
               entry.hadFear !== null;
    }

    clearAllData() {
        if (confirm('Are you sure you want to delete all your data? This cannot be undone.')) {
            this.entries = [];
            this.saveEntries();
            if (window.app) {
                app.updateUI();
            }
        }
    }
}

// Notification Manager
class NotificationManager {
    constructor() {
        this.defaultTimes = [9, 13, 17, 21]; // 9 AM, 1 PM, 5 PM, 9 PM
        this.notificationTimes = this.loadNotificationTimes();
        this.checkPermission();
    }

    loadNotificationTimes() {
        const times = localStorage.getItem('notification_times');
        return times ? JSON.parse(times) : this.defaultTimes;
    }

    saveNotificationTimes() {
        localStorage.setItem('notification_times', JSON.stringify(this.notificationTimes));
    }

    async checkPermission() {
        if ('Notification' in window) {
            const permission = Notification.permission;
            const toggle = document.getElementById('notifications-toggle');
            if (toggle) {
                toggle.checked = permission === 'granted';
                this.updateNotificationUI(permission === 'granted');
            }
        }
    }

    async requestPermission() {
        if (!('Notification' in window)) {
            alert('This browser does not support notifications');
            return false;
        }

        const permission = await Notification.requestPermission();
        const granted = permission === 'granted';

        if (granted) {
            this.scheduleNotifications();
        }

        this.updateNotificationUI(granted);
        return granted;
    }

    updateNotificationUI(enabled) {
        const section = document.getElementById('notification-times-section');
        if (section) {
            section.style.display = enabled ? 'block' : 'none';
        }
        if (enabled) {
            this.displayCurrentTimes();
        }
    }

    displayCurrentTimes() {
        const container = document.getElementById('current-times');
        if (!container) return;

        container.innerHTML = '<p style="font-size: 0.85rem; color: var(--text-secondary); margin: 0.5rem 0;">Current reminders:</p>';
        this.notificationTimes.forEach(hour => {
            const p = document.createElement('p');
            p.textContent = this.formatHour(hour);
            p.style.padding = '0.35rem 0.5rem';
            container.appendChild(p);
        });
    }

    scheduleNotifications() {
        // Note: Web API doesn't support scheduling like native apps
        // We'll use a service worker to show notifications at intervals
        if ('serviceWorker' in navigator && 'Notification' in window) {
            this.registerServiceWorker();
        }
    }

    async registerServiceWorker() {
        try {
            const registration = await navigator.serviceWorker.register('sw.js');
            console.log('Service Worker registered');
        } catch (error) {
            console.log('Service Worker registration failed:', error);
        }
    }

    showNotification() {
        if (Notification.permission === 'granted') {
            new Notification('Mindfulness Check-In', {
                body: 'Time to reflect on your day. How are you doing?',
                icon: 'icon.svg',
                badge: 'icon.svg',
                tag: 'mindfulness-checkin',
                requireInteraction: false
            });
        }
    }

    formatHour(hour) {
        const period = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:00 ${period}`;
    }

    updateTimes(times) {
        this.notificationTimes = times.sort((a, b) => a - b);
        this.saveNotificationTimes();
        this.displayCurrentTimes();
        this.scheduleNotifications();
    }
}

// App Controller
class App {
    constructor() {
        this.dataManager = new DataManager();
        this.notificationManager = new NotificationManager();
        this.currentTab = 'home';
        this.deferredPrompt = null;

        this.initEventListeners();
        this.checkInstallability();
    }

    initEventListeners() {
        // Tab navigation
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.dataset.tab;
                this.switchTab(tabName);
            });
        });

        // New check-in button
        document.getElementById('new-checkin-btn').addEventListener('click', () => {
            this.openQuestionnaire();
        });

        // Questionnaire answer buttons
        document.querySelectorAll('.answer-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleAnswer(e.target);
            });
        });

        // Close questionnaire
        document.getElementById('close-questionnaire').addEventListener('click', () => {
            this.closeQuestionnaire();
        });

        // Settings
        document.getElementById('notifications-toggle').addEventListener('change', (e) => {
            this.handleNotificationToggle(e.target.checked);
        });

        document.getElementById('configure-times-btn').addEventListener('click', () => {
            this.openTimePicker();
        });

        document.getElementById('clear-data-btn').addEventListener('click', () => {
            this.dataManager.clearAllData();
        });

        // GitHub Sync
        const githubToggle = document.getElementById('github-sync-toggle');
        if (githubToggle) {
            githubToggle.addEventListener('change', (e) => {
                this.handleGitHubSyncToggle(e.target.checked);
            });
        }

        const configureGitHubBtn = document.getElementById('configure-github-btn');
        if (configureGitHubBtn) {
            configureGitHubBtn.addEventListener('click', () => {
                this.openGitHubConfig();
            });
        }

        const saveGitHubBtn = document.getElementById('save-github-config');
        if (saveGitHubBtn) {
            saveGitHubBtn.addEventListener('click', () => {
                this.saveGitHubConfig();
            });
        }

        const testGitHubBtn = document.getElementById('test-github-connection');
        if (testGitHubBtn) {
            testGitHubBtn.addEventListener('click', () => {
                this.testGitHubConnection();
            });
        }

        const syncNowBtn = document.getElementById('sync-now-btn');
        if (syncNowBtn) {
            syncNowBtn.addEventListener('click', () => {
                this.syncNow();
            });
        }

        const closeGitHubConfig = document.getElementById('close-github-config');
        if (closeGitHubConfig) {
            closeGitHubConfig.addEventListener('click', () => {
                this.closeGitHubConfig();
            });
        }

        // Time picker
        document.getElementById('close-time-picker').addEventListener('click', () => {
            this.closeTimePicker();
        });

        document.getElementById('save-times-btn').addEventListener('click', () => {
            this.saveNotificationTimes();
        });

        // Install button
        const installBtn = document.getElementById('install-btn');
        if (installBtn) {
            installBtn.addEventListener('click', () => {
                this.installApp();
            });
        }

        // Close modals on background click
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                }
            });
        });

        // PWA install prompt
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            this.updateInstallButton();
        });
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabName);
        });

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`).classList.add('active');

        this.currentTab = tabName;

        // Update content for the active tab
        if (tabName === 'home') {
            this.updateHomeTab();
        } else if (tabName === 'history') {
            this.updateHistoryTab();
        } else if (tabName === 'settings') {
            this.updateSettingsTab();
        }
    }

    updateUI() {
        this.updateHomeTab();
        this.updateHistoryTab();
        this.updateSettingsTab();
    }

    updateHomeTab() {
        const todayEntries = this.dataManager.getTodayEntries();
        const completedEntries = todayEntries.filter(e => this.dataManager.isEntryComplete(e));

        // Update stats
        const statsCard = document.getElementById('stats-card');
        if (todayEntries.length > 0) {
            statsCard.style.display = 'block';
            document.getElementById('today-checkins').textContent = todayEntries.length;
            document.getElementById('today-completed').textContent = completedEntries.length;
        } else {
            statsCard.style.display = 'none';
        }

        // Update today's entries list
        const container = document.getElementById('today-entries');
        if (todayEntries.length > 0) {
            container.innerHTML = '<h3>Today\'s Check-Ins</h3>';
            todayEntries.forEach(entry => {
                container.appendChild(this.createEntryElement(entry));
            });
        } else {
            container.innerHTML = '';
        }
    }

    updateHistoryTab() {
        const container = document.getElementById('history-list');

        if (this.dataManager.entries.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📅</div>
                    <h3>No entries yet</h3>
                    <p>Complete your first check-in to see your history</p>
                </div>
            `;
            return;
        }

        // Group entries by date
        const grouped = this.groupEntriesByDate();
        container.innerHTML = '';

        Object.keys(grouped).sort((a, b) => new Date(b) - new Date(a)).forEach(date => {
            const section = document.createElement('div');
            section.className = 'history-section';

            const header = document.createElement('div');
            header.className = 'history-section-header';
            header.textContent = this.formatDateHeader(new Date(date));
            section.appendChild(header);

            grouped[date].forEach(entry => {
                section.appendChild(this.createEntryElement(entry, true));
            });

            container.appendChild(section);
        });
    }

    updateSettingsTab() {
        document.getElementById('total-entries').textContent = this.dataManager.entries.length;

        // Update GitHub sync status
        const githubToggle = document.getElementById('github-sync-toggle');
        const githubSection = document.getElementById('github-config-section');
        const syncStatus = document.getElementById('sync-status');

        if (githubToggle) {
            githubToggle.checked = this.dataManager.githubStorage.isConfigured();
        }

        if (githubSection) {
            githubSection.style.display = this.dataManager.githubStorage.isConfigured() ? 'block' : 'none';
        }

        if (syncStatus && this.dataManager.githubStorage.lastSync) {
            const lastSync = new Date(this.dataManager.githubStorage.lastSync);
            syncStatus.textContent = `Last synced: ${lastSync.toLocaleString()}`;
        }
    }

    groupEntriesByDate() {
        const grouped = {};
        this.dataManager.entries.forEach(entry => {
            const date = new Date(entry.date);
            date.setHours(0, 0, 0, 0);
            const dateKey = date.toISOString();

            if (!grouped[dateKey]) {
                grouped[dateKey] = [];
            }
            grouped[dateKey].push(entry);
        });
        return grouped;
    }

    formatDateHeader(date) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const compareDate = new Date(date);
        compareDate.setHours(0, 0, 0, 0);

        if (compareDate.getTime() === today.getTime()) {
            return 'Today';
        } else if (compareDate.getTime() === yesterday.getTime()) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        }
    }

    createEntryElement(entry, showDelete = false) {
        const div = document.createElement('div');
        div.className = 'entry-row';

        const time = document.createElement('div');
        time.className = 'entry-time';
        time.textContent = new Date(entry.date).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit'
        });
        div.appendChild(time);

        if (this.dataManager.isEntryComplete(entry)) {
            const answers = document.createElement('div');
            answers.className = 'entry-answers';

            const questions = [
                { key: 'complained', icon: '💬', label: 'Complained' },
                { key: 'madeExcuses', icon: '🤷', label: 'Excuses' },
                { key: 'tensedMuscles', icon: '💪', label: 'Tensed' },
                { key: 'hadFear', icon: '😰', label: 'Fear' }
            ];

            questions.forEach(q => {
                const chip = document.createElement('div');
                chip.className = 'answer-chip';
                chip.innerHTML = `
                    <span>${q.icon}</span>
                    <span class="chip-label">${q.label}</span>
                    <span class="chip-icon">${entry[q.key] ? '❌' : '✅'}</span>
                `;
                answers.appendChild(chip);
            });

            div.appendChild(answers);
        } else {
            const incomplete = document.createElement('div');
            incomplete.className = 'incomplete-badge';
            incomplete.innerHTML = '⏱️ <span>Incomplete</span>';
            div.appendChild(incomplete);
        }

        return div;
    }

    openQuestionnaire() {
        this.dataManager.currentEntry = this.dataManager.createEntry();
        this.resetQuestionnaire();

        const date = new Date(this.dataManager.currentEntry.date);
        document.getElementById('checkin-date').textContent = date.toLocaleString('en-US', {
            dateStyle: 'long',
            timeStyle: 'short'
        });

        document.getElementById('questionnaire-modal').classList.add('active');
    }

    closeQuestionnaire() {
        document.getElementById('questionnaire-modal').classList.remove('active');
        this.updateUI();
    }

    resetQuestionnaire() {
        document.querySelectorAll('.answer-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        document.getElementById('completion-message').style.display = 'none';
    }

    handleAnswer(button) {
        const question = button.dataset.question;
        const answer = button.dataset.answer === 'true';

        // Update button states
        const questionCard = button.closest('.question-card');
        questionCard.querySelectorAll('.answer-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        button.classList.add('selected');

        // Update entry
        this.dataManager.currentEntry[question] = answer;
        this.dataManager.updateEntry(this.dataManager.currentEntry);

        // Check if complete
        if (this.dataManager.isEntryComplete(this.dataManager.currentEntry)) {
            document.getElementById('completion-message').style.display = 'block';

            // Auto-close after 2 seconds
            setTimeout(() => {
                this.closeQuestionnaire();
            }, 2000);
        }
    }

    async handleNotificationToggle(enabled) {
        if (enabled) {
            const granted = await this.notificationManager.requestPermission();
            if (!granted) {
                document.getElementById('notifications-toggle').checked = false;
            }
        } else {
            this.notificationManager.updateNotificationUI(false);
        }
    }

    handleGitHubSyncToggle(enabled) {
        if (enabled) {
            this.openGitHubConfig();
        } else {
            this.dataManager.githubStorage.disable();
            this.updateSettingsTab();
        }
    }

    openGitHubConfig() {
        // Pre-fill existing values
        document.getElementById('github-token').value = this.dataManager.githubStorage.token || '';
        document.getElementById('github-owner').value = this.dataManager.githubStorage.owner || '';
        document.getElementById('github-repo').value = this.dataManager.githubStorage.repo || '';
        document.getElementById('github-branch').value = this.dataManager.githubStorage.branch || 'main';

        document.getElementById('github-config-modal').classList.add('active');
    }

    closeGitHubConfig() {
        document.getElementById('github-config-modal').classList.remove('active');

        // Reset toggle if not configured
        const githubToggle = document.getElementById('github-sync-toggle');
        if (githubToggle && !this.dataManager.githubStorage.isConfigured()) {
            githubToggle.checked = false;
        }
    }

    async saveGitHubConfig() {
        const token = document.getElementById('github-token').value.trim();
        const owner = document.getElementById('github-owner').value.trim();
        const repo = document.getElementById('github-repo').value.trim();
        const branch = document.getElementById('github-branch').value.trim() || 'main';

        if (!token || !owner || !repo) {
            alert('Please fill in all required fields');
            return;
        }

        // Show loading
        const saveBtn = document.getElementById('save-github-config');
        const originalText = saveBtn.textContent;
        saveBtn.textContent = 'Testing...';
        saveBtn.disabled = true;

        // Test connection first
        this.dataManager.githubStorage.configure(token, owner, repo, branch);
        const test = await this.dataManager.githubStorage.testConnection();

        if (!test.success) {
            alert(`Failed to connect to GitHub: ${test.error}\n\nPlease check your settings and token permissions.`);
            saveBtn.textContent = originalText;
            saveBtn.disabled = false;
            return;
        }

        // Perform initial sync
        saveBtn.textContent = 'Syncing...';
        await this.dataManager.syncFromGitHub();
        await this.dataManager.syncToGitHub();

        saveBtn.textContent = originalText;
        saveBtn.disabled = false;

        alert('GitHub sync configured successfully!');
        this.closeGitHubConfig();
        this.updateSettingsTab();
        this.updateUI();
    }

    async testGitHubConnection() {
        const token = document.getElementById('github-token').value.trim();
        const owner = document.getElementById('github-owner').value.trim();
        const repo = document.getElementById('github-repo').value.trim();

        if (!token || !owner || !repo) {
            alert('Please fill in all fields first');
            return;
        }

        const testBtn = document.getElementById('test-github-connection');
        const originalText = testBtn.textContent;
        testBtn.textContent = 'Testing...';
        testBtn.disabled = true;

        const storage = new GitHubStorage();
        storage.configure(token, owner, repo, 'main');
        const result = await storage.testConnection();

        testBtn.textContent = originalText;
        testBtn.disabled = false;

        if (result.success) {
            alert('✅ Connection successful! Repository is accessible.');
        } else {
            alert(`❌ Connection failed: ${result.error}\n\nPlease check:\n- Token has correct permissions\n- Repository name is correct\n- Repository exists and is accessible`);
        }
    }

    async syncNow() {
        const btn = document.getElementById('sync-now-btn');
        const originalText = btn.textContent;
        btn.textContent = 'Syncing...';
        btn.disabled = true;

        await this.dataManager.syncFromGitHub();
        await this.dataManager.syncToGitHub();
        this.updateUI();

        btn.textContent = originalText;
        btn.disabled = false;

        alert('Sync complete!');
    }

    openTimePicker() {
        const container = document.getElementById('time-picker-list');
        container.innerHTML = '';

        for (let hour = 0; hour < 24; hour++) {
            const item = document.createElement('div');
            item.className = 'time-picker-item';

            const label = document.createElement('label');
            label.className = 'toggle-label';
            label.innerHTML = `
                <span>${this.notificationManager.formatHour(hour)}</span>
                <label class="toggle">
                    <input type="checkbox" data-hour="${hour}"
                           ${this.notificationManager.notificationTimes.includes(hour) ? 'checked' : ''}>
                    <span class="toggle-slider"></span>
                </label>
            `;

            item.appendChild(label);
            container.appendChild(item);
        }

        document.getElementById('time-picker-modal').classList.add('active');
    }

    closeTimePicker() {
        document.getElementById('time-picker-modal').classList.remove('active');
    }

    saveNotificationTimes() {
        const selected = [];
        document.querySelectorAll('#time-picker-list input[type="checkbox"]:checked').forEach(checkbox => {
            selected.push(parseInt(checkbox.dataset.hour));
        });

        if (selected.length === 0) {
            alert('Please select at least one notification time');
            return;
        }

        this.notificationManager.updateTimes(selected);
        this.closeTimePicker();
    }

    checkInstallability() {
        // Check if app is already installed
        if (window.matchMedia('(display-mode: standalone)').matches ||
            window.navigator.standalone === true) {
            // App is installed
            return;
        }

        // Show install instructions for iOS or manual install
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        const isAndroid = /Android/.test(navigator.userAgent);

        if (isIOS || isAndroid) {
            const installInstructions = document.getElementById('install-instructions');
            if (installInstructions) {
                installInstructions.style.display = 'block';
            }
        }
    }

    updateInstallButton() {
        const installBtn = document.getElementById('install-btn');
        if (this.deferredPrompt && installBtn) {
            installBtn.style.display = 'block';
        }
    }

    async installApp() {
        if (!this.deferredPrompt) {
            return;
        }

        this.deferredPrompt.prompt();
        const { outcome } = await this.deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            console.log('App installed');
        }

        this.deferredPrompt = null;
        const installBtn = document.getElementById('install-btn');
        if (installBtn) {
            installBtn.style.display = 'none';
        }
    }
}

// Initialize app when DOM is ready
let app;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        app = new App();
    });
} else {
    app = new App();
}

// Request notification permission at scheduled times
if ('Notification' in window && Notification.permission === 'granted') {
    // Check every hour if we should show a notification
    setInterval(() => {
        const notifManager = app?.notificationManager;
        if (notifManager) {
            const currentHour = new Date().getHours();
            const currentMinute = new Date().getMinutes();

            // Show notification at the top of the hour
            if (currentMinute === 0 && notifManager.notificationTimes.includes(currentHour)) {
                notifManager.showNotification();
            }
        }
    }, 60000); // Check every minute
}
