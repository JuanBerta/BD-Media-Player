// const fs = require('fs'); // Removed
// const path = require('path'); // Removed
const { ipcRenderer } = require('electron');

const video = document.getElementById('video');
const audio = document.getElementById('audio');
const btnReproducir = document.getElementById('btnReproducir');
const btnSilencio = document.getElementById('btnSilencio');
const fileInput = document.getElementById('fileInput');
const btnSeleccionarArchivos = document.getElementById('btnSeleccionarArchivos');
const controlVolumen = document.getElementById('controlVolumen');
const barraProgreso = document.getElementById('barraProgreso');
const btnPantallaCompleta = document.getElementById('btnPantallaCompleta');
// const selectorVelocidad = document.getElementById('selectorVelocidad'); // Removed
const tiempo = document.getElementById('tiempo');
const btnLoop = document.getElementById('btnLoop');
const btnSettings = document.getElementById('btnSettings');
const settingsMenu = document.getElementById('settingsMenu');
const playbackSpeedOptionsContainer = document.getElementById('playbackSpeedOptions');
const btnMiniplayer = document.getElementById('btnMiniplayer');
const btnReplay = document.getElementById('btnReplay');
const btnNextVideo = document.getElementById('btnNextVideo');
const notificationArea = document.getElementById('notificationArea');

let notificationTimeout = null; // To manage the timeout for hiding the message

// SVG Icons - Refined to be more YouTube-like (ViewBox 24 24 for consistency)
const nextVideoIconSVG = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"></path></svg>';
const replayIconSVG = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"></path></svg>';
const playIconSVG = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"></path></svg>';
const pauseIconSVG = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path></svg>';
const volumeHighIconSVG = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"></path></svg>';
const volumeMutedIconSVG = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"></path></svg>';
const fullscreenEnterIconSVG = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"></path></svg>';
const fullscreenExitIconSVG = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"></path></svg>';
const loopIconSVG = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"></path></svg>'; // Standard loop one arrow
const settingsIconSVG = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61.22l2 3.46c.13.22.07.49.12.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"></path></svg>';
const miniplayerIconSVG = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 7h-8v6h8V7zm2-4H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 14H3V5h18v12z"></path></svg>'; // More like YouTube's PiP
const miniplayerExitIconSVG = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 19V4H5v15h14zm-2-4h-2v-2h2v-2h-2V9h2V7h-2V5h2v11z"></path></svg>'; // Example: Could be an X or styled differently
const openFileIconSVG = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 4H4c-1.11 0-2 .89-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"></path></svg>';

var tipoArchivo; // This might become less relevant if we rely on extensions more
var mediaActivo;
var nuevoMedia; // This also might be simplified

// Playlist Variables
let currentFolderPath = null;
let currentPlaylistFromFolder = []; // Array of full file paths
let currentFileIndexInFolder = -1;
const mediaExtensions = ['.mp4', '.webm', '.mov', '.mkv', '.avi', // Video
                         '.mp3', '.wav', '.ogg', '.flac', '.aac']; // Audio

// Function to update the enabled/disabled state of Next/Previous buttons
function updateNextPrevButtonStates() {
    if (!currentPlaylistFromFolder || currentPlaylistFromFolder.length === 0) {
        // No playlist
        btnNextVideo.disabled = true;
        btnReplay.classList.remove('has-previous'); // No "previous" functionality
        // Update tooltip for btnReplay if it changes based on "previous" availability
        // btnReplay.title = translate('replayTooltipSingleOnly'); 
    } else if (currentPlaylistFromFolder.length === 1) {
        // Playlist with only one file
        btnNextVideo.disabled = true;
        btnReplay.classList.remove('has-previous');
        // btnReplay.title = translate('replayTooltipSingleOnly');
    } else {
        // Playlist exists and has more than one file
        if (currentFileIndexInFolder >= currentPlaylistFromFolder.length - 1) {
            btnNextVideo.disabled = true; // At the last file
        } else {
            btnNextVideo.disabled = false; // Not at the last file
        }

        if (currentFileIndexInFolder <= 0) {
            // At the first file, "previous" action is disabled (or would loop to end)
            btnReplay.classList.remove('has-previous');
            // btnReplay.title = translate('replayTooltipSingleOnly');
        } else {
            btnReplay.classList.add('has-previous');
            // btnReplay.title = translate('replayPrevTooltip'); // Or your combined tooltip
        }
    }
     // Default tooltips are set in initializeIcons, this function primarily handles disabled state
     // and the 'has-previous' class for styling.
     // If specific tooltip changes are needed for these states, they would be added here.
     // For now, ensure the original tooltip set in initializeIcons is appropriate for single replay
     // and the .has-previous class can be used if more specific styling for "prev" is desired.
}


