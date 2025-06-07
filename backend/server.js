const app = require('./app'); // Importar la app configurada

const PORT = process.env.PORT || 5000;

// Solo escuchar si no estamos en un entorno de prueba que importe 'app' directamente
// o si este script es el punto de entrada principal.
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Servidor backend (server.js) escuchando en el puerto ${PORT}`);
    });
} else {
    // console.log("server.js importado, no iniciando listen (esto es normal en pruebas).");
}
