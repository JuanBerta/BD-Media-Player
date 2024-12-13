const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true, // Habilita Node.js en el proceso de renderizado (con precaución)
            contextIsolation: false, // Deshabilita el aislamiento de contexto (menos seguro)
        },
    });

    mainWindow.loadFile('index.html'); // Carga tu archivo index.html

    // Abre las herramientas de desarrollador (opcional)
    // mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});