// Double Click Logic for Replay Button
let replayClickTimeout = null;
let replayClickCount = 0;
const doubleClickDelay = 750; // milliseconds

// Plays a specific file path. Assumes playlist context (currentPlaylistFromFolder, currentFileIndexInFolder) is already set if applicable.
function playSpecificMediaFile(filePathToPlay) {
    if (!filePathToPlay) {
        showUIMessage(translate('errorNoFilePath'), 'error'); // Using translate for message
        console.warn("No file path provided to playSpecificMediaFile."); // Keep console for debugging
        return;
    }

    // 1. Determine media type and target element
    const tipo = esVideoOAudioPath(filePathToPlay);
    if (!tipo) {
        const simpleBasename = filePathToPlay.substring(filePathToPlay.lastIndexOf('/') + 1).substring(filePathToPlay.lastIndexOf('\\') + 1);
        showUIMessage(`${translate('errorFileTypeNotSupported')}: ${simpleBasename}`, 'error');
        if(mediaActivo) {
            mediaActivo.src = ''; 
            updatePlayButtonIcon(); 
            tiempo.textContent = "0:00 / 0:00";
            barraProgreso.style.background = `rgba(221, 221, 221, 0.5)`;
        }
        // Clear playlist if the current file is unplayable, as navigation might be broken
        // currentPlaylistFromFolder = []; // Consider if this is desired behavior or if we should just skip
        // currentFileIndexInFolder = -1;
        updateNextPrevButtonStates();
        return; 
    }
    let targetMediaElement = (tipo === 'video') ? video : audio;
    let otherMediaElement = (tipo === 'video') ? audio : video;

    // 2. Cleanup old media
    if (mediaActivo) {
        cleanupMediaEventListeners(mediaActivo);
        mediaActivo.pause();
        mediaActivo.src = ''; // Clear src of old mediaActivo
    }
    // Ensure the non-active element is also fully reset
    otherMediaElement.src = '';
    otherMediaElement.removeAttribute('src');

    // 3. Assign new media
    mediaActivo = targetMediaElement;
    mediaActivo.src = filePathToPlay; // Set src to the new file path
    
    setupMediaEventListeners(mediaActivo); // Add listeners
    mediaActivo.load(); // Load the new media
    mediaActivo.play().catch(e => console.warn("Error auto-playing media:", e)); // Play
}

// Sets up the playlist from a selected file's directory and then plays that file.
async function loadMediaAndSetupPlaylist(selectedFilePath, isInitialLoad = true) {
    if (!selectedFilePath) {
        console.warn("No file path provided to loadMediaAndSetupPlaylist.");
        currentPlaylistFromFolder = [];
        currentFileIndexInFolder = -1;
        // currentFolderPath = null; // Not directly available from renderer anymore
        updateNextPrevButtonStates(); // Update button states
        return;
    }

    if (isInitialLoad && selectedFilePath) { // Only if it's an initial load and we have a path
        try {
            console.log(`Requesting folder contents for file: ${selectedFilePath}`);
            const result = await window.electronAPI.invoke('get-folder-contents', selectedFilePath); // Use window.electronAPI

            if (result.error) {
                showUIMessage(`${translate('errorLoadingFolder')}: ${result.error}`, 'error'); // Already using showUIMessage
                console.error('Error getting folder contents via IPC:', result.error); // Keep console for debugging
                currentPlaylistFromFolder = [selectedFilePath]; // Fallback: playlist is just the selected file
                currentFileIndexInFolder = 0;
            } else {
                currentPlaylistFromFolder = result.files;
                currentFileIndexInFolder = currentPlaylistFromFolder.findIndex(p => p === selectedFilePath);
                if (currentFileIndexInFolder === -1 && currentPlaylistFromFolder.length > 0) { 
                    // If selected file somehow not in list (e.g. main process filter diff), add it or select first
                    console.warn("Selected file not found in playlist returned from main process. Selecting first file or adding.");
                    if (!currentPlaylistFromFolder.includes(selectedFilePath)) {
                         currentPlaylistFromFolder.unshift(selectedFilePath); // Add at beginning as a fallback
                         currentPlaylistFromFolder.sort((a,b) => a.localeCompare(b)); // Re-sort
                    }
                    currentFileIndexInFolder = currentPlaylistFromFolder.findIndex(p => p === selectedFilePath);
                    if (currentFileIndexInFolder === -1) currentFileIndexInFolder = 0; // Default to first if still not found
                } else if (currentPlaylistFromFolder.length === 0) { // If IPC returned empty list
                     currentPlaylistFromFolder = [selectedFilePath];
                     currentFileIndexInFolder = 0;
                }
            }
        } catch (ipcError) {
            showUIMessage(`${translate('errorIPC')} ${ipcError.message}`, 'error'); // Already using showUIMessage
            console.error('IPC invoke failed for get-folder-contents:', ipcError); // Keep console for debugging
            currentPlaylistFromFolder = [selectedFilePath]; // Fallback
            currentFileIndexInFolder = 0;
        }
        // console.log('Playlist from folder (via IPC):', currentPlaylistFromFolder);
        console.log('Current file index:', currentFileIndexInFolder);
        // currentFolderPath is now implicitly known by the main process, not stored here unless needed for other reasons
    } else if (!selectedFilePath && isInitialLoad) {
        // No path, clear playlist (e.g. if drag-drop didn't provide path AND no ObjectURL fallback handled it)
        currentPlaylistFromFolder = [];
        currentFileIndexInFolder = -1;
    }
    
    // Now play the selected file (which might be the initially selected one or one from an existing playlist)
    // Ensure selectedFilePath is valid for playSpecificMediaFile, especially if playlist logic failed
    const fileToPlay = (currentPlaylistFromFolder && currentPlaylistFromFolder[currentFileIndexInFolder]) || selectedFilePath;
    if (fileToPlay) {
        playSpecificMediaFile(fileToPlay);
    } else {
        console.error("No valid file to play after playlist setup attempt.");
    }
    updateNextPrevButtonStates(); // Update button states after playlist is set up
}


