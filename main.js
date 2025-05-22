const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');
const nodePath = require('path'); // Renamed to avoid conflict

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

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});