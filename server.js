const { exec, spawn } = require('child_process');
const os = require('os');
const path = require('path');

const port = 8080; // Cambia a otro puerto disponible, por ejemplo, 8080, 3000, etc.
const indexFile = path.join(__dirname, 'index.html'); // Asegura que se abra index.html

function startServer() {
    let serverProcess;

    if (os.platform() === 'win32') {
        serverProcess = spawn('python', ['-m', 'http.server', port]);
    } else {
        serverProcess = spawn('python3', ['-m', 'http.server', port]);
    }

    serverProcess.stderr.on('data', (data) => {
        console.error(`Server Error: ${data}`);
    });

    console.log(`Servidor iniciado en http://localhost:${port}`);

    return serverProcess;
}

function openBrowser() {
    let cmd;

    if (os.platform() === 'win32') {
        cmd = `start http://localhost:${port}/${path.basename(indexFile)}`;
    } else if (os.platform() === 'darwin') { // macOS
        cmd = `open http://localhost:${port}/${path.basename(indexFile)}`;
    } else { // Linux (y otros Unix)
        cmd = `xdg-open http://localhost:${port}/${path.basename(indexFile)}`;
    }

    exec(cmd, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error al abrir el navegador: ${error}`);
        }
    });
}

const server = startServer();
openBrowser();

// Manejo de cierre para limpiar el proceso del servidor.
process.on('SIGINT', () => {
    console.log('Deteniendo el servidor...');
    server.kill('SIGINT');
    process.exit();
});

process.on('exit', code => {
    console.log(`Acerca del servidor con código de salida: ${code}`);
});