btnSeleccionarArchivos.addEventListener('click', () => {
    fileInput.click(); // Triggers the 'change' event below
});

fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.path) { // file.path is available in Electron
        loadMediaAndSetupPlaylist(file.path, true); // true for isInitialLoad
    } else {
        showUIMessage(translate('infoFilePathNotAvailable'), 'info', 5000); // Already using showUIMessage
        console.warn("File path not available from fileInput. Cannot create folder playlist. Loading as single file."); // Keep console for debugging
        // Fallback: Load the single file using Object URL (no playlist)
        const url = URL.createObjectURL(file);
        const tipo = esVideoOAudioType(file.type); // Use type for Object URL
        
        let targetMediaElement = (tipo === 'video') ? video : audio;
        let otherMediaElement = (tipo === 'video') ? audio : video;

        if (mediaActivo) {
            cleanupMediaEventListeners(mediaActivo);
            mediaActivo.pause();
            if (mediaActivo.src.startsWith('blob:')) URL.revokeObjectURL(mediaActivo.src);
            mediaActivo.src = '';
        }
        otherMediaElement.src = ''; 
        otherMediaElement.removeAttribute('src');
        
        mediaActivo = targetMediaElement;
        mediaActivo.src = url; // Keep using Object URL for this fallback
        setupMediaEventListeners(mediaActivo);
        mediaActivo.load();
        mediaActivo.play().catch(e => console.warn("Error auto-playing media (fallback):", e));

        currentPlaylistFromFolder = [];
        currentFileIndexInFolder = -1;
        currentFolderPath = null;
        updateNextPrevButtonStates(); // Update buttons for single file case
    }
    fileInput.value = ''; // Reset file input to allow selecting the same file again
});


// This function is now primarily for drag-and-drop, or if called directly elsewhere.
// It needs to be adapted for the new playlist logic if file.path is available.
function cargarArchivo(file) {
    if (file.path) { // If path is available (e.g. from certain drag-drop scenarios in Electron)
        loadMediaAndSetupPlaylist(file.path, true); // true for isInitialLoad
    } else { // Fallback for drag-drop if file.path is not available
        showUIMessage(translate('infoDragDropPathNotAvailable'), 'info', 5000); // Already using showUIMessage
        console.warn("File path not available from drag-and-drop. Loading as single file, no folder playlist."); // Keep console for debugging
        const url = URL.createObjectURL(file);
        const tipo = esVideoOAudioType(file.type);
        
        let targetMediaElement = (tipo === 'video') ? video : audio;
        let otherMediaElement = (tipo === 'video') ? audio : video;

        if (mediaActivo) {
            cleanupMediaEventListeners(mediaActivo);
            mediaActivo.pause();
            if (mediaActivo.src.startsWith('blob:')) URL.revokeObjectURL(mediaActivo.src);
            mediaActivo.src = '';
        }
        otherMediaElement.src = ''; 
        otherMediaElement.removeAttribute('src');

        mediaActivo = targetMediaElement;
        mediaActivo.src = url;
        setupMediaEventListeners(mediaActivo);
        mediaActivo.load();
        mediaActivo.play().catch(e => console.warn("Error auto-playing media (drag-drop fallback):", e));
        
        currentPlaylistFromFolder = [];
        currentFileIndexInFolder = -1;
        currentFolderPath = null;
        updateNextPrevButtonStates(); // Update buttons for single file case
    }
}


