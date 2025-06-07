require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const jobRoutes = require('./routes/jobRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conexión a MongoDB (solo si no estamos en entorno de prueba con BD en memoria)
// jest.setup.js se encarga de la conexión en entorno de prueba.
if (process.env.NODE_ENV !== 'test') {
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bolsa_trabajo_oficios_refactored';
  mongoose.connect(MONGODB_URI)
    .then(() => console.log('MongoDB conectado exitosamente (app.js).'))
    .catch(err => {
      console.error('Error al conectar a MongoDB (app.js):', err.message);
    });
}


// Montar Rutas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API Backend funcionando correctamente! (desde app.js)');
});

module.exports = app;
