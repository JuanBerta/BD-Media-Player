const translations = {
    es: {
        seleccionar: 'Seleccionar Archivo',
        es: 'Español',
        en: 'Inglés',
        reproducir: 'Reproducir',
        pausar: 'Pausar',
        pantallaCompleta: 'Pantalla Completa'
    },
    en: {
        seleccionar: 'Select File',
        es: 'Spanish',
        en: 'English',
        reproducir: 'Play',
        pausar: 'Pause',
        pantallaCompleta: 'Fullscreen'
    }
};

let currentLanguage = 'es';

function translate(key) {
    return translations[currentLanguage][key] || key;
}

function updateContent() {
    const btnSeleccionarArchivos = document.getElementById('btnSeleccionarArchivos');
    const esOption = document.getElementById('esOption');
    const enOption = document.getElementById('enOption');
    const btnReproducir = document.getElementById('btnReproducir');
    const btnPantallaCompleta = document.getElementById('btnPantallaCompleta');

    if (btnSeleccionarArchivos) btnSeleccionarArchivos.textContent = translate('seleccionar');
    if (esOption) esOption.textContent = translate('es');
    if (enOption) enOption.textContent = translate('en');
    if (btnReproducir) btnReproducir.textContent = translate('reproducir');
    if (btnPantallaCompleta) btnPantallaCompleta.textContent = translate('pantallaCompleta');
}

document.addEventListener('DOMContentLoaded', () => {
    const idiomaSelector = document.getElementById('idiomaSelector');

    // ***** AQUI ESTABA EL ERROR PRINCIPAL *****
    // Se mueve la llamada a updateContent() *DENTRO* del evento load de la ventana.
    window.addEventListener('load', () => {
        updateContent(); // Asegura que los elementos existen en el DOM.
    });
    // *******************************************


    idiomaSelector.addEventListener('change', () => {
        cambiarIdioma(idiomaSelector.value);
    });
});

function cambiarIdioma(lang) {
    currentLanguage = lang;
    updateContent();
}