// Renamed to avoid confusion, using file path and extension
function esVideoOAudioPath(filePath) { // path module no longer available here
    if (!filePath) return null;
    // Basic extension extraction without path module
    const lastDot = filePath.lastIndexOf('.');
    if (lastDot === -1) return null; // No extension
    const extension = filePath.substring(lastDot).toLowerCase();
    
    if (['.mp4', '.webm', '.ogg', '.mov', '.mkv', '.avi'].includes(extension)) return 'video';
    if (['.mp3', '.wav', '.ogg', '.flac', '.aac'].includes(extension)) return 'audio';
    return null;
}

// New function to determine type from MIME type string, for fallback
function esVideoOAudioType(mimeType) {
    if (!mimeType) return null;
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    return null;
}


// let playOnLoad; // This global variable is no longer used by the refactored listener setup.
let volumenAnterior = 1;

btnSilencio.addEventListener('click', (event) => {
    toggleMute();
});

function toggleMute() {
    if (!mediaActivo) return;

    if (mediaActivo.muted) {
        mediaActivo.muted = false;
        mediaActivo.volume = volumenAnterior;
        btnSilencio.classList.remove('activo');
        btnSilencio.innerHTML = volumeHighIconSVG;
        btnSilencio.title = translate('mute') + ' (m)';
    } else {
        volumenAnterior = mediaActivo.volume;
        mediaActivo.muted = true;
        btnSilencio.classList.add('activo');
        btnSilencio.innerHTML = volumeMutedIconSVG;
        btnSilencio.title = translate('unmute') + ' (m)';
    }
}

window.addEventListener("dragover", function (e) {
    e.preventDefault(); // Esto es necesario para permitir la acción de drop
}, false);

window.addEventListener("dragover", function (e) {
    e.preventDefault(); // Permite la acción de drop
}, false);

window.addEventListener("drop", function (e) {
    e.preventDefault(); // Bloquea el comportamiento predeterminado del navegador

    const files = e.dataTransfer.files; // Obtiene los archivos arrastrados

    if (!files || files.length === 0) {
        console.warn("No se seleccionaron archivos.");
        return false;
    }

    for (let file of files) {
        const fileTypeForDrop = esVideoOAudioType(file.type); // Check type based on MIME
        if (fileTypeForDrop) { 
            cargarArchivo(file);
        } else {
            showUIMessage(`${translate('errorFileTypeNotSupported')}: ${file.name}`, 'error'); // Already using showUIMessage
            console.warn(`El archivo ${file.name} no es compatible.`); // Keep console for debugging
        }
    }

    return false;
}, false);

const handleAudioLoaded = () => {
    audio.play();
    btnReproducir.textContent = 'Pausar';
    audio.removeEventListener('loadedmetadata', handleAudioLoaded);
};

fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    cargarArchivo(file);
});

let isPlaying = false;

function updatePlayButtonIcon() {
    // Make sure mediaActivo exists before trying to check its state
    if (mediaActivo) {
        isPlaying = !mediaActivo.paused && !mediaActivo.ended;
    } else {
        isPlaying = false; // Default to not playing if no media
    }
    btnReproducir.innerHTML = isPlaying ? pauseIconSVG : playIconSVG;
    btnReproducir.title = isPlaying ? (translate('pause') + ' (k)') : (translate('play') + ' (k)');
}

function handleMetadataLoaded() { // Now specifically for mediaActivo
    if (!mediaActivo) return;
    updatePlayButtonIcon();
    updatePlaybackSpeedUI(mediaActivo.playbackRate.toString());
    if (mediaActivo.tagName === 'VIDEO') {
        if (document.pictureInPictureElement === mediaActivo) {
            btnMiniplayer.innerHTML = miniplayerExitIconSVG;
            btnMiniplayer.title = translate('exitMiniplayer');
        } else {
            btnMiniplayer.innerHTML = miniplayerIconSVG;
            btnMiniplayer.title = translate('miniplayer') + ' (i)';
        }
    }
}

// Centralized Event Handlers for mediaActivo
const onPlay = () => {
    if (!mediaActivo || event.target !== mediaActivo) return; // Ensure event is for current media
    isPlaying = true;
    updatePlayButtonIcon();
};

const onPause = () => {
    if (!mediaActivo || event.target !== mediaActivo) return; // Ensure event is for current media
    isPlaying = false;
    updatePlayButtonIcon();
};

const onEnded = () => {
    if (!mediaActivo || event.target !== mediaActivo) return; // Ensure event is for current media
    isPlaying = false;
    updatePlayButtonIcon();
    if (bucle) {
        mediaActivo.currentTime = 0;
        mediaActivo.play();
    }
};

// Placeholder for the new playOnLoad, to be attached dynamically
let currentPlayOnLoad; 

