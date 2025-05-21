const video = document.getElementById('video');
const audio = document.getElementById('audio');
const btnReproducir = document.getElementById('btnReproducir');
const btnSilencio = document.getElementById('btnSilencio');
const fileInput = document.getElementById('fileInput');
const btnSeleccionarArchivos = document.getElementById('btnSeleccionarArchivos');
const controlVolumen = document.getElementById('controlVolumen');
const barraProgreso = document.getElementById('barraProgreso');
const btnPantallaCompleta = document.getElementById('btnPantallaCompleta');
const selectorVelocidad = document.getElementById('selectorVelocidad');
const tiempo = document.getElementById('tiempo');
const btnLoop = document.getElementById('btnLoop');

// SVG Icons
const playIconSVG = '<svg viewBox="0 0 36 36" fill="currentColor"><path d="M 12,26 18.5,22 18.5,14 12,10 z M 18.5,22 25,18 25,18 18.5,14 z"></path></svg>';
const pauseIconSVG = '<svg viewBox="0 0 36 36" fill="currentColor"><path d="M 12,26 16,26 16,10 12,10 z M 21,26 25,26 25,10 21,10 z"></path></svg>';
const volumeHighIconSVG = '<svg viewBox="0 0 36 36" fill="currentColor"><path d="M8,21 L12,21 L17,26 L17,10 L12,15 L8,15 L8,21 Z M19,14 L19,22 C20.48,21.32 21.5,19.77 21.5,18 C21.5,16.23 20.48,14.68 19,14 ZM19,11.29 C21.89,12.15 24,14.83 24,18 C24,21.17 21.89,23.85 19,24.71 L19,26.77 C23.01,25.86 26,22.28 26,18 C26,13.72 23.01,10.14 19,9.23 L19,11.29 Z"></path></svg>';
const volumeMutedIconSVG = '<svg viewBox="0 0 36 36" fill="currentColor"><path d="M8,21 L12,21 L17,26 L17,10 L12,15 L8,15 L8,21 Z M24.71,15.98L22.91,14.18L20.85,16.24L18.79,14.18L16.99,15.98L19.05,18.04L16.99,20.10L18.79,21.90L20.85,19.84L22.91,21.90L24.71,20.10L22.65,18.04L24.71,15.98Z"></path></svg>';
const fullscreenEnterIconSVG = '<svg viewBox="0 0 36 36" fill="currentColor"><path d="m 10,16 2,0 0,-4 4,0 0,-2 L 10,10 l 0,6 0,0 z m 12,0 2,0 0,-6 -6,0 0,2 4,0 0,4 0,0 z m -12,8 2,0 0,4 -4,0 0,2 L 16,30 l 0,-6 -2,0 0,0 z m 16,0 0,6 -6,0 0,-2 4,0 0,-4 2,0 0,0 z"></path></svg>';
const loopIconSVG = '<svg viewBox="0 0 36 36" fill="currentColor"><path d="M20.95,10.05 C17.7,7.6 13.05,8.25 10.35,11.4 L7.5,8.55 L7.5,15.75 L14.7,15.75 L11.7,12.75 C13.65,10.95 16.6,10.5 18.95,11.85 L20.5,9.75 C20.63,9.83 20.78,9.93 20.95,10.05 Z M28.5,20.25 L21.3,20.25 L24.3,23.25 C22.35,25.05 19.4,25.5 17.05,24.15 L15.5,26.25 C15.37,26.17 15.22,26.07 15.05,25.95 C18.3,28.4 22.95,27.75 25.65,24.6 L28.5,27.45 L28.5,20.25 Z"></path></svg>';


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
        mediaActivo.removeEventListener('loadedmetadata', playOnLoad); // Usar playOnLoad declarada globalmente
        mediaActivo.removeEventListener('timeupdate', actualizarTiempo);
    }

    // 3. Asignar el NUEVO medio como ACTIVO (DESPUÉS de limpiar el anterior)
    mediaActivo = nuevoMedia;

    // 4. Asignar la nueva fuente
    mediaActivo.src = url;

    //Reasignamos playOnLoad ANTES de adjuntar el listener para guardar la nueva referencia.
    playOnLoad = () => {
        mediaActivo.play();
        // isPlaying will be true here, so set pause icon
        isPlaying = true; // Ensure isPlaying is set correctly before updating icon
        updatePlayButtonIcon();
        mediaActivo.removeEventListener('loadedmetadata', playOnLoad);
    };

    mediaActivo.addEventListener('loadedmetadata', playOnLoad);
    mediaActivo.addEventListener('timeupdate', actualizarTiempo);
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
    } else {
        volumenAnterior = mediaActivo.volume;
        mediaActivo.muted = true;
        btnSilencio.classList.add('activo');
        btnSilencio.innerHTML = volumeMutedIconSVG;
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
}

function handleMetadataLoaded(media) {
    mediaActivo = media;
    updatePlayButtonIcon(); // Update icon based on actual media state
}

video.addEventListener('loadedmetadata', () => handleMetadataLoaded(video));
audio.addEventListener('loadedmetadata', () => handleMetadataLoaded(audio));

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

selectorVelocidad.addEventListener('change', function () {
    mediaActivo.playbackRate = selectorVelocidad.value;
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
    btnLoop.innerHTML = loopIconSVG; // Loop icon is static, active state by class
    btnPantallaCompleta.innerHTML = fullscreenEnterIconSVG;
}

// Call initialization
initializeIcons();


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