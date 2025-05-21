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

// SVG Icons - Refined to be more YouTube-like (ViewBox 24 24 for consistency)
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

var tipoArchivo
var mediaActivo
var nuevoMedia

btnSeleccionarArchivos.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    const tipoArchivo = file.type.split('/')[0];

    // 1. Determinar el NUEVO medio (antes de limpiar el anterior)
    let nuevoMedia;
    if (tipoArchivo === 'video') {
        nuevoMedia = video;
    } else if (tipoArchivo === 'audio') {
        nuevoMedia = audio;
    } else {
        console.error("Tipo de archivo no compatible.");
        URL.revokeObjectURL(url);
        return;
    }

    // 2. Limpiar el medio ACTIVO anterior (si existe)
    if (mediaActivo) {
        mediaActivo.pause();
        URL.revokeObjectURL(mediaActivo.src);
        mediaActivo.src = '';
        mediaActivo.removeEventListener('loadedmetadata', playOnLoad);
        mediaActivo.removeEventListener('timeupdate', actualizarTiempo);
        // Remove PiP listeners if they were added to the old mediaActivo
        if (mediaActivo.tagName === 'VIDEO') {
            mediaActivo.removeEventListener('enterpictureinpicture', handleEnterPiP);
            mediaActivo.removeEventListener('leavepictureinpicture', handleLeavePiP);
        }
    }

    // 3. Asignar el NUEVO medio como ACTIVO (DESPUÉS de limpiar el anterior)
    mediaActivo = nuevoMedia;

    // 4. Asignar la nueva fuente
    mediaActivo.src = url;

    //Reasignamos playOnLoad ANTES de adjuntar el listener para guardar la nueva referencia.
    playOnLoad = () => {
        mediaActivo.play();
        isPlaying = true;
        updatePlayButtonIcon();
        mediaActivo.removeEventListener('loadedmetadata', playOnLoad);
    };

    mediaActivo.addEventListener('loadedmetadata', playOnLoad);
    mediaActivo.addEventListener('timeupdate', actualizarTiempo);

    // Add PiP listeners for the new mediaActivo if it's a video
    if (mediaActivo.tagName === 'VIDEO') {
        mediaActivo.addEventListener('enterpictureinpicture', handleEnterPiP);
        mediaActivo.addEventListener('leavepictureinpicture', handleLeavePiP);
    }
});

// Función para manejar la carga y reproducción de archivos
function cargarArchivo(file) {
    const url = URL.createObjectURL(file);
    video.addEventListener('loadedmetadata', () => handleMetadataLoaded(video));
    audio.addEventListener('loadedmetadata', () => handleMetadataLoaded(audio));
    mediaActivo.src = url;
    mediaActivo.load();
    mediaActivo.play();
}

function esVideoOAudio(file) {
    if (!file.type) {
        const extension = file.name.split('.').pop().toLowerCase();
        if (['mp4', 'webm', 'ogg', 'mov'].includes(extension)) return 'video';
        if (['mp3', 'wav', 'ogg'].includes(extension)) return 'audio';
        return null;
    }

    if (file.type.startsWith('video/')) {
        return 'video';
    } else if (file.type.startsWith('audio/')) {
        return 'audio';
    } else {
        return null;
    }
}

let playOnLoad;       // Declarar playOnLoad fuera
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
        if (file.type.startsWith("audio/") || file.type.startsWith("video/")) { // Ajusta los tipos según sea necesario
            cargarArchivo(file);
        } else {
            console.warn(`El archivo ${file.name} no es compatible.`);
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

function handleMetadataLoaded(media) {
    mediaActivo = media;
    updatePlayButtonIcon();
    if (mediaActivo) {
        updatePlaybackSpeedUI(mediaActivo.playbackRate.toString());
        // Initialize PiP icon state
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
}

video.addEventListener('loadedmetadata', () => handleMetadataLoaded(video));
audio.addEventListener('loadedmetadata', () => handleMetadataLoaded(audio));

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

video.addEventListener('play', () => {
    isPlaying = true;
    updatePlayButtonIcon();
});

video.addEventListener('pause', () => {
    isPlaying = false;
    updatePlayButtonIcon();
});

audio.addEventListener('play', () => {
    isPlaying = true;
    updatePlayButtonIcon();
});

audio.addEventListener('pause', () => {
    isPlaying = false;
    updatePlayButtonIcon();
});

window.addEventListener('languageChanged', () => {
    // Text for buttons like "Seleccionar Archivo" is handled by i18n library.
    // Icons are language-independent, but play/pause state might need refresh
    // if it was reliant on translated text which is now an icon.
    // Calling updatePlayButtonIcon ensures the correct play/pause icon is shown.
    if (mediaActivo) {
        updatePlayButtonIcon();
    } else {
        // If no media is active, ensure play button shows 'play' icon
        btnReproducir.innerHTML = playIconSVG;
    }
});

//Ejemplo de inicializacion del controlVolumen:
controlVolumen.addEventListener("input", () => {
    mediaActivo.volume = controlVolumen.value;
});

barraProgreso.addEventListener('click', function (e) {
    let rect = barraProgreso.getBoundingClientRect();
    let posicion = (e.clientX - rect.left) / rect.width;
    mediaActivo.currentTime = posicion * mediaActivo.duration;
});

function actualizarTiempo() {
    if (isNaN(mediaActivo.duration)) return; //Para evitar errores al iniciar
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
    if (!mediaActivo || mediaActivo.tagName !== 'VIDEO') { // Only for video
        console.warn('Miniplayer is only available for video content.');
        return;
    }

    try {
        if (document.pictureInPictureElement) {
            await document.exitPictureInPicture();
        } else {
            if (document.pictureInPictureEnabled) {
                await mediaActivo.requestPictureInPicture();
            } else {
                console.warn('Picture-in-Picture is not enabled in this browser/document.');
            }
        }
    } catch (error) {
        console.error('Error handling Picture-in-Picture:', error);
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
    btnPantallaCompleta.innerHTML = document.fullscreenElement ? fullscreenExitIconSVG : fullscreenEnterIconSVG;
    btnPantallaCompleta.title = document.fullscreenElement ? (translate('exitFullscreen') + ' (f)') : (translate('fullscreen') + ' (f)');
    btnSettings.innerHTML = settingsIconSVG;
    btnSettings.title = translate('settings') + ' (s)';
    btnMiniplayer.innerHTML = miniplayerIconSVG;
    btnMiniplayer.title = translate('miniplayer') + ' (i)';

    // Initial tooltip for file select (static)
    btnSeleccionarArchivos.title = translate('openFile') + ' (o)';
}

// Call initialization
initializeIcons();
// Ensure tooltips are updated if language changes after initialization
window.addEventListener('languageChanged', () => {
    initializeIcons(); // Re-initialize to update all tooltips based on new language
    // Also update dynamic ones that depend on state
    updatePlayButtonIcon(); 
    if (mediaActivo) {
        toggleMute(); // Call to update mute button tooltip, but immediately toggle back to keep state
        toggleMute();
    }
});


video.addEventListener('ended', () => {
    if (bucle) {
        console.log('Video finalizado, reiniciando...');
        video.currentTime = 0;
        video.play();
    } else {
        console.log('Video finalizado, bucle desactivado');
    }
});

audio.addEventListener('ended', () => {
    if (bucle) {
        console.log('Video finalizado, reiniciando...');
        audio.currentTime = 0;
        audio.play();
    } else {
        console.log('Video finalizado, bucle desactivado');
    }
});