function setupMediaEventListeners(mediaElement) {
    // Define playOnLoad specific to this mediaElement instance
    currentPlayOnLoad = () => {
        // mediaElement.play(); // play() is called after load() in the main file input listener.
                             // Or, if not, it should be called here.
                             // For now, assuming play is handled by the main file load sequence.
        isPlaying = true; // Should be set by 'play' event, but can be pre-emptive
        updatePlayButtonIcon();
        mediaElement.removeEventListener('loadedmetadata', currentPlayOnLoad); // Self-removing
    };

    mediaElement.addEventListener('loadedmetadata', currentPlayOnLoad);
    mediaElement.addEventListener('timeupdate', actualizarTiempo); // actualizarTiempo needs to check mediaActivo
    mediaElement.addEventListener('play', onPlay);
    mediaElement.addEventListener('pause', onPause);
    mediaElement.addEventListener('ended', onEnded);
    if (mediaElement.tagName === 'VIDEO') {
        mediaElement.addEventListener('enterpictureinpicture', handleEnterPiP);
        mediaElement.addEventListener('leavepictureinpicture', handleLeavePiP);
    }
}

function cleanupMediaEventListeners(mediaElement) {
    if (currentPlayOnLoad) { // Ensure it was defined before trying to remove
        mediaElement.removeEventListener('loadedmetadata', currentPlayOnLoad);
    }
    mediaElement.removeEventListener('timeupdate', actualizarTiempo);
    mediaElement.removeEventListener('play', onPlay);
    mediaElement.removeEventListener('pause', onPause);
    mediaElement.removeEventListener('ended', onEnded);
    if (mediaElement.tagName === 'VIDEO') {
        mediaElement.removeEventListener('enterpictureinpicture', handleEnterPiP);
        mediaElement.removeEventListener('leavepictureinpicture', handleLeavePiP);
    }
}


// Fullscreen and PiP event handlers
document.addEventListener('fullscreenchange', () => {
    if (document.fullscreenElement) {
        btnPantallaCompleta.innerHTML = fullscreenExitIconSVG;
        btnPantallaCompleta.title = translate('exitFullscreen') + ' (f)';
    } else {
        btnPantallaCompleta.innerHTML = fullscreenEnterIconSVG;
        btnPantallaCompleta.title = translate('fullscreen') + ' (f)';
    }
});

const handleEnterPiP = () => {
    btnMiniplayer.innerHTML = miniplayerExitIconSVG;
    btnMiniplayer.title = translate('exitMiniplayer');
};

const handleLeavePiP = () => {
    btnMiniplayer.innerHTML = miniplayerIconSVG;
    btnMiniplayer.title = translate('miniplayer') + ' (i)';
};

btnReproducir.addEventListener('click', () => {
    if (!mediaActivo) return;

    if (isPlaying) {
        mediaActivo.pause();
    } else {
        mediaActivo.play();
    }
    // isPlaying state is determined by the actual media state after play/pause call
    // No need to manually set isPlaying here, event listeners for 'play' and 'pause' will handle it.
    // updatePlayButtonIcon will also be called by those event listeners.
});

// video.addEventListener('play', onPlay); // Now added in setupMediaEventListeners
// video.addEventListener('pause', onPause); // Now added in setupMediaEventListeners
// audio.addEventListener('play', onPlay); // Now added in setupMediaEventListeners
// audio.addEventListener('pause', onPause); // Now added in setupMediaEventListeners


window.addEventListener('languageChanged', () => {
    initializeIcons(); // Re-initialize to update all tooltips based on new language
    updatePlayButtonIcon(); // Update play/pause button tooltip and icon
    if (mediaActivo) {
        if (mediaActivo.muted) {
            btnSilencio.title = translate('unmute') + ' (m)';
        } else {
            btnSilencio.title = translate('mute') + ' (m)';
        }
        // Update fullscreen and PiP tooltips as well, as they might depend on language
        if (document.fullscreenElement === mediaActivo) { // Check if current media is fullscreen
             btnPantallaCompleta.title = translate('exitFullscreen') + ' (f)';
        } else {
             btnPantallaCompleta.title = translate('fullscreen') + ' (f)';
        }
        if (mediaActivo.tagName === 'VIDEO') {
            if (document.pictureInPictureElement === mediaActivo) {
                btnMiniplayer.title = translate('exitMiniplayer');
            } else {
                btnMiniplayer.title = translate('miniplayer') + ' (i)';
            }
        }
    } else {
         // If no media is active, ensure play button shows 'play' icon and default tooltips
        btnReproducir.innerHTML = playIconSVG;
        btnReproducir.title = translate('play') + ' (k)';
        // Other buttons would have their default titles from initializeIcons
    }
});

//Ejemplo de inicializacion del controlVolumen:
controlVolumen.addEventListener("input", () => {
    if (!mediaActivo) return;
    mediaActivo.volume = controlVolumen.value;
});

