// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args)
    // We are only exposing 'invoke' for now as it's all that's needed.
    // If other ipcRenderer methods like 'on' or 'send' were needed,
    // they would be exposed here as well.
});
console.log('Preload script executed, electronAPI exposed.'); // For verification
