const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');
const nodePath = require('path'); // Renamed to avoid conflict
const https = require('https'); // Added for YouTube API calls

let YOUTUBE_API_KEY = null;
try {
    YOUTUBE_API_KEY = require('./youtube_api_key.js');
    if (!YOUTUBE_API_KEY || typeof YOUTUBE_API_KEY !== 'string' || YOUTUBE_API_KEY === 'YOUR_ACTUAL_API_KEY') {
        console.warn('YouTube API Key is missing or invalid in youtube_api_key.js. Please create this file and add your key.');
        YOUTUBE_API_KEY = null; // Ensure it's null if invalid
    } else {
        console.log('YouTube API Key loaded successfully.');
    }
} catch (error) {
    console.warn('youtube_api_key.js file not found or error requiring it. YouTube search functionality will be disabled.');
    YOUTUBE_API_KEY = null;
}

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: false,    // More secure
            contextIsolation: true,    // More secure, enables contextBridge
            preload: nodePath.join(__dirname, 'preload.js') // Path to the preload script
            // enableRemoteModule: true // Removed as per instructions
        },
    });

    mainWindow.loadFile('index.html'); // Carga tu archivo index.html

    // Abre las herramientas de desarrollador (opcional)
    // mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
    createWindow();

    ipcMain.handle('get-folder-contents', async (event, filePath) => { // Changed folderPath to filePath
        if (!filePath || typeof filePath !== 'string') {
            return { error: 'Invalid file path provided.' };
        }
        try {
            const folderPath = nodePath.dirname(filePath); // Derive folderPath from filePath
            const allFilesInDir = fs.readdirSync(folderPath);
            const mediaExtensions = ['.mp4', '.webm', '.mov', '.mkv', '.avi', '.mp3', '.wav', '.ogg', '.flac', '.aac']; // Consistent list

            const files = allFilesInDir
                .map(f => {
                    const fullPath = nodePath.join(folderPath, f);
                    try {
                        const stat = fs.statSync(fullPath);
                        if (stat.isFile()) {
                            return { path: fullPath, name: f, isFile: true, ext: nodePath.extname(f).toLowerCase() };
                        }
                        return { path: fullPath, name: f, isFile: false }; // It's a directory or other
                    } catch (e) {
                        console.warn(`Could not stat file/folder ${fullPath}: ${e.message}`);
                        return null; // Error stating this specific item
                    }
                })
                .filter(f => f && f.isFile && mediaExtensions.includes(f.ext))
                .map(f => f.path) // We only need the full path of valid media files
                .sort((a, b) => a.localeCompare(b));

            return { files: files };
        } catch (error) {
            console.error('Error reading folder contents in main process:', error);
            return { error: error.message || 'Failed to read folder contents.' };
        }
    });

    ipcMain.handle('youtube-search', async (event, searchQuery) => {
        if (!YOUTUBE_API_KEY) {
            return { error: 'YouTube API Key is not configured on the server.' };
        }
        if (!searchQuery || typeof searchQuery !== 'string' || searchQuery.trim() === '') {
            return { error: 'Invalid search query provided.' };
        }

        const maxResults = 10; // Or make configurable
        const searchType = 'video,playlist'; // Search for both videos and playlists
        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(searchQuery)}&key=${YOUTUBE_API_KEY}&maxResults=${maxResults}&type=${searchType}`;

        return new Promise((resolve, reject) => {
            https.get(url, (res) => {
                let data = '';
                res.on('data', (chunk) => {
                    data += chunk;
                });
                res.on('end', () => {
                    try {
                        const parsedData = JSON.parse(data);
                        if (parsedData.error) {
                            console.error('YouTube API Error:', parsedData.error);
                            resolve({ error: parsedData.error.message || 'An error occurred with the YouTube API.' });
                            return;
                        }
                        // Process items to extract necessary info
                        const items = parsedData.items.map(item => ({
                            id: item.id.videoId || item.id.playlistId,
                            kind: item.id.kind, // 'youtube#video' or 'youtube#playlist'
                            title: item.snippet.title,
                            thumbnailUrl: item.snippet.thumbnails.default.url, // Or medium/high
                            channelTitle: item.snippet.channelTitle,
                            description: item.snippet.description
                        }));
                        resolve({ results: items });
                    } catch (e) {
                        console.error('Error parsing YouTube API response:', e);
                        resolve({ error: 'Failed to parse YouTube API response.' });
                    }
                });
            }).on('error', (err) => {
                console.error('Error making YouTube API request:', err);
                resolve({ error: 'Failed to make YouTube API request: ' + err.message });
            });
        });
    });

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});