barraProgreso.addEventListener('click', function (e) {
    if (!mediaActivo || isNaN(mediaActivo.duration)) return;
    let rect = barraProgreso.getBoundingClientRect();
    let posicion = (e.clientX - rect.left) / rect.width;
    mediaActivo.currentTime = posicion * mediaActivo.duration;
});

function actualizarTiempo() { // Called by mediaActivo's timeupdate event
    if (!mediaActivo || isNaN(mediaActivo.duration)) {
        // Potentially clear the time display if no media or duration is NaN
        tiempo.textContent = "0:00 / 0:00";
        barraProgreso.style.background = `linear-gradient(to right, #FF0000 0%, rgba(221, 221, 221, 0.5) 0%)`;
        return;
    }
    let minutos = Math.floor(mediaActivo.currentTime / 60);
    let segundos = Math.floor(mediaActivo.currentTime % 60);
    let duracionMinutos = Math.floor(mediaActivo.duration / 60);
    let duracionSegundos = Math.floor(mediaActivo.duration % 60);
    let progreso = (mediaActivo.currentTime / mediaActivo.duration) * 100;

    barraProgreso.style.background = `linear-gradient(to right, #FF0000 ${progreso}%, rgba(221, 221, 221, 0.5) ${progreso}%)`; /* Updated to YouTube red */
    barraProgreso.style.left = `calc(${progreso}% - 7px)`; // Posiciona el círculo. 7px es la mitad del ancho.
    if (segundos < 10) {
        segundos = "0" + segundos;
    }
    if (duracionSegundos < 10) {
        duracionSegundos = "0" + duracionSegundos;
    }
    tiempo.textContent = minutos + ":" + segundos + " / " + duracionMinutos + ":" + duracionSegundos;

}

btnPantallaCompleta.addEventListener('click', function () {
    if (mediaActivo) {
        mediaActivo.requestFullscreen() ||
            mediaActivo.mozRequestFullScreen() ||
            mediaActivo.webkitRequestFullscreen() ||
            mediaActivo.msRequestFullscreen();
    }
});

// selectorVelocidad.addEventListener('change', function () { // Old listener, to be removed/replaced
//     mediaActivo.playbackRate = selectorVelocidad.value;
// });

btnMiniplayer.addEventListener('click', async () => {
    if (!mediaActivo || mediaActivo.tagName !== 'VIDEO') {
        showUIMessage(translate('infoMiniplayerOnlyVideo'), 'info'); // Already using showUIMessage
        console.warn('Miniplayer is only available for video content.'); // Keep console for debugging
        return;
    }

    try {
        if (document.pictureInPictureElement) {
            await document.exitPictureInPicture();
        } else {
            if (document.pictureInPictureEnabled) {
                await mediaActivo.requestPictureInPicture();
            } else {
                showUIMessage(translate('errorPipNotEnabled'), 'info', 4000); // Already using showUIMessage
                console.warn('Picture-in-Picture is not enabled in this browser/document.'); // Keep console for debugging
            }
        }
    } catch (error) {
        showUIMessage(`${translate('errorPip')} ${error.message}`, 'error'); // Already using showUIMessage
        console.error('Error handling Picture-in-Picture:', error); // Keep console for debugging
    }
});


// Settings Menu Toggle
btnSettings.addEventListener('click', (event) => {
    event.stopPropagation(); // Prevents click from immediately closing menu
    settingsMenu.style.display = settingsMenu.style.display === 'none' ? 'block' : 'none';
});

document.addEventListener('click', (event) => {
    if (settingsMenu && !settingsMenu.contains(event.target) && event.target !== btnSettings) {
        settingsMenu.style.display = 'none';
    }
});

// Playback Speed Logic
function updatePlaybackSpeedUI(newSpeed) {
    const currentActive = playbackSpeedOptionsContainer.querySelector('.settings-option.active');
    if (currentActive) {
        currentActive.classList.remove('active');
    }
    const newActiveOption = playbackSpeedOptionsContainer.querySelector(`.settings-option[data-value="${newSpeed}"]`);
    if (newActiveOption) {
        newActiveOption.classList.add('active');
    }
}

playbackSpeedOptionsContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('settings-option')) {
        const newSpeed = event.target.dataset.value;
        if (mediaActivo) {
            mediaActivo.playbackRate = newSpeed;
        }
        updatePlaybackSpeedUI(newSpeed);
        settingsMenu.style.display = 'none'; // Hide menu after selection
    }
});


// Suponiendo que mediaActivo es un elemento de video
let bucle = false;

btnLoop.addEventListener('click', () => {
    bucle = !bucle;
    btnLoop.classList.toggle('activo'); // CSS will handle the visual change for active state
    // Icon itself doesn't change, just its color via CSS .activo svg
    console.log('Botón presionado, bucle:', bucle);
});

