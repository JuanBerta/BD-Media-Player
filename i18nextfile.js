import i18n from 'i18next';

const i18n = i18next.createInstance({
    lng: 'es',
    resources: {
        es: {
            translation: {
                seleccionar: 'Seleccionar Archivo',
                loop: 'Bucle',
                es: 'Español',
                en: 'Inglés'
            },
        },
        en: {
            translation: {
                seleccionar: 'Select File',
                loop: 'Loop',
                es: 'Spanish',
                en: 'English'
            },
        },
    },
});

i18n.init().then(() => {
    console.log("i18next inicializado");

    function updateContent(btnSeleccionarArchivos, btnLoop, esOption, enOption) {
        if (btnSeleccionarArchivos) {
            btnSeleccionarArchivos.textContent = i18n.t('seleccionar');
        }
        if (btnLoop) {
            btnLoop.textContent = i18n.t('loop');
        }
        if (esOption) {
            esOption.textContent = i18n.t('es');
        }
        if (enOption) {
            enOption.textContent = i18n.t('en');
        }
    }

    function cambiarIdioma(lang, btnSeleccionarArchivos, btnLoop, esOption, enOption) {
        i18n.changeLanguage(lang)
            .then(() => {
                updateContent(btnSeleccionarArchivos, btnLoop, esOption, enOption);
            })
            .catch(error => console.error("Error al cambiar idioma:", error));

    }

    document.addEventListener('DOMContentLoaded', () => {
        const idiomaSelector = document.getElementById('idiomaSelector');
        const esOption = document.getElementById('esOption');
        const enOption = document.getElementById('enOption');
        const btnLoop = document.getElementById('btnLoop');
        const btnSeleccionarArchivos = document.getElementById('btnSeleccionarArchivos');

        updateContent(btnSeleccionarArchivos, btnLoop, esOption, enOption);

        idiomaSelector.addEventListener('change', () => {
            cambiarIdioma(idiomaSelector.value, btnSeleccionarArchivos, btnLoop, esOption, enOption);
        });
    });
});