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
        btnReproducir.textContent = isPlaying ? translate('pausar') : translate('reproducir');
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
    } else {
        volumenAnterior = mediaActivo.volume;
        mediaActivo.muted = true;
        btnSilencio.classList.add('activo');
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

function updatePlayButtonText() {
    btnReproducir.textContent = isPlaying ? translate('pausar') : translate('reproducir');
}

function handleMetadataLoaded(media) {
    mediaActivo = media;
    isPlaying = !media.paused && !media.ended; // Usar el estado real del medio
    updatePlayButtonText();
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
    isPlaying = !mediaActivo.paused && !mediaActivo.ended; //Actualiza el estado real en cada click
    updatePlayButtonText();//Se actualiza el botón después de cada click.
});

video.addEventListener('play', () => {
    isPlaying = true;
    updatePlayButtonText();
});

video.addEventListener('pause', () => {
    isPlaying = false;
    updatePlayButtonText();
});

audio.addEventListener('play', () => {
    isPlaying = true;
    updatePlayButtonText();
});

audio.addEventListener('pause', () => {
    isPlaying = false;
    updatePlayButtonText();
});

window.addEventListener('languageChanged', () => {
    if (mediaActivo) handleMetadataLoaded(mediaActivo);// Se llama a handleMetadataLoaded para actualizar el estado despues del cambio de idioma.
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

    barraProgreso.style.background = `linear-gradient(to right, #04AA6D ${progreso}%, rgba(221, 221, 221, 0.5) ${progreso}%)`;
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
    btnLoop.classList.toggle('activo'); // Asegúrate de que 'activo' cambie el fondo
    console.log('Botón presionado, bucle:', bucle); // Verifica si el evento se dispara
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