function initializeIcons() {
    btnReproducir.innerHTML = playIconSVG;
    // Set initial volume icon based on current muted state (if mediaActivo exists) or default to high
    if (mediaActivo && mediaActivo.muted) {
        btnSilencio.innerHTML = volumeMutedIconSVG;
        btnSilencio.classList.add('activo');
    } else {
        btnSilencio.innerHTML = volumeHighIconSVG;
        btnSilencio.classList.remove('activo');
    }
    btnLoop.innerHTML = loopIconSVG;
    btnLoop.title = translate('loop') + ' (l)';
    btnPantallaCompleta.innerHTML = document.fullscreenElement ? fullscreenExitIconSVG : fullscreenEnterIconSVG; // Check global fullscreen state
    btnPantallaCompleta.title = (document.fullscreenElement ? translate('exitFullscreen') : translate('fullscreen')) + ' (f)';
    btnSettings.innerHTML = settingsIconSVG;
    btnSettings.title = translate('settings') + ' (s)';
    
    // PiP icon depends on video and its current PiP state
    if (mediaActivo && mediaActivo.tagName === 'VIDEO' && document.pictureInPictureElement === mediaActivo) {
        btnMiniplayer.innerHTML = miniplayerExitIconSVG;
        btnMiniplayer.title = translate('exitMiniplayer');
    } else {
        btnMiniplayer.innerHTML = miniplayerIconSVG;
        btnMiniplayer.title = translate('miniplayer') + ' (i)';
    }

    // Set icon and tooltip for file select
    btnSeleccionarArchivos.innerHTML = openFileIconSVG;
    btnSeleccionarArchivos.title = translate('openFileTooltip');

    // Set icon and tooltip for replay button
    // Set icon and tooltip for replay button
    btnReplay.innerHTML = replayIconSVG;
    btnReplay.title = translate('replayTooltip');

    // Set icon and tooltip for next video button
    btnNextVideo.innerHTML = nextVideoIconSVG;
    btnNextVideo.title = translate('nextVideoTooltip'); // Assuming 'nextVideoTooltip' maps to "Next (n)"
}

// Replay Button Functionality (with Double Click for Previous)
btnReplay.addEventListener('click', () => {
    replayClickCount++;

    if (replayClickTimeout) {
        clearTimeout(replayClickTimeout);
    }

    replayClickTimeout = setTimeout(() => {
        if (replayClickCount === 1) {
            // Single Click: Replay current media
            console.log("Replay: Single click - Replaying current media.");
            if (mediaActivo) {
                mediaActivo.currentTime = 0;
                if (mediaActivo.paused) {
                    mediaActivo.play();
                    // updatePlayButtonIcon() is called by 'onPlay' event
                }
            }
        } else if (replayClickCount >= 2) {
            // Double Click (or more): Play previous media
            console.log("Replay: Double click - Playing previous media.");
            if (currentPlaylistFromFolder && currentPlaylistFromFolder.length > 0 && currentFileIndexInFolder !== -1) {
                if (currentFileIndexInFolder > 0) {
                    currentFileIndexInFolder--;
                    const prevFilePath = currentPlaylistFromFolder[currentFileIndexInFolder];
                    console.log("Playing previous video:", prevFilePath);
            playSpecificMediaFile(prevFilePath); 
            updateNextPrevButtonStates(); 
                } else {
            showUIMessage(translate('infoFirstVideoInPlaylist'), 'info'); // Already using showUIMessage
            console.log("Already at the first video in the folder."); // Keep console for debugging
            updateNextPrevButtonStates(); 
                    if (mediaActivo) {
                         mediaActivo.currentTime = 0;
                         if (mediaActivo.paused) mediaActivo.play();
                    }
                }
            } else {
        showUIMessage(translate('infoNoPlaylistForPrevious'), 'info'); // Already using showUIMessage
        console.log("No folder playlist available or current file index is invalid for previous video. Replaying current."); // Keep console for debugging
         if (mediaActivo) { 
                    mediaActivo.currentTime = 0;
                    if (mediaActivo.paused) mediaActivo.play();
                }
            }
        }
        replayClickCount = 0; // Reset click count after action or timeout
    }, doubleClickDelay);
});

// Next Video Button Functionality
btnNextVideo.addEventListener('click', () => {
    // Original console.log for this button was for placeholder functionality, now it's for actual navigation or info.
    if (currentPlaylistFromFolder && currentPlaylistFromFolder.length > 0 && currentFileIndexInFolder !== -1) {
        if (currentFileIndexInFolder < currentPlaylistFromFolder.length - 1) {
            currentFileIndexInFolder++;
            const nextFilePath = currentPlaylistFromFolder[currentFileIndexInFolder];
            console.log("Playing next video:", nextFilePath); // Keep for debugging
            playSpecificMediaFile(nextFilePath); 
            updateNextPrevButtonStates(); 
        } else {
            showUIMessage(translate('infoLastVideoInPlaylist'), 'info'); // Already using showUIMessage
            console.log("Already at the last video in the folder."); // Keep for debugging
            updateNextPrevButtonStates(); 
            // Optional: Implement looping to the first video if desired by user.
            // if (bucle && currentPlaylistFromFolder.length > 0) { // Check against 'bucle' for loop playlist
            //     currentFileIndexInFolder = 0;
            //     playSpecificMediaFile(currentPlaylistFromFolder[currentFileIndexInFolder]);
            // }
        }
    } else {
        showUIMessage(translate('infoNoPlaylistAvailable'), 'info'); // Already using showUIMessage
        console.log("No folder playlist available or current file index is invalid."); // Keep for debugging
    }
});

// Call initialization
initializeIcons();
// The languageChanged listener was already updated in the previous step.

// video.addEventListener('ended', onEnded); // Now added in setupMediaEventListeners
// audio.addEventListener('ended', onEnded); // Now added in setupMediaEventListeners

// --- UI Message Function ---
function showUIMessage(message, type = 'info', duration = 3000) {
    if (!notificationArea) {
        console.warn('Notification area not found in DOM.');
        return;
    }

    notificationArea.textContent = message;
    // Reset classes to base and type-specific, then add 'show'
    notificationArea.className = 'notification-area'; // Reset
    notificationArea.classList.add(type); // 'info', 'error', or 'success'
    
    // Trigger reflow to ensure transition plays on new 'show'
    void notificationArea.offsetWidth; 

    notificationArea.classList.add('show');

    // Clear any existing timeout to prevent premature hiding
    if (notificationTimeout) {
        clearTimeout(notificationTimeout);
    }

    // Set a timeout to remove the 'show' class, triggering the fade-out
    notificationTimeout = setTimeout(() => {
        notificationArea.classList.remove('show');
        // The CSS transition will handle display:none after opacity fades out
    }, duration);
}

// Keyboard Shortcuts
document.addEventListener('keydown', (event) => {
    // Prevent shortcuts if typing in an input, select, or textarea (future-proofing)
    if (event.target.tagName === 'INPUT' || event.target.tagName === 'SELECT' || event.target.tagName === 'TEXTAREA') {
        // Allow specific keys if needed, e.g., Escape for inputs
        if (event.key === 'Escape') {
            // Potentially blur the focused element or other specific escape actions
        }
        return;
    }

    // Prevent default for spacebar if it's not a settings menu option or similar context
    if (event.key === ' ' && settingsMenu.style.display === 'none') {
        event.preventDefault();
    }

    switch (event.key.toLowerCase()) { // Use toLowerCase for case-insensitivity for letter keys
        case 'k':
        case ' ': // Spacebar
            btnReproducir.click();
            break;
        case 'm':
            btnSilencio.click();
            break;
        case 'l':
            btnLoop.click();
            break;
        case 's':
            btnSettings.click();
            break;
        case 'i':
            btnMiniplayer.click();
            break;
        case 'f':
            btnPantallaCompleta.click();
            break;
        case 'o':
            btnSeleccionarArchivos.click();
            break;
        case 'r':
            if (btnReplay) btnReplay.click(); // btnReplay might not exist if code is old
            break;
        case 'arrowright':
            if (mediaActivo) mediaActivo.currentTime += 5;
            break;
        case 'arrowleft':
            if (mediaActivo) mediaActivo.currentTime -= 5;
            break;
        case 'arrowup':
            if (mediaActivo) {
                let newVolume = Math.min(1, mediaActivo.volume + 0.1);
                mediaActivo.volume = newVolume;
                controlVolumen.value = newVolume;
                if (mediaActivo.muted && newVolume > 0) {
                    // toggleMute(); // Or btnSilencio.click();
                    // Direct state change to avoid repeated toggleMute logic if called rapidly
                    mediaActivo.muted = false;
                    btnSilencio.classList.remove('activo');
                    btnSilencio.innerHTML = volumeHighIconSVG;
                    btnSilencio.title = translate('mute') + ' (m)';
                }
            }
            break;
        case 'arrowdown':
            if (mediaActivo) {
                let newVolume = Math.max(0, mediaActivo.volume - 0.1);
                mediaActivo.volume = newVolume;
                controlVolumen.value = newVolume;
                if (newVolume === 0 && !mediaActivo.muted) {
                    // toggleMute(); // Or btnSilencio.click();
                    mediaActivo.muted = true;
                    volumenAnterior = 0; // Store 0 as previous volume when muted at 0
                    btnSilencio.classList.add('activo');
                    btnSilencio.innerHTML = volumeMutedIconSVG;
                    btnSilencio.title = translate('unmute') + ' (m)';
                }
            }
            break;
        // No default needed, allow other keys to function normally
    }
});